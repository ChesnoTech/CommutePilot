require('dotenv').config();
const pool = require('../config/db');

const migrations = [
  {
    name: '001_create_users',
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        phone VARCHAR(30),
        language VARCHAR(5) DEFAULT 'ru',
        device_id VARCHAR(255),
        is_admin BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        password_reset_token VARCHAR(255),
        password_reset_expires TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        last_login_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `,
  },
  {
    name: '002_create_templates',
    sql: `
      CREATE TABLE IF NOT EXISTS templates (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(20) DEFAULT 'single',
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
    `,
  },
  {
    name: '003_create_migrations_table',
    sql: `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
];

async function migrate() {
  const client = await pool.connect();
  try {
    // Ensure migrations table exists first
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    for (const migration of migrations) {
      const { rows } = await client.query(
        'SELECT id FROM migrations WHERE name = $1',
        [migration.name]
      );
      if (rows.length === 0) {
        console.log(`Running migration: ${migration.name}`);
        await client.query(migration.sql);
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [migration.name]
        );
        console.log(`  Applied: ${migration.name}`);
      } else {
        console.log(`  Skipped (already applied): ${migration.name}`);
      }
    }
    console.log('All migrations complete.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
  }
}

// Run if called directly
if (require.main === module) {
  migrate().then(() => process.exit(0));
} else {
  module.exports = migrate;
}
