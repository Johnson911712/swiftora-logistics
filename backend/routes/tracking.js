const express = require('express');
const { getDB } = require('../db');

const router = express.Router();

router.get('/:code', (req, res) => {
  const { code } = req.params;
  const db = getDB();

  const shipment = db.prepare('SELECT * FROM shipments WHERE tracking_code = ?').get(code);
  if (!shipment) {
    return res.status(404).json({ error: 'Tracking code not found.' });
  }

  const updates = db.prepare('SELECT * FROM tracking_updates WHERE tracking_code = ? ORDER BY created_at DESC').all(code);

  res.json({ shipment, updates });
});

module.exports = router;
