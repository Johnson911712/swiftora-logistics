import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

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

// PUT /api/shipments/[id] - Update shipment status
export async function PUT(req, res) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  const { status, location, notes } = req.body;

  try {
    const shipment = await sql`
      SELECT tracking_code FROM shipments WHERE id = ${id}
    `;

    if (shipment.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    await sql`
      UPDATE shipments SET status = ${status}, updated_at = NOW() WHERE id = ${id}
    `;

    await sql`
      INSERT INTO tracking_updates (tracking_code, status, location, notes)
      VALUES (${shipment[0].tracking_code}, ${status}, ${location || ''}, ${notes || ''})
    `;

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating shipment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /api/shipments/[id] - Delete shipment
export async function DELETE(req, res) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  try {
    await sql`DELETE FROM tracking_updates WHERE shipment_id = ${id}`;
    await sql`DELETE FROM shipments WHERE id = ${id}`;

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting shipment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
