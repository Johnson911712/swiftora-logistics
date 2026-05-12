import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Tracking code is required' });
  }

  try {
    const shipment = await sql`
      SELECT * FROM shipments WHERE tracking_code = ${code}
    `;

    if (shipment.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    const updates = await sql`
      SELECT * FROM tracking_updates WHERE tracking_code = ${code} ORDER BY created_at DESC
    `;

    res.status(200).json({ shipment: shipment[0], updates });
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
