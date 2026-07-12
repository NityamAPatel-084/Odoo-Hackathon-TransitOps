import React, { useState } from 'react';
<<<<<<< HEAD
import { UserRole } from '../types';
import { Truck, Shield, LayoutDashboard, LineChart, ArrowRight, AlertCircle, Headphones, ChevronDown, Lock } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, role: UserRole) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('dispatcher@transitops.com');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<UserRole>(UserRole.DISPATCHER);
=======
import { Truck, LayoutDashboard, Headphones, Shield, LineChart, AlertCircle, ArrowRight, ChevronDown } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, role: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('dispatcher@transitops.com');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState('dispatcher');
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
<<<<<<< HEAD
      setError('Please fill in all fields.');
=======
      setError('Please fill in all details.');
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
      return;
    }
    setError(null);
    onLogin(email, role);
  };

<<<<<<< HEAD
  return (
    <div className="min-h-screen w-full flex bg-[#0c0806] text-[#dbc2b0] font-sans antialiased selection:bg-[#ffb77d]/30 selection:text-[#ffb77d]">
      
      {/* Left Panel - Brand Identity (Visible on LG and above) */}
      <div className="hidden lg:flex w-1/2 bg-[#0c0806] flex-col justify-between p-16 relative overflow-hidden border-r border-[#2c1f18]">
=======
  const handlePresetClick = (presetEmail: string, presetRole: string) => {
    setEmail(presetEmail);
    setRole(presetRole);
    onLogin(presetEmail, presetRole);
  };

  return (
    <div id="login-container" className="min-h-screen w-full flex bg-[#150e0a] text-[#dbc2b0] font-sans antialiased">
      {/* Left Panel - Brand Identity (Visible on LG and above) */}
      <div className="hidden lg:flex w-1/2 bg-[#0e0906] flex-col justify-between p-16 relative overflow-hidden border-r border-[#38251a]">
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
        {/* Background Image with Referrer Policy and Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80" 
            alt="Logistics Fleet Background" 
            className="w-full h-full object-cover opacity-45"
            referrerPolicy="no-referrer"
          />
<<<<<<< HEAD
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0806]/90 via-[#0c0806]/45 to-[#0c0806]/95" />
=======
          <div className="absolute inset-0 bg-gradient-to-b from-[#150e0a]/90 via-[#150e0a]/45 to-[#150e0a]/95" />
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
        </div>
        
        {/* Top Header Logo & Slogan */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="h-8 w-8 text-[#d97707]" />
<<<<<<< HEAD
            <h1 className="text-3.5xl font-bold tracking-tight text-white font-sans">TransitOps</h1>
=======
            <h1 className="text-4xl font-bold tracking-tight text-white">TransitOps</h1>
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
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
<<<<<<< HEAD
              <div className="w-8 h-8 rounded-full bg-[#140f0c] border border-[#2c1f18] flex items-center justify-center shadow-sm">
=======
              <div className="w-8 h-8 rounded-full bg-[#221610] border border-[#38251a] flex items-center justify-center shadow-sm">
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
                <LayoutDashboard className="h-4 w-4 text-[#d97707]" />
              </div>
              <span className="text-sm font-semibold text-[#dbc2b0]/90">Fleet Manager</span>
            </li>
            <li className="flex items-center gap-3">
<<<<<<< HEAD
              <div className="w-8 h-8 rounded-full bg-[#140f0c] border border-[#2c1f18] flex items-center justify-center shadow-sm">
=======
              <div className="w-8 h-8 rounded-full bg-[#221610] border border-[#38251a] flex items-center justify-center shadow-sm">
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
                <Headphones className="h-4 w-4 text-[#d97707]" />
              </div>
              <span className="text-sm font-semibold text-[#dbc2b0]/90">Dispatcher</span>
            </li>
            <li className="flex items-center gap-3">
<<<<<<< HEAD
              <div className="w-8 h-8 rounded-full bg-[#140f0c] border border-[#2c1f18] flex items-center justify-center shadow-sm">
=======
              <div className="w-8 h-8 rounded-full bg-[#221610] border border-[#38251a] flex items-center justify-center shadow-sm">
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
                <Shield className="h-4 w-4 text-[#d97707]" />
              </div>
              <span className="text-sm font-semibold text-[#dbc2b0]/90">Safety Officer</span>
            </li>
            <li className="flex items-center gap-3">
<<<<<<< HEAD
              <div className="w-8 h-8 rounded-full bg-[#140f0c] border border-[#2c1f18] flex items-center justify-center shadow-sm">
=======
              <div className="w-8 h-8 rounded-full bg-[#221610] border border-[#38251a] flex items-center justify-center shadow-sm">
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
                <LineChart className="h-4 w-4 text-[#d97707]" />
              </div>
              <span className="text-sm font-semibold text-[#dbc2b0]/90">Financial Analyst</span>
            </li>
          </ul>
        </div>
        
        {/* Subtle bottom placeholder */}
<<<<<<< HEAD
        <div className="relative z-10 text-[10px] text-[#dbc2b0]/40">
          TransitOps Control Protocol v2.4.1
=======
        <div className="relative z-10 text-[10px] text-[#dbc2b0]/40 font-mono">
          TransitOps Control Protocol v2.5.0 (React 19 Native)
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
        </div>
      </div>

      {/* Right Panel - Authentication */}
<<<<<<< HEAD
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 bg-[#0c0806]">
=======
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 bg-[#150e0a]">
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
        <div className="w-full max-w-md space-y-7">
          
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex flex-col items-center gap-2 justify-center mb-6">
            <div className="flex items-center gap-2.5">
              <Truck className="h-8 w-8 text-[#d97707]" />
<<<<<<< HEAD
              <h1 className="text-2xl font-bold tracking-tight text-white">TransitOps</h1>
=======
              <h1 className="text-3xl font-bold tracking-tight text-white">TransitOps</h1>
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
            </div>
            <p className="text-xs text-[#dbc2b0]/80">Smart Transport Operations Platform</p>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white tracking-tight">Sign In</h2>
            <p className="text-xs text-[#dbc2b0]/70">Access your operational dashboard.</p>
          </div>

          {/* Validation Error Banner */}
          {error && (
<<<<<<< HEAD
            <div className="bg-[#180c0e] border border-[#e11d48]/40 p-3 rounded-lg flex items-start gap-2.5 text-xs text-[#fecdd3]">
              <AlertCircle className="h-4 w-4 text-[#e11d48] shrink-0 mt-0.5" />
              <p className="leading-normal">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-[#dbc2b0]/70 block uppercase" htmlFor="email">
                Email Address
              </label>
              <input
                className="w-full bg-[#070504] border border-[#2c1f18] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#d97707] focus:ring-1 focus:ring-[#d97707] transition-all"
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Update role accordingly for standard presets
                  if (e.target.value.includes('manager')) setRole(UserRole.FLEET_MANAGER);
                  else if (e.target.value.includes('safety')) setRole(UserRole.SAFETY_OFFICER);
                  else if (e.target.value.includes('finance')) setRole(UserRole.FINANCIAL_ANALYST);
                  else if (e.target.value.includes('dispatcher')) setRole(UserRole.DISPATCHER);
                }}
                placeholder="dispatcher@transitops.com"
=======
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
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
<<<<<<< HEAD
              <label className="text-[10px] font-bold tracking-wider text-[#dbc2b0]/70 block uppercase" htmlFor="password">
                Password
              </label>
              <input
                className="w-full bg-[#070504] border border-[#2c1f18] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#d97707] focus:ring-1 focus:ring-[#d97707] transition-all"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
=======
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
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
              />
            </div>

            {/* Role selection */}
            <div className="space-y-1.5">
<<<<<<< HEAD
              <label className="text-[10px] font-bold tracking-wider text-[#dbc2b0]/70 block uppercase" htmlFor="role">
=======
              <label className="text-[10px] font-bold tracking-wider text-[#dbc2b0]/70 block uppercase" htmlFor="login-role">
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
                Select Role (RBAC)
              </label>
              <div className="relative">
                <select
<<<<<<< HEAD
                  className="w-full bg-[#070504] border border-[#2c1f18] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#d97707] focus:ring-1 focus:ring-[#d97707] transition-all appearance-none cursor-pointer pr-10"
                  id="role"
                  value={role}
                  onChange={(e) => {
                    const r = e.target.value as UserRole;
                    setRole(r);
                    // Update email field according to role selection
                    if (r === UserRole.FLEET_MANAGER) setEmail('manager@transitops.com');
                    else if (r === UserRole.SAFETY_OFFICER) setEmail('safety@transitops.com');
                    else if (r === UserRole.FINANCIAL_ANALYST) setEmail('finance@transitops.com');
                    else setEmail('dispatcher@transitops.com');
                  }}
                >
                  <option value={UserRole.FLEET_MANAGER}>Fleet Manager</option>
                  <option value={UserRole.DISPATCHER}>Dispatcher</option>
                  <option value={UserRole.SAFETY_OFFICER}>Safety Officer</option>
                  <option value={UserRole.FINANCIAL_ANALYST}>Financial Analyst</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-3.5 w-3.5 text-[#dbc2b0]/70" />
=======
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
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
                </div>
              </div>
            </div>

<<<<<<< HEAD
            {/* Checkbox and Forgot Password link */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  className="w-4 h-4 rounded bg-[#070504] border-[#2c1f18] text-[#d97707] focus:ring-[#d97707]"
                  id="remember"
                  type="checkbox"
                  defaultChecked
                />
                <label className="ml-2 text-xs text-[#dbc2b0]/80 select-none cursor-pointer" htmlFor="remember">
                  Remember me
                </label>
              </div>
              <button 
                type="button" 
                onClick={() => setError('Invalid credentials — account locked after 5 failed attempts.')}
                className="text-xs text-[#d97707] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit button */}
            <button
              className="w-full bg-[#d97707] hover:bg-[#b45309] text-black font-bold text-xs py-2.5 rounded transition-all mt-3 flex justify-center items-center gap-1 border border-[#ffb77d]/20"
              type="submit"
            >
              <span>Sign In</span>
=======
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#d97707] hover:bg-[#b45309] text-white font-medium py-2 rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <span>Sign In to Dashboard</span>
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

<<<<<<< HEAD
          {/* Centered Footer Divider */}
          <div className="pt-6 border-t border-[#2c1f18]/60 text-center flex items-center justify-center gap-2 text-xs text-[#dbc2b0]/50">
            <Lock className="h-3.5 w-3.5 text-[#dbc2b0]/40" />
            <span>Role-based access is scoped after login.</span>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
=======
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
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
