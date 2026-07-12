import React, { useState } from 'react';
import { SystemConfig } from '../types';
import { Save, Settings, Database } from 'lucide-react';

interface SettingsPanelProps {
  config: SystemConfig;
  onUpdateConfig: (newConfig: SystemConfig) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, onUpdateConfig }) => {
  const [depotName, setDepotName] = useState(config.depotName);
  const [currency, setCurrency] = useState(config.defaultCurrency);
  const [distanceUnit, setDistanceUnit] = useState<'miles' | 'kilometers'>(config.distanceUnit);
  const [timezone, setTimezone] = useState(config.timezone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SystemConfig = {
      depotName,
      defaultCurrency: currency,
      distanceUnit,
      timezone,
    };
    onUpdateConfig(updated);
    alert('System settings and parameters synchronized successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#38251a]">
        <h3 className="font-bold text-lg text-white">Platform System Settings</h3>
        <p className="text-xs text-[#dbc2b0]/60">Customize operating constants, metrics units, localized defaults, and sandbox configs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configurations Form */}
        <div className="lg:col-span-2 bg-[#221610] border border-[#38251a] rounded p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#38251a]/60">
            <Settings className="h-4 w-4 text-[#d97707]" />
            <h4 className="font-bold text-sm text-white">Localization & Units Configuration</h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#dbc2b0]/70 uppercase block">Terminal/Depot Identifier Name</label>
              <input 
                type="text" 
                value={depotName}
                onChange={(e) => setDepotName(e.target.value)}
                required
                className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white focus:outline-none focus:border-[#d97707]" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#dbc2b0]/70 uppercase block">Distance/Odometer Unit</label>
                <select 
                  value={distanceUnit}
                  onChange={(e) => setDistanceUnit(e.target.value as 'miles' | 'kilometers')}
                  className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white focus:outline-none focus:border-[#d97707]"
                >
                  <option value="miles">Miles (mi)</option>
                  <option value="kilometers">Kilometers (km)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#dbc2b0]/70 uppercase block">Default Operating Currency</label>
                <input 
                  type="text" 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  required
                  className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white focus:outline-none focus:border-[#d97707]" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#dbc2b0]/70 uppercase block">Localized Operating Timezone Offset</label>
              <input 
                type="text" 
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                required
                className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white focus:outline-none" 
              />
            </div>

            <button 
              type="submit" 
              className="bg-[#d97707] hover:bg-[#b45309] text-white font-bold px-4 py-2 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save System Settings</span>
            </button>
          </form>
        </div>

        {/* System info / Diagnostics card */}
        <div className="bg-[#221610] border border-[#38251a] p-5 rounded space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#38251a]/60">
            <Database className="h-4 w-4 text-[#d97707]" />
            <h4 className="font-bold text-sm text-white">System Logs & Schema</h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-[#150e0a] p-3 rounded border border-[#38251a] font-mono text-[10px] space-y-1 text-[#dbc2b0]/70">
              <div className="font-bold text-white mb-1 uppercase">Database State:</div>
              <div>Memory Buffer: OK</div>
              <div>Mock Syncing: OFF</div>
              <div>Stateful Engine: React Context</div>
              <div>Active Threads: 1</div>
            </div>

            <div className="p-3 border border-[#38251a] rounded text-[11px] leading-relaxed">
              <span className="font-bold text-white block mb-1">Developer Notice</span>
              The platform settings are saved locally inside React Context and persist through tab interactions. Relational schema alterations are currently managed client-side in standard state.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPanel;
