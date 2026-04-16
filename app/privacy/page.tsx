import { Shield, Eye, Lock, Users, Fingerprint, FileText, Globe, Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function PrivacyPage() {
  const sections = [
    { id: "collect", title: "Information We Collect" },
    { id: "use", title: "How We Use It" },
    { id: "sharing", title: "Data Sharing" },
    { id: "security", title: "Security Measures" },
    { id: "rights", title: "Your Rights" }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-600">
              <Shield className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Privacy & <span className="text-emerald-600">Data Policy</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            We believe privacy is a fundamental right. We’ve designed our systems 
            to collect only what is necessary to give you a great experience.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-medium text-slate-500 shadow-sm">
            <Lock className="h-4 w-4" /> Last updated: April 2, 2026
          </div>
        </div>

        {/* Trust Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {[
            { icon: <Fingerprint />, title: "Anonymity", desc: "Minimal data collection for crypto users." },
            { icon: <Eye />, title: "Transparency", desc: "No hidden trackers or 3rd party ads." },
            { icon: <Lock />, title: "Encryption", desc: "End-to-end security for all data syncs." },
            { icon: <Users />, title: "Ownership", desc: "Request your data or delete it in one click." },
          ].map((item, i) => (
            <div key={i} className="group p-8 bg-white rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Sticky Navigation */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 h-fit">
            <nav className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 ml-4">Contents</p>
              {sections.map((s) => (
                <a 
                  key={s.id}
                  href={`#${s.id}`} 
                  className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all font-medium"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Policy Content */}
          <div className="lg:col-span-9 space-y-12">
            
            {/* Section 1 */}
            <section id="collect" className="scroll-mt-24">
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
                <div className="h-2 bg-emerald-500 w-full" />
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-3xl font-bold flex items-center gap-3">
                    <FileText className="text-emerald-600" /> Information We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-6 rounded-2xl bg-slate-50">
                      <h4 className="font-bold text-slate-900 mb-4">Core Account Data</h4>
                      <ul className="space-y-3 text-slate-600 text-sm">
                        <li className="flex items-center gap-2">• Contact Name & Email</li>
                        <li className="flex items-center gap-2">• Shipping Destinations</li>
                        <li className="flex items-center gap-2">• Order History</li>
                      </ul>
                    </div>
                    <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                      <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                        <Globe className="h-4 w-4" /> Blockchain Data
                      </h4>
                      <ul className="space-y-3 text-emerald-800/80 text-sm">
                        <li className="flex items-center gap-2">• Public Wallet Address</li>
                        <li className="flex items-center gap-2">• Polygon Transaction Hashes</li>
                        <li className="flex items-center gap-2">• MBONE Payment Metadata</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 2 */}
            <section id="use" className="scroll-mt-24">
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem]">
                <CardHeader className="p-8">
                  <CardTitle className="text-3xl font-bold flex items-center gap-3">
                    <Bell className="text-blue-500" /> How We Use Your Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="space-y-6">
                    {[
                      { t: "Service Delivery", d: "Fulfilling orders, verifying blockchain transactions, and providing support." },
                      { t: "Communication", d: "Important account updates and transaction receipts via secure email." },
                      { t: "Platform Growth", d: "Anonymized analytics to improve the shopping experience for everyone." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{item.t}</p>
                          <p className="text-slate-500 text-sm">{item.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 3: Data Security */}
            <section id="security" className="scroll-mt-24">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-500/10 to-transparent" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Lock className="text-emerald-400" /> Security Infrastructure
                  </h3>
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <p className="text-slate-400 leading-relaxed">
                        We leverage the best of both worlds: industry-standard AES-256 encryption 
                        for off-chain data and the immutable security of the Polygon network for payments.
                      </p>
                      <ul className="grid grid-cols-1 gap-3">
                        {["SSL/TLS 1.3 Encryption", "Real-time threat monitoring", "Zero-knowledge proofs where possible"].map((li, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-emerald-400" /> {li}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-center">
                       <div className="w-full aspect-video bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                          <Shield className="h-12 w-12 text-emerald-400 mb-4 animate-pulse" />
                          <p className="text-xs font-mono text-emerald-400/60 uppercase tracking-widest">System Status: Active</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Final Contact Section */}
            <div className="text-center py-12">
               <h4 className="text-xl font-bold text-slate-900 mb-4">Have questions about your data?</h4>
               <p className="text-slate-500 mb-8">Our dedicated privacy officer is here to help.</p>
               <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a href="mailto:privacy@modernmart.com" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all">
                    Email Privacy Officer
                  </a>
                  <button className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                    Request Data Export
                  </button>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}