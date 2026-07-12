import React, { useState } from 'react';
import { Driver, DriverStatus } from '../types';
import { Plus, Shield, User } from 'lucide-react';

interface DriversManagementProps {
  drivers: Driver[];
  onAddDriver: (d: Driver) => void;
}

export const DriversManagement: React.FC<DriversManagementProps> = ({ drivers, onAddDriver }) => {
  const [showModal, setShowModal] = useState(false);

  // Form states for new driver
  const [name, setName] = useState('');
  const [license, setLicense] = useState('');
  const [category, setCategory] = useState('');
  const [expiry, setExpiry] = useState('');
  const [contact, setContact] = useState('');

  const getDriverStatusClass = (status: DriverStatus): string => {
    switch (status) {
      case DriverStatus.AVAILABLE:
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case DriverStatus.ON_TRIP:
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case DriverStatus.OFF_DUTY:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
      case DriverStatus.SUSPENDED:
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      default:
        return 'bg-[#38251a]/30 border-[#38251a]/80 text-[#dbc2b0]/80';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !license || !category || !expiry || !contact) {
      alert('Please fill in all details.');
      return;
    }

    const newDriverId = `DRV-${Math.floor(100 + Math.random() * 900)}`;
    const newDriver: Driver = {
      id: newDriverId,
      name,
      licenseNumber: license,
      licenseCategory: category,
      licenseExpiryDate: expiry,
      contactNumber: contact,
      safetyScore: 90, // Default safety score
      status: DriverStatus.AVAILABLE,
      tripCompletionRate: 100,
    };

    onAddDriver(newDriver);
    setShowModal(false);

    // Reset form
    setName('');
    setLicense('');
    setCategory('');
    setExpiry('');
    setContact('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#38251a]">
        <div>
          <h3 className="font-bold text-lg text-white">Commercial Drivers Register</h3>
          <p className="text-xs text-[#dbc2b0]/60">Manage commercial driving credentials, active state, and safety telemetry.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#d97707] hover:bg-[#b45309] text-white px-3.5 py-2 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Driver</span>
        </button>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="drivers-grid">
        {drivers.map((driver) => {
          const statusClass = getDriverStatusClass(driver.status);
          const scoreColor = driver.safetyScore >= 90 ? 'text-green-400' : driver.safetyScore >= 80 ? 'text-amber-400' : 'text-red-400';
          const scoreBg = driver.safetyScore >= 90 ? 'bg-green-500/10 border-green-500/20' : driver.safetyScore >= 80 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20';

          return (
            <div key={driver.id} className="bg-[#221610] border border-[#38251a] rounded p-4 flex flex-col justify-between hover:border-[#dbc2b0]/35 transition-all space-y-4">
              {/* Top Title Row */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-[#d97707]/10 flex items-center justify-center font-bold text-[#ffb77d] text-sm border border-[#d97707]/30">
                    {driver.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block">{driver.name}</span>
                    <span className="text-[10px] text-[#dbc2b0]/50 font-mono block mt-0.5">{driver.id}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${statusClass}`}>
                  {driver.status}
                </span>
              </div>

              {/* Middle Attributes */}
              <div className="space-y-1.5 text-[11px] border-t border-b border-[#38251a]/50 py-3 font-medium">
                <div className="flex justify-between">
                  <span className="text-[#dbc2b0]/55">CDL License:</span>
                  <span className="text-white font-semibold font-mono">{driver.licenseNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#dbc2b0]/55">Category/Scope:</span>
                  <span className="text-white">{driver.licenseCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#dbc2b0]/55">CDL Expiration:</span>
                  <span className="text-white font-mono">{driver.licenseExpiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#dbc2b0]/55">Contact:</span>
                  <span className="text-white font-mono">{driver.contactNumber}</span>
                </div>
              </div>

              {/* Bottom Safety metrics */}
              <div className="flex justify-between items-center">
                <div className={`px-2 py-1 rounded border ${scoreBg} flex items-center gap-1.5`}>
                  <Shield className={`h-3.5 w-3.5 ${scoreColor}`} />
                  <span className="text-[10px] font-bold text-[#dbc2b0]/65">Safety:</span>
                  <span className={`text-xs font-black ${scoreColor}`}>{driver.safetyScore}</span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-[#dbc2b0]/50 uppercase block font-bold">Transit Completion</span>
                  <span className="text-xs font-black text-white font-mono">{driver.tripCompletionRate}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal - Register Driver */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0e0906]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#221610] border border-[#38251a] rounded shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#150e0a] border-b border-[#38251a] flex items-center justify-between shrink-0">
              <div>
                <h4 className="font-bold text-white text-xs block leading-tight">Register Commercial CDL Driver</h4>
                <span className="text-[10px] text-[#dbc2b0]/50 block">Log license category, expiry and safety baseline.</span>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-[#dbc2b0]/40 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Full Driver Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Marcus Johnson" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/40" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Commercial CDL License #</label>
                <input 
                  type="text" 
                  placeholder="e.g. CDL-A 847291" 
                  required 
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/40" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">License Category / Scope</label>
                <input 
                  type="text" 
                  placeholder="e.g. Heavy Freight / Long Haul" 
                  required 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/40" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Expiration Date</label>
                  <input 
                    type="date" 
                    required 
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Contact Phone</label>
                  <input 
                    type="text" 
                    placeholder="e.g. (555) 019-2834" 
                    required 
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
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
                  Add Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default DriversManagement;
