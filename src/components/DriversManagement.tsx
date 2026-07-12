import React, { useState } from 'react';
import { Driver, DriverStatus, UserRole } from '../types';
import { Plus, Search, Filter, AlertTriangle, CheckCircle, ShieldAlert, X, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

interface DriversManagementProps {
  drivers: Driver[];
  userRole: UserRole;
  onAddDriver: (driver: Driver) => void;
  onUpdateDriver: (driver: Driver) => void;
  onDeleteDriver: (id: string) => void;
}

export default function DriversManagement({
  drivers,
  userRole,
  onAddDriver,
  onUpdateDriver,
  onDeleteDriver,
}: DriversManagementProps) {
  // Who can edit drivers? Fleet Manager and Safety Officer.
  const isAllowedToEdit = userRole === UserRole.FLEET_MANAGER || userRole === UserRole.SAFETY_OFFICER;

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [licenseNum, setLicenseNum] = useState('');
  const [licenseCat, setLicenseCat] = useState('Heavy Freight');
  const [expiry, setExpiry] = useState('');
  const [contact, setContact] = useState('');
  const [safetyScore, setSafetyScore] = useState<number>(90);
  const [completionRate, setCompletionRate] = useState<number>(95);
  const [status, setStatus] = useState<DriverStatus>(DriverStatus.AVAILABLE);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit states
  const [editName, setEditName] = useState('');
  const [editLicenseNum, setEditLicenseNum] = useState('');
  const [editLicenseCat, setEditLicenseCat] = useState('');
  const [editExpiry, setEditExpiry] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editSafetyScore, setEditSafetyScore] = useState<number>(0);
  const [editCompletionRate, setEditCompletionRate] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<DriverStatus>(DriverStatus.AVAILABLE);

  // Date Check
  const todayStr = new Date().toISOString().split('T')[0];
  const isExpired = (dateStr: string) => dateStr < todayStr;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !licenseNum || !expiry || !contact) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const isExp = isExpired(expiry);
    const finalStatus = isExp ? DriverStatus.SUSPENDED : status;

    const newDriver: Driver = {
      id: `DRV-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      licenseNumber: licenseNum.trim(),
      licenseCategory: licenseCat,
      licenseExpiryDate: expiry,
      contactNumber: contact.trim(),
      safetyScore,
      status: finalStatus,
      tripCompletionRate: completionRate,
    };

    onAddDriver(newDriver);
    // Reset Form
    setName('');
    setLicenseNum('');
    setExpiry('');
    setContact('');
    setSafetyScore(90);
    setCompletionRate(95);
    setStatus(DriverStatus.AVAILABLE);
    setFormError(null);
    setShowAddForm(false);
  };

  const handleStartEdit = (driver: Driver) => {
    setEditingId(driver.id);
    setEditName(driver.name);
    setEditLicenseNum(driver.licenseNumber);
    setEditLicenseCat(driver.licenseCategory);
    setEditExpiry(driver.licenseExpiryDate);
    setEditContact(driver.contactNumber);
    setEditSafetyScore(driver.safetyScore);
    setEditCompletionRate(driver.tripCompletionRate);
    setEditStatus(driver.status);
  };

  const handleSaveEdit = (id: string) => {
    const isExp = isExpired(editExpiry);
    const finalStatus = isExp ? DriverStatus.SUSPENDED : editStatus;

    const updated: Driver = {
      id,
      name: editName,
      licenseNumber: editLicenseNum,
      licenseCategory: editLicenseCat,
      licenseExpiryDate: editExpiry,
      contactNumber: editContact,
      safetyScore: editSafetyScore,
      status: finalStatus,
      tripCompletionRate: editCompletionRate,
    };

    onUpdateDriver(updated);
    setEditingId(null);
  };

  const filteredDrivers = drivers.filter((d) => {
    if (selectedStatus && d.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.licenseNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header and Add Action */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Driver Registry</h2>
          <p className="text-xs text-[#dbc2b0] max-w-2xl mt-1">
            Track operator qualifications, dynamic safety scoring, CDL compliance, and status block rules.
          </p>
        </div>

        {isAllowedToEdit ? (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#d97707] hover:bg-[#b45309] text-black font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-[0_2px_10px_rgba(217,119,7,0.2)] border border-[#ffb77d]/30"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAddForm ? 'Close Driver Form' : 'Register Operator'}
          </button>
        ) : (
          <div className="text-xs text-[#dbc2b0] bg-[#161A22] border border-[#2D3748] px-3.5 py-2 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#ffb77d]" />
            <span>Only Fleet Managers / Safety Officers can edit profiles</span>
          </div>
        )}
      </div>

      {/* Add Operator Form */}
      {showAddForm && isAllowedToEdit && (
        <div className="bg-[#161A22] border border-[#2D3748] rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-white text-sm mb-4">Register New Commercial Operator</h3>
          {formError && (
            <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-xs text-red-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>{formError}</span>
            </div>
          )}
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Operator Full Name*</label>
              <input
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                placeholder="e.g. David Kim"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">CDL / License Number*</label>
              <input
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                placeholder="e.g. CDL-A 847291"
                value={licenseNum}
                onChange={(e) => setLicenseNum(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">License Category</label>
              <select
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                value={licenseCat}
                onChange={(e) => setLicenseCat(e.target.value)}
              >
                <option value="Heavy Freight">Heavy Freight</option>
                <option value="Long Haul">Long Haul</option>
                <option value="Local Delivery">Local Delivery</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">License Expiry Date*</label>
              <input
                type="date"
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Contact Phone*</label>
              <input
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                placeholder="e.g. (555) 019-2834"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Initial Safety Score (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                value={safetyScore}
                onChange={(e) => setSafetyScore(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Trip Completion Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                value={completionRate}
                onChange={(e) => setCompletionRate(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Initial Status</label>
              <select
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                value={status}
                onChange={(e) => setStatus(e.target.value as DriverStatus)}
              >
                <option value={DriverStatus.AVAILABLE}>Available</option>
                <option value={DriverStatus.OFF_DUTY}>Off Duty</option>
                <option value={DriverStatus.SUSPENDED}>Suspended</option>
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
                Register Operator
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#161A22] border border-[#2D3748] rounded-xl p-3 flex flex-col sm:flex-row gap-4 items-center shadow-sm">
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Filter className="h-4 w-4 text-[#dbc2b0]" />
          <span className="text-xs text-[#dbc2b0] font-semibold">Compliance Filter:</span>
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto items-center">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ffb77d] cursor-pointer min-w-[150px]"
          >
            <option value="">All Operational Statuses</option>
            <option value={DriverStatus.AVAILABLE}>Available</option>
            <option value={DriverStatus.ON_TRIP}>On Trip</option>
            <option value={DriverStatus.OFF_DUTY}>Off Duty</option>
            <option value={DriverStatus.SUSPENDED}>Suspended</option>
          </select>

          <div className="relative flex-1 sm:max-w-xs min-w-[220px]">
            <Search className="h-4 w-4 text-[#dbc2b0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              className="w-full bg-[#0D0F14] border border-[#2D3748] rounded pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ffb77d] placeholder-[#dbc2b0]/50"
              placeholder="Search Name, Driver ID or License..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {searchQuery || selectedStatus ? (
          <button
            onClick={() => {
              setSelectedStatus('');
              setSearchQuery('');
            }}
            className="sm:ml-auto text-xs text-[#ffb77d] hover:underline"
          >
            Reset Filters
          </button>
        ) : null}
      </div>

      {/* Drivers Data Table */}
      <div className="bg-[#161A22] border border-[#2D3748] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E293B]/50 border-b border-[#2D3748]">
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3">Operator ID</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3">Driver Profile</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3">Credentials</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3 text-center">Safety Score</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3 text-center">Trip Completion</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3">Contact</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3 text-center">Expiry Status</th>
                <th className="text-[11px] font-bold text-[#dbc2b0] uppercase tracking-wider px-4 py-3 text-center">Status</th>
                {isAllowedToEdit && <th className="px-4 py-3 w-28 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="text-xs text-[#dbc2b0] divide-y divide-[#2D3748]/50">
              {filteredDrivers.map((driver) => {
                const isEditing = editingId === driver.id;
                const expired = isExpired(driver.licenseExpiryDate);

                return (
                  <tr key={driver.id} className={`hover:bg-[#1E293B]/40 transition-colors group ${
                    driver.status === DriverStatus.SUSPENDED ? 'bg-[#ef4444]/5' : ''
                  }`}>
                    {/* Operator ID */}
                    <td className="px-4 py-3 font-mono font-bold text-white">{driver.id}</td>

                    {/* Profile */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          className="bg-[#0D0F14] border border-[#2D3748] rounded px-2 py-0.5 text-xs text-white"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1A120B] border border-[#ffb77d]/30 flex items-center justify-center font-bold text-white">
                            {driver.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-white">{driver.name}</div>
                            <div className="text-[10px] text-[#dbc2b0]/70">Class A Operator</div>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Credentials */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex flex-col gap-1">
                          <input
                            className="bg-[#0D0F14] border border-[#2D3748] rounded px-2 py-0.5 text-xs text-white"
                            value={editLicenseNum}
                            onChange={(e) => setEditLicenseNum(e.target.value)}
                          />
                          <select
                            className="bg-[#0D0F14] border border-[#2D3748] rounded px-2 py-0.5 text-xs text-white"
                            value={editLicenseCat}
                            onChange={(e) => setEditLicenseCat(e.target.value)}
                          >
                            <option value="Heavy Freight">Heavy Freight</option>
                            <option value="Long Haul">Long Haul</option>
                            <option value="Local Delivery">Local Delivery</option>
                          </select>
                        </div>
                      ) : (
                        <>
                          <div className="font-semibold text-white">{driver.licenseNumber}</div>
                          <div className="text-[10px] text-[#dbc2b0]/70">{driver.licenseCategory}</div>
                        </>
                      )}
                    </td>

                    {/* Safety Score */}
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          className="bg-[#0D0F14] border border-[#2D3748] rounded px-2 py-0.5 text-xs text-white text-center w-16"
                          value={editSafetyScore}
                          onChange={(e) => setEditSafetyScore(Number(e.target.value))}
                        />
                      ) : (
                        <div className="inline-flex flex-col items-center">
                          <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            driver.safetyScore >= 90 ? 'bg-green-500/10 text-green-400' :
                            driver.safetyScore >= 75 ? 'bg-[#d97707]/10 text-[#ffb77d]' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {driver.safetyScore}/100
                          </span>
                          <span className="text-[9px] text-[#dbc2b0]/50 mt-0.5">Telematic Rating</span>
                        </div>
                      )}
                    </td>

                    {/* Completion Rate */}
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          className="bg-[#0D0F14] border border-[#2D3748] rounded px-2 py-0.5 text-xs text-white text-center w-16"
                          value={editCompletionRate}
                          onChange={(e) => setEditCompletionRate(Number(e.target.value))}
                        />
                      ) : (
                        <div className="font-bold text-white">{driver.tripCompletionRate}%</div>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          className="bg-[#0D0F14] border border-[#2D3748] rounded px-2 py-0.5 text-xs text-white"
                          value={editContact}
                          onChange={(e) => setEditContact(e.target.value)}
                        />
                      ) : (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-white font-medium flex items-center gap-1">
                            <Phone className="h-3 w-3 text-[#dbc2b0]/70" /> {driver.contactNumber}
                          </span>
                          <span className="text-[10px] text-[#dbc2b0]/50">Primary Cellular</span>
                        </div>
                      )}
                    </td>

                    {/* Expiry Status */}
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <input
                          type="date"
                          className="bg-[#0D0F14] border border-[#2D3748] rounded px-2 py-0.5 text-xs text-white"
                          value={editExpiry}
                          onChange={(e) => setEditExpiry(e.target.value)}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-semibold text-white flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-[#ffb77d]" /> {driver.licenseExpiryDate}
                          </span>
                          {expired ? (
                            <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.2 rounded font-bold uppercase border border-red-500/40">
                              EXPIRED CDL
                            </span>
                          ) : (
                            <span className="text-[9px] text-[#dbc2b0]/50 font-semibold">Active CDL</span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <select
                          className="bg-[#0D0F14] border border-[#2D3748] rounded px-2 py-0.5 text-xs text-white"
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as DriverStatus)}
                        >
                          <option value={DriverStatus.AVAILABLE}>Available</option>
                          <option value={DriverStatus.ON_TRIP}>On Trip</option>
                          <option value={DriverStatus.OFF_DUTY}>Off Duty</option>
                          <option value={DriverStatus.SUSPENDED}>Suspended</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center justify-center font-bold text-[10px] tracking-wider px-2.5 py-0.5 rounded border uppercase w-24 ${
                          driver.status === DriverStatus.AVAILABLE ? 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30' :
                          driver.status === DriverStatus.ON_TRIP ? 'bg-[#3B82F6]/15 text-[#60A5FA] border-[#3B82F6]/30' :
                          driver.status === DriverStatus.OFF_DUTY ? 'bg-neutral-800 text-neutral-400 border-neutral-700' :
                          'bg-red-500/15 text-red-400 border-red-500/30'
                        }`}>
                          {driver.status}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    {isAllowedToEdit && (
                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleSaveEdit(driver.id)}
                              className="text-green-400 hover:text-green-300 p-1 bg-green-500/10 rounded"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-red-400 hover:text-red-300 p-1 bg-red-500/10 rounded"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleStartEdit(driver)}
                              className="text-[#ffb77d] hover:text-[#d97707] p-1"
                              title="Edit Driver profile"
                            >
                              <Plus className="h-4 w-4 rotate-45" /> {/* Use Plus rotated for edit or custom */}
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`De-register driver ${driver.name}?`)) {
                                  onDeleteDriver(driver.id);
                                }
                              }}
                              className="text-red-400 hover:text-red-500 p-1"
                              title="De-register Driver"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}

              {filteredDrivers.length === 0 && (
                <tr>
                  <td colSpan={isAllowedToEdit ? 9 : 8} className="text-center py-8 text-xs text-[#dbc2b0]/50 font-medium">
                    No drivers match the active search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Business Rule Callout in Footer */}
        <div className="bg-[#1A1F29] p-3.5 border-t border-[#2D3748] flex flex-col sm:flex-row justify-between items-center text-[11px] gap-2">
          <div className="flex items-center gap-2 text-red-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>Safety Protocol Block: Suspended status or expired CDL licenses strictly prohibit any trip assignment.</span>
          </div>
          <div className="text-[#dbc2b0]/70 font-semibold">
            Registered: {drivers.length} Operators
          </div>
        </div>
      </div>
    </div>
  );
}
