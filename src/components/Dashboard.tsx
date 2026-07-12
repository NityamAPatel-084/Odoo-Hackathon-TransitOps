<<<<<<< HEAD
import React, { useState } from 'react';
import { Vehicle, Driver, Trip, VehicleStatus, DriverStatus, TripStatus } from '../types';
import { Truck, CheckCircle, Wrench, Navigation, Clock, Users, PieChart, ChevronRight } from 'lucide-react';
=======
import React from 'react';
import { 
  Vehicle, 
  Driver, 
  Trip, 
  MaintenanceLog, 
  FuelLog, 
  VehicleStatus, 
  TripStatus, 
  MaintenanceStatus 
} from '../types';
import { 
  Truck, 
  CheckCircle, 
  Send, 
  Wrench, 
  AlertTriangle, 
  AlertCircle, 
  Navigation, 
  NavigationOff, 
  Clock, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7

interface DashboardProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
<<<<<<< HEAD
  onNavigateToTab: (tab: string) => void;
}

export default function Dashboard({ vehicles, drivers, trips, onNavigateToTab }: DashboardProps) {
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');

  // Filter vehicles based on selections (Mock filter)
  const filteredVehicles = vehicles.filter((v) => {
    if (vehicleTypeFilter !== 'All') {
      if (vehicleTypeFilter === 'Heavy Duty' && !v.type.toLowerCase().includes('tractor')) return false;
      if (vehicleTypeFilter === 'Vans' && !v.type.toLowerCase().includes('van')) return false;
      if (vehicleTypeFilter === 'Electric' && !v.name.toLowerCase().includes('ev')) return false;
    }
    return true;
  });

  const totalVehicles = filteredVehicles.length;
  const activeVehicles = filteredVehicles.filter(v => v.status === VehicleStatus.ON_TRIP).length;
  const availableVehicles = filteredVehicles.filter(v => v.status === VehicleStatus.AVAILABLE).length;
  const inMaintenanceVehicles = filteredVehicles.filter(v => v.status === VehicleStatus.IN_SHOP).length;
  const retiredVehicles = filteredVehicles.filter(v => v.status === VehicleStatus.RETIRED).length;

  const activeTrips = trips.filter(t => t.status === TripStatus.DISPATCHED).length;
  const pendingTrips = trips.filter(t => t.status === TripStatus.DRAFT).length;
  const driversOnDuty = drivers.filter(d => d.status === DriverStatus.ON_TRIP || d.status === DriverStatus.AVAILABLE).length;

  // Utilization calculation (Active / Total Non-Retired)
  const nonRetiredTotal = totalVehicles - retiredVehicles;
  const utilization = nonRetiredTotal > 0 ? Math.round((activeVehicles / nonRetiredTotal) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#161A22] p-4 rounded-xl border border-[#2D3748] shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-white">Overview</h2>
          <p className="text-xs text-[#dbc2b0]">At-a-glance fleet operations and live performance stats.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <div className="relative shrink-0">
            <select 
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
              className="appearance-none bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-xs text-white pr-8 focus:outline-none focus:border-[#d97707] cursor-pointer"
            >
              <option value="All">All Vehicles</option>
              <option value="Heavy Duty">Heavy Duty</option>
              <option value="Vans">Vans</option>
              <option value="Electric">Electric/EV</option>
            </select>
            <ChevronRight className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-[#dbc2b0] pointer-events-none" />
          </div>
          <div className="relative shrink-0">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-xs text-white pr-8 focus:outline-none focus:border-[#d97707] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">On Trip</option>
              <option value="Available">Available</option>
              <option value="Maintenance">In Shop</option>
            </select>
            <ChevronRight className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-[#dbc2b0] pointer-events-none" />
          </div>
          <div className="relative shrink-0">
            <select 
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="appearance-none bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-xs text-white pr-8 focus:outline-none focus:border-[#d97707] cursor-pointer"
            >
              <option value="All">All Regions</option>
              <option value="North">North Hub</option>
              <option value="South">South Depot</option>
              <option value="East">East Gate</option>
              <option value="West">West Dock</option>
            </select>
            <ChevronRight className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-[#dbc2b0] pointer-events-none" />
=======
  maintenance: MaintenanceLog[];
  fuelLogs: FuelLog[];
  onTabChange: (tabId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  vehicles,
  drivers,
  trips,
  maintenance,
  fuelLogs,
  onTabChange,
}) => {
  const activeFleetCount = vehicles.length;
  const operationalCount = vehicles.filter(v => v.status === VehicleStatus.AVAILABLE).length;
  const dispatchedCount = trips.filter(t => t.status === TripStatus.DISPATCHED).length;
  const maintenanceCount = vehicles.filter(v => v.status === VehicleStatus.IN_SHOP).length;

  const maintenanceInShop = maintenance.filter(m => m.status === MaintenanceStatus.IN_SHOP);
  const activeTrips = trips.filter(t => t.status === TripStatus.DISPATCHED);
  const recentFuel = fuelLogs.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#221610] border border-[#38251a] p-4 rounded shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#dbc2b0]/65 tracking-wider uppercase">Total Active Fleet</span>
            <div className="h-7 w-7 rounded bg-[#d97707]/10 flex items-center justify-center text-[#ffb77d]">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight" id="metric-total-fleet">{activeFleetCount}</div>
          <div className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
            <span>+2 registered this month</span>
          </div>
        </div>

        <div className="bg-[#221610] border border-[#38251a] p-4 rounded shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#dbc2b0]/65 tracking-wider uppercase">Operational Assets</span>
            <div className="h-7 w-7 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight" id="metric-operational">{operationalCount}</div>
          <div className="text-[10px] text-[#dbc2b0]/60 mt-1 flex items-center gap-1">
            <span>{Math.round((operationalCount / (activeFleetCount || 1)) * 100)}% utilization rate</span>
          </div>
        </div>

        <div className="bg-[#221610] border border-[#38251a] p-4 rounded shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#dbc2b0]/65 tracking-wider uppercase">Active Dispatch List</span>
            <div className="h-7 w-7 rounded bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Send className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight" id="metric-dispatched">{dispatchedCount}</div>
          <div className="text-[10px] text-[#dbc2b0]/60 mt-1 flex items-center gap-1">
            <span>Live transits in-route</span>
          </div>
        </div>

        <div className="bg-[#221610] border border-[#38251a] p-4 rounded shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#dbc2b0]/65 tracking-wider uppercase">In Shop / Maintenance</span>
            <div className="h-7 w-7 rounded bg-red-500/10 flex items-center justify-center text-red-400">
              <Wrench className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight" id="metric-maintenance">{maintenanceCount}</div>
          <div className="text-[10px] text-red-400/80 mt-1 flex items-center gap-1">
            <span>Critical maintenance events pending</span>
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* 7 KPI Cards Grid */}
      <div className="w-full overflow-x-auto select-none pb-2 scrollbar-none">
        <div className="flex gap-4 min-w-[1000px]">
          {/* KPI 1: Active Vehicles */}
          <div 
            onClick={() => onNavigateToTab('Fleet')}
            className="flex-1 bg-[#161A22] border border-[#2D3748] hover:border-[#4A5568] transition-all p-4 rounded-xl flex flex-col justify-between border-l-4 border-l-[#dbc2b0] h-24 cursor-pointer"
          >
            <span className="text-[10px] text-[#dbc2b0] uppercase tracking-wider font-semibold">Active Vehicles</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">{activeVehicles}</span>
              <Truck className="h-5 w-5 text-[#dbc2b0]" />
            </div>
          </div>

          {/* KPI 2: Available Vehicles */}
          <div 
            onClick={() => onNavigateToTab('Fleet')}
            className="flex-1 bg-[#161A22] border border-[#2D3748] hover:border-[#4A5568] transition-all p-4 rounded-xl flex flex-col justify-between border-l-4 border-l-[#10B981] h-24 cursor-pointer"
          >
            <span className="text-[10px] text-[#dbc2b0] uppercase tracking-wider font-semibold">Available</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">{availableVehicles}</span>
              <CheckCircle className="h-5 w-5 text-[#10B981]" />
            </div>
          </div>

          {/* KPI 3: In Maintenance */}
          <div 
            onClick={() => onNavigateToTab('Maintenance')}
            className="flex-1 bg-[#161A22] border border-[#2D3748] hover:border-[#4A5568] transition-all p-4 rounded-xl flex flex-col justify-between border-l-4 border-l-[#d97707] h-24 cursor-pointer"
          >
            <span className="text-[10px] text-[#dbc2b0] uppercase tracking-wider font-semibold">In Maintenance</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">{inMaintenanceVehicles}</span>
              <Wrench className="h-5 w-5 text-[#d97707]" />
            </div>
          </div>

          {/* KPI 4: Active Trips */}
          <div 
            onClick={() => onNavigateToTab('Trips')}
            className="flex-1 bg-[#161A22] border border-[#2D3748] hover:border-[#4A5568] transition-all p-4 rounded-xl flex flex-col justify-between border-l-4 border-l-[#3B82F6] h-24 cursor-pointer"
          >
            <span className="text-[10px] text-[#dbc2b0] uppercase tracking-wider font-semibold">Active Trips</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">{activeTrips}</span>
              <Navigation className="h-5 w-5 text-[#3B82F6]" />
            </div>
          </div>

          {/* KPI 5: Pending Trips */}
          <div 
            onClick={() => onNavigateToTab('Trips')}
            className="flex-1 bg-[#161A22] border border-[#2D3748] hover:border-[#4A5568] transition-all p-4 rounded-xl flex flex-col justify-between border-l-4 border-l-[#f59e0b] h-24 cursor-pointer"
          >
            <span className="text-[10px] text-[#dbc2b0] uppercase tracking-wider font-semibold">Pending Trips</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">{pendingTrips}</span>
              <Clock className="h-5 w-5 text-[#f59e0b]" />
            </div>
          </div>

          {/* KPI 6: Drivers on Duty */}
          <div 
            onClick={() => onNavigateToTab('Drivers')}
            className="flex-1 bg-[#161A22] border border-[#2D3748] hover:border-[#4A5568] transition-all p-4 rounded-xl flex flex-col justify-between border-l-4 border-l-[#8B5CF6] h-24 cursor-pointer"
          >
            <span className="text-[10px] text-[#dbc2b0] uppercase tracking-wider font-semibold">Drivers on Duty</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">{driversOnDuty}</span>
              <Users className="h-5 w-5 text-[#8B5CF6]" />
            </div>
          </div>

          {/* KPI 7: Utilization */}
          <div className="flex-1 bg-[#161A22] border border-[#2D3748] hover:border-[#4A5568] transition-all p-4 rounded-xl flex flex-col justify-between border-l-4 border-l-[#06B6D4] h-24 relative overflow-hidden">
            <span className="text-[10px] text-[#dbc2b0] uppercase tracking-wider font-semibold">Utilization</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">{utilization}%</span>
              <PieChart className="h-5 w-5 text-[#06B6D4]" />
            </div>
            {/* Visual utilization timeline indicator */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#2D3748]">
              <div className="h-full bg-[#06B6D4] transition-all duration-500" style={{ width: `${utilization}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Split: Recent Trips & Fleet Status */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Recent Trips Table */}
        <div className="lg:w-2/3 bg-[#161A22] rounded-xl border border-[#2D3748] flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#2D3748] flex justify-between items-center bg-[#1E293B]/20">
            <h3 className="font-semibold text-white text-sm">Recent Dispatch Log</h3>
            <button 
              onClick={() => onNavigateToTab('Trips')}
              className="text-xs text-[#ffb77d] hover:underline flex items-center gap-1 font-semibold"
            >
              View All Routes
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0D0F14] border-b border-[#2D3748]">
                  <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider py-3 px-4">Trip ID</th>
                  <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider py-3 px-4">Route</th>
                  <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider py-3 px-4">Vehicle</th>
                  <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider py-3 px-4">Driver</th>
                  <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider py-3 px-4">Status</th>
                  <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider py-3 px-4 text-right">ETA</th>
                </tr>
              </thead>
              <tbody className="text-xs text-[#dbc2b0]">
                {trips.slice(0, 5).map((trip) => {
                  const vehicle = vehicles.find(v => v.registrationNumber === trip.vehicleReg);
                  const driver = drivers.find(d => d.id === trip.driverId);
                  
                  return (
                    <tr key={trip.id} className="border-b border-[#2D3748]/50 hover:bg-[#1E293B]/40 transition-all cursor-pointer">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">{trip.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{trip.source}</div>
                        <div className="text-[10px] text-[#dbc2b0]/70">to {trip.destination}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-white">{trip.vehicleReg}</div>
                        <div className="text-[10px] text-[#dbc2b0]/70">{vehicle?.name || 'Assigned Vehicle'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-white">{driver?.name || 'Assigned Driver'}</div>
                        <div className="text-[10px] text-[#dbc2b0]/70">{driver?.licenseCategory}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                          trip.status === TripStatus.DISPATCHED ? 'bg-[#3B82F6]/10 text-[#60A5FA] border-[#3B82F6]/30' :
                          trip.status === TripStatus.COMPLETED ? 'bg-[#10B981]/10 text-[#34D399] border-[#10B981]/30' :
                          trip.status === TripStatus.CANCELLED ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                          'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30'
                        }`}>
                          {trip.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-white">{trip.eta}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Fleet Status Chart */}
        <div className="lg:w-1/3 bg-[#161A22] rounded-xl border border-[#2D3748] p-5 flex flex-col shadow-sm">
          <h3 className="font-semibold text-white text-sm mb-6">Fleet Allocation</h3>
          <div className="flex-grow flex flex-col justify-center gap-5">
            {/* Available */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-[#dbc2b0]">Available for Dispatch</span>
                <span className="text-white">{availableVehicles} ({totalVehicles > 0 ? Math.round((availableVehicles / totalVehicles) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-[#0D0F14] rounded-full h-2 border border-[#2D3748]">
                <div 
                  className="bg-[#10B981] h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalVehicles > 0 ? (availableVehicles / totalVehicles) * 100 : 0}%` }} 
                />
              </div>
            </div>

            {/* Active (On Trip) */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-[#dbc2b0]">Dispatched (On Trip)</span>
                <span className="text-white">{activeVehicles} ({totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-[#0D0F14] rounded-full h-2 border border-[#2D3748]">
                <div 
                  className="bg-[#3B82F6] h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0}%` }} 
                />
              </div>
            </div>

            {/* In Shop */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-[#dbc2b0]">Service Bay (In Shop)</span>
                <span className="text-white">{inMaintenanceVehicles} ({totalVehicles > 0 ? Math.round((inMaintenanceVehicles / totalVehicles) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-[#0D0F14] rounded-full h-2 border border-[#2D3748]">
                <div 
                  className="bg-[#d97707] h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalVehicles > 0 ? (inMaintenanceVehicles / totalVehicles) * 100 : 0}%` }} 
                />
              </div>
            </div>

            {/* Retired */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-[#dbc2b0]">Decommissioned (Retired)</span>
                <span className="text-white">{retiredVehicles} ({totalVehicles > 0 ? Math.round((retiredVehicles / totalVehicles) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-[#0D0F14] rounded-full h-2 border border-[#2D3748]">
                <div 
                  className="bg-red-500/50 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalVehicles > 0 ? (retiredVehicles / totalVehicles) * 100 : 0}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2D3748] text-center">
            <span className="text-xs text-[#dbc2b0]">
              Registered Asset Volume: <strong className="text-white font-bold">{totalVehicles} Vehicles</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
=======
      {/* Two Column Split: Alerts & Live Dispatches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Maintenance Alerts */}
        <div className="bg-[#221610] border border-[#38251a] rounded p-5 flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#38251a]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#d97707]" />
              <h3 className="font-bold text-sm text-white">Recent Maintenance & System Alerts</h3>
            </div>
            <button 
              onClick={() => onTabChange('maintenance')}
              className="text-[10px] font-bold text-[#ffb77d] hover:underline uppercase tracking-wider cursor-pointer"
            >
              View All Logs
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1" id="dashboard-alerts-list">
            {maintenanceInShop.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#dbc2b0]/40">
                <ShieldCheck className="h-10 w-10 text-emerald-500/50 mb-2" />
                <p className="text-xs font-semibold">All assets operational. No pending alerts.</p>
              </div>
            ) : (
              maintenanceInShop.map((item) => (
                <div key={item.id} className="bg-[#150e0a] border border-red-500/20 rounded p-3 flex items-start gap-3 hover:border-red-500/40 transition-all">
                  <div className="p-1.5 rounded bg-red-500/10 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white text-xs">{item.vehicleReg}</span>
                      <span className="text-[10px] text-red-400/90 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">IN SHOP</span>
                    </div>
                    <p className="text-[11px] text-[#dbc2b0]/80 mt-1 font-medium">{item.serviceType}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-[#dbc2b0]/50 font-mono">
                      <span>Date: {item.date}</span>
                      <span>•</span>
                      <span className="text-white font-bold">${item.cost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Trips / Dispatches Timeline */}
        <div className="bg-[#221610] border border-[#38251a] rounded p-5 flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#38251a]">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-[#d97707]" />
              <h3 className="font-bold text-sm text-white">Active Transits & Dispatch Timeline</h3>
            </div>
            <button 
              onClick={() => onTabChange('trips')}
              className="text-[10px] font-bold text-[#ffb77d] hover:underline uppercase tracking-wider cursor-pointer"
            >
              Dispatch Center
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1" id="dashboard-trips-list">
            {activeTrips.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#dbc2b0]/40">
                <NavigationOff className="h-10 w-10 text-[#dbc2b0]/30 mb-2" />
                <p className="text-xs font-semibold">No active transits on route.</p>
              </div>
            ) : (
              activeTrips.map((trip) => {
                const driverObj = drivers.find(d => d.id === trip.driverId);
                return (
                  <div key={trip.id} className="bg-[#150e0a] border border-[#38251a] rounded p-3 space-y-2 hover:border-[#dbc2b0]/30 transition-all">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-white">{trip.id}</span>
                        <span className="text-[10px] bg-[#d97707]/15 border border-[#d97707]/30 text-[#ffb77d] px-1.5 py-0.5 rounded font-bold uppercase">{trip.vehicleReg}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[10px] text-[#dbc2b0]/75 bg-[#301f16] px-1.5 py-0.5 rounded">
                        <Clock className="h-3 w-3 text-[#ffb77d]" />
                        <span>ETA: {trip.eta}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 items-center gap-1.5 py-1 text-xs">
                      <div className="col-span-2 truncate font-semibold text-white text-right pr-2">{trip.source}</div>
                      <div className="col-span-1 flex items-center justify-center relative">
                        <div className="h-px bg-dashed bg-[#38251a] w-full absolute"></div>
                        <ArrowRight className="h-3.5 w-3.5 text-[#ffb77d] relative z-10 bg-[#150e0a] px-1" />
                      </div>
                      <div className="col-span-2 truncate font-semibold text-white pl-2">{trip.destination}</div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#dbc2b0]/60 border-t border-[#38251a]/40 pt-1.5">
                      <span>Driver: <strong className="text-white">{driverObj ? driverObj.name : trip.driverId}</strong></span>
                      <span className="font-mono">Cargo: {trip.cargoWeight.toLocaleString()} lbs</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Recent Fuel Refills quick view */}
      <div className="bg-[#221610] border border-[#38251a] rounded p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#38251a]">
          <h3 className="font-bold text-sm text-white">Recent Fuel Replenishments</h3>
          <button 
            onClick={() => onTabChange('fuel')}
            className="text-[10px] font-bold text-[#ffb77d] hover:underline uppercase tracking-wider cursor-pointer"
          >
            Manage Expenses
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-[#38251a]">
            <thead>
              <tr className="text-[#dbc2b0]/55 font-bold uppercase text-[9px] tracking-wider">
                <th className="py-2.5">Asset ID</th>
                <th className="py-2.5">Date & Time</th>
                <th className="py-2.5 text-right">Liters Logged</th>
                <th className="py-2.5 text-right">Fuel Unit Cost</th>
                <th className="py-2.5 text-right">Aggregate Expenditure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38251a]" id="dashboard-fuel-table">
              {recentFuel.map((item) => (
                <tr key={item.id} className="hover:bg-[#301f16]/30 transition-colors">
                  <td className="py-2.5 font-bold text-white">{item.vehicleReg}</td>
                  <td className="py-2.5 text-[#dbc2b0]/85">{item.dateTime}</td>
                  <td className="py-2.5 text-right font-mono">{item.liters} L</td>
                  <td className="py-2.5 text-right font-mono">${item.costPerLiter.toFixed(2)}</td>
                  <td className="py-2.5 text-right font-black text-[#ffb77d] font-mono">${item.totalCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
