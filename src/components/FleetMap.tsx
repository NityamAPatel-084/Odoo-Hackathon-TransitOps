import React, { useState, useEffect } from 'react';
import { MapPin, Info, Navigation, ShieldAlert, Compass, Activity } from 'lucide-react';
import { Vehicle, VehicleStatus, Trip, Driver } from '../types';

interface FleetMapProps {
  vehicles: Vehicle[];
  trips: Trip[];
  drivers: Driver[];
}

// Coordinate mappings for major cities/hubs
const HUBS: Record<string, { name: string; x: number; y: number }> = {
  'Chicago': { name: 'Main Hub - Chicago', x: 250, y: 150 },
  'New York': { name: 'East Terminal - New York', x: 420, y: 110 },
  'Houston': { name: 'South Depot - Houston', x: 230, y: 340 },
  'Los Angeles': { name: 'West Gate - Los Angeles', x: 70, y: 260 },
  'Seattle': { name: 'Northwest - Seattle', x: 60, y: 70 },
  'Miami': { name: 'Southeast Terminal - Miami', x: 390, y: 350 },
  'Denver': { name: 'Mountain Hub - Denver', x: 170, y: 190 },
};

// Default map links between hubs
const ROUTES = [
  { from: 'Seattle', to: 'Los Angeles' },
  { from: 'Seattle', to: 'Denver' },
  { from: 'Los Angeles', to: 'Denver' },
  { from: 'Los Angeles', to: 'Houston' },
  { from: 'Denver', to: 'Chicago' },
  { from: 'Houston', to: 'Chicago' },
  { from: 'Chicago', to: 'New York' },
  { from: 'Houston', to: 'Miami' },
  { from: 'New York', to: 'Miami' },
];

