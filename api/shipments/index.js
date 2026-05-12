import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const sql = neon(process.env.DATABASE_URL);

function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

function generateTrackingCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SWF-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code += '-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET /api/shipments - List all shipments
export async function GET(req, res) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const shipments = await sql`
      SELECT * FROM shipments ORDER BY created_at DESC
    `;
    res.status(200).json(shipments);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/shipments - Create new shipment
export async function POST(req, res) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const {
    sender_name, sender_email, sender_phone, sender_address,
    receiver_name, receiver_email, receiver_phone, receiver_address,
    package_description, package_weight, origin, destination, estimated_delivery
  } = req.body;

  const tracking_code = generateTrackingCode();

  try {
    await sql`
      INSERT INTO shipments (
        tracking_code, sender_name, sender_email, sender_phone, sender_address,
        receiver_name, receiver_email, receiver_phone, receiver_address,
        package_description, package_weight, origin, destination, estimated_delivery
      ) VALUES (
        ${tracking_code}, ${sender_name}, ${sender_email}, ${sender_phone}, ${sender_address},
        ${receiver_name}, ${receiver_email}, ${receiver_phone}, ${receiver_address},
        ${package_description}, ${package_weight}, ${origin}, ${destination}, ${estimated_delivery}
      )
    `;

    await sql`
      INSERT INTO tracking_updates (tracking_code, status, location, notes)
      VALUES (${tracking_code}, 'Pending', 'Origin', 'Package received')
    `;

    res.status(201).json({ tracking_code });
  } catch (error) {
    console.error('Error creating shipment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
