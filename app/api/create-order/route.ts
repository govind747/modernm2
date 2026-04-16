// app/api/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { generateInvoiceId } from '@/lib/web3/config'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { PROCESSOR_ABI } from '@/lib/web3/config'
import { keccak256, toBytes, formatUnits } from 'viem'

// Pre-calculate 10^26 as BigInt constant
const TEN_POWER_26 = BigInt(100000000000000000000000000) // 10^26

export async function POST(request: NextRequest) {
  try {
    const { cartItems, walletAddress, shipping, tax, subtotal, shippingAddress, shippingInfo } = await request.json()
    
    if (!cartItems || !walletAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: mboneSetting } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'mbone_price_usd')
      .single()

    const mbonePriceUsd = mboneSetting ? parseFloat(mboneSetting.value) : 0.000294

    // Calculate totals using cents (integers)
    let totalUSDCents = 0
    const orderItems = []

    for (const item of cartItems) {
      const productId = item.product?.id || item.id
      if (!productId) continue

      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (!product) continue

      const priceInCents = Math.round(product.final_mrp * 100)
      const itemTotalCents = priceInCents * (item.quantity || 1)
      totalUSDCents += itemTotalCents

      orderItems.push({
        product_id: product.id,
        quantity: item.quantity || 1,
        price_usd: product.final_mrp,
      })
    }

    const shippingCents = shipping ? Math.round(shipping * 100) : 0
    const taxCents = tax ? Math.round(tax * 100) : 0
    totalUSDCents += shippingCents + taxCents
    
    const totalUSD = totalUSDCents / 100

    // Convert mbone price to scaled integer (1e10 precision)
    const mbonePriceScaledStr = Math.floor(mbonePriceUsd * 1e10).toString()
    const mbonePriceScaled = BigInt(mbonePriceScaledStr)

    if (mbonePriceScaled === BigInt(0)) {
      return NextResponse.json({ error: 'MBONE price too small or zero' }, { status: 500 })
    }

    const usdScaled = BigInt(totalUSDCents) * TEN_POWER_26
    const totalMBONEBigInt = usdScaled / mbonePriceScaled
    const finalTotalMBONEWei = totalMBONEBigInt < BigInt(1) ? BigInt(1) : totalMBONEBigInt

    const totalMBONEEther = Number(formatUnits(finalTotalMBONEWei, 18)).toFixed(6)

    console.log('💰 Calculation:', {
      totalUSD: totalUSD.toFixed(2),
      totalUSDCents,
      mbonePriceUsd,
      mbonePriceScaled: mbonePriceScaled.toString(),
      totalMBONEEther,
      totalMBONEWei: finalTotalMBONEWei.toString(),
    })

    const orderId = crypto.randomUUID()
    const orderHashBytes = keccak256(toBytes(orderId))
    const orderHash = orderHashBytes as `0x${string}`
    const invoiceId = generateInvoiceId(orderId)

    const totalMBONEString = finalTotalMBONEWei.toString()

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: user.id,
        wallet_address: walletAddress,
        total_usd: totalUSD,
        total_mbone: totalMBONEString,
        status: 'created',
        order_hash: orderHash,
        invoice_id: invoiceId,
        shipping_address: shippingAddress,
        shipping_info: shippingInfo,
        subtotal: subtotal || totalUSD,
        shipping_charge: shipping || 0,
        tax_amount: tax || 0
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    if (orderItems.length > 0) {
      const orderItemsWithOrderId = orderItems.map(item => ({
        ...item,
        order_id: order.id
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsWithOrderId)

      if (itemsError) {
        console.error('Order items error:', itemsError)
      }
    }

    // Create order on blockchain
    if (process.env.ADMIN_PRIVATE_KEY) {
      try {
        const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY.replace('0x', '') as `0x${string}`
        const account = privateKeyToAccount(adminPrivateKey.startsWith('0x') ? adminPrivateKey : `0x${adminPrivateKey}`)
        
        const walletClient = createWalletClient({
          account,
          chain: sepolia,
          transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.gateway.tenderly.co')
        })

        console.log('📝 Creating order on blockchain:', {
          contract: process.env.NEXT_PUBLIC_PAYMENT_PROCESSOR_ADDRESS,
          orderHash,
          buyer: walletAddress,
          amount: finalTotalMBONEWei.toString(),
        })

        // ✅ FIXED: Add account parameter to writeContract
        const txHash = await walletClient.writeContract({
          address: process.env.NEXT_PUBLIC_PAYMENT_PROCESSOR_ADDRESS as `0x${string}`,
          abi: PROCESSOR_ABI,
          functionName: 'createOrder',
          args: [orderHash, walletAddress as `0x${string}`, finalTotalMBONEWei],
          chain: sepolia,
          account,  // ✅ Add this - the account to use for signing
        })

        console.log('✅ Order created on blockchain, tx hash:', txHash)
        
        await supabase
          .from('orders')
          .update({ blockchain_tx_hash: txHash, blockchain_status: 'created' })
          .eq('id', order.id)
          
      } catch (contractError: any) {
        console.error('Contract error:', contractError)
        await supabase
          .from('orders')
          .update({ blockchain_status: 'pending_retry', blockchain_error: contractError.message })
          .eq('id', order.id)
      }
    }

    return NextResponse.json({
      orderId: order.id,
      orderHash,
      invoiceId,
      totalUSD: totalUSD.toFixed(2),
      totalMBONE: finalTotalMBONEWei.toString(),
      totalMBONEDisplay: totalMBONEEther,
      mbonePriceUsd,
      success: true
    })

  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}