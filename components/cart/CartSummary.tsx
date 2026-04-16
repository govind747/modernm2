// components/cart/CartSummary.tsx
'use client'

import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/stores/cartStore'
import Link from 'next/link'
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, Zap } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { ClientOnly } from '@/components/ClientOnly'

function CartSummaryContent() {
  const { items, getTotalPrice, getTotalItems } = useCartStore()
  
  const subtotal = getTotalPrice()
  const FREE_SHIPPING_THRESHOLD = 100
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.00
  const taxRate = 0.05
  const tax = subtotal * taxRate
  const total = subtotal + shipping + tax

  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)

  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">Your cart is empty</p>
        <Link href="/products">
          <Button className="mt-4">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-1">Order Summary</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secure Checkout v2.0</p>
      </div>
      
      <div className="space-y-3 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <Truck className={cn("h-4 w-4", shipping === 0 ? "text-emerald-500" : "text-slate-400")} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
              {shipping === 0 ? 'Free Shipping Unlocked' : 'Shipping Goal'}
            </span>
          </div>
          {shipping > 0 && (
            <span className="text-[10px] font-black text-brand-accent">${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(0)} to go</span>
          )}
        </div>
        {/* Fixed: Removed custom indicatorClassName */}
        <Progress value={shippingProgress} className="h-1.5 bg-slate-200" />
        <p className="text-[10px] font-medium text-slate-400 italic">
          {shipping === 0 ? 'Your tech haul ships on us!' : `Add more to save $${shipping.toFixed(2)} on logistics.`}
        </p>
      </div>

      <div className="space-y-4 px-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-tight">Subtotal ({getTotalItems()} units)</span>
          <span className="text-sm font-black text-slate-900">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-tight">Logistics & Handling</span>
          <span className={cn("text-sm font-black", shipping === 0 ? "text-emerald-500" : "text-slate-900")}>
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-tight">Protocol Fee ({taxRate * 100}%)</span>
          <span className="text-sm font-black text-slate-900">${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
      
      <div className="pt-2">
        <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-brand-accent/20 blur-3xl rounded-full group-hover:bg-brand-accent/40 transition-colors" />
          
          <div className="flex justify-between items-end relative z-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent mb-1">Total Payable</p>
              <h4 className="text-3xl font-black tracking-tighter">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
            </div>
            <div className="flex flex-col items-end">
              <Zap className="h-5 w-5 text-brand-accent mb-1 animate-pulse" />
              <p className="text-[10px] font-bold text-slate-400">Incl. Fee</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Link href="/checkout" className="block">
          <Button className="w-full h-16 bg-brand-accent hover:bg-brand-accent/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-brand-accent/20 group transition-all active:scale-95" size="lg">
            Checkout Now
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        
        <Link href="/products" className="block text-center">
          <button className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors py-2">
            Add more items
          </button>
        </Link>
      </div>

      <div className="pt-4 flex items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
        <ShieldCheck className="h-6 w-6" />
        <div className="h-4 w-px bg-slate-300" />
        <span className="text-[10px] font-black uppercase tracking-widest">SSL Secure</span>
        <div className="h-4 w-px bg-slate-300" />
        <span className="text-[10px] font-black uppercase tracking-widest">Web3 Ready</span>
      </div>
    </div>
  )
}

export function CartSummary() {
  return (
    <ClientOnly>
      <CartSummaryContent />
    </ClientOnly>
  )
}