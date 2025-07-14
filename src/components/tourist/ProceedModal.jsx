import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Car, Bus, Truck } from 'lucide-react';

const ProceedModal = ({ open, message, onConfirm, onCancel, needDriver, needGuide, numPassengers, setNumPassengers, userId, tripId }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      console.log('Fetching vehicles...');
      try {
        const response = await axios.get('http://localhost:8091/api/v1/admin/vehicle-types');
        console.log('Fetched vehicles:', response.data);
        if (response.status === 200 && response.data && response.data.data) {
          setVehicles(response.data.data);
        } else {
          throw new Error('Failed to fetch vehicles');
        }
      } catch (err) {
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    if (needDriver && open) {
      fetchVehicles();
    }
  }, [needDriver, open]);

  const handleProceed = async () => {
    setSubmitting(true);
    let preferredVehicleTypeId = null;
    if (needDriver && selectedVehicle) {
      const vehicleObj = vehicles.find(v => v.type === selectedVehicle);
      preferredVehicleTypeId = vehicleObj ? vehicleObj.id : null;
    }
    const payload = {
      userId: userId || null,
      tripId: tripId || null,
      preferredVehicleTypeId: preferredVehicleTypeId,
      setGuide: needGuide ? 1 : 0,
      setDriver: needDriver ? 1 : 0
    };
    try {
      await axios.post('http://localhost:8095/api/v1/trips/initiate', payload);
      if (onConfirm) onConfirm();
    } catch (err) {
      alert('Failed to initiate trip. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;
  const lines = message.split('\n');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-gray-200">
        <h4 className="text-lg font-bold mb-4 text-gray-900">Confirm Proceed</h4>
        <div className="mb-6 text-gray-700">
          {lines.map((line, idx) => (
            <p key={idx} className={idx === 0 ? '' : 'mt-2'}>{line}</p>
          ))}
          {needDriver && (
            <>
              <div className="mt-4 relative w-full max-w-xs flex items-center">
                <label className="block text-sm font-medium text-gray-800 mb-2">Number of Passengers</label>
                <div className="relative w-full">
                  <select
                    value={numPassengers}
                    onChange={e => {
                      setNumPassengers(Number(e.target.value));
                      setSelectedVehicle(''); // Reset vehicle selection when passenger count changes
                    }}
                    className="px-5 py-2 rounded-full border-2 border-gray-300 bg-white text-gray-800 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-150 appearance-none w-full pr-10"
                    style={{ minWidth: '140px', boxShadow: '0 2px 8px rgba(37,99,235,0.08)', WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                  >
                    {[...Array(15)].map((_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-white text-gray-800 font-medium">
                        {i + 1} Passenger{i === 0 ? '' : 's'}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 inset-y-0 flex items-center text-gray-400">
                    <svg width="20" height="20" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
              </div>
              <div className="mt-4 w-full max-w-xs">
                <label className="block text-sm font-medium text-gray-800 mb-2">Vehicle Type</label>
                <div className="flex flex-col gap-3 w-full">
                  {vehicles.map(vehicle => {
                    const isSelected = selectedVehicle === vehicle.typeName;
                    const isInvalid = isSelected && vehicle.capacity < numPassengers;
                    let icon = null;
                    if (/car/i.test(vehicle.typeName)) {
                      icon = <Car className="mr-3" size={28} strokeWidth={2.2} />;
                    } else if (/van/i.test(vehicle.typeName)) {
                      icon = <Truck className="mr-3" size={28} strokeWidth={2.2} />;
                    } else if (/bus/i.test(vehicle.typeName)) {
                      icon = <Bus className="mr-3" size={28} strokeWidth={2.2} />;
                    } else {
                      icon = <Car className="mr-3" size={28} strokeWidth={2.2} />;
                    }
                    return (
                      <button
                        key={vehicle.id}
                        type="button"
                        className={`w-full px-5 py-4 rounded-lg border-2 font-semibold transition-colors duration-150 focus:outline-none text-left flex items-center
                          ${isSelected ? (isInvalid ? 'border-red-600 bg-white text-red-600' : 'bg-blue-100 text-blue-900 border-blue-600') : 'bg-white text-gray-800 border-gray-300 hover:bg-primary-50'}`}
                        onClick={() => setSelectedVehicle(vehicle.typeName)}
                        disabled={submitting}
                      >
                        {icon}
                        <div className="flex flex-col">
                          <span className="font-bold">{vehicle.typeName}</span>
                        <span className={`text-xs ${isSelected ? (isInvalid ? 'text-red-600' : 'text-blue-800') : 'text-gray-500'}`}>Capacity: {vehicle.capacity} passengers</span>
                        </div>
                      </button>
                    );
                  })}
                  {vehicles.filter(vehicle => vehicle.capacity >= numPassengers).length === 0 && (
                    <span className="text-sm text-red-500">No vehicles available for {numPassengers} passengers.</span>
                  )}
                  {selectedVehicle && (() => {
                    const vehicleObj = vehicles.find(v => v.typeName === selectedVehicle);
                    if (vehicleObj && vehicleObj.capacity < numPassengers) {
                      return <div className="mt-2 text-sm text-red-600 font-semibold">Selected vehicle cannot accommodate {numPassengers} passengers. Please choose another.</div>;
                    }
                    return null;
                  })()}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex gap-4 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold border border-gray-400 transition-colors"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            className="px-6 py-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-semibold border border-blue-200 transition-colors"
            disabled={submitting || (needDriver && !selectedVehicle)}
          >
            {submitting ? 'Processing...' : 'Yes, Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProceedModal;
