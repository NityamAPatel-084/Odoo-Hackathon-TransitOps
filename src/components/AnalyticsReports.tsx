import React, { useState } from 'react';
import { Vehicle, Trip, FuelLog, Expense, MaintenanceLog, TripStatus } from '../types';
import { LineChart, BarChart3, Download, TrendingUp, DollarSign, Fuel, Wrench, Shield, Check } from 'lucide-react';

interface AnalyticsReportsProps {
  vehicles: Vehicle[];
  trips: Trip[];
  fuelLogs: FuelLog[];
  expenses: Expense[];
  maintenanceLogs: MaintenanceLog[];
}

export default function AnalyticsReports({
  vehicles,
  trips,
  fuelLogs,
  expenses,
  maintenanceLogs,
}: AnalyticsReportsProps) {
  
  // Amortization config
  const MILE_REVENUE_RATE = 4.50; // Earn $4.50 per mile
  const REVENUE_CAPACITY_FACTOR = 0.05; // Extra $0.05 per 1000kg capacity

  const [exportSuccess, setExportSuccess] = useState(false);

  // Compute stats per vehicle
  const fleetPerformance = vehicles.map((v) => {
    // 1. Total Completed Distance
    const completedTrips = trips.filter(
      (t) => t.vehicleReg === v.registrationNumber && t.status === TripStatus.COMPLETED
    );
    const milesRun = completedTrips.reduce((acc, curr) => acc + curr.plannedDistance, 0);

    // 2. Est Revenue = Miles Run * Rate + small premium for payload capacity
    const rawRevenue = milesRun * MILE_REVENUE_RATE;
    const capacityBonus = completedTrips.reduce((acc, curr) => acc + (curr.cargoWeight * 0.0001), 0);
    const estRevenue = rawRevenue + capacityBonus;

    // 3. Operational Costs
    const fuelCost = fuelLogs
      .filter((fl) => fl.vehicleReg === v.registrationNumber)
      .reduce((acc, curr) => acc + curr.totalCost, 0);

    const mntCost = maintenanceLogs
      .filter((ml) => ml.vehicleReg === v.registrationNumber)
      .reduce((acc, curr) => acc + curr.cost, 0);

    const tollCost = expenses
      .filter((e) => e.vehicleReg === v.registrationNumber)
      .reduce((acc, curr) => acc + curr.total, 0);

    // Amortize Acquisition Cost over, say, 5 years / 250,000 miles. Let's say cost per mile of asset depreciation is 20% of acquisition cost per 50,000 mi
    const depreciationCost = (v.acquisitionCost * 0.20) * (v.odometer > 0 ? Math.min(1.0, milesRun / 50000) : 0.05);

    const totalCost = fuelCost + mntCost + tollCost + depreciationCost;

    // 4. ROI
    // ROI = ((Revenue - Cost) / Cost) * 100
    // If cost is 0, let's say 0
    let roiPercentage = 0;
    if (totalCost > 0) {
      roiPercentage = Math.round(((estRevenue - totalCost) / totalCost) * 100);
    }

    return {
      registrationNumber: v.registrationNumber,
      name: v.name,
      completedTripsCount: completedTrips.length,
      milesRun,
      estRevenue,
      fuelCost,
      mntCost,
      tollCost,
      depreciationCost,
      totalCost,
      roiPercentage,
    };
  });

  // Export to CSV Function
  const handleExportCSV = () => {
    // CSV Header
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Registration Number,Vehicle Name,Completed Trips,Total Miles Run,Estimated Revenue ($),Fuel Costs ($),Maintenance Costs ($),Other Expenses ($),Depreciation ($),Total Costs ($),ROI (%)\r\n';

    // CSV Rows
    fleetPerformance.forEach((row) => {
      csvContent += `${row.registrationNumber},${row.name},${row.completedTripsCount},${row.milesRun},${row.estRevenue.toFixed(2)},${row.fuelCost.toFixed(2)},${row.mntCost.toFixed(2)},${row.tollCost.toFixed(2)},${row.depreciationCost.toFixed(2)},${row.totalCost.toFixed(2)},${row.roiPercentage}%\r\n`;
    });

    // Create Download Trigger
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TransitOps_Fleet_ROI_Performance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  // Fleet wide aggregate summaries
  const totalCompletedDistance = fleetPerformance.reduce((acc, curr) => acc + curr.milesRun, 0);
  const totalAmortizedRevenue = fleetPerformance.reduce((acc, curr) => acc + curr.estRevenue, 0);
  const totalAmortizedCosts = fleetPerformance.reduce((acc, curr) => acc + curr.totalCost, 0);
  const aggregateFleetROI = totalAmortizedCosts > 0 ? Math.round(((totalAmortizedRevenue - totalAmortizedCosts) / totalAmortizedCosts) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header & Export Button */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Fleet Reports & Performance</h2>
          <p className="text-xs text-[#dbc2b0] max-w-2xl mt-1">
            Analyze asset ROI, amortized fleet value offsets, and export compliance data.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-[#d97707] hover:bg-[#b45309] text-black font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-sm border border-[#ffb77d]/30"
        >
          {exportSuccess ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          {exportSuccess ? 'CSV Sheet Exported!' : 'Export Performance CSV'}
        </button>
      </div>

      {/* Aggregate ROI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#161A22] border border-[#2D3748] p-4 rounded-xl shadow-sm">
          <span className="text-[10px] text-[#dbc2b0] uppercase tracking-wider block font-semibold">Aggregate Fleet ROI</span>
          <div className="flex justify-between items-end mt-2">
            <span className={`text-2xl font-bold ${aggregateFleetROI >= 0 ? 'text-[#34D399]' : 'text-red-400'}`}>
              {aggregateFleetROI}%
            </span>
            <TrendingUp className="h-5 w-5 text-[#34D399]" />
          </div>
          <p className="text-[10px] text-[#dbc2b0]/50 mt-1">Est. Revenue vs. Deployed Asset Cost</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#161A22] border border-[#2D3748] p-4 rounded-xl shadow-sm">
          <span className="text-[10px] text-[#dbc2b0] uppercase tracking-wider block font-semibold">Amortized Revenue</span>
          <div className="flex justify-between items-end mt-2">
            <span className="text-2xl font-bold text-white font-mono">
              ${totalAmortizedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <DollarSign className="h-5 w-5 text-[#ffb77d]" />
          </div>
          <p className="text-[10px] text-[#dbc2b0]/50 mt-1">Completed trips * ${MILE_REVENUE_RATE}/mi rate</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#161A22] border border-[#2D3748] p-4 rounded-xl shadow-sm">
          <span className="text-[10px] text-[#dbc2b0] uppercase tracking-wider block font-semibold">Total Lifecycle Costs</span>
          <div className="flex justify-between items-end mt-2">
            <span className="text-2xl font-bold text-white font-mono">
              ${totalAmortizedCosts.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <Fuel className="h-5 w-5 text-[#dbc2b0]" />
          </div>
          <p className="text-[10px] text-[#dbc2b0]/50 mt-1">Acquisition + fuel + maintenance + tolls</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#161A22] border border-[#2D3748] p-4 rounded-xl shadow-sm">
          <span className="text-[10px] text-[#dbc2b0] uppercase tracking-wider block font-semibold">Total Completed Distance</span>
          <div className="flex justify-between items-end mt-2">
            <span className="text-2xl font-bold text-white">
              {totalCompletedDistance.toLocaleString()} mi
            </span>
            <BarChart3 className="h-5 w-5 text-[#06B6D4]" />
          </div>
          <p className="text-[10px] text-[#dbc2b0]/50 mt-1">Logistics transit operations volume</p>
        </div>
      </div>

      {/* Asset ROI Analytics Table */}
      <div className="bg-[#161A22] border border-[#2D3748] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#2D3748] bg-[#1E293B]/20">
          <h3 className="font-semibold text-white text-sm">Individual Vehicle ROI Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0D0F14] border-b border-[#2D3748]">
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider py-3 px-4">Reg No.</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider py-3 px-4">Model Name</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider py-3 px-4 text-center">Completed Trips</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider py-3 px-4 text-right">Distance (mi)</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider py-3 px-4 text-right">Est. Revenue</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider py-3 px-4 text-right">Amortized Cost</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider py-3 px-4 text-center">ROI Status</th>
              </tr>
            </thead>
            <tbody className="text-xs text-[#dbc2b0] divide-y divide-[#2D3748]/50">
              {fleetPerformance.map((row) => (
                <tr key={row.registrationNumber} className="hover:bg-[#1E293B]/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-white">{row.registrationNumber}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{row.name}</div>
                  </td>
                  <td className="py-3 px-4 text-center text-white font-semibold">{row.completedTripsCount}</td>
                  <td className="py-3 px-4 text-right">{row.milesRun.toLocaleString()} mi</td>
                  <td className="py-3 px-4 text-right text-[#34D399] font-semibold font-mono">${Math.round(row.estRevenue).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-white font-mono">${Math.round(row.totalCost).toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center justify-center font-bold text-[10px] tracking-wider px-2.5 py-0.5 rounded border uppercase w-20 ${
                      row.roiPercentage > 30 ? 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30' :
                      row.roiPercentage >= 0 ? 'bg-[#ffb77d]/15 text-[#ffb77d] border-[#ffb77d]/30' :
                      'bg-red-500/15 text-red-400 border-red-500/30'
                    }`}>
                      {row.roiPercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
