const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../db');
const { JWT_SECRET } = require('../middleware');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const db = getDB();
  const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get(username);
  if (!admin) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const validPassword = bcrypt.compareSync(password, admin.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, username: admin.username });
});

module.exports = router;
