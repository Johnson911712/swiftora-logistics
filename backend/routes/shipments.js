const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDB } = require('../db');
const { authMiddleware } = require('../middleware');

const router = express.Router();

function generateTrackingCode() {
  const prefix = 'SWF';
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  const random = uuidv4().replace(/-/g, '').slice(0, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

router.get('/', authMiddleware, (req, res) => {
  const db = getDB();
  const shipments = db.prepare('SELECT * FROM shipments ORDER BY created_at DESC').all();
  res.json(shipments);
});

router.get('/stats', authMiddleware, (req, res) => {
  const db = getDB();
  const total = db.prepare('SELECT COUNT(*) as count FROM shipments').get();
  const pending = db.prepare("SELECT COUNT(*) as count FROM shipments WHERE status = 'Pending'").get();
  const inTransit = db.prepare("SELECT COUNT(*) as count FROM shipments WHERE status = 'In Transit'").get();
  const delivered = db.prepare("SELECT COUNT(*) as count FROM shipments WHERE status = 'Delivered'").get();
  const messages = db.prepare('SELECT COUNT(*) as count FROM contact_messages WHERE read = 0').get();

  res.json({
    total: total.count,
    pending: pending.count,
    inTransit: inTransit.count,
    delivered: delivered.count,
    unreadMessages: messages.count
  });
});

router.post('/', authMiddleware, (req, res) => {
  const {
    sender_name, sender_email, sender_phone, sender_address,
    receiver_name, receiver_email, receiver_phone, receiver_address,
    package_description, package_weight, origin, destination, estimated_delivery
  } = req.body;

  if (!sender_name || !receiver_name || !receiver_address) {
    return res.status(400).json({ error: 'Sender name, receiver name, and receiver address are required.' });
  }

  const db = getDB();
  const tracking_code = generateTrackingCode();

  const stmt = db.prepare(`
    INSERT INTO shipments (tracking_code, sender_name, sender_email, sender_phone, sender_address,
      receiver_name, receiver_email, receiver_phone, receiver_address, package_description,
      package_weight, origin, destination, estimated_delivery, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
  `);

  const result = stmt.run(
    tracking_code, sender_name, sender_email || '', sender_phone || '', sender_address || '',
    receiver_name, receiver_email || '', receiver_phone || '', receiver_address,
    package_description || '', package_weight || null, origin || '', destination || '', estimated_delivery || null
  );

  db.prepare('INSERT INTO tracking_updates (tracking_code, status, location, notes) VALUES (?, ?, ?, ?)').run(
    tracking_code, 'Shipment Created', origin || 'Origin', 'Shipment registered in the system.'
  );

  const shipment = db.prepare('SELECT * FROM shipments WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(shipment);
});

router.put('/:id/status', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { status, location, notes } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  const db = getDB();
  const shipment = db.prepare('SELECT * FROM shipments WHERE id = ?').get(id);
  if (!shipment) {
    return res.status(404).json({ error: 'Shipment not found.' });
  }

  db.prepare('UPDATE shipments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
  db.prepare('INSERT INTO tracking_updates (tracking_code, status, location, notes) VALUES (?, ?, ?, ?)').run(
    shipment.tracking_code, status, location || '', notes || ''
  );

  const updated = db.prepare('SELECT * FROM shipments WHERE id = ?').get(id);
  res.json(updated);
});

router.delete('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const shipment = db.prepare('SELECT * FROM shipments WHERE id = ?').get(id);
  if (!shipment) {
    return res.status(404).json({ error: 'Shipment not found.' });
  }

  db.prepare('DELETE FROM tracking_updates WHERE tracking_code = ?').run(shipment.tracking_code);
  db.prepare('DELETE FROM shipments WHERE id = ?').run(id);
  res.json({ message: 'Shipment deleted successfully.' });
});

module.exports = router;
