'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia } from '@reown/appkit/networks'
import { WagmiProvider, http } from 'wagmi'
// ✅ We only import what we actually need
import { injected, walletConnect } from 'wagmi/connectors' 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

// ✅ MANUAL CONFIG: This prevents the adapter from trying to load Porto, Coinbase, or MetaMask SDKs
const wagmiAdapter = new WagmiAdapter({
  networks: [sepolia],
  projectId,
  ssr: true,
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL)
  },
  connectors: [
    injected(), // Standard browser wallets (MetaMask, etc.)
    walletConnect({ projectId }) // Mobile/QR code support
  ]
})

createAppKit({
  adapters: [wagmiAdapter],
  networks: [sepolia],
  projectId,
  metadata: {
    name: 'ModernMart',
    description: 'Web3 Ecommerce',
    url: 'http://localhost:3000',
    icons: ['https://avatars.githubusercontent.com/u/179229932'],
  },
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}