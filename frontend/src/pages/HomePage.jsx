import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Brain, Radio, WifiOff, ShieldCheck, FlaskConical, BarChart3, Cpu, Bell,
  ArrowRight, Zap, Clock, Users, TrendingUp, ChevronDown, Activity, Globe, Heart } from 'lucide-react';

const features = [
  { icon: Brain, title: 'Predictive Risk Engine', desc: 'Harnesses weather patterns and historical data to forecast crises before they strike.', color: 'from-primary to-blue-600' },
  { icon: Radio, title: 'Multi-Channel Intelligence', desc: 'Aggregates signals from SMS, Voice, and Web for comprehensive situational awareness.', color: 'from-secondary to-purple-600' },
  { icon: WifiOff, title: 'Offline-First Resilience', desc: 'Engineered for disaster zones. Operates without connectivity, syncing when the grid returns.', color: 'from-amber-500 to-orange-600' },
  { icon: ShieldCheck, title: 'Trust & Verification', desc: 'AI-driven credibility scoring ensures every request is authentic and urgent.', color: 'from-emerald-500 to-green-600' },
  { icon: FlaskConical, title: 'Crisis Simulation', desc: 'Battle-test response protocols in simulated high-intensity disaster scenarios.', color: 'from-accent to-red-600' },
  { icon: BarChart3, title: 'Resource Gap Analysis', desc: 'Real-time delta tracking between available supplies and growing community needs.', color: 'from-indigo-500 to-violet-600' },
  { icon: Cpu, title: 'AI Recommendation', desc: 'Intelligent advisory for volunteer deployment and strategic resource allocation.', color: 'from-teal-500 to-cyan-600' },
  { icon: Bell, title: 'Critical Response Alerts', desc: 'Instant, priority-routed notifications for life-threatening shortages and zones.', color: 'from-pink-500 to-rose-600' },
];

const stats = [
  { icon: Clock, value: '3x', label: 'Faster Response' },
  { icon: TrendingUp, value: '92%', label: 'Prediction Accuracy' },
  { icon: Users, value: '50K+', label: 'Impacted Lives' },
  { icon: Zap, value: '75%', label: 'Resource Efficiency' },
];

const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

export default function HomePage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="relative bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-32">
        <div className="mesh-bg opacity-40" />
        
        {/* Abstract Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div style={{ y: y1 }} className="absolute top-[10%] right-[15%] w-72 h-72 bg-primary/20 rounded-full blur-[120px]" />
          <motion.div style={{ y: y1 }} className="absolute bottom-[20%] left-[10%] w-96 h-96 bg-secondary/15 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeInUp} transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border-white/10 text-xs font-bold uppercase tracking-widest text-primary mb-10 shadow-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Powered by Google AI & Cloud
            </motion.div>

            <motion.h1 variants={fadeInUp} transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-tight">
              <span className="text-white">Predict. Verify.</span>
              <br />
              <span className="gradient-text">Respond.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-14 leading-relaxed font-light">
              PSRS is the intelligent core of community resilience, transforming 
              <span className="text-white font-medium"> reactive response </span> 
              into 
              <span className="text-primary font-bold"> predictive intervention </span>.
            </motion.p>

            <motion.div variants={fadeInUp} transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-6">
              <Link to="/dashboard"
                className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white font-bold text-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-[0_0_40px_rgba(14,165,233,0.5)] active:scale-95">
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                Explore Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 ease-in-out" />
              </Link>
              <Link to="/simulation"
                className="flex items-center gap-3 px-8 py-4 rounded-2xl glass border-white/10 text-slate-200 font-bold text-lg hover:bg-white/5 transition-all duration-300 ease-in-out active:scale-95">
                <FlaskConical className="w-5 h-5 text-secondary" />
                Live Simulation
              </Link>
            </motion.div>
          </motion.div>
          <motion.div variants={fadeInUp} transition={{ duration: 0.8, delay: 0.4 }} 
              className="pt-10 mt-28 flex flex-wrap items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border-white/5 text-white">
                 <img src="https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/092015/google_new_icon.png?itok=PC-S9Ckc" alt="Google" className="w-4 h-4" /> 
                 Google Cloud Infrastructure
               </div>
               <span className="hidden sm:inline opacity-30">•</span>
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border-white/5 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                 UN SDG #3: Good Health
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border-white/5 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                 UN SDG #11: Sustainable Cities
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border-white/5 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                 UN SDG #13: Climate Action
               </div>
            </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-primary animate-bounce" />
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.span variants={fadeInUp} className="text-xs font-black text-accent uppercase tracking-[0.4em] mb-4 block">The Challenge</motion.span>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
                Modern response is <br /> hindered by <span className="text-accent/80">antiquated tech.</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 mb-10 leading-relaxed font-light">
                Traditional support systems are fragmented, relying on delayed reports and disconnected data sources. This leads to critical delays when seconds matter most.
              </motion.p>
              
              <div className="space-y-5">
                {[
                  { label: 'Resource Inefficiency', val: '65% overlap in aid' },
                  { label: 'Reporting Delay', val: 'Avg. 4hr response lag' },
                  { label: 'Data Trust', val: '30% duplicate requests' }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} className="flex items-center gap-5 p-6 rounded-2xl glass border-white/5">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-7 h-7 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">{item.label}</h4>
                      <p className="text-sm text-slate-500">{item.val}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1 }}
              className="relative aspect-square"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[4rem] rotate-6 scale-95 blur-2xl" />
              <div className="relative h-full w-full glass rounded-[3rem] border-white/10 flex items-center justify-center overflow-hidden">
                <Globe className="w-48 h-48 text-primary/20 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-10 text-center">
                    <Activity className="w-20 h-20 text-primary mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-white mb-2">Real-Time Impact</h3>
                    <p className="text-slate-500 text-sm">Visualizing global crisis signals</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-40 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-xs font-black text-primary uppercase tracking-[0.4em] mb-4 block">Our Ecosystem</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-5xl font-black text-white mb-6">Built for Absolute Reliability.</motion.h2>
            <motion.div initial={{ width: 0 }} whileInView={{ width: '100px' }} className="h-1.5 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-[2.5rem] p-10 flex flex-col h-full"
                >
                  <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${f.color} flex items-center justify-center mb-8 shadow-2xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-4 leading-tight">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-light flex-grow">{f.desc}</p>
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <button className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 group">
                      Learn More <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-[4rem] border-white/5 p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 mb-6">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="text-5xl font-black text-white mb-2 leading-none">{s.value}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold">{s.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-40 px-6 mb-24">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-[3rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
          <div className="relative glass rounded-[3rem] border-white/10 p-20 text-center overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight">Ready to Deploy?</h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Join the growing network of agencies and volunteers building the 
              future of resilient crisis management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/register" className="px-10 py-4 rounded-2xl bg-white text-background font-black text-lg hover:scale-105 transition-all duration-300 ease-in-out shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                Create Account
              </Link>
              <Link to="/dashboard" className="px-10 py-4 rounded-2xl glass border-white/10 text-white font-black text-lg hover:bg-white/5 transition-all duration-300 ease-in-out">
                System Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">PSRS</span>
            </Link>
            <p className="text-slate-500 text-sm font-medium">Predictive Social Response System v2.0</p>
          </div>
          <div className="flex gap-8 items-center text-xs font-bold uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <div className="flex items-center gap-2 text-slate-400 pl-8 border-l border-white/10">
              <Heart className="w-4 h-4 text-accent" />
              Built for Humanity
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
