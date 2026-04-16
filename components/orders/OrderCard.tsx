'use client'

import { useState } from 'react'
import { Package, Clock, CircleCheck as CheckCircle, Circle as XCircle, Truck, ExternalLink, Wallet, ChevronDown, ChevronUp, Hash, ArrowUpRight, Box } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Order, OrderItem, Shipment } from '@/lib/types/database'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface OrderWithItems extends Order {
  order_items: OrderItem[]
  shipments: Shipment[]
}

interface OrderCardProps {
  order: OrderWithItems
}

export function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false)
  const shipment = order.shipments?.[0]

  const statusConfig = {
    pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', dot: 'bg-amber-500' },
    paid: { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10', dot: 'bg-blue-500' },
    shipped: { icon: Truck, color: 'text-emerald-500', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
    cancelled: { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10', dot: 'bg-rose-500' },
    default: { icon: Package, color: 'text-slate-500', bg: 'bg-slate-500/10', dot: 'bg-slate-500' },
  }

  const status = (statusConfig[order.status as keyof typeof statusConfig] || statusConfig.default)
  const StatusIcon = status.icon

  return (
    <Card className="group border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] overflow-hidden bg-white">
      <CardContent className="p-0">
        {/* Header Summary */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Order ID</span>
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {order.invoice_id?.slice(0, 12) || `#${order.id.slice(-8).toUpperCase()}`}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-400">
                Processed on {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className={cn("flex items-center gap-2 px-4 py-1.5 rounded-full border border-transparent transition-colors", status.bg, status.color)}>
                <div className={cn("h-2 w-2 rounded-full animate-pulse", status.dot)} />
                <span className="text-xs font-black uppercase tracking-widest">{order.status}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setExpanded(!expanded)}
                className={cn("rounded-full bg-slate-50 transition-transform duration-300", expanded && "rotate-180")}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="my-6 bg-slate-50" />

          {/* Quick Stats Row */}
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Items</p>
                <p className="text-lg font-bold text-slate-900 leading-none">{order.order_items.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">USD Value</p>
                <p className="text-lg font-bold text-slate-900 leading-none">${order.total_usd.toFixed(2)}</p>
              </div>
              {order.total_mbone && (
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Crypto Total</p>
                  <p className="text-lg font-bold text-brand-accent leading-none">
                    {(Number(order.total_mbone) / 1e18 > 1 ? Number(order.total_mbone) / 1e18 : Number(order.total_mbone)).toFixed(2)} MBONE
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {shipment?.tracking_number && (
                <Button size="sm" className="bg-slate-900 text-white rounded-xl font-bold h-9 px-5 hover:bg-brand-accent">
                  Track Parcel
                </Button>
              )}
              {order.payment_tx_hash && (
                <a 
                  href={`https://sepolia.etherscan.io/tx/${order.payment_tx_hash}`}
                  target="_blank"
                  className="flex items-center justify-center h-9 w-9 bg-brand-accent/5 text-brand-accent rounded-xl hover:bg-brand-accent hover:text-white transition-all"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="px-6 pb-8 sm:px-8 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Products Table */}
            <div className="bg-slate-50/50 rounded-2xl p-4 sm:p-6 border border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Box className="h-3 w-3" /> Manifest
              </h4>
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center group/item">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">Product SKU: {item.product_id.slice(0, 12)}...</span>
                      <span className="text-xs font-medium text-slate-400">Quantity: {item.quantity}</span>
                    </div>
                    <span className="text-sm font-black text-slate-700">${item.price_usd.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipment Module */}
              {shipment && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Truck className="h-3 w-3" /> Shipping Logistics
                  </h4>
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Status</span>
                      <Badge variant="outline" className="rounded-lg border-slate-200 font-bold text-[10px]">{shipment.status.toUpperCase()}</Badge>
                    </div>
                    {shipment.tracking_number && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Waybill</span>
                        <span className="text-xs font-mono font-bold text-slate-700">{shipment.tracking_number}</span>
                      </div>
                    )}
                    {shipment.estimated_delivery && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Est. Arrival</span>
                        <span className="text-xs font-bold text-slate-700">{new Date(shipment.estimated_delivery).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment/Web3 Module */}
              {order.wallet_address && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-brand-accent flex items-center gap-2">
                    <Hash className="h-3 w-3" /> Blockchain Ledger
                  </h4>
                  <div className="bg-brand-accent/5 border border-brand-accent/10 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-brand-accent/60 uppercase tracking-widest">Signer Wallet</span>
                      <p className="text-[10px] font-mono font-bold text-brand-accent break-all leading-relaxed">
                        {order.wallet_address}
                      </p>
                    </div>
                    {order.order_hash && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-brand-accent/60 uppercase tracking-widest">Order Hash</span>
                        <p className="text-[10px] font-mono font-bold text-slate-600 break-all leading-relaxed">
                          {order.order_hash}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}