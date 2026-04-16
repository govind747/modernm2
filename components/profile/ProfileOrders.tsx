'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/AuthProvider'
import { Order, OrderItem, Shipment } from '@/lib/types/database'
import { OrderCard } from '@/components/orders/OrderCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ShoppingBag, ArrowRight, Loader2, Inbox } from 'lucide-react'
import Link from 'next/link'

interface OrderWithItems extends Order {
  order_items: OrderItem[]
  shipments: Shipment[]
}

export function ProfileOrders() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) fetchRecentOrders()
  }, [user])

  const fetchRecentOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, order_items(*), shipments(*)`)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3) // Only show the most recent 3 on the profile overview

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-32 w-full bg-slate-100 animate-pulse rounded-[2rem]" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
            <Inbox className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900">No orders yet</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-[200px]">Your future gear will appear right here.</p>
          <Link href="/products">
            <Button size="sm" className="bg-slate-900 text-white font-bold rounded-xl px-6 hover:bg-brand-accent">
              Start Shopping
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-0.5">
          <h2 className="text-xl font-black text-slate-900">Recent Orders</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last 3 Transactions</p>
        </div>
        <Link href="/orders">
          <Button variant="ghost" className="text-brand-accent font-black text-xs uppercase tracking-widest hover:bg-brand-accent/5 group">
            View Full History <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}