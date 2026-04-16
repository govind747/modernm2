'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { useCartStore } from '@/lib/stores/cartStore'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { loadFromDatabase, syncWithDatabase } = useCartStore()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      // Load cart from database when user is authenticated
      if (user) {
        await loadFromDatabase(user.id)
      }
      
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        // Handle cart synchronization on auth state changes
        if (event === 'SIGNED_IN' && session?.user) {
          // Load cart from database when user signs in
          await loadFromDatabase(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          // Clear cart when user signs out (optional)
          // You might want to keep local cart for guest users
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [loadFromDatabase])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}