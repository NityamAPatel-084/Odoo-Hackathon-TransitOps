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

interface DashboardProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
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
          </div>
        </div>
      </div>

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
