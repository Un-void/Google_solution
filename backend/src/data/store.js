// In-memory data store with seed data
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const store = {
  users: [],
  requests: [],
  resources: [],
  volunteers: [],
  alerts: [],
  zones: [],
  recommendations: [],
  simulation: null,
};

function initializeData() {
  // --- ZONES ---
  store.zones = [
    { id: 'zone-1', name: 'Zone A – Mumbai Coast', lat: 19.076, lng: 72.8777, population: 185000, riskScore: 82, riskLevel: 'critical', type: 'flood', recentIncidents: 14, description: 'Coastal flooding risk due to monsoon surge' },
    { id: 'zone-2', name: 'Zone B – Delhi NCR', lat: 28.6139, lng: 77.209, population: 310000, riskScore: 65, riskLevel: 'high', type: 'heatwave', recentIncidents: 8, description: 'Extreme heat conditions affecting vulnerable populations' },
    { id: 'zone-3', name: 'Zone C – Chennai South', lat: 13.0827, lng: 80.2707, population: 142000, riskScore: 71, riskLevel: 'high', type: 'cyclone', recentIncidents: 11, description: 'Cyclone corridor with recurring storm activity' },
    { id: 'zone-4', name: 'Zone D – Kolkata East', lat: 22.5726, lng: 88.3639, population: 98000, riskScore: 45, riskLevel: 'moderate', type: 'flood', recentIncidents: 5, description: 'River flooding during monsoon season' },
    { id: 'zone-5', name: 'Zone E – Bangalore Rural', lat: 12.9716, lng: 77.5946, population: 56000, riskScore: 28, riskLevel: 'low', type: 'drought', recentIncidents: 2, description: 'Water scarcity in surrounding rural areas' },
    { id: 'zone-6', name: 'Zone F – Assam Valley', lat: 26.1445, lng: 91.7362, population: 73000, riskScore: 88, riskLevel: 'critical', type: 'flood', recentIncidents: 19, description: 'Annual devastating floods from Brahmaputra river' },
  ];

  // --- USERS ---
  const salt = bcrypt.genSaltSync(10);
  store.users = [
    { id: 'user-1', name: 'Admin NGO', email: 'admin@psrs.org', password: bcrypt.hashSync('password123', salt), role: 'ngo', createdAt: new Date().toISOString() },
    { id: 'user-2', name: 'Volunteer User', email: 'volunteer@psrs.org', password: bcrypt.hashSync('password123', salt), role: 'volunteer', createdAt: new Date().toISOString() },
    { id: 'user-3', name: 'Citizen Reporter', email: 'citizen@psrs.org', password: bcrypt.hashSync('password123', salt), role: 'citizen', createdAt: new Date().toISOString() },
  ];

  // --- REQUESTS ---
  const types = ['food', 'medical', 'shelter', 'evacuation', 'water', 'clothing'];
  const statuses = ['pending', 'verified', 'assigned', 'in-progress', 'resolved'];
  const urgencies = ['low', 'medium', 'high', 'critical'];
  const channels = ['web', 'sms', 'voice', 'app'];

  const requestData = [
    { title: 'Food supplies needed urgently', type: 'food', zone: 'zone-1', urgency: 'critical', status: 'verified', people: 120, channel: 'web', lat: 19.082, lng: 72.881 },
    { title: 'Medical camp required', type: 'medical', zone: 'zone-1', urgency: 'high', status: 'assigned', people: 85, channel: 'sms', lat: 19.071, lng: 72.874 },
    { title: 'Temporary shelter for displaced families', type: 'shelter', zone: 'zone-6', urgency: 'critical', status: 'in-progress', people: 200, channel: 'voice', lat: 26.148, lng: 91.740 },
    { title: 'Drinking water shortage', type: 'water', zone: 'zone-2', urgency: 'high', status: 'pending', people: 350, channel: 'web', lat: 28.620, lng: 77.215 },
    { title: 'Evacuation assistance needed', type: 'evacuation', zone: 'zone-3', urgency: 'critical', status: 'verified', people: 150, channel: 'app', lat: 13.088, lng: 80.275 },
    { title: 'Clothing and blankets for flood victims', type: 'clothing', zone: 'zone-4', urgency: 'medium', status: 'pending', people: 90, channel: 'web', lat: 22.578, lng: 88.368 },
    { title: 'Emergency medical supplies', type: 'medical', zone: 'zone-6', urgency: 'critical', status: 'assigned', people: 175, channel: 'sms', lat: 26.140, lng: 91.732 },
    { title: 'Food packets for children', type: 'food', zone: 'zone-3', urgency: 'high', status: 'verified', people: 60, channel: 'web', lat: 13.079, lng: 80.265 },
    { title: 'Shelter materials needed', type: 'shelter', zone: 'zone-1', urgency: 'high', status: 'pending', people: 110, channel: 'voice', lat: 19.068, lng: 72.870 },
    { title: 'Water purification tablets', type: 'water', zone: 'zone-4', urgency: 'medium', status: 'verified', people: 200, channel: 'app', lat: 22.568, lng: 88.358 },
    { title: 'Emergency evacuation in low-lying area', type: 'evacuation', zone: 'zone-6', urgency: 'critical', status: 'in-progress', people: 300, channel: 'web', lat: 26.150, lng: 91.745 },
    { title: 'Infant formula and baby supplies', type: 'food', zone: 'zone-2', urgency: 'high', status: 'pending', people: 45, channel: 'sms', lat: 28.605, lng: 77.200 },
    { title: 'First aid kits distribution', type: 'medical', zone: 'zone-5', urgency: 'low', status: 'resolved', people: 30, channel: 'web', lat: 12.975, lng: 77.598 },
    { title: 'Tarpaulin sheets for makeshift shelters', type: 'shelter', zone: 'zone-3', urgency: 'high', status: 'assigned', people: 80, channel: 'web', lat: 13.085, lng: 80.280 },
    { title: 'Clean drinking water delivery', type: 'water', zone: 'zone-6', urgency: 'critical', status: 'verified', people: 250, channel: 'voice', lat: 26.138, lng: 91.728 },
    { title: 'Warm clothing for elderly', type: 'clothing', zone: 'zone-2', urgency: 'medium', status: 'pending', people: 70, channel: 'web', lat: 28.625, lng: 77.220 },
    { title: 'Search and rescue team needed', type: 'evacuation', zone: 'zone-1', urgency: 'critical', status: 'assigned', people: 40, channel: 'app', lat: 19.090, lng: 72.890 },
    { title: 'Mobile medical unit request', type: 'medical', zone: 'zone-4', urgency: 'high', status: 'pending', people: 120, channel: 'sms', lat: 22.580, lng: 88.372 },
    { title: 'Emergency ration kits', type: 'food', zone: 'zone-6', urgency: 'critical', status: 'in-progress', people: 400, channel: 'web', lat: 26.155, lng: 91.750 },
    { title: 'Sanitation supplies needed', type: 'water', zone: 'zone-1', urgency: 'medium', status: 'verified', people: 95, channel: 'web', lat: 19.075, lng: 72.865 },
  ];

  store.requests = requestData.map((r, i) => ({
    id: `req-${i + 1}`,
    ...r,
    credibilityScore: Math.floor(Math.random() * 30) + 70,
    isDuplicate: false,
    assignedVolunteer: null,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  // --- RESOURCES ---
  store.resources = [
    { id: 'res-1', type: 'food', name: 'Food Kits', zone: 'zone-1', available: 50, required: 120, unit: 'kits', lastUpdated: new Date().toISOString() },
    { id: 'res-2', type: 'food', name: 'Food Kits', zone: 'zone-6', available: 80, required: 400, unit: 'kits', lastUpdated: new Date().toISOString() },
    { id: 'res-3', type: 'medical', name: 'Medical Supplies', zone: 'zone-1', available: 30, required: 85, unit: 'boxes', lastUpdated: new Date().toISOString() },
    { id: 'res-4', type: 'medical', name: 'Medical Supplies', zone: 'zone-6', available: 45, required: 175, unit: 'boxes', lastUpdated: new Date().toISOString() },
    { id: 'res-5', type: 'shelter', name: 'Shelter Materials', zone: 'zone-6', available: 60, required: 200, unit: 'sets', lastUpdated: new Date().toISOString() },
    { id: 'res-6', type: 'shelter', name: 'Shelter Materials', zone: 'zone-3', available: 40, required: 80, unit: 'sets', lastUpdated: new Date().toISOString() },
    { id: 'res-7', type: 'water', name: 'Water Tanks', zone: 'zone-2', available: 120, required: 350, unit: 'liters(x100)', lastUpdated: new Date().toISOString() },
    { id: 'res-8', type: 'water', name: 'Water Tanks', zone: 'zone-6', available: 90, required: 250, unit: 'liters(x100)', lastUpdated: new Date().toISOString() },
    { id: 'res-9', type: 'clothing', name: 'Clothing Packs', zone: 'zone-4', available: 70, required: 90, unit: 'packs', lastUpdated: new Date().toISOString() },
    { id: 'res-10', type: 'clothing', name: 'Clothing Packs', zone: 'zone-2', available: 25, required: 70, unit: 'packs', lastUpdated: new Date().toISOString() },
    { id: 'res-11', type: 'food', name: 'Food Kits', zone: 'zone-2', available: 90, required: 45, unit: 'kits', lastUpdated: new Date().toISOString() },
    { id: 'res-12', type: 'food', name: 'Food Kits', zone: 'zone-3', available: 35, required: 60, unit: 'kits', lastUpdated: new Date().toISOString() },
    { id: 'res-13', type: 'medical', name: 'Medical Supplies', zone: 'zone-5', available: 50, required: 30, unit: 'boxes', lastUpdated: new Date().toISOString() },
    { id: 'res-14', type: 'evacuation', name: 'Rescue Vehicles', zone: 'zone-1', available: 5, required: 12, unit: 'vehicles', lastUpdated: new Date().toISOString() },
    { id: 'res-15', type: 'evacuation', name: 'Rescue Vehicles', zone: 'zone-6', available: 3, required: 15, unit: 'vehicles', lastUpdated: new Date().toISOString() },
  ];

  // --- VOLUNTEERS ---
  const skills = ['medical', 'logistics', 'search-rescue', 'counseling', 'driving', 'cooking', 'tech-support', 'first-aid'];
  const volunteerData = [
    { name: 'Dr. Priya Sharma', skills: ['medical', 'first-aid'], zone: 'zone-1', available: true, lat: 19.080, lng: 72.878, deployments: 12, rating: 4.8 },
    { name: 'Rahul Verma', skills: ['logistics', 'driving'], zone: 'zone-1', available: true, lat: 19.073, lng: 72.875, deployments: 8, rating: 4.5 },
    { name: 'Sneha Iyer', skills: ['counseling', 'first-aid'], zone: 'zone-3', available: true, lat: 13.084, lng: 80.272, deployments: 15, rating: 4.9 },
    { name: 'Amit Patel', skills: ['search-rescue', 'driving'], zone: 'zone-6', available: true, lat: 26.146, lng: 91.738, deployments: 20, rating: 4.7 },
    { name: 'Fatima Khan', skills: ['medical', 'counseling'], zone: 'zone-2', available: false, lat: 28.618, lng: 77.212, deployments: 6, rating: 4.6 },
    { name: 'Vikram Singh', skills: ['logistics', 'tech-support'], zone: 'zone-2', available: true, lat: 28.610, lng: 77.205, deployments: 10, rating: 4.4 },
    { name: 'Lakshmi Nair', skills: ['cooking', 'first-aid'], zone: 'zone-3', available: true, lat: 13.078, lng: 80.268, deployments: 7, rating: 4.3 },
    { name: 'Suresh Kumar', skills: ['search-rescue', 'logistics'], zone: 'zone-6', available: true, lat: 26.150, lng: 91.742, deployments: 25, rating: 4.9 },
    { name: 'Anita Desai', skills: ['medical', 'tech-support'], zone: 'zone-4', available: true, lat: 22.575, lng: 88.365, deployments: 9, rating: 4.5 },
    { name: 'Rajesh Gupta', skills: ['driving', 'logistics'], zone: 'zone-4', available: false, lat: 22.570, lng: 88.360, deployments: 14, rating: 4.6 },
    { name: 'Meera Joshi', skills: ['counseling', 'cooking'], zone: 'zone-5', available: true, lat: 12.973, lng: 77.596, deployments: 3, rating: 4.2 },
    { name: 'Arjun Reddy', skills: ['search-rescue', 'first-aid'], zone: 'zone-1', available: true, lat: 19.085, lng: 72.882, deployments: 18, rating: 4.8 },
    { name: 'Pooja Mehta', skills: ['medical', 'logistics'], zone: 'zone-6', available: true, lat: 26.142, lng: 91.735, deployments: 11, rating: 4.7 },
    { name: 'Karthik Rajan', skills: ['tech-support', 'driving'], zone: 'zone-3', available: true, lat: 13.090, lng: 80.278, deployments: 5, rating: 4.1 },
    { name: 'Deepa Krishnan', skills: ['first-aid', 'cooking'], zone: 'zone-2', available: true, lat: 28.622, lng: 77.218, deployments: 4, rating: 4.3 },
    { name: 'Nikhil Saxena', skills: ['search-rescue', 'driving'], zone: 'zone-1', available: false, lat: 19.070, lng: 72.868, deployments: 22, rating: 4.9 },
    { name: 'Ritu Agarwal', skills: ['logistics', 'counseling'], zone: 'zone-4', available: true, lat: 22.582, lng: 88.370, deployments: 7, rating: 4.4 },
    { name: 'Sanjay Mishra', skills: ['medical', 'search-rescue'], zone: 'zone-6', available: true, lat: 26.148, lng: 91.740, deployments: 16, rating: 4.6 },
  ];

  store.volunteers = volunteerData.map((v, i) => ({
    id: `vol-${i + 1}`,
    ...v,
    status: v.available ? 'available' : 'deployed',
    phone: `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`,
    joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  // --- ALERTS ---
  store.alerts = [
    { id: 'alert-1', type: 'risk', severity: 'critical', title: 'Flood Warning – Assam Valley', message: 'Brahmaputra river level rising rapidly. Zone F at extreme risk.', zone: 'zone-6', active: true, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 'alert-2', type: 'risk', severity: 'critical', title: 'Coastal Surge Alert – Mumbai', message: 'High tide combined with monsoon rain creating flood risk.', zone: 'zone-1', active: true, createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: 'alert-3', type: 'shortage', severity: 'high', title: 'Food Kit Shortage – Zone A', message: 'Only 50 of 120 required food kits available. Immediate resupply needed.', zone: 'zone-1', active: true, createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { id: 'alert-4', type: 'shortage', severity: 'critical', title: 'Medical Supply Crisis – Zone F', message: 'Medical supplies at 25% of required levels. Urgent action needed.', zone: 'zone-6', active: true, createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
    { id: 'alert-5', type: 'request', severity: 'high', title: 'New Critical Request – Chennai', message: 'Evacuation assistance needed for 150 people in cyclone-prone area.', zone: 'zone-3', active: true, createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    { id: 'alert-6', type: 'risk', severity: 'moderate', title: 'Heatwave Advisory – Delhi NCR', message: 'Temperatures expected to exceed 45°C. Vulnerable populations at risk.', zone: 'zone-2', active: true, createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
    { id: 'alert-7', type: 'shortage', severity: 'high', title: 'Water Shortage – Delhi NCR', message: 'Water supply at 34% of required levels during heatwave.', zone: 'zone-2', active: true, createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString() },
    { id: 'alert-8', type: 'request', severity: 'moderate', title: 'New Request – Kolkata', message: 'Clothing and blankets needed for 90 flood-affected people.', zone: 'zone-4', active: true, createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString() },
  ];

  // --- RECOMMENDATIONS ---
  store.recommendations = [
    { id: 'rec-1', priority: 'critical', action: 'Deploy 15 volunteers to Zone F (Assam Valley)', reason: 'Flood intensity increasing. Current volunteer count insufficient for 300+ affected people.', zone: 'zone-6', category: 'deployment', createdAt: new Date().toISOString() },
    { id: 'rec-2', priority: 'critical', action: 'Allocate 70 additional food kits to Zone A (Mumbai Coast)', reason: 'Current shortage: 70 kits. 120 families need immediate food assistance.', zone: 'zone-1', category: 'resource', createdAt: new Date().toISOString() },
    { id: 'rec-3', priority: 'high', action: 'Set up 3 medical camps in Zone F', reason: '175 people need medical attention. Only 45 medical supply boxes available.', zone: 'zone-6', category: 'medical', createdAt: new Date().toISOString() },
    { id: 'rec-4', priority: 'high', action: 'Pre-position rescue vehicles in Zone C (Chennai)', reason: 'Cyclone forecast in 48 hours. Only 40 shelter sets vs 80 required.', zone: 'zone-3', category: 'preparation', createdAt: new Date().toISOString() },
    { id: 'rec-5', priority: 'high', action: 'Emergency water supply to Delhi NCR', reason: 'Heatwave + water shortage creating health emergency. 350 people affected.', zone: 'zone-2', category: 'resource', createdAt: new Date().toISOString() },
    { id: 'rec-6', priority: 'medium', action: 'Transfer surplus food kits from Zone B to Zone C', reason: 'Zone B has 90 kits (needs 45). Zone C has 35 kits (needs 60).', zone: 'zone-2', category: 'logistics', createdAt: new Date().toISOString() },
    { id: 'rec-7', priority: 'medium', action: 'Activate offline communication in Zone F', reason: 'Network disruption expected due to flood. Pre-deploy mesh network.', zone: 'zone-6', category: 'tech', createdAt: new Date().toISOString() },
    { id: 'rec-8', priority: 'critical', action: 'Begin evacuation of low-lying areas in Zone F', reason: 'Water level projected to rise 2m in next 12 hours. 300 people in danger zone.', zone: 'zone-6', category: 'evacuation', createdAt: new Date().toISOString() },
  ];
}

module.exports = { store, initializeData };
