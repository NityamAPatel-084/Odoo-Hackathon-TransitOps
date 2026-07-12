import React, { useState } from 'react';
import { Vehicle, Driver, Trip, VehicleStatus, DriverStatus, TripStatus } from '../types';
import { Send, ArrowRight, User, Clock, NavigationOff } from 'lucide-react';

interface TripDispatchProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  onExecuteDispatch: (newTrip: Trip) => void;
  onCompleteTrip: (tripId: string) => void;
  onCancelTrip: (tripId: string) => void;
}

export const TripDispatch: React.FC<TripDispatchProps> = ({
  vehicles,
  drivers,
  trips,
  onExecuteDispatch,
  onCompleteTrip,
  onCancelTrip,
}) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [distance, setDistance] = useState('');
  const [vehicleReg, setVehicleReg] = useState('');
  const [driverId, setDriverId] = useState('');

  const availableVehicles = vehicles.filter(v => v.status === VehicleStatus.AVAILABLE);
  const availableDrivers = drivers.filter(d => d.status === DriverStatus.AVAILABLE);

  // Set default selections when modal/lists render
  React.useEffect(() => {
    if (availableVehicles.length > 0 && !vehicleReg) {
      setVehicleReg(availableVehicles[0].registrationNumber);
    }
    if (availableDrivers.length > 0 && !driverId) {
      setDriverId(availableDrivers[0].id);
    }
  }, [availableVehicles, availableDrivers, vehicleReg, driverId]);

  const getFutureEta = (): string => {
    const hours = Math.floor(1 + Math.random() * 8);
    const minutes = Math.floor(10 + Math.random() * 49);
    return `${hours}h ${minutes}m`;
  };

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicleReg || !driverId) {
      alert('Must select an available vehicle and an active driver.');
      return;
    }

    const newTripId = `TRP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTrip: Trip = {
      id: newTripId,
      source,
      destination,
      cargoWeight: parseInt(weight) || 0,
      plannedDistance: parseInt(distance) || 0,
      vehicleReg,
      driverId,
      status: TripStatus.DISPATCHED,
      eta: getFutureEta(),
    };

    onExecuteDispatch(newTrip);

    // Reset Form
    setSource('');
    setDestination('');
    setWeight('');
    setDistance('');
    setVehicleReg('');
    setDriverId('');

    alert(`Successfully Dispatched Load! ID: ${newTripId}`);
  };

  const getTripStatusStyle = (status: TripStatus): string => {
    switch (status) {
      case TripStatus.DISPATCHED:
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case TripStatus.COMPLETED:
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case TripStatus.DRAFT:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
      case TripStatus.CANCELLED:
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#38251a]">
        <h3 className="font-bold text-lg text-white">Dispatch Control Center</h3>
        <p className="text-xs text-[#dbc2b0]/60">Dispatch freight loads to active drivers and track fleet transits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Load Dispatch Console */}
        <div className="bg-[#221610] border border-[#38251a] rounded p-5 space-y-4">
          <h4 className="font-bold text-sm text-white border-b border-[#38251a] pb-2">Load Dispatch Console</h4>
          <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0]/70 uppercase block">Source Location</label>
              <input 
                type="text" 
                placeholder="e.g. Seattle Port, WA" 
                required 
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/40 focus:outline-none" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0]/70 uppercase block">Destination Location</label>
              <input 
                type="text" 
                placeholder="e.g. Salt Lake City, UT" 
                required 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/40 focus:outline-none" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#dbc2b0]/70 uppercase block">Cargo Weight (lbs)</label>
                <input 
                  type="number" 
                  placeholder="22000" 
                  required 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/40 focus:outline-none" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#dbc2b0]/70 uppercase block">Planned Distance (mi)</label>
                <input 
                  type="number" 
                  placeholder="380" 
                  required 
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white placeholder-[#dbc2b0]/40 focus:outline-none" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0]/70 uppercase block">Assign Vehicle (Available Only)</label>
              <select 
                value={vehicleReg}
                onChange={(e) => setVehicleReg(e.target.value)}
                required
                className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white focus:outline-none"
              >
                {availableVehicles.length === 0 ? (
                  <option value="">No Available Vehicles</option>
                ) : (
                  availableVehicles.map(v => (
                    <option key={v.registrationNumber} value={v.registrationNumber}>
                      {v.registrationNumber} - {v.name} ({v.type})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#dbc2b0]/70 uppercase block">Assign CDL Driver (Available Only)</label>
              <select 
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                required
                className="w-full bg-[#150e0a] border border-[#38251a] rounded px-3 py-2 text-white focus:outline-none"
              >
                {availableDrivers.length === 0 ? (
                  <option value="">No Available Drivers</option>
                ) : (
                  availableDrivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.id} - {d.name} ({d.licenseCategory})
                    </option>
                  ))
                )}
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#d97707] hover:bg-[#b45309] text-white font-bold py-2.5 rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>Execute Load Dispatch</span>
            </button>
          </form>
        </div>

        {/* Dispatch Tracker List */}
        <div className="lg:col-span-2 bg-[#221610] border border-[#38251a] rounded p-5 flex flex-col">
          <h4 className="font-bold text-sm text-white border-b border-[#38251a] pb-2 mb-4">Transit Monitoring Panel</h4>
          <div className="flex-1 overflow-y-auto space-y-4" id="dispatch-tracker-list">
            {trips.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#dbc2b0]/40 p-12 text-center">
                <NavigationOff className="h-10 w-10 text-[#dbc2b0]/25 mb-2" />
                <p className="text-xs font-semibold">No dispatches registered.</p>
              </div>
            ) : (
              trips.map((trip) => {
                const driverObj = drivers.find(d => d.id === trip.driverId);
                return (
                  <div key={trip.id} className="bg-[#150e0a] border border-[#38251a] rounded p-4 space-y-3 hover:border-[#dbc2b0]/35 transition-all">
                    <div className="flex justify-between items-center text-xs pb-2.5 border-b border-[#38251a]/40">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm">{trip.id}</span>
                        <span className="font-mono text-[10px] bg-[#d97707]/15 text-[#ffb77d] border border-[#d97707]/30 px-1.5 py-0.5 rounded font-bold uppercase">{trip.vehicleReg}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getTripStatusStyle(trip.status)}`}>
                        {trip.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs py-1">
                      <div className="space-y-1">
                        <div className="text-[#dbc2b0]/50 text-[10px] uppercase font-bold">Route Log</div>
                        <div className="flex items-center gap-1.5 mt-0.5 font-semibold text-white">
                          <span className="truncate max-w-[110px]">{trip.source}</span>
                          <ArrowRight className="h-3 w-3 text-[#ffb77d] shrink-0" />
                          <span className="truncate max-w-[110px]">{trip.destination}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[#dbc2b0]/50 text-[10px] uppercase font-bold">Driver Assigned</div>
                        <div className="mt-0.5 font-semibold text-white flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-[#dbc2b0]/60 shrink-0" />
                          <span className="truncate">{driverObj ? driverObj.name : trip.driverId}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[#dbc2b0]/50 text-[10px] uppercase font-bold">Trip Specs</div>
                        <div className="mt-0.5 font-semibold text-white font-mono flex items-center justify-between gap-2">
                          <span>Dist: {trip.plannedDistance} mi</span>
                          <span>•</span>
                          <span>Load: {trip.cargoWeight.toLocaleString()} lbs</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons if dispatched */}
                    {trip.status === TripStatus.DISPATCHED && (
                      <div className="pt-2 flex justify-end gap-2 border-t border-[#38251a]/30">
                        <button 
                          onClick={() => onCancelTrip(trip.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Cancel Trip
                        </button>
                        <button 
                          onClick={() => onCompleteTrip(trip.id)}
                          className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Complete & Register Odometer
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
export default TripDispatch;
