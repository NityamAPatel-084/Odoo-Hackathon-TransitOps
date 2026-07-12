import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import crypto from 'crypto';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(express.json());


// REST API Endpoints

// --- SECURITY: ALE ---
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012'; // 32 bytes
const IV_LENGTH = 16;

function encrypt(text: string) {
  if (!text) return text;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string) {
  if (!text || !text.includes(':')) return text;
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (e) {
    return text;
  }
}

// --- SECURITY: RBAC ---
const requireRole = (allowedRoles: string[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userRole = req.headers['x-user-role'] as string;
    if (!userRole) {
      return res.status(401).json({ error: 'Unauthorized: Missing Role Header' });
    }
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient Permissions' });
    }
    next();
  };
};

// --- SECURITY: Zod Validation ---
const VehicleSchema = z.object({
  registrationNumber: z.string().min(1),
  name: z.string().min(1),
  model: z.string(),
  type: z.string(),
  maxLoadCapacity: z.number().nonnegative(),
  odometer: z.number().nonnegative(),
  acquisitionCost: z.number().nonnegative(),
  status: z.string(),
});

const DriverSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  licenseNumber: z.string(),
  licenseCategory: z.string(),
  licenseExpiryDate: z.string(),
  contactNumber: z.string(),
  safetyScore: z.number(),
  status: z.string(),
  tripCompletionRate: z.number(),
});

const TripSchema = z.object({
  id: z.string().min(1),
  source: z.string(),
  destination: z.string(),
  vehicleReg: z.string(),
  driverId: z.string(),
  cargoWeight: z.number(),
  plannedDistance: z.number(),
  status: z.string(),
  eta: z.string(),
  finalOdometer: z.number().nullable().optional(),
  fuelConsumed: z.number().nullable().optional(),
});

const validateBody = (schema: z.ZodSchema) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({ error: 'Invalid input data', details: error.errors });
    }
  };
};

/**
 * DATA INITIALIZATION API
 * GET /api/data
 * Fetches the entire initial state of the platform including all vehicles, 
 * drivers, trips, logs, expenses, and system configurations.
 */
app.get('/api/data', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany();
    const driversRaw = await prisma.driver.findMany();
    const drivers = driversRaw.map(d => ({
      ...d,
      licenseNumber: decrypt(d.licenseNumber),
      contactNumber: decrypt(d.contactNumber)
    }));
    const trips = await prisma.trip.findMany();
    const maintenanceLogs = await prisma.maintenanceLog.findMany();
    const fuelLogs = await prisma.fuelLog.findMany();
    const expenses = await prisma.expense.findMany();
    let systemConfig = await prisma.systemConfig.findUnique({ where: { id: 1 } });
    
    if (!systemConfig) {
      systemConfig = {
        id: 1,
        depotName: 'Main Hub - Chicago',
        defaultCurrency: 'USD',
        distanceUnit: 'miles',
        timezone: 'America/Chicago (CST)',
      };
    }

    res.json({
      vehicles,
      drivers,
      trips,
      maintenanceLogs,
      fuelLogs,
      expenses,
      systemConfig,
    });
  } catch (error: any) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * VEHICLES API
 * Endpoints for managing the fleet registry (Create, Update, Delete).
 */
app.post('/api/vehicles', requireRole(['Fleet Manager']), validateBody(VehicleSchema), async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.create({ data: req.body });
    res.status(201).json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/vehicles/:reg', requireRole(['Fleet Manager']), validateBody(VehicleSchema), async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.update({
      where: { registrationNumber: req.params.reg },
      data: req.body,
    });
    res.json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/vehicles/:reg', requireRole(['Fleet Manager']), async (req, res) => {
  try {
    await prisma.vehicle.delete({ where: { registrationNumber: req.params.reg } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DRIVERS API
 * Endpoints for managing driver profiles, licenses, and telematic scores.
 */
app.post('/api/drivers', requireRole(['Fleet Manager']), validateBody(DriverSchema), async (req, res) => {
  try {
    const data = { ...req.body };
    data.licenseNumber = encrypt(data.licenseNumber);
    data.contactNumber = encrypt(data.contactNumber);
    const driver = await prisma.driver.create({ data });
    res.status(201).json(driver);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/drivers/:id', requireRole(['Fleet Manager']), validateBody(DriverSchema), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.licenseNumber) data.licenseNumber = encrypt(data.licenseNumber);
    if (data.contactNumber) data.contactNumber = encrypt(data.contactNumber);
    const driver = await prisma.driver.update({
      where: { id: req.params.id },
      data,
    });
    res.json(driver);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/drivers/:id', requireRole(['Fleet Manager']), async (req, res) => {
  try {
    await prisma.driver.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * TRIPS API
 * Endpoints for handling dispatch assignments and state transitions.
 */
app.post('/api/trips', requireRole(['Fleet Manager', 'Dispatcher']), validateBody(TripSchema), async (req, res) => {
  try {
    const trip = await prisma.trip.create({ data: req.body });
    res.status(201).json(trip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/trips/:id', requireRole(['Fleet Manager', 'Dispatcher']), validateBody(TripSchema), async (req, res) => {
  try {
    const trip = await prisma.trip.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(trip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * MAINTENANCE API
 * Endpoints for logging service bay records and vehicle repairs.
 */
app.post('/api/maintenance', requireRole(['Fleet Manager', 'Safety Officer']), async (req, res) => {
  try {
    const log = await prisma.maintenanceLog.create({ data: req.body });
    res.status(201).json(log);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/maintenance/:id', requireRole(['Fleet Manager', 'Safety Officer']), async (req, res) => {
  try {
    const log = await prisma.maintenanceLog.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(log);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * FUEL API
 * Endpoints for logging fuel consumption across the fleet.
 */
app.post('/api/fuel', async (req, res) => {
  try {
    const log = await prisma.fuelLog.create({ data: req.body });
    res.status(201).json(log);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * EXPENSES API
 * Endpoints for recording tolls, maintenance costs, and general transit expenses.
 */
app.post('/api/expenses', async (req, res) => {
  try {
    const expense = await prisma.expense.create({ data: req.body });
    res.status(201).json(expense);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/expenses/:id', async (req, res) => {
  try {
    const expense = await prisma.expense.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(expense);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * SYSTEM CONFIGURATION API
 * Endpoints for updating depot settings like timezone and currency.
 */
app.put('/api/config', async (req, res) => {
  try {
    const config = await prisma.systemConfig.upsert({
      where: { id: 1 },
      update: req.body,
      create: { id: 1, ...req.body },
    });
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend in production (only when dist/ build exists)
const distPath = path.join(__dirname, 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Development mode: Vite handles the frontend, just 404 unknown routes
  app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
  });
}

// Initialize and start server
async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Fatal startup error:', error);
    process.exit(1);
  }
}

start();
