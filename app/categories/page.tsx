import Link from 'next/link'
import { Headphones, Watch, Laptop, Smartphone, Camera, Gamepad2, Speaker, Usb, ArrowRight, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const categories = [
  {
    name: 'Audio & Sound',
    icon: Headphones,
    count: '25+ Items',
    description: 'High-fidelity headphones and studio gear.',
    color: 'from-blue-500 to-cyan-400',
    accent: 'text-blue-500',
    glow: 'group-hover:shadow-blue-500/20'
  },
  {
    name: 'Wearables',
    icon: Watch,
    count: '15+ Items',
    description: 'Next-gen smartwatches and fitness trackers.',
    color: 'from-emerald-500 to-teal-400',
    accent: 'text-emerald-500',
    glow: 'group-hover:shadow-emerald-500/20'
  },
  {
    name: 'Computing',
    icon: Laptop,
    count: '30+ Items',
    description: 'Workstations, laptops, and peripherals.',
    color: 'from-purple-600 to-indigo-400',
    accent: 'text-purple-500',
    glow: 'group-hover:shadow-purple-500/20'
  },
  {
    name: 'Mobile Tech',
    icon: Smartphone,
    count: '20+ Items',
    description: 'The latest flagship phones and accessories.',
    color: 'from-rose-500 to-orange-400',
    accent: 'text-rose-500',
    glow: 'group-hover:shadow-rose-500/20'
  },
  {
    name: 'Visuals',
    icon: Camera,
    count: '18+ Items',
    description: 'Pro cameras and streaming equipment.',
    color: 'from-amber-400 to-yellow-500',
    accent: 'text-amber-500',
    glow: 'group-hover:shadow-amber-500/20'
  },
  {
    name: 'Gaming Pro',
    icon: Gamepad2,
    count: '35+ Items',
    description: 'Mechanical keyboards and high-FPS gear.',
    color: 'from-indigo-600 to-blue-500',
    accent: 'text-indigo-500',
    glow: 'group-hover:shadow-indigo-500/20'
  },
  {
    name: 'Home Audio',
    icon: Speaker,
    count: '22+ Items',
    description: 'Smart speakers and home theater systems.',
    color: 'from-pink-500 to-rose-400',
    accent: 'text-pink-500',
    glow: 'group-hover:shadow-pink-500/20'
  },
  {
    name: 'Essentials',
    icon: Usb,
    count: '50+ Items',
    description: 'Cables, chargers, and power solutions.',
    color: 'from-slate-700 to-slate-900',
    accent: 'text-slate-600',
    glow: 'group-hover:shadow-slate-500/20'
  }
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-24">
      {/* Background Mesh (Visual Decoration) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/50 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/20 blur-[120px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 border-slate-200 bg-white text-slate-500 rounded-full font-bold uppercase tracking-widest text-[10px]">
            Departments
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter">
            Explore the <span className="text-brand-accent">Collection.</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed font-medium">
            Discover precision-engineered electronics across eight specialized categories. 
            Curated for enthusiasts, by enthusiasts.
          </p>
        </div>

        {/* Categories Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link key={category.name} href="/products" className="group">
                <Card className={`relative h-full border-none bg-white rounded-[2.5rem] transition-all duration-500 overflow-hidden shadow-xl shadow-slate-200/50 hover:-translate-y-2 ${category.glow}`}>
                  <CardContent className="p-10 flex flex-col items-center text-center">
                    {/* Icon Container with Gradient Background */}
                    <div className={`relative w-20 h-20 mb-8 rounded-3xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform duration-500`}>
                      <IconComponent className="h-10 w-10" />
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-3xl" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
                      {category.description}
                    </p>

                    <div className="mt-auto flex flex-col items-center">
                       <span className={`text-xs font-black uppercase tracking-widest ${category.accent} mb-4`}>
                        {category.count}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Featured Banner / Promo */}
        <div className="mt-32">
          <div className="relative rounded-[3.5rem] bg-slate-900 p-12 md:p-20 overflow-hidden text-white">
            {/* Promo Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-accent/20 to-transparent" />
            <Zap className="absolute top-10 left-10 h-64 w-64 text-white/5 -rotate-12" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-brand-accent text-white mb-6">Trending Now</Badge>
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                  New Audio Era: <br />
                  <span className="text-brand-accent">Studio Grade Wireless.</span>
                </h2>
                <p className="text-slate-400 text-lg mb-10 max-w-md">
                  Experience lossless audio with our latest arrivals in the Studio Pro category. 
                  Now shipping globally.
                </p>
                <Link href="/products">
                  <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-brand-accent hover:text-white transition-all flex items-center gap-2">
                    Shop Studio Pro <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
              </div>
              
              <div className="hidden lg:grid grid-cols-2 gap-4">
                 <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center backdrop-blur-sm">
                   <Headphones className="h-16 w-16 text-white/20" />
                 </div>
                 <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center translate-y-8 backdrop-blur-sm">
                   <Speaker className="h-16 w-16 text-white/20" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}