import React, { useState } from 'react';
import { 
  TruckIcon, 
  WrenchScrewdriverIcon, 
  DocumentTextIcon, 
  CameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const DriverVehicle = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);

  const [vehicleData, setVehicleData] = useState({
    make: 'Toyota',
    model: 'Prius',
    year: '2020',
    color: 'Silver',
    plateNumber: 'CAR-1234',
    capacity: '4',
    type: 'sedan',
    fuelType: 'hybrid',
    mileage: '45,230'
  });

  const [documents, setDocuments] = useState([
    {
      id: 1,
      type: 'Vehicle Registration',
      status: 'verified',
      expiryDate: '2025-06-15',
      uploadDate: '2024-01-15'
    },
    {
      id: 2,
      type: 'Insurance Certificate',
      status: 'verified',
      expiryDate: '2024-12-31',
      uploadDate: '2024-01-10'
    },
    {
      id: 3,
      type: 'Roadworthiness Certificate',
      status: 'pending',
      expiryDate: '2024-08-20',
      uploadDate: '2024-07-01'
    }
  ]);

  const [maintenance, setMaintenance] = useState([
    {
      id: 1,
      type: 'Oil Change',
      date: '2024-06-15',
      mileage: '45,000',
      cost: 'LKR 8,500',
      garage: 'Quick Service Center'
    },
    {
      id: 2,
      type: 'Tire Replacement',
      date: '2024-05-10',
      mileage: '44,500',
      cost: 'LKR 65,000',
      garage: 'Tire World'
    },
    {
      id: 3,
      type: 'Full Service',
      date: '2024-03-20',
      mileage: '43,000',
      cost: 'LKR 25,000',
      garage: 'Toyota Service Center'
    }
  ]);

  const handleSave = () => {
    setIsEditing(false);
    // Save vehicle data logic here
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'expired': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const tabs = [
    { id: 'details', name: 'Vehicle Details', icon: TruckIcon },
    { id: 'documents', name: 'Documents', icon: DocumentTextIcon },
    { id: 'maintenance', name: 'Maintenance', icon: WrenchScrewdriverIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Vehicle Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your vehicle information, documents, and maintenance records
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center">
                <CameraIcon className="h-5 w-5 mr-2" />
                Add Photos
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-secondary-700">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Vehicle Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Vehicle Information
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(vehicleData).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setVehicleData(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-secondary-700 px-3 py-2 rounded-lg">
                        {value}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-secondary-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Vehicle Photos */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Vehicle Photos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-100 dark:bg-secondary-700 rounded-lg flex items-center justify-center">
                    <CameraIcon className="h-12 w-12 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-secondary-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Vehicle Documents
                  </h2>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Upload Document
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-secondary-600 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{doc.type}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Uploaded: {doc.uploadDate} • Expires: {doc.expiryDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                        <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-secondary-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Maintenance History
                  </h2>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Record
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {maintenance.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-secondary-600 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <WrenchScrewdriverIcon className="h-8 w-8 text-gray-400" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{record.type}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {record.garage} • {record.date} • {record.mileage} km
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">{record.cost}</p>
                        <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverVehicle;
