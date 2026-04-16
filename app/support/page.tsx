import { MessageCircle, Mail, Phone, Clock, CircleHelp as HelpCircle, Book, ArrowRight, ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 text-brand-accent text-sm font-bold mb-6 uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
            </span>
            Agents Online
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            How can we <span className="text-brand-accent">support you</span> today?
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Whether you have a question about MBONE tokens or need to track a package, 
            our dedicated team is ready to help.
          </p>
        </div>

        {/* Primary Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { 
              title: "Live Chat", 
              icon: <MessageCircle />, 
              desc: "Average wait time: < 2 mins", 
              action: "Start Chat", 
              variant: "default" as const 
            },
            { 
              title: "Email Us", 
              icon: <Mail />, 
              desc: "Response within 24 hours", 
              action: "Send Message", 
              variant: "outline" as const,
              href: "mailto:support@modernmart.com"
            },
            { 
              title: "Phone", 
              icon: <Phone />, 
              desc: "Mon-Fri, 9AM - 6PM EST", 
              action: "Call Now", 
              variant: "outline" as const,
              href: "tel:+15551234567"
            }
          ].map((item, i) => (
            <Card key={i} className="group relative overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <div className="scale-[3] text-brand-accent">{item.icon}</div>
              </div>
              <CardHeader className="pt-8 text-center">
                <div className="w-16 h-16 bg-slate-50 text-brand-accent rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300 shadow-inner">
                  {item.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <p className="text-slate-500 mb-6 font-medium">{item.desc}</p>
                {item.href ? (
                  <Button variant={item.variant} asChild className="w-full rounded-xl py-6 font-bold shadow-sm">
                    <a href={item.href}>{item.action}</a>
                  </Button>
                ) : (
                  <Button variant={item.variant} className="w-full rounded-xl py-6 font-bold bg-slate-900 hover:bg-brand-accent shadow-sm">
                    {item.action}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Support Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Quick Links with Arrow Hover */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3 ml-2">
              <HelpCircle className="text-brand-accent h-6 w-6" /> Quick Navigation
            </h3>
            <div className="grid gap-4">
              {[
                { label: "Frequently Asked Questions", sub: "Instant answers to common queries", href: "/faq" },
                { label: "Track Your Order", sub: "Real-time delivery updates", href: "/orders" },
                { label: "Returns & Exchanges", sub: "30-day hassle-free process", href: "/returns" },
                { label: "Shipping Policies", sub: "Rates, times, and coverage", href: "/shipping" }
              ].map((link, i) => (
                <Link key={i} href={link.href} className="group flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:border-brand-accent/30 hover:shadow-md transition-all">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 group-hover:text-brand-accent transition-colors">{link.label}</h4>
                    <p className="text-sm text-slate-400">{link.sub}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-brand-accent group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Help Topics */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3 ml-2">
              <Book className="text-brand-accent h-6 w-6" /> Knowledge Base
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Account & Login", desc: "Security and access" },
                { title: "Crypto Payments", desc: "MBONE & Wallets" },
                { title: "Product Guides", desc: "Manuals & Warranty" },
                { title: "Tech Support", desc: "Site & App issues" }
              ].map((topic, i) => (
                <div key={i} className="p-6 bg-slate-100/50 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all cursor-default">
                  <h4 className="font-bold text-slate-800 mb-1">{topic.title}</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{topic.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modern Priority Banner */}
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 md:p-12">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 bg-rose-500/10 blur-[80px] rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Priority Escalation</h3>
                <p className="text-slate-400 max-w-sm">
                  Facing a payment failure or order security issue? Our priority team is standing by.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Button size="lg" className="bg-rose-600 hover:bg-rose-500 text-white font-bold h-14 px-8 rounded-xl">
                <Phone className="mr-2 h-4 w-4" /> Call Priority Line
              </Button>
              <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 font-bold h-14 px-8 rounded-xl">
                Email Urgent Desk
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}