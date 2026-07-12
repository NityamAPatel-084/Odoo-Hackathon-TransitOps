import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";
import fs from "fs/promises";
import fsSync from "fs";
import https from "https";
import { eq } from "drizzle-orm";
import { execSync } from "child_process";

// Load environment variables
dotenv.config();

import { db } from "./src/db/index.ts";
import * as schema from "./src/db/schema.ts";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Determine if SQL credentials are provided
const isSqlConfigured = !!(
  process.env.SQL_HOST &&
  process.env.SQL_DB_NAME &&
  process.env.SQL_USER
);

const DB_JSON_PATH = path.join(process.cwd(), "db.json");
const PULLED_LOCK_PATH = path.join(process.cwd(), "pulled.lock");

const repoBaseUrl = 'https://raw.githubusercontent.com/NityamAPatel-084/Odoo-Hackathon-TransitOps/main/';

const filesToDownload = [
  'src/types.ts',
  'src/App.tsx',
  'src/index.css',
  'src/main.tsx',
  'src/components/AnalyticsReports.tsx',
  'src/components/Dashboard.tsx',
  'src/components/DriversManagement.tsx',
  'src/components/FleetRegistry.tsx',
  'src/components/FuelExpenses.tsx',
  'src/components/LoginScreen.tsx',
  'src/components/MaintenanceOps.tsx',
  'src/components/SettingsPanel.tsx',
  'src/components/TripDispatch.tsx'
];

function getInitialUsers() {
  return [
    { email: "dispatch@test.com", role: "dispatcher", active: true, password: "123456" },
    { email: "manager@test.com", role: "fleet_manager", active: true, password: "123456" },
    { email: "safety@test.com", role: "safety_officer", active: true, password: "123456" },
    { email: "finance@test.com", role: "financial_analyst", active: true, password: "123456" }
  ];
}

function getInitialConfig() {
  return {
    depotName: "Main Hub - Chicago",
    defaultCurrency: "USD",
    distanceUnit: "miles",
    timezone: "America/Chicago (CST)"
  };
}

