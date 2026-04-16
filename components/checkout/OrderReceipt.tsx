'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle2, Printer, ShoppingBag, ArrowLeft } from 'lucide-react'
import { formatUnits } from 'viem'
import Link from 'next/link'

interface OrderReceiptProps {
  order: any;
  user: any;
  onClose?: () => void;
  onContinueShopping?: () => void;
}

export function OrderReceipt({ order, user, onClose, onContinueShopping }: OrderReceiptProps) {
  const subtotal = order.subtotal || 0
  const shipping = order.shipping || 0
  const tax = order.tax || 0
  const total = Number(order.totalUSD) || (subtotal + shipping + tax)

  const displayMBONEFromWei = (weiStr: string | undefined): string => {
    if (!weiStr) return '0.00'
    try {
      return Number(formatUnits(BigInt(weiStr), 18)).toFixed(2)
    } catch {
      return '0.00'
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleContinueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping()
    } else {
      window.location.href = '/products'
    }
  }

  return (
    <div id="printable-receipt" className="bg-white text-slate-900">
      {/* Receipt Content */}
      <div className="p-8 md:p-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-emerald-600">Payment Successful!</h2>
          <p className="text-slate-500 text-sm mt-1">Your order has been confirmed</p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-block bg-brand-accent/10 px-3 py-1 rounded-full mb-4">
              <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">Official Invoice</span>
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase text-slate-900">Settlement</h2>
            <p className="text-xs font-bold text-slate-400 mt-2">
              REFERENCE: <span className="text-slate-900 font-mono">{order.invoiceId}</span>
            </p>
          </div>
          <div className="md:text-right">
            <h3 className="font-black text-brand-accent text-2xl tracking-tighter">MBONE PROTOCOL</h3>
            <p className="text-[10px] font-bold text-slate-500 leading-relaxed mt-1 uppercase tracking-wider">
              Web3 Commerce Division<br />
              123 Crypto Plaza, Block 0x1<br />
              Bangalore, KA 560001
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Billed To</p>
            <div>
              <p className="font-black text-lg text-slate-900 leading-none">
                {order.shippingInfo?.fullName || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous Collector'}
              </p>
              <p className="text-xs font-bold text-slate-500 mt-1">
                {order.shippingInfo?.email || user?.email || 'No email provided'}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Shipping Address</p>
              <p className="text-[9px] font-mono text-slate-600">
                {order.shippingInfo?.address || order.shippingAddress?.line1 || 'Address not provided'}<br />
                {order.shippingInfo?.city || order.shippingAddress?.city}, {order.shippingInfo?.zipCode || order.shippingAddress?.zip}<br />
                {order.shippingInfo?.country || order.shippingAddress?.country || 'India'}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl inline-block max-w-full">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Source Wallet</p>
              <p className="text-[9px] font-mono text-slate-600 break-all">
                {order.walletAddress || '0x00...000'}
              </p>
            </div>
          </div>
          <div className="md:text-right space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Transaction Date</p>
              <p className="font-black text-lg">
                {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full">
              <CheckCircle2 className="h-4 w-4 fill-emerald-600 text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest">Paid via MBONE</span>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-4 text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">
            <div className="col-span-2">Specified Items</div>
            <div className="text-center">Qty</div>
            <div className="text-right">Amount</div>
          </div>
          <div className="h-px bg-slate-100 w-full" />
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="grid grid-cols-4 text-sm font-bold px-2 py-1 items-center">
              <div className="col-span-2">
                <p className="text-slate-900 leading-tight">{item.product.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">UNIT: ${item.product.final_mrp}</p>
              </div>
              <div className="text-center text-slate-500 font-black">×{item.quantity}</div>
              <div className="text-right text-slate-900">
                ${(item.product.final_mrp * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 blur-3xl rounded-full -mr-16 -mt-16" />
          <div className="space-y-3 relative z-10">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Market Subtotal</span><span className="text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Shipping</span>
              <span className="text-white">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Protocol GST (8%)</span><span className="text-white">${tax.toFixed(2)}</span>
            </div>
            <div className="h-px bg-white/10 my-3" />
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 pt-2">
              <div>
                <p className="text-[10px] font-black uppercase text-brand-accent tracking-[0.3em] mb-2">
                  Final On-Chain Settlement
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-black tracking-tighter leading-none">
                    {displayMBONEFromWei(order.totalMBONE)}
                  </p>
                  <div className="bg-brand-accent px-2 py-1 rounded text-[10px] font-black">MBONE</div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">
                  Equivalent Fiat Value
                </p>
                <p className="text-2xl font-black">
                  ${total.toFixed(2)} <span className="text-xs text-slate-500">USD</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] leading-relaxed">
            Authorized Digital Signature — Verified via Sepolia Testnet<br />
            Thank you for securing the MBONE network.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-slate-100 p-6 bg-slate-50 rounded-b-2xl flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={handlePrint}
          className="bg-slate-900 text-white font-black px-8 h-12 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
        >
          <Printer className="h-4 w-4" /> Download / Print Receipt
        </Button>
        <Button
          onClick={handleContinueShopping}
          className="bg-brand-accent text-white font-black px-8 h-12 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-accent/90 transition-colors"
        >
          <ShoppingBag className="h-4 w-4" /> Continue Shopping
        </Button>
      </div>
    </div>
  )
}