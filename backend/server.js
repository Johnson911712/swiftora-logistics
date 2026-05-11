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
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Set data directory for persistent storage on Render
if (process.env.RENDER_EXTERNAL_MOUNT_PATH) {
  process.env.DATA_DIR = process.env.RENDER_EXTERNAL_MOUNT_PATH;
}

initDB();

app.use('/api/auth', authRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/contact', contactRoutes);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Swiftora Logistics server running on port ${PORT}`);
});
