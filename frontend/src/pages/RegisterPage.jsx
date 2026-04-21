import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, User, UserPlus, AlertCircle, RefreshCw, Briefcase, Heart, Globe } from 'lucide-react';

const roles = [
  { value: 'ngo', label: 'Command Hub', desc: 'NGO Operations', icon: Shield, color: '#0ea5e9' },
  { value: 'volunteer', label: 'Responder', desc: 'Field Support', icon: Heart, color: '#8b5cf6' },
  { value: 'citizen', label: 'Civilian', desc: 'Report Needs', icon: Globe, color: '#10b981' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Enrollment failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-[#020617]">
      <div className="mesh-bg opacity-30" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-secondary/10 blur-[150px] rounded-full -translate-y-1/3 -translate-x-1/4" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full translate-y-1/3 translate-x-1/4" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="relative w-full max-w-xl z-10 py-12">
        
        <div className="text-center mb-10">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
            className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-secondary to-accent flex items-center justify-center mx-auto mb-6 shadow-[0_20px_50px_rgba(139,92,246,0.3)]">
            <UserPlus className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Personnel Enrollment</h1>
          <p className="text-slate-500 font-medium tracking-wide">Onboarding to PSRS Global Network</p>
        </div>

        <div className="glass rounded-[3rem] p-10 border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-xs font-bold uppercase tracking-widest mb-8">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Full Identity</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-secondary transition-colors" />
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-slate-700 focus:outline-none focus:border-secondary/50 focus:bg-white/[0.08] transition-all font-medium"
                    placeholder="Full Name" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Communication Node</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-secondary transition-colors" />
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-slate-700 focus:outline-none focus:border-secondary/50 focus:bg-white/[0.08] transition-all font-medium"
                    placeholder="you@example.com" required />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-secondary transition-colors" />
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-slate-700 focus:outline-none focus:border-secondary/50 focus:bg-white/[0.08] transition-all font-medium"
                  placeholder="••••••••••••" required minLength={6} />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Deployment Role</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {roles.map(r => {
                  const Icon = r.icon;
                  return (
                    <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                      className={`relative p-5 rounded-3xl border transition-all duration-300 text-left group overflow-hidden ${form.role === r.value
                        ? 'border-secondary bg-secondary/10 shadow-[0_10px_30px_rgba(139,92,246,0.15)]'
                        : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10 hover:bg-white/[0.08]'}`}>
                      <div className="relative z-10">
                        <Icon className={`w-6 h-6 mb-3 transition-transform group-hover:scale-110 ${form.role === r.value ? 'text-secondary' : 'text-slate-600'}`} />
                        <div className={`text-xs font-black uppercase tracking-tighter mb-1 ${form.role === r.value ? 'text-white' : 'text-slate-400'}`}>{r.label}</div>
                        <div className="text-[9px] font-medium opacity-60 leading-tight uppercase tracking-widest">{r.desc}</div>
                      </div>
                      {form.role === r.value && (
                        <motion.div layoutId="role-glow" className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-gradient-to-r from-secondary to-accent text-white font-black text-lg shadow-[0_20px_50px_rgba(139,92,246,0.3)] hover:shadow-secondary/50 transition-all active:scale-[0.98] disabled:opacity-50 mt-4">
              {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <><UserPlus className="w-6 h-6" /> Initialize Enrollment</>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already in the network? <Link to="/login" className="text-secondary hover:text-white transition-colors font-black">Secure Sign In</Link>
            </p>
          </div>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="text-center mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">
          Global Protocol v4.0.2 // Decentralized Identity Standard
        </motion.p>
      </motion.div>
    </div>
  );
}


