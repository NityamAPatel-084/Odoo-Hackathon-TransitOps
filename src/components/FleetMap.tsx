import React, { useState, useEffect } from 'react';
import { MapPin, Info, Navigation, ShieldAlert, Compass, Activity, Maximize2, Minimize2 } from 'lucide-react';
import { Vehicle, VehicleStatus, Trip, Driver } from '../types';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icons for leaflet in react
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons matching our dark theme
const hubIcon = new L.DivIcon({
  className: 'bg-transparent',
  html: `<div style="background-color: #0D0F14; border: 2px solid #4A5568; border-radius: 50%; width: 12px; height: 12px; transform: translate(-6px, -6px);"></div>`,
  iconSize: [0, 0]
});

const vehicleIcon = new L.DivIcon({
  className: 'bg-transparent',
  html: `<div style="background-color: #10B981; border: 1px solid #161A22; border-radius: 50%; width: 10px; height: 10px; transform: translate(-5px, -5px);"></div>`,
  iconSize: [0, 0]
});

const getSelectedVehicleIcon = (isIdle: boolean) => new L.DivIcon({
  className: 'bg-transparent',
  html: `
    <div style="position: relative; transform: translate(-5px, -5px);">
      <div style="position: absolute; top: -7px; left: -7px; background-color: transparent; border: 2px solid ${isIdle ? '#3b82f6' : '#d97707'}; border-radius: 50%; width: 24px; height: 24px; opacity: 0.6;" class="animate-ping"></div>
      <div style="background-color: ${isIdle ? '#3b82f6' : '#d97707'}; border: 2px solid #161A22; border-radius: 50%; width: 12px; height: 12px; position: absolute; top: -1px; left: -1px;"></div>
    </div>
  `,
  iconSize: [0, 0]
});

interface FleetMapProps {
  vehicles: Vehicle[];
  trips: Trip[];
  drivers: Driver[];
}

