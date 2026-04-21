const express = require('express');
const { store } = require('../data/store');

const router = express.Router();

router.get('/', (req, res) => {
  let results = [...store.volunteers];
  const { zone, skill, status } = req.query;
  if (zone) results = results.filter(v => v.zone === zone);
  if (skill) results = results.filter(v => v.skills.includes(skill));
  if (status) results = results.filter(v => v.status === status);
  res.json(results);
});

router.post('/match', (req, res) => {
  const { requestId } = req.body;
  const request = store.requests.find(r => r.id === requestId);
  if (!request) return res.status(404).json({ error: 'Request not found' });
  const skillMap = {
    food: ['cooking', 'logistics'], medical: ['medical', 'first-aid'],
    shelter: ['logistics', 'tech-support'], evacuation: ['search-rescue', 'driving'],
    water: ['logistics', 'driving'], clothing: ['logistics'],
  };
  const requiredSkills = skillMap[request.type] || [];
  const available = store.volunteers.filter(v => v.status === 'available');
  const scored = available.map(v => {
    let score = 0;
    score += v.skills.filter(s => requiredSkills.includes(s)).length * 30;
    if (v.zone === request.zone) score += 25;
    score += Math.min(v.deployments, 20) + v.rating * 5;
    return { ...v, matchScore: Math.min(score, 100) };
  });
  scored.sort((a, b) => b.matchScore - a.matchScore);
  res.json(scored.slice(0, 5));
});

router.put('/:id/deploy', (req, res) => {
  const vol = store.volunteers.find(v => v.id === req.params.id);
  if (!vol) return res.status(404).json({ error: 'Volunteer not found' });
  vol.status = 'deployed';
  vol.available = false;
  if (req.body.requestId) {
    const request = store.requests.find(r => r.id === req.body.requestId);
    if (request) { request.assignedVolunteer = vol.id; request.status = 'assigned'; }
  }
  res.json(vol);
});

module.exports = router;
