<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserRole,
  Vehicle,
  VehicleStatus,
  Driver,
  DriverStatus,
  Trip,
  TripStatus,
  MaintenanceLog,
  MaintenanceStatus,
  FuelLog,
  Expense,
  SystemConfig,
} from './types';
import {
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_TRIPS,
  INITIAL_MAINTENANCE,
  INITIAL_FUEL_LOGS,
  INITIAL_EXPENSES,
  INITIAL_CONFIG,
} from './data/initialData';

// Subcomponents
=======
import React, { useState } from 'react';
import { 
  Vehicle, 
  Driver, 
  Trip, 
  MaintenanceLog, 
  FuelLog, 
  SystemConfig, 
  VehicleStatus, 
  DriverStatus, 
  TripStatus, 
  MaintenanceStatus 
} from './types';
import { 
  INITIAL_VEHICLES, 
  INITIAL_DRIVERS, 
  INITIAL_TRIPS, 
  INITIAL_MAINTENANCE, 
  INITIAL_FUEL_LOGS, 
  INITIAL_CONFIG 
} from './data/initialData';

// Import our beautiful modular components
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import FleetRegistry from './components/FleetRegistry';
import DriversManagement from './components/DriversManagement';
import TripDispatch from './components/TripDispatch';
import MaintenanceOps from './components/MaintenanceOps';
import FuelExpenses from './components/FuelExpenses';
import AnalyticsReports from './components/AnalyticsReports';
import SettingsPanel from './components/SettingsPanel';

<<<<<<< HEAD
// Icons
import {
  LayoutDashboard,
  Truck,
  Users,
  Navigation,
  Wrench,
  Fuel,
  LineChart,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  AlertTriangle,
  User,
  ShieldAlert,
  Info
} from 'lucide-react';

