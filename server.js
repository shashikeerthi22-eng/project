const express     = require('express');
const cors        = require('cors');
require('dotenv').config();

const authRoutes    = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const driverRoutes  = require('./routes/driverRoutes');
const adminRoutes   = require('./routes/adminRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/driver',  driverRoutes);
app.use('/api/admin',   adminRoutes);

// ── Health check ───────────────────────────
app.get('/', (req, res) => {
  res.json({
    status:  'running',
    project: '🚐 RoadWay Backend API',
    version: '1.0.0',
    routes: {
      auth:    ['POST /api/auth/signup', 'POST /api/auth/login'],
      driver:  ['POST /api/driver/signup', 'POST /api/driver/login', 'GET /api/driver/profile', 'POST /api/driver/vehicle', 'GET /api/driver/vehicles'],
      booking: ['POST /api/booking/create', 'GET /api/booking/all', 'GET /api/booking/:id', 'PATCH /api/booking/:id/status'],
      admin:   ['POST /api/admin/login', 'GET /api/admin/drivers', 'PATCH /api/admin/drivers/:id/status', 'GET /api/admin/users', 'GET /api/admin/bookings', 'GET /api/admin/vehicles'],
    },
  });
});

// ── 404 handler ────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found.` });
});

// ── Global error handler ───────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ── Start server ───────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚐 RoadWay API running at http://localhost:${PORT}`);
  console.log(`📋 Routes ready:\n   POST  /api/auth/signup\n   POST  /api/auth/login\n   POST  /api/booking/create\n   GET   /api/booking/all\n   GET   /api/booking/:id\n   PATCH /api/booking/:id/status\n`);
});
