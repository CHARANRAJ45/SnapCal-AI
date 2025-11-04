# Snapcal Backend (demo)

This is a minimal Express backend for the Snapcal demo app. It implements simple endpoints for register/login/logout/current/goal/foodlogs and persists data to `data.json`.

Start:

```powershell
cd server
npm install
npm start
```

The server listens on port 4000 by default. The front-end (Vite) runs on port 5173 by default and CORS is enabled for that origin.

Notes:
- Passwords are hashed with bcryptjs. This is a demo backend — do not use in production without proper security hardening.
- Data is stored in `server/data.json`.
