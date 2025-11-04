const path = require('path');
const Database = require('better-sqlite3');

const DB_FILE = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(DB_FILE, { readonly: true });

function dump() {
  try {
    const users = db.prepare('SELECT id, email, goal FROM users').all();
    const sessions = db.prepare('SELECT token, userId FROM sessions').all();
    const logs = db.prepare('SELECT id, userId, createdAt, foodName, calories, protein, carbs, fat FROM food_logs ORDER BY createdAt DESC').all();

    console.log('USERS:');
    console.log(JSON.stringify(users, null, 2));
    console.log('\nSESSIONS:');
    console.log(JSON.stringify(sessions, null, 2));
    console.log('\nFOOD_LOGS:');
    console.log(JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error('Failed to read DB:', err.message || err);
    process.exit(1);
  }
}

if (require.main === module) {
  dump();
}

module.exports = { dump };
