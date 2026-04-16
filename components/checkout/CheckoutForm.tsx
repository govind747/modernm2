// components/checkout/CheckoutForm.tsx - Remove name/email from manual form since they come from profile
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { CreditCard, Wallet, MapPin, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { CryptoPayment } from './CryptoPayment'
import { AddressSelector } from './AddressSelector'
import { useCheckoutStore } from '@/lib/stores/checkoutStore'
import { Address } from '@/lib/types/database'
import { cn } from '@/lib/utils'

export function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('crypto')
  const [showManualForm, setShowManualForm] = useState(false)

  const {
    selectedAddress,
    setSelectedAddress,
    shippingInfo,
    setShippingInfo,
  } = useCheckoutStore()

  const handleAddressSelected = (address: Address | null) => {
    setSelectedAddress(address)
    if (address) {
      setShippingInfo({
        ...shippingInfo,
        address: address.address_line1,
        city: address.city,
        state: address.state || '',
        zipCode: address.zip_code,
        country: address.country || 'India'
      })
      setShowManualForm(false)
    } else {
      setShippingInfo({
        ...shippingInfo,
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo({ ...shippingInfo, [field]: value })
  }

  const inputClasses = "h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-900 focus:ring-2 focus:ring-brand-accent/20 transition-all placeholder:text-slate-300 placeholder:font-medium"
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block"

  return (
    <div className="space-y-12">
      {/* Section 1: Destination */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
            <MapPin className="h-5 w-5 text-brand-accent" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Shipping Destination</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Where should we send your gear?</p>
          </div>
        </div>
        
        {/* Address Selector Component - Now auto-fills name/email from profile */}
        <AddressSelector 
          onAddressSelected={handleAddressSelected}
          selectedAddressId={selectedAddress?.id}
        />

        {/* Manual Address Entry Toggle - Name/Email removed since they come from profile */}
        {!selectedAddress && (
          <button
            onClick={() => setShowManualForm(!showManualForm)}
            className="flex items-center gap-2 text-sm text-brand-accent hover:underline mt-2"
          >
            {showManualForm ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showManualForm ? 'Hide manual entry' : 'Or enter address manually'}
          </button>
        )}

        {/* Manual Address Form - Without name/email fields */}
        {(showManualForm || !selectedAddress) && (
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300",
            !showManualForm && !selectedAddress ? "hidden" : ""
          )}>
            <div className="md:col-span-2">
              <Label className={labelClasses}>Physical Address</Label>
              <Input
                className={inputClasses}
                value={shippingInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Street name, suite, or apartment"
              />
            </div>
            
            <div>
              <Label className={labelClasses}>City</Label>
              <Input
                className={inputClasses}
                value={shippingInfo.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
              />
            </div>
            
            <div>
              <Label className={labelClasses}>Zip Code</Label>
              <Input
                className={inputClasses}
                value={shippingInfo.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="00000"
              />
            </div>

            <div>
              <Label className={labelClasses}>State</Label>
              <Input
                className={inputClasses}
                value={shippingInfo.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="State"
              />
            </div>

            <div>
              <Label className={labelClasses}>Country</Label>
              <select
                value={shippingInfo.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-900 focus:ring-2 focus:ring-brand-accent/20 transition-all w-full"
              >
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>
        )}

        {/* Selected Address Preview */}
        {selectedAddress && (
          <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-green-800 uppercase tracking-wider">Selected Address</p>
                <p className="text-sm text-green-700 mt-1">
                  {selectedAddress.address_line1}
                  {selectedAddress.address_line2 && `, ${selectedAddress.address_line2}`}
                  <br />
                  {selectedAddress.landmark && <span>Landmark: {selectedAddress.landmark}<br /></span>}
                  {selectedAddress.area && `${selectedAddress.area}, `}
                  {selectedAddress.city} - {selectedAddress.zip_code}
                  <br />
                  {selectedAddress.state}, {selectedAddress.country}
                </p>
                <button
                  onClick={() => {
                    setSelectedAddress(null)
                    setShowManualForm(true)
                  }}
                  className="text-xs text-green-700 hover:underline mt-2"
                >
                  Change Address
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator className="bg-slate-100" />

      {/* Section 2: Payment Protocol */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Payment Protocol</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select your preferred transaction method</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setPaymentMethod('crypto')}
            className={cn(
              "relative p-6 rounded-[2rem] border-2 text-left transition-all group",
              paymentMethod === 'crypto' 
                ? "border-brand-accent bg-brand-accent/5 ring-4 ring-brand-accent/5" 
                : "border-slate-100 bg-white hover:border-slate-200"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                paymentMethod === 'crypto' ? "bg-brand-accent text-white" : "bg-slate-100 text-slate-400"
              )}>
                <Wallet className="h-6 w-6" />
              </div>
              {paymentMethod === 'crypto' && <CheckCircle2 className="h-6 w-6 text-brand-accent" />}
            </div>
            <h4 className="font-black text-slate-900 tracking-tight">MBONE Token</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Web3 Native Payment</p>
          </button>

          <div className="relative p-6 rounded-[2rem] border-2 border-slate-100 bg-slate-50/50 opacity-60 cursor-not-allowed">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
                <CreditCard className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-2 py-1 rounded-md uppercase tracking-widest">Legacy</span>
            </div>
            <h4 className="font-black text-slate-400 tracking-tight">Fiat Currency</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter italic">Coming soon via Stripe</p>
          </div>
        </div>

        <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
          {paymentMethod === 'crypto' ? (
            <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 text-white relative overflow-hidden">
               <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-accent/10 blur-[100px] rounded-full" />
               <CryptoPayment />
            </div>
          ) : (
            <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
              <p className="text-slate-400 font-bold">Standard card processing is temporarily offline for maintenance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}