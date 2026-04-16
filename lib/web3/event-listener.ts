import { createPublicClient, http, parseAbiItem } from 'viem'
import { sepolia } from 'viem/chains'
import { supabaseAdmin } from '@/lib/supabase/admin'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PAYMENT_PROCESSOR_ADDRESS as `0x${string}`

const ABI = [
  {
    name: 'PaymentProcessed',
    type: 'event',
    inputs: [
      { indexed: true, name: 'orderHash', type: 'bytes32' },
      { indexed: false, name: 'invoiceId', type: 'string' },
      { indexed: true, name: 'buyer', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' }
    ]
  }
] as const

// Track processed transactions to avoid duplicates
const processedTransactions = new Set<string>()

export async function startPaymentListener() {
  const client = createPublicClient({
    chain: sepolia,
    transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.gateway.tenderly.co')
  })

  console.log('🚀 Starting payment event listener...')
  console.log(`📡 Listening to contract: ${CONTRACT_ADDRESS}`)

  // Listen for past events (in case we missed any while offline)
  try {
    const currentBlock = await client.getBlockNumber()
    const fromBlock = currentBlock - BigInt(10000) // Last 10000 blocks

    console.log(`🔍 Scanning from block ${fromBlock} to ${currentBlock}`)

    const pastLogs = await client.getLogs({
      address: CONTRACT_ADDRESS,
      event: parseAbiItem('event PaymentProcessed(bytes32 indexed orderHash, string invoiceId, address indexed buyer, uint256 amount)'),
      fromBlock,
      toBlock: currentBlock
    })

    console.log(`📊 Found ${pastLogs.length} past events`)

    for (const log of pastLogs) {
      await processPaymentLog(log)
    }
  } catch (error) {
    console.error('Error fetching past logs:', error)
  }

  // Listen for new events - FIXED SYNTAX
  client.watchEvent({
    address: CONTRACT_ADDRESS,
    event: parseAbiItem('event PaymentProcessed(bytes32 indexed orderHash, string invoiceId, address indexed buyer, uint256 amount)'),
    onLogs: async (logs) => {
      console.log(`📨 Received ${logs.length} new payment events`)
      for (const log of logs) {
        await processPaymentLog(log)
      }
    },
    onError: (error) => {
      console.error('Event listener error:', error)
    }
  })
}

async function processPaymentLog(log: any) {
  const txHash = log.transactionHash
  const { orderHash, invoiceId, buyer, amount } = log.args as any

  // Prevent duplicate processing
  if (processedTransactions.has(txHash)) {
    console.log(`⏭️ Skipping already processed tx: ${txHash}`)
    return
  }

  console.log('🔥 Payment detected:', {
    txHash,
    orderHash: orderHash?.toString(),
    invoiceId,
    buyer,
    amount: amount?.toString()
  })

  // Convert bytes32 to string for comparison
  const orderHashString = orderHash?.toString()

  if (!orderHashString) {
    console.error('No order hash found in event')
    return
  }

  try {
    // Update order status - only if still pending
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'paid',
        payment_tx_hash: txHash,
        paid_at: new Date().toISOString()
      })
      .eq('order_hash', orderHashString)
      .eq('status', 'pending') // Only update if pending (provides idempotency)
      .select()

    if (error) {
      console.error('Database update error:', error)
      return
    }

    if (data && data.length > 0) {
      console.log(`✅ Order ${orderHashString} marked as paid`)

      // Create crypto payment record
      await supabaseAdmin
        .from('crypto_payments')
        .insert({
          order_id: data[0].id,
          chain: 'sepolia',
          token_symbol: 'MBONE',
          amount: amount?.toString(),
          tx_hash: txHash,
          from_wallet: buyer,
          to_contract: CONTRACT_ADDRESS,
          status: 'confirmed',
          confirmed_at: new Date().toISOString()
        })
        .select()

      // Create shipment record
      await supabaseAdmin
        .from('shipments')
        .insert({
          order_id: data[0].id,
          status: 'processing',
          created_at: new Date().toISOString()
        })

      // Mark as processed
      processedTransactions.add(txHash)
      
      console.log(`🎉 Order ${data[0].id} fully processed!`)
    } else {
      console.log(`⚠️ Order ${orderHashString} not found or already paid`)
    }
  } catch (error) {
    console.error('Error processing payment:', error)
  }
}