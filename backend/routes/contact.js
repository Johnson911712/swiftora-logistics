const express = require('express');
const { getDB } = require('../db');
const { authMiddleware } = require('../middleware');

const router = express.Router();

router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const db = getDB();
  db.prepare('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)').run(
    name, email, subject || '', message
  );

  res.status(201).json({ message: 'Your message has been received. We will get back to you shortly.' });
});

router.get('/', authMiddleware, (req, res) => {
  const db = getDB();
  const messages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
  res.json(messages);
});

router.put('/:id/read', authMiddleware, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  db.prepare('UPDATE contact_messages SET read = 1 WHERE id = ?').run(id);
  res.json({ message: 'Marked as read.' });
});

router.get('/testimonials', (req, res) => {
  const db = getDB();
  const testimonials = db.prepare('SELECT * FROM testimonials WHERE approved = 1 ORDER BY created_at DESC').all();
  res.json(testimonials);
});

router.post('/testimonials', (req, res) => {
  const { name, company, rating, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required.' });
  }

  const db = getDB();
  db.prepare('INSERT INTO testimonials (name, company, rating, message) VALUES (?, ?, ?, ?)').run(
    name, company || '', rating || 5, message
  );

  res.status(201).json({ message: 'Thank you for your testimonial! It will be reviewed shortly.' });
});

router.put('/testimonials/:id/approve', authMiddleware, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  db.prepare('UPDATE testimonials SET approved = 1 WHERE id = ?').run(id);
  res.json({ message: 'Testimonial approved.' });
});

router.delete('/testimonials/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const db = getDB();
  db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);
  res.json({ message: 'Testimonial deleted.' });
});

module.exports = router;
