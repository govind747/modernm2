'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/AuthProvider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Trash2, ShoppingCart, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const ITEMS_PER_PAGE = 9

export function ProfileWishlist() {
  const { user } = useAuth()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const fetchWishlist = async () => {
    if (!user) return
    setLoading(true)
    
    const from = (page - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1

    const { data, error, count } = await supabase
      .from('wishlist')
      .select(`
        id,
        product:products(*)
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error("Could not load wishlist")
    } else {
      setItems(data || [])
      setTotalCount(count || 0)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWishlist()

    // Realtime Subscription
    const channel = supabase
      .channel('wishlist_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wishlist', filter: `user_id=eq.${user?.id}` }, 
      () => {
        fetchWishlist()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, page])

  const removeItem = async (id: string) => {
    const { error } = await supabase.from('wishlist').delete().eq('id', id)
    if (error) toast.error("Failed to remove item")
    else toast.success("Removed from wishlist")
  }

  if (loading && items.length === 0) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-accent" /></div>

  if (items.length === 0) return (
    <div className="text-center py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
      <Heart className="mx-auto h-12 w-12 text-slate-300 mb-4" />
      <p className="text-slate-500 font-bold">Your wishlist is empty</p>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="group overflow-hidden rounded-3xl border-slate-100 hover:shadow-xl transition-all duration-300 bg-white">
            <div className="aspect-square relative overflow-hidden bg-slate-100">
              <img 
                src={item.product.image_url} 
                alt={item.product.name}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={() => removeItem(item.id)}
                className="absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-5 space-y-3">
              <h3 className="font-bold text-slate-900 truncate">{item.product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-brand-accent font-black">${item.product.price}</span>
                <Button size="sm" className="bg-slate-900 rounded-xl h-9 hover:bg-brand-accent">
                  <ShoppingCart className="h-4 w-4 mr-2" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalCount > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button 
            variant="outline" 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className="rounded-xl border-slate-200"
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Prev
          </Button>
          <span className="text-sm font-black text-slate-400">Page {page} of {Math.ceil(totalCount / ITEMS_PER_PAGE)}</span>
          <Button 
            variant="outline" 
            disabled={page * ITEMS_PER_PAGE >= totalCount} 
            onClick={() => setPage(p => p + 1)}
            className="rounded-xl border-slate-200"
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}