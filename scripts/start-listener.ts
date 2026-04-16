import { startPaymentListener } from '../lib/web3/event-listener'

async function main() {
  console.log('🚀 Starting payment event listener...')
  console.log('📡 Listening for PaymentProcessed events on Sepolia')
  console.log('Press Ctrl+C to stop\n')
  
  try {
    await startPaymentListener()
    console.log('✅ Listener is running...')
  } catch (error) {
    console.error('❌ Failed to start listener:', error)
    process.exit(1)
  }
}

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down event listener...')
  process.exit(0)
})

main()