import { FileText, Scale, Shield, AlertTriangle, CheckCircle2, Info, Gavel, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Header Section */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-600">
              <Scale className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Terms of <span className="text-blue-600">Service</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            These terms govern your use of ModernMart. We’ve tried to keep them 
            as fair and transparent as possible.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-medium text-slate-500 shadow-sm">
            <Info className="h-4 w-4 text-blue-500" /> Effective Date: April 2, 2026
          </div>
        </div>

        {/* Quick Summary Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { icon: <FileText />, title: "Clear Terms", desc: "No hidden small print or confusing jargon." },
            { icon: <Scale />, title: "Fair Usage", desc: "Balanced rights for you and the platform." },
            { icon: <Shield />, title: "Secure Data", desc: "Your info is handled with extreme care." },
            { icon: <AlertTriangle />, title: "User Duty", desc: "Basic rules for a safe community." },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-blue-600 mb-4">{item.icon}</div>
              <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="space-y-10">
          
          {/* Acceptance Card - High Visibility */}
          <Card className="border-none shadow-xl shadow-blue-900/5 bg-blue-600 text-white overflow-hidden rounded-[2rem]">
            <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8">
              <div className="bg-white/10 p-4 rounded-2xl">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Acceptance of Agreement</h2>
                <p className="text-blue-100 leading-relaxed">
                  By using ModernMart, you agree to these terms. If you're under 18, 
                  you must have a parent or guardian's permission to use the site.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Sections */}
          <div className="grid gap-10">
            
            {/* Section: Account */}
            <section className="group relative pl-0 md:pl-8">
              <div className="hidden md:block absolute left-0 top-0 h-full w-1 bg-slate-200 group-hover:bg-blue-500 transition-colors rounded-full" />
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h3 className="text-3xl font-bold text-slate-900">User Accounts</h3>
                <Badge variant="outline" className="w-fit bg-white text-slate-500 border-slate-200">
                  TL;DR: Keep your login safe.
                </Badge>
              </div>
              <Card className="border-none shadow-sm rounded-2xl">
                <CardContent className="p-8 space-y-6">
                  <p className="text-slate-600 leading-relaxed">
                    You are responsible for all activity that happens on your account. 
                    You must provide accurate info and notify us immediately of any breaches.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" /> One account per person
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" /> 18+ years of age required
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section: Crypto & Payments */}
            <section className="group relative pl-0 md:pl-8">
              <div className="hidden md:block absolute left-0 top-0 h-full w-1 bg-slate-200 group-hover:bg-emerald-500 transition-colors rounded-full" />
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h3 className="text-3xl font-bold text-slate-900">Payments & MBONE</h3>
                <Badge variant="outline" className="w-fit bg-emerald-50 text-emerald-700 border-emerald-100">
                  TL;DR: Crypto is final once confirmed.
                </Badge>
              </div>
              <Card className="border-none shadow-sm rounded-2xl bg-slate-900 text-white">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                      <Globe className="h-6 w-6" />
                    </div>
                    <div className="space-y-4">
                      <p className="text-slate-300 leading-relaxed">
                        MBONE token payments are processed via the Polygon network. 
                        Once a transaction is confirmed on the blockchain, it is final.
                      </p>
                      <ul className="space-y-2 text-sm text-slate-400">
                        <li>• Users are responsible for gas fees (Network fees)</li>
                        <li>• Refunds are calculated based on the USD value at checkout</li>
                        <li>• We are not liable for wallet-side security failures</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section: Liability */}
            <section className="group relative pl-0 md:pl-8">
              <div className="hidden md:block absolute left-0 top-0 h-full w-1 bg-slate-200 group-hover:bg-amber-500 transition-colors rounded-full" />
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h3 className="text-3xl font-bold text-slate-900">Limitations</h3>
                <Badge variant="outline" className="w-fit bg-amber-50 text-amber-700 border-amber-100">
                  TL;DR: We aren't liable for system outages.
                </Badge>
              </div>
              <Card className="border-none shadow-sm rounded-2xl">
                <CardContent className="p-8">
                  <p className="text-slate-600 leading-relaxed italic border-l-4 border-slate-100 pl-6">
                    "ModernMart provides services 'as is'. We do not guarantee 100% 
                    uptime or that the site will always be error-free. Our liability 
                    is limited to the maximum extent permitted by law."
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Governing Law & Contact */}
            <div className="pt-10 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                 <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <Gavel className="h-5 w-5 text-blue-600" /> Governing Law
                 </h4>
                 <p className="text-slate-500 text-sm leading-relaxed">
                   These terms are governed by the laws of the United States. 
                   Any disputes will be handled in the exclusive jurisdiction of 
                   our local courts.
                 </p>
               </div>
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                 <h4 className="font-bold text-slate-900 mb-4">Legal Inquiries</h4>
                 <div className="space-y-2 text-sm">
                   <p className="flex justify-between">
                     <span className="text-slate-400">Email:</span>
                     <span className="font-medium text-blue-600">legal@modernmart.com</span>
                   </p>
                   <p className="flex justify-between">
                     <span className="text-slate-400">Response Time:</span>
                     <span className="font-medium">3-5 Business Days</span>
                   </p>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}