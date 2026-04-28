import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MapPin, Star, Award, Phone, CheckCircle, Clock, Search, Filter, Shield, Activity, Heart, Briefcase } from 'lucide-react';
import api from '../services/api';

const skillColors = {
  medical: '#8b5cf6', logistics: '#3b82f6', 'search-rescue': '#ef4444', counseling: '#10b981',
  driving: '#f59e0b', cooking: '#0ea5e9', 'tech-support': '#6366f1', 'first-aid': '#ec4899',
};

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [zones, setZones] = useState([]);
  const [filters, setFilters] = useState({ zone: '', skill: '', status: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const params = {};
        if (filters.zone) params.zone = filters.zone;
        if (filters.skill) params.skill = filters.skill;
        if (filters.status) params.status = filters.status;
        const [vRes, zRes] = await Promise.all([
          api.get('/volunteers', { params }), api.get('/prediction/zones'),
        ]);
        setVolunteers(vRes.data);
        setZones(zRes.data);
      } catch (err) { console.error(err); }
    };
    fetch();
  }, [filters]);

  const filtered = search
    ? volunteers.filter(v => v.name.toLowerCase().includes(search.toLowerCase()))
    : volunteers;

  const totalVol = volunteers.length;
  const available = volunteers.filter(v => v.status === 'available').length;
  const deployed = volunteers.filter(v => v.status === 'deployed').length;
  const avgRating = volunteers.length > 0
    ? (volunteers.reduce((a, v) => a + v.rating, 0) / volunteers.length).toFixed(1) : 0;

  return (
    <div className="pt-24 pb-12 px-6 max-w-[1400px] mx-auto min-h-screen relative">
      <div className="mesh-bg opacity-20" />

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <Shield className="w-3 h-3" /> Personnel Command
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Responder Network</h1>
          <p className="text-slate-500 text-lg mt-2 font-light">Orchestrating elite volunteer teams for rapid zone deployment.</p>
        </div>
      </div>

      {/* Analytical HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 relative z-10">
        {[
          { label: 'Total Responders', value: totalVol, color: 'text-white', icon: Users, bg: 'bg-white/5' },
          { label: 'Active Standby', value: available, color: 'text-success', icon: CheckCircle, bg: 'bg-success/5' },
          { label: 'In Operation', value: deployed, color: 'text-warning', icon: Activity, bg: 'bg-warning/5' },
          { label: 'Network Merit', value: avgRating, color: 'text-secondary', icon: Star, bg: 'bg-secondary/5' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={i} className="glass rounded-3xl p-6 border-white/5 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl ${s.bg} border border-white/5 flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div>
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Intelligence Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8 relative z-10">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input type="text" placeholder="Identify responder by name or ID..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl glass border-white/5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 transition-all" />
        </div>
        <div className="flex flex-wrap items-center gap-3 pb-2 md:pb-0">
          <div className="relative group">
            <select value={filters.zone} onChange={e => setFilters({ ...filters, zone: e.target.value })}
              className="appearance-none pl-10 pr-10 py-4 rounded-2xl glass border-white/5 text-xs font-black uppercase tracking-wider text-slate-400 focus:outline-none focus:border-primary/50 cursor-pointer hover:bg-white/5 transition-all">
              <option value="">All Regions</option>
              {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
            </select>
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none group-hover:text-primary transition-colors" />
          </div>
          <div className="relative group">
            <select value={filters.skill} onChange={e => setFilters({ ...filters, skill: e.target.value })}
              className="appearance-none pl-10 pr-10 py-4 rounded-2xl glass border-white/5 text-xs font-black uppercase tracking-wider text-slate-400 focus:outline-none focus:border-primary/50 cursor-pointer hover:bg-white/5 transition-all">
              <option value="">Specialization</option>
              {Object.keys(skillColors).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none group-hover:text-primary transition-colors" />
          </div>
          <div className="relative group">
            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}
              className="appearance-none pl-10 pr-10 py-4 rounded-2xl glass border-white/5 text-xs font-black uppercase tracking-wider text-slate-400 focus:outline-none focus:border-primary/50 cursor-pointer hover:bg-white/5 transition-all">
              <option value="">Readiness</option>
              <option value="available">Available</option>
              <option value="deployed">Deployed</option>
            </select>
            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>

      {/* Personnel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <AnimatePresence mode="popLayout">
          {filtered.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-[2.5rem] p-8 border-white/5 hover:bg-white/[0.03] transition-all group"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/5 flex items-center justify-center text-white font-black text-xl shadow-2xl group-hover:scale-110 transition-transform">
                    {v.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-primary transition-colors tracking-tight">{v.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">
                      <MapPin className="w-3 h-3 text-primary" />
                      {zones.find(z => z.id === v.zone)?.name?.split('–')[1]?.trim() || v.zone}
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${v.status === 'available' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                  {v.status}
                </div>
              </div>

              {/* Skill Matrix */}
              <div className="flex flex-wrap gap-2 mb-8 min-h-[60px]">
                {v.skills.map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border"
                    style={{ backgroundColor: `${skillColors[s]}10`, color: skillColors[s], borderColor: `${skillColors[s]}20` }}>
                    {s}
                  </span>
                ))}
              </div>

              {/* Service Metrics */}
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex gap-6">
                   <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-slate-600 tracking-tighter mb-1">Missions</span>
                    <div className="flex items-center gap-1.5 text-white font-black text-sm">
                      <Award className="w-3.5 h-3.5 text-secondary" /> {v.deployments}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-slate-600 tracking-tighter mb-1">Merit</span>
                    <div className="flex items-center gap-1.5 text-white font-black text-sm">
                      <Star className="w-3.5 h-3.5 text-warning" /> {v.rating}
                    </div>
                  </div>
                </div>
                <button className="p-3 rounded-2xl bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 glass rounded-[3rem] border-dashed border-white/10 relative z-10">
          <Users className="w-16 h-16 text-slate-800 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-slate-700 uppercase tracking-tighter">No Active Personnel Identified</h3>
          <p className="text-slate-600 mt-2 font-medium">Verify deployment criteria or synchronize network databases.</p>
        </div>
      )}
    </div>
  );
}
