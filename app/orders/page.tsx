// app/orders/page.tsx - Fixed version

'use client'

import { useEffect, useState } from 'react'
import { Package, Search, ShoppingBag, ArrowRight, Filter, Loader2, Inbox } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase/client'
import { Order, OrderItem, Shipment } from '@/lib/types/database'
import { OrderCard } from '@/components/orders/OrderCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface OrderWithItems extends Order {
  order_items: OrderItem[]
  shipments: Shipment[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    if (user) fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, order_items(*), shipments(*)`)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => 
    order.invoice_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ✅ Fixed: Use only valid status types that exist in your Order type
  const activeOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'failed' && o.status !== 'paid')
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length
  const totalSpent = orders.reduce((acc, o) => acc + o.total_usd, 0)

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center container mx-auto px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-slate-300" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3">Locked Content</h1>
          <p className="text-slate-500 font-medium mb-8">Please sign in to your ModernMart account to view your purchase history.</p>
          <Button className="w-full h-12 bg-slate-900 hover:bg-brand-accent text-white font-bold rounded-xl transition-all shadow-xl">
            Sign In Now
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-100 pt-16 pb-12 mb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-brand-accent font-black uppercase tracking-widest text-xs">
                <Package className="h-4 w-4" />
                Management
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order History</h1>
              <p className="text-slate-500 font-medium italic">Showing your last {orders.length} transactions</p>
            </div>
            
            {/* Search & Filter Bar */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-accent transition-colors" />
                <Input 
                  placeholder="ID or Invoice..." 
                  className="h-12 pl-12 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-brand-accent/10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-white border border-slate-100 shadow-sm">
                <Filter className="h-5 w-5 text-slate-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 w-full bg-white animate-pulse rounded-[2.5rem] border border-slate-100" />
            ))}
            <div className="flex flex-col items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-accent mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Ledger...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[3rem] border border-slate-100 p-16 text-center shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 group overflow-hidden relative">
               <div className="absolute inset-0 bg-brand-accent/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
               <Inbox className="h-10 w-10 text-slate-300 relative z-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">No Transactions Found</h2>
            <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">
              {searchQuery ? "We couldn't find any orders matching your search." : "You haven't made any purchases yet. Your future tech hauls will appear right here."}
            </p>
            <Link href="/products">
              <Button className="h-14 px-10 bg-slate-900 hover:bg-brand-accent text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-900/10 active:scale-95 group">
                Browse Collection <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Status Summary Tickers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
               {[
                 { label: 'Total Spent', value: `$${totalSpent.toLocaleString()}` },
                 { label: 'Active Orders', value: activeOrders.length },
                 { label: 'Cancelled', value: cancelledOrders },
                 { label: 'UMBDT Balance', value: '0' }
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                 </div>
               ))}
            </div>

            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}