import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { Package, AlertTriangle, TrendingDown, ArrowUpRight, Plus, X, Layers, Filter, Activity, MapPin, Inbox, Archive } from 'lucide-react';
import api from '../services/api';

const typeColors = { food: '#0ea5e9', medical: '#8b5cf6', shelter: '#f59e0b', water: '#3b82f6', clothing: '#10b981', evacuation: '#ef4444' };
const severityColors = { critical: '#ef4444', high: '#f59e0b', moderate: '#0ea5e9' };

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [gaps, setGaps] = useState({ gaps: [], summary: {} });
  const [zones, setZones] = useState([]);
  const [filter, setFilter] = useState({ type: '', zone: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: 'food', name: '', zone: 'zone-1', available: '', required: '', unit: 'units' });

  const fetchData = async () => {
    try {
      const [rRes, gRes, zRes] = await Promise.all([
        api.get('/resources', { params: filter }), api.get('/resources/gaps'), api.get('/prediction/zones'),
      ]);
      setResources(rRes.data);
      setGaps(gRes.data);
      setZones(zRes.data);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchData(); }, [filter]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/resources', { ...form, available: parseInt(form.available), required: parseInt(form.required) });
      setShowAdd(false);
      setForm({ type: 'food', name: '', zone: 'zone-1', available: '', required: '', unit: 'units' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const pieData = Object.entries(gaps.summary?.byType || {}).map(([type, data]) => ({
    name: type, value: data.totalGap, fill: typeColors[type] || '#94a3b8',
  }));

  const barData = gaps.gaps?.slice(0, 6).map(g => ({
    name: g.name.split(' ')[0],
    available: g.available, 
    required: g.required,
    gap: g.required - g.available,
  })) || [];

  return (
    <div className="pt-24 pb-12 px-6 max-w-[1400px] mx-auto min-h-screen relative">
      <div className="mesh-bg opacity-20" />

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest mb-4">
            <Archive className="w-3 h-3" /> Supply Chain Intelligence
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Resource Inventory</h1>
          <p className="text-slate-500 text-lg mt-2 font-light">Global logistics tracking and critical shortage analysis.</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-secondary text-white font-bold hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all active:scale-95">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 
          Register New Supplies
        </button>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 relative z-10">
        {[
          { label: 'Asset Classes', value: resources.length, icon: Layers, color: 'text-primary' },
          { label: 'Active Shortages', value: gaps.summary?.totalShortages || 0, icon: AlertTriangle, color: 'text-danger' },
          { label: 'Critical Voids', value: gaps.summary?.criticalShortages || 0, icon: Activity, color: 'text-warning' },
          { label: 'Deficit Volume', value: gaps.summary?.totalGapUnits || 0, icon: TrendingDown, color: 'text-secondary' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={i} className="glass rounded-3xl p-6 border-white/5"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <Icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</div>
                  <div className="text-2xl font-black text-white mt-1 leading-none">{s.value}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 relative z-10">
        <div className="lg:col-span-2 glass rounded-[3rem] p-10 border-white/5">
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Demand vs Capacity</h3>
            </div>
          </div>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '1.5rem', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Bar dataKey="available" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="In Inventory" />
                <Bar dataKey="gap" fill="#ef4444" radius={[4, 4, 0, 0]} name="Required Delta" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-[320px] flex items-center justify-center text-slate-600 font-bold uppercase tracking-widest text-xs">Awaiting Logistics Data</div>}
        </div>

        <div className="glass rounded-[3rem] p-10 border-white/5 flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">Shortage Profile</h3>
          </div>
          {pieData.length > 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                    {pieData.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.8} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '1.5rem', fontSize: '11px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="flex-1 flex items-center justify-center text-slate-600 font-bold uppercase tracking-widest text-xs">No Profile Data</div>}
        </div>
      </div>

      {/* Resource Inventory Table/Grid */}
      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
             <div className="relative group">
              <select value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}
                className="appearance-none pl-10 pr-10 py-3 rounded-2xl glass border-white/5 text-xs font-black uppercase tracking-wider text-slate-400 focus:outline-none focus:border-primary/50 cursor-pointer hover:bg-white/5 transition-all">
                <option value="">All Categories</option>
                {Object.keys(typeColors).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none group-hover:text-primary transition-colors" />
            </div>
            <div className="relative group">
              <select value={filter.zone} onChange={e => setFilter({ ...filter, zone: e.target.value })}
                className="appearance-none pl-10 pr-10 py-3 rounded-2xl glass border-white/5 text-xs font-black uppercase tracking-wider text-slate-400 focus:outline-none focus:border-primary/50 cursor-pointer hover:bg-white/5 transition-all">
                <option value="">Operational Zones</option>
                {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none group-hover:text-primary transition-colors" />
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{resources.length} Inventory Objects Found</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {resources.map((r, i) => {
              const pct = r.required > 0 ? Math.round((r.available / r.required) * 100) : 100;
              const isShortage = r.available < r.required;
              const severity = pct < 30 ? 'critical' : pct < 60 ? 'high' : 'moderate';
              return (
                <motion.div key={r.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card rounded-[2rem] p-6 border-white/5 group hover:bg-white/[0.03] transition-all`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: typeColors[r.type] || '#94a3b8' }} />
                      <span className="text-base font-black text-white tracking-tight group-hover:text-primary transition-colors">{r.name}</span>
                    </div>
                    {isShortage && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest"
                        style={{ backgroundColor: `${severityColors[severity]}15`, color: severityColors[severity], border: `1px solid ${severityColors[severity]}30` }}>
                        {severity}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase mb-6">
                    <MapPin className="w-3 h-3" />
                    {zones.find(z => z.id === r.zone)?.name || r.zone}
                  </div>

                  <div className="space-y-3">
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }}
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ backgroundColor: isShortage ? severityColors[severity] : '#10b981', boxShadow: `0 0 10px ${isShortage ? severityColors[severity] : '#10b981'}40` }} />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black uppercase text-slate-600 tracking-tighter mb-1">In Stock / Required</span>
                         <span className="text-sm font-black text-slate-300">{r.available} / {r.required} {r.unit}</span>
                      </div>
                      <span className={`text-xl font-black ${isShortage ? 'text-danger' : 'text-success'}`}>{pct}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        
        {resources.length === 0 && (
          <div className="text-center py-24 glass rounded-[2.5rem] border-dashed border-white/10">
            <Inbox className="w-16 h-16 text-slate-800 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-slate-700">Warehouse Record Empty</h3>
            <p className="text-slate-600 mt-2">Modify deployment filters or register new logistic assets.</p>
          </div>
        )}
      </div>

      {/* Inventory Registration Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setShowAdd(false)} />
            
            <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-xl glass rounded-[3rem] p-10 border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setShowAdd(false)} className="p-3 rounded-full hover:bg-white/5 transition-colors text-slate-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-10">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                  <Plus className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">Register Logistics</h2>
                <p className="text-slate-500 font-medium mt-2">Initialize new asset records for the global inventory.</p>
              </div>

              <form onSubmit={handleAdd} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Asset Nomenclature</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:border-secondary/50 font-medium"
                    placeholder="E.g. Surgical Kit Alpha..." required />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Category</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-slate-300 focus:outline-none focus:border-secondary/50 font-bold uppercase tracking-widest text-[10px]">
                      {Object.keys(typeColors).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Operational Zone</label>
                    <select value={form.zone} onChange={e => setForm({ ...form, zone: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-slate-300 focus:outline-none focus:border-secondary/50 font-bold uppercase tracking-widest text-[10px]">
                      {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Current</label>
                    <input type="number" value={form.available} onChange={e => setForm({ ...form, available: e.target.value })}
                      className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-slate-700 focus:outline-none focus:border-secondary/50 font-black text-center"
                      placeholder="0" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Target</label>
                    <input type="number" value={form.required} onChange={e => setForm({ ...form, required: e.target.value })}
                      className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-slate-700 focus:outline-none focus:border-secondary/50 font-black text-center"
                      placeholder="0" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Unit</label>
                    <input type="text" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}
                      className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-slate-700 focus:outline-none focus:border-secondary/50 font-bold text-center text-[10px] uppercase tracking-widest"
                      placeholder="Units" />
                  </div>
                </div>

                <button type="submit"
                  className="w-full py-5 rounded-2xl bg-secondary text-white font-black text-lg shadow-[0_20px_50px_rgba(168,85,247,0.3)] hover:shadow-secondary/50 transition-all active:scale-[0.98]">
                  Confirm Inventory Registration
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
