import React, { useState, useEffect } from 'react';
import adminServicesApi from '../../api/axios';
import VehiclePopup from '../../components/VehiclePopup';
import DriverPopup from '../../components/DriverPopup';
import GuidePopup from '../../components/GuidePopup';

const SystemData = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newVehicle, setNewVehicle] = useState({
    typeName: '',
    capacity: '',
    description: '',
    fuelType: '',
    isAvailable: true,
    pricePerKm: ''
  });
  const [newDriver, setNewDriver] = useState({ name: '', license: '', contact: '' });
  const [newGuide, setNewGuide] = useState({ name: '', expertise: '', contact: '' });
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await adminServicesApi.get('http://localhost:8091/api/v1/admin/vehicle-types');

        console.log('Fetched vehicles:', response.data);

        if (response.status === 200 && response.data && response.data.data) {
          setVehicles(response.data.data);
        } else {
          throw new Error('Failed to fetch vehicles');
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setVehicles([]); // Ensure page loads with empty data
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const addVehicle = async () => {
    try {
      const response = await adminServicesApi.post('http://localhost:8091/api/v1/admin/vehicle-types', newVehicle);

      if (response.status === 201 && response.data && response.data.data) {
        setVehicles((prev) => [...prev, response.data.data]);
        setNewVehicle({
          typeName: '',
          capacity: '',
          description: '',
          fuelType: '',
          isAvailable: true,
          pricePerKm: ''
        });
      } else {
        throw new Error('Failed to add vehicle');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const updateVehicle = async (id, updatedData) => {
    try {
      const response = await adminServicesApi.put(`http://localhost:8091/api/v1/admin/vehicle-types/${id}`, updatedData);

      if (response.status === 200 && response.data && response.data.data) {
        setVehicles((prev) => prev.map((v) => (v.id === id ? response.data.data : v)));
      } else {
        throw new Error('Failed to update vehicle');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteVehicle = async (id) => {
    try {
      const response = await adminServicesApi.delete(`http://localhost:8091/api/v1/admin/vehicle-types/${id}`);

      if (response.status === 200) {
        setVehicles((prev) => prev.filter((v) => v.id !== id));
      } else {
        throw new Error('Failed to delete vehicle');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const addDriver = async () => {
    // Logic for adding a driver
  };

  const addGuide = async () => {
    // Logic for adding a guide
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-secondary-900">
      <div className="p-6 w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6 text-center">System Data Management</h1>

        <div className="mb-8 text-center">
          <button
            onClick={() => setActiveTab('vehicles')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Manage Vehicle Data
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors ml-4"
          >
            Manage Driver Data
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors ml-4"
          >
            Manage Guide Data
          </button>
        </div>

        {activeTab === 'vehicles' && (
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4 text-center">Vehicle Data</h2>
            <VehiclePopup
              newVehicle={newVehicle}
              setNewVehicle={setNewVehicle}
              addVehicle={addVehicle}
            />
            <table className="w-full bg-white dark:bg-secondary-800 rounded-lg shadow-md border border-neutral-200 dark:border-secondary-700 mt-6">
              <thead className="bg-neutral-50 dark:bg-secondary-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Type Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Fuel Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Is Available</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Price per KM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-secondary-700">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-neutral-50 dark:hover:bg-secondary-900 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{vehicle.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{vehicle.typeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{vehicle.capacity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{vehicle.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{vehicle.fuelType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{vehicle.isAvailable ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{vehicle.pricePerKm}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => updateVehicle(vehicle.id, { ...vehicle, isAvailable: !vehicle.isAvailable })}
                        className="px-3 py-1 bg-warning-600 hover:bg-warning-700 text-white rounded-lg transition-colors mr-2"
                      >
                        Toggle Availability
                      </button>
                      <button
                        onClick={() => deleteVehicle(vehicle.id)}
                        className="px-3 py-1 bg-danger-600 hover:bg-danger-700 text-white rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4 text-center">Driver Data</h2>
            <DriverPopup
              newDriver={newDriver}
              setNewDriver={setNewDriver}
              addDriver={addDriver}
            />
            {/* Driver table code */}
          </div>
        )}

        {activeTab === 'guides' && (
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4 text-center">Guide Data</h2>
            <GuidePopup
              newGuide={newGuide}
              setNewGuide={setNewGuide}
              addGuide={addGuide}
            />
            {/* Guide table code */}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemData;
