const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();
const Database = require('better-sqlite3');
const DB_FILE = path.join(__dirname, 'database.sqlite');
const db = new Database(DB_FILE);

// Initialize tables
db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT,
  goal TEXT
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  FOREIGN KEY(userId) REFERENCES users(id)
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS food_logs (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  foodName TEXT NOT NULL,
  calories INTEGER DEFAULT 0,
  protein INTEGER DEFAULT 0,
  carbs INTEGER DEFAULT 0,
  fat INTEGER DEFAULT 0,
  imageUrl TEXT,
  FOREIGN KEY(userId) REFERENCES users(id)
)`).run();

const app = express();
app.use(bodyParser.json());

// Configure CORS origin via environment variable for dev safety.
// Set SERVER_ALLOWED_ORIGIN to a comma-separated list of allowed origins (e.g. http://localhost:3000,http://localhost:5173)
const allowed = process.env.SERVER_ALLOWED_ORIGIN ? process.env.SERVER_ALLOWED_ORIGIN.split(',') : true;
app.use(cors({ origin: allowed, credentials: true }));

const PORT = process.env.PORT || 4000;

// Helpers
const findUserByEmail = (email) => data.users.find(u => u.email === email.toLowerCase());
const getUserSafe = (user) => ({ id: user.id, email: user.email, goal: user.goal || null });

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  if (password.length < 6) return res.status(400).json({ error: 'password must be at least 6 characters' });

  const emailLower = email.toLowerCase();
  const getUserStmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const existing = getUserStmt.get(emailLower);
  if (existing && existing.passwordHash) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  if (existing) {
    // set password for old demo user
    db.prepare('UPDATE users SET passwordHash = ? WHERE id = ?').run(passwordHash, existing.id);
    const token = uuidv4();
    db.prepare('INSERT OR REPLACE INTO sessions (token, userId) VALUES (?, ?)').run(token, existing.id);
    return res.json({ user: getUserSafe({ id: existing.id, email: existing.email, goal: existing.goal }), token });
  }

  const userId = `user_${Date.now()}`;
  db.prepare('INSERT INTO users (id, email, passwordHash, goal) VALUES (?, ?, ?, ?)').run(userId, emailLower, passwordHash, null);
  db.prepare('INSERT OR REPLACE INTO sessions (token, userId) VALUES (?, ?)').run(uuidv4(), userId);
  const token = uuidv4();
  db.prepare('INSERT OR REPLACE INTO sessions (token, userId) VALUES (?, ?)').run(token, userId);
  res.json({ user: getUserSafe({ id: userId, email: emailLower, goal: null }), token });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const emailLower = email.toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(emailLower);
  if (!user || !user.passwordHash) return res.status(400).json({ error: 'User not found or no password set' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = uuidv4();
  db.prepare('INSERT OR REPLACE INTO sessions (token, userId) VALUES (?, ?)').run(token, user.id);
  res.json({ user: getUserSafe(user), token });
});

app.post('/api/logout', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (token) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  }
  res.json({ ok: true });
});

app.get('/api/current', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.json({ user: null });
  const row = db.prepare('SELECT userId FROM sessions WHERE token = ?').get(token);
  if (!row) return res.json({ user: null });
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(row.userId);
  if (!user) return res.json({ user: null });
  res.json({ user: getUserSafe(user) });
});

app.post('/api/goal', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { goal } = req.body || {};
  const row = db.prepare('SELECT userId FROM sessions WHERE token = ?').get(token);
  if (!row) return res.status(401).json({ error: 'Unauthorized' });
  const userId = row.userId;
  db.prepare('UPDATE users SET goal = ? WHERE id = ?').run(goal || null, userId);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  res.json({ user: getUserSafe(user) });
});

app.get('/api/foodlogs', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const row = db.prepare('SELECT userId FROM sessions WHERE token = ?').get(token);
  if (!row) return res.status(401).json({ error: 'Unauthorized' });
  const logs = db.prepare('SELECT * FROM food_logs WHERE userId = ? ORDER BY createdAt DESC').all(row.userId);
  res.json({ logs });
});

app.post('/api/foodlogs', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const row = db.prepare('SELECT userId FROM sessions WHERE token = ?').get(token);
  if (!row) return res.status(401).json({ error: 'Unauthorized' });
  const userId = row.userId;
  const { foodName, calories, protein, carbs, fat, imageUrl } = req.body || {};
  if (!foodName) return res.status(400).json({ error: 'foodName required' });
  const logId = `log_${Date.now()}`;
  const createdAt = new Date().toISOString();
  db.prepare('INSERT INTO food_logs (id, userId, createdAt, foodName, calories, protein, carbs, fat, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(logId, userId, createdAt, foodName, Number(calories) || 0, Number(protein) || 0, Number(carbs) || 0, Number(fat) || 0, imageUrl || null);
  const newLog = db.prepare('SELECT * FROM food_logs WHERE id = ?').get(logId);
  res.json({ log: newLog });
});

app.listen(PORT, () => {
  console.log(`Snapcal backend running on http://localhost:${PORT}`);
});
