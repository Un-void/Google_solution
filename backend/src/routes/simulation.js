const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { store } = require('../data/store');
const router = express.Router();

const scenarios = {
  flood: { name: 'Flood Disaster', type: 'flood', duration: 10, zones: ['zone-1', 'zone-6', 'zone-4'],
    steps: [
      { step: 1, event: 'Heavy rainfall detected', riskIncrease: 10, newRequests: 2 },
      { step: 2, event: 'River levels rising rapidly', riskIncrease: 15, newRequests: 3 },
      { step: 3, event: 'Low-lying areas flooding', riskIncrease: 20, newRequests: 5 },
      { step: 4, event: 'Evacuation orders issued', riskIncrease: 10, newRequests: 4 },
      { step: 5, event: 'Roads submerged, rescue ops begin', riskIncrease: 5, newRequests: 6 },
      { step: 6, event: 'Relief camps activated', riskIncrease: 0, newRequests: 3 },
      { step: 7, event: 'Water levels stabilizing', riskIncrease: -10, newRequests: 2 },
      { step: 8, event: 'Rescue operations continue', riskIncrease: -5, newRequests: 1 },
      { step: 9, event: 'Water receding in some areas', riskIncrease: -15, newRequests: 1 },
      { step: 10, event: 'Recovery phase begins', riskIncrease: -20, newRequests: 0 },
    ]},
  earthquake: { name: 'Earthquake Disaster', type: 'earthquake', duration: 8, zones: ['zone-2', 'zone-5'],
    steps: [
      { step: 1, event: 'Seismic activity detected (5.2 magnitude)', riskIncrease: 30, newRequests: 5 },
      { step: 2, event: 'Buildings damaged, casualties reported', riskIncrease: 25, newRequests: 8 },
      { step: 3, event: 'Search and rescue deployed', riskIncrease: 10, newRequests: 6 },
      { step: 4, event: 'Aftershock (3.8 magnitude)', riskIncrease: 15, newRequests: 4 },
      { step: 5, event: 'Medical camps established', riskIncrease: -5, newRequests: 3 },
      { step: 6, event: 'Structural assessment underway', riskIncrease: -10, newRequests: 2 },
      { step: 7, event: 'Temporary shelters operational', riskIncrease: -15, newRequests: 1 },
      { step: 8, event: 'Situation stabilizing', riskIncrease: -20, newRequests: 0 },
    ]},
  cyclone: { name: 'Cyclone Disaster', type: 'cyclone', duration: 8, zones: ['zone-3', 'zone-1'],
    steps: [
      { step: 1, event: 'Cyclone warning issued', riskIncrease: 20, newRequests: 3 },
      { step: 2, event: 'Coastal evacuation begins', riskIncrease: 15, newRequests: 5 },
      { step: 3, event: 'Cyclone makes landfall', riskIncrease: 30, newRequests: 8 },
      { step: 4, event: 'Severe wind and rain damage', riskIncrease: 10, newRequests: 6 },
      { step: 5, event: 'Storm surge flooding', riskIncrease: 5, newRequests: 4 },
      { step: 6, event: 'Cyclone weakening', riskIncrease: -15, newRequests: 2 },
      { step: 7, event: 'Damage assessment begins', riskIncrease: -20, newRequests: 1 },
      { step: 8, event: 'Recovery operations launched', riskIncrease: -25, newRequests: 0 },
    ]},
  pandemic: { name: 'Pandemic Outbreak', type: 'pandemic', duration: 10, zones: ['zone-2', 'zone-4', 'zone-5'],
    steps: [
      { step: 1, event: 'Disease cluster detected', riskIncrease: 10, newRequests: 2 },
      { step: 2, event: 'Rapid spread in urban areas', riskIncrease: 20, newRequests: 4 },
      { step: 3, event: 'Hospitals reaching capacity', riskIncrease: 15, newRequests: 5 },
      { step: 4, event: 'Lockdown measures implemented', riskIncrease: 5, newRequests: 6 },
      { step: 5, event: 'Medical supply shortage', riskIncrease: 10, newRequests: 4 },
      { step: 6, event: 'Vaccination drive begins', riskIncrease: -5, newRequests: 3 },
      { step: 7, event: 'Case curve flattening', riskIncrease: -10, newRequests: 2 },
      { step: 8, event: 'Hospitals stabilizing', riskIncrease: -15, newRequests: 1 },
      { step: 9, event: 'Restrictions easing', riskIncrease: -20, newRequests: 1 },
      { step: 10, event: 'Situation under control', riskIncrease: -25, newRequests: 0 },
    ]},
};

router.get('/scenarios', (req, res) => {
  const list = Object.entries(scenarios).map(([key, s]) => ({
    id: key, name: s.name, type: s.type, duration: s.duration, zones: s.zones,
  }));
  res.json(list);
});

router.post('/start', (req, res) => {
  const { scenario, intensity } = req.body;
  const s = scenarios[scenario];
  if (!s) return res.status(400).json({ error: 'Invalid scenario' });
  store.simulation = {
    id: uuidv4(), scenario, name: s.name, intensity: intensity || 1,
    currentStep: 0, totalSteps: s.duration, status: 'running',
    events: [], metrics: { totalRequests: 0, volunteersDeployed: 0, resourcesUsed: 0, avgResponseTime: 0 },
    startedAt: new Date().toISOString(),
  };
  res.json(store.simulation);
});

router.get('/state', (req, res) => {
  if (!store.simulation) return res.json({ status: 'idle' });
  res.json(store.simulation);
});

router.post('/step', (req, res) => {
  if (!store.simulation || store.simulation.status !== 'running') {
    return res.status(400).json({ error: 'No active simulation' });
  }
  const sim = store.simulation;
  const s = scenarios[sim.scenario];
  if (sim.currentStep >= s.duration) {
    sim.status = 'completed';
    return res.json(sim);
  }
  const step = s.steps[sim.currentStep];
  sim.currentStep++;
  const intensity = sim.intensity || 1;
  const event = {
    step: step.step, event: step.event, timestamp: new Date().toISOString(),
    riskChange: Math.round(step.riskIncrease * intensity),
    requestsGenerated: Math.round(step.newRequests * intensity),
  };
  sim.events.push(event);
  sim.metrics.totalRequests += event.requestsGenerated;
  sim.metrics.volunteersDeployed += Math.floor(event.requestsGenerated * 0.6);
  sim.metrics.resourcesUsed += event.requestsGenerated * 5;
  sim.metrics.avgResponseTime = Math.max(5, 45 - sim.currentStep * 3);
  if (sim.currentStep >= s.duration) sim.status = 'completed';
  res.json({ simulation: sim, latestEvent: event });
});

router.post('/reset', (req, res) => {
  store.simulation = null;
  res.json({ status: 'idle' });
});

module.exports = router;
