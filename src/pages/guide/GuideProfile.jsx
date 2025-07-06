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

  const [guideData, setGuideData] = useState({
    // Personal Information
    firstName: 'Priya',
    lastName: 'Perera',
    email: 'priya.perera@example.com',
    phone: '+94 77 456 7890',
    dateOfBirth: '1990-05-20',
    address: '456 Temple Road, Kandy',
    emergencyContact: '+94 77 123 4567',
    emergencyContactName: 'Sunil Perera',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612d9e3?w=300&h=300&fit=crop&crop=face',
    
    // Guide Stats
    rating: 4.9,
    totalTours: 156,
    totalReviews: 142,
    memberSince: '2022-03-20',
    status: 'active',
    specializations: ['Cultural Tours', 'Adventure Tours', 'Food Tours'],
    
    // Certifications
    certifications: [
      {
        id: 1,
        name: 'Tourism Guide License',
        issuer: 'Sri Lanka Tourism Development Authority',
        issueDate: '2022-01-15',
        expiryDate: '2025-01-15',
        status: 'active',
        verificationNumber: 'SLTDA-G-2022-0456',
        documentUrl: '#'
      },
      {
        id: 2,
        name: 'First Aid Certification',
        issuer: 'Sri Lanka Red Cross Society',
        issueDate: '2023-06-10',
        expiryDate: '2025-06-10',
        status: 'active',
        verificationNumber: 'SLRCS-FA-2023-1234',
        documentUrl: '#'
      },
      {
        id: 3,
        name: 'Wilderness Safety Certification',
        issuer: 'Adventure Tourism Board',
        issueDate: '2023-08-20',
        expiryDate: '2026-08-20',
        status: 'active',
        verificationNumber: 'ATB-WS-2023-0789',
        documentUrl: '#'
      }
    ],
    
    // Languages & Skills
    languages: [
      {
        id: 1,
        language: 'Sinhala',
        proficiency: 'Native',
        certified: false
      },
      {
        id: 2,
        language: 'English',
        proficiency: 'Advanced',
        certified: true,
        certification: 'IELTS Band 8.5'
      },
      {
        id: 3,
        language: 'Tamil',
        proficiency: 'Intermediate',
        certified: false
      },
      {
        id: 4,
        language: 'German',
        proficiency: 'Basic',
        certified: true,
        certification: 'Goethe A2'
      },
      {
        id: 5,
        language: 'French',
        proficiency: 'Basic',
        certified: false
      }
    ],
    
    // Documents
    documents: {
      nationalId: {
        number: 'NIC-901234567V',
        expiryDate: '2030-05-20',
        status: 'verified',
        uploadedAt: '2024-01-10'
      },
      tourismLicense: {
        number: 'SLTDA-G-2022-0456',
        expiryDate: '2025-01-15',
        status: 'verified',
        uploadedAt: '2024-01-10'
      },
      firstAidCert: {
        number: 'SLRCS-FA-2023-1234',
        expiryDate: '2025-06-10',
        status: 'verified',
        uploadedAt: '2024-01-10'
      }
    },
    
    // Preferences
    preferences: {
      workingHours: {
        start: '07:00',
        end: '18:00'
      },
      preferredAreas: ['Kandy', 'Ella', 'Nuwara Eliya', 'Sigiriya'],
      maxGroupSize: 8,
      tourTypes: ['Cultural', 'Adventure', 'Food & Culinary'],
      notifications: {
        tourRequests: true,
        earnings: true,
        reviews: true,
        systemUpdates: true
      }
    }
  });

  const { success: showSuccessToast, error: showErrorToast } = useToast();

  // Separate edit states for each section
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingCerts, setIsEditingCerts] = useState(false);
  const [isEditingLangs, setIsEditingLangs] = useState(false);

  // Fetch personal info
  useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const res = await userServicesApi.get(`/guide/personal?email=${guideData.email}`);
        if (res.status === 200 && res.data) {
          setGuideData(prev => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        showErrorToast('Failed to fetch personal info');
      }
    };
    fetchPersonal();
    // eslint-disable-next-line
  }, []);

  // Fetch certificates
  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await userServicesApi.get(`/guide/certificates?email=${guideData.email}`);
        if (res.status === 200 && Array.isArray(res.data)) {
          setGuideData(prev => ({ ...prev, certifications: res.data }));
        }
      } catch (err) {
        showErrorToast('Failed to fetch certificates');
      }
    };
    fetchCerts();
    // eslint-disable-next-line
  }, []);

  // Fetch languages (already present, but now separated)
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await userServicesApi.get(`/guide/languages?email=${guideData.email}`);
        if (res.status === 200 && Array.isArray(res.data)) {
          setGuideData(prev => ({ ...prev, languages: res.data }));
        }
      } catch (err) {
        showErrorToast('Failed to fetch languages');
      }
    };
    fetchLanguages();
    // eslint-disable-next-line
  }, []);

  // PUT methods for each section
  const handleSavePersonal = async () => {
    try {
      const res = await userServicesApi.put('/guide/personal', {
        email: guideData.email,
        firstName: guideData.firstName,
        lastName: guideData.lastName,
        phone: guideData.phone,
        dateOfBirth: guideData.dateOfBirth,
        address: guideData.address,
        emergencyContact: guideData.emergencyContact,
        emergencyContactName: guideData.emergencyContactName,
        profilePicture: guideData.profilePicture
      });
      if (res.status === 200) {
        showSuccessToast('Personal info updated');
        setIsEditingPersonal(false);
      }
    } catch (err) {
      showErrorToast('Failed to update personal info');
    }
  };

  const handleSaveCertificates = async () => {
    try {
      const res = await userServicesApi.put('/guide/certificates', {
        email: guideData.email,
        certifications: guideData.certifications
      });
      if (res.status === 200) {
        showSuccessToast('Certificates updated');
        setIsEditingCerts(false);
      }
    } catch (err) {
      showErrorToast('Failed to update certificates');
    }
  };

  // handleSaveLanguages already exists, just update to setIsEditingLangs(false) on success
  const handleSaveLanguages = async (languages) => {
    try {
      const res = await userServicesApi.put('/guide/languages', {
        email: guideData.email,
        languages
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
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Edit3 className="h-4 w-4 mr-2 inline" />Edit Personal Info
              </button>
            )}
            {activeTab === 'certifications' && !isEditingCerts && (
              <button
                onClick={() => setIsEditingCerts(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Edit3 className="h-4 w-4 mr-2 inline" />Edit Certificates
              </button>
            )}
            {activeTab === 'languages' && !isEditingLangs && (
              <button
                onClick={() => setIsEditingLangs(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
              src={guideData.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {isEditingPersonal && (
              <label className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors cursor-pointer">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      // Simulate upload and preview
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
                <span className="font-medium">{guideData.rating}</span>
                <span className="text-gray-500 text-sm ml-1">({guideData.totalReviews} reviews)</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {guideData.totalTours} tours completed
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Member since {new Date(guideData.memberSince).getFullYear()}
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
                    value={guideData.phone}
                    disabled={!isEditingPersonal}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={(e) => setGuideData({...guideData, phone: e.target.value})}
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
                    value={guideData.emergencyContact}
                    disabled={!isEditingPersonal}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={e => setGuideData({ ...guideData, emergencyContact: e.target.value })}
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
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    onClick={() => setGuideData(prev => ({
                      ...prev,
                      certifications: [
                        ...prev.certifications,
                        {
                          id: Date.now(),
                          issuer: '',
                          issueDate: '',
                          expiryDate: '',
                          verificationNumber: '',
                          status: 'pending',
                          documentFile: null
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
                onSubmit={e => {
                  e.preventDefault();
                  // TODO: Add backend PUT call for certificates if needed
                  setIsEditingCerts(false);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {guideData.certifications.map((cert, idx) => (
                    <div key={cert.id} className="border border-gray-200 rounded-lg p-6 flex flex-col gap-2">
                      {/* Only allow upload, display all other fields as read-only */}
                      <div className="space-y-2 text-sm text-gray-600">
                        <div><span className="font-medium">Issuer:</span> {cert.issuer}</div>
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
                        <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
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
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
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
                            <input
                              type="text"
                              placeholder="Language"
                              value={lang.language}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              onChange={e => {
                                const newLangs = [...guideData.languages];
                                newLangs[idx].language = e.target.value;
                                setGuideData(prev => ({ ...prev, languages: newLangs }));
                              }}
                              required
                            />
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
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
    </div>
  );
};

export default GuideProfile;
