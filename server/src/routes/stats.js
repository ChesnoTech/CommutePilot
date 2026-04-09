const express = require('express');
const pool = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const { adminMiddleware } = require('../middleware/admin');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

// GET /api/stats — admin dashboard stats
router.get('/', async (req, res) => {
  try {
    const [
      totalUsers,
      activeToday,
      newThisWeek,
      newThisMonth,
      totalTemplates,
      languageBreakdown,
      recentUsers,
      dailySignups,
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query("SELECT COUNT(*) FROM users WHERE last_login_at > NOW() - INTERVAL '24 hours'"),
      pool.query("SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days'"),
      pool.query("SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '30 days'"),
      pool.query('SELECT COUNT(*) FROM templates'),
      pool.query('SELECT language, COUNT(*) as count FROM users GROUP BY language ORDER BY count DESC'),
      pool.query(
        'SELECT id, email, name, language, created_at, last_login_at FROM users ORDER BY created_at DESC LIMIT 10'
      ),
      pool.query(`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM users
        WHERE created_at > NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `),
    ]);

    res.json({
      stats: {
        totalUsers: parseInt(totalUsers.rows[0].count),
        activeToday: parseInt(activeToday.rows[0].count),
        newThisWeek: parseInt(newThisWeek.rows[0].count),
        newThisMonth: parseInt(newThisMonth.rows[0].count),
        totalTemplates: parseInt(totalTemplates.rows[0].count),
      },
      languageBreakdown: languageBreakdown.rows,
      recentUsers: recentUsers.rows,
      dailySignups: dailySignups.rows,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
