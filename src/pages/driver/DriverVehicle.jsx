import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { userServicesApi } from '../../api/axios';
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
import { useToast } from '../../components/ToastProvider';

const statusMap = {
  1: 'Verified',
  2: 'Pending',
  3: 'Rejected'
};

const DriverVehicle = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDocs, setIsEditingDocs] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [showCompletePopup, setShowCompletePopup] = useState(false);

  // Vehicle and document images
  const [vehiclePics, setVehiclePics] = useState([null, null, null, null]);
  const [vehiclePicPreviews, setVehiclePicPreviews] = useState([null, null, null, null]);
  const [docPics, setDocPics] = useState([null, null]); // [vehicle reg, insurance]
  const [docPicPreviews, setDocPicPreviews] = useState([null, null]);

  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    plateNumber: '',
    capacity: '',
    type: '',
    fuelType: '',
    vehicle_registration_status: 2,
    insurance_certificate_status: 2
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) {
        setUserEmail(user.email);
        fetchVehicleData(user.email);
      }
    });
    return () => unsub();
  }, []);

  const fetchVehicleData = async (emailParam) => {
    setLoading(true);
    try {
      let email = emailParam;
      if (!email) {
        const user = auth.currentUser;
        email = user ? user.email : '';
        console.log('[FETCH] Using auth email:', email);
      }
      if (!email) {
        toast.error('User email not found. Please log in again.');
        setLoading(false);
        return;
      }
      console.log('[FETCH] GET /driver/vehicle?email=' + email);
      const res = await userServicesApi.get(`/driver/vehicle?email=${email}`);
      console.log('[FETCH RESPONSE]', res);
      if (res.status === 200 && res.data) {
        setVehicleData({
          make: res.data.Make || '',
          model: res.data.Model || '',
          year: res.data.Year || '',
          color: res.data.Color || '',
          plateNumber: res.data['Plate Number'] || '',
          capacity: res.data.Capacity || '',
          type: res.data.Type || '',
          fuelType: res.data.Fueltype || '',
          vehicle_registration_status: res.data['Vehicle registration status'] || 2,
          insurance_certificate_status: res.data['Insurance certificate status'] || 2
        });
        setVehiclePicPreviews([
          res.data.Veh_pic_1 || null,
          res.data.Veh_pic_2 || null,
          res.data.Veh_pic_3 || null,
          res.data.Veh_pic_4 || null
        ]);
        setDocPicPreviews([
          res.data['Vehicle_registration(pic)'] || null,
          res.data['Insurance Pic'] || null
        ]);
        // Check for missing required fields
        const requiredFields = [
          res.data.Make, res.data.Model, res.data.Year, res.data.Color, res.data['Plate Number'],
          res.data.Capacity, res.data.Type, res.data.Fueltype,
          res.data.Veh_pic_1, res.data['Vehicle_registration(pic)'], res.data['Insurance Pic']
        ];
        if (requiredFields.some(f => !f)) {
          setShowCompletePopup(true);
          toast.error('Please complete all vehicle and document details.', { duration: 4000 });
        }
      }
    } catch (err) {
      console.error('[FETCH ERROR]', err);
      toast.error('Failed to fetch vehicle details.', { duration: 4000 });
    }
    setLoading(false);
  };

  const handleVehiclePicChange = (idx, file) => {
    const newPics = [...vehiclePics];
    newPics[idx] = file;
    setVehiclePics(newPics);
    const newPreviews = [...vehiclePicPreviews];
    newPreviews[idx] = file ? URL.createObjectURL(file) : null;
    setVehiclePicPreviews(newPreviews);
  };
  const handleDocPicChange = (idx, file) => {
    const newPics = [...docPics];
    newPics[idx] = file;
    setDocPics(newPics);
    const newPreviews = [...docPicPreviews];
    newPreviews[idx] = file ? URL.createObjectURL(file) : null;
    setDocPicPreviews(newPreviews);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let email = userEmail;
      if (!email) {
        const user = auth.currentUser;
        email = user ? user.email : '';
      }
      if (!email) {
        toast.error('User email not found. Please log in again.');
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('email', email);
      formData.append('Fueltype', vehicleData.fuelType);
      formData.append('Capacity', vehicleData.capacity);
      formData.append('Make', vehicleData.make);
      formData.append('Model', vehicleData.model);
      formData.append('Year', vehicleData.year);
      formData.append('Color', vehicleData.color);
      formData.append('Plate Number', vehicleData.plateNumber);
      formData.append('Type', vehicleData.type);
      // Images
      vehiclePics.forEach((file, idx) => {
        if (file) formData.append(`Veh_pic_${idx+1}`, file);
      });
      docPics.forEach((file, idx) => {
        if (file) formData.append(idx === 0 ? 'Vehicle_registration(pic)' : 'Insurance Pic', file);
      });
      // Statuses
      formData.append('Vehicle registration status', vehicleData.vehicle_registration_status);
      formData.append('Insurance certificate status', vehicleData.insurance_certificate_status);
      console.log('[UPDATE] PUT /driver/vehicle', formData);
      const res = await userServicesApi.put('/driver/vehicle', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      console.log('[UPDATE RESPONSE]', res);
      setIsEditing(false);
      setIsEditingDocs(false);
      fetchVehicleData(email);
      toast.success('Vehicle details updated successfully!', { duration: 3000 });
    } catch (err) {
      console.error('[UPDATE ERROR]', err);
      toast.error('Failed to update vehicle details.', { duration: 4000 });
    }
    setLoading(false);
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
    { id: 'documents', name: 'Documents', icon: DocumentTextIcon }
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
                {/* Fuel Type Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fuel Type</label>
                  {isEditing ? (
                    <select
                      value={vehicleData.fuelType}
                      onChange={e => setVehicleData(prev => ({ ...prev, fuelType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                    >
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-secondary-700 px-3 py-2 rounded-lg">
                      {vehicleData.fuelType.charAt(0).toUpperCase() + vehicleData.fuelType.slice(1)}
                    </p>
                  )}
                </div>
                {/* Capacity with unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Capacity ({vehicleData.fuelType === 'electric' ? 'kW' : 'CC'})</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={vehicleData.capacity}
                      onChange={e => setVehicleData(prev => ({ ...prev, capacity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-secondary-700 px-3 py-2 rounded-lg">
                      {vehicleData.capacity} {vehicleData.fuelType === 'electric' ? 'kW' : 'CC'}
                    </p>
                  )}
                </div>
                {/* Other fields */}
                {['make','model','year','color','plateNumber','type'].map(key => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={vehicleData[key]}
                        onChange={e => setVehicleData(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-secondary-700 px-3 py-2 rounded-lg">
                        {vehicleData[key]}
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
                {[0,1,2,3].map((i) => (
                  <div key={i} className="aspect-square bg-gray-100 dark:bg-secondary-700 rounded-lg flex flex-col items-center justify-center relative">
                    {vehiclePicPreviews[i] ? (
                      <img src={vehiclePicPreviews[i]} alt={`Vehicle Pic ${i+1}`} className="object-cover w-full h-full rounded-lg" />
                    ) : (
                      <CameraIcon className="h-12 w-12 text-gray-400" />
                    )}
                    {isEditing && (
                      <label className="absolute bottom-2 left-2 w-4/5">
                        <span className="block w-full px-3 py-2 bg-blue-600 text-white text-center rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-sm">Upload</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleVehiclePicChange(i, e.target.files[0])} />
                      </label>
                    )}
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
              <div className="p-6 border-b border-gray-200 dark:border-secondary-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Vehicle Documents
                </h2>
                <div className="flex space-x-3">
                  {isEditingDocs ? (
                    <>
                      <button
                        onClick={() => setIsEditingDocs(false)}
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
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditingDocs(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit Documents
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Registration Pic */}
                <div className="border border-gray-200 dark:border-secondary-600 rounded-lg p-4 flex flex-col items-center">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Vehicle Registration</h3>
                  {docPicPreviews[0] ? (
                    <img src={docPicPreviews[0]} alt="Vehicle Registration" className="object-cover w-full h-40 rounded-lg mb-2" />
                  ) : (
                    <CameraIcon className="h-12 w-12 text-gray-400 mb-2" />
                  )}
                  {isEditingDocs && (
                    <label className="w-full">
                      <span className="block w-full px-3 py-2 bg-blue-600 text-white text-center rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-sm">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleDocPicChange(0, e.target.files[0])} />
                    </label>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(vehicleData.vehicle_registration_status)}`}>
                    {statusMap[vehicleData.vehicle_registration_status]}
                  </span>
                </div>
                {/* Insurance Pic */}
                <div className="border border-gray-200 dark:border-secondary-600 rounded-lg p-4 flex flex-col items-center">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Insurance Certificate</h3>
                  {docPicPreviews[1] ? (
                    <img src={docPicPreviews[1]} alt="Insurance Certificate" className="object-cover w-full h-40 rounded-lg mb-2" />
                  ) : (
                    <CameraIcon className="h-12 w-12 text-gray-400 mb-2" />
                  )}
                  {isEditingDocs && (
                    <label className="w-full">
                      <span className="block w-full px-3 py-2 bg-blue-600 text-white text-center rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-sm">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleDocPicChange(1, e.target.files[0])} />
                    </label>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(vehicleData.insurance_certificate_status)}`}>
                    {statusMap[vehicleData.insurance_certificate_status]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popup for incomplete details */}
        {showCompletePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
              <h2 className="text-2xl font-semibold text-red-600 mb-4">Complete Your Vehicle Details</h2>
              <p className="text-gray-700 mb-6">Some required vehicle or document details are missing. Please complete all fields and upload all required images to proceed.</p>
              <button
                className="px-6 py-2 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition"
                onClick={() => setShowCompletePopup(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverVehicle;
