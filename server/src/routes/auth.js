const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authMiddleware, generateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').optional().trim().isLength({ max: 100 }),
    body('language').optional().isIn(['ru', 'en', 'ar']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, language, device_id } = req.body;

    try {
      // Check if user exists
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      const password_hash = await bcrypt.hash(password, 12);
      const { rows } = await pool.query(
        `INSERT INTO users (email, password_hash, name, language, device_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, name, language, is_admin, created_at`,
        [email, password_hash, name || null, language || 'ru', device_id || null]
      );

      const user = rows[0];
      const token = generateToken(user.id);

      res.status(201).json({ user, token });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const { rows } = await pool.query(
        'SELECT id, email, name, language, password_hash, is_admin, is_active FROM users WHERE email = $1',
        [email]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = rows[0];

      if (!user.is_active) {
        return res.status(403).json({ error: 'Account disabled' });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Update last login
      await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

      const token = generateToken(user.id);
      const { password_hash, ...safeUser } = user;

      res.json({ user: safeUser, token });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/auth/me
router.put(
  '/me',
  authMiddleware,
  [
    body('name').optional().trim().isLength({ max: 100 }),
    body('phone').optional().trim().isLength({ max: 30 }),
    body('language').optional().isIn(['ru', 'en', 'ar']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, language } = req.body;

    try {
      const { rows } = await pool.query(
        `UPDATE users SET
           name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           language = COALESCE($3, language),
           updated_at = NOW()
         WHERE id = $4
         RETURNING id, email, name, phone, language, is_admin, created_at`,
        [name, phone, language, req.user.id]
      );

      res.json({ user: rows[0] });
    } catch (err) {
      console.error('Update profile error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// PATCH /api/auth/change-password
router.patch(
  '/change-password',
  authMiddleware,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    try {
      const { rows } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
      const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);

      if (!valid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const hash = await bcrypt.hash(newPassword, 12);
      await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, req.user.id]);

      res.json({ message: 'Password changed successfully' });
    } catch (err) {
      console.error('Change password error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  async (req, res) => {
    const { email } = req.body;

    try {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 3600000); // 1 hour

      await pool.query(
        'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE email = $3',
        [token, expires, email]
      );

      // In production: send email with reset link
      // For now, log the token (remove in production)
      console.log(`Password reset token for ${email}: ${token}`);

      res.json({ message: 'If the email exists, a reset link has been sent' });
    } catch (err) {
      console.error('Forgot password error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('newPassword').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      const { rows } = await pool.query(
        'SELECT id FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
        [token]
      );

      if (rows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      const hash = await bcrypt.hash(newPassword, 12);
      await pool.query(
        'UPDATE users SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL, updated_at = NOW() WHERE id = $2',
        [hash, rows[0].id]
      );

      res.json({ message: 'Password reset successfully' });
    } catch (err) {
      console.error('Reset password error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
