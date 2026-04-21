import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, LogIn, AlertCircle, Sparkles, Fingerprint, ChevronRight, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-[#020617]">
      <div className="mesh-bg opacity-30" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/3" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-lg z-10">
        
        <div className="text-center mb-10">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
            className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-[0_20px_50px_rgba(14,165,233,0.3)]">
            <Fingerprint className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Secure Gateway</h1>
          <p className="text-slate-500 font-medium tracking-wide">Accessing PSRS Command Intelligence</p>
        </div>

        <div className="glass rounded-[3rem] p-10 border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-xs font-bold uppercase tracking-widest mb-8">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Authorized Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-slate-700 focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all font-medium"
                  placeholder="admin@psrs.org" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-slate-700 focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all font-medium"
                  placeholder="••••••••••••" required />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-primary text-white font-black text-lg shadow-[0_20px_50px_rgba(14,165,233,0.3)] hover:shadow-primary/50 transition-all active:scale-[0.98] disabled:opacity-50">
              {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <><LogIn className="w-6 h-6" /> Authenticate Access</>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm font-medium">
              New to the platform? <Link to="/register" className="text-primary hover:text-white transition-colors font-black">Request Credentials</Link>
            </p>
          </div>

          <div className="mt-10 p-6 rounded-[2rem] bg-white/5 border border-white/5 relative group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-warning" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Simulation Access</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-slate-500 uppercase">Command Hub</span>
                   <span className="text-[11px] font-mono text-primary font-black">admin@psrs.org</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-slate-500 uppercase">Responder Node</span>
                   <span className="text-[11px] font-mono text-secondary font-black">volunteer@psrs.org</span>
                </div>
                <div className="pt-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-slate-600">
                  <Shield className="w-3 h-3" /> Standard Key: password123
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="text-center mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">
          Encrypted Protocol v4.0.2 // Global Security Standard
        </motion.p>
      </motion.div>
    </div>
  );
}


