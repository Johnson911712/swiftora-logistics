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

// GET /api/contact/testimonials - Get approved testimonials
export async function GET(req, res) {
  try {
    const testimonials = await sql`
      SELECT * FROM testimonials WHERE approved = 1 ORDER BY created_at DESC
    `;
    res.status(200).json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/contact/testimonials - Submit testimonial
export async function POST(req, res) {
  const { name, company, rating, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  try {
    await sql`
      INSERT INTO testimonials (name, company, rating, message, approved)
      VALUES (${name}, ${company || ''}, ${rating || 5}, ${message}, 0)
    `;
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
