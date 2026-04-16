// app/api/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

export async function POST(request: NextRequest) {
  try {
    const { orderId, txHash, invoiceId } = await request.json()
    
    console.log('Verify payment request:', { orderId, txHash, invoiceId })
    
    if (!orderId || !txHash || !invoiceId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('User authenticated:', user.id)

    // Get order from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (orderError || !order) {
      console.error('Order fetch error:', orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    console.log('Order fetched:', {
      id: order.id,
      status: order.status,
      stored_invoice_id: order.invoice_id,
      received_invoice_id: invoiceId,
      user_id: order.user_id,
      order_hash: order.order_hash
    })

    // Check if order is already paid
    if (order.status === 'paid' || order.status === 'confirmed') {
      return NextResponse.json({ 
        success: true, 
        message: 'Order already paid',
        order: {
          id: order.id,
          status: order.status,
          invoice_id: order.invoice_id
        }
      })
    }

    // Verify invoice ID matches
    const storedInvoiceId = String(order.invoice_id)
    const receivedInvoiceId = String(invoiceId)
    
    if (storedInvoiceId !== receivedInvoiceId) {
      console.error('Invoice ID mismatch:', { stored: storedInvoiceId, received: receivedInvoiceId })
      return NextResponse.json({ 
        error: 'Invoice ID mismatch',
        details: {
          stored: storedInvoiceId,
          received: receivedInvoiceId
        }
      }, { status: 400 })
    }

    // Create public client
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.gateway.tenderly.co')
    })

    // 1. Get transaction receipt
    const receipt = await publicClient.getTransactionReceipt({
      hash: txHash as `0x${string}`
    })

    if (!receipt || receipt.status !== 'success') {
      console.error('Transaction failed on-chain:', receipt)
      return NextResponse.json({ error: 'Transaction failed on-chain' }, { status: 400 })
    }

    console.log('✅ Transaction receipt confirmed:', receipt.transactionHash)

    // 2. Verify contract state - Use type assertion to bypass TypeScript error
    const onChainOrder = await publicClient.readContract({
      address: process.env.NEXT_PUBLIC_PAYMENT_PROCESSOR_ADDRESS as `0x${string}`,
      abi: [
        {
          name: 'getOrder',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: 'orderHash', type: 'bytes32' }],
          outputs: [
            { name: 'paid', type: 'bool' },
            { name: 'buyer', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ]
        }
      ] as const,
      functionName: 'getOrder',
      args: [order.order_hash as `0x${string}`]
    } as any) // Type assertion to bypass the TypeScript error

    console.log('On-chain order state:', {
      paid: onChainOrder[0],
      buyer: onChainOrder[1],
      amount: onChainOrder[2]?.toString()
    })

    // 3. VALIDATIONS
    const isPaid = onChainOrder[0] as boolean
    const buyer = onChainOrder[1] as string
    const amount = onChainOrder[2] as bigint

    if (!isPaid) {
      console.error('Order not marked paid on-chain')
      return NextResponse.json({ error: 'Order not marked paid on-chain' }, { status: 400 })
    }

    if (buyer.toLowerCase() !== order.wallet_address.toLowerCase()) {
      console.error('Buyer mismatch:', { onChain: buyer, db: order.wallet_address })
      return NextResponse.json({ error: 'Buyer mismatch' }, { status: 400 })
    }

    // Compare amounts (convert both to string for comparison)
    const onChainAmount = amount.toString()
    const dbAmount = order.total_mbone.toString()
    
    if (onChainAmount !== dbAmount) {
      console.error('Amount mismatch:', { onChain: onChainAmount, db: dbAmount })
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
    }

    console.log('✅ Blockchain verification passed')

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_tx_hash: txHash,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Order update error:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update order', 
        details: updateError.message 
      }, { status: 500 })
    }

    console.log('✅ Order updated to paid:', orderId)

    // Create crypto payment record (if table exists)
    try {
      const { error: paymentError } = await supabase
        .from('crypto_payments')
        .insert({
          order_id: orderId,
          chain: 'sepolia',
          token_symbol: 'MBONE',
          amount: order.total_mbone,
          tx_hash: txHash,
          from_wallet: order.wallet_address,
          to_contract: process.env.NEXT_PUBLIC_PAYMENT_PROCESSOR_ADDRESS || 'demo-contract',
          status: 'confirmed',
          created_at: new Date().toISOString()
        })

      if (paymentError) {
        console.error('⚠️ Payment insert warning (non-critical):', paymentError.message)
      } else {
        console.log('✅ Crypto payment record created')
      }
    } catch (paymentErr) {
      console.error('Payment record error (non-critical):', paymentErr)
    }

    // Create initial shipment record (if table exists)
    try {
      const { error: shipmentError } = await supabase
        .from('shipments')
        .insert({
          order_id: orderId,
          status: 'processing',
          created_at: new Date().toISOString()
        })

      if (shipmentError) {
        console.error('⚠️ Shipment creation warning (non-critical):', shipmentError.message)
      } else {
        console.log('✅ Shipment record created')
      }
    } catch (shipmentErr) {
      console.error('Shipment record error (non-critical):', shipmentErr)
    }

    // Fetch the updated order to confirm
    const { data: updatedOrder } = await supabase
      .from('orders')
      .select('id, status, payment_tx_hash, invoice_id')
      .eq('id', orderId)
      .single()

    console.log('✅ Payment verification complete:', updatedOrder)

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order: {
        id: order.id,
        status: 'paid',
        invoice_id: order.invoice_id,
        transaction_hash: txHash
      }
    })

  } catch (error: any) {
    console.error('Verify payment error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}