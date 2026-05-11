const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Use persistent storage path on Render if available
const dataDir = process.env.DATA_DIR || process.env.RENDER_EXTERNAL_MOUNT_PATH || __dirname;
const dbPath = path.join(dataDir, 'swiftora.db');
let db;

function initDB() {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS shipments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracking_code TEXT UNIQUE NOT NULL,
      sender_name TEXT NOT NULL,
      sender_email TEXT NOT NULL,
      sender_phone TEXT,
      sender_address TEXT,
      receiver_name TEXT NOT NULL,
      receiver_email TEXT NOT NULL,
      receiver_phone TEXT,
      receiver_address TEXT NOT NULL,
      package_description TEXT,
      package_weight REAL,
      status TEXT DEFAULT 'Pending',
      origin TEXT,
      destination TEXT,
      estimated_delivery TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tracking_updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracking_code TEXT NOT NULL,
      status TEXT NOT NULL,
      location TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tracking_code) REFERENCES shipments(tracking_code)
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      company TEXT,
      rating INTEGER DEFAULT 5,
      message TEXT NOT NULL,
      approved INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const adminExists = db.prepare('SELECT id FROM admin WHERE username = ?').get('Admin@swiftoralogistics.online');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin', 10);
    db.prepare('INSERT INTO admin (username, password) VALUES (?, ?)').run('Admin@swiftoralogistics.online', hashedPassword);
    console.log('Default admin account created.');
  }

  const testimonialCount = db.prepare('SELECT COUNT(*) as count FROM testimonials').get();
  if (testimonialCount.count === 0) {
    const seedTestimonials = [
      ['Sarah Johnson', 'TechCorp Inc.', 5, 'Swiftora Logistics delivered our sensitive equipment ahead of schedule. Their real-time tracking gave us complete peace of mind. Truly exceptional service!'],
      ['Michael Chen', 'GlobalTrade Ltd.', 5, 'We have been using Swiftora for our international shipments for over a year. Their reliability and professional handling of our goods is unmatched.'],
      ['Amara Okafor', 'MediSupply Africa', 5, 'The auto tracking system is a game-changer. We always know exactly where our medical supplies are. Fast, reliable, and incredibly professional.'],
      ['James Rodriguez', 'EcoFresh Organics', 4, 'Swiftoras cold-chain logistics kept our organic produce fresh during transit. The delivery was on time and the customer support was outstanding.'],
      ['Priya Patel', 'FashionForward', 5, 'From pickup to delivery, everything was seamless. The tracking updates were detailed and the courier was very courteous. Highly recommended!']
    ];
    const insert = db.prepare('INSERT INTO testimonials (name, company, rating, message, approved) VALUES (?, ?, ?, ?, 1)');
    for (const t of seedTestimonials) {
      insert.run(...t);
    }
    console.log('Seed testimonials created.');
  }

  return db;
}

function getDB() {
  return db;
}

module.exports = { initDB, getDB };
