'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Search, Menu, X, Sparkles, ChevronDown, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/providers/AuthProvider'
import { AuthModal } from '@/components/auth/AuthModal'
import { UserMenu } from '@/components/auth/UserMenu'
import { useCartStore } from '@/lib/stores/cartStore'
import { useAppKit } from '@reown/appkit/react' // ✅ Reown Hook
import { useAccount } from 'wagmi'
import { cn } from '@/lib/utils'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const { open } = useAppKit() // ✅ Used to trigger the modal manually
  const { isConnected, address } = useAccount()
  
  const pathname = usePathname()
  const { user } = useAuth()
  const { items } = useCartStore()

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'Deals', href: '/deals', icon: <Sparkles className="h-3 w-3 text-brand-accent" /> },
  ]

  return (
    <header 
      className={cn(
        "sticky top-0 z-[100] w-full transition-all duration-300",
        scrolled 
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-2 shadow-sm" 
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="h-9 w-9 bg-slate-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-slate-900/20">
                <span className="text-white font-black text-lg">M</span>
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter hidden sm:block">
                Modern<span className="text-brand-accent">Mart</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-bold transition-all rounded-full flex items-center gap-1.5",
                    pathname === link.href 
                      ? "text-brand-accent bg-brand-accent/5" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden lg:flex flex-1 max-w-sm mx-12">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Search tech..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Wallet & Auth Section */}
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-3 pl-2">
                  <div className="hidden sm:block scale-90 origin-right">
                    {/* ✅ REOWN AUTOMATIC BUTTON */}
                    <appkit-button balance="hide" />
                  </div>
                  <UserMenu />
                </div>
              ) : (
                <Button 
                  onClick={() => setIsAuthModalOpen(true)}
                  variant="ghost" 
                  className="font-bold text-slate-600 rounded-full hidden sm:flex"
                >
                  Sign In
                </Button>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                <ShoppingCart className="h-5 w-5 text-slate-700" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-brand-accent text-white border-2 border-white text-[10px] font-bold">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "absolute top-full left-0 w-full bg-white border-b border-slate-200 transition-all duration-300 overflow-hidden md:hidden shadow-xl",
          isMenuOpen ? "max-h-[80vh] py-6 opacity-100" : "max-h-0 py-0 opacity-0"
        )}>
          <nav className="flex flex-col container space-y-2">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="px-4 py-3 text-slate-900 font-bold">
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-slate-100 px-4 space-y-4">
              {!user ? (
                <Button 
                  onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }}
                  className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold"
                >
                  Sign In to Account
                </Button>
              ) : (
                <div className="flex flex-col gap-3">
                   {/* ✅ REOWN BUTTON FOR MOBILE */}
                   <div className="flex justify-center">
                    <appkit-button />
                   </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </header>
  )
}