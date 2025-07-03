import React, { useState } from 'react';
import { 
  User, 
  Car, 
  Camera, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Star, 
  Shield, 
  Clock,
  Edit3,
  Save,
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Settings
} from 'lucide-react';

const DriverProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // personal, vehicle, documents, preferences

  const [driverData, setDriverData] = useState({
    // Personal Information
    firstName: 'Rajesh',
    lastName: 'Fernando',
    email: 'rajesh.fernando@example.com',
    phone: '+94 77 123 4567',
    dateOfBirth: '1985-03-15',
    address: '123 Main Street, Colombo 03',
    emergencyContact: '+94 77 987 6543',
    emergencyContactName: 'Maria Fernando',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    
    // Driver Stats
    rating: 4.8,
    totalTrips: 1247,
    totalReviews: 892,
    memberSince: '2022-01-15',
    status: 'active',
    
    // Vehicle Information
    vehicles: [
      {
        id: 1,
        make: 'Toyota',
        model: 'Prius',
        year: 2020,
        color: 'White',
        plateNumber: 'CAR-1234',
        capacity: 4,
        type: 'sedan',
        isActive: true,
        insurance: {
          company: 'Sri Lanka Insurance',
          policyNumber: 'SLI-123456',
          expiryDate: '2025-06-15'
        },
        images: [
          'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1549399736-2bb8e4bbeaec?w=400&h=300&fit=crop'
        ]
      }
    ],
    
    // Documents
    documents: {
      drivingLicense: {
        number: 'DL-789012',
        expiryDate: '2026-03-15',
        status: 'verified',
        uploadedAt: '2024-01-10'
      },
      vehicleRegistration: {
        number: 'VR-345678',
        expiryDate: '2025-12-31',
        status: 'verified',
        uploadedAt: '2024-01-10'
      },
      insurance: {
        policyNumber: 'SLI-123456',
        expiryDate: '2025-06-15',
        status: 'verified',
        uploadedAt: '2024-01-10'
      },
      backgroundCheck: {
        status: 'verified',
        completedAt: '2024-01-05'
      }
    },
    
    // Preferences
    preferences: {
      workingHours: {
        start: '06:00',
        end: '22:00'
      },
      preferredAreas: ['Colombo', 'Kandy', 'Galle'],
      maxDistance: 200,
      acceptPartialTrips: true,
      autoAcceptTrips: false,
      notifications: {
        tripRequests: true,
        earnings: true,
        promotions: false,
        systemUpdates: true
      }
    }
  });

  const handleSave = () => {
    // Save driver data
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset changes
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { key: 'personal', label: 'Personal Info', icon: User },
    { key: 'vehicle', label: 'Vehicle', icon: Car },
    { key: 'documents', label: 'Documents', icon: FileText },
    { key: 'preferences', label: 'Preferences', icon: Settings }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Profile</h1>
            <p className="text-gray-600 mt-1">Manage your profile information and preferences</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={driverData.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {driverData.firstName} {driverData.lastName}
            </h2>
            <p className="text-gray-600">{driverData.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="font-medium">{driverData.rating}</span>
                <span className="text-gray-500 text-sm ml-1">({driverData.totalReviews} reviews)</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Car className="h-4 w-4 mr-1" />
                {driverData.totalTrips} trips completed
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Member since {new Date(driverData.memberSince).getFullYear()}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              driverData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {driverData.status === 'active' ? 'Active Driver' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={driverData.firstName}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={(e) => setDriverData({...driverData, firstName: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={driverData.lastName}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={(e) => setDriverData({...driverData, lastName: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={driverData.email}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={(e) => setDriverData({...driverData, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={driverData.phone}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={(e) => setDriverData({...driverData, phone: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={driverData.dateOfBirth}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={(e) => setDriverData({...driverData, dateOfBirth: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={driverData.address}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                  onChange={(e) => setDriverData({...driverData, address: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={driverData.emergencyContactName}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={(e) => setDriverData({...driverData, emergencyContactName: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={driverData.emergencyContact}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={(e) => setDriverData({...driverData, emergencyContact: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Information Tab */}
          {activeTab === 'vehicle' && (
            <div className="space-y-6">
              {driverData.vehicles.map((vehicle, index) => (
                <div key={vehicle.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      vehicle.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {vehicle.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Make
                      </label>
                      <input
                        type="text"
                        value={vehicle.make}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model
                      </label>
                      <input
                        type="text"
                        value={vehicle.model}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year
                      </label>
                      <input
                        type="number"
                        value={vehicle.year}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <input
                        type="text"
                        value={vehicle.color}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Plate Number
                      </label>
                      <input
                        type="text"
                        value={vehicle.plateNumber}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passenger Capacity
                      </label>
                      <input
                        type="number"
                        value={vehicle.capacity}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Images
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {vehicle.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img
                            src={image}
                            alt={`Vehicle ${imgIndex + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          {isEditing && (
                            <button className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700">
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <button className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400">
                          <Upload className="h-6 w-6 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Insurance Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Company</label>
                        <p className="font-medium">{vehicle.insurance.company}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Policy Number</label>
                        <p className="font-medium">{vehicle.insurance.policyNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Expiry Date</label>
                        <p className="font-medium">{vehicle.insurance.expiryDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isEditing && (
                <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700">
                  <Car className="h-6 w-6 mx-auto mb-2" />
                  Add Another Vehicle
                </button>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(driverData.documents).map(([docType, docData]) => (
                  <div key={docType} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {docType.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(docData.status)}`}>
                        {docData.status === 'verified' && <CheckCircle className="h-3 w-3 inline mr-1" />}
                        {docData.status === 'pending' && <Clock className="h-3 w-3 inline mr-1" />}
                        {docData.status === 'expired' && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                        {docData.status}
                      </span>
                    </div>
                    
                    {docData.number && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-600">Number: </span>
                        <span className="font-medium">{docData.number}</span>
                      </div>
                    )}
                    
                    {docData.expiryDate && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-600">Expires: </span>
                        <span className="font-medium">{docData.expiryDate}</span>
                      </div>
                    )}
                    
                    {docData.uploadedAt && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-600">Uploaded: </span>
                        <span className="font-medium">{docData.uploadedAt}</span>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                        View Document
                      </button>
                      {isEditing && (
                        <button className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
                          <Upload className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-8">
              {/* Working Hours */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={driverData.preferences.workingHours.start}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={driverData.preferences.workingHours.end}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Preferred Areas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {driverData.preferences.preferredAreas.map((area, index) => (
                    <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                      {area}
                      {isEditing && (
                        <button className="ml-2 text-primary-600 hover:text-primary-800">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {isEditing && (
                    <button className="px-3 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-600 hover:border-gray-400">
                      + Add Area
                    </button>
                  )}
                </div>
              </div>

              {/* Trip Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Accept Partial Trips</h4>
                      <p className="text-sm text-gray-600">Allow passengers to book segments of longer trips</p>
                    </div>
                    <button 
                      disabled={!isEditing}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        driverData.preferences.acceptPartialTrips ? 'bg-primary-600' : 'bg-gray-300'
                      } ${!isEditing ? 'opacity-50' : ''}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        driverData.preferences.acceptPartialTrips ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Auto Accept Trips</h4>
                      <p className="text-sm text-gray-600">Automatically accept trip requests that match your preferences</p>
                    </div>
                    <button 
                      disabled={!isEditing}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        driverData.preferences.autoAcceptTrips ? 'bg-primary-600' : 'bg-gray-300'
                      } ${!isEditing ? 'opacity-50' : ''}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        driverData.preferences.autoAcceptTrips ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Trip Distance (km)
                    </label>
                    <input
                      type="number"
                      value={driverData.preferences.maxDistance}
                      disabled={!isEditing}
                      className="w-32 p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                <div className="space-y-4">
                  {Object.entries(driverData.preferences.notifications).map(([notType, enabled]) => (
                    <div key={notType} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">
                          {notType.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                      </div>
                      <button 
                        disabled={!isEditing}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          enabled ? 'bg-primary-600' : 'bg-gray-300'
                        } ${!isEditing ? 'opacity-50' : ''}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
