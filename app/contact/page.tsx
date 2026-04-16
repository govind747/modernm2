import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Modern Header */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium tracking-wider text-brand-accent uppercase bg-brand-accent/10 rounded-full">
            Get in touch
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Let's Start a <span className="text-brand-accent">Conversation</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Have a question about our services or need technical support? 
            Our team typically responds within a few business hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Contact Information Sidebar */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Contact Information</h2>
              <p className="text-slate-500 text-lg">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
            </div>

            <div className="grid gap-8">
              {[
                { icon: <Mail />, label: "Email", val: "support@modernmart.com", sub: "24/7 online support" },
                { icon: <Phone />, label: "Phone", val: "+1 (555) 123-4567", sub: "Mon-Fri from 9am to 6pm" },
                { icon: <MapPin />, label: "Office", val: "123 Tech Street", sub: "Digital City, DC 12345" },
                { icon: <Clock />, label: "Hours", val: "Mon-Sat", sub: "9:00 AM - 6:00 PM EST" },
              ].map((item, idx) => (
                <div key={idx} className="group flex items-center p-4 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100">
                  <div className="w-14 h-14 bg-white shadow-sm rounded-xl flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform duration-300 border border-slate-100">
                    {item.icon}
                  </div>
                  <div className="ml-6">
                    <p className="text-sm font-semibold text-brand-accent uppercase tracking-wide">{item.label}</p>
                    <p className="text-lg font-bold text-slate-900">{item.val}</p>
                    <p className="text-sm text-slate-400">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="lg:col-span-7">
            <Card className="border-none shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-brand-accent w-full" />
              <CardHeader className="pt-10 px-8">
                <CardTitle className="text-2xl font-bold">Send a Message</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-2">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-slate-700 font-medium">First Name</Label>
                      <Input 
                        id="firstName" 
                        placeholder="John" 
                        className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-slate-700 font-medium">Last Name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Doe" 
                        className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-slate-700 font-medium">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="How can we help?" 
                      className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-700 font-medium">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Your message..."
                      rows={5}
                      className="bg-slate-50/50 border-slate-200 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <Button className="w-full h-14 text-lg font-bold bg-slate-900 hover:bg-brand-accent transition-all duration-300 group">
                    Send Message
                    <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}