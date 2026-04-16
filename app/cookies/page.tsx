import { Cookie, Settings, Eye, Shield, Info, ExternalLink, MousePointer2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Header Section */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-600">
              <Cookie className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Cookie <span className="text-amber-600">Preferences</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            We use cookies to ensure ModernMart stays fast, secure, and personalized. 
            You're in total control of which data we're allowed to collect.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-medium text-slate-500 shadow-sm">
            <Info className="h-4 w-4 text-amber-500" /> Updated: April 2, 2026
          </div>
        </div>

        {/* Quick Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { icon: <Shield />, title: "Secure", desc: "Encryption for all cookie data." },
            { icon: <Eye />, title: "Insights", desc: "Better site performance tracking." },
            { icon: <Settings />, title: "Personal", desc: "Remembers your theme & region." },
            { icon: <MousePointer2 />, title: "Control", desc: "Easily opt-out of marketing." },
          ].map((item, i) => (
            <div key={i} className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="text-slate-400 group-hover:text-amber-600 transition-colors mb-4">{item.icon}</div>
              <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="space-y-12 max-w-4xl mx-auto">
          
          {/* Section: What are they? */}
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
            <CardHeader className="p-10 pb-0">
              <CardTitle className="text-3xl font-bold">The Basics</CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-6">
              <p className="text-slate-600 leading-relaxed">
                Think of cookies as "digital bookmarks." They are tiny files stored on your browser 
                that help us recognize you when you return. They allow your shopping cart to stay full 
                even if you refresh the page.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold uppercase text-slate-400">Session Cookies</span>
                  <p className="text-sm text-slate-600 mt-1">Temporary: Deleted when you close your browser.</p>
                </div>
                <div className="flex-1 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold uppercase text-slate-400">Persistent Cookies</span>
                  <p className="text-sm text-slate-600 mt-1">Long-term: Stay on your device until they expire.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section: Types with Badges */}
          <div className="grid gap-6">
            <h3 className="text-2xl font-bold text-slate-900 ml-4">How we use them</h3>
            {[
              { 
                icon: <Shield className="h-5 w-5" />, 
                title: "Essential Cookies", 
                status: "Always On", 
                desc: "Authentication, security, and cart persistence. These are required for the site to function.",
                color: "bg-blue-500"
              },
              { 
                icon: <Eye className="h-5 w-5" />, 
                title: "Analytics & Performance", 
                status: "Optional", 
                desc: "Helps us find bugs and understand which features users love most using Google Analytics.",
                color: "bg-amber-500"
              },
              { 
                icon: <Settings className="h-5 w-5" />, 
                title: "Personalization", 
                status: "Optional", 
                desc: "Remembers your language, region, and recently viewed products for a faster experience.",
                color: "bg-purple-500"
              }
            ].map((item, i) => (
              <Card key={i} className="border-none shadow-sm rounded-2xl group hover:shadow-md transition-shadow">
                <CardContent className="p-8 flex flex-col md:flex-row items-start gap-6">
                  <div className={`p-4 rounded-2xl text-white ${item.color} shadow-lg shadow-inherit/20`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
                      <Badge variant={item.status === "Always On" ? "secondary" : "outline"} className="rounded-full">
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Section: Third Party */}
          <Card className="border-none shadow-sm rounded-[2rem] bg-slate-900 text-white overflow-hidden">
            <CardHeader className="p-10">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <ExternalLink className="h-6 w-6 text-amber-400" />
                Third-Party Partnerships
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0">
              <p className="text-slate-400 mb-8 leading-relaxed">
                We only partner with industry-leading services that respect your privacy. 
                These partners may set cookies on our behalf:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {["Google", "Polygon", "MetaMask", "Stripe"].map((brand) => (
                  <div key={brand} className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-center text-sm font-medium hover:bg-white/10 transition-colors">
                    {brand}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section: Management (The Call to Action) */}
          <div className="bg-amber-50 rounded-[2.5rem] p-10 text-center border border-amber-100">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Want to change your mind?</h3>
            <p className="text-amber-800/70 mb-8 max-w-lg mx-auto">
              You can reset your cookie settings at any time. This will bring back the 
              consent banner from your first visit.
            </p>
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-10 h-14 rounded-2xl font-bold shadow-lg shadow-amber-600/20">
              Reset Cookie Preferences
            </Button>
          </div>

          {/* Contact Support Small */}
          <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h4 className="font-bold text-slate-900">Questions about tracking?</h4>
              <p className="text-sm text-slate-500">Reach out to our privacy compliance team.</p>
            </div>
            <div className="flex gap-4">
               <a href="mailto:privacy@modernmart.com" className="text-sm font-bold text-amber-600 hover:underline">privacy@modernmart.com</a>
               <span className="text-slate-300">|</span>
               <a href="/privacy" className="text-sm font-bold text-slate-500 hover:underline">Privacy Policy</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}