import React, { useState } from 'react';
import { Vehicle, VehicleStatus, UserRole } from '../types';
import { Plus, Search, Tag, Filter, AlertTriangle, Trash2, Edit2, X, Check } from 'lucide-react';

interface FleetRegistryProps {
  vehicles: Vehicle[];
  userRole: UserRole;
  onAddVehicle: (vehicle: Vehicle) => Promise<'ok' | 'duplicate' | 'error'>; // 'ok', 'duplicate', or server 'error'
  onUpdateVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (regNum: string) => void;
}

export default function FleetRegistry({
  vehicles,
  userRole,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
}: FleetRegistryProps) {
  const isManager = userRole === UserRole.FLEET_MANAGER;
  const BADGE_STYLES = { default: "px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider" };
  const BADGE_STYLES = { default: "px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider" };

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReg, setEditingReg] = useState<string | null>(null);

  // Filter states
  const [filters, setFilters] = useState({ type: '', status: '', search: '' });

  // Form states for adding
  const [regNum, setRegNum] = useState('');
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('Tractor (Sleeper)');
  const [capacity, setCapacity] = useState<number>(80000);
  const [odometer, setOdometer] = useState<number>(0);
  const [cost, setCost] = useState<number>(150000);
  const [status, setStatus] = useState<VehicleStatus>(VehicleStatus.AVAILABLE);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states for editing
  const [editName, setEditName] = useState('');
  const [editModel, setEditModel] = useState('');
  const [editType, setEditType] = useState('');
  const [editCapacity, setEditCapacity] = useState<number>(0);
  const [editOdometer, setEditOdometer] = useState<number>(0);
  const [editCost, setEditCost] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<VehicleStatus>(VehicleStatus.AVAILABLE);

  // Handle adding
  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNum || !name || !model) {
      setFormError('Please fill in all required fields.');
      return;
    }
    const cleanRegNum = regNum.trim().toUpperCase();
    
    const newVehicle: Vehicle = {
      registrationNumber: cleanRegNum,
      name: name.trim(),
      model: model.trim(),
      type,
      maxLoadCapacity: capacity,
      odometer,
      acquisitionCost: cost,
      status,
    };

    const result = await onAddVehicle(newVehicle);
    if (result === 'ok') {
      // Reset form
      setRegNum('');
      setName('');
      setModel('');
      setCapacity(80000);
      setOdometer(0);
      setCost(150000);
      setStatus(VehicleStatus.AVAILABLE);
      setFormError(null);
      setShowAddForm(false);
    } else if (result === 'duplicate') {
      setFormError(`Registration number '${cleanRegNum}' already exists. Please use a different unique ID.`);
    } else {
      setFormError('Server error: Could not save vehicle. Make sure the backend server is running on port 3001.');
    }
  };

  // Start editing
  const handleStartEdit = (vehicle: Vehicle) => {
    setEditingReg(vehicle.registrationNumber);
    setEditName(vehicle.name);
    setEditModel(vehicle.model);
    setEditType(vehicle.type);
    setEditCapacity(vehicle.maxLoadCapacity);
    setEditOdometer(vehicle.odometer);
    setEditCost(vehicle.acquisitionCost);
    setEditStatus(vehicle.status);
  };

  // Save edit
  const handleSaveEdit = (regNum: string) => {
    const updatedVehicle: Vehicle = {
      registrationNumber: regNum,
      name: editName,
      model: editModel,
      type: editType,
      maxLoadCapacity: editCapacity,
      odometer: editOdometer,
      acquisitionCost: editCost,
      status: editStatus,
    };
    onUpdateVehicle(updatedVehicle);
    setEditingReg(null);
  };

  /** Filter logic for vehicles */
  // Filtered vehicles
  const filteredVehicles = vehicles.filter((v) => {
    if (filters.type && !v.type.toLowerCase().includes(filters.type.toLowerCase())) {
      return false;
    }
    if (filters.status && v.status !== filters.status) {
      return false;
    }
    if (filters.search) {
      const query = filters.search.toLowerCase();
      return (
        v.registrationNumber.toLowerCase().includes(query) ||
        v.name.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleClearFilters = () => {
    setFilters({ type: '', status: '', search: '' });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header & Actions */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Vehicle Registry</h2>
          <p className="text-xs text-[#dbc2b0] max-w-2xl mt-1">
            Manage and monitor your entire active fleet, cargo specifications, and operational status.
          </p>
        </div>
        
        {isManager ? (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#d97707] hover:bg-[#b45309] text-black font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-[0_2px_10px_rgba(217,119,7,0.2)] border border-[#ffb77d]/30"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAddForm ? 'Close Registry Form' : 'Add Vehicle'}
          </button>
        ) : (
          <div className="text-xs text-[#dbc2b0] bg-[#161A22] border border-[#2D3748] px-3.5 py-2 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#ffb77d]" />
            <span>Only Fleet Managers can edit assets</span>
          </div>
        )}
      </div>

      {/* Add Vehicle Form Panel */}
      {showAddForm && isManager && (
        <div className="bg-[#161A22] border border-[#2D3748] rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-white text-sm mb-4">Register New Fleet Asset</h3>
          {formError && (
            <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-xs text-red-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>{formError}</span>
            </div>
          )}
          <form onSubmit={handleSubmitAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Registration No. (Unique)*</label>
              <input
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                placeholder="e.g. TRK-9040"
                value={regNum}
                onChange={(e) => setRegNum(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Model/Manufacturer*</label>
              <input
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                placeholder="e.g. Freightliner"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Model Year*</label>
              <input
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                placeholder="e.g. 2023 Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Asset Type</label>
              <select
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Tractor (Sleeper)">Tractor (Sleeper)</option>
                <option value="Tractor (Day Cab)">Tractor (Day Cab)</option>
                <option value="Cargo Van">Cargo Van</option>
                <option value="Box Truck">Box Truck</option>
                <option value="Trailer (53')">Trailer (53')</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Max Payload Capacity (kg)</label>
              <input
                type="number"
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Initial Odometer (mi)</label>
              <input
                type="number"
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                value={odometer}
                onChange={(e) => setOdometer(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Acquisition Cost ($)</label>
              <input
                type="number"
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Lifecycle Status</label>
              <select
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                value={status}
                onChange={(e) => setStatus(e.target.value as VehicleStatus)}
              >
                <option value={VehicleStatus.AVAILABLE}>Available</option>
                <option value={VehicleStatus.IN_SHOP}>In Shop</option>
                <option value={VehicleStatus.RETIRED}>Retired</option>
              </select>
            </div>
            <div className="lg:col-span-4 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-transparent border border-[#2D3748] text-[#dbc2b0] hover:bg-[#1E293B]/50 px-4 py-1.5 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#d97707] hover:bg-[#b45309] text-black px-4 py-1.5 rounded-lg text-xs font-bold"
              >
                Register Asset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters Strip */}
      <div className="bg-[#161A22] border border-[#2D3748] rounded-xl p-3 flex flex-col sm:flex-row gap-4 items-center shadow-sm">
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Filter className="h-4 w-4 text-[#dbc2b0]" />
          <span className="text-xs text-[#dbc2b0] font-semibold">Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto items-center">
          <select
            value={filters.type}
            onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
            className="bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ffb77d] cursor-pointer min-w-[120px]"
          >
            <option value="">All Types</option>
            <option value="Tractor">Tractor</option>
            <option value="Trailer">Trailer</option>
            <option value="Box Truck">Box Truck</option>
            <option value="Van">Cargo Van</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
            className="bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ffb77d] cursor-pointer min-w-[120px]"
          >
            <option value="">All Statuses</option>
            <option value={VehicleStatus.AVAILABLE}>Available</option>
            <option value={VehicleStatus.ON_TRIP}>On Trip</option>
            <option value={VehicleStatus.IN_SHOP}>In Shop</option>
            <option value={VehicleStatus.RETIRED}>Retired</option>
          </select>

          <div className="relative flex-1 sm:max-w-xs min-w-[200px]">
            <Search className="h-4 w-4 text-[#dbc2b0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              className="w-full bg-[#0D0F14] border border-[#2D3748] rounded pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ffb77d] placeholder-[#dbc2b0]/50"
              placeholder="Reg. No., VIN or Model..."
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>
        </div>

        <button
          onClick={handleClearFilters}
          className="sm:ml-auto text-xs text-[#ffb77d] hover:underline shrink-0"
        >
          Clear Filters
        </button>
      </div>

      {/* Vehicles Data Table */}
      <div className="bg-[#161A22] border border-[#2D3748] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E293B]/50 border-b border-[#2D3748]">
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3">Reg. No.</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3">Name/Model</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3">Type</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3 text-right">Capacity</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3 text-right">Odometer</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3 text-right">Acquisition Cost</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3 text-center">Status</th>
                {isManager && <th className="px-4 py-3 w-28 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="text-xs text-[#dbc2b0] divide-y divide-[#2D3748]/50">
              {filteredVehicles.map((vehicle) => {
                const isEditing = editingReg === vehicle.registrationNumber;

                return (
                  <tr key={vehicle.registrationNumber} className={`hover:bg-[#1E293B]/40 transition-colors group ${
                    vehicle.status === VehicleStatus.RETIRED ? 'opacity-50 bg-[#0D0F14]/20' : ''
                  }`}>
                    {/* Reg No */}
                    <td className="px-4 py-3 font-mono font-bold text-white">{vehicle.registrationNumber}</td>

                    {/* Name/Model */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input
                            className="bg-[#0D0F14] border border-[#2D3748] rounded px-2 py-0.5 text-xs text-white"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                          <input
                            className="bg-[#0D0F14] border border-[#2D3748] rounded px-2 py-0.5 text-xs text-white"
                            value={editModel}
                            onChange={(e) => setEditModel(e.target.value)}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="font-bold text-white">{vehicle.name}</div>
                          <div className="text-[10px] text-[#dbc2b0]/70">{vehicle.model}</div>
                        </>
                      )}
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          className="bg-[#0D0F14] border border-[#2D3748] rounded px-2 py-0.5 text-xs text-white"
                          value={editType}
                          onChange={(e) => setEditType(e.target.value)}
                        >
                          <option value="Tractor (Sleeper)">Tractor (Sleeper)</option>
                          <option value="Tractor (Day Cab)">Tractor (Day Cab)</option>
                          <option value="Cargo Van">Cargo Van</option>
                          <option value="Box Truck">Box Truck</option>
                          <option value="Trailer (53')">Trailer (53')</option>
                        </select>
                      ) : (
                        vehicle.type
                      )}
                    </td>

                    {/* Capacity */}
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          className="bg-[#0D0F14] border border-[#2D3748] rounded px-2 py-0.5 text-xs text-white text-right w-24"
                          value={editCapacity}
                          onChange={(e) => setEditCapacity(Number(e.target.value))}
                        />
                      ) : (
                        `${vehicle.maxLoadCapacity.toLocaleString()} kg`
                      )}
                    </td>

                    {/* Odometer */}
                    <td className="px-4 py-3 text-right text-white font-medium">
                      {isEditing ? (
                        <input
                          type="number"
                          className="bg-[#0D0F14] border border-[#2D3748] rounded px-2 py-0.5 text-xs text-white text-right w-24"
                          value={editOdometer}
                          onChange={(e) => setEditOdometer(Number(e.target.value))}
                        />
                      ) : (
                        vehicle.status === VehicleStatus.RETIRED ? 'N/A' : `${vehicle.odometer.toLocaleString()} mi`
                      )}
                    </td>

                    {/* Acquisition Cost */}
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          className="bg-[#0D0F14] border border-[#2D3748] rounded px-2 py-0.5 text-xs text-white text-right w-24"
                          value={editCost}
                          onChange={(e) => setEditCost(Number(e.target.value))}
                        />
                      ) : (
                        `$${vehicle.acquisitionCost.toLocaleString()}`
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <select
                          className="bg-[#0D0F14] border border-[#2D3748] rounded px-2 py-0.5 text-xs text-white"
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as VehicleStatus)}
                        >
                          <option value={VehicleStatus.AVAILABLE}>Available</option>
                          <option value={VehicleStatus.ON_TRIP}>On Trip</option>
                          <option value={VehicleStatus.IN_SHOP}>In Shop</option>
                          <option value={VehicleStatus.RETIRED}>Retired</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center justify-center font-bold text-[10px] tracking-wider px-2.5 py-0.5 rounded border uppercase w-24 ${
                          vehicle.status === VehicleStatus.AVAILABLE ? 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30' :
                          vehicle.status === VehicleStatus.ON_TRIP ? 'bg-[#3B82F6]/15 text-[#60A5FA] border-[#3B82F6]/30' :
                          vehicle.status === VehicleStatus.IN_SHOP ? 'bg-[#d97707]/15 text-[#ffb77d] border-[#d97707]/30' :
                          'bg-neutral-800 text-neutral-400 border-neutral-700'
                        }`}>
                          {vehicle.status}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    {isManager && (
                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleSaveEdit(vehicle.registrationNumber)}
                              className="text-green-400 hover:text-green-300 p-1 bg-green-500/10 rounded"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingReg(null)}
                              className="text-red-400 hover:text-red-300 p-1 bg-red-500/10 rounded"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleStartEdit(vehicle)}
                              className="text-[#ffb77d] hover:text-[#d97707] p-1 rounded"
                              title="Edit Asset"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${vehicle.registrationNumber}?`)) {
                                  onDeleteVehicle(vehicle.registrationNumber);
                                }
                              }}
                              className="text-red-400 hover:text-red-500 p-1 rounded"
                              title="Delete Asset"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}

              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan={isManager ? 8 : 7} className="text-center py-8 text-xs text-[#dbc2b0]/50 font-medium">
                    No fleet vehicles match the active search or filter guidelines.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Notes & Summary */}
        <div className="bg-[#1A1F29] p-3.5 border-t border-[#2D3748] flex flex-col sm:flex-row justify-between items-center text-[11px] gap-2">
          <div className="flex items-center gap-2 text-[#ffb77d]">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Registration numbers must be unique. Retired/In Shop vehicles are hidden from dispatch pools.</span>
          </div>
          <div className="text-[#dbc2b0]/70 font-semibold">
            Showing {filteredVehicles.length} of {vehicles.length} Assets
          </div>
        </div>
      </div>
    </div>
  );
}
