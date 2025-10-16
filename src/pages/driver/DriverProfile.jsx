import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import api from '../../api/axios';
import { 
  User, 
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
import { useToast } from '../../components/ToastProvider';

const DriverProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // personal, documents, preferences
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [firebaseData, setFirebaseData] = useState({ email: '', memberSince: '' });
  const [loadingProfile, setLoadingProfile] = useState(true);

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
      sltdaLicense: {
        number: 'SLTDA-2025-001',
        expiryDate: '2027-05-20',
        status: 'verified',
        uploadedAt: '2025-01-15'
      }
    },
    
    // Preferences
    preferences: {
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

  const [profilePictureFile, setProfilePictureFile] = useState(null);

  const { success: showSuccessToast, error: showErrorToast } = useToast();

  // Utility function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      reader.onerror = error => reject(error);
    });
  };

  useEffect(() => {
    let unsubscribe;
    setLoadingProfile(true);
    unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseData({
          email: user.email,
          memberSince: user.metadata.creationTime
        });
        try {
          console.log('Fetching driver profile data for:', user.email);
          const res = await api.get('/driver/profile?email=' + user.email);
          console.log('Driver profile data response:', res);
          console.log('Driver profile data:', res.data);
          if (res.status === 200 && res.data) {
            setDriverData(prevData => ({
              ...prevData,
              firstName: res.data.firstName || '',
              lastName: res.data.lastName || '',
              phone: res.data.phoneNumber || '',
              dateOfBirth: res.data.dateOfBirth || '',
              address: res.data.address || '',
              emergencyContact: res.data.emergencyContactNumber || '',
              emergencyContactName: res.data.emergencyContactName || '',
              profilePicture: res.data.profilePictureUrl ? 
                (res.data.profilePictureUrl.startsWith('data:') ? 
                  res.data.profilePictureUrl : 
                  `data:image/jpeg;base64,${res.data.profilePictureUrl}`) : 
                prevData.profilePicture,
              documents: {
                drivingLicense: {
                  image: res.data.drivingLicenseImage || '',
                  number: res.data.drivingLicenseNumber || '',
                  expiryDate: res.data.drivingLicenseExpiry || '',
                  status: res.data.drivingLicenseStatus === 1 ? 'verified' : 'pending',
                  uploadedAt: res.data.drivingLicenseUploadedAt || ''
                },
                sltdaLicense: {
                  image: res.data.sltdaLicenseImage || '',
                  number: res.data.sltdaLicenseNumber || '',
                  expiryDate: res.data.sltdaLicenseExpiry || '',
                  status: res.data.sltdaLicenseStatus === 1 ? 'verified' : 'pending',
                  uploadedAt: res.data.sltdaLicenseUploadedAt || ''
                }
              },
              preferences: {
                acceptPartialTrips: res.data.acceptPartialTrips === 1,
                autoAcceptTrips: res.data.autoAcceptTrips === 1,
                maxDistance: res.data.maxDistance || 0
              }
            }));
          }
        } catch (err) {
          // handle error
        }
      }
      setLoadingProfile(false);
    });
    return () => unsubscribe && unsubscribe();
    // eslint-disable-next-line
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      let payload = {
        email: firebaseData.email,
        firstName: driverData.firstName,
        lastName: driverData.lastName,
        phone: driverData.phone,
        dateOfBirth: driverData.dateOfBirth,
        address: driverData.address,
        emergencyContact: driverData.emergencyContact,
        emergencyContactName: driverData.emergencyContactName,
        acceptPartialTrips: driverData.preferences.acceptPartialTrips ? 1 : 0,
        autoAcceptTrips: driverData.preferences.autoAcceptTrips ? 1 : 0,
        maxDistance: driverData.preferences.maxDistance
      };

      // If a new profile picture is selected, convert it to base64
      if (profilePictureFile) {
        try {
          const base64Image = await fileToBase64(profilePictureFile);
          payload.profilePicture = base64Image;
          console.log('Profile picture converted to base64, length:', base64Image.length);
        } catch (error) {
          console.error('Error converting image to base64:', error);
          showErrorToast('Failed to process profile picture. Please try again.');
          setLoading(false);
          return;
        }
      } else {
        // Keep existing profile picture if no new one is selected
        payload.profilePicture = driverData.profilePicture;
      }

      console.log('Sending payload:', { ...payload, profilePicture: payload.profilePicture ? `[base64 data - ${payload.profilePicture.length} chars]` : 'none' });

      await api.put('/driver/profile', payload);

      // Update Firebase display name if first name or last name changed
      if (auth.currentUser && (driverData.firstName || driverData.lastName)) {
        try {
          const newDisplayName = `${driverData.firstName} ${driverData.lastName}`.trim();
          console.log('Updating Firebase display name to:', newDisplayName);
          
          await updateProfile(auth.currentUser, {
            displayName: newDisplayName
          });
          
          console.log('Firebase display name updated successfully');
          
          // Force reload of Firebase user to get updated display name
          await auth.currentUser.reload();
          console.log('Firebase user reloaded, new display name:', auth.currentUser.displayName);
          
        } catch (firebaseError) {
          console.error('Error updating Firebase display name:', firebaseError);
          // Don't fail the entire save operation if display name update fails
          showErrorToast('Profile updated but display name sync failed. Please try again.');
        }
      }

      setIsEditing(false);
      setProfilePictureFile(null);
      showSuccessToast('Profile updated successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      showErrorToast('Failed to update profile. Please try again.');
    }
    setLoading(false);
  };

 const handleDrivingLicenseUpload = async (file) => {
  try {
    // Update state to show upload in progress
    setDriverData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        drivingLicense: {
          ...prev.documents.drivingLicense,
          status: 'uploading',
        }
      }
    }));

    console.log('Uploading driving license document');
    
    // Create FormData with the file
    const formData = new FormData();
    formData.append('email', firebaseData.email);
    formData.append('drivingLicense', file);
    
    const response = await api.post('/driver/uploadDrivingLicense', formData, {
      headers: {
        // Don't set Content-Type manually - let axios handle it for FormData
      }
    });
    
    console.log('Upload response:', response.data);
    
    if (response.status === 200) {
      console.log('Driving license uploaded successfully');
      
      // Backend will return the base64 string, so we can use it directly
      setDriverData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          drivingLicense: {
            ...prev.documents.drivingLicense,
            image: response.data.image || response.data.drivingLicenseImage, // Use the base64 from backend
            uploadedAt: new Date().toISOString().slice(0, 10),
            status: 'pending',
          }
        }
      }));
      showSuccessToast('Successfully uploaded Driving License document.');
    }
  } catch (error) {
    console.error('Error uploading driving license:', error);
    console.error('Error details:', error.response?.data);
    
    // Reset status on error
    setDriverData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        drivingLicense: {
          ...prev.documents.drivingLicense,
          status: 'error',
        }
      }
    }));
    
    showErrorToast('Failed to upload Driving License document. Please try again.');
  }
};

