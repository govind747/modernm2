// app/checkout/page.tsx
'use client'

import { useState } from 'react'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary'
import { AddressSelector } from '@/components/checkout/AddressSelector'
import { useCartStore } from '@/lib/stores/cartStore'
import { useAuth } from '@/components/providers/AuthProvider'
import { AuthModal } from '@/components/auth/AuthModal'
import { Button } from '@/components/ui/button'
import { ShoppingBag, User, ArrowLeft, ShieldCheck, Truck, CreditCard, MapPin } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Address } from '@/lib/types/database'

export default function CheckoutPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [shippingStep, setShippingStep] = useState<'address' | 'shipping' | 'payment'>('address')
  const { items } = useCartStore()
  const { user } = useAuth()

  const handleAddressSelected = (address: Address | null) => {
    setSelectedAddress(address)
    if (address) {
      // Auto-proceed to next step after address selection
      setTimeout(() => setShippingStep('shipping'), 500)
    }
  }

  const handleContinueToShipping = () => {
    if (selectedAddress) {
      setShippingStep('shipping')
    }
  }

  const handleContinueToPayment = () => {
    setShippingStep('payment')
  }

  // 1. Empty Cart State
  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="h-10 w-10 text-slate-300" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Cart is empty</h1>
          <p className="text-slate-500 font-medium mb-10">You cannot checkout without any items in your haul.</p>
          <Link href="/products">
            <Button className="h-14 px-10 bg-slate-900 hover:bg-brand-accent text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-900/10 active:scale-95">
              Go to Store
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // 2. Auth Required State
  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4">
        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm text-center max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 blur-3xl rounded-full -mr-16 -mt-16" />
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-brand-accent" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3">Identification Required</h1>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">
            Please sign in to your account to access secure shipping and Web3 payment protocols.
          </p>
          <Button 
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full h-14 bg-slate-900 hover:bg-brand-accent text-white font-black rounded-2xl shadow-xl transition-all active:scale-95"
          >
            Sign In to Continue
          </Button>
          <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Checkout Header & Stepper */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-8 mb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Button>
              </Link>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-brand-accent font-black uppercase tracking-widest text-xs">
                  <ShieldCheck className="h-4 w-4" />
                  Secure Transaction
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Finalizing Order</h1>
              </div>
            </div>

            {/* Dynamic Steps Indicator */}
            <div className="flex items-center gap-4">
              <Step icon={ShoppingBag} label="Cart" completed />
              <div className={cn("h-px w-8 transition-colors", shippingStep !== 'address' ? "bg-brand-accent" : "bg-slate-200")} />
              <Step icon={MapPin} label="Address" active={shippingStep === 'address'} completed={shippingStep !== 'address'} />
              <div className={cn("h-px w-8 transition-colors", shippingStep === 'payment' ? "bg-brand-accent" : "bg-slate-200")} />
              <Step icon={CreditCard} label="Payment" active={shippingStep === 'payment'} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Checkout Form Area */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8 sm:p-10">
              
              {/* Step 1: Address Selection */}
              {shippingStep === 'address' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-brand-accent" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Delivery Address</h2>
                      <p className="text-xs text-slate-500">Select or add a new address</p>
                    </div>
                  </div>
                  
                  <AddressSelector 
                    onAddressSelected={handleAddressSelected}
                    selectedAddressId={selectedAddress?.id}
                  />
                  
                  {selectedAddress && (
                    <Button
                      onClick={handleContinueToShipping}
                      className="w-full h-14 bg-brand-accent hover:bg-brand-accent/90 text-white font-black rounded-2xl"
                    >
                      Continue to Shipping →
                    </Button>
                  )}
                </div>
              )}

              {/* Step 2: Shipping Method */}
              {shippingStep === 'shipping' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                      <Truck className="h-5 w-5 text-brand-accent" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Shipping Method</h2>
                      <p className="text-xs text-slate-500">Choose delivery option</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border-2 border-brand-accent bg-brand-accent/5 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Truck className="h-5 w-5 text-brand-accent" />
                            <h3 className="font-bold text-slate-900">Standard Shipping</h3>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Delivery in 5-7 business days</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">$9.00</p>
                          <p className="text-xs text-green-600">Free on orders $100+</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-slate-200 rounded-xl p-4 opacity-60">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Truck className="h-5 w-5 text-slate-400" />
                            <h3 className="font-bold text-slate-400">Express Shipping</h3>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">Delivery in 2-3 business days</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-400">$19.99</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShippingStep('address')}
                      className="flex-1 h-14 rounded-2xl"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleContinueToPayment}
                      className="flex-1 h-14 bg-brand-accent hover:bg-brand-accent/90 text-white font-black rounded-2xl"
                    >
                      Continue to Payment →
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {shippingStep === 'payment' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-brand-accent" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Payment Method</h2>
                      <p className="text-xs text-slate-500">Select payment option</p>
                    </div>
                  </div>
                  
                  <CheckoutForm />
                  
                  <Button
                    variant="outline"
                    onClick={() => setShippingStep('shipping')}
                    className="w-full h-14 rounded-2xl mt-4"
                  >
                    ← Back to Shipping
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Checkout Summary Area */}
          <aside className="lg:col-span-5 sticky top-24">
             <div className="space-y-6">
                <div className="bg-slate-900 rounded-[2.5rem] p-1 shadow-2xl shadow-slate-900/20">
                  <div className="bg-white rounded-[2.2rem] overflow-hidden">
                    <CheckoutSummary />
                  </div>
                </div>
                
                {/* Selected Address Preview */}
                {selectedAddress && shippingStep !== 'address' && (
                  <div className="bg-white rounded-[2rem] p-6 border border-slate-100">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-brand-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Shipping to</p>
                        <p className="text-sm text-slate-600 mt-1">
                          {selectedAddress.address_line1}
                          {selectedAddress.address_line2 && `, ${selectedAddress.address_line2}`}
                          <br />
                          {selectedAddress.city}, {selectedAddress.zip_code}
                        </p>
                        <button
                          onClick={() => setShippingStep('address')}
                          className="text-xs text-brand-accent hover:underline mt-2"
                        >
                          Change Address
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Trust Footer */}
                <div className="bg-brand-accent/5 rounded-[2rem] p-6 border border-brand-accent/10 flex items-start gap-4">
                  <ShieldCheck className="h-6 w-6 text-brand-accent shrink-0" />
                  <div>
                    <p className="text-sm font-black text-brand-accent uppercase tracking-widest mb-1">Encrypted Payment</p>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">
                      All transaction data is processed via secure blockchain nodes and encrypted SSL channels.
                    </p>
                  </div>
                </div>
             </div>
          </aside>
          
        </div>
      </div>
    </div>
  )
}

// Step Component
function Step({ icon: Icon, label, active = false, completed = false }: { icon: any, label: string, active?: boolean, completed?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-2 transition-all",
      active || completed ? "opacity-100" : "opacity-40"
    )}>
      <div className={cn(
        "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
        active ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : 
        completed ? "bg-brand-accent text-white" : "bg-slate-100 text-slate-400"
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">{label}</span>
    </div>
  )
}