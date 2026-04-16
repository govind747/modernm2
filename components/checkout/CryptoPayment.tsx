// components/checkout/CryptoPayment.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useAccount, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { sepolia } from 'wagmi/chains'
import { Button } from '@/components/ui/button'
import { Wallet, CheckCircle2, AlertCircle, Loader2, ExternalLink, Coins, Zap, ShieldCheck, ArrowRight, Printer, X } from 'lucide-react'
import { toast } from 'sonner'
import { OrderReceipt } from './OrderReceipt'
import { useCartStore } from '@/lib/stores/cartStore'
import { useAuth } from '@/components/providers/AuthProvider'
import {
  MBONE_TOKEN_ADDRESS,
  PAYMENT_PROCESSOR_ADDRESS,
  ERC20_ABI,
  PROCESSOR_ABI,
} from '@/lib/web3/config'
import { createPublicClient, http, formatUnits } from 'viem'
import { cn } from '@/lib/utils'
import { Address } from '@/lib/types/database'
import { ShoppingBag } from 'lucide-react'

interface CryptoPaymentProps {
  selectedAddress?: Address | null;
  shippingInfo?: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

type Step = 'connect' | 'approve' | 'pay' | 'confirming' | 'success' | 'error'

interface OrderData {
  orderId: string
  invoiceId: string
  orderHash: string
  totalMBONE: string
  totalUSD: string
  mbonePriceUsd: number
}

export function CryptoPayment({ selectedAddress, shippingInfo }: CryptoPaymentProps) {
  const [step, setStep] = useState<Step>('connect')
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [mbonePrice, setMbonePrice] = useState<number>(0.25)
  const [approvalTxHash, setApprovalTxHash] = useState<`0x${string}` | undefined>()
  const [paymentTxHash, setPaymentTxHash] = useState<`0x${string}` | undefined>()
  const [error, setError] = useState<string>('')
  const [isCheckingBalance, setIsCheckingBalance] = useState(false)
  const [userMBONEBalance, setUserMBONEBalance] = useState<bigint>(BigInt(0))
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptOrderData, setReceiptOrderData] = useState<any>(null)

