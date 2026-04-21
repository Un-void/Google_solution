const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { store } = require('../data/store');

const router = express.Router();

router.get('/', (req, res) => {
  let results = [...store.resources];
  const { type, zone } = req.query;
  if (type) results = results.filter(r => r.type === type);
  if (zone) results = results.filter(r => r.zone === zone);
  res.json(results);
});

router.get('/gaps', (req, res) => {
  const gaps = store.resources
    .filter(r => r.available < r.required)
    .map(r => {
      const zone = store.zones.find(z => z.id === r.zone);
      return {
        ...r,
        zoneName: zone?.name || r.zone,
        gap: r.required - r.available,
        gapPercentage: Math.round(((r.required - r.available) / r.required) * 100),
        severity: r.available / r.required < 0.3 ? 'critical' : r.available / r.required < 0.6 ? 'high' : 'moderate',
      };
    })
    .sort((a, b) => b.gapPercentage - a.gapPercentage);

  const summary = {
    totalShortages: gaps.length,
    criticalShortages: gaps.filter(g => g.severity === 'critical').length,
    totalGapUnits: gaps.reduce((acc, g) => acc + g.gap, 0),
    byType: {},
  };
  gaps.forEach(g => {
    if (!summary.byType[g.type]) summary.byType[g.type] = { count: 0, totalGap: 0 };
    summary.byType[g.type].count++;
    summary.byType[g.type].totalGap += g.gap;
  });

  res.json({ gaps, summary });
});

router.post('/', (req, res) => {
  const { type, name, zone, available, required, unit } = req.body;
  const resource = {
    id: uuidv4(),
    type, name, zone,
    available: available || 0,
    required: required || 0,
    unit: unit || 'units',
    lastUpdated: new Date().toISOString(),
  };
  store.resources.push(resource);
  res.status(201).json(resource);
});

router.put('/:id', (req, res) => {
  const idx = store.resources.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Resource not found' });
  store.resources[idx] = { ...store.resources[idx], ...req.body, lastUpdated: new Date().toISOString() };
  res.json(store.resources[idx]);
});

module.exports = router;
