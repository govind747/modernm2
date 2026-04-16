// components/checkout/AddressSelector.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase } from '@/lib/supabase/client';
import { Address } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Home, Building2, MapPin, Plus, Check, Edit2, Trash2, X, User, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AddressSelectorProps {
  onAddressSelected: (address: Address | null) => void;
  selectedAddressId?: string;
}

export function AddressSelector({ onAddressSelected, selectedAddressId }: AddressSelectorProps) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(selectedAddressId || null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [userFullName, setUserFullName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState<Partial<Address>>({
    type: 'shipping',
    label: 'Home',
    address_line1: '',
    address_line2: '',
    landmark: '',
    area: '',
    city: '',
    state: '',
    country: 'India',
    zip_code: '',
    is_default: false,
  });

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
      fetchAddresses();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', user.id)
        .single();

      let fullName = '';
      let email = '';

      if (!userError && userData) {
        fullName = userData.full_name || '';
        email = userData.email || '';
      } else {
        fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
        email = user.email || '';
      }
      
      setUserFullName(fullName);
      setUserEmail(email);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
      const email = user.email || '';
      setUserFullName(fullName);
      setUserEmail(email);
    }
  };

  const fetchAddresses = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAddresses(data);
      const defaultAddr = data.find(addr => addr.is_default === true);
      if (defaultAddr && !selectedId) {
        setSelectedId(defaultAddr.id);
        onAddressSelected(defaultAddr);
      }
    }
    setLoading(false);
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedId(address.id);
    onAddressSelected(address);
    toast.success(`Address selected: ${address.label || 'Saved Address'}`);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      type: 'shipping',
      label: 'Home',
      address_line1: '',
      address_line2: '',
      landmark: '',
      area: '',
      city: '',
      state: '',
      country: 'India',
      zip_code: '',
      is_default: addresses.length === 0,
    });
    setShowForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      label: address.label || 'Home',
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      landmark: address.landmark || '',
      area: address.area || '',
      city: address.city,
      state: address.state || '',
      country: address.country || 'India',
      zip_code: address.zip_code,
      is_default: address.is_default || false,
    });
    setShowForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId);

    if (!error) {
      toast.success('Address deleted');
      fetchAddresses();
      if (selectedId === addressId) {
        setSelectedId(null);
        onAddressSelected(null);
      }
    } else {
      toast.error('Failed to delete address');
    }
  };

  const handleSaveAddress = async () => {
    if (!user?.id) return;
    
    if (!formData.address_line1 || !formData.city || !formData.zip_code) {
      toast.error('Please fill in all required fields');
      return;
    }

    const addressData = {
      user_id: user.id,
      type: formData.type,
      label: formData.label,
      address_line1: formData.address_line1,
      address_line2: formData.address_line2 || null,
      landmark: formData.landmark || null,
      area: formData.area || null,
      city: formData.city,
      state: formData.state || null,
      country: formData.country || 'India',
      zip_code: formData.zip_code,
      is_default: formData.is_default,
    };

    let error;
    if (editingAddress) {
      const { error: updateError } = await supabase
        .from('addresses')
        .update(addressData)
        .eq('id', editingAddress.id);
      error = updateError;
      if (!error) toast.success('Address updated');
    } else {
      const { error: insertError } = await supabase
        .from('addresses')
        .insert([addressData]);
      error = insertError;
      if (!error) toast.success('Address added');
    }

    if (!error) {
      setShowForm(false);
      fetchAddresses();
      setEditingAddress(null);
    } else {
      toast.error('Failed to save address');
    }
  };

  const handleSetDefault = async (addressId: string) => {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user?.id);

    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addressId);

    if (!error) {
      toast.success('Default address updated');
      fetchAddresses();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />;
      case 'office': return <Building2 className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'home': return 'bg-blue-100 text-blue-600';
      case 'office': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-slate-100 animate-pulse rounded-xl" />
        <div className="h-32 bg-slate-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Info Display */}
      {(userFullName || userEmail) && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Shipping Contact</p>
              <div className="mt-2 space-y-1">
                {userFullName && (
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <User className="h-3 w-3" />
                    <span>{userFullName}</span>
                  </div>
                )}
                {userEmail && (
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Mail className="h-3 w-3" />
                    <span>{userEmail}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Cards */}
      {addresses.length > 0 && !showForm && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Saved Addresses</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddNew}
              className="text-brand-accent border-brand-accent/30 hover:bg-brand-accent/10"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Address
            </Button>
          </div>

          <RadioGroup value={selectedId || ''} onValueChange={(value) => {
            const address = addresses.find(a => a.id === value);
            if (address) handleSelectAddress(address);
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={cn(
                    "relative rounded-xl border-2 transition-all cursor-pointer",
                    selectedId === address.id
                      ? "border-brand-accent bg-brand-accent/5 shadow-md"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                  onClick={() => handleSelectAddress(address)}
                >
                  <RadioGroupItem value={address.id} id={address.id} className="absolute top-4 right-4" />
                  
                  <div className="p-4 pr-12">
                    <div className="flex items-start gap-3">
                      <div className={cn("p-2 rounded-lg", getTypeColor(address.type))}>
                        {getTypeIcon(address.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{address.label || 'Address'}</h4>
                          {address.is_default && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {address.address_line1}
                          {address.address_line2 && `, ${address.address_line2}`}
                          {address.landmark && <br />}
                          {address.landmark && <span className="text-xs text-slate-500">Landmark: {address.landmark}</span>}
                          <br />
                          {address.area && `${address.area}, `}
                          {address.city} - {address.zip_code}
                          <br />
                          {address.state}, {address.country}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAddress(address);
                        }}
                        className="text-xs text-slate-500 hover:text-brand-accent flex items-center gap-1"
                      >
                        <Edit2 className="h-3 w-3" /> Edit
                      </button>
                      {!address.is_default && (
                        <>
                          <span className="text-slate-300">|</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetDefault(address.id);
                            }}
                            className="text-xs text-slate-500 hover:text-brand-accent flex items-center gap-1"
                          >
                            <Check className="h-3 w-3" /> Set Default
                          </button>
                        </>
                      )}
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address.id);
                        }}
                        className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Add New Address Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingAddress(null);
              }}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>

          {/* User Info Display (Read-only) */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold text-slate-600">Full Name</Label>
                <Input
                  value={userFullName}
                  disabled
                  className="bg-slate-100 text-slate-600"
                  placeholder="Name from profile"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-600">Email Address</Label>
                <Input
                  value={userEmail}
                  disabled
                  className="bg-slate-100 text-slate-600"
                  placeholder="Email from profile"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-bold text-slate-600">Address Label *</Label>
              <select
                value={formData.label || 'Home'}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <option value="Home">🏠 Home</option>
                <option value="Office">🏢 Office</option>
                <option value="Other">📍 Other</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-600">Address Type *</Label>
              <select
                value={formData.type || 'shipping'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <option value="shipping">Shipping Only</option>
                <option value="billing">Billing Only</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <Label className="text-xs font-bold text-slate-600">Address Line 1 *</Label>
              <Input
                value={formData.address_line1 || ''}
                onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                placeholder="House number, street name"
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label className="text-xs font-bold text-slate-600">Address Line 2 (Optional)</Label>
              <Input
                value={formData.address_line2 || ''}
                onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                placeholder="Apartment, suite, unit"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-600">Landmark</Label>
              <Input
                value={formData.landmark || ''}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                placeholder="Nearby landmark"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-600">Area / Locality</Label>
              <Input
                value={formData.area || ''}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="Area name"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-600">City *</Label>
              <Input
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-600">State</Label>
              <Input
                value={formData.state || ''}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-600">ZIP Code *</Label>
              <Input
                value={formData.zip_code || ''}
                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                placeholder="Postal code"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-600">Country</Label>
              <select
                value={formData.country || 'India'}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default || false}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="is_default" className="text-sm text-slate-600 cursor-pointer">
                Set as default address
              </Label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleSaveAddress}
              className="flex-1 bg-brand-accent hover:bg-brand-accent/90 text-white"
            >
              {editingAddress ? 'Update Address' : 'Save Address'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditingAddress(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Manual Entry Option */}
      {!showForm && addresses.length > 0 && (
        <div className="text-center pt-4 border-t border-slate-100">
          <button
            onClick={handleAddNew}
            className="text-sm text-brand-accent hover:underline font-medium flex items-center justify-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Or enter a new address manually
          </button>
        </div>
      )}
    </div>
  )
}