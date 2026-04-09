const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// GET /api/templates — get user's cloud templates
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, type, data, created_at, updated_at FROM templates WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json({ templates: rows });
  } catch (err) {
    console.error('Get templates error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/templates/sync — sync templates from device
router.post(
  '/sync',
  [
    body('templates').isArray(),
    body('templates.*.name').notEmpty().trim(),
    body('templates.*.type').optional().isIn(['single', 'multi']),
    body('templates.*.data').isObject(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { templates } = req.body;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Delete existing and re-insert (simple sync strategy)
      await client.query('DELETE FROM templates WHERE user_id = $1', [req.user.id]);

      for (const tmpl of templates) {
        await client.query(
          `INSERT INTO templates (user_id, name, type, data, updated_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [req.user.id, tmpl.name, tmpl.type || 'single', JSON.stringify(tmpl.data)]
        );
      }

      await client.query('COMMIT');

      // Return synced templates
      const { rows } = await pool.query(
        'SELECT id, name, type, data, created_at, updated_at FROM templates WHERE user_id = $1 ORDER BY updated_at DESC',
        [req.user.id]
      );

      res.json({ templates: rows, synced: templates.length });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Sync templates error:', err);
      res.status(500).json({ error: 'Server error' });
    } finally {
      client.release();
    }
  }
);

// DELETE /api/templates/:id
router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM templates WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ message: 'Template deleted' });
  } catch (err) {
    console.error('Delete template error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