const handleSltdaLicenseUpload = async (file) => {
  try {
    // Update state to show upload in progress
    setDriverData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        sltdaLicense: {
          ...prev.documents.sltdaLicense,
          status: 'uploading',
        }
      }
    }));

    console.log('Uploading SLTDA license document');
    
    // Create FormData with the file
    const formData = new FormData();
    formData.append('email', firebaseData.email);
    formData.append('sltdaLicense', file);
    
    const response = await api.post('/driver/uploadSltdaLicense', formData, {
      headers: {
        // Don't set Content-Type manually - let axios handle it for FormData
      }
    });
    
    console.log('Upload response:', response.data);
    
    if (response.status === 200) {
      console.log('SLTDA license uploaded successfully');
      
      // Backend will return the base64 string, so we can use it directly
      setDriverData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          sltdaLicense: {
            ...prev.documents.sltdaLicense,
            image: response.data.image || response.data.sltdaLicenseImage, // Use the base64 from backend
            uploadedAt: new Date().toISOString().slice(0, 10),
            status: 'pending',
          }
        }
      }));
      showSuccessToast('Successfully uploaded SLTDA License document.');
    }
  } catch (error) {
    console.error('Error uploading SLTDA license:', error);
    console.error('Error details:', error.response?.data);
    
    // Reset status on error
    setDriverData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        sltdaLicense: {
          ...prev.documents.sltdaLicense,
          status: 'error',
        }
      }
    }));
    
    showErrorToast('Failed to upload SLTDA License document. Please try again.');
  }
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
    { key: 'documents', label: 'Documents', icon: FileText },
    { key: 'preferences', label: 'Preferences', icon: Settings }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      {/* Loading Screen */}
      {(loading || loadingProfile) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 rounded-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        </div>
      )}

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
                  onClick={() => setIsEditing(false)}
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
              onError={(e) => {
                console.log('Profile picture failed to load, using fallback');
                e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face';
              }}
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors cursor-pointer">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      setProfilePictureFile(file);
                      setDriverData(prev => ({
                        ...prev,
                        profilePicture: URL.createObjectURL(file)
                      }));
                    }
                  }}
                />
              </label>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {driverData.firstName} {driverData.lastName}
            </h2>
            <p className="text-gray-600">{firebaseData.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="font-medium">{driverData.rating}</span>
                <span className="text-gray-500 text-sm ml-1">({driverData.totalReviews} reviews)</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {driverData.totalTrips} trips completed
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Member since {new Date(firebaseData.memberSince).getFullYear()}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={driverData.firstName}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={e => setDriverData({ ...driverData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={driverData.lastName}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={e => setDriverData({ ...driverData, lastName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={firebaseData.email}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={driverData.phone}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={e => setDriverData({ ...driverData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={driverData.dateOfBirth}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={e => setDriverData({ ...driverData, dateOfBirth: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={driverData.address}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                  onChange={e => setDriverData({ ...driverData, address: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={driverData.emergencyContactName}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={e => setDriverData({ ...driverData, emergencyContactName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={driverData.emergencyContact}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={e => setDriverData({ ...driverData, emergencyContact: e.target.value })}
                  />
                </div>
              </div>
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
                        {docType === 'drivingLicense' ? 'Driving License' : docType === 'sltdaLicense' ? 'SLTDA License' : docType}
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
                      <button 
                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        onClick={() => {
                          if (docData.image) {
                            setSelectedDocument({
                              type: docType,
                              title: docType === 'drivingLicense' ? 'Driving License' : 'SLTDA License',
                              documentData: docData.image
                            });
                            setShowDocumentModal(true);
                          }
                        }}
                        disabled={!docData.image}
                      >
                        View Document
                      </button>
                      {isEditing && (
                        <label className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm cursor-pointer flex items-center">
                          <Upload className="h-4 w-4 mr-1" />
                          Upload
                          <input
                            type="file"
                            accept="application/pdf,image/*"
                            style={{ display: 'none' }}
                            onChange={e => {
                              const file = e.target.files[0];
                              if (file) {
                                if (docType === 'drivingLicense') {
                                  handleDrivingLicenseUpload(file);
                                } else if (docType === 'sltdaLicense') {
                                  handleSltdaLicenseUpload(file);
                                }
                              }
                            }}
                          />
                        </label>
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
                      onClick={() => {
                        if (isEditing) {
                          setDriverData(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              acceptPartialTrips: !prev.preferences.acceptPartialTrips
                            }
                          }));
                        }
                      }}
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
                      onClick={() => {
                        if (isEditing) {
                          setDriverData(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              autoAcceptTrips: !prev.preferences.autoAcceptTrips
                            }
                          }));
                        }
                      }}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        driverData.preferences.autoAcceptTrips ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Trip Distance (km)</label>
                    <input
                      type="number"
                      value={driverData.preferences.maxDistance}
                      disabled={!isEditing}
                      className="w-32 p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                      onChange={e => {
                        if (isEditing) {
                          setDriverData(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              maxDistance: e.target.value
                            }
                          }));
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Account Actions */}
              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <button
                  onClick={() => setShowPasswordReset(true)}
                  className="flex-1 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-semibold"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => setShowDeactivate(true)}
                  className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors font-semibold"
                >
                  Deactivate Account
                </button>
                <button
                  onClick={() => setShowDelete(true)}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors font-semibold"
                >
                  Delete Account
                </button>
              </div>
              {/* Modals */}
              {showPasswordReset && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Reset Password</h3>
                    <p className="text-gray-600 mb-6">A password reset email will be sent to <strong>{driverData.email}</strong>. Follow the instructions in the email to reset your password.</p>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowPasswordReset(false)}
                        className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setShowPasswordReset(false)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Send Reset Email
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {showDeactivate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Deactivate Account</h3>
                    <p className="text-gray-600 mb-6">Are you sure you want to deactivate your account? You can reactivate it later by contacting support.</p>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowDeactivate(false)}
                        className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setShowDeactivate(false)}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        Deactivate Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {showDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Account</h3>
                    <p className="text-gray-600 mb-6">This action is <strong>permanent</strong>. Are you sure you want to delete your account?</p>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowDelete(false)}
                        className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setShowDelete(false)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Document Viewer Modal */}
      {showDocumentModal && selectedDocument && (
        
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
            {/* Modal Header */}
            <div className="bg-primary-600 p-4 text-white relative">
              <button
                onClick={() => {
                  setShowDocumentModal(false);
                  setSelectedDocument(null);
                }}
                className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold z-10"
              >
                ×
              </button>
              <h2 className="text-xl font-bold">Document Details</h2>
              <p className="text-white/80 text-sm mt-1">
                {selectedDocument.title}
              </p>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6">
              {/* Document viewing */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Document</h3>
                {console.log('Selected Document:', selectedDocument) || console.log('Document Data Present:', !!selectedDocument.documentData) || console.log('Document Data Length:', selectedDocument.documentData?.length) || selectedDocument.documentData ? (
                  <div className="flex justify-center">
                    <iframe
                      src={`data:application/pdf;base64,${selectedDocument.documentData}`}
                      className="w-full h-96 border border-gray-200 rounded-lg"
                      title="Document PDF"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div 
                      className="text-center text-gray-500 py-8"
                      style={{ display: 'none' }}
                    >
                      <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">PDF Viewer Not Supported</p>
                      <p className="text-sm">Your browser doesn't support inline PDF viewing.</p>
                      <p className="text-sm">Please use the download button to view the document.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">No Document Available</p>
                    <p className="text-sm">No document file has been uploaded for this entry</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {selectedDocument.documentData && (
                    <button
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = `data:application/pdf;base64,${selectedDocument.documentData}`;
                        link.download = `${selectedDocument.title.replace(/\s+/g, '_')}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Download PDF Document
                    </button>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowDocumentModal(false);
                    setSelectedDocument(null);
                  }}
                  className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverProfile;
