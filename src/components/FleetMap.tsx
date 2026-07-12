import React, { useState, useEffect, useRef } from 'react';
import { Compass, ShieldAlert, Activity, Navigation, MapPin } from 'lucide-react';
import { Vehicle, VehicleStatus, Trip, Driver } from '../types';

interface FleetMapProps {
  vehicles: Vehicle[];
  trips: Trip[];
  drivers: Driver[];
}

const REAL_HUBS: Record<string, { name: string; lat: number; lng: number }> = {
  'Chicago': { name: 'Main Hub - Chicago', lat: 41.8781, lng: -87.6298 },
  'New York': { name: 'East Terminal - New York', lat: 40.7128, lng: -74.0060 },
  'Houston': { name: 'South Depot - Houston', lat: 29.7604, lng: -95.3698 },
  'Los Angeles': { name: 'West Gate - Los Angeles', lat: 34.0522, lng: -118.2437 },
  'Seattle': { name: 'Northwest - Seattle', lat: 47.6062, lng: -122.3321 },
  'Miami': { name: 'Southeast Terminal - Miami', lat: 25.7617, lng: -80.1918 },
  'Denver': { name: 'Mountain Hub - Denver', lat: 39.7392, lng: -104.9903 },
};

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
  const [telemetryLog, setTelemetryLog] = useState<string[]>(['Real-world GIS interface initialized.']);
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const routeLinesRef = useRef<any[]>([]);

  // Increment simulation time to animate moving vehicles
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulationTime((prev) => (prev + 1) % 100);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load Leaflet CSS and JS Dynamically from UNPKG CDN
  useEffect(() => {
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.id = 'leaflet-css';
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      const existingLink = document.getElementById('leaflet-css');
      if (existingLink) existingLink.remove();
    };
  }, []);

  // Set default selection
  useEffect(() => {
    if (!selectedReg && vehicles.length > 0) {
      const firstActive = vehicles.find((v) => v.status === VehicleStatus.ON_TRIP);
      setSelectedReg(firstActive ? firstActive.registrationNumber : vehicles[0].registrationNumber);
    }
  }, [vehicles, selectedReg]);

  const selectedVehicle = vehicles.find((v) => v.registrationNumber === selectedReg);
  const activeTrip = selectedVehicle ? trips.find((t) => t.vehicleReg === selectedReg && t.status === 'Dispatched') : null;
  const assignedDriver = activeTrip ? drivers.find((d) => d.id === activeTrip.driverId) : null;

  // Coordinate resolution
  const getVehicleCoords = (veh: Vehicle) => {
    const trip = trips.find((t) => t.vehicleReg === veh.registrationNumber && t.status === 'Dispatched');
    if (!trip) {
      const hubKeys = Object.keys(REAL_HUBS);
      let hash = 0;
      for (let i = 0; i < veh.registrationNumber.length; i++) {
        hash = veh.registrationNumber.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hubIndex = Math.abs(hash) % hubKeys.length;
      const assignedHubName = hubKeys[hubIndex];
      const hub = REAL_HUBS[assignedHubName];
      return { lat: hub.lat, lng: hub.lng, isParked: true, hubName: assignedHubName };
    }

    const sourceHub = REAL_HUBS[trip.source] || REAL_HUBS['Chicago'];
    const destHub = REAL_HUBS[trip.destination] || REAL_HUBS['New York'];

    const t = simulationTime / 100;
    const lat = sourceHub.lat + (destHub.lat - sourceHub.lat) * t;
    const lng = sourceHub.lng + (destHub.lng - sourceHub.lng) * t;

    return { lat, lng, isParked: false, source: trip.source, destination: trip.destination, hubName: trip.source };
  };

  const selectedCoords = selectedVehicle 
    ? getVehicleCoords(selectedVehicle) 
    : { lat: 41.8781, lng: -87.6298, isParked: true, hubName: 'Chicago' };

  // Initialize and update Leaflet Map instance
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;
    const L = (window as any).L;

    // Initialize Map Instance if not exists
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([39.8283, -98.5795], 4); // Center on USA

      // Add CartoDB Dark Matter tile layer for premium dark aesthetics
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Add zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);

      // Plot Hub Depots
      Object.entries(REAL_HUBS).forEach(([key, hub]) => {
        const hubIcon = L.divIcon({
          className: 'custom-hub-icon',
          html: `<div class="relative flex items-center justify-center">
                   <div class="absolute w-4 h-4 rounded-full bg-[#d97707]/20 border border-[#d97707]/60 animate-ping"></div>
                   <div class="w-2.5 h-2.5 rounded-full bg-[#d97707] border border-[#0D0F14]"></div>
                   <span class="absolute top-4 text-[9px] font-bold text-[#dbc2b0]/80 whitespace-nowrap bg-[#161A22] border border-[#2D3748] px-1 rounded shadow-sm">${key} Depot</span>
                 </div>`,
          iconSize: [20, 20],
        });
        L.marker([hub.lat, hub.lng], { icon: hubIcon }).addTo(mapInstanceRef.current);
      });

      // Plot Base Routes
      ROUTES.forEach((route) => {
        const start = REAL_HUBS[route.from];
        const end = REAL_HUBS[route.to];
        if (start && end) {
          L.polyline([[start.lat, start.lng], [end.lat, end.lng]], {
            color: '#2D3748',
            weight: 1.5,
            dashArray: '4, 6',
            opacity: 0.6
          }).addTo(mapInstanceRef.current);
        }
      });
    }

    const map = mapInstanceRef.current;

    // Draw active routes line
    routeLinesRef.current.forEach((line) => line.remove());
    routeLinesRef.current = [];

    // Clear old vehicle markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Draw lines and place markers for ALL vehicles
    vehicles.forEach((veh) => {
      const coords = getVehicleCoords(veh);
      const isSelected = veh.registrationNumber === selectedReg;
      const color = veh.status === VehicleStatus.ON_TRIP ? '#10b981' : '#3b82f6';
      
      // If it is on trip and selected, draw its path line
      if (veh.status === VehicleStatus.ON_TRIP && isSelected && activeTrip) {
        const start = REAL_HUBS[activeTrip.source];
        const end = REAL_HUBS[activeTrip.destination];
        if (start && end) {
          const pathLine = L.polyline([[start.lat, start.lng], [end.lat, end.lng]], {
            color: '#d97707',
            weight: 2,
            dashArray: '3, 4',
            opacity: 0.8
          }).addTo(map);
          routeLinesRef.current.push(pathLine);
        }
      }

      // Create vehicle marker div
      const markerHtml = isSelected
        ? `<div class="relative flex items-center justify-center">
             <div class="absolute w-8 h-8 rounded-full bg-orange-500/20 animate-ping"></div>
             <div class="absolute w-6 h-6 rounded-full bg-orange-500/30 border border-orange-500/50"></div>
             <div class="w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white shadow-md flex items-center justify-center text-[8px] font-black text-black">!</div>
           </div>`
        : `<div class="relative flex items-center justify-center">
             <div class="w-3 h-3 rounded-full bg-[${color}] border border-[#161A22]"></div>
           </div>`;

      const vehicleIcon = L.divIcon({
        className: 'custom-vehicle-marker',
        html: markerHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([coords.lat, coords.lng], { icon: vehicleIcon }).addTo(map);
      markersRef.current[veh.registrationNumber] = marker;
    });

  }, [leafletLoaded, vehicles, simulationTime, selectedReg, trips]);

  // Center map on selected vehicle
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current || !selectedVehicle) return;
    const coords = getVehicleCoords(selectedVehicle);
    mapInstanceRef.current.setView([coords.lat, coords.lng], 5);
  }, [selectedReg, leafletLoaded]);

  const triggerTelemetryPing = () => {
    if (!selectedVehicle) return;
    const speed = selectedVehicle.status === VehicleStatus.ON_TRIP ? Math.floor(55 + Math.random() * 15) : 0;
    const log = `Sat-Telemetry [${selectedVehicle.registrationNumber}]: Speed ${speed} mph, Lat ${selectedCoords.lat.toFixed(4)}, Lng ${selectedCoords.lng.toFixed(4)}. Depot Range: Nominal.`;
    setTelemetryLog((prev) => [log, ...prev].slice(0, 5));
  };

  return (
    <div id="fleet-map-container" className="h-full flex flex-col lg:flex-row gap-5 p-1 select-none">
      
      {/* 1. Real-World Leaflet Viewport */}
      <div className="flex-grow bg-[#161A22] rounded-xl border border-[#2D3748] flex flex-col relative overflow-hidden shadow-lg min-h-[450px]">
        
        {/* Map Canvas div */}
        <div ref={mapRef} className="w-full h-full min-h-[450px] z-10" />

        {/* Top HUD Controls overlay */}
        <div className="absolute top-4 left-4 z-20 bg-[#0D0F14]/95 border border-[#2D3748] rounded-xl p-4 flex flex-col gap-2.5 max-w-xs shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
            <Compass className="h-4 w-4 text-[#d97707] animate-spin-slow" />
            <span>Real-World GPS Console</span>
          </div>
          <span className="text-[10px] text-[#dbc2b0]/60">Select active fleet asset below to trace route pathing and live positioning.</span>
          
          <select
            className="w-full bg-[#161A22] border border-[#2D3748] rounded-lg px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-[#d97707]"
            value={selectedReg}
            onChange={(e) => {
              setSelectedReg(e.target.value);
              setTelemetryLog((prev) => [`Target locked: ${e.target.value}. Recalibrating satellite...`, ...prev]);
            }}
          >
            {vehicles.map((v) => (
              <option key={v.registrationNumber} value={v.registrationNumber}>
                {v.registrationNumber} - {v.name} ({v.status})
              </option>
            ))}
          </select>
        </div>

        {/* Legend HUD overlay */}
        <div className="absolute bottom-4 left-4 z-20 bg-[#0D0F14]/95 border border-[#2D3748] rounded-lg p-2.5 flex items-center gap-4 text-[10px] text-[#dbc2b0]/80 shadow-md backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
            <span>Target Lock</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Active Run</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Parked</span>
          </div>
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
                    <span className="text-white font-bold block">Parked at {selectedCoords.hubName} Hub</span>
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
