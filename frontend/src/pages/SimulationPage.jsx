import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Play, Pause, RotateCcw, Zap, Clock, Users, Package, FileText,
  AlertTriangle, Activity, ChevronRight, Waves, Mountain, Wind, Bug, Shield, Terminal, Timer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, AreaChart, Area } from 'recharts';
import api from '../services/api';

const scenarioIcons = { flood: Waves, earthquake: Mountain, cyclone: Wind, pandemic: Bug };
const scenarioColors = { 
  flood: 'from-blue-500 to-cyan-600', 
  earthquake: 'from-amber-500 to-orange-600', 
  cyclone: 'from-purple-500 to-pink-600', 
  pandemic: 'from-rose-500 to-red-600' 
};
const scenarioDesc = {
  flood: 'Large-scale flooding with secondary infrastructure failure vectors.',
  earthquake: 'High-magnitude seismic activity with cascading structural collapses.',
  cyclone: 'Severe meteorological disruption with coastal surge impact.',
  pandemic: 'Exponential biological transmission within dense urban clusters.',
};

export default function SimulationPage() {
  const [scenarios, setScenarios] = useState([]);
  const [selected, setSelected] = useState(null);
  const [intensity, setIntensity] = useState(1);
  const [simState, setSimState] = useState(null);
  const [running, setRunning] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    api.get('/simulation/scenarios').then(res => setScenarios(res.data)).catch(console.error);
    api.get('/simulation/state').then(res => { if (res.data.status !== 'idle') setSimState(res.data); }).catch(console.error);
  }, []);

  useEffect(() => {
    let timer;
    if (autoPlay && simState?.status === 'running') {
      timer = setTimeout(handleStep, 1200);
    }
    return () => clearTimeout(timer);
  }, [autoPlay, simState]);

  const handleStart = async () => {
    if (!selected) return;
    try {
      const res = await api.post('/simulation/start', { scenario: selected, intensity });
      setSimState(res.data);
      setRunning(true);
    } catch (err) { console.error(err); }
  };

  const handleStep = async () => {
    try {
      const res = await api.post('/simulation/step');
      setSimState(res.data.simulation);
      if (res.data.simulation.status === 'completed') { setAutoPlay(false); setRunning(false); }
    } catch (err) { console.error(err); }
  };

  const handleReset = async () => {
    try {
      await api.post('/simulation/reset');
      setSimState(null);
      setRunning(false);
      setAutoPlay(false);
    } catch (err) { console.error(err); }
  };

  const progress = simState ? (simState.currentStep / simState.totalSteps) * 100 : 0;
  const chartData = simState?.events?.map(e => ({
    step: `T-${e.step}`, risk: e.riskChange, requests: e.requestsGenerated,
  })) || [];

  return (
    <div className="pt-24 pb-12 px-6 max-w-[1400px] mx-auto min-h-screen relative">
      <div className="mesh-bg opacity-20" />

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest mb-4">
            <FlaskConical className="w-3 h-3" /> Predictive Laboratory
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Crisis Simulation</h1>
          <p className="text-slate-500 text-lg mt-2 font-light">Stress-test response protocols in high-fidelity disaster environments.</p>
        </div>
        {!simState && selected && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <button onClick={handleStart}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-accent text-white font-bold hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all active:scale-95">
                <Play className="w-5 h-5" /> Execute Simulation Profile
              </button>
          </motion.div>
        )}
      </div>

      {!simState ? (
        /* Configuration State */
        <div className="relative z-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 ml-2">Select Active Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {scenarios.map(s => {
              const Icon = scenarioIcons[s.id] || Zap;
              const isSelected = selected === s.id;
              return (
                <motion.div key={s.id} whileHover={{ y: -5 }}
                  onClick={() => setSelected(s.id)}
                  className={`cursor-pointer rounded-[2.5rem] p-8 transition-all duration-500 border-2 ${isSelected ? 'glass-card border-accent/50 shadow-[0_0_40px_rgba(244,63,94,0.2)]' : 'glass border-white/5 opacity-60 hover:opacity-100'}`}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${scenarioColors[s.id]} flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 tracking-tight">{s.name}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium mb-6">{scenarioDesc[s.id]}</p>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.duration} Epochs</span>
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> {s.zones.length} Nodes</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                className="glass rounded-[3rem] p-10 border-white/10 max-w-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full" />
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Hazard Intensity Vector</h3>
                      <span className="text-xl font-black text-accent">{intensity}x Magnitude</span>
                    </div>
                    <input type="range" min="0.5" max="2" step="0.1" value={intensity}
                      onChange={e => setIntensity(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-accent mb-4" />
                    <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                      <span>Controlled Response</span>
                      <span>Catastrophic Failure</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Execution State */
        <div className="space-y-8 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Control Panel */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              <div className="glass rounded-[2.5rem] p-8 border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Timer className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white tracking-tight">Mission Epoch</h2>
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">T-Minus {simState.totalSteps - simState.currentStep} Steps</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${simState.status === 'running' ? 'bg-success/10 text-success animate-pulse' : 'bg-warning/10 text-warning'}`}>
                    {simState.status}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {simState.status === 'running' && (
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => setAutoPlay(!autoPlay)}
                        className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${autoPlay ? 'bg-warning/10 text-warning border border-warning/20' : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'}`}>
                        {autoPlay ? <><Pause className="w-4 h-4" /> Pause Auto</> : <><Play className="w-4 h-4" /> Auto Run</>}
                      </button>
                      <button onClick={handleStep} disabled={autoPlay}
                        className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-40">
                        Next Epoch <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <button onClick={handleReset}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                    <RotateCcw className="w-4 h-4" /> Terminate Session
                  </button>
                </div>
                
                <div className="mt-10">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">
                    <span>Simulation Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-accent to-secondary shadow-[0_0_20px_rgba(244,63,94,0.5)]"
                      animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                  </div>
                </div>
              </div>

              {/* Console Output */}
              <div className="glass rounded-[2.5rem] p-8 border-white/5 flex-1 flex flex-col min-h-[400px]">
                <div className="flex items-center gap-3 mb-6">
                  <Terminal className="w-4 h-4 text-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Subsystem Log</h3>
                </div>
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4 font-mono">
                  {[...simState.events].reverse().map((e, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className="text-[11px] leading-relaxed border-l-2 border-white/5 pl-4 py-1">
                      <div className="text-slate-600 mb-1">[{new Date().toLocaleTimeString()}] EPOCH_{e.step}</div>
                      <div className="text-slate-300 font-bold uppercase tracking-tight">{e.event}</div>
                      <div className="flex gap-4 mt-2">
                        <span className={`font-black ${e.riskChange > 0 ? 'text-danger' : 'text-success'}`}>
                          Δ_RISK: {e.riskChange > 0 ? '+' : ''}{e.riskChange}
                        </span>
                        <span className="text-primary font-black uppercase">
                          GEN_REQS: {e.requestsGenerated}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  {simState.events.length === 0 && <div className="text-slate-700 italic text-[11px]">System ready. Awaiting initialization.</div>}
                </div>
              </div>
            </div>

            {/* Metrics & Analytics */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: FileText, label: 'Req Density', value: simState.metrics.totalRequests, color: 'text-primary' },
                  { icon: Users, label: 'Responders', value: simState.metrics.volunteersDeployed, color: 'text-secondary' },
                  { icon: Package, label: 'Inventory Δ', value: simState.metrics.resourcesUsed, color: 'text-warning' },
                  { icon: Clock, label: 'Latency (min)', value: simState.metrics.avgResponseTime, color: 'text-success' },
                ].map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <div key={i} className="glass rounded-[2rem] p-6 border-white/5">
                      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 shadow-xl`}>
                        <Icon className={`w-5 h-5 ${m.color}`} />
                      </div>
                      <div className="text-2xl font-black text-white leading-none">{m.value}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">{m.label}</div>
                    </div>
                  );
                })}
              </div>

              <div className="glass rounded-[3rem] p-10 border-white/5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-10">
                   <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight">Kinetic Stability Analysis</h3>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-[10px] font-black uppercase text-slate-500">Risk Vector</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-[10px] font-black uppercase text-slate-500">Request Flow</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 min-h-[350px]">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="step" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                        <Tooltip 
                          contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '1.5rem', fontSize: '11px', fontWeight: 'bold' }}
                          itemStyle={{ padding: '2px 0' }}
                        />
                        <Area type="monotone" dataKey="risk" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" name="Risk Magnitude" />
                        <Area type="monotone" dataKey="requests" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" name="Demand Velocity" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                       <div className="p-8 glass rounded-full animate-pulse border-white/5">
                          <Activity className="w-12 h-12 text-slate-800" />
                       </div>
                       <p className="text-slate-600 font-bold text-xs uppercase tracking-widest">Awaiting First Epoch Data</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

