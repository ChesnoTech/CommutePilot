const express = require('express');
const { query, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const { adminMiddleware } = require('../middleware/admin');

const router = express.Router();

// All routes require admin
router.use(authMiddleware, adminMiddleware);

// GET /api/users
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('search').optional().trim(),
    query('status').optional().isIn(['active', 'inactive', 'all']),
  ],
  async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 25;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || 'all';

    try {
      let whereClause = '';
      const params = [];

      if (search) {
        params.push(`%${search}%`);
        whereClause += ` WHERE (email ILIKE $${params.length} OR name ILIKE $${params.length})`;
      }

      if (status !== 'all') {
        const isActive = status === 'active';
        params.push(isActive);
        whereClause += whereClause ? ` AND is_active = $${params.length}` : ` WHERE is_active = $${params.length}`;
      }

      const countResult = await pool.query(
        `SELECT COUNT(*) FROM users${whereClause}`,
        params
      );
      const total = parseInt(countResult.rows[0].count);

      params.push(limit, offset);
      const { rows } = await pool.query(
        `SELECT id, email, name, phone, language, is_admin, is_active, created_at, last_login_at, updated_at
         FROM users${whereClause}
         ORDER BY created_at DESC
         LIMIT $${params.length - 1} OFFSET $${params.length}`,
        params
      );

      res.json({
        users: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error('List users error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, email, name, phone, language, device_id, is_admin, is_active, created_at, last_login_at, updated_at
       FROM users WHERE id = $1`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's template count
    const templateCount = await pool.query(
      'SELECT COUNT(*) FROM templates WHERE user_id = $1',
      [req.params.id]
    );

    res.json({
      user: rows[0],
      templateCount: parseInt(templateCount.rows[0].count),
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  const { is_active, is_admin, name } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE users SET
         is_active = COALESCE($1, is_active),
         is_admin = COALESCE($2, is_admin),
         name = COALESCE($3, name),
         updated_at = NOW()
       WHERE id = $4
       RETURNING id, email, name, is_admin, is_active`,
      [is_active, is_admin, name, req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    // Prevent self-deletion
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
