import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Web3Provider } from '@/components/providers/Web3Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ModernMart - Premium Electronics & Gadgets',
  description: 'Discover the latest electronics, gadgets, and tech accessories at unbeatable prices',
  // ... rest of metadata
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Web3Provider now contains your Reown AppKit logic */}
        <Web3Provider>
          <AuthProvider>
            <div className="min-h-screen bg-brand-background">
              <Header />
              <main>{children}</main>
              <Footer />
              <Toaster />
            </div>
          </AuthProvider>
        </Web3Provider>
      </body>
    </html>
  )
}