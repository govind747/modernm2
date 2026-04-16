// components/checkout/CheckoutSummary.tsx
'use client'

import { useState, useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/lib/stores/cartStore'
import { useCheckoutStore } from '@/lib/stores/checkoutStore'
import Image from 'next/image'
import { Zap, ShoppingBag, ShieldCheck, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CheckoutSummary() {
  const { items, getTotalPrice, getTotalItems } = useCartStore()
  const { setTotals } = useCheckoutStore()
  const [mbonePrice, setMbonePrice] = useState<number>(0.25)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const subtotal = getTotalPrice()
  const shipping = subtotal > 100 ? 0 : 9.00
  const tax = subtotal * 0.05
  const total = subtotal + shipping + tax
  const mboneTotal = total / mbonePrice

  // Sync totals with the checkout store whenever cart changes
  useEffect(() => {
    setTotals(subtotal, shipping, tax)
  }, [subtotal, shipping, tax, setTotals])

  useEffect(() => {
    fetchMbonePrice()
    const interval = setInterval(fetchMbonePrice, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchMbonePrice = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/settings/mbone-price')
      const data = await response.json()
      if (response.ok) setMbonePrice(data.price)
    } catch (error) {
      console.error('Failed to fetch MBONE price:', error)
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000)
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Order Haul</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {getTotalItems()} Items Reserved
          </p>
        </div>
        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
          <ShoppingBag className="h-5 w-5 text-slate-400" />
        </div>
      </div>

      {/* Mini Product List */}
      <div className="space-y-4 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.product.id} className="group flex gap-4 items-center">
            <div className="relative w-14 h-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
              <Image
                src={item.product.image_url || '/placeholder-product.jpg'}
                alt={item.product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform"
              />
              <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-black px-1.5 py-0.5 rounded-bl-lg shadow-sm">
                x{item.quantity}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">{item.product.name}</h4>
              <p className="text-xs font-black text-brand-accent">
                ${(item.product.final_mrp * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <Separator className="bg-slate-50" />
      
      {/* Pricing Logic */}
      <div className="space-y-3 px-1">
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-slate-400 uppercase tracking-tighter text-[11px]">Subtotal</span>
          <span className="font-black text-slate-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-slate-400 uppercase tracking-tighter text-[11px]">Shipping</span>
          <span className={cn("font-black", shipping === 0 ? "text-emerald-500" : "text-slate-900")}>
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-slate-400 uppercase tracking-tighter text-[11px]">Protocol Fee (5%)</span>
          <span className="font-black text-slate-900">${tax.toFixed(2)}</span>
        </div>
      </div>
      
      {/* The Total Box */}
      <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-brand-accent/20 blur-3xl rounded-full" />
        
        <div className="flex justify-between items-end relative z-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent mb-1">Total Due</p>
            <h4 className="text-3xl font-black tracking-tighter">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
          </div>
          <ShieldCheck className="h-5 w-5 text-brand-accent mb-1" />
        </div>
      </div>

      {/* MBONE Web3 Conversion Terminal */}
      <div className="bg-brand-accent/5 border border-brand-accent/10 rounded-[2rem] p-6 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-brand-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Web3 Settlement</span>
          </div>
          <button onClick={fetchMbonePrice} className={cn("transition-all", isRefreshing && "animate-spin")}>
            <RefreshCcw className="h-3 w-3 text-brand-accent/40" />
          </button>
        </div>

        <div className="text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">
            Rate: 1 MBONE ≈ <span className="text-slate-900">${mbonePrice.toFixed(4)}</span>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tighter">
            {mboneTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            <span className="text-lg ml-2 text-brand-accent font-black tracking-widest">MBONE</span>
          </div>
        </div>
        
        <div className="pt-2 text-[10px] text-center font-medium text-slate-400 italic">
          Transaction subject to network gas fees.
        </div>
      </div>
    </div>
  )
}