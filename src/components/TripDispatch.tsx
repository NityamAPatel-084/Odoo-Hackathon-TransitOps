import React, { useState } from 'react';
<<<<<<< HEAD
import { Trip, TripStatus, Vehicle, VehicleStatus, Driver, DriverStatus, UserRole } from '../types';
import { Navigation, Plus, MapPin, Truck, User, Scale, ArrowRight, AlertTriangle, ShieldCheck, CheckCircle, HelpCircle, X } from 'lucide-react';

interface TripDispatchProps {
  trips: Trip[];
  vehicles: Vehicle[];
  drivers: Driver[];
  userRole: UserRole;
  onAddTrip: (trip: Trip) => void;
  onUpdateTripStatus: (tripId: string, status: TripStatus, finalOdo?: number, fuelConsumed?: number) => void;
}

export default function TripDispatch({
  trips,
  vehicles,
  drivers,
  userRole,
  onAddTrip,
  onUpdateTripStatus,
}: TripDispatchProps) {
  const isDispatcherOrManager = userRole === UserRole.DISPATCHER || userRole === UserRole.FLEET_MANAGER;

  // Tabs for Filtering Routes
  const [activeTab, setActiveTab] = useState<TripStatus | 'ALL'>('ALL');

  // Form states
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [cargoWeight, setCargoWeight] = useState<number>(10000);
  const [distance, setDistance] = useState<number>(200);
  const [selectedVehicleReg, setSelectedVehicleReg] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Completion modal/popover states
  const [completingTripId, setCompletingTripId] = useState<string | null>(null);
  const [finalOdo, setFinalOdo] = useState<number>(0);
  const [fuelConsumed, setFuelConsumed] = useState<number>(50);

  // Filter available items based on business rules
  const availableVehiclesForDispatch = vehicles.filter(
    (v) => v.status === VehicleStatus.AVAILABLE
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const availableDriversForDispatch = drivers.filter(
    (d) => d.status === DriverStatus.AVAILABLE && d.licenseExpiryDate >= todayStr
  );

  // Selected Vehicle validation helper
  const selectedVehicle = vehicles.find((v) => v.registrationNumber === selectedVehicleReg);
  const weightOverlimit = selectedVehicle ? cargoWeight > selectedVehicle.maxLoadCapacity : false;

  // Selected Driver helper
  const selectedDriver = drivers.find((d) => d.id === selectedDriverId);

  // Create & Dispatch
  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !destination || !selectedVehicleReg || !selectedDriverId) {
      setFormError('Please complete all fields to dispatch.');
      return;
    }

    if (weightOverlimit) {
      setFormError(`Overlimit Error: Cargo weight (${cargoWeight.toLocaleString()} kg) exceeds the selected vehicle's capacity (${selectedVehicle?.maxLoadCapacity.toLocaleString()} kg).`);
      return;
    }

    // Assign random ID
    const newTrip: Trip = {
      id: `TRP-${Math.floor(8000 + Math.random() * 999)}`,
      source: source.trim(),
      destination: destination.trim(),
      vehicleReg: selectedVehicleReg,
      driverId: selectedDriverId,
      cargoWeight,
      plannedDistance: distance,
      status: TripStatus.DISPATCHED, // Under rule 6: instantly dispatched or drafted. Let's make it Dispatched as requested.
      eta: new Date(Date.now() + 3600000 * 3).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onAddTrip(newTrip);
=======
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
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7

    // Reset Form
    setSource('');
    setDestination('');
<<<<<<< HEAD
    setCargoWeight(10000);
    setDistance(200);
    setSelectedVehicleReg('');
    setSelectedDriverId('');
    setFormError(null);
  };

  // Start completion flow
  const handleStartCompletion = (trip: Trip) => {
    const v = vehicles.find(veh => veh.registrationNumber === trip.vehicleReg);
    setCompletingTripId(trip.id);
    setFinalOdo(v ? v.odometer + trip.plannedDistance : trip.plannedDistance);
    setFuelConsumed(Math.round(trip.plannedDistance * 0.4)); // estimate fuel
  };

  const handleSaveCompletion = () => {
    if (completingTripId) {
      onUpdateTripStatus(completingTripId, TripStatus.COMPLETED, finalOdo, fuelConsumed);
      setCompletingTripId(null);
    }
  };

  // Filter routes according to tab selection
  const filteredTrips = trips.filter((t) => {
    if (activeTab === 'ALL') return true;
    return t.status === activeTab;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Active Dispatch Console</h2>
        <p className="text-xs text-[#dbc2b0] max-w-2xl mt-1">
          Plan, dispatch, and track active route progress. Enforces strict safety matching and load limit checks.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Create Assignment & Live Safety Matrix */}
        <div className="lg:w-2/5 flex flex-col gap-6 shrink-0">
          
          {/* Dispatch Assignment Box */}
          <div className="bg-[#161A22] border border-[#2D3748] rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <Navigation className="h-4.5 w-4.5 text-[#ffb77d]" />
              New Transit Dispatch
            </h3>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-xs text-red-400 mb-4 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {isDispatcherOrManager ? (
              <form onSubmit={handleCreateTrip} className="space-y-4">
                
                {/* Route Locations */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Origin City</label>
                    <div className="relative">
                      <MapPin className="h-3.5 w-3.5 text-[#dbc2b0]/50 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        className="w-full bg-[#0D0F14] border border-[#2D3748] rounded pl-8 pr-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                        placeholder="e.g. Seattle, WA"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Destination City</label>
                    <div className="relative">
                      <MapPin className="h-3.5 w-3.5 text-[#dbc2b0]/50 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        className="w-full bg-[#0D0F14] border border-[#2D3748] rounded pl-8 pr-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                        placeholder="e.g. Portland, OR"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Cargo weight (kg)</label>
                    <div className="relative">
                      <Scale className="h-3.5 w-3.5 text-[#dbc2b0]/50 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        className="w-full bg-[#0D0F14] border border-[#2D3748] rounded pl-8 pr-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                        value={cargoWeight}
                        onChange={(e) => setCargoWeight(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Planned Distance (mi)</label>
                    <input
                      type="number"
                      className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                      value={distance}
                      onChange={(e) => setDistance(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                {/* Vehicle Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Select Available Asset</label>
                  <div className="relative">
                    <Truck className="h-3.5 w-3.5 text-[#dbc2b0]/50 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <select
                      className="w-full bg-[#0D0F14] border border-[#2D3748] rounded pl-8 pr-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d] appearance-none cursor-pointer"
                      value={selectedVehicleReg}
                      onChange={(e) => setSelectedVehicleReg(e.target.value)}
                      required
                    >
                      <option value="">-- Choose Deployed Vehicle --</option>
                      {availableVehiclesForDispatch.map((v) => (
                        <option key={v.registrationNumber} value={v.registrationNumber}>
                          {v.registrationNumber} - {v.name} (Cap: {v.maxLoadCapacity.toLocaleString()} kg)
                        </option>
                      ))}
                    </select>
                  </div>
                  {availableVehiclesForDispatch.length === 0 && (
                    <p className="text-[10px] text-[#ffb77d] mt-1">⚠️ No available assets registered in depot.</p>
                  )}
                </div>

                {/* Driver Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Select Available Operator</label>
                  <div className="relative">
                    <User className="h-3.5 w-3.5 text-[#dbc2b0]/50 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <select
                      className="w-full bg-[#0D0F14] border border-[#2D3748] rounded pl-8 pr-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d] appearance-none cursor-pointer"
                      value={selectedDriverId}
                      onChange={(e) => setSelectedDriverId(e.target.value)}
                      required
                    >
                      <option value="">-- Choose Operator --</option>
                      {availableDriversForDispatch.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} (Rating: {d.safetyScore}/100, Class: CDL-A)
                        </option>
                      ))}
                    </select>
                  </div>
                  {availableDriversForDispatch.length === 0 && (
                    <p className="text-[10px] text-[#ffb77d] mt-1">⚠️ No qualified available operators in depot.</p>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={!selectedVehicleReg || !selectedDriverId || weightOverlimit}
                  className="w-full bg-[#d97707] hover:bg-[#b45309] disabled:bg-[#2D3748] disabled:text-[#dbc2b0]/40 text-black font-bold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-2 border border-[#ffb77d]/30 cursor-pointer"
                >
                  Create & Launch Dispatch Route
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <div className="bg-[#0D0F14]/40 border border-[#2D3748] p-4 rounded-lg text-xs text-[#dbc2b0] text-center">
                <AlertTriangle className="h-6 w-6 text-[#ffb77d] mx-auto mb-2" />
                <p className="font-semibold text-white">Read-Only Dispatch Screen</p>
                <p className="mt-1">Only Dispatchers or Fleet Managers can issue dispatch assignments and edit routes.</p>
              </div>
            )}
          </div>

          {/* Compliance Matrix */}
          <div className="bg-[#161A22] border border-[#2D3748] rounded-xl p-5 shadow-sm">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-[#10B981]" />
              Dispatch Compliance Matrix
            </h4>
            <ul className="space-y-3.5 text-xs text-[#dbc2b0]">
              <li className="flex items-center justify-between border-b border-[#2D3748]/50 pb-2">
                <span className="font-medium">1. CDL Credentials Approved</span>
                {selectedDriver ? (
                  <span className="text-[#34D399] font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle className="h-3.5 w-3.5" /> Approved
                  </span>
                ) : (
                  <span className="text-[#dbc2b0]/50 flex items-center gap-1 text-[11px]">
                    <HelpCircle className="h-3.5 w-3.5" /> Awaiting Select
                  </span>
                )}
              </li>

              <li className="flex items-center justify-between border-b border-[#2D3748]/50 pb-2">
                <span className="font-medium">2. Vehicle Load Capacity Match</span>
                {selectedVehicle ? (
                  weightOverlimit ? (
                    <span className="text-red-400 font-bold flex items-center gap-1 text-[11px]">
                      <X className="h-3.5 w-3.5" /> OVERLIMIT
                    </span>
                  ) : (
                    <span className="text-[#34D399] font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle className="h-3.5 w-3.5" /> Capacity OK
                    </span>
                  )
                ) : (
                  <span className="text-[#dbc2b0]/50 flex items-center gap-1 text-[11px]">
                    <HelpCircle className="h-3.5 w-3.5" /> Awaiting Select
                  </span>
                )}
              </li>

              <li className="flex items-center justify-between pb-1">
                <span className="font-medium">3. Asset Deployment Check</span>
                {selectedVehicle ? (
                  <span className="text-[#34D399] font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle className="h-3.5 w-3.5" /> Deployable
                  </span>
                ) : (
                  <span className="text-[#dbc2b0]/50 flex items-center gap-1 text-[11px]">
                    <HelpCircle className="h-3.5 w-3.5" /> Awaiting Select
                  </span>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Live Routes Board & Progress Monitor */}
        <div className="flex-grow flex flex-col gap-4">
          
          {/* Status Tabs */}
          <div className="flex border-b border-[#2D3748] gap-1 shrink-0 bg-[#161A22] p-1 rounded-lg border">
            {(['ALL', TripStatus.DISPATCHED, TripStatus.DRAFT, TripStatus.COMPLETED, TripStatus.CANCELLED] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-xs font-bold rounded transition-all uppercase tracking-wider text-center ${
                  activeTab === tab
                    ? 'bg-[#d97707] text-black font-extrabold shadow-sm'
                    : 'text-[#dbc2b0] hover:text-white hover:bg-[#1E293B]/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Completion Form Overlay */}
          {completingTripId && (
            <div className="bg-[#1E293B] border-2 border-[#ffb77d]/60 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-[#2D3748] pb-2">
                <h4 className="font-bold text-white text-sm">Log Transit Completion Details</h4>
                <button onClick={() => setCompletingTripId(null)} className="text-red-400 hover:text-red-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Final Odometer Reading (mi)</label>
                  <input
                    type="number"
                    className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                    value={finalOdo}
                    onChange={(e) => setFinalOdo(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#dbc2b0] uppercase tracking-wider block">Fuel Consumed on Trip (Liters)</label>
                  <input
                    type="number"
                    className="w-full bg-[#0D0F14] border border-[#2D3748] rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ffb77d]"
                    value={fuelConsumed}
                    onChange={(e) => setFuelConsumed(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setCompletingTripId(null)}
                  className="bg-transparent border border-[#2D3748] text-[#dbc2b0] hover:bg-[#1E293B] px-4 py-1.5 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCompletion}
                  className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-1.5 rounded-lg text-xs font-bold"
                >
                  Confirm Log & Complete Route
                </button>
              </div>
            </div>
          )}

          {/* List of Trip Cards */}
          <div className="space-y-4">
            {filteredTrips.map((trip) => {
              const vehicle = vehicles.find((v) => v.registrationNumber === trip.vehicleReg);
              const driver = drivers.find((d) => d.id === trip.driverId);

              return (
                <div
                  key={trip.id}
                  className={`bg-[#161A22] border rounded-xl p-5 hover:border-[#4A5568] transition-all flex flex-col md:flex-row justify-between gap-4 shadow-sm relative overflow-hidden ${
                    trip.status === TripStatus.DISPATCHED ? 'border-l-4 border-l-[#3B82F6] border-[#2D3748]' :
                    trip.status === TripStatus.COMPLETED ? 'border-l-4 border-l-[#10B981] border-[#2D3748]' :
                    trip.status === TripStatus.CANCELLED ? 'opacity-65 border-[#2D3748]' :
                    'border-[#2D3748]'
                  }`}
                >
                  {/* Left segment of card: Core Routing */}
                  <div className="flex-grow space-y-3.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-white text-sm bg-[#0D0F14] px-2.5 py-0.5 rounded border border-[#2D3748]">
                        {trip.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                        trip.status === TripStatus.DISPATCHED ? 'bg-[#3B82F6]/10 text-[#60A5FA] border-[#3B82F6]/30' :
                        trip.status === TripStatus.COMPLETED ? 'bg-[#10B981]/10 text-[#34D399] border-[#10B981]/30' :
                        trip.status === TripStatus.CANCELLED ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                        'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30'
                      }`}>
                        {trip.status}
                      </span>
                      {trip.status === TripStatus.DISPATCHED && (
                        <span className="text-[10px] text-blue-400 font-bold animate-pulse">
                          ● IN TRANSIT
                        </span>
                      )}
                    </div>

                    {/* Route Details */}
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-white font-bold text-sm">{trip.source}</div>
                        <div className="text-[10px] text-[#dbc2b0]/70 uppercase tracking-widest font-semibold">Origin</div>
                      </div>
                      <div className="flex-grow flex items-center justify-center max-w-[120px]">
                        <div className="w-full relative h-0.5 bg-[#2D3748]">
                          <div className={`absolute top-1/2 -translate-y-1/2 rounded-full h-2 w-2 ${
                            trip.status === TripStatus.DISPATCHED ? 'bg-[#3B82F6] left-1/3 animate-ping' :
                            trip.status === TripStatus.COMPLETED ? 'bg-[#10B981] right-0' :
                            'bg-[#dbc2b0]/50 left-0'
                          }`} />
                          {trip.status === TripStatus.DISPATCHED && (
                            <div className="absolute top-1/2 -translate-y-1/2 left-1/3 rounded-full h-2 w-2 bg-[#3B82F6]" />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{trip.destination}</div>
                        <div className="text-[10px] text-[#dbc2b0]/70 uppercase tracking-widest font-semibold">Destination</div>
                      </div>
                    </div>

                    {/* Driver / Vehicle Subgrid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-[#2D3748]/50 text-xs text-[#dbc2b0]">
                      <div>
                        <div className="font-semibold text-[#dbc2b0]/70">Assigned Asset</div>
                        <div className="text-white font-bold mt-0.5">{trip.vehicleReg}</div>
                        <div className="text-[10px] text-[#dbc2b0]/50">{vehicle?.name || 'Class 8 Tractor'}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#dbc2b0]/70">Operator</div>
                        <div className="text-white font-bold mt-0.5">{driver?.name || 'Assigned Driver'}</div>
                        <div className="text-[10px] text-[#dbc2b0]/50">Rating: {driver?.safetyScore || 90}/100</div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#dbc2b0]/70">Cargo Payload</div>
                        <div className="text-white font-bold mt-0.5">{trip.cargoWeight.toLocaleString()} kg</div>
                        <div className="text-[10px] text-[#dbc2b0]/50">Weight Verified</div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#dbc2b0]/70">Planned Distance</div>
                        <div className="text-white font-bold mt-0.5">{trip.plannedDistance.toLocaleString()} mi</div>
                        <div className="text-[10px] text-[#dbc2b0]/50">ETA: {trip.eta}</div>
                      </div>
                    </div>
                  </div>

                  {/* Right segment of card: Action Trigger Controls */}
                  <div className="flex md:flex-col justify-end gap-2.5 items-end self-center md:self-auto min-w-[120px]">
                    {isDispatcherOrManager && trip.status === TripStatus.DISPATCHED && (
                      <>
                        <button
                          onClick={() => handleStartCompletion(trip)}
                          className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs py-1.5 px-3.5 rounded transition-all cursor-pointer text-center"
                        >
                          Complete Transit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Cancel this dispatch route?')) {
                              onUpdateTripStatus(trip.id, TripStatus.CANCELLED);
                            }
                          }}
                          className="w-full bg-transparent hover:bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-xs py-1.5 px-3.5 rounded transition-all cursor-pointer text-center"
                        >
                          Cancel Transit
                        </button>
                      </>
                    )}

                    {isDispatcherOrManager && trip.status === TripStatus.DRAFT && (
                      <>
                        <button
                          onClick={() => {
                            // Automatically dispatch Draft
                            onUpdateTripStatus(trip.id, TripStatus.DISPATCHED);
                          }}
                          className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-xs py-1.5 px-3.5 rounded transition-all cursor-pointer text-center"
                        >
                          Dispatch Route
                        </button>
                        <button
                          onClick={() => {
                            onUpdateTripStatus(trip.id, TripStatus.CANCELLED);
                          }}
                          className="w-full bg-transparent hover:bg-neutral-800 border border-neutral-700 text-neutral-400 font-semibold text-xs py-1.5 px-3.5 rounded transition-all cursor-pointer text-center"
                        >
                          Cancel Route
                        </button>
                      </>
                    )}

                    {trip.status === TripStatus.COMPLETED && (
                      <div className="text-right text-[11px] text-[#dbc2b0]/80 font-medium space-y-1">
                        <p className="text-green-400 font-bold flex items-center gap-1 justify-end">
                          <CheckCircle className="h-3 w-3" /> COMPLETED OK
                        </p>
                        <p>Odo Ref: <strong className="text-white">{trip.finalOdometer?.toLocaleString()} mi</strong></p>
                        <p>Fuel Log: <strong className="text-white">{trip.fuelConsumed?.toLocaleString()} L</strong></p>
                      </div>
                    )}

                    {trip.status === TripStatus.CANCELLED && (
                      <div className="text-right text-[11px] text-red-400/80 font-semibold space-y-1">
                        <p>ROUTE CANCELLED</p>
                        <p className="text-[10px] text-[#dbc2b0]/50 font-medium">Assets Reclaimed</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredTrips.length === 0 && (
              <div className="bg-[#161A22] border border-[#2D3748] rounded-xl py-12 text-center text-xs text-[#dbc2b0]/50 font-medium">
                No routes found under category "{activeTab}".
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
=======
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
>>>>>>> d070d925c5a1a212368529b165f84cc9984455d7
