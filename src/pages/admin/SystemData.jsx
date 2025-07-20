import React, { useState, useEffect } from 'react';
import {
  TruckIcon,
  UserIcon,
  MapIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  Cog6ToothIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import adminServicesApi from '../../api/axios';
import VehiclePopup from '../../components/VehiclePopup';
import DriverPopup from '../../components/DriverPopup';
import GuidePopup from '../../components/GuidePopup';

const SystemData = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVehicle, setEditingVehicle] = useState(null);
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
  const [activeTab, setActiveTab] = useState('vehicles'); // Default to vehicles tab

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
      // Prepare data according to backend API specification
      const updatePayload = {
        typeName: updatedData.typeName,
        description: updatedData.description,
        fuelType: updatedData.fuelType,
        capacity: parseInt(updatedData.capacity),
        pricePerKm: parseFloat(updatedData.pricePerKm),
        isAvailable: updatedData.isAvailable || updatedData.available
      };

      console.log('Sending update payload:', updatePayload);

      const response = await adminServicesApi.put(`http://localhost:8091/api/v1/admin/vehicle-types/${id}`, updatePayload);

      if (response.status === 200 && response.data && response.data.data) {
        setVehicles((prev) => prev.map((v) => (v.id === id ? response.data.data : v)));
        setEditingVehicle(null); // Close edit modal
        setError(null); // Clear any previous errors
      } else {
        throw new Error('Failed to update vehicle');
      }
    } catch (err) {
      console.error('Error updating vehicle:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || err.message);
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

  const openEditModal = (vehicle) => {
    setEditingVehicle({
      id: vehicle.id,
      typeName: vehicle.typeName,
      capacity: vehicle.capacity.toString(),
      description: vehicle.description,
      fuelType: vehicle.fuelType,
      isAvailable: vehicle.isAvailable,
      pricePerKm: vehicle.pricePerKm.toString()
    });
  };

  const closeEditModal = () => {
    setEditingVehicle(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!editingVehicle.typeName || !editingVehicle.description || !editingVehicle.fuelType || 
        !editingVehicle.capacity || !editingVehicle.pricePerKm) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate numeric fields
    if (isNaN(editingVehicle.capacity) || parseInt(editingVehicle.capacity) <= 0) {
      setError('Capacity must be a positive number');
      return;
    }

    if (isNaN(editingVehicle.pricePerKm) || parseFloat(editingVehicle.pricePerKm) < 0) {
      setError('Price per KM must be a non-negative number');
      return;
    }

    updateVehicle(editingVehicle.id, editingVehicle);
  };

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.typeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.fuelType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get statistics
  const vehicleStats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.isAvailable).length,
    unavailable: vehicles.filter(v => !v.isAvailable).length,
    avgPrice: vehicles.length > 0 ? (vehicles.reduce((acc, v) => acc + (parseFloat(v.pricePerKm) || 0), 0) / vehicles.length).toFixed(2) : '0.00'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-secondary-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <XCircleIcon className="h-8 w-8 text-danger-600 dark:text-danger-400" />
              <div>
                <h3 className="text-lg font-medium text-danger-800 dark:text-danger-300">Error</h3>
                <p className="text-danger-700 dark:text-danger-400">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Cog6ToothIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              System Data Management
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and configure system resources including vehicles, drivers, and guides
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 mb-6">
          <div className="border-b border-gray-200 dark:border-secondary-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('vehicles')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'vehicles'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <TruckIcon className="h-5 w-5" />
                  <span>Vehicles</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('drivers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'drivers'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5" />
                  <span>Drivers</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('guides')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'guides'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MapIcon className="h-5 w-5" />
                  <span>Guides</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TruckIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {vehicleStats.total}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Vehicles
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-8 w-8 text-success-600 dark:text-success-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                      {vehicleStats.available}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Available
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <XCircleIcon className="h-8 w-8 text-danger-600 dark:text-danger-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-danger-600 dark:text-danger-400">
                      {vehicleStats.unavailable}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Unavailable
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-8 w-8 text-info-600 dark:text-info-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-info-600 dark:text-info-400">
                      LKR {vehicleStats.avgPrice}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Avg Price/KM
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search vehicles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                    />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredVehicles.length} of {vehicles.length} vehicles
                  </div>
                </div>
                <VehiclePopup
                  newVehicle={newVehicle}
                  setNewVehicle={setNewVehicle}
                  addVehicle={addVehicle}
                />
              </div>
            </div>

            {/* Vehicles Table */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-secondary-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Vehicle Inventory
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-700">
                  <thead className="bg-gray-50 dark:bg-secondary-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Vehicle Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fuel Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price/KM
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-secondary-800 divide-y divide-gray-200 dark:divide-secondary-700">
                    {filteredVehicles.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            No vehicles found
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {vehicles.length === 0 
                              ? "Get started by adding a new vehicle."
                              : "Try adjusting your search criteria."
                            }
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredVehicles.map((vehicle) => (
                        <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-secondary-900 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {vehicle.typeName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {vehicle.description}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {vehicle.capacity} people
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300">
                              {vehicle.fuelType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              LKR {vehicle.pricePerKm}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {vehicle.isAvailable ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300">
                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300">
                                <XCircleIcon className="h-3 w-3 mr-1" />
                                Unavailable
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => openEditModal(vehicle)}
                                className="px-3 py-1 bg-primary-100 text-primary-800 hover:bg-primary-200 dark:bg-primary-900/20 dark:text-primary-300 text-xs rounded-lg transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => updateVehicle(vehicle.id, { 
                                  typeName: vehicle.typeName,
                                  description: vehicle.description,
                                  fuelType: vehicle.fuelType,
                                  capacity: vehicle.capacity,
                                  pricePerKm: vehicle.pricePerKm,
                                  isAvailable: !vehicle.isAvailable
                                })}
                                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                                  vehicle.isAvailable
                                    ? 'bg-warning-100 text-warning-800 hover:bg-warning-200 dark:bg-warning-900/20 dark:text-warning-300'
                                    : 'bg-success-100 text-success-800 hover:bg-success-200 dark:bg-success-900/20 dark:text-success-300'
                                }`}
                              >
                                {vehicle.isAvailable ? 'Disable' : 'Enable'}
                              </button>
                              <button
                                onClick={() => deleteVehicle(vehicle.id)}
                                className="px-3 py-1 bg-danger-100 text-danger-800 hover:bg-danger-200 dark:bg-danger-900/20 dark:text-danger-300 text-xs rounded-lg transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === 'drivers' && (
          <div className="space-y-6">
            {/* Driver Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Drivers</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-8 w-8 text-success-600 dark:text-success-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-success-600 dark:text-success-400">0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <XCircleIcon className="h-8 w-8 text-warning-600 dark:text-warning-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-8 w-8 text-info-600 dark:text-info-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-info-600 dark:text-info-400">4.8</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Controls */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Driver Management
                </h3>
                <DriverPopup
                  newDriver={newDriver}
                  setNewDriver={setNewDriver}
                  addDriver={addDriver}
                />
              </div>
            </div>

            {/* Placeholder for drivers table */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-12 text-center">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Driver management coming soon
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Driver registration and management features will be available here.
              </p>
            </div>
          </div>
        )}

        {/* Guides Tab */}
        {activeTab === 'guides' && (
          <div className="space-y-6">
            {/* Guide Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MapIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Guides</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-8 w-8 text-success-600 dark:text-success-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-success-600 dark:text-success-400">0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <XCircleIcon className="h-8 w-8 text-warning-600 dark:text-warning-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-8 w-8 text-info-600 dark:text-info-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-info-600 dark:text-info-400">4.9</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guide Controls */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Guide Management
                </h3>
                <GuidePopup
                  newGuide={newGuide}
                  setNewGuide={setNewGuide}
                  addGuide={addGuide}
                />
              </div>
            </div>

            {/* Placeholder for guides table */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-12 text-center">
              <MapIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Guide management coming soon
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Guide registration and management features will be available here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Vehicle Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-secondary-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Edit Vehicle Type
                </h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vehicle Type Name
                </label>
                <input
                  type="text"
                  value={editingVehicle.typeName}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, typeName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Capacity (people)
                </label>
                <input
                  type="number"
                  value={editingVehicle.capacity}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, capacity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editingVehicle.description}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                  rows="3"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fuel Type
                </label>
                <select
                  value={editingVehicle.fuelType}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, fuelType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                  required
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price per KM (LKR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingVehicle.pricePerKm}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, pricePerKm: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                  min="0"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editAvailable"
                  checked={editingVehicle.isAvailable}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, isAvailable: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="editAvailable" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Available for booking
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Update Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemData;
