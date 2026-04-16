'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia } from '@reown/appkit/networks'
import { WagmiProvider, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRef } from 'react'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

const wagmiAdapter = new WagmiAdapter({
  networks: [sepolia],
  projectId,
  ssr: true,
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
})

// Only initialize once on the client — guarded via a module-level flag on globalThis
// so Next.js Fast Refresh doesn't call it multiple times.
const _g = typeof globalThis !== 'undefined' ? (globalThis as any) : {}
if (!_g.__appkit_initialized) {
  _g.__appkit_initialized = true
  createAppKit({
    adapters: [wagmiAdapter],
    networks: [sepolia],
    projectId,
    metadata: {
      name: 'ModernMart',
      description: 'Web3 Ecommerce',
      url: process.env.NEXT_PUBLIC_APP_URL || 'https://modernmart.vercel.app',
      icons: ['https://avatars.githubusercontent.com/u/179229932'],
    },
    features: {
      analytics: false,
    },
  })
}

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
