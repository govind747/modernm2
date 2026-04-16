import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/products/ProductGrid'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types/database'
import { Percent, Clock, Star, Sparkles, Flame, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default async function DealsPage() {
  const supabase = createServerSupabaseClient()

  const { data: dealProducts } = await supabase
    .from('products')
    .select('*')
    .gt('discount', 0)
    .eq('is_active', true)
    .order('discount', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-slate-900 py-24 mb-16">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 bg-brand-accent/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 bg-purple-500/10 blur-[120px] rounded-full" />
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-accent text-sm font-bold mb-8 backdrop-blur-md border border-white/10 uppercase tracking-widest">
            <Flame className="h-4 w-4 fill-current" /> 
            Limited Time Offers
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            The <span className="text-brand-accent">Big Save</span> Event
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Premium electronics at prices that won't last. Refresh your tech stack 
            with our handpicked selection of active deals.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Visual Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 -mt-28 relative z-20">
          {[
            { 
              title: "Mega Discounts", 
              desc: "Up to 50% Off", 
              icon: <Percent />, 
              color: "from-rose-500 to-orange-500",
              shadow: "shadow-rose-500/20"
            },
            { 
              title: "Flash Sales", 
              desc: "Expiring Soon", 
              icon: <Clock />, 
              color: "from-blue-600 to-indigo-600",
              shadow: "shadow-blue-600/20"
            },
            { 
              title: "Daily Specials", 
              desc: "Fresh Arrivals", 
              icon: <Sparkles />, 
              color: "from-emerald-500 to-teal-600",
              shadow: "shadow-emerald-500/20"
            }
          ].map((cat, i) => (
            <div key={i} className={`bg-gradient-to-br ${cat.color} rounded-[2rem] p-8 text-white shadow-2xl ${cat.shadow} hover:-translate-y-2 transition-all duration-300 group cursor-pointer border border-gradient-to-br`}>
              <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-brand-accent">
                {cat.icon}
              </div>
              <h3 className="text-2xl font-bold mb-1 text-white">{cat.title}</h3>
              <p className="text-white/80 font-medium">{cat.desc}</p>
            </div>
          ))}
        </div>

        {/* Main Deals Section */}
        {dealProducts && dealProducts.length > 0 ? (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold text-slate-900">All Active Deals</h2>
                <p className="text-slate-500 font-medium">Prices as marked. While supplies last.</p>
              </div>
              <Badge className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                {dealProducts.length} Items Found
              </Badge>
            </div>
            
            <ProductGrid products={dealProducts as Product[]} />
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border border-dashed border-slate-300 py-32 text-center shadow-inner">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Percent className="h-10 w-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">The deals are resting.</h2>
            <p className="text-slate-500">Check back soon—we refresh our offers every 24 hours.</p>
          </div>
        )}

        {/* Modern Newsletter CTA */}
        <div className="relative mt-24 rounded-[3rem] bg-brand-accent p-12 md:p-20 overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              Get the best deals <br /> straight to your inbox.
            </h3>
            <p className="text-brand-accent-foreground/80 text-lg mb-10 font-medium">
              Join 10,000+ shoppers who receive exclusive discount codes 
              and early access to our weekly flash sales.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <Input
                type="email"
                placeholder="you@example.com"
                className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-2xl px-6 focus-visible:ring-white"
              />
              <Button size="lg" className="h-14 px-8 bg-white text-brand-accent hover:bg-slate-100 font-bold rounded-2xl shadow-xl transition-all">
                Subscribe <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="mt-6 text-sm text-brand-accent-foreground/60">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}