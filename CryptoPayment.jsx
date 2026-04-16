'use client'

import { useState, useEffect, useRef } from 'react'
import { useAccount, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Wallet, CheckCircle2, AlertCircle, Loader2, ExternalLink, Coins } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/lib/stores/cartStore'
import { useAuth } from '@/components/providers/AuthProvider'
import {
  MBONE_TOKEN_ADDRESS,
  PAYMENT_PROCESSOR_ADDRESS,
  ERC20_ABI,
  PROCESSOR_ABI,
  usdToMBONE,
} from '@/lib/web3/config'
import { createPublicClient, http } from 'viem'
import { formatUnits } from 'viem'

type Step = 'connect' | 'approve' | 'pay' | 'confirming' | 'success' | 'error'

interface OrderData {
  orderId: string
  invoiceId: string
  orderHash: string
  totalMBONE: string
  totalUSD: number
  mbonePriceUsd: number
}

export function CryptoPayment() {
  const [step, setStep] = useState<Step>('connect')
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [mbonePrice, setMbonePrice] = useState<number>(0.25)
  const [approvalTxHash, setApprovalTxHash] = useState<`0x${string}` | undefined>()
  const [paymentTxHash, setPaymentTxHash] = useState<`0x${string}` | undefined>()
  const [error, setError] = useState<string>('')
  const [isCheckingBalance, setIsCheckingBalance] = useState(false)
  const [userMBONEBalance, setUserMBONEBalance] = useState<bigint>(0n)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  const { address, isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()

  // Two SEPARATE write hooks — fixes the stale txData bug
  const {
    writeContractAsync: approveAsync,
    isPending: isApprovePending,
  } = useWriteContract()

  const {
    writeContractAsync: payAsync,
    isPending: isPayPending,
  } = useWriteContract()

  // Watch approval tx
  const {
    isLoading: isApprovalLoading,
    isSuccess: isApprovalSuccess,
  } = useWaitForTransactionReceipt({ hash: approvalTxHash })

  // Watch payment tx
  const {
    isLoading: isPaymentLoading,
    isSuccess: isPaymentSuccess,
  } = useWaitForTransactionReceipt({ hash: paymentTxHash })

  const { items, clearCart, getTotalPrice } = useCartStore()
  const { user } = useAuth()

  const totalUSD = getTotalPrice()
  const totalMBONE = usdToMBONE(totalUSD, mbonePrice)

  // Stable public client ref — avoids recreation on every render
  const publicClient = useRef(
    createPublicClient({
      chain: sepolia,
      transport: http(
        process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.gateway.tenderly.co'
      ),
    })
  ).current

  useEffect(() => {
    fetchMbonePrice()
  }, [])

  // Fetch user's MBONE balance when address changes
  useEffect(() => {
    if (address && isConnected) {
      fetchUserMBONEBalance()
    }
  }, [address, isConnected])

  const fetchMbonePrice = async () => {
    try {
      const res = await fetch('/api/settings/mbone-price')
      const data = await res.json()
      if (res.ok) setMbonePrice(data.price)
    } catch (e) {
      console.error('Failed to fetch MBONE price:', e)
    }
  }

  const fetchUserMBONEBalance = async () => {
    if (!address) return

    setIsLoadingBalance(true)
    try {
      const balance = await publicClient.readContract({
        address: MBONE_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
      })
      setUserMBONEBalance(balance)
    } catch (error) {
      console.error('Failed to fetch MBONE balance:', error)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const isCorrectNetwork = chain?.id === sepolia.id

  // Approval confirmed → advance to pay
  useEffect(() => {
    if (!isApprovalSuccess || !approvalTxHash) return
    toast.success('MBONE spending approved!')
    setStep('pay')
  }, [isApprovalSuccess, approvalTxHash])

  // Payment confirmed → call verify-payment and show success
  useEffect(() => {
    if (!isPaymentSuccess || !paymentTxHash || !orderData) return

    const verifyPayment = async () => {
      try {
        const res = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.orderId,
            txHash: paymentTxHash,
            invoiceId: orderData.invoiceId,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          console.error('Payment verification failed:', data.error)
          toast.error(`Verification failed: ${data.error}`)
          // Don't block UX — payment IS confirmed on-chain
        } else {
          console.log('✅ Payment saved to Supabase:', data.order)
        }
      } catch (e) {
        console.error('Verify payment fetch error:', e)
      }

      // Always advance to success — tx is confirmed on-chain regardless
      setStep('success')
      clearCart()
      toast.success('Payment successful! Order confirmed.')
    }

    verifyPayment()
  }, [isPaymentSuccess, paymentTxHash, orderData])

  // Create order on backend + blockchain
  const createOrder = async () => {
    if (!address || !user) {
      toast.error('Please connect your wallet and sign in')
      return
    }

    // Check if user has enough balance
    if (userMBONEBalance < totalMBONE) {
      toast.error(`Insufficient MBONE balance. Need ${formatUnits(totalMBONE, 18)} MBONE`)
      return
    }

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: items,
          walletAddress: address,
          totalUSD,
          totalMBONE: totalMBONE.toString(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')

      setOrderData(data)
      setStep('approve')
      toast.success('Order created! Please approve MBONE spending')
    } catch (e: any) {
      setError(e.message)
      setStep('error')
      toast.error(e.message)
    }
  }

  // Token approve
  const approveToken = async () => {
    if (!orderData) return
    try {
      setApprovalTxHash(undefined)

      const hash = await approveAsync({
        address: MBONE_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [PAYMENT_PROCESSOR_ADDRESS, BigInt(orderData.totalMBONE)],
      })
      setApprovalTxHash(hash)
    } catch (e: any) {
      console.error('Approval error:', e)
      setError(e.message)
      setStep('error')
      toast.error('Failed to approve MBONE spending')
    }
  }

  // Check on-chain allowance
  const checkAllowance = async (): Promise<boolean> => {
    if (!address || !orderData) return false
    try {
      const allowance = await publicClient.readContract({
        address: MBONE_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address, PAYMENT_PROCESSOR_ADDRESS],
      })
      const required = BigInt(orderData.totalMBONE)
      console.log('Allowance:', (Number(allowance) / 1e18).toFixed(2), 'MBONE')
      console.log('Required: ', (Number(required) / 1e18).toFixed(2), 'MBONE')
      return allowance >= required
    } catch (e) {
      console.error('Allowance check failed:', e)
      return false
    }
  }

  // Check MBONE balance
  const checkBalance = async (): Promise<boolean> => {
    if (!address || !orderData) return false
    try {
      const balance = await publicClient.readContract({
        address: MBONE_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
      })
      const required = BigInt(orderData.totalMBONE)
      if (balance < required) {
        toast.error(`Insufficient MBONE. Need ${formatUnits(required, 18)} MBONE`)
        return false
      }
      return true
    } catch (e) {
      toast.error('Failed to check MBONE balance')
      return false
    }
  }

  // Debug: verify order exists on-chain
  const checkOrderOnChain = async () => {
    if (!orderData?.orderHash) return
    try {
      const order = await publicClient.readContract({
        address: PAYMENT_PROCESSOR_ADDRESS,
        abi: PROCESSOR_ABI,
        functionName: 'getOrder',
        args: [orderData.orderHash as `0x${string}`],
      })
      console.log('On-chain order:', {
        buyer: order.buyer,
        amount: formatUnits(order.amount, 18) + ' MBONE',
        paid: order.paid,
      })
      if (order.amount === 0n) {
        console.warn('⚠️  Order NOT found on chain! orderHash may be wrong.')
      }
    } catch (e) {
      console.error('getOrder failed:', e)
    }
  }

  useEffect(() => {
    if (orderData) checkOrderOnChain()
  }, [orderData])

  // Pay order
  const payOrder = async () => {
    if (!orderData) {
      toast.error('Order data missing')
      return
    }

    // Validate orderHash format
    if (!orderData.orderHash?.startsWith('0x') || orderData.orderHash.length !== 66) {
      toast.error('Invalid order hash format')
      return
    }

    console.log('=== PAY ORDER ===')
    console.log('orderHash:', orderData.orderHash)
    console.log('invoiceId:', orderData.invoiceId)
    console.log('amount:   ', formatUnits(BigInt(orderData.totalMBONE), 18), 'MBONE')

    try {
      setPaymentTxHash(undefined)
      setStep('confirming')

      const hash = await payAsync({
        address: PAYMENT_PROCESSOR_ADDRESS,
        abi: PROCESSOR_ABI,
        functionName: 'payOrder',
        args: [orderData.orderHash as `0x${string}`, orderData.invoiceId as string],
      })
      setPaymentTxHash(hash)
      toast.success('Payment submitted! Waiting for confirmation...')
    } catch (e: any) {
      console.error('Payment error:', e)
      const reason = e?.shortMessage || e?.message || 'Unknown error'
      setError(reason)
      setStep('error')
      toast.error(`Payment failed: ${reason}`)
    }
  }

  const handlePayOrder = async () => {
    setIsCheckingBalance(true)
    try {
      const hasBalance = await checkBalance()
      if (!hasBalance) return

      const hasAllowance = await checkAllowance()
      if (!hasAllowance) {
        toast.error('Approval not detected on-chain yet. Please approve again.')
        setStep('approve')
        return
      }

      await payOrder()
    } finally {
      setIsCheckingBalance(false)
    }
  }

  // Step indicator helper
  const getStepStatus = (stepName: string) => {
    const order = ['connect', 'approve', 'pay', 'confirming']
    const current = order.indexOf(step)
    const target = order.indexOf(stepName)
    if (step === 'success') return 'completed'
    if (step === 'error' && target <= current) return 'error'
    if (target < current) return 'completed'
    if (target === current) return 'active'
    return 'pending'
  }

  const isApproving = isApprovePending || isApprovalLoading
  const isPaying = isPayPending || isPaymentLoading

  // Calculate order summary from items
  const orderSummary = items.map((item) => ({
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.final_mrp,
    total: item.product.final_mrp * item.quantity,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Pay with MBONE Token
          <Badge className="bg-blue-500 text-white">Sepolia Network</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User MBONE Balance */}
        {address && isConnected && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700">Your MBONE Balance:</span>
              </div>
              <div className="flex items-center gap-2">
                {isLoadingBalance ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                ) : (
                  <span className="font-semibold text-blue-700">
                    {formatUnits(userMBONEBalance, 18)} MBONE
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 text-sm">Order Summary</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {orderSummary.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between items-center font-semibold">
            <span>Total USD:</span>
            <span>${totalUSD.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-muted-foreground">MBONE Amount:</span>
            <span className="text-blue-600 font-semibold">
              {formatUnits(totalMBONE, 18)} MBONE
            </span>
          </div>
          <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
            <span>MBONE Price:</span>
            <span>${mbonePrice.toFixed(4)} USD</span>
          </div>
          {orderData?.invoiceId && (
            <div className="flex justify-between items-center mt-2 pt-2 border-t">
              <span className="text-xs text-muted-foreground">Invoice:</span>
              <span className="text-xs font-mono">{orderData.invoiceId}</span>
            </div>
          )}
        </div>

        {/* Progress steps */}
        <div className="space-y-3">
          {(
            [
              { key: 'connect', label: 'Connect Wallet' },
              { key: 'approve', label: 'Approve MBONE' },
              { key: 'pay', label: 'Pay Order' },
              { key: 'confirming', label: 'Confirming' },
            ] as const
          ).map(({ key, label }) => {
            const status = getStepStatus(key)
            return (
              <div key={key} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${
                    status === 'completed'
                      ? 'bg-green-500 text-white'
                      : status === 'active'
                      ? 'bg-blue-500 text-white'
                      : status === 'error'
                      ? 'bg-red-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {status === 'completed' ? (
                    '✓'
                  ) : status === 'active' && key === 'confirming' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    ['connect', 'approve', 'pay', 'confirming'].indexOf(key) + 1
                  )}
                </div>
                <span
                  className={`text-sm
                  ${
                    status === 'completed'
                      ? 'text-green-600'
                      : status === 'active'
                      ? 'text-blue-600'
                      : status === 'error'
                      ? 'text-red-600'
                      : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>

        <Separator />

        {/* Action area */}
        <div className="space-y-3">
          {step === 'connect' && (
            <div className="space-y-3">
              <ConnectButton />
              {isConnected && !isCorrectNetwork && (
                <Button
                  onClick={() => switchChain?.({ chainId: sepolia.id })}
                  className="w-full"
                  variant="outline"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Switch to Sepolia
                </Button>
              )}
              {isConnected && isCorrectNetwork && (
                <Button
                  onClick={createOrder}
                  className="w-full"
                  disabled={userMBONEBalance < totalMBONE}
                >
                  {userMBONEBalance < totalMBONE
                    ? `Insufficient Balance (Need ${formatUnits(totalMBONE, 18)} MBONE)`
                    : 'Create Order'}
                </Button>
              )}
            </div>
          )}

          {step === 'approve' && (
            <Button onClick={approveToken} disabled={isApproving} className="w-full">
              {isApproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                'Approve MBONE Spending'
              )}
            </Button>
          )}

          {step === 'pay' && (
            <Button
              onClick={handlePayOrder}
              disabled={isPaying || isCheckingBalance}
              className="w-full"
            >
              {isPaying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : isCheckingBalance ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking balance...
                </>
              ) : (
                `Pay ${formatUnits(BigInt(orderData?.totalMBONE || 0), 18)} MBONE`
              )}
            </Button>
          )}

          {step === 'confirming' && (
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
              <p className="text-sm">Confirming on blockchain...</p>
              <p className="text-xs text-muted-foreground">This usually takes 15–30 seconds</p>
              {paymentTxHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${paymentTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
                >
                  View on Etherscan <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <h3 className="font-semibold text-green-700">Payment Successful!</h3>
                <p className="text-sm text-muted-foreground">Your order has been confirmed</p>
                {orderData?.invoiceId && (
                  <p className="text-xs text-muted-foreground mt-1">Invoice: {orderData.invoiceId}</p>
                )}
              </div>
              {paymentTxHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${paymentTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
                >
                  View Transaction <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          {step === 'error' && (
            <div className="text-center space-y-3">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <h3 className="font-semibold text-red-700">Payment Failed</h3>
                <p className="text-sm text-muted-foreground break-all">{error}</p>
              </div>
              <Button
                onClick={() => {
                  setStep('connect')
                  setError('')
                }}
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}