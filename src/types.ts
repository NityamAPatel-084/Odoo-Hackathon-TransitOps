/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  FLEET_MANAGER = 'Fleet Manager',
  DISPATCHER = 'Dispatcher',
  SAFETY_OFFICER = 'Safety Officer',
  FINANCIAL_ANALYST = 'Financial Analyst',
}

/** Represents the current operational state of a vehicle in the fleet */
export enum VehicleStatus {
  AVAILABLE = 'Available',
  ON_TRIP = 'On Trip',
  IN_SHOP = 'In Shop',
  RETIRED = 'Retired',
}

/** Represents the availability and current assignment of a driver */
export enum DriverStatus {
  AVAILABLE = 'Available',
  ON_TRIP = 'On Trip',
  OFF_DUTY = 'Off Duty',
  SUSPENDED = 'Suspended',
}

/** Represents the lifecycle phase of a dispatched trip */
export enum TripStatus {
  DRAFT = 'Draft',
  DISPATCHED = 'Dispatched',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum MaintenanceStatus {
  IN_SHOP = 'In Shop',
  COMPLETED = 'Completed',
}

export interface Vehicle {
  registrationNumber: string;
  name: string;
  model: string;
  type: string;
  maxLoadCapacity: number; // in kg
  odometer: number; // in miles/km
  acquisitionCost: number;
  status: VehicleStatus;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string; // YYYY-MM-DD
  contactNumber: string;
  safetyScore: number; // 0-100
  status: DriverStatus;
  tripCompletionRate: number; // e.g., 95
}

export interface Trip {
  id: string;
  source: string;
  destination: string;
  vehicleReg: string;
  driverId: string;
  cargoWeight: number; // in kg
  plannedDistance: number; // in miles/km
  status: TripStatus;
  eta: string; // e.g., "14:30" or "--"
  finalOdometer?: number;
  fuelConsumed?: number; // in liters
}

export interface MaintenanceLog {
  id: string;
  vehicleReg: string;
  serviceType: string;
  date: string;
  cost: number;
  status: MaintenanceStatus;
}

export interface FuelLog {
  id: string;
  vehicleReg: string;
  dateTime: string;
  liters: number;
  costPerLiter: number;
  totalCost: number;
}

export interface Expense {
  id: string;
  tripId: string;
  vehicleReg: string;
  toll: number;
  maintenance: number;
  other: number;
  total: number;
  status: 'APPROVED' | 'PENDING' | 'FLAGGED';
}

export interface SystemConfig {
  depotName: string;
  defaultCurrency: string;
  distanceUnit: 'miles' | 'kilometers';
  timezone: string;
}
