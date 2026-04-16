'use client'

import { CartItems } from '@/components/cart/CartItems'
import { CartSummary } from '@/components/cart/CartSummary'
import { useCartStore } from '@/lib/stores/cartStore'
import Link from 'next/link'
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ClientOnly } from '@/components/ClientOnly'
import { useEffect } from 'react'

function CartPageContent() {
  const { items, hydrate } = useCartStore()
  
  // Hydrate the store on client side
  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center container mx-auto px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 group overflow-hidden relative">
            <div className="absolute inset-0 bg-brand-accent/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
            <ShoppingBag className="h-10 w-10 text-slate-300 relative z-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Your cart is empty</h1>
          <p className="text-slate-500 font-medium mb-10">Looks like you haven't added any tech to your haul yet.</p>
          <Link href="/products">
            <Button className="h-14 px-10 bg-slate-900 hover:bg-brand-accent text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-900/10 active:scale-95 group">
              Start Shopping <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Checkout Progress Stepper */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-8 mb-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Checkout</h1>
              <p className="text-slate-500 font-medium italic">Review your selection before finalizing</p>
            </div>
            
            {/* Steps Indicator */}
            <div className="flex items-center gap-4">
              <Step icon={ShoppingBag} label="Cart" active />
              <div className="h-px w-8 bg-slate-200" />
              <Step icon={Truck} label="Shipping" />
              <div className="h-px w-8 bg-slate-200" />
              <Step icon={CreditCard} label="Payment" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                {items.length} {items.length === 1 ? 'Product' : 'Products'} Loaded
              </p>
              <button 
                className="text-xs font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
                onClick={() => {/* Add clear cart logic if needed */}}
              >
                Clear All
              </button>
            </div>
            
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <CartItems />
            </div>

            {/* Confidence Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                <ShieldCheck className="h-5 w-5 text-brand-accent" />
                <span className="text-xs font-bold text-slate-600">Secure Protocol</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                <Truck className="h-5 w-5 text-brand-accent" />
                <span className="text-xs font-bold text-slate-600">Free Express Delivery</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                <CreditCard className="h-5 w-5 text-brand-accent" />
                <span className="text-xs font-bold text-slate-600">Web3 Ready</span>
              </div>
            </div>
          </div>

          {/* Sticky Summary Sidebar */}
          <aside className="lg:col-span-4 sticky top-24">
            <div className="bg-slate-900 rounded-[2.5rem] p-1 shadow-2xl shadow-slate-900/20">
              <div className="bg-white rounded-[2.2rem] overflow-hidden">
                 <CartSummary />
              </div>
            </div>
            
            {/* Promo / Support Note */}
            <p className="mt-6 text-center text-xs font-medium text-slate-400 px-8">
              Need help with your order? <Link href="/support" className="text-brand-accent font-bold hover:underline">Contact Support</Link>
            </p>
          </aside>
          
        </div>
      </div>
    </div>
  )
}

function Step({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-2 transition-all",
      active ? "opacity-100" : "opacity-40"
    )}>
      <div className={cn(
        "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
        active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">{label}</span>
    </div>
  )
}

export default function CartPage() {
  return (
    <ClientOnly>
      <CartPageContent />
    </ClientOnly>
  )
}