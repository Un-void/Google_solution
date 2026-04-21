const express = require('express');
const { store } = require('../data/store');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(store.recommendations);
});

router.post('/generate', (req, res) => {
  const recs = [];
  // Analyze resource gaps
  const gaps = store.resources.filter(r => r.available < r.required);
  gaps.forEach(g => {
    const zone = store.zones.find(z => z.id === g.zone);
    if (g.available / g.required < 0.4) {
      recs.push({
        id: `rec-gen-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        priority: 'critical', category: 'resource', zone: g.zone,
        action: `Urgent: Allocate ${g.required - g.available} ${g.unit} of ${g.name} to ${zone?.name || g.zone}`,
        reason: `Only ${Math.round(g.available/g.required*100)}% of required ${g.name} available.`,
        createdAt: new Date().toISOString(),
      });
    }
  });
  // Analyze unassigned critical requests
  const critical = store.requests.filter(r => r.urgency === 'critical' && r.status === 'pending');
  critical.forEach(r => {
    const zone = store.zones.find(z => z.id === r.zone);
    recs.push({
      id: `rec-gen-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      priority: 'critical', category: 'deployment', zone: r.zone,
      action: `Immediately assign volunteers to: ${r.title}`,
      reason: `Critical request pending for ${r.people} people in ${zone?.name || r.zone}.`,
      createdAt: new Date().toISOString(),
    });
  });
  // Analyze zones with low volunteer coverage
  store.zones.filter(z => z.riskScore > 60).forEach(z => {
    const avail = store.volunteers.filter(v => v.zone === z.id && v.status === 'available').length;
    const activeReqs = store.requests.filter(r => r.zone === z.id && r.status !== 'resolved').length;
    if (avail < activeReqs) {
      recs.push({
        id: `rec-gen-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        priority: 'high', category: 'deployment', zone: z.id,
        action: `Deploy ${activeReqs - avail} additional volunteers to ${z.name}`,
        reason: `${activeReqs} active requests but only ${avail} volunteers available.`,
        createdAt: new Date().toISOString(),
      });
    }
  });
  store.recommendations = [...recs, ...store.recommendations].slice(0, 20);
  res.json(recs);
});

module.exports = router;
