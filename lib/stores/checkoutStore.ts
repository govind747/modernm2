// lib/stores/checkoutStore.ts
import { create } from 'zustand'
import { Address } from '@/lib/types/database'

interface ShippingInfo {
  fullName: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface CheckoutStore {
  selectedAddress: Address | null
  shippingInfo: ShippingInfo
  shipping: number
  tax: number
  subtotal: number
  totalUSD: number
  setSelectedAddress: (address: Address | null) => void
  setShippingInfo: (info: ShippingInfo) => void
  setTotals: (subtotal: number, shipping: number, tax: number) => void
  setUserContactInfo: (fullName: string, email: string) => void
  clearCheckout: () => void
}

const initialShippingInfo: ShippingInfo = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'India'
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  selectedAddress: null,
  shippingInfo: initialShippingInfo,
  shipping: 0,
  tax: 0,
  subtotal: 0,
  totalUSD: 0,
  
  setSelectedAddress: (address) => set({ selectedAddress: address }),
  
  setShippingInfo: (info) => set({ shippingInfo: info }),
  
  setTotals: (subtotal, shipping, tax) => {
    const totalUSD = subtotal + shipping + tax
    set({ subtotal, shipping, tax, totalUSD })
  },
  
  setUserContactInfo: (fullName, email) => set((state) => ({
    shippingInfo: {
      ...state.shippingInfo,
      fullName: fullName || state.shippingInfo.fullName,
      email: email || state.shippingInfo.email
    }
  })),
  
  clearCheckout: () => set({
    selectedAddress: null,
    shippingInfo: initialShippingInfo,
    shipping: 0,
    tax: 0,
    subtotal: 0,
    totalUSD: 0
  })
}))