import React, { useState } from 'react';
import { Truck, LayoutDashboard, Headphones, Shield, LineChart, AlertCircle, ArrowRight, ChevronDown } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, role: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('dispatcher@transitops.com');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState('dispatcher');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all details.');
      return;
    }
    setError(null);
    onLogin(email, role);
  };

  const handlePresetClick = (presetEmail: string, presetRole: string) => {
    setEmail(presetEmail);
    setRole(presetRole);
    onLogin(presetEmail, presetRole);
  };

  return (
    <div id="login-container" className="min-h-screen w-full flex bg-[#150e0a] text-[#dbc2b0] font-sans antialiased">
      {/* Left Panel - Brand Identity (Visible on LG and above) */}
      <div className="hidden lg:flex w-1/2 bg-[#0e0906] flex-col justify-between p-16 relative overflow-hidden border-r border-[#38251a]">
        {/* Background Image with Referrer Policy and Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80" 
            alt="Logistics Fleet Background" 
            className="w-full h-full object-cover opacity-45"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#150e0a]/90 via-[#150e0a]/45 to-[#150e0a]/95" />
        </div>
        
        {/* Top Header Logo & Slogan */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="h-8 w-8 text-[#d97707]" />
            <h1 className="text-4xl font-bold tracking-tight text-white">TransitOps</h1>
          </div>
          <p className="text-xl font-medium text-white tracking-wide">
            Smart Transport Operations Platform
          </p>
        </div>

        {/* Middle Available Modules */}
        <div className="relative z-10 space-y-5">
          <p className="text-xs font-bold text-white tracking-wider uppercase">Available Modules:</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#221610] border border-[#38251a] flex items-center justify-center shadow-sm">
                <LayoutDashboard className="h-4 w-4 text-[#d97707]" />
              </div>
              <span className="text-sm font-semibold text-[#dbc2b0]/90">Fleet Manager</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#221610] border border-[#38251a] flex items-center justify-center shadow-sm">
                <Headphones className="h-4 w-4 text-[#d97707]" />
              </div>
              <span className="text-sm font-semibold text-[#dbc2b0]/90">Dispatcher</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#221610] border border-[#38251a] flex items-center justify-center shadow-sm">
                <Shield className="h-4 w-4 text-[#d97707]" />
              </div>
              <span className="text-sm font-semibold text-[#dbc2b0]/90">Safety Officer</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#221610] border border-[#38251a] flex items-center justify-center shadow-sm">
                <LineChart className="h-4 w-4 text-[#d97707]" />
              </div>
              <span className="text-sm font-semibold text-[#dbc2b0]/90">Financial Analyst</span>
            </li>
          </ul>
        </div>
        
        {/* Subtle bottom placeholder */}
        <div className="relative z-10 text-[10px] text-[#dbc2b0]/40 font-mono">
          TransitOps Control Protocol v2.5.0 (React 19 Native)
        </div>
      </div>

      {/* Right Panel - Authentication */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 bg-[#150e0a]">
        <div className="w-full max-w-md space-y-7">
          
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex flex-col items-center gap-2 justify-center mb-6">
            <div className="flex items-center gap-2.5">
              <Truck className="h-8 w-8 text-[#d97707]" />
              <h1 className="text-3xl font-bold tracking-tight text-white">TransitOps</h1>
            </div>
            <p className="text-xs text-[#dbc2b0]/80">Smart Transport Operations Platform</p>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white tracking-tight">Sign In</h2>
            <p className="text-xs text-[#dbc2b0]/70">Access your operational dashboard.</p>
          </div>

          {/* Validation Error Banner */}
          {error && (
            <div id="login-error-banner" className="bg-[#180c0e] border border-[#e11d48]/40 p-3 rounded-lg flex items-start gap-2.5 text-xs text-[#fecdd3]">
              <AlertCircle className="h-4 w-4 text-[#e11d48] shrink-0 mt-0.5" />
              <p id="login-error-text" className="leading-normal">{error}</p>
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-[#dbc2b0]/70 block uppercase" htmlFor="login-email">
                Email Address
              </label>
              <input
                className="w-full bg-[#0e0906] border border-[#38251a] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#d97707] focus:ring-1 focus:ring-[#d97707] transition-all"
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-[#dbc2b0]/70 block uppercase" htmlFor="login-password">
                Password
              </label>
              <input
                className="w-full bg-[#0e0906] border border-[#38251a] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#d97707] focus:ring-1 focus:ring-[#d97707] transition-all"
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Role selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-[#dbc2b0]/70 block uppercase" htmlFor="login-role">
                Select Role (RBAC)
              </label>
              <div className="relative">
                <select
                  className="w-full bg-[#0e0906] border border-[#38251a] rounded px-3 py-2 text-white text-xs appearance-none focus:outline-none focus:border-[#d97707] focus:ring-1 focus:ring-[#d97707] transition-all"
                  id="login-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="dispatcher">Dispatcher</option>
                  <option value="fleet_manager">Fleet Manager</option>
                  <option value="safety_officer">Safety Officer</option>
                  <option value="financial_analyst">Financial Analyst</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2.5 pointer-events-none text-[#dbc2b0]/50">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#d97707] hover:bg-[#b45309] text-white font-medium py-2 rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 text-[10px] text-[#dbc2b0]/35 uppercase font-bold tracking-wider">
            <div className="h-px bg-[#38251a] flex-1"></div>
            <span>Quick Presets</span>
            <div className="h-px bg-[#38251a] flex-1"></div>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button 
              type="button" 
              onClick={() => handlePresetClick('dispatcher@transitops.com', 'dispatcher')}
              className="preset-btn p-2 rounded bg-[#221610] hover:bg-[#301f16] border border-[#38251a] text-left transition-colors cursor-pointer"
            >
              <div className="font-bold text-white text-[11px]">Dispatcher</div>
              <div className="text-[10px] text-[#dbc2b0]/60">dispatcher@transitops.com</div>
            </button>
            <button 
              type="button" 
              onClick={() => handlePresetClick('manager@transitops.com', 'fleet_manager')}
              className="preset-btn p-2 rounded bg-[#221610] hover:bg-[#301f16] border border-[#38251a] text-left transition-colors cursor-pointer"
            >
              <div className="font-bold text-white text-[11px]">Fleet Manager</div>
              <div className="text-[10px] text-[#dbc2b0]/60">manager@transitops.com</div>
            </button>
            <button 
              type="button" 
              onClick={() => handlePresetClick('safety@transitops.com', 'safety_officer')}
              className="preset-btn p-2 rounded bg-[#221610] hover:bg-[#301f16] border border-[#38251a] text-left transition-colors cursor-pointer"
            >
              <div className="font-bold text-white text-[11px]">Safety Officer</div>
              <div className="text-[10px] text-[#dbc2b0]/60">safety@transitops.com</div>
            </button>
            <button 
              type="button" 
              onClick={() => handlePresetClick('finance@transitops.com', 'financial_analyst')}
              className="preset-btn p-2 rounded bg-[#221610] hover:bg-[#301f16] border border-[#38251a] text-left transition-colors cursor-pointer"
            >
              <div className="font-bold text-white text-[11px]">Financial Analyst</div>
              <div className="text-[10px] text-[#dbc2b0]/60">finance@transitops.com</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginScreen;
