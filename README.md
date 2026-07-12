# TransitOps - Live Fleet Management Console

TransitOps is a comprehensive fleet management and tracking dashboard featuring an interactive live GPS map, driver and vehicle registries, and real-time telemetry monitoring. It uses a unified full-stack architecture powered by React, Vite, and Express.

## 🚀 Step-by-Step Setup & Run Instructions

**Prerequisites:**  
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- Git

### 1. Clone & Install Dependencies
First, clone the repository to your local machine and install all the required Node modules.
```bash
git clone https://github.com/NityamAPatel-084/Odoo-Hackathon-TransitOps.git
cd Odoo-Hackathon-TransitOps
npm install
```

### 2. Configure Environment Variables
You will need an environment file to securely store your API keys and configuration.
- Create a `.env` (or `.env.local`) file in the root directory.
- Ensure any required keys (e.g., `GEMINI_API_KEY`, database credentials if applicable) are populated in this file.

### 3. Start the Application
The project is configured to run both the frontend UI and the backend API server concurrently via a single script.

```bash
npm run dev
```

### 4. Access the Dashboard
Once the server starts up, you can access the interactive application in your web browser:
- **Local URL:** `http://localhost:3000`

---

## 📦 Core Dependencies

This project relies on the following key technologies and libraries:

### Frontend (UI & Map)
- **React 19** (`react`, `react-dom`) - Core UI library.
- **Vite** (`vite`) - Next-generation frontend tooling.
- **Tailwind CSS v4** (`@tailwindcss/vite`, `tailwindcss`) - Utility-first styling.
- **React Leaflet** (`react-leaflet`, `leaflet`) - Interactive GPS mapping integration.
- **Lucide React** (`lucide-react`) - Clean, scalable icons.
- **Framer Motion** (`motion`) - Smooth micro-animations.

### Backend (API & Server)
- **Express.js** (`express`) - Fast, unopinionated web framework.
- **Drizzle ORM** (`drizzle-orm`) - Typesafe TypeScript ORM.
- **PostgreSQL Client** (`pg`) - Database connector.
- **Firebase** (`firebase`, `firebase-admin`) - Authentication and cloud integrations.
- **Security Middleware** (`helmet`, `cors`, `express-rate-limit`) - API hardening and protection.
- **Dotenv** (`dotenv`) - Environment variable management.

---

## 🔒 Enterprise Security Features

- **Application-Level Encryption (ALE)** — Driver PII is encrypted at rest using `aes-256-cbc`.
- **Role-Based Access Control (RBAC)** — Strict least-privilege middleware securing all endpoints.
- **Zod Payload Validation** — Complete runtime type-safety protecting against SQL Injection.
- **Network Hardening** — Configured with Helmet HTTP headers, strict CORS, and Rate Limiting.
