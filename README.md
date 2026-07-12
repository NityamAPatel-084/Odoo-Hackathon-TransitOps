# TransitOps — Smart Transport Operations Platform

TransitOps is a fleet and transport operations management platform designed for dispatchers, fleet managers, safety officers, and financial analysts. Built for the Odoo Hackathon.

---

## Features

- 🚛 **Fleet Registry** — Track vehicles, status (On Trip / In Shop / Available / Retired), and acquisition costs
- 👤 **Drivers Management** — Manage CDL drivers, license expiry, safety scores, and trip completion rates
- 🗺️ **Trip Dispatch** — Create, dispatch, complete, or cancel trips with auto-status propagation
- 🔧 **Maintenance Operations** — Log service events, track costs, auto-release to dispatch pool
- ⛽ **Fuel & Expenses** — Record fuel logs and review/approve expenses
- 📊 **Analytics & Reports** — Fleet KPIs, trip statistics, and cost breakdowns
- ⚙️ **Settings Panel** — Depot configuration and system preferences

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 6, Tailwind CSS v4, TypeScript |
| Backend | Express.js (Node.js) |
| Database | SQLite (via Prisma ORM v5) |
| AI Integration | Google Gemini API |
| Animations | Motion (Framer Motion) |

---

## Run Locally

**Prerequisites:** Node.js v18+

### 1. Install dependencies
```bash
npm install
```

### 2. Set up the database
```bash
npx prisma db push
```

This creates the SQLite database at `prisma/dev.db` and generates the Prisma Client.

### 3. Set environment variables
Copy `.env.example` to `.env.local` and add your Gemini API key:
```
GEMINI_API_KEY=your_key_here
```

### 4. Start the backend server (Terminal 1)
```bash
npm run server
```
The Express API runs on `http://localhost:3001`

### 5. Start the frontend dev server (Terminal 2)
```bash
npm run dev
```
The app runs on `http://localhost:3000`

> **Note:** The database auto-seeds with demo fleet data on first startup if empty.