export default function App() {
  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('transitops_user');
  });
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const role = localStorage.getItem('transitops_role');
    return (role as UserRole) || UserRole.DISPATCHER;
  });

  // --- Core Fleet State ---
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('transitops_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('transitops_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('transitops_trips');
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(() => {
    const saved = localStorage.getItem('transitops_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => {
    const saved = localStorage.getItem('transitops_fuel');
    return saved ? JSON.parse(saved) : INITIAL_FUEL_LOGS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('transitops_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem('transitops_config');
    return saved ? JSON.parse(saved) : INITIAL_CONFIG;
  });

  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([
    'System Diagnostic: Sarah Williams\'s license has expired. Action Required.',
    'Terminal Alert: TRK-8812 is currently scheduled for transmission service.',
    'Fuel Warning: Fleet average fuel rate has increased by 4% this month.',
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // --- Persistence Sync ---
  useEffect(() => {
    localStorage.setItem('transitops_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('transitops_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('transitops_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('transitops_maintenance', JSON.stringify(maintenanceLogs));
  }, [maintenanceLogs]);

  useEffect(() => {
    localStorage.setItem('transitops_fuel', JSON.stringify(fuelLogs));
  }, [fuelLogs]);

  useEffect(() => {
    localStorage.setItem('transitops_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('transitops_config', JSON.stringify(systemConfig));
  }, [systemConfig]);

  // --- Auth Handlers ---
  const handleLogin = (email: string, role: UserRole) => {
    setCurrentUser(email);
    setUserRole(role);
    localStorage.setItem('transitops_user', email);
    localStorage.setItem('transitops_role', role);
    setActiveTab('Dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('transitops_user');
    localStorage.removeItem('transitops_role');
  };

  // --- Business Rule Handlers ---

  // 1. Add Vehicle (Reg No. must be unique!)
  const handleAddVehicle = (newVehicle: Vehicle): boolean => {
    const exists = vehicles.some(
      (v) => v.registrationNumber.toUpperCase() === newVehicle.registrationNumber.toUpperCase()
    );
    if (exists) return false;

    setVehicles([newVehicle, ...vehicles]);
    setNotifications((prev) => [`Asset Registered: Deployed ${newVehicle.registrationNumber} to current fleet.`, ...prev]);
    return true;
  };

  const handleUpdateVehicle = (updated: Vehicle) => {
    setVehicles(vehicles.map((v) => (v.registrationNumber === updated.registrationNumber ? updated : v)));
  };

  const handleDeleteVehicle = (regNum: string) => {
    setVehicles(vehicles.filter((v) => v.registrationNumber !== regNum));
  };

  // 2. Add Driver
  const handleAddDriver = (newDriver: Driver) => {
    setDrivers([newDriver, ...drivers]);
    setNotifications((prev) => [`Operator Registered: Added ${newDriver.name} (${newDriver.id}) to logs.`, ...prev]);
  };

  const handleUpdateDriver = (updated: Driver) => {
    setDrivers(drivers.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleDeleteDriver = (id: string) => {
    setDrivers(drivers.filter((d) => d.id !== id));
  };

  // 3. Dispatch & Update Trip (Rules 4, 5, 6, 7, 8)
  const handleAddTrip = (newTrip: Trip) => {
    setTrips([newTrip, ...trips]);

    // Rule 6: Dispatching a trip automatically changes both the vehicle and driver status to On Trip.
    if (newTrip.status === TripStatus.DISPATCHED) {
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) =>
          v.registrationNumber === newTrip.vehicleReg ? { ...v, status: VehicleStatus.ON_TRIP } : v
        )
      );
      setDrivers((prevDrivers) =>
        prevDrivers.map((d) =>
          d.id === newTrip.driverId ? { ...d, status: DriverStatus.ON_TRIP } : d
        )
      );
    }

    setNotifications((prev) => [`Transit Dispatched: ${newTrip.id} on route to ${newTrip.destination}.`, ...prev]);
  };

  const handleUpdateTripStatus = (
    tripId: string,
    newStatus: TripStatus,
    finalOdo?: number,
    fuelConsumedVal?: number
  ) => {
    const targetTrip = trips.find((t) => t.id === tripId);
    if (!targetTrip) return;

    setTrips(
      trips.map((t) => {
        if (t.id === tripId) {
          return {
            ...t,
            status: newStatus,
            finalOdometer: finalOdo,
            fuelConsumed: fuelConsumedVal,
          };
        }
        return t;
      })
    );

    // Dynamic State transition releases
    if (newStatus === TripStatus.COMPLETED) {
      // Rule 7: Completing a trip automatically changes both the vehicle and driver status back to Available.
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => {
          if (v.registrationNumber === targetTrip.vehicleReg) {
            return {
              ...v,
              status: VehicleStatus.AVAILABLE,
              odometer: finalOdo || v.odometer + targetTrip.plannedDistance,
            };
          }
          return v;
        })
      );
      setDrivers((prevDrivers) =>
        prevDrivers.map((d) =>
          d.id === targetTrip.driverId ? { ...d, status: DriverStatus.AVAILABLE } : d
        )
      );

      // Create simulated expense audit entry dynamically!
      const totalToll = Math.round(targetTrip.plannedDistance * 0.15);
      const newExpenseEntry: Expense = {
        id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
        tripId: targetTrip.id,
        vehicleReg: targetTrip.vehicleReg,
        toll: totalToll,
        maintenance: 0,
        other: 0,
        total: totalToll,
        status: 'PENDING',
      };
      setExpenses((prev) => [newExpenseEntry, ...prev]);

      setNotifications((prev) => [
        `Route Completed: ${targetTrip.id} successfully docked at ${targetTrip.destination}.`,
        ...prev,
      ]);
    } else if (newStatus === TripStatus.CANCELLED) {
      // Rule 8: Cancelling a dispatched trip restores the vehicle and driver to Available.
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) =>
          v.registrationNumber === targetTrip.vehicleReg ? { ...v, status: VehicleStatus.AVAILABLE } : v
        )
      );
      setDrivers((prevDrivers) =>
        prevDrivers.map((d) =>
          d.id === targetTrip.driverId ? { ...d, status: DriverStatus.AVAILABLE } : d
        )
      );
      setNotifications((prev) => [`Dispatch Cancelled: ${targetTrip.id} route terminated. Assets reclaimed.`, ...prev]);
    } else if (newStatus === TripStatus.DISPATCHED && targetTrip.status === TripStatus.DRAFT) {
      // Dispatch draft
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) =>
          v.registrationNumber === targetTrip.vehicleReg ? { ...v, status: VehicleStatus.ON_TRIP } : v
        )
      );
      setDrivers((prevDrivers) =>
        prevDrivers.map((d) =>
          d.id === targetTrip.driverId ? { ...d, status: DriverStatus.ON_TRIP } : d
        )
      );
    }
  };

  // 4. Maintenance (Rule 9: Active maintenance automatically shifts vehicle status to In Shop)
  const handleAddMaintenanceLog = (newLog: MaintenanceLog) => {
    setMaintenanceLogs([newLog, ...maintenanceLogs]);

    if (newLog.status === MaintenanceStatus.IN_SHOP) {
      setVehicles((prev) =>
        prev.map((v) => (v.registrationNumber === newLog.vehicleReg ? { ...v, status: VehicleStatus.IN_SHOP } : v))
      );
    }

    // Auto log expense if completed instantly
    if (newLog.status === MaintenanceStatus.COMPLETED) {
      const maintenanceExp: Expense = {
        id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
        tripId: 'SHOP-REP',
        vehicleReg: newLog.vehicleReg,
        toll: 0,
        maintenance: newLog.cost,
        other: 0,
        total: newLog.cost,
        status: 'APPROVED',
      };
      setExpenses((prev) => [maintenanceExp, ...prev]);
    }

    setNotifications((prev) => [`Service Issued: ${newLog.vehicleReg} checked into service bay.`, ...prev]);
  };

  const handleCompleteMaintenanceLog = (logId: string) => {
    const targetLog = maintenanceLogs.find((l) => l.id === logId);
    if (!targetLog) return;

    setMaintenanceLogs(
      maintenanceLogs.map((l) => (l.id === logId ? { ...l, status: MaintenanceStatus.COMPLETED } : l))
    );

    // Rule 10: Closing maintenance restores the vehicle to Available (unless retired).
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.registrationNumber === targetLog.vehicleReg) {
          return {
            ...v,
            status: v.status === VehicleStatus.RETIRED ? VehicleStatus.RETIRED : VehicleStatus.AVAILABLE,
          };
        }
        return v;
      })
    );

    // Auto log expense for closed maintenance
    const maintenanceExp: Expense = {
      id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      tripId: 'SHOP-REP',
      vehicleReg: targetLog.vehicleReg,
      toll: 0,
      maintenance: targetLog.cost,
      other: 0,
      total: targetLog.cost,
      status: 'APPROVED',
    };
    setExpenses((prev) => [maintenanceExp, ...prev]);

    setNotifications((prev) => [`Service Completed: Released ${targetLog.vehicleReg} back to dispatch pool.`, ...prev]);
  };

  // 5. Fuel & Expenses
  const handleAddFuelLog = (newLog: FuelLog) => {
    setFuelLogs([newLog, ...fuelLogs]);
    setNotifications((prev) => [`Fuel Registered: Logged ${newLog.liters} L for ${newLog.vehicleReg}.`, ...prev]);
  };

  const handleAddExpense = (newExp: Expense) => {
    setExpenses([newExp, ...expenses]);
  };

  const handleUpdateExpenseStatus = (expId: string, status: 'APPROVED' | 'PENDING' | 'FLAGGED') => {
    setExpenses(expenses.map((e) => (e.id === expId ? { ...e, status } : e)));
    setNotifications((prev) => [`Expense Audited: ${expId} marked as ${status}.`, ...prev]);
  };

  const handleSaveConfig = (newConfig: SystemConfig) => {
    setSystemConfig(newConfig);
    setNotifications((prev) => [`System Settings: Depot configurations updated successfully.`, ...prev]);
  };

  // --- Auth Render Router ---
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // --- Navigation Mapping ---
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <Dashboard
            vehicles={vehicles}
            drivers={drivers}
            trips={trips}
            onNavigateToTab={setActiveTab}
          />
        );
      case 'Fleet':
        return (
          <FleetRegistry
            vehicles={vehicles}
            userRole={userRole}
            onAddVehicle={handleAddVehicle}
            onUpdateVehicle={handleUpdateVehicle}
            onDeleteVehicle={handleDeleteVehicle}
          />
        );
      case 'Drivers':
        return (
          <DriversManagement
            drivers={drivers}
            userRole={userRole}
            onAddDriver={handleAddDriver}
            onUpdateDriver={handleUpdateDriver}
            onDeleteDriver={handleDeleteDriver}
          />
        );
      case 'Trips':
        return (
          <TripDispatch
            trips={trips}
            vehicles={vehicles}
            drivers={drivers}
            userRole={userRole}
            onAddTrip={handleAddTrip}
            onUpdateTripStatus={handleUpdateTripStatus}
          />
        );
      case 'Maintenance':
        return (
          <MaintenanceOps
            logs={maintenanceLogs}
            vehicles={vehicles}
            userRole={userRole}
            onAddLog={handleAddMaintenanceLog}
            onCompleteLog={handleCompleteMaintenanceLog}
          />
        );
      case 'Fuel':
        return (
          <FuelExpenses
            fuelLogs={fuelLogs}
            expenses={expenses}
            vehicles={vehicles}
            userRole={userRole}
            onAddFuelLog={handleAddFuelLog}
            onAddExpense={handleAddExpense}
            onUpdateExpenseStatus={handleUpdateExpenseStatus}
          />
        );
      case 'Analytics':
        return (
          <AnalyticsReports
            vehicles={vehicles}
            trips={trips}
            fuelLogs={fuelLogs}
            expenses={expenses}
            maintenanceLogs={maintenanceLogs}
          />
        );
      case 'Settings':
        return (
          <SettingsPanel
            config={systemConfig}
            userRole={userRole}
            onSaveConfig={handleSaveConfig}
          />
        );
      default:
        return <div className="text-white text-xs font-semibold">Unknown section protocol.</div>;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0D0F14] text-[#dbc2b0] font-sans antialiased">
      
      {/* 1. Left Sidebar Navigation Panel */}
      <aside className="w-64 bg-[#161A22] border-r border-[#2D3748] flex flex-col justify-between shrink-0 hidden md:flex">
        
        {/* Sidebar Brand Header */}
        <div>
          <div className="p-6 border-b border-[#2D3748] flex items-center gap-3">
            <div className="p-1.5 rounded bg-[#d97707]/10 border border-[#d97707]/30">
              <Truck className="h-6 w-6 text-[#ffb77d]" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">TransitOps</span>
              <span className="text-[10px] text-[#dbc2b0]/50 block uppercase tracking-wider font-semibold">Control Center</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'Dashboard', label: 'Overview', icon: LayoutDashboard },
              { id: 'Fleet', label: 'Vehicle Registry', icon: Truck },
              { id: 'Drivers', label: 'Driver Directory', icon: Users },
              { id: 'Trips', label: 'Dispatch Console', icon: Navigation },
              { id: 'Maintenance', label: 'Service Bay', icon: Wrench },
              { id: 'Fuel', label: 'Fuel & Expenses', icon: Fuel },
              { id: 'Analytics', label: 'Reports & Analytics', icon: LineChart },
              { id: 'Settings', label: 'System Settings', icon: Settings },
            ].map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-left transition-all ${
                    isActive
                      ? 'bg-[#d97707] text-black font-black shadow-[0_2px_10px_rgba(217,119,7,0.2)]'
                      : 'text-[#dbc2b0] hover:text-white hover:bg-[#1E293B]/60'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {link.label}
=======
// Icons for navigation
import { 
  Truck, 
  LayoutDashboard, 
  Users, 
  Send, 
  Wrench, 
  Coins, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const App: React.FC = () => {
  // 1. Core States
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [maintenance, setMaintenance] = useState<MaintenanceLog[]>(INITIAL_MAINTENANCE);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(INITIAL_FUEL_LOGS);
  const [config, setConfig] = useState<SystemConfig>(INITIAL_CONFIG);

  // 2. Auth States
  const [user, setUser] = useState<{ email: string; role: string } | null>(() => {
    // Optional preset
    return { email: 'dispatcher@transitops.com', role: 'dispatcher' };
  });

  // 3. Navigation States
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 4. Role Mapping helpers
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'dispatcher': return 'Dispatcher';
      case 'fleet_manager': return 'Fleet Manager';
      case 'safety_officer': return 'Safety Officer';
      case 'financial_analyst': return 'Financial Analyst';
      default: return role;
    }
  };

  // 5. State Mutator Callbacks
  const handleLogin = (email: string, role: string) => {
    setUser({ email, role });
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles(prev => [newVehicle, ...prev]);
  };

  const handleAddDriver = (newDriver: Driver) => {
    setDrivers(prev => [newDriver, ...prev]);
  };

  const handleExecuteDispatch = (newTrip: Trip) => {
    // 1. Add trip
    setTrips(prev => [newTrip, ...prev]);

    // 2. Set vehicle status to ON_TRIP
    setVehicles(prev => prev.map(v => 
      v.registrationNumber === newTrip.vehicleReg 
        ? { ...v, status: VehicleStatus.ON_TRIP } 
        : v
    ));

    // 3. Set driver status to ON_TRIP
    setDrivers(prev => prev.map(d => 
      d.id === newTrip.driverId 
        ? { ...d, status: DriverStatus.ON_TRIP } 
        : d
    ));
  };

  const handleCompleteTrip = (tripId: string) => {
    const tripToComplete = trips.find(t => t.id === tripId);
    if (!tripToComplete) return;

    // 1. Complete trip in status
    setTrips(prev => prev.map(t => 
      t.id === tripId 
        ? { ...t, status: TripStatus.COMPLETED, eta: '--' } 
        : t
    ));

    // 2. Release vehicle (AVAILABLE) and increment odometer by planned distance
    setVehicles(prev => prev.map(v => 
      v.registrationNumber === tripToComplete.vehicleReg 
        ? { 
            ...v, 
            status: VehicleStatus.AVAILABLE, 
            odometer: v.odometer + tripToComplete.plannedDistance 
          } 
        : v
    ));

    // 3. Release driver (AVAILABLE)
    setDrivers(prev => prev.map(d => 
      d.id === tripToComplete.driverId 
        ? { ...d, status: DriverStatus.AVAILABLE } 
        : d
    ));

    // 4. Optionally generate simulated fuel logs for completed trips
    const fuelLiters = Math.round(tripToComplete.plannedDistance * 0.45); // simulated fuel
    const costPerL = 1.84;
    const newFuel: FuelLog = {
      id: `FL-${Math.floor(100 + Math.random() * 900)}`,
      vehicleReg: tripToComplete.vehicleReg,
      dateTime: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      liters: fuelLiters,
      costPerLiter: costPerL,
      totalCost: fuelLiters * costPerL
    };
    setFuelLogs(prev => [newFuel, ...prev]);
  };

  const handleCancelTrip = (tripId: string) => {
    const tripToCancel = trips.find(t => t.id === tripId);
    if (!tripToCancel) return;

    // 1. Set trip status to CANCELLED
    setTrips(prev => prev.map(t => 
      t.id === tripId 
        ? { ...t, status: TripStatus.CANCELLED, eta: '--' } 
        : t
    ));

    // 2. Set vehicle status to AVAILABLE
    setVehicles(prev => prev.map(v => 
      v.registrationNumber === tripToCancel.vehicleReg 
        ? { ...v, status: VehicleStatus.AVAILABLE } 
        : v
    ));

    // 3. Set driver status to AVAILABLE
    setDrivers(prev => prev.map(d => 
      d.id === tripToCancel.driverId 
        ? { ...d, status: DriverStatus.AVAILABLE } 
        : d
    ));
  };

  const handleAddMaintenance = (newLog: MaintenanceLog) => {
    // 1. Add log
    setMaintenance(prev => [newLog, ...prev]);

    // 2. Set corresponding vehicle to IN_SHOP
    setVehicles(prev => prev.map(v => 
      v.registrationNumber === newLog.vehicleReg 
        ? { ...v, status: VehicleStatus.IN_SHOP } 
        : v
    ));
  };

  const handleResolveRepair = (logId: string) => {
    const logToResolve = maintenance.find(m => m.id === logId);
    if (!logToResolve) return;

    // 1. Complete repair status
    setMaintenance(prev => prev.map(m => 
      m.id === logId 
        ? { ...m, status: MaintenanceStatus.COMPLETED } 
        : m
    ));

    // 2. Release corresponding vehicle back to AVAILABLE
    setVehicles(prev => prev.map(v => 
      v.registrationNumber === logToResolve.vehicleReg 
        ? { ...v, status: VehicleStatus.AVAILABLE } 
        : v
    ));
  };

  const handleAddFuelLog = (newLog: FuelLog) => {
    setFuelLogs(prev => [newLog, ...prev]);
  };

  const handleUpdateConfig = (newConfig: SystemConfig) => {
    setConfig(newConfig);
  };

  // If not logged in, render LoginScreen
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Sidebar links schema
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Fleet Registry', icon: Truck },
    { id: 'drivers', label: 'Drivers Ledger', icon: Users },
    { id: 'trips', label: 'Dispatch Center', icon: Send },
    { id: 'maintenance', label: 'Maintenance Ops', icon: Wrench },
    { id: 'fuel', label: 'Fuel & Expenses', icon: Coins },
    { id: 'analytics', label: 'ROI Analytics', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'support', label: 'Support & Docs', icon: HelpCircle },
  ];

  return (
    <div id="app-container" className="h-screen w-full flex bg-[#150e0a] text-[#dbc2b0] overflow-hidden">
      
      {/* LEFT SIDEBAR - DESKTOP */}
      <aside className="hidden lg:flex w-64 bg-[#0e0906] border-r border-[#38251a] flex-col justify-between shrink-0 select-none">
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-[#38251a] flex items-center gap-3">
            <Truck className="h-6 w-6 text-[#d97707]" />
            <div>
              <span className="font-black text-white text-lg tracking-tight block">TransitOps</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#dbc2b0]/50 block">Operations v2</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-colors text-left cursor-pointer ${
                    isActive 
                      ? 'bg-[#d97707]/15 border-l-2 border-[#d97707] text-[#ffb77d]' 
                      : 'hover:bg-[#221610] text-[#dbc2b0]/85 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#ffb77d]' : 'text-[#dbc2b0]/55'}`} />
                  <span>{item.label}</span>
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
                </button>
              );
            })}
          </nav>
        </div>

<<<<<<< HEAD
        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-[#2D3748] space-y-4">
          <div className="bg-[#0D0F14]/50 p-3 rounded-lg border border-[#2D3748]/50 text-[11px] text-[#dbc2b0]/80">
            <p className="font-semibold text-white mb-0.5">Depot: {systemConfig.depotName}</p>
            <p className="text-[10px] text-[#dbc2b0]/50">{systemConfig.timezone}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout System
=======
        {/* User profile / bottom actions */}
        <div className="p-4 border-t border-[#38251a] bg-[#221610]/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#301f16] flex items-center justify-center border border-[#38251a] font-bold text-[#ffb77d] text-xs">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="font-bold text-white text-xs block truncate leading-tight">{user.email}</span>
              <span className="text-[9px] font-black text-[#ffb77d] uppercase tracking-wider block mt-0.5">{getRoleDisplayName(user.role)}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full bg-[#301f16] hover:bg-[#402b1f] border border-[#38251a] py-1.5 rounded text-[10px] font-bold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
          </button>
        </div>
      </aside>

<<<<<<< HEAD
      {/* 2. Main Terminal Content Container */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-[#161A22] border-b border-[#2D3748] flex items-center justify-between px-6 shrink-0 relative z-30 shadow-sm">
          
          {/* Section Title */}
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-[#ffb77d] md:hidden" />
            <h1 className="text-sm md:text-base font-bold text-white tracking-wide uppercase">
              Terminal: <span className="text-[#ffb77d]">{activeTab}</span>
            </h1>
          </div>

          {/* Quick Stats Banner (Horizontal scrollable ticker on small screens) */}
          <div className="hidden lg:flex items-center gap-5 text-[11px] text-[#dbc2b0]">
            <span>Active Runs: <strong className="text-white">{trips.filter(t => t.status === TripStatus.DISPATCHED).length}</strong></span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>Vehicles: <strong className="text-white">{vehicles.length}</strong></span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>Operators: <strong className="text-white">{drivers.length}</strong></span>
          </div>

          {/* User Profile & System Alerts triggers */}
          <div className="flex items-center gap-4 relative">
            
            {/* System Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-[#dbc2b0] hover:text-white hover:bg-[#1E293B] transition-colors relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-red-500 rounded-full animate-ping" />
                <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-red-500 rounded-full" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-80 bg-[#161A22] border border-[#2D3748] rounded-xl shadow-xl p-4 z-50 text-xs text-[#dbc2b0]"
                  >
                    <div className="flex justify-between items-center mb-3 border-b border-[#2D3748] pb-2">
                      <span className="font-bold text-white text-sm">Terminal Security Broadcasts</span>
                      <button 
                        onClick={() => setNotifications([])}
                        className="text-[10px] text-[#ffb77d] hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {notifications.map((notif, idx) => (
                        <div key={idx} className="flex gap-2 bg-[#0D0F14] p-2.5 rounded border border-[#2D3748]/50 items-start">
                          <Info className="h-3.5 w-3.5 text-[#ffb77d] shrink-0 mt-0.5" />
                          <p className="leading-relaxed">{notif}</p>
                        </div>
                      ))}
                      {notifications.length === 0 && (
                        <p className="text-center py-6 text-[#dbc2b0]/50 italic">No warnings or logs to report.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Vertical Split */}
            <div className="h-5 w-px bg-[#2D3748]" />

            {/* Profile Picker Dropdown (Allows changing roles instantly!) */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 py-1 px-2.5 rounded-lg border border-[#2D3748] bg-[#0D0F14]/40 hover:bg-[#1E293B] transition-colors cursor-pointer text-xs font-semibold text-white"
              >
                <div className="w-6 h-6 rounded-full bg-[#1A120B] border border-[#ffb77d]/30 flex items-center justify-center font-bold text-white text-[10px]">
                  {currentUser.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-white leading-tight">Terminal User</div>
                  <div className="text-[9px] text-[#dbc2b0]/70 font-bold uppercase tracking-wider">{userRole}</div>
                </div>
                <ChevronDown className="h-3 w-3 text-[#dbc2b0]" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-[#161A22] border border-[#2D3748] rounded-xl shadow-xl p-3 z-50 text-xs text-[#dbc2b0]"
                  >
                    <div className="p-2 border-b border-[#2D3748] mb-2">
                      <p className="font-bold text-white mb-0.5">Telematic SSO Identity</p>
                      <p className="text-[10px] text-[#dbc2b0]/50">{currentUser}</p>
                    </div>

                    {/* RBAC Role Swapper */}
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-[#dbc2b0]/70 uppercase tracking-wider px-2 py-1">Swap Role Matrix (Simulation)</p>
                      {Object.values(UserRole).map((role) => (
                        <button
                          key={role}
                          onClick={() => {
                            setUserRole(role);
                            localStorage.setItem('transitops_role', role);
                            setShowProfileMenu(false);
                            setNotifications((prev) => [`RBAC Simulation: Context swerved to ${role} matrix.`, ...prev]);
                          }}
                          className={`w-full text-left py-2 px-3 rounded hover:bg-[#1E293B]/60 transition-colors block text-[11px] font-semibold ${
                            userRole === role ? 'text-[#ffb77d] bg-[#0D0F14]/50' : 'text-[#dbc2b0]'
                          }`}
                        >
                          Context: {role}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-[#2D3748] mt-2.5 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left py-1.5 px-3 rounded text-red-400 hover:bg-red-500/10 transition-colors font-bold uppercase block text-[10px]"
                      >
                        Logout terminal
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* Small Screen Bottom Bar Menu (For responsiveness) */}
        <div className="md:hidden flex border-t border-[#2D3748] bg-[#161A22] fixed bottom-0 left-0 w-full z-40 overflow-x-auto shadow-lg select-none py-1 px-2 gap-1 scrollbar-none">
          {[
            { id: 'Dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'Fleet', label: 'Registry', icon: Truck },
            { id: 'Drivers', label: 'Drivers', icon: Users },
            { id: 'Trips', label: 'Dispatch', icon: Navigation },
            { id: 'Maintenance', label: 'Service', icon: Wrench },
            { id: 'Fuel', label: 'Financials', icon: Fuel },
          ].map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex-1 py-2 px-1.5 rounded flex flex-col items-center gap-1 min-w-[64px] text-center ${
                  isActive ? 'bg-[#d97707]/25 text-[#ffb77d] font-bold' : 'text-[#dbc2b0]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[9px] uppercase tracking-wider block font-bold">{link.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Warning Banner regarding Driver Compliance or Safety Block */}
        <div className="bg-[#1A120B] border-b border-[#554336] px-6 py-2 flex items-center justify-between text-[11px] text-[#dbc2b0]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#ffb77d] shrink-0" />
            <p>
              Compliance Notice: Under active safety protocols, driver <strong>Sarah Williams (DRV-002)</strong> is flagged as suspended.
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('Drivers')}
            className="text-[#ffb77d] font-bold hover:underline shrink-0 text-[10px] uppercase ml-4"
          >
            Review Compliances
          </button>
        </div>

        {/* Main Content Workspace Panel */}
        <main className="flex-grow overflow-y-auto p-6 pb-24 md:pb-6 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-7xl mx-auto"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>

=======
      {/* RIGHT CONTENT WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* TOP HEADER */}
        <header className="h-14 bg-[#0e0906] border-b border-[#38251a] flex items-center justify-between px-4 lg:px-6 shrink-0 select-none">
          <div className="flex items-center gap-3">
            {/* Mobile Toggle Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded hover:bg-[#221610] text-[#dbc2b0] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h2 className="font-extrabold text-white text-sm lg:text-base tracking-tight capitalize">
              {currentTab === 'support' ? 'Documentation Guide' : currentTab.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 text-[10px] text-[#dbc2b0]/50 font-semibold bg-[#221610] border border-[#38251a] px-2.5 py-1 rounded">
              <Calendar className="h-3.5 w-3.5 text-[#ffb77d]" />
              <span>Terminal: {config.depotName}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-[#150e0a]"></div>
              <span className="text-[10px] font-black tracking-wider text-emerald-400 uppercase">Live Node</span>
            </div>
          </div>
        </header>

        {/* MAIN WORKSPACE SCROLL CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#150e0a]">
          {currentTab === 'dashboard' && (
            <Dashboard 
              vehicles={vehicles} 
              drivers={drivers} 
              trips={trips} 
              maintenance={maintenance} 
              fuelLogs={fuelLogs} 
              onTabChange={setCurrentTab} 
            />
          )}

          {currentTab === 'vehicles' && (
            <FleetRegistry 
              vehicles={vehicles} 
              onAddVehicle={handleAddVehicle} 
            />
          )}

          {currentTab === 'drivers' && (
            <DriversManagement 
              drivers={drivers} 
              onAddDriver={handleAddDriver} 
            />
          )}

          {currentTab === 'trips' && (
            <TripDispatch 
              vehicles={vehicles} 
              drivers={drivers} 
              trips={trips} 
              onExecuteDispatch={handleExecuteDispatch} 
              onCompleteTrip={handleCompleteTrip} 
              onCancelTrip={handleCancelTrip} 
            />
          )}

          {currentTab === 'maintenance' && (
            <MaintenanceOps 
              vehicles={vehicles} 
              maintenance={maintenance} 
              onAddMaintenance={handleAddMaintenance} 
              onResolveRepair={handleResolveRepair} 
            />
          )}

          {currentTab === 'fuel' && (
            <FuelExpenses 
              vehicles={vehicles} 
              fuelLogs={fuelLogs} 
              onAddFuelLog={handleAddFuelLog} 
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsReports 
              vehicles={vehicles} 
              trips={trips} 
              maintenance={maintenance} 
              fuelLogs={fuelLogs} 
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPanel 
              config={config} 
              onUpdateConfig={handleUpdateConfig} 
            />
          )}

          {currentTab === 'support' && (
            <div className="space-y-6 max-w-4xl text-xs">
              <div className="bg-[#221610] border border-[#38251a] p-5 rounded space-y-4">
                <h4 className="font-bold text-sm text-white flex items-center gap-2 pb-1.5 border-b border-[#38251a]/60">
                  <HelpCircle className="h-4 w-4 text-[#d97707]" />
                  <span>TransitOps System Manual & Support Desk</span>
                </h4>
                <p className="leading-relaxed text-[#dbc2b0]/80">
                  Welcome to the TransitOps Operations Portal. This platform coordinates commercial logistics scheduling, licensing compliances, and active cost margins.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#150e0a] p-3 rounded border border-[#38251a] space-y-1.5">
                    <span className="font-bold text-white text-[11px] block">Role-Based Authorizations (RBAC)</span>
                    <ul className="space-y-1 text-[#dbc2b0]/65 list-disc pl-4 font-medium">
                      <li>Dispatcher: Initiate load dispatching.</li>
                      <li>Fleet Manager: Register assets & schedule PMs.</li>
                      <li>Safety Officer: Register CDL credentials.</li>
                      <li>Financial Analyst: Log fuel slips & review ROI.</li>
                    </ul>
                  </div>
                  <div className="bg-[#150e0a] p-3 rounded border border-[#38251a] space-y-1.5">
                    <span className="font-bold text-white text-[11px] block">Emergency Dispatches</span>
                    <p className="text-[#dbc2b0]/65 font-medium leading-normal">
                      For remote compliance assistance or network failures, coordinate with your regional logistics administrator or call the central Main Depot control board.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* MOBILE SIDEBAR DRAWEROVERLAY */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <div 
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#0e0906]/80 backdrop-blur-sm"
            ></div>

            {/* Sidebar drawer body */}
            <div className="relative flex flex-col w-64 bg-[#0e0906] border-r border-[#38251a] h-full z-50">
              <div className="p-6 border-b border-[#38251a] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className="h-6 w-6 text-[#d97707]" />
                  <span className="font-black text-white text-lg tracking-tight">TransitOps</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-[#dbc2b0]/60 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer navigation */}
              <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-colors text-left cursor-pointer ${
                        isActive 
                          ? 'bg-[#d97707]/15 border-l-2 border-[#d97707] text-[#ffb77d]' 
                          : 'hover:bg-[#221610] text-[#dbc2b0]/85 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-[#dbc2b0]/55" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Bottom drawer profile */}
              <div className="p-4 border-t border-[#38251a] bg-[#221610]/40 shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#301f16] flex items-center justify-center border border-[#38251a] font-bold text-[#ffb77d] text-xs">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-white text-xs block truncate leading-tight">{user.email}</span>
                    <span className="text-[9px] font-black text-[#ffb77d] uppercase tracking-wider block mt-0.5">{getRoleDisplayName(user.role)}</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full bg-[#301f16] hover:bg-[#402b1f] border border-[#38251a] py-1.5 rounded text-[10px] font-bold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
      </div>

    </div>
  );
<<<<<<< HEAD
}
=======
};
export default App;
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
