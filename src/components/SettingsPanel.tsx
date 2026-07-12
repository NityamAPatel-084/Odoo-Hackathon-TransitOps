import React, { useState } from 'react';
import { SystemConfig, UserRole } from '../types';
import { Sliders, Shield, Check, Globe, HelpCircle, Save } from 'lucide-react';

interface SettingsPanelProps {
  config: SystemConfig;
  userRole: UserRole;
  onSaveConfig: (newConfig: SystemConfig) => void;
}

export default function SettingsPanel({
  config,
  userRole,
  onSaveConfig,
}: SettingsPanelProps) {
  const [depotName, setDepotName] = useState(config.depotName);
  const [currency, setCurrency] = useState(config.defaultCurrency);
  const [unit, setUnit] = useState<'miles' | 'kilometers'>(config.distanceUnit);
  const [timezone, setTimezone] = useState(config.timezone);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      depotName,
      defaultCurrency: currency,
      distanceUnit: unit,
      timezone,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const matrix = [
    {
      feature: 'Register / Edit Vehicles',
      manager: 'FULL',
      dispatcher: 'NONE',
      safety: 'NONE',
      finance: 'NONE',
    },
    {
      feature: 'Service Logs & Shop Releases',
      manager: 'FULL',
      dispatcher: 'NONE',
      safety: 'NONE',
      finance: 'NONE',
    },
    {
      feature: 'Issue Dispatches & Complete Trips',
      manager: 'FULL',
      dispatcher: 'FULL',
      safety: 'NONE',
      finance: 'NONE',
    },
    {
      feature: 'Driver Registry & Licensing Compliance',
      manager: 'FULL',
      dispatcher: 'VIEW_ONLY',
      safety: 'FULL',
      finance: 'NONE',
    },
    {
      feature: 'Log Fuel & Audit Toll Expenses',
      manager: 'FULL',
      dispatcher: 'NONE',
      safety: 'NONE',
      finance: 'FULL',
    },
    {
      feature: 'Performance CSV Export & ROI Reports',
      manager: 'FULL',
      dispatcher: 'VIEW_ONLY',
      safety: 'VIEW_ONLY',
      finance: 'FULL',
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">System Settings</h2>
        <p className="text-xs text-[#dbc2b0] max-w-2xl mt-1">
          Configure corporate fleet defaults and audit platform Role-Based Access Control (RBAC) protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: General Config (1/3 width) */}
        <div className="lg:col-span-1 bg-[#161A22] border border-[#2D3748] rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            <Sliders className="h-4.5 w-4.5 text-[#ffb77d]" />
            Regional Defaults
          </h3>
          <p className="text-[11px] text-[#dbc2b0]/70">Configure base localization and metrics format applied across telemetry views.</p>
          
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Central Depot Name</label>
              <input
                type="text"
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d] transition-colors duration-200"
                value={depotName}
                onChange={(e) => setDepotName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Default Currency</label>
              <select
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USD">USD ($) - United States Dollar</option>
                <option value="EUR">EUR (Γé¼) - Euro</option>
                <option value="GBP">GBP (┬ú) - British Pound</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Distance Unit Format</label>
              <select
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'miles' | 'kilometers')}
              >
                <option value="miles">Imperial (Miles / Gallons)</option>
                <option value="kilometers">Metric (Kilometers / Liters)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Local Timezone Offset</label>
              <select
                className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="America/Chicago (CST)">America/Chicago (CST)</option>
                <option value="America/New_York (EST)">America/New_York (EST)</option>
                <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#d97707] hover:bg-[#b45309] text-black font-bold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-2 border border-[#ffb77d]/30"
              >
                {saveSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {saveSuccess ? 'Configurations Saved!' : 'Save Regional Defaults'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: RBAC Permission Matrix (2/3 width) */}
        <div className="lg:col-span-2 bg-[#161A22] border border-[#2D3748] rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-[#ffb77d]" />
              Role-Based Access Permissions
            </h3>
            <p className="text-[11px] text-[#dbc2b0]/70 mb-4">
              Current Authenticated Role: <strong className="text-white font-extrabold uppercase bg-[#0D0F14] px-2 py-0.5 rounded border border-[#2D3748] text-[10px] tracking-wider ml-1">{userRole}</strong>
            </p>

            <div className="overflow-x-auto border border-[#2D3748] rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0D0F14] border-b border-[#2D3748]">
                    <th className="py-2.5 px-3 text-[#dbc2b0] font-bold uppercase tracking-wider text-[10px]">Security Module</th>
                    <th className="py-2.5 px-3 text-[#dbc2b0] font-bold uppercase tracking-wider text-[10px] text-center">Fleet Mgr</th>
                    <th className="py-2.5 px-3 text-[#dbc2b0] font-bold uppercase tracking-wider text-[10px] text-center">Dispatcher</th>
                    <th className="py-2.5 px-3 text-[#dbc2b0] font-bold uppercase tracking-wider text-[10px] text-center">Safety Off.</th>
                    <th className="py-2.5 px-3 text-[#dbc2b0] font-bold uppercase tracking-wider text-[10px] text-center">Fin. Analyst</th>
                  </tr>
                </thead>
                <tbody className="text-[#dbc2b0] divide-y divide-[#2D3748]/65 font-medium">
                  {matrix.map((row) => (
                    <tr key={row.feature} className="hover:bg-[#1E293B]/20 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-white">{row.feature}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">
                          {row.manager}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] uppercase ${
                          row.dispatcher === 'FULL' ? 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30' :
                          row.dispatcher === 'VIEW_ONLY' ? 'bg-[#3B82F6]/15 text-[#60A5FA] border border-[#3B82F6]/30' :
                          'text-neutral-500 bg-transparent border-none'
                        }`}>
                          {row.dispatcher}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] uppercase ${
                          row.safety === 'FULL' ? 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30' :
                          row.safety === 'VIEW_ONLY' ? 'bg-[#3B82F6]/15 text-[#60A5FA] border border-[#3B82F6]/30' :
                          'text-neutral-500 bg-transparent border-none'
                        }`}>
                          {row.safety}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] uppercase ${
                          row.finance === 'FULL' ? 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30' :
                          row.finance === 'VIEW_ONLY' ? 'bg-[#3B82F6]/15 text-[#60A5FA] border border-[#3B82F6]/30' :
                          'text-neutral-500 bg-transparent border-none'
                        }`}>
                          {row.finance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#1A1F29] p-3 rounded-lg border border-[#2D3748] text-[11px] text-[#dbc2b0] flex items-center gap-2 mt-4">
            <Globe className="h-4 w-4 text-[#ffb77d] shrink-0" />
            <p>Role-Based constraints are enforced dynamically across forms and edit states according to standard protocols.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
