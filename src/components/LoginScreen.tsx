import React, { useState } from 'react';
import { UserRole } from '../types';
import { Truck, Shield, LayoutDashboard, LineChart, ArrowRight, AlertCircle, Headphones, ChevronDown, Lock } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, role: UserRole) => void;
}

const AVAILABLE_MODULES = [
  { name: 'Fleet Manager', icon: LayoutDashboard },
  { name: 'Dispatcher', icon: Headphones },
  { name: 'Safety Officer', icon: Shield },
  { name: 'Financial Analyst', icon: LineChart },
];

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('dispatcher@transitops.com');
  const [password, setPassword] = useState('ΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇó');
  const [role, setRole] = useState<UserRole>(UserRole.DISPATCHER);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    onLogin(email, role);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0c0806] text-[#dbc2b0] font-sans antialiased selection:bg-[#ffb77d]/30 selection:text-[#ffb77d]">
      
      {/* Left Panel - Brand Identity (Visible on LG and above) */}
      <div className="hidden lg:flex w-1/2 bg-[#0c0806] flex-col justify-between p-16 relative overflow-hidden border-r border-[#2c1f18]">
        {/* Background Image with Referrer Policy and Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80" 
            alt="Logistics Fleet Background" 
            className="w-full h-full object-cover opacity-45"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0806]/90 via-[#0c0806]/45 to-[#0c0806]/95" />
        </div>
        
        {/* Top Header Logo & Slogan */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="h-8 w-8 text-[#d97707]" />
            <h1 className="text-3.5xl font-bold tracking-tight text-white font-sans">TransitOps</h1>
          </div>
          <p className="text-xl font-medium text-white tracking-wide">
            Smart Transport Operations Platform
          </p>
        </div>

        {/* Middle Available Modules */}
        <div className="relative z-10 space-y-5">
          <p className="text-xs font-bold text-white tracking-wider uppercase">Available Modules:</p>
          <ul className="space-y-4">
            {AVAILABLE_MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <li key={module.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#140f0c] border border-[#2c1f18] flex items-center justify-center shadow-sm">
                    <Icon className="h-4 w-4 text-[#d97707]" />
                  </div>
                  <span className="text-sm font-semibold text-[#dbc2b0]/90">{module.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Subtle bottom placeholder */}
        <div className="relative z-10 text-[10px] text-[#dbc2b0]/40">
          TransitOps Control Protocol v2.4.1
        </div>
      </div>

      {/* Right Panel - Authentication */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 bg-[#0c0806]">
        <div className="w-full max-w-md space-y-7">
          
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex flex-col items-center gap-2 justify-center mb-6">
            <div className="flex items-center gap-2.5">
              <Truck className="h-8 w-8 text-[#d97707]" />
              <h1 className="text-2xl font-bold tracking-tight text-white">TransitOps</h1>
            </div>
            <p className="text-xs text-[#dbc2b0]/80">Smart Transport Operations Platform</p>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white tracking-tight">Sign In</h2>
            <p className="text-xs text-[#dbc2b0]/70">Access your operational dashboard.</p>
          </div>

          {/* Validation Error Banner */}
          {error && (
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
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-[#dbc2b0]/70 block uppercase" htmlFor="password">
                Password
              </label>
              <input
                className="w-full bg-[#070504] border border-[#2c1f18] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#d97707] focus:ring-1 focus:ring-[#d97707] transition-all"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇó"
              />
            </div>

            {/* Role selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-[#dbc2b0]/70 block uppercase" htmlFor="role">
                Select Role (RBAC)
              </label>
              <div className="relative">
                <select
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
                </div>
              </div>
            </div>

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
                onClick={() => setError('Invalid credentials ΓÇö account locked after 5 failed attempts.')}
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
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

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
