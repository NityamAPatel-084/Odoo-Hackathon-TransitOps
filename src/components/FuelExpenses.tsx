import React, { useState } from 'react';
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
