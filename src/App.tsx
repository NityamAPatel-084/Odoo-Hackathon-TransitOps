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

// Subcomponents
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import FleetRegistry from './components/FleetRegistry';
import DriversManagement from './components/DriversManagement';
import TripDispatch from './components/TripDispatch';
import MaintenanceOps from './components/MaintenanceOps';
import FuelExpenses from './components/FuelExpenses';
import AnalyticsReports from './components/AnalyticsReports';
import SettingsPanel from './components/SettingsPanel';

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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    depotName: 'Main Depot',
    defaultCurrency: 'USD',
    distanceUnit: 'miles',
    timezone: 'UTC',
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([
    'System Diagnostic: Sarah Williams\'s license has expired. Action Required.',
    'Terminal Alert: TRK-8812 is currently scheduled for transmission service.',
    'Fuel Warning: Fleet average fuel rate has increased by 4% this month.',
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // --- Fetch Initial Data from Server ---
  useEffect(() => {
    fetch('/api/data')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setVehicles(data.vehicles || []);
        setDrivers(data.drivers || []);
        setTrips(data.trips || []);
        setMaintenanceLogs(data.maintenanceLogs || []);
        setFuelLogs(data.fuelLogs || []);
        setExpenses(data.expenses || []);
        if (data.systemConfig) {
          setSystemConfig(data.systemConfig);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load initial database state:', err);
        setLoading(false);
      });
  }, []);

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
  const handleAddVehicle = async (newVehicle: Vehicle): Promise<boolean> => {
    const exists = vehicles.some(
      (v) => v.registrationNumber.toUpperCase() === newVehicle.registrationNumber.toUpperCase()
    );
    if (exists) return false;

    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicle),
      });
      if (!res.ok) throw new Error('Failed to create vehicle');
      const savedVehicle = await res.json();
      setVehicles([savedVehicle, ...vehicles]);
      setNotifications((prev) => [`Asset Registered: Deployed ${newVehicle.registrationNumber} to current fleet.`, ...prev]);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleUpdateVehicle = async (updated: Vehicle) => {
    try {
      const res = await fetch(`/api/vehicles/${updated.registrationNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Failed to update vehicle');
      const saved = await res.json();
      setVehicles(vehicles.map((v) => (v.registrationNumber === saved.registrationNumber ? saved : v)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVehicle = async (regNum: string) => {
    try {
      const res = await fetch(`/api/vehicles/${regNum}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete vehicle');
      setVehicles(vehicles.filter((v) => v.registrationNumber !== regNum));
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Add Driver
  const handleAddDriver = async (newDriver: Driver) => {
    try {
      const res = await fetch('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDriver),
      });
      if (!res.ok) throw new Error('Failed to add driver');
      const saved = await res.json();
      setDrivers([saved, ...drivers]);
      setNotifications((prev) => [`Operator Registered: Added ${newDriver.name} (${newDriver.id}) to logs.`, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateDriver = async (updated: Driver) => {
    try {
      const res = await fetch(`/api/drivers/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Failed to update driver');
      const saved = await res.json();
      setDrivers(drivers.map((d) => (d.id === saved.id ? saved : d)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDriver = async (id: string) => {
    try {
      const res = await fetch(`/api/drivers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete driver');
      setDrivers(drivers.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Dispatch & Update Trip (Rules 4, 5, 6, 7, 8)
  const handleAddTrip = async (newTrip: Trip) => {
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrip),
      });
      if (!res.ok) throw new Error('Failed to add trip');
      const savedTrip = await res.json();
      setTrips([savedTrip, ...trips]);

      // Rule 6: Dispatching a trip automatically changes both the vehicle and driver status to On Trip.
      if (newTrip.status === TripStatus.DISPATCHED) {
        const vehicleRes = await fetch(`/api/vehicles/${newTrip.vehicleReg}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: VehicleStatus.ON_TRIP }),
        });
        const driverRes = await fetch(`/api/drivers/${newTrip.driverId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: DriverStatus.ON_TRIP }),
        });
        if (vehicleRes.ok) {
          const updatedVeh = await vehicleRes.json();
          setVehicles(prevVehicles => prevVehicles.map(v => v.registrationNumber === updatedVeh.registrationNumber ? updatedVeh : v));
        }
        if (driverRes.ok) {
          const updatedDrv = await driverRes.json();
          setDrivers(prevDrivers => prevDrivers.map(d => d.id === updatedDrv.id ? updatedDrv : d));
        }
      }

      setNotifications((prev) => [`Transit Dispatched: ${newTrip.id} on route to ${newTrip.destination}.`, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTripStatus = async (
    tripId: string,
    newStatus: TripStatus,
    finalOdo?: number,
    fuelConsumedVal?: number
  ) => {
    const targetTrip = trips.find((t) => t.id === tripId);
    if (!targetTrip) return;

    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          finalOdometer: finalOdo,
          fuelConsumed: fuelConsumedVal,
        }),
      });
      if (!res.ok) throw new Error('Failed to update trip');
      const savedTrip = await res.json();
      setTrips(trips.map((t) => (t.id === tripId ? savedTrip : t)));

      // Dynamic State transition releases
      if (newStatus === TripStatus.COMPLETED) {
        // Rule 7: Completing a trip automatically changes both the vehicle and driver status back to Available.
        const currentVeh = vehicles.find(v => v.registrationNumber === targetTrip.vehicleReg);
        const vehicleStatusRes = await fetch(`/api/vehicles/${targetTrip.vehicleReg}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: VehicleStatus.AVAILABLE,
            odometer: finalOdo || (currentVeh?.odometer || 0) + targetTrip.plannedDistance
          }),
        });
        const driverStatusRes = await fetch(`/api/drivers/${targetTrip.driverId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: DriverStatus.AVAILABLE }),
        });
        
        if (vehicleStatusRes.ok) {
          const updatedVeh = await vehicleStatusRes.json();
          setVehicles(prev => prev.map(v => v.registrationNumber === updatedVeh.registrationNumber ? updatedVeh : v));
        }
        if (driverStatusRes.ok) {
          const updatedDrv = await driverStatusRes.json();
          setDrivers(prev => prev.map(d => d.id === updatedDrv.id ? updatedDrv : d));
        }

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
        const expenseRes = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExpenseEntry),
        });
        if (expenseRes.ok) {
          const savedExp = await expenseRes.json();
          setExpenses((prev) => [savedExp, ...prev]);
        }

        setNotifications((prev) => [
          `Route Completed: ${targetTrip.id} successfully docked at ${targetTrip.destination}.`,
          ...prev,
        ]);
      } else if (newStatus === TripStatus.CANCELLED) {
        // Rule 8: Cancelling a dispatched trip restores the vehicle and driver to Available.
        const vehicleStatusRes = await fetch(`/api/vehicles/${targetTrip.vehicleReg}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: VehicleStatus.AVAILABLE }),
        });
        const driverStatusRes = await fetch(`/api/drivers/${targetTrip.driverId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: DriverStatus.AVAILABLE }),
        });
        if (vehicleStatusRes.ok) {
          const updatedVeh = await vehicleStatusRes.json();
          setVehicles(prev => prev.map(v => v.registrationNumber === updatedVeh.registrationNumber ? updatedVeh : v));
        }
        if (driverStatusRes.ok) {
          const updatedDrv = await driverStatusRes.json();
          setDrivers(prev => prev.map(d => d.id === updatedDrv.id ? updatedDrv : d));
        }
        setNotifications((prev) => [`Dispatch Cancelled: ${targetTrip.id} route terminated. Assets reclaimed.`, ...prev]);
      } else if (newStatus === TripStatus.DISPATCHED && targetTrip.status === TripStatus.DRAFT) {
        // Dispatch draft
        const vehicleStatusRes = await fetch(`/api/vehicles/${targetTrip.vehicleReg}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: VehicleStatus.ON_TRIP }),
        });
        const driverStatusRes = await fetch(`/api/drivers/${targetTrip.driverId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: DriverStatus.ON_TRIP }),
        });
        if (vehicleStatusRes.ok) {
          const updatedVeh = await vehicleStatusRes.json();
          setVehicles(prev => prev.map(v => v.registrationNumber === updatedVeh.registrationNumber ? updatedVeh : v));
        }
        if (driverStatusRes.ok) {
          const updatedDrv = await driverStatusRes.json();
          setDrivers(prev => prev.map(d => d.id === updatedDrv.id ? updatedDrv : d));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Maintenance (Rule 9: Active maintenance automatically shifts vehicle status to In Shop)
  const handleAddMaintenanceLog = async (newLog: MaintenanceLog) => {
    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog),
      });
      if (!res.ok) throw new Error('Failed to add maintenance log');
      const savedLog = await res.json();
      setMaintenanceLogs([savedLog, ...maintenanceLogs]);

      if (newLog.status === MaintenanceStatus.IN_SHOP) {
        const vehRes = await fetch(`/api/vehicles/${newLog.vehicleReg}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: VehicleStatus.IN_SHOP }),
        });
        if (vehRes.ok) {
          const updatedVeh = await vehRes.json();
          setVehicles((prev) => prev.map((v) => (v.registrationNumber === updatedVeh.registrationNumber ? updatedVeh : v)));
        }
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
        const expRes = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(maintenanceExp),
        });
        if (expRes.ok) {
          const savedExp = await expRes.json();
          setExpenses((prev) => [savedExp, ...prev]);
        }
      }

      setNotifications((prev) => [`Service Issued: ${newLog.vehicleReg} checked into service bay.`, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteMaintenanceLog = async (logId: string) => {
    const targetLog = maintenanceLogs.find((l) => l.id === logId);
    if (!targetLog) return;

    try {
      const res = await fetch(`/api/maintenance/${logId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: MaintenanceStatus.COMPLETED }),
      });
      if (!res.ok) throw new Error('Failed to update maintenance log');
      const savedLog = await res.json();
      setMaintenanceLogs(maintenanceLogs.map((l) => (l.id === logId ? savedLog : l)));

      // Rule 10: Closing maintenance restores the vehicle to Available (unless retired).
      const currentVeh = vehicles.find(v => v.registrationNumber === targetLog.vehicleReg);
      const vehRes = await fetch(`/api/vehicles/${targetLog.vehicleReg}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: currentVeh?.status === VehicleStatus.RETIRED ? VehicleStatus.RETIRED : VehicleStatus.AVAILABLE
        }),
      });
      if (vehRes.ok) {
        const updatedVeh = await vehRes.json();
        setVehicles((prev) => prev.map((v) => (v.registrationNumber === updatedVeh.registrationNumber ? updatedVeh : v)));
      }

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
      const expRes = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maintenanceExp),
      });
      if (expRes.ok) {
        const savedExp = await expRes.json();
        setExpenses((prev) => [savedExp, ...prev]);
      }

      setNotifications((prev) => [`Service Completed: Released ${targetLog.vehicleReg} back to dispatch pool.`, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Fuel & Expenses
  const handleAddFuelLog = async (newLog: FuelLog) => {
    try {
      const res = await fetch('/api/fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog),
      });
      if (!res.ok) throw new Error('Failed to add fuel log');
      const savedLog = await res.json();
      setFuelLogs([savedLog, ...fuelLogs]);
      setNotifications((prev) => [`Fuel Registered: Logged ${newLog.liters} L for ${newLog.vehicleReg}.`, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExpense = async (newExp: Expense) => {
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExp),
      });
      if (!res.ok) throw new Error('Failed to add expense');
      const saved = await res.json();
      setExpenses([saved, ...expenses]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateExpenseStatus = async (expId: string, status: 'APPROVED' | 'PENDING' | 'FLAGGED') => {
    try {
      const res = await fetch(`/api/expenses/${expId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update expense');
      const saved = await res.json();
      setExpenses(expenses.map((e) => (e.id === expId ? saved : e)));
      setNotifications((prev) => [`Expense Audited: ${expId} marked as ${status}.`, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveConfig = async (newConfig: SystemConfig) => {
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      if (!res.ok) throw new Error('Failed to save config');
      const saved = await res.json();
      setSystemConfig(saved);
      setNotifications((prev) => [`System Settings: Depot configurations updated successfully.`, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Loading Spinner ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center flex-col text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d97707] mb-4"></div>
        <p className="text-[#dbc2b0] font-medium">Loading TransitOps Platform...</p>
      </div>
    );
  }

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
                </button>
              );
            })}
          </nav>
        </div>

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
          </button>
        </div>
      </aside>

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

      </div>

    </div>
  );
}