export const FleetMap: React.FC<FleetMapProps> = ({ vehicles, trips, drivers }) => {
  const [selectedReg, setSelectedReg] = useState<string>('');
  const [simulationTime, setSimulationTime] = useState<number>(0);
  const [telemetryLog, setTelemetryLog] = useState<string[]>(['GPS tracking interface active.']);

  // Increment simulation time to animate moving vehicles
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulationTime((prev) => (prev + 1) % 100);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter for active trips
  const activeTrips = trips.filter((t) => t.status === 'Dispatched');

  // Select first active vehicle on load if none selected
  useEffect(() => {
    if (!selectedReg && vehicles.length > 0) {
      const firstActive = vehicles.find((v) => v.status === VehicleStatus.ON_TRIP);
      if (firstActive) {
        setSelectedReg(firstActive.registrationNumber);
      } else {
        setSelectedReg(vehicles[0].registrationNumber);
      }
    }
  }, [vehicles, selectedReg]);

  const selectedVehicle = vehicles.find((v) => v.registrationNumber === selectedReg);
  const activeTrip = selectedVehicle ? trips.find((t) => t.vehicleReg === selectedReg && t.status === 'Dispatched') : null;
  const assignedDriver = activeTrip ? drivers.find((d) => d.id === activeTrip.driverId) : null;

  // Resolve position coordinates for a vehicle
  const getVehicleCoords = (veh: Vehicle) => {
    const trip = trips.find((t) => t.vehicleReg === veh.registrationNumber && t.status === 'Dispatched');
    if (!trip) {
      // Parked vehicle: distribute them across hubs based on registration number hash
      const hubKeys = Object.keys(HUBS);
      let hash = 0;
      for (let i = 0; i < veh.registrationNumber.length; i++) {
        hash = veh.registrationNumber.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hubIndex = Math.abs(hash) % hubKeys.length;
      const assignedHubName = hubKeys[hubIndex];
      const hub = HUBS[assignedHubName];
      return { x: hub.x, y: hub.y, isParked: true, hubName: assignedHubName };
    }

    // Resolve source and destination coordinates
    const sourceHub = HUBS[trip.source] || HUBS['Chicago'];
    const destHub = HUBS[trip.destination] || HUBS['New York'];

    // Linear interpolation based on simulation time
    const t = (simulationTime / 100); // 0 to 1
    const x = sourceHub.x + (destHub.x - sourceHub.x) * t;
    const y = sourceHub.y + (destHub.y - sourceHub.y) * t;

    return { x, y, isParked: false, source: trip.source, destination: trip.destination, hubName: trip.source };
  };

  const selectedCoords = selectedVehicle 
    ? getVehicleCoords(selectedVehicle) 
    : { x: 250, y: 150, isParked: true, hubName: 'Chicago' };


  const triggerTelemetryPing = () => {
    if (!selectedVehicle) return;
    const speed = selectedVehicle.status === VehicleStatus.ON_TRIP ? Math.floor(55 + Math.random() * 15) : 0;
    const log = `Telemetry Ping [${selectedVehicle.registrationNumber}]: Speed ${speed} mph, Lat ${selectedCoords.y.toFixed(4)}, Lon ${selectedCoords.x.toFixed(4)}. Status: ${selectedVehicle.status.toUpperCase()}`;
    setTelemetryLog((prev) => [log, ...prev].slice(0, 5));
  };

  return (
    <div id="fleet-map-container" className="h-full flex flex-col lg:flex-row gap-5 p-1 select-none">
      
      {/* 1. Tactical GPS Map Viewport */}
      <div className="flex-1 bg-[#161A22] rounded-xl border border-[#2D3748] p-5 flex flex-col relative overflow-hidden shadow-lg min-h-[400px]">
        
        {/* Top HUD Controls overlay */}
        <div className="absolute top-4 left-4 z-10 bg-[#0D0F14]/90 border border-[#2D3748] rounded-lg p-3 flex flex-col gap-2 max-w-xs backdrop-blur-md">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
            <Compass className="h-4 w-4 text-[#d97707] animate-spin-slow" />
            <span>GPS Tracking Console</span>
          </div>
          <span className="text-[10px] text-[#dbc2b0]/60">Select active fleet asset below to trace route pathing and live positioning.</span>
          
          <select
            className="w-full bg-[#161A22] border border-[#2D3748] rounded px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#d97707]"
            value={selectedReg}
            onChange={(e) => {
              setSelectedReg(e.target.value);
              setTelemetryLog((prev) => [`Switched target: ${e.target.value}. Linking receiver...`, ...prev]);
            }}
          >
            {vehicles.map((v) => (
              <option key={v.registrationNumber} value={v.registrationNumber}>
                {v.registrationNumber} - {v.name} ({v.status})
              </option>
            ))}
          </select>
        </div>

        {/* Legend Hud overlay */}
        <div className="absolute bottom-4 left-4 z-10 bg-[#0D0F14]/90 border border-[#2D3748] rounded-lg p-2.5 flex items-center gap-4 text-[10px] text-[#dbc2b0]/80 backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d97707] animate-pulse"></span>
            <span>Selected Asset</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>On Trip</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
            <span>Idle / Parked</span>
          </div>
        </div>

        {/* SVG Tactical Vector Map */}
        <div className="flex-1 flex items-center justify-center relative w-full h-full min-h-[350px]">
          <svg
            className="w-full h-full max-h-[500px]"
            viewBox="0 0 500 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Tactical Grid Pattern */}
            <defs>
              <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#2D3748" strokeWidth="0.5" opacity="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Dotted Hub Routes */}
            {ROUTES.map((route, idx) => {
              const start = HUBS[route.from];
              const end = HUBS[route.to];
              if (!start || !end) return null;
              return (
                <line
                  key={idx}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="#2D3748"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Selected Active Trip Route Highlighting */}
            {activeTrip && (() => {
              const start = HUBS[activeTrip.source];
              const end = HUBS[activeTrip.destination];
              if (start && end) {
                return (
                  <>
                    <line
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke="#d97707"
                      strokeWidth="2"
                      strokeDasharray="2 3"
                      opacity="0.8"
                    />
                    {/* Pulsing signal wave on destination */}
                    <circle cx={end.x} cy={end.y} r="15" stroke="#d97707" strokeWidth="1" opacity="0.3" className="animate-ping" />
                  </>
                );
              }
              return null;
            })()}

            {/* Hub Depots Markers */}
            {Object.values(HUBS).map((hub) => (
              <g key={hub.name} className="cursor-default">
                <circle cx={hub.x} cy={hub.y} r="5.5" fill="#0D0F14" stroke="#4A5568" strokeWidth="2" />
                <text
                  x={hub.x}
                  y={hub.y - 10}
                  fill="#dbc2b0"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                  opacity="0.75"
                >
                  {hub.name.split(' - ')[0]}
                </text>
              </g>
            ))}

            {/* Other Active Vehicles on Trips */}
            {vehicles.filter(v => v.status === VehicleStatus.ON_TRIP && v.registrationNumber !== selectedReg).map((veh) => {
              const coords = getVehicleCoords(veh);
              return (
                <circle
                  key={veh.registrationNumber}
                  cx={coords.x}
                  cy={coords.y}
                  r="4"
                  fill="rgb(16, 185, 129)"
                  stroke="#161A22"
                  strokeWidth="1"
                />
              );
            })}

            {/* Selected Vehicle Glowing Signal Target Marker */}
            {selectedVehicle && (() => {
              const color = selectedVehicle.status === VehicleStatus.ON_TRIP ? 'rgb(245, 158, 11)' : 'rgb(59, 130, 246)';
              return (
                <g>
                  {/* Glowing Radar Sweep Ring */}
                  <circle cx={selectedCoords.x} cy={selectedCoords.y} r="12" stroke={color} strokeWidth="1.5" className="animate-ping" opacity="0.6" />
                  {/* Solid Center Vector */}
                  <circle cx={selectedCoords.x} cy={selectedCoords.y} r="5" fill={color} stroke="#161A22" strokeWidth="1.5" />
                  <path
                    d={`M ${selectedCoords.x} ${selectedCoords.y - 12} L ${selectedCoords.x} ${selectedCoords.y + 12} M ${selectedCoords.x - 12} ${selectedCoords.y} L ${selectedCoords.x + 12} ${selectedCoords.y}`}
                    stroke={color}
                    strokeWidth="0.5"
                    opacity="0.4"
                  />
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* 2. Side Panel - Telematic Details */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        
        {/* Telemetry Target Info panel */}
        <div className="bg-[#161A22] rounded-xl border border-[#2D3748] p-5 flex flex-col gap-4 shadow-lg">
          <div className="flex items-center gap-2 pb-2.5 border-b border-[#2D3748] text-white font-bold text-xs uppercase tracking-wider">
            <Activity className="h-4 w-4 text-[#d97707]" />
            <span>Target Telemetrics</span>
          </div>

          {selectedVehicle ? (
            <div className="space-y-4 text-xs font-semibold">
              <div className="flex justify-between items-center bg-[#0D0F14] p-3 rounded-lg border border-[#2D3748]/50">
                <div>
                  <span className="text-[10px] text-[#dbc2b0]/50 block uppercase">Registration</span>
                  <span className="text-white font-bold">{selectedVehicle.registrationNumber}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-black tracking-wider ${
                  selectedVehicle.status === VehicleStatus.ON_TRIP ? 'bg-[#d97707]/25 text-[#ffb77d] border border-[#d97707]/30' :
                  selectedVehicle.status === VehicleStatus.AVAILABLE ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  selectedVehicle.status === VehicleStatus.IN_SHOP ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {selectedVehicle.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <span className="text-[10px] text-[#dbc2b0]/50 block uppercase">Name / Model</span>
                  <span className="text-white block truncate">{selectedVehicle.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#dbc2b0]/50 block uppercase">Type</span>
                  <span className="text-white block">{selectedVehicle.type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#dbc2b0]/50 block uppercase">Max Capacity</span>
                  <span className="text-white block">{selectedVehicle.maxLoadCapacity} kg</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#dbc2b0]/50 block uppercase">Odometer</span>
                  <span className="text-white block">{selectedVehicle.odometer.toLocaleString()} mi</span>
                </div>
              </div>

              {activeTrip ? (
                <div className="mt-4 pt-3.5 border-t border-[#2D3748] space-y-3.5">
                  <div className="flex justify-between items-center text-[10px] text-[#dbc2b0]/80">
                    <span className="text-[#ffb77d] uppercase font-bold flex items-center gap-1">
                      <Navigation className="h-3 w-3 animate-pulse" />
                      Active Dispatch Run
                    </span>
                    <span>ID: {activeTrip.id}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#dbc2b0]/50 block uppercase">Route</span>
                    <div className="flex items-center gap-2 text-white font-bold">
                      <span>{activeTrip.source}</span>
                      <span className="text-[#d97707]">➔</span>
                      <span>{activeTrip.destination}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[10px] text-[#dbc2b0]/50 block">Cargo Weight</span>
                      <span className="text-white">{activeTrip.cargoWeight} kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#dbc2b0]/50 block">Distance</span>
                      <span className="text-white">{activeTrip.plannedDistance} mi</span>
                    </div>
                  </div>

                  {assignedDriver && (
                    <div className="bg-[#0D0F14]/70 p-3 rounded-lg border border-[#2D3748]/40 space-y-1">
                      <span className="text-[9px] text-[#dbc2b0]/50 uppercase font-black">Operator Profile</span>
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold">{assignedDriver.name}</span>
                        <span className="text-[#ffb77d] text-[10px]">Score: {assignedDriver.safetyScore}/100</span>
                      </div>
                    </div>
                  )}

                  {/* Simulated live progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span>Route Progress</span>
                      <span className="text-white">{simulationTime}%</span>
                    </div>
                    <div className="w-full bg-[#0D0F14] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#d97707] h-full transition-all duration-1000"
                        style={{ width: `${simulationTime}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-3.5 border-t border-[#2D3748] space-y-3.5">
                  <div>
                    <span className="text-[10px] text-[#dbc2b0]/50 block uppercase">Current Location</span>
                    <span className="text-white font-bold block">Parked at {selectedCoords.hubName}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 py-4 text-center text-[#dbc2b0]/60">
                    <ShieldAlert className="h-5 w-5 text-[#2D3748] shrink-0" />
                    <span>No active dispatch route loaded for this asset. Status is parked/maintenance.</span>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={triggerTelemetryPing}
                  className="w-full bg-[#d97707] hover:bg-[#b45309] text-black font-black py-2 rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Ping Receiver Telemetry
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#dbc2b0]/50 text-center py-6">Connecting target tracker...</p>
          )}
        </div>

        {/* Telemetry Broadcast Logger */}
        <div className="bg-[#161A22] rounded-xl border border-[#2D3748] p-5 flex flex-col gap-3 shadow-lg flex-grow min-h-[150px]">
          <div className="text-white font-bold text-xs uppercase tracking-wider border-b border-[#2D3748] pb-2">
            Sat-Link Signal Logs
          </div>
          <div className="space-y-2 text-[10px] font-mono text-[#dbc2b0]/70 leading-relaxed overflow-y-auto max-h-40">
            {telemetryLog.map((log, idx) => (
              <div key={idx} className="border-b border-[#2D3748]/35 pb-1">
                <span className="text-[#d97707] font-bold">&gt;&gt;</span> {log}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
