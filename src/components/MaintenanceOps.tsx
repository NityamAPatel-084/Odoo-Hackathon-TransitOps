import React, { useState } from 'react';
<<<<<<< HEAD
import { MaintenanceLog, MaintenanceStatus, Vehicle, VehicleStatus, UserRole } from '../types';
import { Wrench, Plus, CheckCircle, Clock, AlertTriangle, ArrowRight, DollarSign, Calendar, X } from 'lucide-react';

interface MaintenanceOpsProps {
  logs: MaintenanceLog[];
  vehicles: Vehicle[];
  userRole: UserRole;
  onAddLog: (log: MaintenanceLog) => void;
  onCompleteLog: (logId: string) => void;
}

export default function MaintenanceOps({
  logs,
  vehicles,
  userRole,
  onAddLog,
  onCompleteLog,
}: MaintenanceOpsProps) {
  const isManager = userRole === UserRole.FLEET_MANAGER;

  const [showForm, setShowForm] = useState(false);

  // Form states
  const [selectedVehicleReg, setSelectedVehicleReg] = useState('');
  const [serviceType, setServiceType] = useState('Engine Diagnostic');
  const [cost, setCost] = useState<number>(350);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<MaintenanceStatus>(MaintenanceStatus.IN_SHOP);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleReg || !serviceType || !date) {
      setFormError('Please fill in all fields.');
      return;
    }

    const newLog: MaintenanceLog = {
      id: `MNT-${Math.floor(100 + Math.random() * 900)}`,
      vehicleReg: selectedVehicleReg,
      serviceType,
      date,
      cost,
      status,
    };

    onAddLog(newLog);

    // Reset Form
    setSelectedVehicleReg('');
    setServiceType('Engine Diagnostic');
    setCost(350);
    setDate(new Date().toISOString().split('T')[0]);
    setStatus(MaintenanceStatus.IN_SHOP);
    setFormError(null);
    setShowForm(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Maintenance Service Logs</h2>
          <p className="text-xs text-[#dbc2b0] max-w-2xl mt-1">
            Log preventative service and manage current shop statuses. Creating a shop record automatically puts assets out-of-service.
          </p>
        </div>

        {isManager ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#d97707] hover:bg-[#b45309] text-black font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-[0_2px_10px_rgba(217,119,7,0.2)] border border-[#ffb77d]/30"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Close Logging' : 'Log Maintenance Service'}
          </button>
        ) : (
          <div className="text-xs text-[#dbc2b0] bg-[#161A22] border border-[#2D3748] px-3.5 py-2 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#ffb77d]" />
            <span>Only Fleet Managers can request service logs</span>
          </div>
        )}
      </div>

      {/* Available-to-Maintenance Workflow Diagram */}
      <div className="bg-[#161A22] border border-[#2D3748] rounded-xl p-4 shadow-sm">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Operational State Transitions</h4>
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between bg-[#0D0F14] p-4 rounded-lg border border-[#2D3748]/50">
          <div className="flex items-center gap-3">
            <div className="bg-[#10B981]/10 text-[#34D399] px-3 py-1.5 rounded-lg font-bold border border-[#10B981]/30 text-xs text-center w-36">
              AVAILABLE
            </div>
            <p className="text-[11px] text-[#dbc2b0] max-w-[150px]">Asset is operational and in the dispatch pool.</p>
          </div>

          <div className="hidden md:block">
            <ArrowRight className="h-4 w-4 text-[#ffb77d]" />
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#d97707]/10 text-[#ffb77d] px-3 py-1.5 rounded-lg font-bold border border-[#d97707]/30 text-xs text-center w-36">
              CREATE SHOP LOG
            </div>
            <p className="text-[11px] text-[#dbc2b0] max-w-[150px]">Puts asset in "In Shop" state. Hidden from dispatch.</p>
          </div>

          <div className="hidden md:block">
            <ArrowRight className="h-4 w-4 text-[#ffb77d]" />
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#10B981]/10 text-[#34D399] px-3 py-1.5 rounded-lg font-bold border border-[#10B981]/30 text-xs text-center w-36">
              CLOSE LOG
            </div>
            <p className="text-[11px] text-[#dbc2b0] max-w-[150px]">Restores asset back to "Available" instantly.</p>
          </div>
        </div>
      </div>

      {/* Form Toggle */}
      {showForm && isManager && (
        <div className="bg-[#161A22] border border-[#2D3748] rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-white text-sm mb-4">Log New Service Record</h3>
          {formError && (
            <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-xs text-red-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>{formError}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Target Vehicle*</label>
              <select
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d] cursor-pointer appearance-none"
                value={selectedVehicleReg}
                onChange={(e) => setSelectedVehicleReg(e.target.value)}
                required
              >
                <option value="">-- Choose Asset --</option>
                {vehicles.map((v) => (
                  <option key={v.registrationNumber} value={v.registrationNumber}>
                    {v.registrationNumber} - {v.name} ({v.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Service Type*</label>
              <select
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d] cursor-pointer"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                required
              >
                <option value="Engine Diagnostic">Engine Diagnostic</option>
                <option value="Brake Pad Replacement">Brake Pad Replacement</option>
                <option value="Tire Rotation">Tire Rotation</option>
                <option value="PM Service (A)">PM Service (A)</option>
                <option value="PM Service (B)">PM Service (B)</option>
                <option value="Transmission Overhaul">Transmission Overhaul</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Service Date*</label>
              <input
                type="date"
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Service Cost ($)*</label>
              <input
                type="number"
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Shop Entry Status</label>
              <select
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                value={status}
                onChange={(e) => setStatus(e.target.value as MaintenanceStatus)}
              >
                <option value={MaintenanceStatus.IN_SHOP}>In Shop (Active Service)</option>
                <option value={MaintenanceStatus.COMPLETED}>Completed (Instantly Available)</option>
              </select>
            </div>

            <div className="lg:col-span-5 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-transparent border border-[#2D3748] text-[#dbc2b0] hover:bg-[#1E293B]/50 px-4 py-1.5 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#d97707] hover:bg-[#b45309] text-black px-4 py-1.5 rounded-lg text-xs font-bold"
              >
                Register Shop Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Maintenance Table Board */}
      <div className="bg-[#161A22] border border-[#2D3748] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E293B]/50 border-b border-[#2D3748]">
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3">Log ID</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3">Vehicle</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3">Service Details</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3">Date logged</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3 text-right">Cost</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3 text-center">Lifecycle Status</th>
                {isManager && <th className="px-4 py-3 w-32 text-right">Shop Controls</th>}
              </tr>
            </thead>
            <tbody className="text-xs text-[#dbc2b0] divide-y divide-[#2D3748]/50">
              {logs.map((log) => {
                const vehicle = vehicles.find((v) => v.registrationNumber === log.vehicleReg);
                return (
                  <tr key={log.id} className="hover:bg-[#1E293B]/40 transition-colors">
                    {/* Log ID */}
                    <td className="px-4 py-3 font-mono font-bold text-white">{log.id}</td>

                    {/* Vehicle */}
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{log.vehicleReg}</div>
                      <div className="text-[10px] text-[#dbc2b0]/70">{vehicle?.name || 'Class 8 Truck'}</div>
                    </td>

                    {/* Service Details */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{log.serviceType}</div>
                      <div className="text-[10px] text-[#dbc2b0]/70">Telematic-triggered repair</div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3">
                      <span className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-[#ffb77d]" /> {log.date}
                      </span>
                    </td>

                    {/* Cost */}
                    <td className="px-4 py-3 text-right text-white font-bold font-mono">
                      <span className="inline-flex items-center">
                        <DollarSign className="h-3 w-3 text-[#ffb77d]" />
                        {log.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 font-bold text-[10px] tracking-wider px-2.5 py-0.5 rounded border uppercase ${
                        log.status === MaintenanceStatus.COMPLETED ? 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30' :
                        'bg-[#d97707]/15 text-[#ffb77d] border-[#d97707]/30 animate-pulse'
                      }`}>
                        {log.status === MaintenanceStatus.COMPLETED ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {log.status}
                      </span>
                    </td>

                    {/* Shop Controls */}
                    {isManager && (
                      <td className="px-4 py-3 text-right">
                        {log.status === MaintenanceStatus.IN_SHOP ? (
                          <button
                            onClick={() => onCompleteLog(log.id)}
                            className="bg-[#10B981] hover:bg-[#059669] text-white font-bold text-[10px] py-1 px-2.5 rounded transition-colors"
                          >
                            Close Log (Release)
                          </button>
                        ) : (
                          <span className="text-[10px] text-[#dbc2b0]/50 font-semibold italic"> Released</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}

              {logs.length === 0 && (
                <tr>
                  <td colSpan={isManager ? 7 : 6} className="text-center py-8 text-xs text-[#dbc2b0]/50 font-medium">
                    No active shop service logs found.
                  </td>
                </tr>
              )}
=======
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
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
            </tbody>
          </table>
        </div>
      </div>
<<<<<<< HEAD
    </div>
  );
}
=======

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
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
