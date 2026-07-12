import React, { useState } from 'react';
import { Vehicle, Driver, Trip, VehicleStatus, DriverStatus, TripStatus } from '../types';
import { Truck, CheckCircle, Wrench, Navigation, Clock, Users, PieChart, ChevronRight } from 'lucide-react';

interface DashboardProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
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

  const getPercentage = (count: number) => totalVehicles > 0 ? Math.round((count / totalVehicles) * 100) : 0;

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
          </div>
        </div>
      </div>

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
                <span className="text-white">{availableVehicles} ({getPercentage(availableVehicles)}%)</span>
              </div>
              <div className="w-full bg-[#0D0F14] rounded-full h-2 border border-[#2D3748]">
                <div 
                  className="bg-[#10B981] h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${getPercentage(availableVehicles)}%` }} 
                />
              </div>
            </div>

            {/* Active (On Trip) */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-[#dbc2b0]">Dispatched (On Trip)</span>
                <span className="text-white">{activeVehicles} ({getPercentage(activeVehicles)}%)</span>
              </div>
              <div className="w-full bg-[#0D0F14] rounded-full h-2 border border-[#2D3748]">
                <div 
                  className="bg-[#3B82F6] h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${getPercentage(activeVehicles)}%` }} 
                />
              </div>
            </div>

            {/* In Shop */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-[#dbc2b0]">Service Bay (In Shop)</span>
                <span className="text-white">{inMaintenanceVehicles} ({getPercentage(inMaintenanceVehicles)}%)</span>
              </div>
              <div className="w-full bg-[#0D0F14] rounded-full h-2 border border-[#2D3748]">
                <div 
                  className="bg-[#d97707] h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${getPercentage(inMaintenanceVehicles)}%` }} 
                />
              </div>
            </div>

            {/* Retired */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-[#dbc2b0]">Decommissioned (Retired)</span>
                <span className="text-white">{retiredVehicles} ({getPercentage(retiredVehicles)}%)</span>
              </div>
              <div className="w-full bg-[#0D0F14] rounded-full h-2 border border-[#2D3748]">
                <div 
                  className="bg-red-500/50 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${getPercentage(retiredVehicles)}%` }} 
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
