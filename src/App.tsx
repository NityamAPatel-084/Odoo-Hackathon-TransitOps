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
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import FleetRegistry from './components/FleetRegistry';
import DriversManagement from './components/DriversManagement';
import TripDispatch from './components/TripDispatch';
import MaintenanceOps from './components/MaintenanceOps';
import FuelExpenses from './components/FuelExpenses';
import AnalyticsReports from './components/AnalyticsReports';
import SettingsPanel from './components/SettingsPanel';

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
                </button>
              );
            })}
          </nav>
        </div>

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
          </button>
        </div>
      </aside>

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

      </div>

    </div>
  );
};
export default App;
