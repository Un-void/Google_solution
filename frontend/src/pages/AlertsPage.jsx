import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, Package, FileText, Shield, Filter, X,
  CheckCircle, Clock, MapPin, Brain, Zap, RefreshCw, Layers, Sparkles, Activity } from 'lucide-react';
import api from '../services/api';

const typeIcons = { risk: AlertTriangle, shortage: Package, request: FileText };
const typeLabels = { risk: 'Inherent Risk', shortage: 'Inventory Deficit', request: 'Tactical Request' };
const severityColors = { critical: '#ef4444', high: '#f59e0b', moderate: '#0ea5e9' };
const severityBg = { critical: 'bg-danger/10', high: 'bg-warning/10', moderate: 'bg-primary/10' };

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [recommendations, setRecs] = useState([]);
  const [zones, setZones] = useState([]);
  const [filter, setFilter] = useState({ type: '', severity: '' });
  const [generating, setGenerating] = useState(false);

  const fetchData = async () => {
    try {
      const params = {};
      if (filter.type) params.type = filter.type;
      if (filter.severity) params.severity = filter.severity;
      const [aRes, rRes, zRes] = await Promise.all([
        api.get('/alerts', { params }), api.get('/recommendations'), api.get('/prediction/zones'),
      ]);
      setAlerts(aRes.data);
      setRecs(rRes.data);
      setZones(zRes.data);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchData(); }, [filter]);

  const handleDismiss = async (id) => {
    try {
      await api.put(`/alerts/${id}/dismiss`);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.post('/recommendations/generate');
      fetchData();
    } catch (err) { console.error(err); }
    setGenerating(false);
  };

  const activeAlerts = alerts.filter(a => a.active);
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length;

  return (
    <div className="pt-24 pb-12 px-6 max-w-[1400px] mx-auto min-h-screen relative">
      <div className="mesh-bg opacity-20" />

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest mb-4">
            <Bell className="w-3 h-3" /> Intelligence Stream
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Alerts & Analytics</h1>
          <p className="text-slate-500 text-lg mt-2 font-light">Real-time situational awareness and AI-powered tactical insights.</p>
        </div>
        <button onClick={handleGenerate} disabled={generating}
          className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent to-secondary text-white font-bold hover:shadow-[0_0_30px_rgba(244,63,94,0.3)] transition-all active:scale-95 disabled:opacity-50">
          {generating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5 group-hover:scale-110 transition-transform" />}
          Execute AI Inference
        </button>
      </div>

      {/* Intelligence HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 relative z-10">
        {[
          { label: 'Active Signals', value: activeAlerts.length, color: 'text-white', icon: Activity, bg: 'bg-white/5' },
          { label: 'Critical Errors', value: criticalCount, color: 'text-danger', icon: AlertTriangle, bg: 'bg-danger/5' },
          { label: 'AI Hypotheses', value: recommendations.length, color: 'text-accent', icon: Sparkles, bg: 'bg-accent/5' },
          { label: 'Resolved Vectors', value: alerts.filter(a => !a.active).length, color: 'text-success', icon: CheckCircle, bg: 'bg-success/5' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Alerts Column */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-warning" />
              <h2 className="text-xl font-black text-white tracking-tight">Tactical Feed</h2>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
               <div className="relative group">
                <select value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}
                  className="appearance-none pl-10 pr-10 py-2.5 rounded-2xl glass border-white/5 text-[10px] font-black uppercase tracking-wider text-slate-400 focus:outline-none focus:border-primary/50 cursor-pointer hover:bg-white/5 transition-all">
                  <option value="">All Signal Types</option>
                  <option value="risk">Risk Vectors</option>
                  <option value="shortage">Resource Gaps</option>
                  <option value="request">Response Needs</option>
                </select>
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none group-hover:text-primary transition-colors" />
              </div>
              <div className="relative group">
                <select value={filter.severity} onChange={e => setFilter({ ...filter, severity: e.target.value })}
                  className="appearance-none pl-10 pr-10 py-2.5 rounded-2xl glass border-white/5 text-[10px] font-black uppercase tracking-wider text-slate-400 focus:outline-none focus:border-primary/50 cursor-pointer hover:bg-white/5 transition-all">
                  <option value="">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="moderate">Moderate</option>
                </select>
                <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none group-hover:text-danger transition-colors" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {alerts.map((a, i) => {
                const Icon = typeIcons[a.type] || Bell;
                const zone = zones.find(z => z.id === a.zone);
                return (
                  <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.03 }}
                    className={`glass-card rounded-[2rem] p-6 border-white/5 transition-all ${!a.active ? 'opacity-40 grayscale-[0.5]' : 'hover:bg-white/[0.03]'}`}>
                    <div className="flex items-start gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 ${severityBg[a.severity]}`}>
                        <Icon className="w-6 h-6" style={{ color: severityColors[a.severity] }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-black text-white tracking-tight group-hover:text-primary transition-colors">{a.title}</h3>
                            <p className="text-slate-500 text-sm mt-1 font-medium leading-relaxed">{a.message}</p>
                          </div>
                          {a.active && (
                            <button onClick={() => handleDismiss(a.id)}
                              className="p-3 rounded-2xl hover:bg-white/5 transition-colors shrink-0 text-slate-600 hover:text-white">
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-6 flex-wrap">
                          <span className="px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest"
                            style={{ backgroundColor: `${severityColors[a.severity]}15`, color: severityColors[a.severity], border: `1px solid ${severityColors[a.severity]}30` }}>
                            {a.severity}
                          </span>
                          <span className="px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white/5 text-slate-400 border border-white/5">
                            {typeLabels[a.type] || a.type}
                          </span>
                          {zone && (
                            <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                              <MapPin className="w-3 h-3 text-primary" />{zone.name.split('–')[1]?.trim()}
                            </span>
                          )}
                          <span className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                            <Clock className="w-3 h-3" />
                            {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {!a.active && (
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-success">
                              <CheckCircle className="w-3.5 h-3.5" /> Resolved
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {alerts.length === 0 && (
              <div className="text-center py-24 glass rounded-[3rem] border-dashed border-white/10">
                <Bell className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-700 uppercase tracking-tighter">Signal Silence</h3>
                <p className="text-slate-600 mt-2 font-medium">No active signals match your current intelligence filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations Column */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-8">
            <Brain className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-black text-white tracking-tight">AI Strategies</h2>
          </div>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {recommendations.map((r, i) => {
                const zone = zones.find(z => z.id === r.zone);
                const priorityColors = { critical: '#ef4444', high: '#f59e0b', medium: '#0ea5e9' };
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-[2.5rem] p-8 border-white/5 hover:border-accent/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-3xl rounded-full" />
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border"
                        style={{ backgroundColor: `${priorityColors[r.priority]}15`, color: priorityColors[r.priority], borderColor: `${priorityColors[r.priority]}30` }}>
                        {r.priority}
                      </span>
                      <span className="px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent border border-accent/20">
                        {r.category}
                      </span>
                    </div>
                    <p className="text-base font-black text-white tracking-tight mb-2 leading-snug group-hover:text-accent transition-colors">{r.action}</p>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">{r.reason}</p>
                    {zone && (
                      <div className="flex items-center gap-2 mt-6 text-[10px] font-bold text-slate-600">
                        <MapPin className="w-3 h-3 text-accent" />
                        {zone.name.split('–')[1]?.trim()}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {recommendations.length === 0 && (
              <div className="text-center py-20 glass rounded-[2.5rem] border-dashed border-white/10 opacity-50">
                 <Sparkles className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                 <p className="text-slate-600 font-bold text-[10px] uppercase tracking-[0.2em]">Awaiting Inference</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
