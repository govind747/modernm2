'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia } from '@reown/appkit/networks'
import { WagmiProvider, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

// WagmiAdapter — injected() connector only; AppKit manages WalletConnect internally
export const wagmiAdapter = new WagmiAdapter({
  networks: [sepolia],
  projectId,
  ssr: true,
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
})

// Must be called at module scope in a 'use client' file — no conditional guards.
// This is the pattern recommended by Reown for Next.js App Router.
createAppKit({
  adapters: [wagmiAdapter],
  networks: [sepolia],
  projectId,
  metadata: {
    name: 'ModernMart',
    description: 'Web3 Ecommerce',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    icons: ['https://avatars.githubusercontent.com/u/179229932'],
  },
  features: {
    analytics: false,
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
