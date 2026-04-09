require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const pool = require('./config/db');
const migrate = require('./db/migrate');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const templatesRoutes = require('./routes/templates');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many attempts, try again later' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Serve admin dashboard
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// Create default admin if not exists
async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL || '7agtyadmin@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  try {
    const { rows } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      const hash = await bcrypt.hash(password, 12);
      await pool.query(
        `INSERT INTO users (email, password_hash, name, is_admin, is_active)
         VALUES ($1, $2, $3, true, true)`,
        [email, hash, 'Admin']
      );
      console.log(`Admin account created: ${email}`);
    } else {
      // Ensure existing account is admin
      await pool.query('UPDATE users SET is_admin = true WHERE email = $1', [email]);
    }
  } catch (err) {
    console.error('Failed to create admin:', err);
  }
}

// Start server
async function start() {
  try {
    // Run migrations
    await migrate();
    console.log('Database ready');

    // Create admin
    await ensureAdmin();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`CommutePilot API running on port ${PORT}`);
      console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
