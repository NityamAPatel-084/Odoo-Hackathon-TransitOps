import React, { useState } from 'react';
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
