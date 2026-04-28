import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, Users, FileText, Package, Bell, ChevronLeft, ChevronRight,
  Activity, TrendingUp, Brain, Shield, Zap, Clock, MapPin, Maximize2, Filter, Settings } from 'lucide-react';
import api from '../services/api';
import 'leaflet/dist/leaflet.css';

const riskColors = { critical: '#ef4444', high: '#f59e0b', moderate: '#0ea5e9', low: '#10b981' };
const severityColors = { critical: '#ef4444', high: '#f59e0b', moderate: '#0ea5e9' };
const typeIcons = { risk: AlertTriangle, shortage: Package, request: FileText };

function MapBounds({ zones }) {
  const map = useMap();
  useEffect(() => {
    if (zones.length > 0) {
      const bounds = zones.map(z => [z.lat, z.lng]);
      map.fitBounds(bounds, { padding: [100, 100] });
    }
  }, [zones, map]);
  return null;
}

export default function DashboardPage() {
  const [zones, setZones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [recommendations, setRecs] = useState([]);
  const [resourceGaps, setResourceGaps] = useState([]);
  const [stats, setStats] = useState({});
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [zRes, aRes, rqRes, recRes, rgRes, sRes] = await Promise.all([
          api.get('/prediction/zones'), api.get('/alerts?active=true'),
          api.get('/requests'), api.get('/recommendations'),
          api.get('/resources/gaps'), api.get('/requests/stats'),
        ]);
        setZones(zRes.data);
        setAlerts(aRes.data);
        setRequests(rqRes.data);
        setRecs(recRes.data);
        setResourceGaps(rgRes.data);
        setStats(sRes.data);
      } catch (err) { console.error('Dashboard fetch error:', err); }
    };
    fetchAll();
    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalVolunteers = zones.reduce((a, z) => a + (z.volunteers || 0), 0);
  const availableVol = zones.reduce((a, z) => a + (z.availableVolunteers || 0), 0);
  const gapData = resourceGaps.gaps?.slice(0, 5).map(g => ({
    name: g.name.split(' ')[0],
    gap: g.gapPercentage, 
    fill: g.severity === 'critical' ? '#ef4444' : g.severity === 'high' ? '#f59e0b' : '#0ea5e9',
  })) || [];

  const statCards = [
    { icon: Activity, label: 'Active Crises', value: zones.filter(z => z.riskLevel === 'critical').length, color: 'text-danger', bg: 'bg-danger/10' },
    { icon: FileText, label: 'Pending Requests', value: stats.pending || 0, color: 'text-warning', bg: 'bg-warning/10' },
    { icon: Users, label: 'Active Personnel', value: `${totalVolunteers - availableVol}/${totalVolunteers}`, color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Package, label: 'Resource Gaps', value: resourceGaps.summary?.totalShortages || 0, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  return (
    <div className="pt-20 h-screen flex flex-col bg-background overflow-hidden relative">
      <div className="mesh-bg opacity-20" />

      {/* Top Stats Bar */}
      <div className="flex-none relative z-50 px-6 py-4">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="glass rounded-2xl p-4 flex items-center gap-4 hover:border-white/20 transition-all duration-300 ease-in-out cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shadow-lg`}>
                  <Icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</div>
                  <div className="text-2xl font-black text-white leading-none mt-1">{s.value}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main Command Center */}
      <div className="flex-1 flex relative px-6 pb-6 gap-6 min-h-0">
        
        {/* Left HUD - Alerts & Intelligence */}
        <AnimatePresence>
          {leftOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -50 }}
              className="absolute md:relative z-50 left-0 md:left-auto top-0 md:top-auto h-full md:h-auto w-[85vw] sm:w-[320px] md:w-72 flex-none glass rounded-r-3xl md:rounded-3xl border-white/5 flex flex-col overflow-hidden"
            >
              <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-black text-xs uppercase tracking-widest text-white">Alert Feed</h3>
                </div>
                <div className="px-2 py-1 rounded-md bg-danger/10 text-danger text-[10px] font-black uppercase">Live</div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {alerts.map((a, i) => {
                  const Icon = typeIcons[a.type] || Bell;
                  return (
                    <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-2xl glass-card border-white/5 hover:bg-white/[0.03] group transition-all duration-300 ease-in-out"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xl`}
                          style={{ backgroundColor: `${severityColors[a.severity]}20` }}>
                          <Icon className="w-5 h-5" style={{ color: severityColors[a.severity] }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">{a.title}</p>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{a.message}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/5 text-slate-400">
                              {a.severity}
                            </span>
                            <span className="flex items-center gap-1 text-[9px] text-slate-600 font-bold">
                              <Clock className="w-3 h-3" /> {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="p-4 bg-secondary/5 border-t border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-4 h-4 text-secondary" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">AI Insights</h4>
                </div>
                <div className="space-y-2">
                  {recommendations.slice(0, 2).map((r, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px]">
                      <p className="text-white font-bold mb-1">{r.action}</p>
                      <p className="text-slate-500 leading-tight">{r.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Central Map HUD */}
        <div className="flex-1 relative glass rounded-[2.5rem] overflow-hidden border-white/10 shadow-2xl">
          <MapContainer center={[22, 82]} zoom={5} className="w-full h-full" zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
            <MapBounds zones={zones} />
            <ZoomControl position="bottomright" />
            
            {zones.map(zone => (
              <CircleMarker key={zone.id} center={[zone.lat, zone.lng]}
                radius={Math.max(20, zone.riskScore / 2)}
                pathOptions={{
                  fillColor: riskColors[zone.riskLevel], fillOpacity: 0.3,
                  color: riskColors[zone.riskLevel], weight: 2,
                }}
                eventHandlers={{ click: () => setSelectedZone(zone) }}>
                <Popup>
                  <div className="font-sans min-w-[220px] p-2">
                    <h3 className="text-lg font-black text-slate-900 mb-1">{zone.name}</h3>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 px-2 py-0.5 inline-block rounded bg-slate-100`} style={{ color: riskColors[zone.riskLevel] }}>
                      {zone.riskLevel} Risk • {zone.riskScore}%
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600">
                      <div><span className="font-bold text-slate-900">Personnel:</span> {zone.volunteers}</div>
                      <div><span className="font-bold text-slate-900">Requests:</span> {zone.activeRequests}</div>
                    </div>
                    {zone.weather && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-600 font-bold">{zone.weather.condition}</span>
                        <TrendingUp className={`w-4 h-4 ${zone.weather.trend === 'worsening' ? 'text-red-500' : 'text-green-500'}`} />
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          {/* Map Overlays */}
          <div className="absolute top-6 right-6 flex flex-col gap-3 z-[1000]">
            <button className="p-3 glass rounded-xl hover:bg-white/10 transition-all duration-300 ease-in-out shadow-2xl border-white/10 text-white">
              <Maximize2 className="w-5 h-5" />
            </button>
            <button className="p-3 glass rounded-xl hover:bg-white/10 transition-all duration-300 ease-in-out shadow-2xl border-white/10 text-white">
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-6 left-6 z-[1000] glass rounded-2xl p-5 border-white/10 shadow-2xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Risk Vector Legend</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(riskColors).map(([level, color]) => (
                <div key={level} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: color }} />
                  <span className="text-[10px] font-bold text-white uppercase tracking-tight opacity-70">{level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right HUD - Resource Analytics */}
        <AnimatePresence>
          {rightOpen && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 50 }}
              className="absolute md:relative z-50 right-0 md:right-auto top-0 md:top-auto h-full md:h-auto w-[85vw] sm:w-[320px] md:w-72 flex-none glass rounded-l-3xl md:rounded-3xl border-white/5 flex flex-col overflow-hidden"
            >
              <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-warning" />
                </div>
                <h3 className="font-black text-xs uppercase tracking-widest text-white">Supply Gaps</h3>
              </div>

              <div className="p-5 border-b border-white/5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Shortage Intensity</h4>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gapData} layout="vertical" margin={{ left: -30, right: 10 }}>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} width={80} />
                      <Bar dataKey="gap" radius={[0, 4, 4, 0]} barSize={12}>
                        {gapData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {resourceGaps.gaps?.slice(0, 8).map((g, i) => (
                  <div key={i} className="p-4 rounded-2xl glass-card border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-white tracking-tight">{g.name}</span>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/5" style={{ color: severityColors[g.severity] }}>
                        {g.severity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-3 h-3 text-slate-600" />
                      <span className="text-[10px] text-slate-500 font-bold truncate">{g.zoneName}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round(g.available / g.required * 100)}%` }}
                        className="h-full rounded-full" style={{ backgroundColor: severityColors[g.severity] }} />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-600 uppercase">
                      <span>{g.available} Units</span>
                      <span>Gap: {g.required - g.available}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Intelligence Ticker */}
      <div className="flex-none h-10 glass border-t border-white/5 flex items-center overflow-hidden z-50">
        <div className="flex items-center gap-3 px-6 h-full bg-primary/20 border-r border-white/5 shrink-0">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-[10px] font-black tracking-widest uppercase text-primary">Intelligence Stream</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="animate-ticker whitespace-nowrap flex items-center gap-12 py-2">
            {[...alerts, ...requests].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-[11px] font-medium text-slate-400 uppercase tracking-tight">
                <span className={`w-1.5 h-1.5 rounded-full ${item.severity === 'critical' ? 'bg-danger' : 'bg-warning'}`} />
                {item.title || item.type} • {item.zoneName || 'Global'} • {new Date(item.createdAt || Date.now()).toLocaleTimeString()}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Sidebar Toggles */}
      <button onClick={() => setLeftOpen(!leftOpen)} className="absolute left-4 top-1/2 -translate-y-1/2 z-[60] w-8 h-8 rounded-full glass border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 ease-in-out shadow-2xl">
        {leftOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      <button onClick={() => setRightOpen(!rightOpen)} className="absolute right-4 top-1/2 -translate-y-1/2 z-[60] w-8 h-8 rounded-full glass border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 ease-in-out shadow-2xl">
        {rightOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
}
