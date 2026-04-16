'use client'

import { useState, useEffect } from 'react'
import { User, LogOut, Package, ShieldCheck, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCartStore } from '@/lib/stores/cartStore'
import { cn } from '@/lib/utils'

interface UserProfile {
  first_name: string
  last_name: string
  email: string
}

export function UserMenu() {
  const { user } = useAuth()
  const router = useRouter()
  const clearCart = useCartStore((state) => state.clearCart)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) fetchUserProfile()
  }, [user])

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name, email')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    } else {
      clearCart()
      toast.success('Protocol Disconnected')
      router.push('/')
    }
  }

  const getUserInitials = () => {
    if (profile?.first_name) return profile.first_name.charAt(0).toUpperCase()
    if (user?.email) return user.email.charAt(0).toUpperCase()
    return '?'
  }

  const getDisplayName = () => {
    if (profile?.first_name) return profile.first_name
    if (user?.email) return user.email.split('@')[0]
    return 'Operator'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 flex items-center gap-2 px-2 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all"
        >
          <div className="relative">
            <Avatar className="h-7 w-7 border border-brand-accent/50 shadow-[0_0_10px_rgba(var(--brand-accent),0.3)]">
              <AvatarFallback className="bg-brand-accent text-white font-black text-[10px]">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            {/* Online Status Dot */}
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 border-2 border-[#020617] rounded-full" />
          </div>
          <ChevronDown className="h-3 w-3 text-slate-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-64 bg-[#020617]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-2 mt-2" 
        align="end" 
        sideOffset={8}
      >
        {/* User Identity Header */}
        <div className="flex flex-col space-y-1 p-3 mb-2 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3 w-3 text-brand-accent" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent">Verified Operator</p>
          </div>
          <p className="font-black text-sm text-white truncate">
            {getDisplayName()}
          </p>
          <p className="text-[10px] font-medium text-slate-500 truncate">
            {profile?.email || user?.email}
          </p>
        </div>

        <div className="space-y-1">
          <DropdownMenuItem 
            onClick={() => router.push('/orders')}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer text-slate-400 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white rounded-lg transition-all border border-transparent hover:border-white/5 group"
          >
            <Package className="h-4 w-4 group-hover:text-brand-accent" />
            <span className="text-[11px] font-black uppercase tracking-widest">Order History</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => router.push('/profile')}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer text-slate-400 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white rounded-lg transition-all border border-transparent hover:border-white/5 group"
          >
            <User className="h-4 w-4 group-hover:text-brand-accent" />
            <span className="text-[11px] font-black uppercase tracking-widest">Profile Specs</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-white/5 my-2" />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer text-rose-500 hover:bg-rose-500/10 focus:bg-rose-500/10 rounded-lg transition-all group"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-[11px] font-black uppercase tracking-widest">Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}