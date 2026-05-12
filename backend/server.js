require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db');
const authRoutes = require('./routes/auth');
const trackingRoutes = require('./routes/tracking');
const shipmentRoutes = require('./routes/shipments');
const contactRoutes = require('./routes/contact');

const app = express();

// CORS configuration - allow frontend to access API
app.use(cors({
  origin: [
    'https://swiftoralogistics.online',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  credentials: true
}));

app.use(express.json());

// Set data directory for persistent storage
if (process.env.RENDER_EXTERNAL_MOUNT_PATH) {
  process.env.DATA_DIR = process.env.RENDER_EXTERNAL_MOUNT_PATH;
}

initDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Fallback to index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Swiftora Logistics server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Frontend available at http://localhost:${PORT}`);
});
