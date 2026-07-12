import React from 'react';
import { Vehicle, Trip, MaintenanceLog, FuelLog, VehicleStatus } from '../types';
import { LineChart, BarChart2, TrendingUp, DollarSign, Activity, Users } from 'lucide-react';

interface AnalyticsReportsProps {
  vehicles: Vehicle[];
  trips: Trip[];
  maintenance: MaintenanceLog[];
  fuelLogs: FuelLog[];
}

export const AnalyticsReports: React.FC<AnalyticsReportsProps> = ({
  vehicles,
  trips,
  maintenance,
  fuelLogs,
}) => {
  // 1. Calculations
  const fleetAcquisitionCost = vehicles.reduce((sum, v) => sum + v.acquisitionCost, 0);
  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + f.totalCost, 0);
  const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + m.cost, 0);
  const totalFleetCount = vehicles.length;

  const countAvailable = vehicles.filter(v => v.status === VehicleStatus.AVAILABLE).length;
  const countOnTrip = vehicles.filter(v => v.status === VehicleStatus.ON_TRIP).length;
  const countInShop = vehicles.filter(v => v.status === VehicleStatus.IN_SHOP).length;
  const countRetired = vehicles.filter(v => v.status === VehicleStatus.RETIRED).length;

  // Pie chart calculation
  const segments = [
    { label: 'Available', count: countAvailable, color: '#10b981' }, // emerald
    { label: 'On Trip', count: countOnTrip, color: '#f59e0b' },    // amber
    { label: 'In Shop', count: countInShop, color: '#ef4444' },    // red
    { label: 'Retired', count: countRetired, color: '#6b7280' },   // gray
  ].filter(s => s.count > 0);

  const totalSegmentsCount = segments.reduce((sum, s) => sum + s.count, 0) || 1;

  // Monthly outlay simulation
  const financialMetrics = [
    { name: 'Fuel Replenishment', value: totalFuelCost, pct: 100, color: 'bg-amber-500' },
    { name: 'Preventive/Repair Maintenance', value: totalMaintenanceCost, pct: totalFuelCost > 0 ? (totalMaintenanceCost / totalFuelCost) * 100 : 50, color: 'bg-red-500' },
    { name: 'Toll & Operational Surcharges', value: 850.00, pct: 20, color: 'bg-[#d97707]' },
  ];

  // SVG circular Donut Calculations
  let cumulativePercent = 0;
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#38251a]">
        <h3 className="font-bold text-lg text-white">Platform ROI & Analytics</h3>
        <p className="text-xs text-[#dbc2b0]/60">Review operational cost outlays, utilization metrics, and financial efficiency reporting.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#221610] border border-[#38251a] p-4 rounded shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <DollarSign className="h-4 w-4 text-[#d97707]" />
            <span className="text-[10px] font-bold text-[#dbc2b0]/65 tracking-wider uppercase">Asset Portfolio Capital</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">
            ${fleetAcquisitionCost.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">Value of registered assets</span>
        </div>

        <div className="bg-[#221610] border border-[#38251a] p-4 rounded shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <TrendingUp className="h-4 w-4 text-[#d97707]" />
            <span className="text-[10px] font-bold text-[#dbc2b0]/65 tracking-wider uppercase">Fleet ROI Margin</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">
            18.4%
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">Average net cargo yield</span>
        </div>

        <div className="bg-[#221610] border border-[#38251a] p-4 rounded shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <Activity className="h-4 w-4 text-[#d97707]" />
            <span className="text-[10px] font-bold text-[#dbc2b0]/65 tracking-wider uppercase">Maintenance / Asset Ratio</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {fleetAcquisitionCost > 0 ? ((totalMaintenanceCost / fleetAcquisitionCost) * 100).toFixed(2) : '0.00'}%
          </div>
          <span className="text-[10px] text-[#dbc2b0]/55 mt-1 block">Health capital ratio</span>
        </div>

        <div className="bg-[#221610] border border-[#38251a] p-4 rounded shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <Users className="h-4 w-4 text-[#d97707]" />
            <span className="text-[10px] font-bold text-[#dbc2b0]/65 tracking-wider uppercase">Avg Safety Rating</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">
            92.8 / 100
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">Excellent safety record</span>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Fleet Status Donut Chart */}
        <div className="bg-[#221610] border border-[#38251a] rounded p-5 flex flex-col items-center">
          <div className="w-full flex items-center gap-2 mb-6 pb-2 border-b border-[#38251a]/60">
            <BarChart2 className="h-4 w-4 text-[#d97707]" />
            <h4 className="font-bold text-sm text-white">Fleet Utilization Status</h4>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around w-full gap-6">
            {/* SVG Donut Circle */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background track */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#150e0a" strokeWidth="3" />
                
                {/* Draw segments */}
                {(() => {
                  let accumulatedOffset = 0;
                  return segments.map((seg, idx) => {
                    const percentage = (seg.count / totalSegmentsCount) * 100;
                    const strokeDasharray = `${percentage} ${100 - percentage}`;
                    const strokeDashoffset = 100 - accumulatedOffset;
                    accumulatedOffset += percentage;
                    return (
                      <circle 
                        key={idx}
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        fill="none" 
                        stroke={seg.color} 
                        strokeWidth="3.2" 
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-500 ease-out"
                      />
                    );
                  });
                })()}
              </svg>
              {/* Inner core overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white font-mono">{totalFleetCount}</span>
                <span className="text-[9px] uppercase font-bold text-[#dbc2b0]/60">Registered</span>
              </div>
            </div>

            {/* Labels ledger */}
            <div className="space-y-3 min-w-[130px] text-xs">
              {segments.map((seg, index) => (
                <div key={index} className="flex items-center justify-between gap-4 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }}></div>
                    <span className="text-[#dbc2b0]/90 font-semibold">{seg.label}</span>
                  </div>
                  <span className="text-white font-black font-mono">{seg.count} ({Math.round((seg.count / totalSegmentsCount) * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial outlay progress metrics */}
        <div className="bg-[#221610] border border-[#38251a] rounded p-5">
          <div className="w-full flex items-center gap-2 mb-6 pb-2 border-b border-[#38251a]/60">
            <LineChart className="h-4 w-4 text-[#d97707]" />
            <h4 className="font-bold text-sm text-white">Monthly Financial Operational Outlay</h4>
          </div>

          <div className="space-y-5 text-xs">
            {financialMetrics.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center font-medium">
                  <span className="text-[#dbc2b0]/85 font-semibold">{item.name}</span>
                  <span className="text-white font-black font-mono">${item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="w-full bg-[#150e0a] rounded-full h-2 overflow-hidden border border-[#38251a]/50">
                  <div 
                    className={`${item.color} h-full rounded-full transition-all duration-700 ease-out`} 
                    style={{ width: `${Math.min(item.pct, 100)}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-[#38251a]/40 flex justify-between items-center">
              <span className="text-[10px] font-bold text-[#dbc2b0]/60 uppercase tracking-wider">Total Operations Bill</span>
              <span className="text-sm font-black text-[#ffb77d] font-mono">
                ${(totalFuelCost + totalMaintenanceCost + 850.00).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default AnalyticsReports;
