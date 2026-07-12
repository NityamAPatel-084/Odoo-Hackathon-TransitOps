import React, { useState } from 'react';
import { Vehicle, VehicleStatus } from '../types';
import { Plus, Search, MoreHorizontal } from 'lucide-react';

interface FleetRegistryProps {
  vehicles: Vehicle[];
  onAddVehicle: (v: Vehicle) => void;
}

export const FleetRegistry: React.FC<FleetRegistryProps> = ({ vehicles, onAddVehicle }) => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchVal, setSearchVal] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form states for new vehicle
  const [reg, setReg] = useState('');
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('Tractor (Sleeper)');
  const [capacity, setCapacity] = useState('');
  const [odometer, setOdometer] = useState('');
  const [cost, setCost] = useState('');

  const filteredVehicles = vehicles.filter(v => {
    // Search match
    const matchesSearch = 
      v.registrationNumber.toLowerCase().includes(searchVal.toLowerCase()) ||
      v.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      v.model.toLowerCase().includes(searchVal.toLowerCase()) ||
      v.type.toLowerCase().includes(searchVal.toLowerCase());
    
    // Type match
    let matchesType = true;
    if (typeFilter !== 'all') {
      matchesType = v.type.toLowerCase().includes(typeFilter.toLowerCase());
    }

    // Status match
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = v.status.toLowerCase() === statusFilter.replace('_', ' ').toLowerCase();
    }

    return matchesSearch && matchesType && matchesStatus;
  });

  const getVehicleStatusClass = (status: VehicleStatus): string => {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case VehicleStatus.ON_TRIP:
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case VehicleStatus.IN_SHOP:
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case VehicleStatus.RETIRED:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
      default:
        return 'bg-[#38251a]/30 border-[#38251a]/80 text-[#dbc2b0]/80';
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reg || !name || !model) {
      alert('Please fill in all details.');
      return;
    }

    const cleanedReg = reg.trim().toUpperCase();
    if (vehicles.some(v => v.registrationNumber === cleanedReg)) {
      alert(`Asset registration number ${cleanedReg} already exists.`);
      return;
    }

    const newVehicle: Vehicle = {
      registrationNumber: cleanedReg,
      name,
      model,
      type,
      maxLoadCapacity: parseInt(capacity) || 0,
      odometer: parseInt(odometer) || 0,
      acquisitionCost: parseInt(cost) || 0,
      status: VehicleStatus.AVAILABLE,
    };

    onAddVehicle(newVehicle);
    setShowModal(false);

    // Reset form
    setReg('');
    setName('');
    setModel('');
    setType('Tractor (Sleeper)');
    setCapacity('');
    setOdometer('');
    setCost('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#38251a]">
        <div>
          <h3 className="font-bold text-lg text-white">Fleet Asset Register</h3>
          <p className="text-xs text-[#dbc2b0]/60">Complete registry of trailers, tractors, box trucks, and cargo vans.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#d97707] hover:bg-[#b45309] text-white px-3.5 py-2 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Asset</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#221610] p-4 border border-[#38251a] rounded flex flex-col md:flex-row gap-4 items-end text-xs">
        <div className="w-full md:w-1/4 space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-[#dbc2b0]/60">Filter by Vehicle Type</label>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#ffb77d]"
          >
            <option value="all">All Vehicle Types</option>
            <option value="tractor">Tractor (Sleeper & Cab)</option>
            <option value="van">Cargo Van</option>
            <option value="box_truck">Box Truck</option>
            <option value="trailer">Trailer</option>
          </select>
        </div>

        <div className="w-full md:w-1/4 space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-[#dbc2b0]/60">Filter by Status</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#ffb77d]"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="on_trip">On Trip</option>
            <option value="in_shop">In Shop</option>
            <option value="retired">Retired</option>
          </select>
        </div>

        <div className="w-full md:w-2/4 space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-[#dbc2b0]/60">Search Registry</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by registration #, brand, make, or specs..." 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/45 focus:outline-none focus:border-[#d97707] pl-8"
            />
            <Search className="h-4 w-4 text-[#dbc2b0]/40 absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-[#221610] border border-[#38251a] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-[#38251a]">
            <thead>
              <tr className="bg-[#150e0a]/50 text-[#dbc2b0]/55 font-bold uppercase text-[9px] tracking-wider">
                <th className="p-4">Reg Number</th>
                <th className="p-4">Manufacturer & Model</th>
                <th className="p-4">Vehicle Type</th>
                <th className="p-4 text-right">Max Load Capacity</th>
                <th className="p-4 text-right">Odometer (mi)</th>
                <th className="p-4 text-right">Acquisition Cost</th>
                <th className="p-4">Operational Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38251a]">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#dbc2b0]/50 font-medium">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span>No matching fleet assets found with current filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((v) => (
                  <tr key={v.registrationNumber} className="hover:bg-[#301f16]/30 transition-colors">
                    <td className="p-4 font-bold text-white font-mono">{v.registrationNumber}</td>
                    <td className="p-4">
                      <div className="font-semibold text-[#dbc2b0]/95">{v.name}</div>
                      <div className="text-[10px] text-[#dbc2b0]/50 mt-0.5">{v.model}</div>
                    </td>
                    <td className="p-4 text-[#dbc2b0]/80">{v.type}</td>
                    <td className="p-4 text-right font-mono">{v.maxLoadCapacity.toLocaleString()} lbs</td>
                    <td className="p-4 text-right font-mono">{v.odometer.toLocaleString()} mi</td>
                    <td className="p-4 text-right font-mono text-[#dbc2b0]/90">${v.acquisitionCost.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getVehicleStatusClass(v.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        <span>{v.status}</span>
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => alert(`Asset: ${v.registrationNumber} controls loaded.`)}
                        className="p-1 rounded hover:bg-[#301f16] text-[#dbc2b0]/60 hover:text-white transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Add Vehicle */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0e0906]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#221610] border border-[#38251a] rounded shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#150e0a] border-b border-[#38251a] flex items-center justify-between shrink-0">
              <div>
                <h4 className="font-bold text-white text-xs block leading-tight">Register New Fleet Asset</h4>
                <span className="text-[10px] text-[#dbc2b0]/50 block">Define logistics metrics for dispatch scheduling.</span>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-[#dbc2b0]/40 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Registration Number</label>
                  <input 
                    type="text" 
                    placeholder="TRK-9000" 
                    required 
                    value={reg}
                    onChange={(e) => setReg(e.target.value)}
                    className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/40 uppercase" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Vehicle Type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white"
                  >
                    <option value="Tractor (Sleeper)">Tractor (Sleeper)</option>
                    <option value="Tractor (Day Cab)">Tractor (Day Cab)</option>
                    <option value="Cargo Van">Cargo Van</option>
                    <option value="Box Truck">Box Truck</option>
                    <option value="Trailer (53')">Trailer (53')</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Asset Name (Brand / Model Group)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Kenworth T680" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/40" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Manufacturer Model Year</label>
                <input 
                  type="text" 
                  placeholder="e.g. 2024 Model" 
                  required 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/40" 
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Load Limit (lbs)</label>
                  <input 
                    type="number" 
                    placeholder="80000" 
                    required 
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/40" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Odometer (mi)</label>
                  <input 
                    type="number" 
                    placeholder="150" 
                    required 
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value)}
                    className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/40" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-[#dbc2b0]/70">Cost ($)</label>
                  <input 
                    type="number" 
                    placeholder="175000" 
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
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default FleetRegistry;
