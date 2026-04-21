import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Menu, X, LayoutDashboard, FileText, Zap, Package, Users, Bell, LogOut, LogIn, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/requests', label: 'Requests', icon: FileText },
  { path: '/simulation', label: 'Simulation', icon: Zap },
  { path: '/resources', label: 'Resources', icon: Package },
  { path: '/volunteers', label: 'Volunteers', icon: Users },
  { path: '/alerts', label: 'Alerts', icon: Bell },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] glass border-b border-white/5 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/40 transition-all duration-500" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center border border-white/10 shadow-2xl">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white leading-tight">
                <span className="text-primary">PS</span>RS
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Predictive Intel</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                    ${active ? 'text-primary' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  <Icon className={`w-4 h-4 ${active ? 'animate-pulse' : ''}`} />
                  {link.label}
                  {active && (
                    <motion.div layoutId="nav-active" className="absolute -bottom-[21px] left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-4px_12px_rgba(14,165,233,0.5)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Section */}
          <div className="hidden lg:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-white">{user.name}</span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{user.role}</span>
                </div>
                <div className="relative group">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-colors">
                    <Users className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="absolute top-full right-0 mt-2 w-48 py-2 glass border border-white/10 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 shadow-2xl">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-medium">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all duration-300">
                <LogIn className="w-4 h-4" /> Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/5 overflow-hidden">
            <div className="px-6 py-8 space-y-2">
              {navLinks.map(link => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-semibold transition-all
                      ${active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <Icon className="w-5 h-5" />{link.label}
                  </Link>
                );
              })}
              <div className="pt-6 mt-6 border-t border-white/10">
                {user ? (
                  <button onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-base font-bold text-rose-400 hover:bg-rose-500/10 transition-colors">
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-bold text-primary hover:bg-primary/10 transition-colors">
                    <LogIn className="w-5 h-5" /> Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
