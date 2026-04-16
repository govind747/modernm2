'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, ArrowLeft, Zap, ShieldAlert, RefreshCw, CheckCircle2, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ForgotPasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToSignIn: () => void
}

export function ForgotPasswordModal({ open, onOpenChange, onSwitchToSignIn }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      
      if (error) throw error
      
      setEmailSent(true)
      toast.success('Recovery Protocol Initiated')
    } catch (error: any) {
      toast.error(`Protocol Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setEmail('')
    setEmailSent(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-4xl p-0 overflow-hidden border border-white/20 bg-[#020617] shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ zIndex: 9999 }}
      >
        {/* Custom Close Button - White */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-50 rounded-full p-2 bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-white" />
        </button>

        <div className="flex flex-col md:flex-row h-auto md:h-[520px]">
          {/* Left Side - Visual Recovery Panel */}
          <div className="hidden md:flex md:w-1/2 bg-slate-950 relative overflow-hidden border-r border-white/10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col justify-between p-12 w-full">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-brand-accent/20">
                  <Zap className="text-white h-6 w-6 fill-white" />
                </div>
                <span className="text-xl font-black text-white tracking-tighter uppercase">MBONE<span className="text-brand-accent">.</span></span>
              </div>

              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10">
                  <ShieldAlert className="h-3 w-3 text-orange-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Recovery Mode</span>
                </div>
                <h2 className="text-4xl font-black text-white leading-tight tracking-tighter uppercase italic">
                  Key <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Restoration.</span>
                </h2>
                <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-xs">
                  Lost access to your node? Provide your registered email to receive a secure restoration link.
                </p>
              </div>

              <div className="flex items-center gap-4 text-slate-600">
                <RefreshCw className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol v3.0.4</span>
              </div>
            </div>
          </div>

          {/* Right Side - Recovery Terminal */}
          <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col justify-center bg-[#020617]">
            <div className="max-w-sm mx-auto w-full">
              {!emailSent ? (
                <>
                  <div className="mb-8">
                    <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Recover Access</h1>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Request a temporary passkey</p>
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registered Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="operator@mbone.com"
                        className="bg-white/5 border-white/10 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 text-white h-11"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest rounded-xl h-12 shadow-lg shadow-orange-900/20 transition-all"
                    >
                      {loading ? 'Processing...' : 'Authorize Recovery'}
                    </Button>
                  </form>

                  <button
                    type="button"
                    onClick={onSwitchToSignIn}
                    className="mt-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back to Connection
                  </button>
                </>
              ) : (
                <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                  <div className="relative inline-flex">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                    <div className="relative w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Verify Inbox</h1>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 leading-relaxed">
                      Restoration link transmitted to:
                    </p>
                    <p className="mt-2 text-sm font-black text-brand-accent tracking-tight">{email}</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
                      Link expires in 60 minutes. Check spam nodes if not found.
                    </p>
                    
                    <Button
                      onClick={() => setEmailSent(false)}
                      variant="outline"
                      className="w-full h-11 border-white/10 bg-white/5 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                    >
                      Resend Protocol
                    </Button>

                    <button
                      type="button"
                      onClick={onSwitchToSignIn}
                      className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                    >
                      Return to Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}