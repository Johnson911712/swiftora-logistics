# Swiftora Logistics

Modern courier and logistics services website with real-time tracking, admin dashboard, and auto tracking code generation.

**Live Domain:** swiftoralogistics.online  
**Contact Email:** Info@swiftoralogistics.online

## Features

### Frontend
- Modern React UI with TailwindCSS
- Dark/Light theme toggle
- Hero section with instant tracking search
- Services showcase (6 logistics services)
- Testimonials carousel with submission form
- Contact form
- Fully responsive design

### Backend
- Express.js REST API
- SQLite database
- JWT authentication
- Auto tracking code generator (SWF-XXXX-XXXXXX format)
- Shipment management
- Real-time tracking updates
- Contact message management
- Testimonial approval system

### Admin Dashboard
- Shipment management with status updates
- Auto tracking code generator
- Statistics dashboard (total, pending, in-transit, delivered)
- Contact message management
- Testimonial approval/rejection

## Admin Credentials

- **Username:** Admin@swiftoralogistics.online
- **Password:** admin
- **Access:** http://localhost:3000/admin

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/swiftora-logistics.git
cd swiftora-logistics

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm start

# Frontend setup (new terminal)
cd frontend
npm install
npm start
```

The frontend will run on http://localhost:3000 and backend on http://localhost:5000.

## Project Structure

```
swiftora-logistics/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── tracking.js      # Package tracking
│   │   ├── shipments.js     # Shipment management
│   │   └── contact.js       # Contact & testimonials
│   ├── db.js                # SQLite database setup
│   ├── middleware.js        # JWT auth middleware
│   ├── server.js            # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin dashboard
│   │   │   ├── Home.js
│   │   │   └── Tracking.js
│   │   └── context/         # Theme context
│   ├── public/
│   ├── tailwind.config.js
│   └── package.json
├── Dockerfile
├── docker-compose.yml
└── DEPLOYMENT.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Tracking
- `GET /api/tracking/:code` - Track package by code

### Shipments (Admin only)
- `GET /api/shipments` - List all shipments
- `GET /api/shipments/stats` - Get statistics
- `POST /api/shipments` - Create new shipment
- `PUT /api/shipments/:id/status` - Update shipment status
- `DELETE /api/shipments/:id` - Delete shipment

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - List messages (Admin)
- `GET /api/contact/testimonials` - Get approved testimonials
- `POST /api/contact/testimonials` - Submit testimonial

## Deployment to swiftoralogistics.online

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions including:
- Vercel + Render (Free tier)
- Railway (All-in-one)
- VPS/DigitalOcean (Full control)
- Netlify + Heroku

### Quick Docker Deployment

```bash
# Build and run with Docker
docker build -t swiftora-logistics .
docker run -p 5000:5000 -e JWT_SECRET=your-secret swiftora-logistics

# Or use docker-compose
docker-compose up -d
```

## Environment Variables

### Backend (.env)
```
PORT=5000
JWT_SECRET=your-secure-random-secret
NODE_ENV=production
```

### Frontend (.env.production)
```
REACT_APP_API_URL=https://swiftoralogistics.online
```

## Tech Stack

- **Frontend:** React 18, TailwindCSS, Lucide Icons
- **Backend:** Express.js, better-sqlite3, JWT
- **Authentication:** bcryptjs, jsonwebtoken
- **Styling:** TailwindCSS with custom theme

## Database

SQLite database with tables:
- `admin` - Administrator accounts
- `shipments` - Shipment records
- `tracking_updates` - Tracking history
- `testimonials` - Customer testimonials
- `contact_messages` - Contact form submissions

## License

MIT License - Swiftora Logistics
