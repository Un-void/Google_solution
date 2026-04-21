const express = require('express');
const { store } = require('../data/store');

const router = express.Router();

const weatherPatterns = {
  'zone-1': { condition: 'Heavy Rain + High Tide', severity: 0.85, trend: 'worsening' },
  'zone-2': { condition: 'Extreme Heat', severity: 0.60, trend: 'stable' },
  'zone-3': { condition: 'Cyclone Approaching', severity: 0.72, trend: 'worsening' },
  'zone-4': { condition: 'Moderate Rain', severity: 0.40, trend: 'improving' },
  'zone-5': { condition: 'Dry Spell', severity: 0.25, trend: 'stable' },
  'zone-6': { condition: 'Continuous Flooding', severity: 0.92, trend: 'worsening' },
};

router.get('/zones', (req, res) => {
  const zones = store.zones.map(z => {
    const weather = weatherPatterns[z.id] || {};
    const requestCount = store.requests.filter(r => r.zone === z.id && r.status !== 'resolved').length;
    const resourceGap = store.resources
      .filter(r => r.zone === z.id)
      .reduce((acc, r) => acc + Math.max(0, r.required - r.available), 0);
    return {
      ...z,
      weather,
      activeRequests: requestCount,
      resourceGap,
      volunteers: store.volunteers.filter(v => v.zone === z.id).length,
      availableVolunteers: store.volunteers.filter(v => v.zone === z.id && v.status === 'available').length,
    };
  });
  res.json(zones);
});

router.get('/forecast', (req, res) => {
  const forecast = store.zones.map(z => {
    const weather = weatherPatterns[z.id] || {};
    const baseRisk = z.riskScore;
    const weatherFactor = (weather.severity || 0) * 20;
    const trendFactor = weather.trend === 'worsening' ? 10 : weather.trend === 'improving' ? -10 : 0;
    const predictedRisk = Math.min(100, Math.max(0, baseRisk + weatherFactor * 0.3 + trendFactor));
    return {
      zoneId: z.id,
      zoneName: z.name,
      currentRisk: baseRisk,
      predictedRisk: Math.round(predictedRisk),
      weather: weather.condition,
      trend: weather.trend,
      riskChange: Math.round(predictedRisk - baseRisk),
      timeframe: '24 hours',
    };
  });
  res.json(forecast);
});

router.post('/analyze', (req, res) => {
  const { zoneId } = req.body;
  const zone = store.zones.find(z => z.id === zoneId);
  if (!zone) return res.status(404).json({ error: 'Zone not found' });
  const weather = weatherPatterns[zoneId] || {};
  const requests = store.requests.filter(r => r.zone === zoneId);
  const resources = store.resources.filter(r => r.zone === zoneId);
  const volunteers = store.volunteers.filter(v => v.zone === zoneId);
  const analysis = {
    zone,
    weather,
    metrics: {
      totalRequests: requests.length,
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      criticalRequests: requests.filter(r => r.urgency === 'critical').length,
      totalVolunteers: volunteers.length,
      availableVolunteers: volunteers.filter(v => v.status === 'available').length,
      resourceShortages: resources.filter(r => r.available < r.required).length,
      totalResourceGap: resources.reduce((acc, r) => acc + Math.max(0, r.required - r.available), 0),
    },
    riskFactors: [
      { factor: 'Weather Severity', value: weather.severity || 0, impact: 'high' },
      { factor: 'Population Density', value: zone.population / 100000, impact: zone.population > 100000 ? 'high' : 'medium' },
      { factor: 'Recent Incidents', value: zone.recentIncidents, impact: zone.recentIncidents > 10 ? 'high' : 'medium' },
      { factor: 'Resource Availability', value: resources.length > 0 ? resources.reduce((a, r) => a + r.available / r.required, 0) / resources.length : 0, impact: 'medium' },
    ],
  };
  res.json(analysis);
});

module.exports = router;
