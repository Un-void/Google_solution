import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Filter, Search, X, Send, MapPin, Users as UsersIcon,
  AlertTriangle, Clock, CheckCircle, ChevronDown, Shield, Layers, Activity } from 'lucide-react';
import api from '../services/api';

const typeOptions = ['food', 'medical', 'shelter', 'evacuation', 'water', 'clothing'];
const urgencyOptions = ['low', 'medium', 'high', 'critical'];
const statusOptions = ['pending', 'verified', 'assigned', 'in-progress', 'resolved'];
const channelOptions = ['web', 'sms', 'voice', 'app'];
const urgencyColors = { critical: '#ef4444', high: '#f59e0b', medium: '#0ea5e9', low: '#10b981' };
const statusColors = { pending: '#64748b', verified: '#0ea5e9', assigned: '#8b5cf6', 'in-progress': '#f59e0b', resolved: '#10b981' };

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ type: '', status: '', urgency: '', search: '' });
  const [zones, setZones] = useState([]);
  const [form, setForm] = useState({ title: '', type: 'food', zone: 'zone-1', urgency: 'medium', people: '', description: '', channel: 'web' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.urgency) params.urgency = filters.urgency;
      if (filters.search) params.search = filters.search;
      const [rRes, sRes, zRes] = await Promise.all([
        api.get('/requests', { params }), api.get('/requests/stats'), api.get('/prediction/zones'),
      ]);
      setRequests(rRes.data);
      setStats(sRes.data);
      setZones(zRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, [filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/requests', { ...form, people: parseInt(form.people) || 0 });
      setShowForm(false);
      setForm({ title: '', type: 'food', zone: 'zone-1', urgency: 'medium', people: '', description: '', channel: 'web' });
      fetchData();
    } catch (err) { console.error(err); }
    setSubmitting(false);
  };

  const statCards = [
    { label: 'Total Volume', value: stats.total || 0, color: 'text-white', icon: Layers },
    { label: 'Critical Priority', value: stats.critical || 0, color: 'text-danger', icon: AlertTriangle },
    { label: 'In Operation', value: stats.inProgress || 0, color: 'text-warning', icon: Activity },
    { label: 'Resolved', value: stats.resolved || 0, color: 'text-success', icon: CheckCircle },
  ];

  return (
    <div className="pt-24 pb-12 px-6 max-w-[1400px] mx-auto min-h-screen relative">
      <div className="mesh-bg opacity-20" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <Layers className="w-3 h-3" /> Operations Center
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Request Management</h1>
          <p className="text-slate-500 text-lg mt-2 font-light">Orchestrating community response with predictive precision.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] transition-all active:scale-95">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 
          New Response Request
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 relative z-10">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={i} className="glass rounded-3xl p-6 border-white/5"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{s.label}</div>
                  <div className={`text-2xl font-black mt-0.5 ${s.color}`}>{s.value}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-8 relative z-10">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input type="text" placeholder="Search operational requests..." value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-12 pr-6 py-4 rounded-2xl glass border-white/5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-all" />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
          {[{ key: 'type', opts: typeOptions, icon: Filter }, { key: 'urgency', opts: urgencyOptions, icon: AlertTriangle }, { key: 'status', opts: statusOptions, icon: Activity }].map(f => (
            <div key={f.key} className="relative group">
              <select value={filters[f.key]} onChange={e => setFilters({ ...filters, [f.key]: e.target.value })}
                className="appearance-none pl-10 pr-10 py-4 rounded-2xl glass border-white/5 text-xs font-bold uppercase tracking-wider text-slate-400 focus:outline-none focus:border-primary/50 cursor-pointer hover:bg-white/5 transition-all">
                <option value="">All {f.key}s</option>
                {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none group-hover:text-primary transition-colors" />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none group-hover:text-primary transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Content List */}
      <div className="grid gap-4 relative z-10">
        <AnimatePresence mode="popLayout">
          {requests.map((req, i) => (
            <motion.div key={req.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-[2rem] p-6 border-white/5 group hover:bg-white/[0.03]"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-black text-white group-hover:text-primary transition-colors tracking-tight">{req.title}</h3>
                    {req.isDuplicate && (
                      <span className="px-2 py-0.5 rounded bg-danger/10 text-danger text-[10px] font-black uppercase tracking-tighter">Likely Duplicate</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                      <MapPin className="w-4 h-4 text-primary" />
                      {zones.find(z => z.id === req.zone)?.name?.split('–')[1]?.trim() || req.zone}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                      <UsersIcon className="w-4 h-4 text-secondary" />
                      {req.people} Affected
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                      <Clock className="w-4 h-4 text-slate-600" />
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase text-slate-400">
                      Channel: {req.channel}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 shadow-inner">
                    <Shield className="w-4 h-4 text-success" />
                    <span className="text-xs font-black text-success tracking-widest uppercase">{req.credibilityScore}% Trust</span>
                  </div>
                  <div className="h-8 w-px bg-white/10 hidden lg:block" />
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest" 
                      style={{ backgroundColor: `${urgencyColors[req.urgency]}15`, color: urgencyColors[req.urgency], border: `1px solid ${urgencyColors[req.urgency]}30` }}>
                      {req.urgency}
                    </span>
                    <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest" 
                      style={{ backgroundColor: `${statusColors[req.status]}15`, color: statusColors[req.status], border: `1px solid ${statusColors[req.status]}30` }}>
                      {req.status}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {requests.length === 0 && (
          <div className="text-center py-20 glass rounded-[2rem] border-dashed border-white/10">
            <FileText className="w-16 h-16 text-slate-800 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-slate-700">No operational records found</h3>
            <p className="text-slate-600 mt-2">Adjust your filters or initiate a new request record.</p>
          </div>
        )}
      </div>

      {/* Modal Overhaul */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setShowForm(false)} />
            
            <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-2xl glass rounded-[3rem] p-10 border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setShowForm(false)} className="p-3 rounded-full hover:bg-white/5 transition-colors text-slate-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">Initiate Response</h2>
                <p className="text-slate-500 font-medium mt-2">Document operational requirements for deployment.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Incident Title</label>
                  <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 transition-all font-medium"
                    placeholder="Briefly state the core requirement..." required />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Category</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-slate-300 focus:outline-none focus:border-primary/50 font-bold uppercase tracking-widest text-[10px]">
                      {typeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Urgency Vector</label>
                    <select value={form.urgency} onChange={e => setForm({ ...form, urgency: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-slate-300 focus:outline-none focus:border-primary/50 font-bold uppercase tracking-widest text-[10px]">
                      {urgencyOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Target Zone</label>
                    <select value={form.zone} onChange={e => setForm({ ...form, zone: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-slate-300 focus:outline-none focus:border-primary/50 font-bold uppercase tracking-widest text-[10px]">
                      {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Impact Magnitude (People)</label>
                    <input type="number" value={form.people} onChange={e => setForm({ ...form, people: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-slate-700 focus:outline-none focus:border-primary/50 transition-all font-black"
                      placeholder="0" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Operational Insight</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 transition-all resize-none font-light leading-relaxed"
                    placeholder="Provide critical context for deployment teams..." />
                </div>

                <button type="submit" disabled={submitting}
                  className="w-full py-5 rounded-2xl bg-primary text-white font-black text-lg shadow-[0_20px_50px_rgba(14,165,233,0.3)] hover:shadow-primary/50 transition-all active:scale-[0.98] disabled:opacity-50">
                  {submitting ? "Processing..." : "Authorize Deployment"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