  const { address, isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const { open } = useAppKit()

  const { writeContractAsync: approveAsync, isPending: isApprovePending } = useWriteContract()
  const { writeContractAsync: payAsync, isPending: isPayPending } = useWriteContract()

  const { isLoading: isApprovalLoading, isSuccess: isApprovalSuccess } =
    useWaitForTransactionReceipt({ hash: approvalTxHash })
  const { isLoading: isPaymentLoading, isSuccess: isPaymentSuccess } =
    useWaitForTransactionReceipt({ hash: paymentTxHash })

  const { items, clearCart, getTotalPrice } = useCartStore()
  const { user } = useAuth()

  // USD totals for display only
  const subtotal = getTotalPrice()
  const shipping = subtotal > 100 ? 0 : 9.00
  const tax = subtotal * 0.05
  const totalUSD = subtotal + shipping + tax

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.NEXT_PUBLIC_RPC_URL),
  })

  useEffect(() => { fetchMbonePrice() }, [])

  useEffect(() => {
    if (address && isConnected) fetchUserMBONEBalance()
  }, [address, isConnected])

  useEffect(() => {
    if (!isApprovalSuccess || !approvalTxHash) return
    toast.success('MBONE spending approved!')
    setStep('pay')
  }, [isApprovalSuccess, approvalTxHash])

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
        if (!res.ok) toast.error(`Verification failed: ${data.error}`)
        
        const receiptData = {
          ...orderData,
          items,
          shipping,
          tax,
          subtotal,
          walletAddress: address,
          shippingAddress: selectedAddress,
          shippingInfo,
        }
        
        setReceiptOrderData(receiptData)
        setStep('success')
        clearCart()
        toast.success('Payment successful! Order confirmed.')
        
      } catch (e) {
        console.error('Verify payment error:', e)
        toast.error('Failed to verify payment')
      }
    }

    verifyPayment()
  }, [isPaymentSuccess, paymentTxHash, orderData])

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
      } as any)
      setUserMBONEBalance(balance as bigint)
    } catch (e) {
      console.error('Failed to fetch MBONE balance:', e)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const isCorrectNetwork = chain?.id === sepolia.id

  const createOrder = async () => {
    if (!address || !user) {
      toast.error('Please connect your wallet and sign in')
      return
    }

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: items,
          walletAddress: address,
          shipping,
          tax,
          subtotal,
          shippingAddress: selectedAddress ? {
            line1: selectedAddress.address_line1,
            line2: selectedAddress.address_line2 || '',
            city: selectedAddress.city,
            state: selectedAddress.state || '',
            zip: selectedAddress.zip_code,
            country: selectedAddress.country || 'India',
          } : {
            line1: shippingInfo?.address || '',
            city: shippingInfo?.city || '',
            state: shippingInfo?.state || '',
            zip: shippingInfo?.zipCode || '',
            country: shippingInfo?.country || 'India',
          },
          shippingInfo: {
            fullName: shippingInfo?.fullName || '',
            email: shippingInfo?.email || '',
            address: shippingInfo?.address || '',
            city: shippingInfo?.city || '',
            state: shippingInfo?.state || '',
            zipCode: shippingInfo?.zipCode || '',
            country: shippingInfo?.country || 'India',
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')

      setOrderData(data)

      const requiredWei = BigInt(data.totalMBONE)
      if (userMBONEBalance < requiredWei) {
        const have = Number(formatUnits(userMBONEBalance, 18)).toFixed(2)
        const need = Number(formatUnits(requiredWei, 18)).toFixed(2)
        toast.error(`Insufficient MBONE. Have ${have}, need ${need}`)
        setStep('error')
        setError(`Insufficient MBONE balance. Have ${have} MBONE, need ${need} MBONE`)
        return
      }

      setStep('approve')
      toast.success('Order created!')
    } catch (e: any) {
      setError(e.message)
      setStep('error')
      toast.error(e.message)
    }
  }

  const approveToken = async () => {
    if (!orderData) return
    try {
      setApprovalTxHash(undefined)
      const amountWei = BigInt(orderData.totalMBONE)
      const hash = await approveAsync({
        address: MBONE_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [PAYMENT_PROCESSOR_ADDRESS, amountWei],
        chain: sepolia,
      } as any) // ✅ Add 'as any' here if needed
      setApprovalTxHash(hash)
    } catch (e: any) {
      setError(e.message)
      setStep('error')
      toast.error('Failed to approve MBONE')
    }
  }

  const checkAllowance = async (): Promise<boolean> => {
    if (!address || !orderData) return false
    try {
      const allowance = await publicClient.readContract({
        address: MBONE_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address, PAYMENT_PROCESSOR_ADDRESS],
      } as any)
      return (allowance as bigint) >= BigInt(orderData.totalMBONE)
    } catch (e) {
      return false
    }
  }

  const checkBalance = async (): Promise<boolean> => {
    if (!address || !orderData) return false
    try {
      const balance = await publicClient.readContract({
        address: MBONE_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
      } as any)
      return (balance as bigint) >= BigInt(orderData.totalMBONE)
    } catch (e) {
      return false
    }
  }

  const payOrder = async () => {
    if (!orderData) return
    try {
      setPaymentTxHash(undefined)
      setStep('confirming')
      const hash = await payAsync({
        address: PAYMENT_PROCESSOR_ADDRESS,
        abi: PROCESSOR_ABI,
        functionName: 'payOrder',
        args: [orderData.orderHash as `0x${string}`, orderData.invoiceId],
        chain: sepolia,
      } as any) // ✅ Add 'as any' here if needed
      setPaymentTxHash(hash)
    } catch (e: any) {
      const reason = e?.shortMessage || e?.message || 'Unknown error'
      setError(reason)
      setStep('error')
      toast.error(`Payment failed: ${reason}`)
    }
  }

  const handlePayOrder = async () => {
    setIsCheckingBalance(true)
    try {
      if (!await checkBalance()) {
        toast.error('Insufficient MBONE balance')
        return
      }
      if (!await checkAllowance()) {
        toast.error('Approval not detected. Please approve again.')
        setStep('approve')
        return
      }
      await payOrder()
    } finally {
      setIsCheckingBalance(false)
    }
  }

  const getStepStatus = (stepName: string) => {
    const order = ['connect', 'approve', 'pay', 'confirming']
    const current = order.indexOf(step)
    const target = order.indexOf(stepName)
    if (step === 'success') return 'completed'
    if (step === 'error' && target <= current) return 'error'
    if (target < current) return 'completed'
    return target === current ? 'active' : 'pending'
  }

  const isApproving = isApprovePending || isApprovalLoading
  const isPaying = isPayPending || isPaymentLoading

  const displayMBONE = (order: OrderData | null): string => {
    if (!order) return '0.00'
    try {
      return Number(formatUnits(BigInt(order.totalMBONE), 18)).toFixed(2)
    } catch {
      return '0.00'
    }
  }

  const displayUserBalance = (): string =>
    Number(formatUnits(userMBONEBalance, 18)).toFixed(2)

  return (
    <div className="space-y-8 text-white">
      {/* Wallet Balance Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-brand-accent/20 rounded-2xl flex items-center justify-center">
            <Wallet className="h-6 w-6 text-brand-accent" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Protocol Wallet</p>
            <div className="scale-90 origin-left mt-1">
              <Button onClick={() => open()}>
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 px-6 py-3 rounded-2xl border border-white/5 text-right min-w-[140px]">
          <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
            <Zap className="h-3 w-3 fill-brand-accent" /> Balance
          </p>
          <div className="flex items-center gap-2 justify-end">
            {isLoadingBalance
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <span className="text-xl font-black">{displayUserBalance()}</span>
            }
            <span className="text-[10px] font-bold text-slate-500">MBONE</span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-4 gap-4 px-2">
        {(['connect', 'approve', 'pay', 'confirming'] as const).map((s) => (
          <div key={s} className="space-y-2">
            <div className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              getStepStatus(s) === 'completed' ? "bg-brand-accent" :
              getStepStatus(s) === 'active'    ? "bg-white animate-pulse" : "bg-white/10"
            )} />
            <p className={cn(
              "text-[9px] font-black uppercase tracking-tighter text-center",
              getStepStatus(s) === 'active' || getStepStatus(s) === 'completed'
                ? "text-white" : "text-slate-600"
            )}>
              {s === 'confirming' ? 'verify' : s}
            </p>
          </div>
        ))}
      </div>

      {/* Main Stage */}
      <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 min-h-[200px] flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-brand-accent/5 blur-[80px] rounded-full" />

        {step === 'connect' && (
          <div className="space-y-6 text-center animate-in fade-in zoom-in-95">
            {!isConnected ? (
              <div className="space-y-4">
                <p className="text-slate-400 font-medium">Link your wallet to initiate the MBONE transaction.</p>
                <div className="flex justify-center">
                  <Button onClick={() => open()}>
                    Connect Wallet
                  </Button>
                </div>
              </div>
            ) : !isCorrectNetwork ? (
              <Button
                onClick={() => switchChain?.({ chainId: sepolia.id })}
                className="w-full h-16 rounded-2xl bg-rose-500 hover:bg-rose-600 font-black text-lg"
              >
                Switch to Sepolia Network
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-800/30 rounded-2xl p-4 text-left">
                  <p className="text-xs text-slate-400 mb-2">Order Summary</p>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Subtotal:</span><span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Protocol Fee (5%):</span><span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-brand-accent">${totalUSD.toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={createOrder}
                  className="w-full h-16 rounded-2xl bg-brand-accent hover:bg-brand-accent/90 font-black text-lg shadow-xl shadow-brand-accent/20 group"
                >
                  Initialize Order <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-all" />
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 'approve' && (
          <div className="space-y-6 text-center animate-in slide-in-from-bottom-4">
            <ShieldCheck className="h-12 w-12 text-brand-accent mx-auto mb-2" />
            <div>
              <h4 className="text-xl font-black">Contract Permission</h4>
              <p className="text-slate-400 text-sm mt-1">Authorize the MBONE Protocol to process your haul.</p>
              <p className="text-xs text-brand-accent mt-2">
                Amount: {displayMBONE(orderData)} MBONE
              </p>
            </div>
            <Button
              onClick={approveToken}
              disabled={isApproving}
              className="w-full h-16 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black text-lg"
            >
              {isApproving && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
              {isApproving ? 'Granting Access...' : 'Approve Spending'}
            </Button>
          </div>
        )}

        {step === 'pay' && (
          <div className="space-y-6 text-center animate-in slide-in-from-bottom-4">
            <div className="h-16 w-16 bg-brand-accent rounded-3xl flex items-center justify-center mx-auto mb-2 shadow-2xl shadow-brand-accent/40">
              <Coins className="h-8 w-8 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-black">Final Settlement</h4>
              <p className="text-slate-400 text-sm mt-1">
                Ready to clear {displayMBONE(orderData)} MBONE
              </p>
            </div>
            <Button
              onClick={handlePayOrder}
              disabled={isPaying || isCheckingBalance}
              className="w-full h-16 rounded-2xl bg-brand-accent font-black text-lg shadow-xl shadow-brand-accent/30"
            >
              {(isPaying || isCheckingBalance) && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
              {isPaying ? 'Processing...' : isCheckingBalance ? 'Checking...' : 'Confirm Payment'}
            </Button>
          </div>
        )}

        {step === 'confirming' && (
          <div className="text-center space-y-4 py-6">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-brand-accent" />
            <h4 className="text-xl font-black tracking-tight">Syncing with Blockchain</h4>
            <p className="text-slate-400 text-sm">Awaiting block confirmation (approx. 15s)</p>
            {paymentTxHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${paymentTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-brand-accent tracking-widest hover:underline mt-4"
              >
                View Tx Hash <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6 py-6 animate-in zoom-in-95">
            <div className="h-20 w-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-emerald-500 tracking-tighter">Payment Successful!</h4>
              <p className="text-slate-400 text-sm mt-1 font-medium">
                Order #{orderData?.invoiceId} is confirmed.
              </p>
              <p className="text-slate-500 text-xs mt-2">
                A confirmation email has been sent to your registered email.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
              <Button
                onClick={() => setShowReceipt(true)}
                className="bg-slate-800 text-white h-12 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <Printer className="h-4 w-4" /> View Receipt
              </Button>
              <Button
                onClick={() => { 
                  clearCart(); 
                  setStep('connect'); 
                  setOrderData(null); 
                  window.location.href = '/products';
                }}
                className="bg-brand-accent text-white h-12 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-accent/90 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" /> Continue Shopping
              </Button>
            </div>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center space-y-6 animate-in fade-in">
            <div className="h-16 w-16 bg-rose-500/20 rounded-3xl flex items-center justify-center mx-auto">
              <AlertCircle className="h-8 w-8 text-rose-500" />
            </div>
            <div>
              <h4 className="text-xl font-black text-rose-500">Signal Interrupted</h4>
              <p className="text-slate-400 text-xs font-mono max-w-[250px] mx-auto mt-2 leading-relaxed opacity-70">{error}</p>
            </div>
            <Button
              onClick={() => { setStep('connect'); setError('') }}
              variant="outline"
              className="w-full h-14 rounded-xl border-white/10 hover:bg-white/5 font-bold"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {showReceipt && receiptOrderData && (
        <div className="fixed inset-0 z-[999] bg-slate-950/80 backdrop-blur-xl flex items-start justify-center p-4 md:p-8 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 my-8">
            <button
              onClick={() => setShowReceipt(false)}
              className="absolute -top-4 -right-4 h-10 w-10 bg-brand-accent text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
            >
              <X className="h-5 w-5" />
            </button>
            
            <OrderReceipt
              order={receiptOrderData}
              user={user}
              onClose={() => setShowReceipt(false)}
              onContinueShopping={() => {
                setShowReceipt(false)
                clearCart()
                window.location.href = '/products'
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}