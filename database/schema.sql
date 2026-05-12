-- Swiftora Logistics Database Schema for Neon Postgres

-- Admin table
CREATE TABLE IF NOT EXISTS admin (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id SERIAL PRIMARY KEY,
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tracking updates table
CREATE TABLE IF NOT EXISTS tracking_updates (
  id SERIAL PRIMARY KEY,
  tracking_code TEXT NOT NULL,
  status TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tracking_code) REFERENCES shipments(tracking_code)
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  rating INTEGER DEFAULT 5,
  message TEXT NOT NULL,
  approved INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: admin)
-- Hash generated with bcrypt
INSERT INTO admin (username, password)
VALUES ('Admin@swiftoralogistics.online', '$2b$10$Q7rt0aNMlBQg4OTyvSodNeEkD5L936EPBUtqz7g79Pr1fuVEo17DG')
ON CONFLICT (username) DO NOTHING;

-- Insert seed testimonials
INSERT INTO testimonials (name, company, rating, message, approved) VALUES
  ('Sarah Johnson', 'TechCorp Inc.', 5, 'Swiftora Logistics delivered our sensitive equipment ahead of schedule. Their real-time tracking gave us complete peace of mind. Truly exceptional service!', 1),
  ('Michael Chen', 'GlobalTrade Ltd.', 5, 'We have been using Swiftora for our international shipments for over a year. Their reliability and professional handling of our goods is unmatched.', 1),
  ('Amara Okafor', 'MediSupply Africa', 5, 'The auto tracking system is a game-changer. We always know exactly where our medical supplies are. Fast, reliable, and incredibly professional.', 1),
  ('James Rodriguez', 'EcoFresh Organics', 4, 'Swiftoras cold-chain logistics kept our organic produce fresh during transit. The delivery was on time and the customer support was outstanding.', 1),
  ('Priya Patel', 'FashionForward', 5, 'From pickup to delivery, everything was seamless. The tracking updates were detailed and the courier was very courteous. Highly recommended!', 1)
ON CONFLICT DO NOTHING;
