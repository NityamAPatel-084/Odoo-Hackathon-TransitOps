import React, { useState } from 'react';
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
