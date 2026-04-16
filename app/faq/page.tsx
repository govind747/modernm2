import { Search, Mail, MessageCircle, HelpCircle, Wallet, Truck, RefreshCcw } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const faqs = [
  { category: "Orders", question: "How do I track my order?", answer: "Once your order ships, you'll receive a tracking number via email. You can use this number to track your package on our website or directly on the carrier's website." },
  { category: "Payments", question: "What payment methods do you accept?", answer: "We currently accept MBONE token payments through our crypto payment system. Traditional methods are coming soon. All payments are secured on the Polygon network." },
  { category: "Shipping", question: "How long does shipping take?", answer: "Standard shipping takes 5-7 business days. Express takes 2-3 business days, and overnight delivers the next business day." },
  { category: "Returns", question: "What is your return policy?", answer: "We offer a 30-day return policy for most items. Items must be in original condition with all packaging and accessories." },
  { category: "Crypto", question: "What is MBONE token?", answer: "MBONE is our native cryptocurrency token used for payments on ModernMart. It's built on the Polygon network for fast and low-cost transactions." },
  { category: "Support", question: "What if I receive a damaged item?", answer: "Contact our customer service team immediately with photos. We'll arrange for a replacement or full refund at no cost to you." }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50/30 py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header & Search */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-sm font-medium">
            <HelpCircle className="h-4 w-4" />
            Support Center
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            How can we <span className="text-brand-accent">help you?</span>
          </h1>
          <div className="relative max-w-2xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search for articles (e.g. shipping, MBONE, returns...)" 
              className="h-14 pl-12 pr-4 rounded-2xl border-none shadow-lg shadow-slate-200/50 bg-white text-lg focus-visible:ring-brand-accent"
            />
          </div>
        </div>

        {/* FAQ Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Quick Links / Categories Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-bold text-slate-900 text-lg ml-2 mb-4">Quick Categories</h3>
            {[
              { label: "Shipping & Delivery", icon: <Truck className="h-4 w-4" /> },
              { label: "Crypto & Wallets", icon: <Wallet className="h-4 w-4" /> },
              { label: "Returns & Refunds", icon: <RefreshCcw className="h-4 w-4" /> },
              { label: "Account Security", icon: <MessageCircle className="h-4 w-4" /> },
            ].map((cat, i) => (
              <button 
                key={i} 
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 hover:border-brand-accent hover:text-brand-accent transition-all group text-left shadow-sm"
              >
                <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-brand-accent/10 transition-colors">
                  {cat.icon}
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-brand-accent">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Accordion Content */}
          <div className="lg:col-span-8">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="group bg-white border border-slate-100 rounded-2xl px-2 transition-all duration-300 data-[state=open]:shadow-xl data-[state=open]:border-brand-accent/20"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-brand-accent/60">
                        {faq.category}
                      </span>
                      <span className="font-bold text-slate-800 text-lg group-hover:text-brand-accent transition-colors">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-6 text-slate-500 text-[16px] leading-relaxed border-t border-slate-50 pt-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Enhanced Contact Footer */}
        <div className="mt-24 p-10 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-2">
              <h3 className="text-3xl font-bold">Still locked out of answers?</h3>
              <p className="text-slate-400 max-w-md">
                Our support humans (and highly intelligent bots) are available 24/7 to help you out.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Button size="lg" className="bg-brand-accent hover:bg-white hover:text-slate-900 transition-all font-bold px-8 h-14 rounded-xl">
                <MessageCircle className="mr-2 h-5 w-5" />
                Live Chat
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white font-bold px-8 h-14 rounded-xl">
                <Mail className="mr-2 h-5 w-5" />
                Email Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}