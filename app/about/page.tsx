import { Shield, Truck, Star, Users, Award, Heart, Zap, Globe, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Decorative Elements */}
      <section className="relative overflow-hidden pt-24 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
          <div className="absolute top-10 right-0 w-72 h-72 bg-brand-accent/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-6 py-1 px-4 border-brand-accent/30 text-brand-accent bg-brand-accent/5 rounded-full font-bold uppercase tracking-widest text-xs">
            Our Mission
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight">
            Technology for <br />
            <span className="text-brand-accent italic">everyone, everywhere.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            ModernMart was built on the belief that premium tech shouldn't come 
            with a premium tax. We're bridging the gap between innovation and affordability.
          </p>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="container mx-auto px-4 mb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-slate-900 rounded-[3rem] text-white shadow-2xl">
          {[
            { label: "Products Curated", value: "15k+" },
            { label: "Happy Customers", value: "100k+" },
            { label: "Global Offices", value: "12" },
            { label: "Award Wins", value: "24" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 border-r last:border-0 border-white/10">
              <div className="text-3xl md:text-5xl font-black text-brand-accent mb-2">{stat.value}</div>
              <div className="text-xs md:text-sm uppercase tracking-widest text-slate-400 font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story & Philosophy Section */}
      <section className="container mx-auto px-4 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-brand-accent/10 rounded-[2rem] blur-xl group-hover:bg-brand-accent/20 transition-all" />
            <div className="relative aspect-square md:aspect-video lg:aspect-square bg-slate-100 rounded-[2rem] overflow-hidden shadow-inner flex items-center justify-center p-12 border border-slate-200">
               <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-left-4 duration-500">
                    <CheckCircle2 className="text-emerald-500 h-6 w-6" />
                    <span className="font-bold text-slate-800">Direct Manufacturer Relations</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-left-4 delay-150 duration-500">
                    <CheckCircle2 className="text-emerald-500 h-6 w-6" />
                    <span className="font-bold text-slate-800">Eco-Friendly Tech Packaging</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-left-4 delay-300 duration-500">
                    <CheckCircle2 className="text-emerald-500 h-6 w-6" />
                    <span className="font-bold text-slate-800">24/7 Global Priority Support</span>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
              Started in a garage, <br />
              <span className="text-brand-accent underline decoration-brand-accent/20 underline-offset-8">Scaling globally.</span>
            </h2>
            <div className="space-y-4 text-lg text-slate-500 leading-relaxed">
              <p>
                ModernMart began as a simple observation: the tech market was divided into 
                "luxury" and "junk." We wanted a middle ground.
              </p>
              <p>
                By cutting out the middlemen and focusing on lean logistics, we've managed 
                to provide the same internal hardware found in top-tier brands at a 
                fraction of the shelf price.
              </p>
              <p>
                Our team is a collective of engineers, designers, and dreamers who 
                obsess over every capacitor and pixel.
              </p>
            </div>
            <div className="pt-4 flex flex-wrap gap-4">
               <Badge className="bg-slate-100 text-slate-600 border-none px-4 py-2 text-sm font-bold">Innovation</Badge>
               <Badge className="bg-slate-100 text-slate-600 border-none px-4 py-2 text-sm font-bold">Integrity</Badge>
               <Badge className="bg-slate-100 text-slate-600 border-none px-4 py-2 text-sm font-bold">Speed</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Bento Grid */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">What we stand for</h2>
            <p className="text-slate-500">The pillars that keep our community growing.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <Card className="md:col-span-3 border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all">
              <CardContent className="p-10 flex flex-col h-full justify-between">
                <div className="w-14 h-14 bg-brand-accent text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Award className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Quality Obsessed</h3>
                  <p className="text-slate-500 leading-relaxed">
                    We don't just ship boxes. We rigorously test every product line in-house 
                    before it ever hits our digital shelves.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3 border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all">
              <CardContent className="p-10 flex flex-col h-full justify-between">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Globe className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Global Access</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Our logistics network spans 40+ countries, ensuring that modern 
                    tech reaches remote communities just as fast as major cities.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Fast Pace</h3>
                <p className="text-sm text-slate-500">Weekly product drops keep us at the cutting edge.</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-rose-500/10 text-rose-600 rounded-xl flex items-center justify-center mb-6">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">People First</h3>
                <p className="text-sm text-slate-500">Every decision is made with our community's needs in mind.</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Community</h3>
                <p className="text-sm text-slate-500">Join our thousands of tech-savvy beta testers.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Shipping/Security Small Features Bar */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem]">
            {[
              { icon: <Truck />, t: "Global Logistics", d: "Free shipping over $50" },
              { icon: <Shield />, t: "Secure Vault", d: "End-to-end payment security" },
              { icon: <Heart />, t: "Human Support", d: "Real people, no canned bots" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl text-brand-accent shadow-sm border border-slate-100">
                  {f.icon}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{f.t}</div>
                  <div className="text-xs text-slate-500">{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}