import React, { useState } from 'react';
<<<<<<< HEAD
import { FuelLog, Expense, Vehicle, UserRole } from '../types';
import { Fuel, Plus, TrendingUp, DollarSign, ListFilter, AlertTriangle, ArrowUpRight, CheckCircle2, RefreshCw, X } from 'lucide-react';

interface FuelExpensesProps {
  fuelLogs: FuelLog[];
  expenses: Expense[];
  vehicles: Vehicle[];
  userRole: UserRole;
  onAddFuelLog: (log: FuelLog) => void;
  onAddExpense: (expense: Expense) => void;
  onUpdateExpenseStatus: (expId: string, status: 'APPROVED' | 'PENDING' | 'FLAGGED') => void;
}

export default function FuelExpenses({
  fuelLogs,
  expenses,
  vehicles,
  userRole,
  onAddFuelLog,
  onAddExpense,
  onUpdateExpenseStatus,
}: FuelExpensesProps) {
  const isFinanceOrManager = userRole === UserRole.FINANCIAL_ANALYST || userRole === UserRole.FLEET_MANAGER;

  const [showFuelForm, setShowFuelForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // Fuel form states
  const [fuelVehicle, setFuelVehicle] = useState('');
  const [fuelLiters, setFuelLiters] = useState<number>(300);
  const [fuelCostPerLiter, setFuelCostPerLiter] = useState<number>(1.85);

  // Expense form states
  const [expVehicle, setExpVehicle] = useState('');
  const [expTolls, setExpTolls] = useState<number>(45);
  const [expMnt, setExpMnt] = useState<number>(0);
  const [expOther, setExpOther] = useState<number>(15);

  const handleAddFuel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fuelVehicle) return;

    const newLog: FuelLog = {
      id: `FL-${Math.floor(100 + Math.random() * 900)}`,
      vehicleReg: fuelVehicle,
      dateTime: new Date().toLocaleString(),
      liters: fuelLiters,
      costPerLiter: fuelCostPerLiter,
      totalCost: Math.round(fuelLiters * fuelCostPerLiter * 100) / 100,
    };

    onAddFuelLog(newLog);
    setFuelVehicle('');
    setShowFuelForm(false);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expVehicle) return;

    const total = expTolls + expMnt + expOther;
    const newExp: Expense = {
      id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      tripId: `TRP-${Math.floor(8000 + Math.random() * 999)}`,
      vehicleReg: expVehicle,
      toll: expTolls,
      maintenance: expMnt,
      other: expOther,
      total,
      status: 'PENDING',
    };

    onAddExpense(newExp);
    setExpVehicle('');
    setShowExpenseForm(false);
  };

  // Math totals
  const totalFuelCost = fuelLogs.reduce((acc, curr) => acc + curr.totalCost, 0);
  const totalOtherCost = expenses.reduce((acc, curr) => acc + curr.total, 0);
  const totalOperationsCost = totalFuelCost + totalOtherCost;

  // Group costs by vehicle for custom chart rendering
  const vehicleCosts: { [reg: string]: number } = {};
  fuelLogs.forEach(log => {
    vehicleCosts[log.vehicleReg] = (vehicleCosts[log.vehicleReg] || 0) + log.totalCost;
  });
  expenses.forEach(exp => {
    vehicleCosts[exp.vehicleReg] = (vehicleCosts[exp.vehicleReg] || 0) + exp.total;
  });

  const chartData = Object.entries(vehicleCosts)
    .map(([reg, cost]) => ({ reg, cost }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  const maxChartCost = chartData.length > 0 ? Math.max(...chartData.map(d => d.cost)) : 1;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header & Metrics Summary */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#161A22] p-5 rounded-xl border border-[#2D3748] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Fuel & Logistics Financials</h2>
          <p className="text-xs text-[#dbc2b0] mt-1">Audit telematic fuel logs, toll fees, and calculate total operational cost metrics.</p>
        </div>
        
        {/* Cost stats */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[10px] text-[#dbc2b0] uppercase tracking-wider block font-semibold">Total Cost of Ops</span>
            <span className="text-xl font-bold text-[#ffb77d] font-mono">
              ${totalOperationsCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="h-8 w-px bg-[#2D3748]" />
          <div className="text-right">
            <span className="text-[10px] text-[#dbc2b0] uppercase tracking-wider block font-semibold">Fuel Expenses</span>
            <span className="text-sm font-bold text-white font-mono">
              ${totalFuelCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="h-8 w-px bg-[#2D3748]" />
          <div className="text-right">
            <span className="text-[10px] text-[#dbc2b0] uppercase tracking-wider block font-semibold">Tolls & Other</span>
            <span className="text-sm font-bold text-white font-mono">
              ${totalOtherCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content: Split logs, charts and forms */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Column 1: Live Fuel Registry Log */}
        <div className="bg-[#161A22] border border-[#2D3748] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Fuel className="h-4 w-4 text-[#ffb77d]" />
              Fuel Intake Logs
            </h3>
            {isFinanceOrManager && (
              <button 
                onClick={() => setShowFuelForm(!showFuelForm)}
                className="text-xs text-[#ffb77d] hover:underline flex items-center gap-1 font-semibold"
              >
                {showFuelForm ? 'Cancel' : '+ Log Intake'}
              </button>
            )}
          </div>

          {/* Add Fuel Form */}
          {showFuelForm && isFinanceOrManager && (
            <form onSubmit={handleAddFuel} className="bg-[#0D0F14] border border-[#2D3748] p-4 rounded-lg space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Select Asset</label>
                <select
                  className="w-full bg-[#161A22] border border-[#2D3748] rounded px-2.5 py-1.5 text-white text-xs focus:outline-none"
                  value={fuelVehicle}
                  onChange={(e) => setFuelVehicle(e.target.value)}
                  required
                >
                  <option value="">-- Select Asset --</option>
                  {vehicles.map(v => (
                    <option key={v.registrationNumber} value={v.registrationNumber}>{v.registrationNumber} - {v.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Liters Filled</label>
                  <input
                    type="number"
                    className="w-full bg-[#161A22] border border-[#2D3748] rounded px-2.5 py-1.5 text-white text-xs"
                    value={fuelLiters}
                    onChange={(e) => setFuelLiters(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Cost per Liter ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full bg-[#161A22] border border-[#2D3748] rounded px-2.5 py-1.5 text-white text-xs"
                    value={fuelCostPerLiter}
                    onChange={(e) => setFuelCostPerLiter(Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="text-right text-[10px] text-[#dbc2b0] font-semibold">
                Est. Total: ${(fuelLiters * fuelCostPerLiter).toFixed(2)}
              </div>
              <button
                type="submit"
                className="w-full bg-[#d97707] text-black font-bold text-xs py-1.5 rounded"
              >
                Log Fuel Entry
              </button>
            </form>
          )}

          {/* List Fuel logs */}
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {fuelLogs.map((log) => (
              <div key={log.id} className="bg-[#0D0F14] border border-[#2D3748]/50 p-3 rounded-lg flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white">{log.vehicleReg}</div>
                  <div className="text-[10px] text-[#dbc2b0]/50 mt-0.5">{log.dateTime}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">{log.liters} L @ ${log.costPerLiter}/L</div>
                  <div className="font-bold text-[#ffb77d] mt-0.5 font-mono">${log.totalCost.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Tolls & Expenses Audit Registry */}
        <div className="bg-[#161A22] border border-[#2D3748] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#ffb77d]" />
              Other Trip Expenses
            </h3>
            {isFinanceOrManager && (
              <button 
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="text-xs text-[#ffb77d] hover:underline flex items-center gap-1 font-semibold"
              >
                {showExpenseForm ? 'Cancel' : '+ Log Expense'}
              </button>
            )}
          </div>

          {/* Add Expense Form */}
          {showExpenseForm && isFinanceOrManager && (
            <form onSubmit={handleAddExpense} className="bg-[#0D0F14] border border-[#2D3748] p-4 rounded-lg space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Select Asset</label>
                <select
                  className="w-full bg-[#161A22] border border-[#2D3748] rounded px-2.5 py-1.5 text-white text-xs focus:outline-none"
                  value={expVehicle}
                  onChange={(e) => setExpVehicle(e.target.value)}
                  required
                >
                  <option value="">-- Select Asset --</option>
                  {vehicles.map(v => (
                    <option key={v.registrationNumber} value={v.registrationNumber}>{v.registrationNumber} - {v.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Toll Fees ($)</label>
                  <input
                    type="number"
                    className="w-full bg-[#161A22] border border-[#2D3748] rounded px-2.5 py-1.5 text-white text-xs"
                    value={expTolls}
                    onChange={(e) => setExpTolls(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Shop Repair ($)</label>
                  <input
                    type="number"
                    className="w-full bg-[#161A22] border border-[#2D3748] rounded px-2.5 py-1.5 text-white text-xs"
                    value={expMnt}
                    onChange={(e) => setExpMnt(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Misc fees ($)</label>
                  <input
                    type="number"
                    className="w-full bg-[#161A22] border border-[#2D3748] rounded px-2.5 py-1.5 text-white text-xs"
                    value={expOther}
                    onChange={(e) => setExpOther(Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#d97707] text-black font-bold text-xs py-1.5 rounded"
              >
                Log Expense Log
              </button>
            </form>
          )}

          {/* List Expenses Audit */}
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {expenses.map((exp) => (
              <div key={exp.id} className="bg-[#0D0F14] border border-[#2D3748]/50 p-3 rounded-lg flex justify-between items-start text-xs">
                <div>
                  <div className="font-bold text-white">{exp.vehicleReg}</div>
                  <div className="text-[10px] text-[#dbc2b0]/60 mt-1 space-y-0.5">
                    <p>Tolls: ${exp.toll}</p>
                    <p>Repair: ${exp.maintenance}</p>
                    <p>Misc: ${exp.other}</p>
                  </div>
                </div>
                <div className="text-right space-y-1.5">
                  <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wider uppercase border ${
                    exp.status === 'APPROVED' ? 'bg-[#10B981]/10 text-[#34D399] border-[#10B981]/30' :
                    exp.status === 'PENDING' ? 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30' :
                    'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse'
                  }`}>
                    {exp.status}
                  </span>
                  <div className="font-bold text-[#ffb77d] font-mono">${exp.total.toLocaleString()}</div>
                  
                  {isFinanceOrManager && exp.status === 'PENDING' && (
                    <div className="flex gap-1.5 justify-end">
                      <button
                        onClick={() => onUpdateExpenseStatus(exp.id, 'APPROVED')}
                        className="text-[9px] bg-[#10B981]/10 hover:bg-[#10B981]/25 text-[#34D399] px-1.5 py-0.5 rounded border border-[#10B981]/30 font-bold uppercase cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onUpdateExpenseStatus(exp.id, 'FLAGGED')}
                        className="text-[9px] bg-red-500/10 hover:bg-red-500/25 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 font-bold uppercase cursor-pointer"
                      >
                        Flag
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Custom SVG Costliest Assets Chart */}
        <div className="bg-[#161A22] border border-[#2D3748] rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-white text-sm flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-[#ffb77d]" />
              Costliest Assets (Top 5)
            </h3>
            <p className="text-[11px] text-[#dbc2b0] mb-6">Aggregate maintenance fuel costs + tolls recorded against registration numbers.</p>
            
            <div className="space-y-4">
              {chartData.map((item, idx) => {
                const percentage = Math.round((item.cost / maxChartCost) * 100);
                return (
                  <div key={item.reg} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-white flex items-center gap-1.5">
                        <span className="text-[#ffb77d] font-bold">#{idx + 1}</span>
                        {item.reg}
                      </span>
                      <span className="text-[#ffb77d] font-mono">${Math.round(item.cost).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-[#0D0F14] h-2.5 rounded-full border border-[#2D3748] relative overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#d97707] to-[#ffb77d] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {chartData.length === 0 && (
                <p className="text-xs text-[#dbc2b0]/50 italic text-center py-10">No costs logged yet.</p>
              )}
            </div>
          </div>

          <div className="bg-[#1A1F29] p-3 rounded-lg border border-[#2D3748] text-[11px] text-[#dbc2b0] flex items-center gap-2 mt-4">
            <AlertTriangle className="h-4 w-4 text-[#ffb77d] shrink-0" />
            <p>Financial Analyst permissions allow real-time expense approvals or flag adjustments.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
=======
import { Vehicle, FuelLog } from '../types';
import { Plus } from 'lucide-react';

interface FuelExpensesProps {
  vehicles: Vehicle[];
  fuelLogs: FuelLog[];
  onAddFuelLog: (f: FuelLog) => void;
}

export const FuelExpenses: React.FC<FuelExpensesProps> = ({
  vehicles,
  fuelLogs,
  onAddFuelLog,
}) => {
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [vehicleReg, setVehicleReg] = useState('');
  const [liters, setLiters] = useState('');
  const [costPerLiter, setCostPerLiter] = useState('');

  // Set default vehicle selection
  React.useEffect(() => {
    if (vehicles.length > 0 && !vehicleReg) {
      setVehicleReg(vehicles[0].registrationNumber);
    }
  }, [vehicles, vehicleReg]);

  const totalSpent = fuelLogs.reduce((sum, log) => sum + log.totalCost, 0);
  const totalLiters = fuelLogs.reduce((sum, log) => sum + log.liters, 0);
  const avgCostPerLiter = fuelLogs.length > 0 
    ? fuelLogs.reduce((sum, log) => sum + log.costPerLiter, 0) / fuelLogs.length 
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleReg || !liters || !costPerLiter) {
      alert('Please fill in all details.');
      return;
    }

    const litersNum = parseFloat(liters) || 0;
    const costNum = parseFloat(costPerLiter) || 0;
    const totalCost = litersNum * costNum;

    // Get current date time format (e.g., "2026-07-12 10:30 AM")
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateTime = `${dateStr} ${timeStr}`;

    const newLog: FuelLog = {
      id: `FL-${Math.floor(100 + Math.random() * 900)}`,
      vehicleReg,
      dateTime,
      liters: litersNum,
      costPerLiter: costNum,
      totalCost,
    };

    onAddFuelLog(newLog);
    setShowModal(false);

    // Reset Form
    setLiters('');
    setCostPerLiter('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#38251a]">
        <div>
          <h3 className="font-bold text-lg text-white">Fuel Purchase Ledger</h3>
          <p className="text-xs text-[#dbc2b0]/60">Track and log fuel replenishment operations to analyze platform ROI efficiency.</p>
        </div>
        <button 
          onClick={() => {
            if (vehicles.length > 0) {
              setVehicleReg(vehicles[0].registrationNumber);
            }
            setShowModal(true);
          }}
          className="bg-[#d97707] hover:bg-[#b45309] text-white px-3.5 py-2 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Log Fuel Purchase</span>
        </button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#221610] border border-[#38251a] p-4 rounded shadow-sm">
          <div className="text-[10px] font-bold text-[#dbc2b0]/65 tracking-wider uppercase mb-1">Aggregate Fuel Expenditure</div>
          <div className="text-xl font-bold text-white font-mono" id="fuel-total-expenditure">
            ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-[#dbc2b0]/55 font-semibold mt-1 block">Total billing recorded</span>
        </div>

        <div className="bg-[#221610] border border-[#38251a] p-4 rounded shadow-sm">
          <div className="text-[10px] font-bold text-[#dbc2b0]/65 tracking-wider uppercase mb-1">Total Liters Logged</div>
          <div className="text-xl font-bold text-white font-mono" id="fuel-total-liters">
            {totalLiters.toLocaleString()} L
          </div>
          <span className="text-[10px] text-[#dbc2b0]/55 font-semibold mt-1 block">Cumulative fuel volume</span>
        </div>

        <div className="bg-[#221610] border border-[#38251a] p-4 rounded shadow-sm">
          <div className="text-[10px] font-bold text-[#dbc2b0]/65 tracking-wider uppercase mb-1">Average Cost per Liter</div>
          <div className="text-xl font-bold text-white font-mono" id="fuel-avg-cost">
            ${avgCostPerLiter.toFixed(3)}/L
          </div>
          <span className="text-[10px] text-[#dbc2b0]/55 font-semibold mt-1 block">Platform unit average</span>
        </div>
      </div>

      {/* Fuel Logs Table */}
      <div className="bg-[#221610] border border-[#38251a] rounded overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left divide-y divide-[#38251a]">
            <thead>
              <tr className="bg-[#150e0a]/50 text-[#dbc2b0]/55 font-bold uppercase text-[9px] tracking-wider">
                <th className="p-4">Receipt ID</th>
                <th className="p-4">Asset ID</th>
                <th className="p-4">Refill Date & Time</th>
                <th className="p-4 text-right">Liters Purchased</th>
                <th className="p-4 text-right">Unit Price per Liter</th>
                <th className="p-4 text-right">Aggregate Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38251a]">
              {fuelLogs.map((item) => (
                <tr key={item.id} className="hover:bg-[#301f16]/30 transition-colors">
                  <td className="p-4 font-bold text-white font-mono">{item.id}</td>
                  <td className="p-4 font-bold text-[#ffb77d] font-mono">{item.vehicleReg}</td>
                  <td className="p-4 font-semibold text-[#dbc2b0]/90">{item.dateTime}</td>
                  <td className="p-4 text-right font-mono font-medium">{item.liters.toLocaleString()} L</td>
                  <td className="p-4 text-right font-mono">${item.costPerLiter.toFixed(2)}</td>
                  <td className="p-4 text-right font-mono font-black text-[#ffb77d]">${item.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Log Fuel Receipt */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0e0906]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#221610] border border-[#38251a] rounded shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#150e0a] border-b border-[#38251a] flex items-center justify-between shrink-0">
              <div>
                <h4 className="font-bold text-white text-xs block leading-tight">Log Fuel Purchase</h4>
                <span className="text-[10px] text-[#dbc2b0]/50 block">Track precise fuel ledger metrics.</span>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-[#dbc2b0]/40 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Refilled Fleet Asset</label>
                <select 
                  value={vehicleReg}
                  onChange={(e) => setVehicleReg(e.target.value)}
                  required 
                  className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white"
                >
                  {vehicles.map(v => (
                    <option key={v.registrationNumber} value={v.registrationNumber}>
                      {v.registrationNumber} - {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Liters Purchased</label>
                  <input 
                    type="number" 
                    placeholder="450" 
                    step="0.01"
                    required 
                    value={liters}
                    onChange={(e) => setLiters(e.target.value)}
                    className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/40" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Price per Liter ($)</label>
                  <input 
                    type="number" 
                    placeholder="1.85" 
                    step="0.01"
                    required 
                    value={costPerLiter}
                    onChange={(e) => setCostPerLiter(e.target.value)}
                    className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/40" 
                  />
                </div>
              </div>

              {liters && costPerLiter && (
                <div className="p-3 bg-[#150e0a] border border-[#38251a] rounded text-center">
                  <span className="text-[10px] uppercase font-bold text-[#dbc2b0]/60 block mb-0.5">Calculated Total Cost</span>
                  <span className="text-base font-black text-[#ffb77d] font-mono">
                    ${(parseFloat(liters) * parseFloat(costPerLiter)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-[#301f16] hover:bg-[#38251a] font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded bg-[#d97707] hover:bg-[#b45309] font-bold text-white transition-colors cursor-pointer"
                >
                  Log Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default FuelExpenses;
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