async function readLocalData() {
  try {
    const fileContent = await fs.readFile(DB_JSON_PATH, "utf-8");
    if (fileContent.trim()) {
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Error reading local db.json:", error);
  }
  return {
    vehicles: [],
    drivers: [],
    trips: [],
    maintenance: [],
    fuelLogs: [],
    expenses: [],
    users: getInitialUsers(),
    config: getInitialConfig()
  };
}

async function writeLocalData(data: any) {
  await fs.writeFile(DB_JSON_PATH, JSON.stringify(data, null, 2), "utf-8");
}

async function pullRepo() {
  for (const file of filesToDownload) {
    const url = repoBaseUrl + file;
    const dest = path.join(process.cwd(), file);
    const dir = path.dirname(dest);

    if (!fsSync.existsSync(dir)) {
      fsSync.mkdirSync(dir, { recursive: true });
    }

    await new Promise<void>((resolve, reject) => {
      https.get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Status ${res.statusCode} for ${file}`));
          return;
        }
        const fileStream = fsSync.createWriteStream(dest);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      }).on('error', reject);
    });
    console.log(`Auto-pulled: ${file}`);

    // If App.tsx was pulled, dynamically inject the Live Fleet Map feature modifications
    if (file === 'src/App.tsx') {
      try {
        let content = fsSync.readFileSync(dest, 'utf-8');
        
        // 1. Inject FleetMap import
        if (!content.includes("import { FleetMap } from './components/FleetMap'")) {
          content = content.replace(
            "import SettingsPanel from './components/SettingsPanel';",
            "import SettingsPanel from './components/SettingsPanel';\nimport { FleetMap } from './components/FleetMap';"
          );
        }
        
        // 2. Inject Map icon import
        if (!content.includes("  Map\n} from 'lucide-react'")) {
          content = content.replace(
            "  Info\n} from 'lucide-react';",
            "  Info,\n  Map\n} from 'lucide-react';"
          );
        }
        
        // 3. Inject case 'Map' in renderTabContent
        if (!content.includes("case 'Map':")) {
          content = content.replace(
            "      case 'Settings':",
            "      case 'Map':\n        return (\n          <FleetMap\n            vehicles={vehicles}\n            trips={trips}\n            drivers={drivers}\n          />\n        );\n      case 'Settings':"
          );
        }
        
        // 4. Inject Map into sidebar links array
        if (!content.includes("{ id: 'Map', label: 'Live Fleet Map', icon: Map }")) {
          content = content.replace(
            "              { id: 'Trips', label: 'Dispatch Console', icon: Navigation },",
            "              { id: 'Trips', label: 'Dispatch Console', icon: Navigation },\n              { id: 'Map', label: 'Live Fleet Map', icon: Map },"
          );
        }
        
        // 5. Inject Map into mobile bottom navigation menu
        if (!content.includes("{ id: 'Map', label: 'Live Map', icon: Map }")) {
          content = content.replace(
            "            { id: 'Trips', label: 'Dispatch', icon: Navigation },",
            "            { id: 'Trips', label: 'Dispatch', icon: Navigation },\n            { id: 'Map', label: 'Live Map', icon: Map },"
          );
        }
        
        fsSync.writeFileSync(dest, content, 'utf-8');
        console.log("Successfully injected Live Fleet Map feature into App.tsx post-pull.");
      } catch (err: any) {
        console.error("Failed to inject Map feature into App.tsx:", err.message);
      }
    }
  }
}

async function checkAndPullRepo() {
  if (fsSync.existsSync(PULLED_LOCK_PATH)) {
    console.log("Repository already pulled. Skipping auto-pull.");
    return;
  }

  try {
    console.log("Auto-pulling repository frontend files...");
    await pullRepo();
    fsSync.writeFileSync(PULLED_LOCK_PATH, "done", "utf-8");
    console.log("Successfully pulled and locked.");
  } catch (err: any) {
    console.error("Auto-pull failed:", err.message);
  }
}

function runGitOperations() {
  const logs: string[] = [];
  logs.push("=== STARTING GIT OPERATIONS ===");
  
  // Check and repair corrupted git index if necessary
  try {
    execSync('git status');
    logs.push("Git status check passed.");
  } catch (e: any) {
    const errStr = (e.message || "") + (e.stderr ? e.stderr.toString() : "") + (e.stdout ? e.stdout.toString() : "");
    if (errStr.includes('index file smaller than expected')) {
      logs.push("Corrupted Git index detected. Rebuilding index file...");
      const indexPath = path.join(process.cwd(), '.git', 'index');
      if (fsSync.existsSync(indexPath)) {
        fsSync.unlinkSync(indexPath);
      }
      execSync('git reset');
      logs.push("Git index rebuilt successfully.");
    } else {
      logs.push("Git status failed with: " + errStr);
    }
  }

  const out1 = execSync('git add server.ts src/App.tsx src/components/FleetMap.tsx vite.config.ts package.json db.json').toString();
  logs.push("Git Add: " + (out1 || "Done"));

  let out2 = "";
  try {
    out2 = execSync('git commit -m "feat: add interactive GPS Fleet Map tracker and robust PostgreSQL/JSON-fallback REST APIs"').toString();
    logs.push("Git Commit: " + (out2 || "Done"));
  } catch (e: any) {
    logs.push("Git Commit skipped or failed: " + e.message);
  }

  const out3 = execSync('git pull origin main --rebase').toString();
  logs.push("Git Pull: " + (out3 || "Done"));

  const out4 = execSync('git push origin main').toString();
  logs.push("Git Push: " + (out4 || "Done"));
  logs.push("=== GIT OPERATIONS COMPLETED SUCCESSFULLY ===");
  return logs;
}

function gitPushOnStartup() {
  try {
    const logs = runGitOperations();
    logs.forEach(log => console.log(log));
  } catch (err: any) {
    console.error("=== STARTUP GIT PUSH FAILED ===");
    console.error(err.message);
    if (err.stdout) console.log("stdout:", err.stdout.toString());
    if (err.stderr) console.error("stderr:", err.stderr.toString());
    console.error("=================================");
  }
}

async function startServer() {
  // Perform Git Push of changes to remote repository
  gitPushOnStartup();

  // Pull remote files if not already done
  await checkAndPullRepo();

  const app = express();
  app.use(express.json({ limit: "10mb" }));

  app.get("/api/pull-now", async (req, res) => {
    try {
      console.log("Manual pull triggered via API...");
      await pullRepo();
      res.json({ status: "success", message: "Repository files pulled successfully" });
    } catch (err: any) {
      console.error("Manual pull failed:", err.message);
      res.status(500).json({ status: "error", error: err.message });
    }
  });

  app.get("/api/git-push", async (req, res) => {
    try {
      console.log("Executing git operations via API...");
      const logs = runGitOperations();
      res.json({
        status: "success",
        log: logs
      });
    } catch (err: any) {
      console.error("Git push failed:", err.message);
      res.status(200).json({
        status: "error",
        error: err.message,
        stderr: err.stderr ? err.stderr.toString() : ""
      });
    }
  });

  // REST API Endpoints

  // GET all data
  app.get("/api/data", async (req, res) => {
    try {
      if (isSqlConfigured) {
        const [
          vehiclesList,
          driversList,
          tripsList,
          maintenanceList,
          fuelLogsList,
          expensesList,
          usersList,
          configRows
        ] = await Promise.all([
          db.select().from(schema.vehicles),
          db.select().from(schema.drivers),
          db.select().from(schema.trips),
          db.select().from(schema.maintenance),
          db.select().from(schema.fuelLogs),
          db.select().from(schema.expenses),
          db.select().from(schema.users),
          db.select().from(schema.config).limit(1)
        ]);
        res.json({
          vehicles: vehiclesList,
          drivers: driversList,
          trips: tripsList,
          maintenanceLogs: maintenanceList,
          fuelLogs: fuelLogsList,
          expenses: expensesList,
          users: usersList.length > 0 ? usersList : getInitialUsers(),
          systemConfig: configRows[0] || getInitialConfig()
        });
      } else {
        const local = await readLocalData();
        res.json({
          vehicles: local.vehicles,
          drivers: local.drivers,
          trips: local.trips,
          maintenanceLogs: local.maintenance || [],
          fuelLogs: local.fuelLogs,
          expenses: local.expenses,
          users: local.users,
          systemConfig: local.config
        });
      }
    } catch (error: any) {
      console.error("GET /api/data error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // VEHICLES
  app.post("/api/vehicles", async (req, res) => {
    const v = req.body;
    try {
      const newVehicle = {
        registrationNumber: v.registrationNumber,
        name: v.name,
        model: v.model,
        type: v.type,
        maxLoadCapacity: Number(v.maxLoadCapacity || 0),
        odometer: Number(v.odometer || 0),
        acquisitionCost: Number(v.acquisitionCost || 0),
        status: v.status,
      };
      if (isSqlConfigured) {
        await db.insert(schema.vehicles).values(newVehicle);
      } else {
        const local = await readLocalData();
        local.vehicles.push(newVehicle);
        await writeLocalData(local);
      }
      res.status(201).json(newVehicle);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/vehicles/:reg", async (req, res) => {
    const reg = req.params.reg;
    const v = req.body;
    try {
      const updatedVehicle: any = {};
      if (v.name !== undefined) updatedVehicle.name = v.name;
      if (v.model !== undefined) updatedVehicle.model = v.model;
      if (v.type !== undefined) updatedVehicle.type = v.type;
      if (v.maxLoadCapacity !== undefined) updatedVehicle.maxLoadCapacity = Number(v.maxLoadCapacity || 0);
      if (v.odometer !== undefined) updatedVehicle.odometer = Number(v.odometer || 0);
      if (v.acquisitionCost !== undefined) updatedVehicle.acquisitionCost = Number(v.acquisitionCost || 0);
      if (v.status !== undefined) updatedVehicle.status = v.status;

      if (isSqlConfigured) {
        await db.update(schema.vehicles).set(updatedVehicle).where(eq(schema.vehicles.registrationNumber, reg));
        const [resVehicle] = await db.select().from(schema.vehicles).where(eq(schema.vehicles.registrationNumber, reg)).limit(1);
        res.json(resVehicle);
      } else {
        const local = await readLocalData();
        const idx = local.vehicles.findIndex((veh: any) => veh.registrationNumber === reg);
        if (idx !== -1) {
          local.vehicles[idx] = { ...local.vehicles[idx], ...updatedVehicle };
          await writeLocalData(local);
          res.json(local.vehicles[idx]);
        } else {
          res.status(404).json({ error: "Vehicle not found" });
        }
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/vehicles/:reg", async (req, res) => {
    const reg = req.params.reg;
    try {
      if (isSqlConfigured) {
        await db.delete(schema.vehicles).where(eq(schema.vehicles.registrationNumber, reg));
      } else {
        const local = await readLocalData();
        local.vehicles = local.vehicles.filter((v: any) => v.registrationNumber !== reg);
        await writeLocalData(local);
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // DRIVERS
  app.post("/api/drivers", async (req, res) => {
    const d = req.body;
    try {
      const newDriver = {
        id: d.id,
        name: d.name,
        licenseNumber: d.licenseNumber,
        licenseCategory: d.licenseCategory,
        licenseExpiryDate: d.licenseExpiryDate,
        contactNumber: d.contactNumber,
        safetyScore: Number(d.safetyScore || 0),
        status: d.status,
        tripCompletionRate: Number(d.tripCompletionRate || 0),
      };
      if (isSqlConfigured) {
        await db.insert(schema.drivers).values(newDriver);
      } else {
        const local = await readLocalData();
        local.drivers.push(newDriver);
        await writeLocalData(local);
      }
      res.status(201).json(newDriver);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/drivers/:id", async (req, res) => {
    const id = req.params.id;
    const d = req.body;
    try {
      const updatedDriver: any = {};
      if (d.name !== undefined) updatedDriver.name = d.name;
      if (d.licenseNumber !== undefined) updatedDriver.licenseNumber = d.licenseNumber;
      if (d.licenseCategory !== undefined) updatedDriver.licenseCategory = d.licenseCategory;
      if (d.licenseExpiryDate !== undefined) updatedDriver.licenseExpiryDate = d.licenseExpiryDate;
      if (d.contactNumber !== undefined) updatedDriver.contactNumber = d.contactNumber;
      if (d.safetyScore !== undefined) updatedDriver.safetyScore = Number(d.safetyScore || 0);
      if (d.status !== undefined) updatedDriver.status = d.status;
      if (d.tripCompletionRate !== undefined) updatedDriver.tripCompletionRate = Number(d.tripCompletionRate || 0);

      if (isSqlConfigured) {
        await db.update(schema.drivers).set(updatedDriver).where(eq(schema.drivers.id, id));
        const [resDriver] = await db.select().from(schema.drivers).where(eq(schema.drivers.id, id)).limit(1);
        res.json(resDriver);
      } else {
        const local = await readLocalData();
        const idx = local.drivers.findIndex((drv: any) => drv.id === id);
        if (idx !== -1) {
          local.drivers[idx] = { ...local.drivers[idx], ...updatedDriver };
          await writeLocalData(local);
          res.json(local.drivers[idx]);
        } else {
          res.status(404).json({ error: "Driver not found" });
        }
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/drivers/:id", async (req, res) => {
    const id = req.params.id;
    try {
      if (isSqlConfigured) {
        await db.delete(schema.drivers).where(eq(schema.drivers.id, id));
      } else {
        const local = await readLocalData();
        local.drivers = local.drivers.filter((d: any) => d.id !== id);
        await writeLocalData(local);
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // TRIPS
  app.post("/api/trips", async (req, res) => {
    const t = req.body;
    try {
      const newTrip = {
        id: t.id,
        source: t.source,
        destination: t.destination,
        cargoWeight: Number(t.cargoWeight || 0),
        plannedDistance: Number(t.plannedDistance || 0),
        vehicleReg: t.vehicleReg,
        driverId: t.driverId,
        status: t.status,
        eta: t.eta,
      };
      if (isSqlConfigured) {
        await db.insert(schema.trips).values(newTrip);
      } else {
        const local = await readLocalData();
        local.trips.push(newTrip);
        await writeLocalData(local);
      }
      res.status(201).json(newTrip);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/trips/:id", async (req, res) => {
    const id = req.params.id;
    const t = req.body;
    try {
      const updatedTrip: any = {};
      if (t.source !== undefined) updatedTrip.source = t.source;
      if (t.destination !== undefined) updatedTrip.destination = t.destination;
      if (t.cargoWeight !== undefined) updatedTrip.cargoWeight = Number(t.cargoWeight || 0);
      if (t.plannedDistance !== undefined) updatedTrip.plannedDistance = Number(t.plannedDistance || 0);
      if (t.vehicleReg !== undefined) updatedTrip.vehicleReg = t.vehicleReg;
      if (t.driverId !== undefined) updatedTrip.driverId = t.driverId;
      if (t.status !== undefined) updatedTrip.status = t.status;
      if (t.eta !== undefined) updatedTrip.eta = t.eta;

      if (isSqlConfigured) {
        await db.update(schema.trips).set(updatedTrip).where(eq(schema.trips.id, id));
        const [resTrip] = await db.select().from(schema.trips).where(eq(schema.trips.id, id)).limit(1);
        res.json(resTrip);
      } else {
        const local = await readLocalData();
        const idx = local.trips.findIndex((trp: any) => trp.id === id);
        if (idx !== -1) {
          local.trips[idx] = { ...local.trips[idx], ...updatedTrip };
          await writeLocalData(local);
          res.json(local.trips[idx]);
        } else {
          res.status(404).json({ error: "Trip not found" });
        }
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // MAINTENANCE
  app.post("/api/maintenance", async (req, res) => {
    const m = req.body;
    try {
      const newLog = {
        id: m.id,
        vehicleReg: m.vehicleReg,
        serviceType: m.serviceType,
        date: m.date,
        cost: Number(m.cost || 0),
        status: m.status,
      };
      if (isSqlConfigured) {
        await db.insert(schema.maintenance).values(newLog);
      } else {
        const local = await readLocalData();
        if (!local.maintenance) local.maintenance = [];
        local.maintenance.push(newLog);
        await writeLocalData(local);
      }
      res.status(201).json(newLog);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/maintenance/:id", async (req, res) => {
    const id = req.params.id;
    const m = req.body;
    try {
      const updatedLog: any = {};
      if (m.vehicleReg !== undefined) updatedLog.vehicleReg = m.vehicleReg;
      if (m.serviceType !== undefined) updatedLog.serviceType = m.serviceType;
      if (m.date !== undefined) updatedLog.date = m.date;
      if (m.cost !== undefined) updatedLog.cost = Number(m.cost || 0);
      if (m.status !== undefined) updatedLog.status = m.status;

      if (isSqlConfigured) {
        await db.update(schema.maintenance).set(updatedLog).where(eq(schema.maintenance.id, id));
        const [resLog] = await db.select().from(schema.maintenance).where(eq(schema.maintenance.id, id)).limit(1);
        res.json(resLog);
      } else {
        const local = await readLocalData();
        if (!local.maintenance) local.maintenance = [];
        const idx = local.maintenance.findIndex((log: any) => log.id === id);
        if (idx !== -1) {
          local.maintenance[idx] = { ...local.maintenance[idx], ...updatedLog };
          await writeLocalData(local);
          res.json(local.maintenance[idx]);
        } else {
          res.status(404).json({ error: "Maintenance log not found" });
        }
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // FUEL
  app.post("/api/fuel", async (req, res) => {
    const f = req.body;
    try {
      const newFuel = {
        id: f.id,
        vehicleReg: f.vehicleReg,
        dateTime: f.dateTime,
        liters: Number(f.liters || 0),
        costPerLiter: Number(f.costPerLiter || 0),
        totalCost: Number(f.totalCost || 0),
      };
      if (isSqlConfigured) {
        await db.insert(schema.fuelLogs).values(newFuel);
      } else {
        const local = await readLocalData();
        local.fuelLogs.push(newFuel);
        await writeLocalData(local);
      }
      res.status(201).json(newFuel);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // EXPENSES
  app.post("/api/expenses", async (req, res) => {
    const e = req.body;
    try {
      const newExpense = {
        id: e.id,
        tripId: e.tripId,
        vehicleReg: e.vehicleReg,
        toll: Number(e.toll || 0),
        maintenance: Number(e.maintenance || 0),
        other: Number(e.other || 0),
        total: Number(e.total || 0),
        status: e.status,
      };
      if (isSqlConfigured) {
        await db.insert(schema.expenses).values(newExpense);
      } else {
        const local = await readLocalData();
        local.expenses.push(newExpense);
        await writeLocalData(local);
      }
      res.status(201).json(newExpense);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/expenses/:id", async (req, res) => {
    const id = req.params.id;
    const e = req.body;
    try {
      const updatedExpense: any = {};
      if (e.toll !== undefined) updatedExpense.toll = Number(e.toll || 0);
      if (e.maintenance !== undefined) updatedExpense.maintenance = Number(e.maintenance || 0);
      if (e.other !== undefined) updatedExpense.other = Number(e.other || 0);
      if (e.total !== undefined) updatedExpense.total = Number(e.total || 0);
      if (e.status !== undefined) updatedExpense.status = e.status;

      if (isSqlConfigured) {
        await db.update(schema.expenses).set(updatedExpense).where(eq(schema.expenses.id, id));
        const [resExpense] = await db.select().from(schema.expenses).where(eq(schema.expenses.id, id)).limit(1);
        res.json(resExpense);
      } else {
        const local = await readLocalData();
        const idx = local.expenses.findIndex((exp: any) => exp.id === id);
        if (idx !== -1) {
          local.expenses[idx] = { ...local.expenses[idx], ...updatedExpense };
          await writeLocalData(local);
          res.json(local.expenses[idx]);
        } else {
          res.status(404).json({ error: "Expense not found" });
        }
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // SYSTEM CONFIG
  app.put("/api/config", async (req, res) => {
    const configData = req.body;
    try {
      if (isSqlConfigured) {
        await db.delete(schema.config);
        await db.insert(schema.config).values({
          id: "system_config",
          depotName: configData.depotName || "Main Hub - Chicago",
          defaultCurrency: configData.defaultCurrency || "USD",
          distanceUnit: configData.distanceUnit || "miles",
          timezone: configData.timezone || "America/Chicago (CST)",
        });
        const [resConfig] = await db.select().from(schema.config).limit(1);
        res.json(resConfig);
      } else {
        const local = await readLocalData();
        local.config = { ...local.config, ...configData };
        await writeLocalData(local);
        res.json(local.config);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
