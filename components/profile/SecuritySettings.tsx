'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ShieldCheck, Wallet, Lock, RefreshCw, KeyRound, Clock } from 'lucide-react'
import { toast } from 'sonner'

export function SecuritySettings({ userWallet }: { userWallet?: string }) {
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const handleLinkWallet = () => {
    setIsPopupOpen(true)
    
    // Auto close popup after 3 seconds
    setTimeout(() => {
      setIsPopupOpen(false)
    }, 3000)
  }

  return (
    <div className="space-y-10">
      {/* Coming Soon Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-4 transform animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-pulse">
                  <Lock className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Coming Soon!</h3>
              <p className="text-slate-600">
                Wallet linking feature is with MBONE wallets only. 
                Get secure wallet integration for 2FA and password recovery.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 bg-slate-50 rounded-xl p-3">
                <Clock className="h-4 w-4" />
                <span>Expected Update: Q3 2026</span>
              </div>
              <Button 
                onClick={() => setIsPopupOpen(false)}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Password Change Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-slate-900" />
          <h3 className="text-xl font-black text-slate-900">Update Password</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-400">Current Password</Label>
            <Input type="password" placeholder="••••••••" className="h-12 bg-white rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-400">New Password</Label>
            <Input type="password" placeholder="••••••••" className="h-12 bg-white rounded-xl" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button 
              className="bg-slate-900 text-white rounded-xl px-8 h-11 font-bold hover:bg-slate-800 transition-all"
              onClick={() => toast.info("Password update feature coming soon")}
            >
              Update Password
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      {/* 2. Web3 Wallet & Recovery Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-slate-900" />
            <h3 className="text-xl font-black text-slate-900">Wallet Recovery & 2FA</h3>
          </div>
          <ShieldCheck className="h-6 w-6 text-emerald-500" />
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-3xl" />
          
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Connected Recovery Wallet</Label>
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                  {userWallet ? '0x' : '?'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-mono truncate max-w-[200px] sm:max-w-md">
                    {userWallet || 'No wallet connected for recovery'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                    Used for password resets and 2FA signing
                  </p>
                </div>
                {userWallet && (
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 rounded-lg h-9"
                    onClick={() => toast.info("Wallet change feature coming soon")}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              By linking your wallet, you can use it to sign transactions as a **Second Factor (2FA)**. This wallet also acts as your ultimate recovery tool if you lose access to your account.
            </p>

            <Button 
              className="w-full h-12 bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl"
              onClick={handleLinkWallet}
            >
              {userWallet ? 'Change Recovery Wallet' : 'Link Wallet Address'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}