// Coordinate mappings for major cities/hubs
const HUBS: Record<string, { name: string; lat: number; lng: number }> = {
  'Chicago': { name: 'Main Hub - Chicago', lat: 41.8781, lng: -87.6298 },
  'New York': { name: 'East Terminal - New York', lat: 40.7128, lng: -74.0060 },
  'Houston': { name: 'South Depot - Houston', lat: 29.7604, lng: -95.3698 },
  'Los Angeles': { name: 'West Gate - Los Angeles', lat: 34.0522, lng: -118.2437 },
  'Seattle': { name: 'Northwest - Seattle', lat: 47.6062, lng: -122.3321 },
  'Miami': { name: 'Southeast Terminal - Miami', lat: 25.7617, lng: -80.1918 },
  'Denver': { name: 'Mountain Hub - Denver', lat: 39.7392, lng: -104.9903 },
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
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

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
      return { lat: hub.lat, lng: hub.lng, isParked: true, hubName: assignedHubName };
    }

    // Resolve source and destination coordinates
    const sourceHub = HUBS[trip.source] || HUBS['Chicago'];
    const destHub = HUBS[trip.destination] || HUBS['New York'];

    // Linear interpolation based on simulation time
    const t = (simulationTime / 100); // 0 to 1
    const lat = sourceHub.lat + (destHub.lat - sourceHub.lat) * t;
    const lng = sourceHub.lng + (destHub.lng - sourceHub.lng) * t;

    return { lat, lng, isParked: false, source: trip.source, destination: trip.destination, hubName: trip.source };
  };

  const selectedCoords = selectedVehicle 
    ? getVehicleCoords(selectedVehicle) 
    : { lat: 41.8781, lng: -87.6298, isParked: true, hubName: 'Chicago' };


  const triggerTelemetryPing = () => {
    if (!selectedVehicle) return;
    const speed = selectedVehicle.status === VehicleStatus.ON_TRIP ? Math.floor(55 + Math.random() * 15) : 0;
    const log = `Telemetry Ping [${selectedVehicle.registrationNumber}]: Speed ${speed} mph, Lat ${selectedCoords.lat.toFixed(4)}, Lon ${selectedCoords.lng.toFixed(4)}. Status: ${selectedVehicle.status.toUpperCase()}`;
    setTelemetryLog((prev) => [log, ...prev].slice(0, 5));
  };

  return (
    <div id="fleet-map-container" className="h-full flex flex-col lg:flex-row gap-5 p-1 select-none">
      
      {/* 1. Tactical GPS Map Viewport */}
      <div className={
        isFullScreen 
          ? "fixed inset-0 w-screen h-screen z-[9999] bg-[#161A22] flex flex-col overflow-hidden m-0 p-0" 
          : "flex-1 bg-[#161A22] rounded-xl border border-[#2D3748] p-5 flex flex-col relative overflow-hidden shadow-lg min-h-[400px]"
      }>
        
        {/* Top HUD Controls overlay */}
        <div className="absolute top-4 left-4 z-[400] bg-[#0D0F14]/90 border border-[#2D3748] rounded-lg p-3 flex flex-col gap-2 max-w-xs backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
              <Compass className="h-4 w-4 text-[#d97707] animate-spin-slow" />
              <span>GPS Tracking Console</span>
            </div>
            <button 
              onClick={() => {
                setIsFullScreen(!isFullScreen);
                // Dispatch resize event so leaflet recalculates size
                setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
              }}
              className="text-[#dbc2b0] hover:text-[#d97707] transition-colors p-1"
              title={isFullScreen ? "Exit Full Screen" : "Enlarge Map"}
            >
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
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
        <div className="absolute bottom-4 left-4 z-[400] bg-[#0D0F14]/90 border border-[#2D3748] rounded-lg p-2.5 flex items-center gap-4 text-[10px] text-[#dbc2b0]/80 backdrop-blur-md pointer-events-none">
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

        {/* Leaflet Interactive Map */}
        <div className="flex-1 w-full h-full min-h-[350px] relative z-0">
          <MapContainer 
            center={[39.8283, -98.5795]} // Center of USA
            zoom={4} 
            className="w-full h-full rounded-md"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {/* Dotted Hub Routes */}
            {ROUTES.map((route, idx) => {
              const start = HUBS[route.from];
              const end = HUBS[route.to];
              if (!start || !end) return null;
              return (
                <Polyline 
                  key={idx} 
                  positions={[[start.lat, start.lng], [end.lat, end.lng]]} 
                  pathOptions={{ color: '#2D3748', weight: 1.5, dashArray: '4, 4' }} 
                />
              );
            })}

            {/* Selected Active Trip Route Highlighting */}
            {activeTrip && (() => {
              const start = HUBS[activeTrip.source];
              const end = HUBS[activeTrip.destination];
              if (start && end) {
                return (
                  <Polyline 
                    positions={[[start.lat, start.lng], [end.lat, end.lng]]} 
                    pathOptions={{ color: '#d97707', weight: 2, dashArray: '2, 3', opacity: 0.8 }} 
                  />
                );
              }
              return null;
            })()}

            {/* Hub Depots Markers */}
            {Object.values(HUBS).map((hub) => (
              <Marker key={hub.name} position={[hub.lat, hub.lng]} icon={hubIcon}>
                <Popup className="bg-[#161A22] border border-[#2D3748] text-white p-0 m-0 custom-popup">
                  <div className="bg-[#161A22] text-white p-2 text-xs font-bold whitespace-nowrap m-0 rounded border border-[#2D3748]">
                    {hub.name}
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Other Active Vehicles on Trips */}
            {vehicles.filter(v => v.status === VehicleStatus.ON_TRIP && v.registrationNumber !== selectedReg).map((veh) => {
              const coords = getVehicleCoords(veh);
              return (
                <Marker 
                  key={veh.registrationNumber} 
                  position={[coords.lat, coords.lng]} 
                  icon={vehicleIcon}
                >
                  <Popup>
                    <div className="bg-[#161A22] text-white p-2 text-xs font-bold rounded border border-[#2D3748]">
                      {veh.registrationNumber} - {veh.name}
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Selected Vehicle Glowing Signal Target Marker */}
            {selectedVehicle && (
              <Marker 
                position={[selectedCoords.lat, selectedCoords.lng]} 
                icon={getSelectedVehicleIcon(selectedVehicle.status !== VehicleStatus.ON_TRIP)}
                zIndexOffset={1000}
              >
                <Popup>
                   <div className="bg-[#161A22] text-white p-2 text-xs font-bold rounded border border-[#2D3748]">
                      TARGET: {selectedVehicle.registrationNumber}
                    </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
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
