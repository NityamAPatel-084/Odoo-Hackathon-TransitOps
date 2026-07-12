import React, { useState } from 'react';
import { Vehicle, MaintenanceLog, MaintenanceStatus } from '../types';
import { Plus } from 'lucide-react';

interface MaintenanceOpsProps {
  vehicles: Vehicle[];
  maintenance: MaintenanceLog[];
  onAddMaintenance: (m: MaintenanceLog) => void;
  onResolveRepair: (logId: string) => void;
}

export const MaintenanceOps: React.FC<MaintenanceOpsProps> = ({
  vehicles,
  maintenance,
  onAddMaintenance,
  onResolveRepair,
}) => {
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [vehicleReg, setVehicleReg] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [cost, setCost] = useState('');

  // Set default vehicle selection
  React.useEffect(() => {
    if (vehicles.length > 0 && !vehicleReg) {
      setVehicleReg(vehicles[0].registrationNumber);
    }
  }, [vehicles, vehicleReg]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleReg || !desc || !date || !cost) {
      alert('Please fill in all details.');
      return;
    }

    const logId = `MNT-${Math.floor(100 + Math.random() * 900)}`;
    const newLog: MaintenanceLog = {
      id: logId,
      vehicleReg,
      serviceType: desc,
      date,
      cost: parseFloat(cost) || 0,
      status: MaintenanceStatus.IN_SHOP,
    };

    onAddMaintenance(newLog);
    setShowModal(false);

    // Reset Form
    setDesc('');
    setDate('');
    setCost('');
  };

  const getMaintenanceStatusStyle = (status: MaintenanceStatus): string => {
    switch (status) {
      case MaintenanceStatus.IN_SHOP:
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case MaintenanceStatus.COMPLETED:
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#38251a]">
        <div>
          <h3 className="font-bold text-lg text-white">Fleet Maintenance Ledger</h3>
          <p className="text-xs text-[#dbc2b0]/60">Track preventive maintenance intervals, critical alerts, and service costs.</p>
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
          <span>Schedule PM/Service</span>
        </button>
      </div>

      {/* Maintenance log Table */}
      <div className="bg-[#221610] border border-[#38251a] rounded overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left divide-y divide-[#38251a]">
            <thead>
              <tr className="bg-[#150e0a]/50 text-[#dbc2b0]/55 font-bold uppercase text-[9px] tracking-wider">
                <th className="p-4">Service ID</th>
                <th className="p-4">Asset ID</th>
                <th className="p-4">Service Description</th>
                <th className="p-4">Service Date</th>
                <th className="p-4 text-right">Service Cost</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38251a]">
              {maintenance.map((item) => (
                <tr key={item.id} className="hover:bg-[#301f16]/30 transition-colors">
                  <td className="p-4 font-bold text-white font-mono">{item.id}</td>
                  <td className="p-4 font-bold text-[#ffb77d] font-mono">{item.vehicleReg}</td>
                  <td className="p-4 font-semibold text-white">{item.serviceType}</td>
                  <td className="p-4 font-mono text-[#dbc2b0]/85">{item.date}</td>
                  <td className="p-4 text-right font-mono font-bold">${item.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getMaintenanceStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {item.status === MaintenanceStatus.IN_SHOP ? (
                      <button 
                        onClick={() => onResolveRepair(item.id)}
                        className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Resolve Repair
                      </button>
                    ) : (
                      <span className="text-[#dbc2b0]/40 font-semibold italic text-[10px]">Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Schedule Maintenance PM */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0e0906]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#221610] border border-[#38251a] rounded shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#150e0a] border-b border-[#38251a] flex items-center justify-between shrink-0">
              <div>
                <h4 className="font-bold text-white text-xs block leading-tight">Schedule Preventive PM</h4>
                <span className="text-[10px] text-[#dbc2b0]/50 block">This will pull the vehicle into the shop.</span>
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
                <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Assign Fleet Vehicle</label>
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

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Service Description / Type</label>
                <input 
                  type="text" 
                  placeholder="e.g. Brake Pad Replacement" 
                  required 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/40" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Scheduled Date</label>
                  <input 
                    type="date" 
                    required 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Estimated Cost ($)</label>
                  <input 
                    type="number" 
                    placeholder="450" 
                    required 
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/40" 
                  />
                </div>
              </div>

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
                  Schedule PM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default MaintenanceOps;
