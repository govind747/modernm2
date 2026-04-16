// app/page.tsx - Fix the petCategories type

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/products/ProductGrid'
import { Button } from '@/components/ui/button'
import { ArrowRight, PawPrint, Heart, Shield, Truck, Zap, Gift, Percent, Package, ChevronRight, Star, Dog, Cat, Bird, Fish, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { Product } from '@/lib/types/database'
import { cn } from '@/lib/utils'
import HeroSection from '@/components/home/HeroSection'
import ProductCarousel from '@/components/products/ProductCarousel'

// Define the type for pet categories
interface PetCategory {
  name: string;
  icon: LucideIcon | string;
  count: string;
  color: string;
  href: string;
}

export default async function HomePage() {
  const supabase = createServerSupabaseClient()

  // Fetch hero images from database
  const { data: heroImages } = await supabase
    .from('hero_images')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  // Fetch products for each exclusive reward category
  const fetchProductsByReward = async (reward: string) => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('exclusive_reward', reward)
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(8)
    return data as Product[] || []
  }

  // Fetch featured products (fallback)
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(8)

  // Fetch products by category using product name search (since no category column)
  const fetchProductsByCategory = async (keyword: string) => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${keyword}%`)
      .eq('is_active', true)
      .limit(4)
    return data as Product[] || []
  }

  // Fetch all sections in parallel
  const [gamingBundle, freeShipping, rewards, techEssentials, discountOffer, dogProducts, catProducts] = await Promise.all([
    fetchProductsByReward('Gaming bundle'),
    fetchProductsByReward('Free shipping'),
    fetchProductsByReward('5% rewards'),
    fetchProductsByReward('Tech essentials'),
    fetchProductsByReward('15% off next order'),
    fetchProductsByCategory('Dog'),
    fetchProductsByCategory('Cat'),
  ])

  // ✅ Fixed: Properly typed pet categories
  const petCategories: PetCategory[] = [
    { name: 'Dogs', icon: Dog, count: '150+ Products', color: 'from-amber-500/20', href: '/products?category=dog' },
    { name: 'Cats', icon: Cat, count: '120+ Products', color: 'from-orange-500/20', href: '/products?category=cat' },
    { name: 'Birds', icon: Bird, count: '50+ Products', color: 'from-green-500/20', href: '/products?category=bird' },
    { name: 'Small Pets', icon: '🐹', count: '80+ Products', color: 'from-rose-500/20', href: '/products?category=small-pet' },
    { name: 'Fish', icon: Fish, count: '60+ Products', color: 'from-blue-500/20', href: '/products?category=fish' },
    { name: 'Reptiles', icon: '🦎', count: '40+ Products', color: 'from-emerald-500/20', href: '/products?category=reptile' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white selection:bg-brand-accent selection:text-white">
      
      {/* Hero Section with Database Images */}
      <HeroSection heroImages={heroImages || []} />

      {/* Featured Products Section - Elite Gear */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-brand-accent rounded-full" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent">Premium Collection</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                ELITE GEAR
                <span className="text-brand-accent ml-2">.</span>
              </h2>
              <p className="text-gray-600 mt-2 max-w-md">Top-rated products loved by pets and owners alike</p>
            </div>
            
            <Link href="/products?featured=true" className="group flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-brand-accent transition-colors">
              View All Products
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {(featuredProducts && featuredProducts.length > 0) ? (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent/20 to-amber-500/20 blur-xl opacity-25 group-hover:opacity-50 transition duration-1000 rounded-3xl" />
              <div className="relative bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-xl">
                <ProductGrid products={featuredProducts as Product[]} />
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">Featured products coming soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* Gaming Bundle Section */}
      {gamingBundle.length > 0 && (
        <ProductCarousel
          title="🎮 GAMING BUNDLE"
          subtitle="Ultimate gaming gear for pets and owners"
          products={gamingBundle}
          variant="gaming"
          bgColor="bg-gradient-to-r from-purple-50 to-indigo-50"
        />
      )}

      {/* Free Shipping Section */}
      {freeShipping.length > 0 && (
        <ProductCarousel
          title="🚚 FREE SHIPPING"
          subtitle="On all orders above $50"
          products={freeShipping}
          variant="free-shipping"
          bgColor="bg-gradient-to-r from-blue-50 to-cyan-50"
        />
      )}

      {/* 5% Rewards Section */}
      {rewards.length > 0 && (
        <ProductCarousel
          title="⭐ 5% REWARDS"
          subtitle="Earn MBONE tokens on every purchase"
          products={rewards}
          variant="rewards"
          bgColor="bg-gradient-to-r from-emerald-50 to-teal-50"
        />
      )}

      {/* Tech Essentials Section */}
      {techEssentials.length > 0 && (
        <ProductCarousel
          title="💻 TECH ESSENTIALS"
          subtitle="Smart gadgets for modern pet parenting"
          products={techEssentials}
          variant="tech"
          bgColor="bg-gradient-to-r from-slate-50 to-gray-50"
        />
      )}

      {/* 15% Off Next Order Section */}
      {discountOffer.length > 0 && (
        <ProductCarousel
          title="🎉 15% OFF NEXT ORDER"
          subtitle="Limited time offer - Don't miss out!"
          products={discountOffer}
          variant="discount"
          bgColor="bg-gradient-to-r from-rose-50 to-pink-50"
        />
      )}

      {/* Category Grid - Pet Types */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 mb-4">
              <PawPrint className="h-3 w-3 text-brand-accent" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent">Shop by Pet</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Find Products for Your
              <span className="text-brand-accent block md:inline md:ml-2">Furry Friend</span>
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Browse through our extensive collection tailored for different pets
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {petCategories.map((category) => {
              const isStringIcon = typeof category.icon === 'string';
              const IconComponent = !isStringIcon ? category.icon as LucideIcon : null;
              
              return (
                <Link key={category.name} href={category.href}>
                  <div className={cn(
                    "group relative h-56 rounded-2xl border border-gray-100 bg-white p-6 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl",
                    "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 before:transition-opacity group-hover:before:opacity-100",
                    category.color
                  )}>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="group-hover:scale-110 transition-transform duration-300">
                        {isStringIcon ? (
                          <span className="text-5xl">{category.icon as string}</span>
                        ) : (
                          IconComponent && <IconComponent className="w-12 h-12 text-brand-accent" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{category.name}</h3>
                        <p className="text-sm font-medium text-gray-500 mt-1">{category.count}</p>
                        <div className="flex items-center gap-1 mt-2 text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-sm font-semibold">Shop Now</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dog Products Preview */}
      {dogProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Dog className="w-8 h-8 text-brand-accent" />
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900">For Dogs</h2>
                </div>
                <p className="text-gray-600">Everything your canine companion needs</p>
              </div>
              <Link href="/products?category=dog" className="text-brand-accent font-semibold hover:underline">
                View All →
              </Link>
            </div>
            <ProductGrid products={dogProducts as Product[]} />
          </div>
        </section>
      )}

      {/* Cat Products Preview */}
      {catProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-gray-50 to-slate-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Cat className="w-8 h-8 text-brand-accent" />
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900">For Cats</h2>
                </div>
                <p className="text-gray-600">Spoil your feline friend with the best</p>
              </div>
              <Link href="/products?category=cat" className="text-brand-accent font-semibold hover:underline">
                View All →
              </Link>
            </div>
            <ProductGrid products={catProducts as Product[]} />
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: Heart, title: 'Pet Safe', desc: 'Vet approved products' },
              { icon: Shield, title: 'Secure Checkout', desc: '100% safe payments' },
              { icon: Gift, title: 'Rewards', desc: 'Earn MBONE tokens' },
            ].map((benefit, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-brand-accent/5 transition-colors group">
                <benefit.icon className="w-10 h-10 text-brand-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-500">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-brand-primary to-brand-accent rounded-3xl p-8 md:p-12 text-center border border-brand-primary shadow-xl">
            <h2 className="text-2xl md:text-4xl font-black mb-3 text-brand-primary">Save 15% on Your First Order</h2>
            <p className="mb-6 opacity-90 text-grey-500">Subscribe to get special offers, free giveaways, and pet care tips!</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-grey-300"
              />
              <Button className="bg-white text-brand-primary hover:bg-gray-100 font-bold px-6 border-2 border-grey-300 hover:border-gray-400 transition-colors">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}