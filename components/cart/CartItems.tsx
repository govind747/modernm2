// components/cart/CartItems.tsx
'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/stores/cartStore'
import { cn } from '@/lib/utils'
import { ClientOnly } from '@/components/ClientOnly'

function CartItemsContent() {
  const { items, updateQuantity, removeItem } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500 font-medium">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-50">
      {items.map((item) => (
        <div 
          key={item.product.id} 
          className="group p-6 sm:p-8 transition-colors hover:bg-slate-50/50"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Product Image - Large & Rounded */}
            <div className="relative w-full sm:w-32 h-32 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-200/50">
              <Image
                src={item.product.image_url || '/placeholder-product.jpg'}
                alt={item.product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col h-full justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 truncate tracking-tight mb-1">
                    {item.product.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    {item.product.is_featured ? 'Exclusive Tech' : 'ModernMart Selection'}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-brand-accent">
                      ${item.product.final_mrp.toFixed(2)}
                    </span>
                    {item.product.mrp > item.product.final_mrp && (
                      <span className="text-sm font-bold text-slate-300 line-through">
                        ${item.product.mrp.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Warning */}
                {item.quantity >= item.product.stock_quantity && (
                  <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-tighter">
                    <AlertCircle className="h-3 w-3" />
                    Maximum Stock Reached
                  </div>
                )}
              </div>
            </div>

            {/* Controls Section */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4 border-t sm:border-t-0 pt-4 sm:pt-0">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <span className="px-4 text-sm font-black text-slate-900 min-w-[40px] text-center">
                  {item.quantity}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock_quantity}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden sm:block text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</p>
                   <p className="text-sm font-black text-slate-900">
                     ${(item.product.final_mrp * item.quantity).toFixed(2)}
                   </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.product.id)}
                  className="h-10 w-10 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Visual Footer for the Cart List */}
      <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400">Inventory Reserved for 15:00 Minutes</p>
        <p className="text-xs font-black text-brand-accent uppercase tracking-widest">
          {items.reduce((acc, item) => acc + item.quantity, 0)} Total Units
        </p>
      </div>
    </div>
  )
}

export function CartItems() {
  return (
    <ClientOnly>
      <CartItemsContent />
    </ClientOnly>
  )
}