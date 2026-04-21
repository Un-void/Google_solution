const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { store } = require('../data/store');
const router = express.Router();

router.get('/', (req, res) => {
  let results = [...store.alerts];
  const { type, severity, active } = req.query;
  if (type) results = results.filter(a => a.type === type);
  if (severity) results = results.filter(a => a.severity === severity);
  if (active !== undefined) results = results.filter(a => a.active === (active === 'true'));
  results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(results);
});

router.post('/', (req, res) => {
  const alert = { id: uuidv4(), ...req.body, active: true, createdAt: new Date().toISOString() };
  store.alerts.push(alert);
  res.status(201).json(alert);
});

router.put('/:id/dismiss', (req, res) => {
  const alert = store.alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  alert.active = false;
  res.json(alert);
});

module.exports = router;
