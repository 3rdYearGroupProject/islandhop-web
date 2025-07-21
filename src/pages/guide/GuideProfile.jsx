import React, { useState, useEffect } from 'react';
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
  Settings,
  AcademicCapIcon,
  Languages,
  BadgeCheckIcon,
  PlusIcon
} from 'lucide-react';
import userServicesApi from '../../api/axios';
import { useToast } from '../../components/ToastProvider';

const GuideProfile = () => {
  const [activeTab, setActiveTab] = useState('personal'); // personal, certifications, languages, documents, preferences
  const [isLoading, setIsLoading] = useState(true);

  const [guideData, setGuideData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    emergencyContactNumber: '',
    emergencyContactName: '',
    profilePicture: '',
    
    // Guide Stats
    rating: 0,
    totalTours: 0,
    totalReviews: 0,
    memberSince: '',
    status: '',
    specializations: [],
    
    // Certifications
    certifications: [],
    
    // Languages & Skills
    languages: [],
    
    // Documents
    documents: {},
    
    // Preferences
    preferences: {}
  });

  const { success: showSuccessToast, error: showErrorToast } = useToast();

  // Separate edit states for each section
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingCerts, setIsEditingCerts] = useState(false);
  const [isEditingLangs, setIsEditingLangs] = useState(false);

  // Certificate modal state
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Track uploaded profile picture file
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  // Fetch all data on component mount
  useEffect(() => {
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Remove localStorage - let session handle authentication
      console.log('Fetching profile data...');
      
      // Fetch personal info (no email parameter needed - session handles it)
      const personalRes = await userServicesApi.get(`/guide/profile`);
      if (personalRes.status === 200 && personalRes.data) {
        let profilePicture = personalRes.data.profilePicture;
        if (personalRes.data.profilePictureBase64) {
          profilePicture = `data:image/jpeg;base64,${personalRes.data.profilePictureBase64}`;
        }
        setGuideData(prev => ({ 
          ...prev, 
          ...personalRes.data, 
          profilePicture, 
          email: personalRes.data.email // Get email from response instead of localStorage
        }));
      }

      // Get email from the profile response for other API calls
      const userEmail = personalRes.data?.email;
      
      if (userEmail) {
        // Fetch certificates
        const certsRes = await userServicesApi.get(`/guide/certificates`);
        if (certsRes.status === 200 && Array.isArray(certsRes.data)) {
          setGuideData(prev => ({ ...prev, certifications: certsRes.data }));
        }

        // Fetch languages
        const langsRes = await userServicesApi.get(`/guide/languages?email=${userEmail}`);
        if (langsRes.status === 200 && Array.isArray(langsRes.data)) {
          // Map 'level' to 'proficiency' for UI compatibility
          const mapped = langsRes.data.map(lang => ({ ...lang, proficiency: lang.level }));
          setGuideData(prev => ({ ...prev, languages: mapped }));
        }
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      
      // Handle authentication errors specifically
      if (err.response?.status === 401) {
        showErrorToast('Session expired. Please log in again.');
        // Redirect to login page
        // window.location.href = '/login'; // or use your router
      } else {
        showErrorToast('Failed to load profile data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  fetchAllData();
  // eslint-disable-next-line
}, []);
  // PUT methods for each section
  const handleSavePersonal = async () => {
    try {
      let profilePictureToSend = guideData.profilePicture;
      if (profilePictureFile) {
        // Convert file to base64 and strip data URL prefix
        const toBase64 = file => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const result = reader.result;
            // Remove data URL prefix if present
            const base64 = result.split(',')[1] || result;
            resolve(base64);
          };
          reader.onerror = error => reject(error);
        });
        profilePictureToSend = await toBase64(profilePictureFile);
      }
      const res = await userServicesApi.put('/guide/profile', {
        email: guideData.email,
        firstName: guideData.firstName,
        lastName: guideData.lastName,
        phoneNumber: guideData.phoneNumber,
        dateOfBirth: guideData.dateOfBirth,
        address: guideData.address,
        emergencyContactNumber: guideData.emergencyContactNumber,
        emergencyContactName: guideData.emergencyContactName,
        profilePictureBase64: profilePictureToSend
      });
      if (res.status === 200) {
        showSuccessToast('Personal info updated');
        setIsEditingPersonal(false);
        setProfilePictureFile(null); // Reset after successful upload
      }
    } catch (err) {
      showErrorToast('Failed to update personal info');
    }
  };

  // const handleSaveCertificates = async () => {
  //   try {
  //     // Only send backend-required fields for each certificate
  //     const certificationsToSend = guideData.certifications.map(cert => ({
  //       issuer: cert.issuer,
  //       issueDate: null,
  //       expiryDate: cert.expiryDate,
  //       verificationNumber: cert.verificationNumber,
  //       status: cert.status,
  //       documentUrl: cert.documentUrl
  //     }));
  //     const res = await userServicesApi.put('/guide/certificates', {
  //       email: guideData.email,
  //       certifications: certificationsToSend
  //     });
  //     if (res.status === 200) {
  //       showSuccessToast('Certificates updated');
  //       setIsEditingCerts(false);
  //     }
  //   } catch (err) {
  //     showErrorToast('Failed to update certificates');
  //   }
  // };

  // handleSaveLanguages already exists, just update to setIsEditingLangs(false) on success
  const handleSaveLanguages = async (languages) => {
    try {
      // Map 'proficiency' to 'level' for backend, and only send language and level
      const toSend = languages.map(lang => ({ language: lang.language, level: lang.proficiency }));
      const res = await userServicesApi.put('/guide/languages', {
        languages: toSend
      });
      if (res.status === 200) {
        setGuideData(prev => ({ ...prev, languages }));
        showSuccessToast('Languages updated');
        setIsEditingLangs(false);
      }
    } catch (err) {
      showErrorToast('Failed to update languages');
    }
  };

  // Generate unique certificate ID
  const generateCertificateId = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const guideName = `${guideData.firstName}${guideData.lastName}`.toLowerCase().replace(/\s+/g, '');
    return `CERT-${guideName}-${timestamp}-${randomNum}`;
  };

  // Add certificate upload logic
  const handleAddCertificate = async (cert, idx) => {
    try {
      let documentBase64 = undefined;
      if (cert.documentFile) {
        const toBase64 = file => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const result = reader.result;
            const base64 = result.split(',')[1] || result;
            resolve(base64);
          };
          reader.onerror = error => reject(error);
        });
        documentBase64 = await toBase64(cert.documentFile);
      }
      // Use '-' for empty/null fields
      const dashIfEmpty = v => (v === undefined || v === null || v === '' ? '-' : v);
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      const body = {
   certificateId: cert.id || null,
    certificateIssuer: cert.issuer || null,
    issueDate: cert.issueDate || null,        // Send null instead of "-"
    expiryDate: cert.expiryDate || null,      // Send null instead of "-"
    verificationNumber: cert.verificationNumber || null,
    status: cert.status || null,
    certificatePictureBase64: documentBase64
};
      console.log('Uploading certificate:', body);
      const res = await userServicesApi.post('/guide/certificates', body);
      if (res.status === 200 && res.data) {
        setGuideData(prev => {
          const newCerts = [...prev.certifications];
          newCerts[idx] = res.data;
          return { ...prev, certifications: newCerts };
        });
        showSuccessToast('Certificate uploaded');
      }
    } catch (err) {
      showErrorToast('Failed to upload certificate');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case 'Native':
        return 'bg-purple-100 text-purple-800';
      case 'Advanced':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'Basic':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { key: 'personal', label: 'Personal Info', icon: User },
    { key: 'certifications', label: 'Certifications', icon: BadgeCheckIcon },
    { key: 'languages', label: 'Languages & Skills', icon: Languages }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Loading Screen */}
      {isLoading ? (
        <div className="min-h-screen flex my-20 justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Guide Profile</h1>
                <p className="text-gray-600 mt-1">Manage your professional guide information</p>
              </div>
              <div className="flex items-center space-x-3">
                {activeTab === 'personal' && !isEditingPersonal && (
                  <button
                    onClick={() => setIsEditingPersonal(true)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Edit3 className="h-4 w-4 mr-2 inline" />Edit Personal Info
                  </button>
                )}
                {activeTab === 'certifications' && !isEditingCerts && (
                  <button
                    onClick={() => setIsEditingCerts(true)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Edit3 className="h-4 w-4 mr-2 inline" />Edit Certificates
                  </button>
                )}
                {activeTab === 'languages' && !isEditingLangs && (
                  <button
                    onClick={() => setIsEditingLangs(true)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Edit3 className="h-4 w-4 mr-2 inline" />Edit Languages
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
                  src={guideData.profilePicture || '/default-avatar.png'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditingPersonal && (
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
                          setGuideData(prev => ({
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
                  {guideData.firstName} {guideData.lastName}
                </h2>
                <p className="text-gray-600">{guideData.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{guideData.rating || 0}</span>
                    <span className="text-gray-500 text-sm ml-1">({guideData.totalReviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {guideData.totalTours || 0} tours completed
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Member since {guideData.memberSince ? new Date(guideData.memberSince).getFullYear() : 'N/A'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  guideData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {guideData.status === 'active' ? 'Active Guide' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2 inline" />
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
                    value={guideData.firstName}
                    disabled={!isEditingPersonal}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={(e) => setGuideData({...guideData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={guideData.lastName}
                    disabled={!isEditingPersonal}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={(e) => setGuideData({...guideData, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={guideData.email}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={guideData.phoneNumber}
                    disabled={!isEditingPersonal}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={(e) => setGuideData({...guideData, phoneNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={guideData.dateOfBirth}
                    disabled={!isEditingPersonal}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={(e) => setGuideData({...guideData, dateOfBirth: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={guideData.address}
                  disabled={!isEditingPersonal}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                  onChange={(e) => setGuideData({...guideData, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={guideData.emergencyContactName}
                    disabled={!isEditingPersonal}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={e => setGuideData({ ...guideData, emergencyContactName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={guideData.emergencyContactNumber}
                    disabled={!isEditingPersonal}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={e => setGuideData({ ...guideData, emergencyContactNumber: e.target.value })}
                  />
                </div>
              </div>
              {isEditingPersonal && (
                <div className="flex gap-2 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsEditingPersonal(false)}
                  >
                    <X className="h-4 w-4 mr-2 inline" />Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    onClick={handleSavePersonal}
                  >
                    <Save className="h-4 w-4 mr-2 inline" />Save Changes
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Professional Certifications</h3>
                {isEditingCerts && (
                  <button
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                    onClick={() => setGuideData(prev => ({
                      ...prev,
                      certifications: [
                        ...prev.certifications,
                        {
                          issuer: '',
                          issueDate: '',
                          expiryDate: '',
                          verificationNumber: '',
                          status: 'pending',
                          documentFile: null,
                          isNew: true // Mark as new for POST
                        }
                      ]
                    }))}
                  >
                    <PlusIcon className="h-4 w-4 mr-2 inline" />
                    Add Certificate
                  </button>
                )}
              </div>
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  // POST all new certificates with a file
                  if (isEditingCerts) {
                    const certs = guideData.certifications;
                    for (let idx = 0; idx < certs.length; idx++) {
                      const cert = certs[idx];
                      if (cert.isNew && cert.documentFile) {
                        await handleAddCertificate(cert, idx);
                      }
                    }
                  }
                  // handleSaveCertificates(); // Always PUT after POSTs
                  setIsEditingCerts(false);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {guideData.certifications.map((cert, idx) => (
                    <div key={cert.id} className="border border-gray-200 rounded-lg p-6 flex flex-col gap-2">
                      {/* Only allow upload, display all other fields as read-only */}
                      <div className="space-y-2 text-sm text-gray-600">
                        <div><span className="font-medium">Issuer:</span> {cert.certificateIssuer}</div>
                        <div><span className="font-medium">Issue Date:</span> {cert.issueDate}</div>
                        <div><span className="font-medium">Expiry:</span> {cert.expiryDate}</div>
                        <div><span className="font-medium">Verification #:</span> {cert.verificationNumber}</div>
                        <div><span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}>{cert.status}</span></div>
                      </div>
                      {isEditingCerts && (
                        <>
                          <label className="w-full mt-2 flex items-center justify-center px-4 py-2 bg-green-50 text-green-700 border border-green-300 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                            <Upload className="h-4 w-4 mr-2" />
                            {cert.documentFile ? cert.documentFile.name : 'Choose Certificate File'}
                            <input
                              type="file"
                              accept="application/pdf,image/*"
                              className="hidden"
                              onChange={e => {
                                const file = e.target.files[0];
                                if (file) {
                                  const newCerts = [...guideData.certifications];
                                  newCerts[idx].documentFile = file;
                                  setGuideData(prev => ({ ...prev, certifications: newCerts }));
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            className="text-red-500 text-xs self-end mt-1"
                            onClick={() => {
                              setGuideData(prev => ({
                                ...prev,
                                certifications: prev.certifications.filter((_, i) => i !== idx)
                              }));
                            }}
                          >Remove</button>
                        </>
                      )}
                      <div className="mt-4 flex space-x-2">
                        <button 
                          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                          onClick={() => {
                            setSelectedCertificate(cert);
                            setCertificateModalOpen(true);
                          }}
                          disabled={!cert.certificatePictureBase64 && !cert.documentUrl}
                        >
                          View Certificate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {isEditingCerts && (
                  <div className="flex gap-2 mt-6">
                    <button
                      type="button"
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      onClick={() => setIsEditingCerts(false)}
                    >
                      <X className="h-4 w-4 mr-2 inline" />Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <Save className="h-4 w-4 mr-2 inline" />Save Certificates
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Languages & Skills Tab */}
          {activeTab === 'languages' && (
            <div className="space-y-8">
              {/* Languages Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
                  {isEditingLangs && (
                    <button
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                      onClick={() => setGuideData(prev => ({
                        ...prev,
                        languages: [
                          ...prev.languages,
                          { id: Date.now(), language: '', proficiency: 'Native', certified: false }
                        ]
                      }))}
                    >
                      <PlusIcon className="h-4 w-4 mr-2 inline" />
                      Add Language
                    </button>
                  )}
                </div>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSaveLanguages(guideData.languages);
                    setIsEditingLangs(false);
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {guideData.languages.map((lang, idx) => (
                      <div key={lang.id} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
                        {isEditingLangs ? (
                          <>
                            <select
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              value={lang.language}
                              onChange={e => {
                                const newLangs = [...guideData.languages];
                                newLangs[idx].language = e.target.value;
                                setGuideData(prev => ({ ...prev, languages: newLangs }));
                              }}
                              required
                            >
                              <option value="">Select Language</option>
                              <option value="English">English</option>
                              <option value="Sinhala">Sinhala</option>
                              <option value="Tamil">Tamil</option>
                              <option value="French">French</option>
                              <option value="German">German</option>
                              <option value="Spanish">Spanish</option>
                              <option value="Italian">Italian</option>
                              <option value="Japanese">Japanese</option>
                              <option value="Chinese">Chinese</option>
                              <option value="Korean">Korean</option>
                              <option value="Russian">Russian</option>
                              <option value="Arabic">Arabic</option>
                              <option value="Hindi">Hindi</option>
                              <option value="Dutch">Dutch</option>
                              <option value="Portuguese">Portuguese</option>
                              <option value="Thai">Thai</option>
                              <option value="Other">Other</option>
                            </select>
                            <select
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              value={lang.proficiency}
                              onChange={e => {
                                const newLangs = [...guideData.languages];
                                newLangs[idx].proficiency = e.target.value;
                                setGuideData(prev => ({ ...prev, languages: newLangs }));
                              }}
                            >
                              <option value="Native">Native</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Basic">Basic</option>
                            </select>
                            <button
                              type="button"
                              className="text-red-500 text-xs self-end mt-1"
                              onClick={() => {
                                setGuideData(prev => ({
                                  ...prev,
                                  languages: prev.languages.filter((_, i) => i !== idx)
                                }));
                              }}
                            >Remove</button>
                          </>
                        ) : (
                          <>
                            <h4 className="font-semibold text-gray-900">{lang.language}</h4>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getProficiencyColor(lang.proficiency)}`}>
                              {lang.proficiency}
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditingLangs && (
                    <div className="flex gap-2 mt-6">
                      <button
                        type="button"
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        onClick={() => setIsEditingLangs(false)}
                      >
                        <X className="h-4 w-4 mr-2 inline" />Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        <Save className="h-4 w-4 mr-2 inline" />Save Languages
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
        </>
      )}

      {/* Certificate View Modal */}
      {certificateModalOpen && selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
            {/* Modal Header */}
            <div className="bg-primary-600 p-4 text-white relative">
              <button
                onClick={() => {
                  setCertificateModalOpen(false);
                  setSelectedCertificate(null);
                }}
                className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold z-10"
              >
                ×
              </button>
              <h2 className="text-xl font-bold">Certificate Details</h2>
              <p className="text-white/80 text-sm mt-1">
                {selectedCertificate.issuer} - {selectedCertificate.verificationNumber}
              </p>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6">
              {/* Certificate Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Issuer:</span>
                    <p className="text-gray-900 font-medium">{selectedCertificate.issuer}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Issue Date:</span>
                    <p className="text-gray-900">{selectedCertificate.issueDate || 'Not specified'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Expiry Date:</span>
                    <p className="text-gray-900">{selectedCertificate.expiryDate || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCertificate.status)}`}>
                      {selectedCertificate.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Certificate Image/Document */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Document</h3>
                {selectedCertificate.certificatePictureBase64 ? (
                  <div className="flex justify-center">
                    <iframe
                      src={`data:application/pdf;base64,${selectedCertificate.certificatePictureBase64}`}
                      className="w-full h-96 border border-gray-200 rounded-lg"
                      title="Certificate PDF"
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
                      <p className="text-sm">Please use the download button to view the certificate.</p>
                    </div>
                  </div>
                ) : selectedCertificate.documentUrl ? (
                  <div className="flex justify-center">
                    <iframe
                      src={selectedCertificate.documentUrl}
                      className="w-full h-96 border border-gray-200 rounded-lg"
                      title="Certificate PDF"
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
                      <p>Unable to display certificate</p>
                      <p className="text-sm">The certificate file could not be loaded</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">No Certificate Document</p>
                    <p className="text-sm">No certificate file has been uploaded for this entry</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {selectedCertificate.certificatePictureBase64 && (
                    <button
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = `data:application/pdf;base64,${selectedCertificate.certificatePictureBase64}`;
                        link.download = `certificate-${selectedCertificate.verificationNumber || 'document'}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Download PDF Certificate
                    </button>
                  )}
                </div>
                <button
                  onClick={() => {
                    setCertificateModalOpen(false);
                    setSelectedCertificate(null);
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

export default GuideProfile;
