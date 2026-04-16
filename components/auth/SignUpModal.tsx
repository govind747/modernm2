'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Eye, EyeOff, Zap, ShieldCheck, Cpu } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SignUpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToSignIn: () => void
}

export function SignUpModal({ open, onOpenChange, onSwitchToSignIn }: SignUpModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Identity verification failed: Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`
          }
        }
      })

      if (error) throw error

      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`
          })

        toast.success('Protocol Initialized: Account Created')
        onOpenChange(false)
        router.push('/')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-4xl p-0 overflow-hidden border border-white/20 bg-[#020617] shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ zIndex: 9999 }}
      >
        {/* Custom Close Button - White */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 rounded-full p-2 bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-white" />
        </button>

        <div className="flex flex-col md:flex-row h-auto md:h-[720px]">
          {/* Left Side - Visual Protocol Panel */}
          <div className="hidden md:flex md:w-1/2 bg-slate-950 relative overflow-hidden border-r border-white/10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-accent/20 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col justify-between p-12 w-full">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-brand-accent/20">
                  <Zap className="text-white h-6 w-6 fill-white" />
                </div>
                <span className="text-xl font-black text-white tracking-tighter uppercase">MBONE<span className="text-brand-accent">.</span></span>
              </div>

              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-accent/30 bg-brand-accent/10">
                  <ShieldCheck className="h-3 w-3 text-brand-accent" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-brand-accent">Secure Initialization</span>
                </div>
                <h2 className="text-4xl font-black text-white leading-tight tracking-tighter uppercase italic">
                  Join the <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-400">Next Protocol.</span>
                </h2>
                <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-xs">
                  Access elite hardware and secure transactions on the most advanced electronics marketplace.
                </p>
              </div>

              <div className="flex items-center gap-4 text-slate-600">
                <Cpu className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">System v3.0.4</span>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Terminal */}
          <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col justify-center bg-[#020617]">
            <div className="max-w-sm mx-auto w-full">
              <div className="mb-8">
                <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Create Identity</h1>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Initialize your operator profile</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest text-slate-400">First Name</Label>
                    <Input
                      id="firstName"
                      className="bg-white/5 border-white/10 rounded-xl focus:ring-brand-accent/20 focus:border-brand-accent text-white h-11 transition-all"
                      placeholder="John"
                      required
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Name</Label>
                    <Input
                      id="lastName"
                      className="bg-white/5 border-white/10 rounded-xl focus:ring-brand-accent/20 focus:border-brand-accent text-white h-11 transition-all"
                      placeholder="Doe"
                      required
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Network Address</Label>
                  <Input
                    id="email"
                    type="email"
                    className="bg-white/5 border-white/10 rounded-xl focus:ring-brand-accent/20 focus:border-brand-accent text-white h-11 transition-all"
                    placeholder="name@domain.com"
                    required
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Passkey</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="bg-white/5 border-white/10 rounded-xl focus:ring-brand-accent/20 focus:border-brand-accent text-white h-11 pr-10 transition-all"
                      placeholder="••••••••"
                      required
                      onChange={(e) => handleInputChange('password', e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 pb-2">
                  <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confirm Passkey</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="bg-white/5 border-white/10 rounded-xl focus:ring-brand-accent/20 focus:border-brand-accent text-white h-11 pr-10 transition-all"
                      placeholder="••••••••"
                      required
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white font-black uppercase tracking-widest rounded-xl h-12 shadow-lg shadow-brand-accent/20 transition-all"
                >
                  {loading ? 'Initializing...' : 'Authorize Identity'}
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-black text-slate-600">
                  <span className="bg-[#020617] px-4">Social Gateway</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={handleGoogleAuth}
                className="w-full h-11 rounded-xl border-white/10 bg-white/5 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 flex items-center justify-center gap-3 transition-all"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>

              <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-8">
                Linked to a node?{' '}
                <button onClick={onSwitchToSignIn} className="text-brand-accent hover:underline transition-all">
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}