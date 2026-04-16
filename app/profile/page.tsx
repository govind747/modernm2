'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { ProfileOrders } from '@/components/profile/ProfileOrders'
import { ProfileWishlist } from '@/components/profile/ProfileWishlist'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { User, Shield, ShoppingBag, Heart, Settings, Bell, CreditCard, ChevronRight, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { useCartStore } from '@/lib/stores/cartStore'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { SecuritySettings } from '@/components/profile/SecuritySettings'

export default function ProfilePage() {
  const { user } = useAuth()
  const clearCart = useCartStore((state) => state.clearCart)
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState('profile')

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

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center container mx-auto px-4">
        <Card className="max-w-md w-full border-none shadow-2xl rounded-[2.5rem] p-8 text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 blur-3xl rounded-full -mr-16 -mt-16" />
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-slate-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Identify Yourself</h1>
          <p className="text-slate-500 mb-8 font-medium">Please sign in to access your personal dashboard.</p>
          <Button 
            onClick={() => router.push('/auth')}
            className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl"
          >
            Return to Login
          </Button>
        </Card>
      </div>
    )
  }

  const sidebarItems = [
    { name: 'Account Info', value: 'profile', icon: User },
    { name: 'My Orders', value: 'orders', icon: ShoppingBag },
    { name: 'Wishlist', value: 'wishlist', icon: Heart },
    { name: 'Preferences', value: 'preferences', icon: Settings },
    { name: 'Security', value: 'security', icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Hero */}
      <div className="bg-white border-b border-slate-100 pt-16 pb-12 mb-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="relative w-24 h-24 bg-brand-accent/5 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
              <User className="h-12 w-12 text-brand-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Dashboard <span className="text-slate-300">/</span> {user.email?.split('@')[0]}
              </h1>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <nav className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 space-y-1">
              {sidebarItems.map((item) => (
                <Button 
                  key={item.value}
                  variant="ghost" 
                  onClick={() => setActiveTab(item.value)}
                  className={cn(
                    "w-full justify-between h-12 px-4 rounded-xl font-bold transition-all group",
                    activeTab === item.value ? "bg-brand-accent/5 text-brand-accent" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-4 w-4", activeTab === item.value ? "text-brand-accent" : "text-slate-400")} />
                    {item.name}
                  </div>
                  <ChevronRight className={cn("h-4 w-4 transition-opacity", activeTab === item.value ? "opacity-100" : "opacity-0")} />
                </Button>
              ))}
              <Separator className="my-2 bg-slate-50" />
              <Button 
                onClick={handleSignOut}
                variant="ghost" 
                className="w-full justify-start gap-3 h-12 px-4 rounded-xl font-bold text-rose-500 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              
              {/* Profile Details Tab */}
              <TabsContent value="profile" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2">
                <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b border-slate-50">
                    <CardTitle className="text-xl font-black">Personal Information</CardTitle>
                    <CardDescription>Manage your identity and contact details.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <ProfileForm />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* My Orders Tab */}
              <TabsContent value="orders" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2">
                <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b border-slate-50">
                    <CardTitle className="text-xl font-black">Purchase History</CardTitle>
                    <CardDescription>Track your tech gear and view digital receipts.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <ProfileOrders />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2">
                <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b border-slate-50">
                    <CardTitle className="text-xl font-black">My Wishlist</CardTitle>
                    <CardDescription>Save your future tech picks and dream gear.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <ProfileWishlist />
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Preferences Tab */}
              <TabsContent value="preferences" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2">
                <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b border-slate-50">
                    <CardTitle className="text-xl font-black">Global Settings</CardTitle>
                    <CardDescription>Customize your notification and display experience.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between group">
                        <div className="space-y-0.5">
                          <Label className="font-black text-slate-900 cursor-pointer">Order Notifications</Label>
                          <p className="text-xs text-slate-500 font-medium">Get updates on your gadget deliveries</p>
                        </div>
                        <Switch 
                          defaultChecked 
                          className="data-[state=checked]:bg-brand-accent data-[state=unchecked]:bg-slate-200 border-2 border-transparent transition-colors"
                        />
                      </div>

                      <Separator className="bg-slate-100" />

                      <div className="flex items-center justify-between group">
                        <div className="space-y-0.5">
                          <Label className="font-black text-slate-900 cursor-pointer">Marketing Emails</Label>
                          <p className="text-xs text-slate-500 font-medium">Exclusive deals on premium electronics</p>
                        </div>
                        <Switch 
                          className="data-[state=checked]:bg-brand-accent data-[state=unchecked]:bg-slate-200 border-2 border-transparent transition-colors"
                        />
                      </div>
                    </div>
                    <Separator />
                    <Button className="bg-slate-900 rounded-xl text-white hover:bg-brand-accent">Save Preferences</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="mt-0 outline-none">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SecuritySettings />
                </motion.div>
              </TabsContent>

            </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}