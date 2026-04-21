const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./src/routes/auth');
const requestRoutes = require('./src/routes/requests');
const predictionRoutes = require('./src/routes/prediction');
const resourceRoutes = require('./src/routes/resources');
const volunteerRoutes = require('./src/routes/volunteers');
const simulationRoutes = require('./src/routes/simulation');
const alertRoutes = require('./src/routes/alerts');
const recommendationRoutes = require('./src/routes/recommendations');

const { initializeData } = require('./src/data/store');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Initialize seed data
initializeData();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/simulation', simulationRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`PSRS Backend running on port ${PORT}`);
});
