import { RotateCcw, Shield, Clock, CircleCheck as CheckCircle, ArrowRight, AlertCircle, RefreshCw, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex justify-center mb-6">
             <div className="p-3 bg-brand-accent/10 rounded-2xl">
               <RotateCcw className="h-10 w-10 text-brand-accent animate-spin-slow" style={{ animationDuration: '8s' }} />
             </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Hassle-Free <span className="text-brand-accent">Returns</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Not completely in love with your purchase? No worries. Our 30-day return 
            policy is designed to be as simple as your original checkout.
          </p>
        </div>

        {/* Step-by-Step Process with Visual Connectors */}
        <div className="relative mb-24">
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-10" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { step: "01", title: "Initiate", desc: "Contact support or use our automated portal.", icon: <AlertCircle className="h-5 w-5" /> },
              { step: "02", title: "Print", desc: "Receive a prepaid shipping label via email.", icon: <RefreshCw className="h-5 w-5" /> },
              { step: "03", title: "Ship", desc: "Drop off at any authorized carrier location.", icon: <ArrowRight className="h-5 w-5" /> },
              { step: "04", title: "Refund", desc: "Funds back in your account in 5-7 days.", icon: <CheckCircle className="h-5 w-5" /> },
            ].map((item, i) => (
              <div key={i} className="group text-center">
                <div className="w-24 h-24 bg-white border-4 border-slate-50 shadow-xl rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:border-brand-accent group-hover:scale-110 transition-all duration-500">
                  <span className="text-3xl font-black text-slate-200 group-hover:text-brand-accent/20 absolute">{item.step}</span>
                  <div className="z-10 text-brand-accent group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Return Policies Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-1 border-none shadow-lg bg-white overflow-hidden group">
            <div className="h-1.5 bg-amber-400 w-full" />
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Clock className="h-6 w-6 text-amber-500" />
                Return Window
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 font-medium text-lg">30 Days Standard</p>
              <div className="space-y-2">
                {["Original condition", "All accessories included", "Original packaging"].map((li, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300" /> {li}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-none shadow-lg bg-slate-900 text-white overflow-hidden">
            <div className="grid md:grid-cols-2 h-full">
              <div className="p-8">
                <CardTitle className="flex items-center gap-3 text-2xl mb-4">
                  <RotateCcw className="h-6 w-6 text-brand-accent" />
                  Instant Exchanges
                </CardTitle>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Ordered the wrong size? We'll ship your replacement immediately—even 
                  before we get your return back.
                </p>
                <Button className="bg-brand-accent hover:bg-brand-accent/90 text-white font-bold px-8">
                  Start Exchange
                </Button>
              </div>
              <div className="bg-white/5 p-8 flex flex-col justify-center border-l border-white/10">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span className="text-sm">Free shipping on all exchanges</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span className="text-sm">3-5 business day processing</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Non-Returnable Items Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <Card className="bg-rose-50/50 border-rose-100 shadow-none">
            <CardHeader>
              <CardTitle className="text-rose-900 flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" /> Non-Returnable Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-rose-800/80">
                <span>• Personalized Goods</span>
                <span>• Digital Products</span>
                <span>• Opened Software</span>
                <span>• Final Sale Items</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50/50 border-emerald-100 shadow-none">
            <CardHeader>
              <CardTitle className="text-emerald-900 flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5" /> Refund Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-emerald-800/80">
                <span>• Original Payment</span>
                <span>• Store Credit (+5%)</span>
                <span>• MBONE (USD Equiv.)</span>
                <span>• 2-3 Day Processing</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}