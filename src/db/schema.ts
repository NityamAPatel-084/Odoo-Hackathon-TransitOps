import { pgTable, text, integer, doublePrecision, boolean, timestamp } from "drizzle-orm/pg-core";

// 1. Vehicles Table
export const vehicles = pgTable("vehicles", {
  registrationNumber: text("registration_number").primaryKey(),
  name: text("name").notNull(),
  model: text("model").notNull(),
  type: text("type").notNull(),
  maxLoadCapacity: doublePrecision("max_load_capacity").notNull(),
  odometer: doublePrecision("odometer").notNull(),
  acquisitionCost: doublePrecision("acquisition_cost").notNull(),
  status: text("status").notNull(),
});

// 2. Drivers Table
export const drivers = pgTable("drivers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  licenseNumber: text("license_number").notNull(),
  licenseCategory: text("license_category").notNull(),
  licenseExpiryDate: text("license_expiry_date").notNull(),
  contactNumber: text("contact_number").notNull(),
  safetyScore: integer("safety_score").notNull(),
  status: text("status").notNull(),
  tripCompletionRate: integer("trip_completion_rate").notNull(),
});

// 3. Trips Table
export const trips = pgTable("trips", {
  id: text("id").primaryKey(),
  source: text("source").notNull(),
  destination: text("destination").notNull(),
  cargoWeight: doublePrecision("cargo_weight").notNull(),
  plannedDistance: doublePrecision("planned_distance").notNull(),
  vehicleReg: text("vehicle_reg").notNull(),
  driverId: text("driver_id").notNull(),
  status: text("status").notNull(),
  eta: text("eta").notNull(),
});

// 4. Maintenance Table
export const maintenance = pgTable("maintenance", {
  id: text("id").primaryKey(),
  vehicleReg: text("vehicle_reg").notNull(),
  serviceType: text("service_type").notNull(),
  date: text("date").notNull(),
  cost: doublePrecision("cost").notNull(),
  status: text("status").notNull(),
});

// 5. Fuel Logs Table
export const fuelLogs = pgTable("fuel_logs", {
  id: text("id").primaryKey(),
  vehicleReg: text("vehicle_reg").notNull(),
  dateTime: text("date_time").notNull(),
  liters: doublePrecision("liters").notNull(),
  costPerLiter: doublePrecision("cost_per_liter").notNull(),
  totalCost: doublePrecision("total_cost").notNull(),
});

// 6. Expenses Table
export const expenses = pgTable("expenses", {
  id: text("id").primaryKey(),
  tripId: text("trip_id").notNull(),
  vehicleReg: text("vehicle_reg").notNull(),
  toll: doublePrecision("toll").notNull(),
  maintenance: doublePrecision("maintenance").notNull(),
  other: doublePrecision("other").notNull(),
  total: doublePrecision("total").notNull(),
  status: text("status").notNull(),
});

// 7. Users Table
export const users = pgTable("users", {
  email: text("email").primaryKey(),
  role: text("role").notNull(),
  active: boolean("active").notNull().default(true),
  password: text("password").notNull(),
});

// 8. Configuration Table
export const config = pgTable("config", {
  id: text("id").primaryKey().default("system_config"),
  depotName: text("depot_name").notNull(),
  defaultCurrency: text("default_currency").notNull(),
  distanceUnit: text("distance_unit").notNull(),
  timezone: text("timezone").notNull(),
});
