import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(express.json());


// REST API Endpoints

// GET all data
app.get('/api/data', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany();
    const drivers = await prisma.driver.findMany();
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

// VEHICLES
app.post('/api/vehicles', async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.create({ data: req.body });
    res.status(201).json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/vehicles/:reg', async (req, res) => {
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

app.delete('/api/vehicles/:reg', async (req, res) => {
  try {
    await prisma.vehicle.delete({ where: { registrationNumber: req.params.reg } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DRIVERS
app.post('/api/drivers', async (req, res) => {
  try {
    const driver = await prisma.driver.create({ data: req.body });
    res.status(201).json(driver);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/drivers/:id', async (req, res) => {
  try {
    const driver = await prisma.driver.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(driver);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/drivers/:id', async (req, res) => {
  try {
    await prisma.driver.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// TRIPS
app.post('/api/trips', async (req, res) => {
  try {
    const trip = await prisma.trip.create({ data: req.body });
    res.status(201).json(trip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/trips/:id', async (req, res) => {
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

// MAINTENANCE
app.post('/api/maintenance', async (req, res) => {
  try {
    const log = await prisma.maintenanceLog.create({ data: req.body });
    res.status(201).json(log);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/maintenance/:id', async (req, res) => {
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

// FUEL
app.post('/api/fuel', async (req, res) => {
  try {
    const log = await prisma.fuelLog.create({ data: req.body });
    res.status(201).json(log);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// EXPENSES
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

// CONFIG
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
