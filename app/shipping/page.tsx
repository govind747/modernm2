import { Truck, Clock, Shield, Package, Globe, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
      {/* Header Section with subtle entrance animation */}
      <div className="text-center mb-20 space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
          Shipping Information
        </h1>
        <div className="h-1.5 w-24 bg-brand-accent mx-auto rounded-full mb-8" />
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Fast, reliable shipping to get your products to you quickly and safely. 
          Track every step of your order's journey.
        </p>
      </div>

      {/* Shipping Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {[
          { 
            title: "Free Standard", 
            icon: <Truck />, 
            price: "Free", 
            time: "5-7 business days", 
            desc: "For orders over $50. Perfect for everyday essentials." 
          },
          { 
            title: "Express", 
            icon: <Clock />, 
            price: "$9.99", 
            time: "2-3 business days", 
            desc: "Priority handling for when you need it sooner." 
          },
          { 
            title: "Overnight", 
            icon: <Package />, 
            price: "$24.99", 
            time: "Next business day", 
            desc: "Order by 2PM for guaranteed next-day arrival." 
          },
        ].map((option, i) => (
          <Card key={i} className="group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-slate-200/60 overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
             <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-4 group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300">
                {option.icon}
              </div>
              <CardTitle className="text-2xl font-bold">{option.title}</CardTitle>
              <span className="text-brand-accent font-semibold text-lg">{option.price}</span>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 mb-6">{option.desc}</p>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Delivery within {option.time}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Policies Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            Shipping Policies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { q: "Processing Time", a: "Orders are processed within 1-2 business days. Weekend orders ship Monday." },
              { q: "Shipping Locations", a: "We currently ship to all 50 US states. International shipping coming soon!" },
              { q: "Order Tracking", a: "Real-time tracking links are sent via email as soon as your label is printed." },
              { q: "Delivery Issues", a: "Package lost? Contact our 24/7 support within 48 hours for a quick resolution." },
            ].map((policy, i) => (
              <div key={i} className="group border-l-2 border-slate-100 pl-6 hover:border-brand-accent transition-colors duration-300">
                <h3 className="font-bold text-lg mb-2 group-hover:text-brand-accent transition-colors">
                  {policy.q}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {policy.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight Card */}
        <Card className="bg-slate-900 text-white h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-6 w-6 text-brand-accent" />
              Secure Shipping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-400">
              We take pride in our packaging. Every item is hand-inspected before it leaves our warehouse.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                Eco-friendly recycled materials
              </li>
              <li className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                Double-walled protective boxes
              </li>
              <li className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                Discreet outer packaging
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}