import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ArrowRight, Github, Linkedin, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'Deals', href: '/deals', badge: 'Hot' },
    { name: 'About Us', href: '/about' },
  ]

  const customerService = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Support', href: '/support' },
  ]

  return (
    <footer className="bg-slate-950 text-slate-300 pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 pb-16 border-b border-white/5">
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="h-10 w-10 bg-brand-accent rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-brand-accent/20">
                <span className="text-white font-black text-xl">M</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">
                Modern<span className="text-brand-accent">Mart</span>
              </span>
            </Link>
            <p className="text-lg text-slate-400 max-w-sm leading-relaxed font-medium">
              Precision-engineered electronics and a seamless Web3 shopping experience. Quality guaranteed.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-white hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-brand-accent/10 blur-3xl rounded-full" />
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Join the Inner Circle</h3>
                <p className="text-slate-400 mb-6 font-medium">Get early access to tech drops and exclusive deals.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input 
                    placeholder="Enter your email" 
                    className="h-12 bg-white/10 border-white/10 rounded-xl focus-visible:ring-brand-accent text-white placeholder:text-slate-500"
                  />
                  <Button className="h-12 px-8 bg-brand-accent hover:bg-brand-accent/90 text-white font-bold rounded-xl shrink-0 transition-all">
                    Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold tracking-widest uppercase text-xs">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="flex items-center gap-2 text-slate-400 hover:text-brand-accent transition-colors font-medium group">
                    {link.name}
                    {link.badge && (
                      <span className="px-1.5 py-0.5 rounded bg-brand-accent/10 text-brand-accent text-[10px] font-black group-hover:bg-brand-accent group-hover:text-white transition-all">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Customer Service */}
          <div className="space-y-6">
            <h4 className="text-white font-bold tracking-widest uppercase text-xs">Customer Service</h4>
            <ul className="space-y-4">
              {customerService.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-brand-accent transition-colors font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-white font-bold tracking-widest uppercase text-xs">Contact Us</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-brand-accent/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="h-4 w-4 text-brand-accent" />
                  <span className="text-white font-bold text-sm">Email Support</span>
                </div>
                <p className="text-slate-400 text-sm pl-7">support@modernmart.com</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-brand-accent/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="h-4 w-4 text-brand-accent" />
                  <span className="text-white font-bold text-sm">Phone Line</span>
                </div>
                <p className="text-slate-400 text-sm pl-7">+1 (555) 123-4567</p>
              </div>
              <div className="sm:col-span-2 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-brand-accent/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="h-4 w-4 text-brand-accent" />
                  <span className="text-white font-bold text-sm">Main Office</span>
                </div>
                <p className="text-slate-400 text-sm pl-7">123 Tech Avenue, Silicon District, Digital City 44001</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Legal & Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-medium">
            © {currentYear} ModernMart. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                Cookie Policy
              </Link>
            </div>            
          </div>
        </div>
      </div>
    </footer>
  )
}