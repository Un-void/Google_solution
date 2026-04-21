const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { store } = require('../data/store');
const { optionalAuth } = require('../middleware/auth');
const { checkDuplicate, calculateCredibility } = require('../services/trustVerification');

const router = express.Router();

router.get('/stats', (req, res) => {
  const total = store.requests.length;
  const pending = store.requests.filter(r => r.status === 'pending').length;
  const verified = store.requests.filter(r => r.status === 'verified').length;
  const inProgress = store.requests.filter(r => r.status === 'in-progress').length;
  const resolved = store.requests.filter(r => r.status === 'resolved').length;
  const critical = store.requests.filter(r => r.urgency === 'critical').length;
  const byType = {};
  store.requests.forEach(r => { byType[r.type] = (byType[r.type] || 0) + 1; });
  const byZone = {};
  store.requests.forEach(r => { byZone[r.zone] = (byZone[r.zone] || 0) + 1; });
  res.json({ total, pending, verified, inProgress, resolved, critical, byType, byZone });
});

router.get('/', (req, res) => {
  let results = [...store.requests];
  const { type, status, urgency, zone, search } = req.query;
  if (type) results = results.filter(r => r.type === type);
  if (status) results = results.filter(r => r.status === status);
  if (urgency) results = results.filter(r => r.urgency === urgency);
  if (zone) results = results.filter(r => r.zone === zone);
  if (search) results = results.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));
  results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(results);
});

router.get('/:id', (req, res) => {
  const request = store.requests.find(r => r.id === req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });
  res.json(request);
});

router.post('/', optionalAuth, (req, res) => {
  try {
    const { title, type, zone, urgency, people, description, channel, lat, lng } = req.body;
    if (!title || !type || !zone || !urgency) {
      return res.status(400).json({ error: 'Title, type, zone, and urgency are required' });
    }
    const duplicate = checkDuplicate(req.body, store.requests);
    const credibility = calculateCredibility(req.body, req.user);
    const zoneData = store.zones.find(z => z.id === zone);
    const request = {
      id: uuidv4(),
      title,
      type,
      zone,
      urgency,
      status: 'pending',
      people: people || 0,
      description: description || '',
      channel: channel || 'web',
      lat: lat || zoneData?.lat || 0,
      lng: lng || zoneData?.lng || 0,
      credibilityScore: credibility,
      isDuplicate: duplicate.isDuplicate,
      duplicateOf: duplicate.duplicateOf || null,
      assignedVolunteer: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.requests.push(request);
    if (urgency === 'critical' || urgency === 'high') {
      store.alerts.push({
        id: uuidv4(),
        type: 'request',
        severity: urgency === 'critical' ? 'critical' : 'high',
        title: `New ${urgency} request – ${title}`,
        message: `${type} assistance needed for ${people || 'unknown'} people in ${zoneData?.name || zone}.`,
        zone,
        active: true,
        createdAt: new Date().toISOString(),
      });
    }
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', (req, res) => {
  const idx = store.requests.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Request not found' });
  store.requests[idx] = { ...store.requests[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json(store.requests[idx]);
});

module.exports = router;
