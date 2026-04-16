'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  User, Mail, Phone, Calendar, Save, Loader2, ImageIcon, Home, 
  Briefcase, MapPin, Trash2, Plus, Edit2, Building, Heart, StarIcon,
  CheckCircle2, Lock
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'

interface ProfileFormData {
  first_name: string
  last_name: string
  full_name: string
  phone: string
  avatar_url: string
}

interface Address {
  id?: string
  type: 'home' | 'office' | 'work' | 'friend'
  label: string
  address_line1: string
  address_line2: string
  landmark: string
  area: string
  city: string
  state: string
  country: string
  zip_code: string
  is_default: boolean
  user_id?: string
}

export function ProfileForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    full_name: '',
    phone: '',
    avatar_url: ''
  })
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [savingAddress, setSavingAddress] = useState(false)

  const [addressForm, setAddressForm] = useState<Partial<Address>>({
    type: 'home',
    label: '',
    address_line1: '',
    address_line2: '',
    landmark: '',
    area: '',
    city: '',
    state: '',
    country: 'India',
    zip_code: '',
    is_default: false
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchAddresses()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) throw error

      if (data) {
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          full_name: data.full_name || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || ''
        })
        setAvatarUrl(data.avatar_url || '')
      }
    } catch (error) {
      toast.error('Unable to fetch profile details')
    } finally {
      setLoading(false)
    }
  }

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false })

      if (error) throw error
      setAddresses(data || [])
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newFirst = name === 'first_name' ? value : prev.first_name
      const newLast = name === 'last_name' ? value : prev.last_name
      return {
        ...prev,
        [name]: value,
        full_name: `${newFirst} ${newLast}`.trim()
      }
    })
  }

  const handleAddressInputChange = (field: keyof Address, value: string | boolean) => {
    setAddressForm(prev => ({ ...prev, [field]: value }))
  }

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />
      case 'office': return <Building className="h-4 w-4" />
      case 'work': return <Briefcase className="h-4 w-4" />
      case 'friend': return <Heart className="h-4 w-4" />
      default: return <MapPin className="h-4 w-4" />
    }
  }

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case 'home': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'office': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'work': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'friend': return 'bg-pink-100 text-pink-700 border-pink-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const handleSaveAddress = async () => {
    if (!addressForm.address_line1 || !addressForm.city || !addressForm.zip_code) {
      toast.error('Please fill in required fields')
      return
    }

    setSavingAddress(true)
    try {
      if (addressForm.is_default) {
        await supabase.from('addresses').update({ is_default: false }).eq('user_id', user?.id)
      }

      const payload = { ...addressForm, user_id: user?.id }
      const { error } = editingAddress?.id 
        ? await supabase.from('addresses').update(payload).eq('id', editingAddress.id)
        : await supabase.from('addresses').insert([payload])

      if (error) throw error

      toast.success(editingAddress ? 'Address updated' : 'Address added')
      setIsAddressDialogOpen(false)
      fetchAddresses()
    } catch (error) {
      toast.error('Failed to save address')
    } finally {
      setSavingAddress(false)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    try {
      const { error } = await supabase.from('addresses').delete().eq('id', id)
      if (error) throw error
      toast.success('Address removed')
      fetchAddresses()
    } catch (error) {
      toast.error('Could not delete address')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({ ...formData, avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .eq('id', user?.id)

      if (error) throw error
      toast.success('Profile saved successfully')
      router.refresh()
    } catch (error) {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
      <p className="text-slate-400 font-bold animate-pulse">Syncing your profile...</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Avatar Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start gap-8 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100"
      >
        <div className="relative group">
          <motion.div 
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -inset-1.5 bg-gradient-to-r from-slate-900 to-blue-500 rounded-full blur opacity-20" 
          />
          <Avatar className="h-32 w-32 border-4 border-white shadow-2xl relative">
            <AvatarImage src={avatarUrl} className="object-cover" />
            <AvatarFallback className="bg-slate-900 text-white text-3xl font-black">
              {formData.first_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 space-y-4 w-full">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900">Profile Identity</h3>
            <p className="text-sm text-slate-500 font-medium">Update your avatar URL for a personalized look</p>
          </div>
          <div className="relative group">
            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <Input 
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://image-url.com/avatar.jpg"
              className="pl-12 bg-white border-slate-100 rounded-xl focus:ring-slate-900/5"
            />
          </div>
        </div>
      </motion.div>

      {/* Profile Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">First Name</Label>
          <Input name="first_name" value={formData.first_name} onChange={handleInputChange} className="h-12 bg-white border-slate-100 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</Label>
          <Input name="last_name" value={formData.last_name} onChange={handleInputChange} className="h-12 bg-white border-slate-100 rounded-xl" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name (Auto-generated)</Label>
          <div className="relative">
            <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
            <Input value={formData.full_name} disabled className="h-12 pl-12 bg-slate-50 border-none rounded-xl font-bold" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email (Private)</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
            <Input value={user?.email || ''} disabled className="h-12 pl-12 bg-slate-50 border-none rounded-xl italic" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone</Label>
          <Input name="phone" value={formData.phone} onChange={handleInputChange} className="h-12 bg-white border-slate-100 rounded-xl" />
        </div>
      </div>

      <Separator />

      {/* Address Management */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">Saved Addresses</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Manage your gadget delivery locations</p>
          </div>
          <Button 
            type="button"
            onClick={() => { setEditingAddress(null); setAddressForm({ type: 'home', country: 'India' }); setIsAddressDialogOpen(true); }}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Address
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {addresses.map((addr, idx) => (
              <motion.div
                key={addr.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05, ease: [0.23, 1, 0.32, 1] }}
              >
                <Card className={cn(
                  "relative border-2 transition-all hover:shadow-xl hover:-translate-y-1",
                  addr.is_default ? "border-slate-900/20 bg-slate-50" : "border-slate-100"
                )}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className={cn("p-1.5 rounded-lg", getAddressTypeColor(addr.type))}>
                          {getAddressTypeIcon(addr.type)}
                        </div>
                        <span className="font-black text-sm">{addr.label || addr.type}</span>
                        {addr.is_default && <Badge className="bg-slate-900 text-[10px]">Default</Badge>}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingAddress(addr); setAddressForm(addr); setIsAddressDialogOpen(true); }}><Edit2 className="h-3 w-3"/></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteAddress(addr.id!)} className="text-rose-500"><Trash2 className="h-3 w-3"/></Button>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p>{addr.address_line1}</p>
                      <p>{addr.city}, {addr.state} - {addr.zip_code}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            type="submit" 
            disabled={saving} 
            className="h-12 px-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-2xl shadow-slate-900/20"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Profile
          </Button>
        </motion.div>
      </div>

      {/* Address Dialog - Detailed for Precise Delivery */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-[2rem] p-8 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-brand-accent" />
              {editingAddress ? 'Update Delivery Details' : 'Add New Delivery Address'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-6">
            {/* Address Type Selection */}
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Where should we deliver?</Label>
              <RadioGroup 
                value={addressForm.type} 
                onValueChange={(v) => handleAddressInputChange('type', v as any)} 
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                {['home', 'office', 'work', 'friend'].map((t) => (
                  <div key={t} className="relative">
                    <RadioGroupItem value={t} id={`type-${t}`} className="peer sr-only" />
                    <Label 
                      htmlFor={`type-${t}`} 
                      className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-slate-100 bg-white cursor-pointer transition-all peer-data-[state=checked]:border-slate-900 peer-data-[state=checked]:bg-slate-50 hover:bg-slate-50"
                    >
                      {getAddressTypeIcon(t)}
                      <span className="text-xs font-bold mt-1 capitalize">{t}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Line 1 & 2 */}
              <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Address Line 1 (House/Flat/Building)*</Label>
                <Input required placeholder="e.g. 402, Sterling Apartments" value={addressForm.address_line1} onChange={(e) => handleAddressInputChange('address_line1', e.target.value)} className="rounded-xl h-12" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Address Line 2 (Street/Locality)</Label>
                <Input placeholder="e.g. Main Street, Hiranandani" value={addressForm.address_line2} onChange={(e) => handleAddressInputChange('address_line2', e.target.value)} className="rounded-xl h-12" />
              </div>

              {/* Landmark & Area */}
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Nearest Landmark</Label>
                <Input placeholder="e.g. Opposite City Hospital" value={addressForm.landmark} onChange={(e) => handleAddressInputChange('landmark', e.target.value)} className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Area</Label>
                <Input placeholder="e.g. Powai" value={addressForm.area} onChange={(e) => handleAddressInputChange('area', e.target.value)} className="rounded-xl h-12" />
              </div>

              {/* City & Zip */}
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">City*</Label>
                <Input required placeholder="Mumbai" value={addressForm.city} onChange={(e) => handleAddressInputChange('city', e.target.value)} className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Zip Code*</Label>
                <Input required placeholder="400076" value={addressForm.zip_code} onChange={(e) => handleAddressInputChange('zip_code', e.target.value)} className="rounded-xl h-12" />
              </div>

              {/* State & Country */}
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">State</Label>
                <Input placeholder="Maharashtra" value={addressForm.state} onChange={(e) => handleAddressInputChange('state', e.target.value)} className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Country</Label>
                <Input value={addressForm.country} onChange={(e) => handleAddressInputChange('country', e.target.value)} className="rounded-xl h-12 bg-slate-50" />
              </div>
            </div>

            {/* Default Checkbox */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <input 
                type="checkbox" 
                id="make-default" 
                className="w-5 h-5 rounded-md border-slate-300 text-slate-900 focus:ring-slate-900"
                checked={addressForm.is_default} 
                onChange={(e) => handleAddressInputChange('is_default', e.target.checked)} 
              />
              <Label htmlFor="make-default" className="text-sm font-bold text-slate-700 cursor-pointer">
                Set as default delivery address
              </Label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button variant="ghost" onClick={() => setIsAddressDialogOpen(false)} className="flex-1 h-12 rounded-xl font-bold">Cancel</Button>
            <Button onClick={handleSaveAddress} disabled={savingAddress} className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg">
              {savingAddress ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Address Details'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  )
}