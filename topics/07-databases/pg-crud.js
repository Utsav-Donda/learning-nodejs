// Full CRUD against PostgreSQL using the `pg` driver directly (no ORM),
// with parameterized queries to prevent SQL injection.
//
// Requires a running Postgres instance. Set DATABASE_URL, e.g.:
//   export DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
//
// Run: node pg-crud.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres',
});

async function setup() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `);
}

async function createNote(title) {
  // Never interpolate user input into SQL — use $1, $2... placeholders.
  const { rows } = await pool.query(
    'INSERT INTO notes (title) VALUES ($1) RETURNING *',
    [title]
  );
  return rows[0];
}

async function listNotes() {
  const { rows } = await pool.query('SELECT * FROM notes ORDER BY id');
  return rows;
}

async function updateNote(id, title) {
  const { rows } = await pool.query(
    'UPDATE notes SET title = $1 WHERE id = $2 RETURNING *',
    [title, id]
  );
  return rows[0] ?? null;
}

async function deleteNote(id) {
  const result = await pool.query('DELETE FROM notes WHERE id = $1', [id]);
  return result.rowCount > 0;
}

async function main() {
  await setup();

  const created = await createNote('Learn parameterized queries');
  console.log('created:', created);

  console.log('all notes:', await listNotes());

  const updated = await updateNote(created.id, 'Learn parameterized queries (done)');
  console.log('updated:', updated);

  const deleted = await deleteNote(created.id);
  console.log('deleted:', deleted);

  await pool.end();
}

if (require.main === module) {
  main().catch((err) => {
    console.error('pg-crud demo failed — is Postgres running and DATABASE_URL set?', err.message);
    process.exitCode = 1;
  });
}

module.exports = { createNote, listNotes, updateNote, deleteNote };
