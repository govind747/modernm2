// lib/stores/cartStore.ts
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/lib/types/database'
import { supabase } from '@/lib/supabase/client'

interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  syncWithDatabase: (userId: string) => Promise<void>
  loadFromDatabase: (userId: string) => Promise<void>
  hydrate: () => void
}

// Create store with proper SSR handling
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id)
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            }
          } else {
            return {
              items: [...state.items, { product, quantity }]
            }
          }
        })
        
        // Sync with database if user is logged in
        const syncWithDB = async () => {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            get().syncWithDatabase(user.id)
          }
        }
        syncWithDB()
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.product.id !== productId)
        }))
        
        // Sync with database if user is logged in
        const syncWithDB = async () => {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            await supabase
              .from('cart_items')
              .delete()
              .eq('user_id', user.id)
              .eq('product_id', productId)
          }
        }
        syncWithDB()
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        }))
        
        // Sync with database if user is logged in
        const syncWithDB = async () => {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            get().syncWithDatabase(user.id)
          }
        }
        syncWithDB()
      },

      clearCart: () => {
        set({ items: [] })
        
        // Clear from database if user is logged in
        const clearFromDB = async () => {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            await supabase
              .from('cart_items')
              .delete()
              .eq('user_id', user.id)
          }
        }
        clearFromDB()
      },

      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => total + (item.product.final_mrp * item.quantity), 0)
      },

      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },

      syncWithDatabase: async (userId: string) => {
        const { items } = get()
        
        try {
          // Clear existing cart items for user
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)
          
          // Insert current cart items
          if (items.length > 0) {
            const cartItems = items.map(item => ({
              user_id: userId,
              product_id: item.product.id,
              quantity: item.quantity
            }))
            
            await supabase
              .from('cart_items')
              .insert(cartItems)
          }
        } catch (error) {
          console.error('Error syncing cart with database:', error)
        }
      },

      loadFromDatabase: async (userId: string) => {
        try {
          const { data: cartItems, error } = await supabase
            .from('cart_items')
            .select(`
              *,
              product:products(*)
            `)
            .eq('user_id', userId)
          
          if (error) throw error
          
          if (cartItems && cartItems.length > 0) {
            const items = cartItems.map(item => ({
              product: item.product,
              quantity: item.quantity
            }))
            
            set({ items })
          }
        } catch (error) {
          console.error('Error loading cart from database:', error)
        }
      },

      hydrate: () => {
        // Manual hydration if needed
        const persistedData = localStorage.getItem('cart-storage')
        if (persistedData) {
          try {
            const { state } = JSON.parse(persistedData)
            if (state && state.items) {
              set({ items: state.items })
            }
          } catch (e) {
            console.error('Failed to hydrate cart store:', e)
          }
        }
      }
    }),
    {
      name: 'cart-storage',
      // Add this to handle SSR
      skipHydration: true,
    }
  )
)

// Helper to initialize store on client side only
export const initCartStore = () => {
  if (typeof window !== 'undefined') {
    useCartStore.persist.rehydrate()
  }
}