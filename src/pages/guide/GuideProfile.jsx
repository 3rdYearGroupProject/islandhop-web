import React, { useState } from 'react';
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

const GuideProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
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
    
    skills: [
      'Cultural History',
      'Wildlife Knowledge',
      'Photography Guidance',
      'Local Cuisine Expertise',
      'Adventure Sports',
      'Archaeological Sites',
      'Tea Plantation Tours',
      'Ayurvedic Medicine',
      'Traditional Crafts'
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

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
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
    { key: 'languages', label: 'Languages & Skills', icon: Languages },
    { key: 'documents', label: 'Documents', icon: FileText },
    { key: 'preferences', label: 'Preferences', icon: Settings }
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
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2 inline" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Edit3 className="h-4 w-4 mr-2 inline" />
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
              src={guideData.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {guideData.firstName} {guideData.lastName}
            </h2>
            <p className="text-gray-600 mb-2">Professional Tour Guide</p>
            
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
            
            <div className="flex flex-wrap gap-2 mt-3">
              {guideData.specializations.map((spec, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {spec}
                </span>
              ))}
            </div>
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={(e) => setGuideData({...guideData, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={guideData.phone}
                    disabled={!isEditing}
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
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={(e) => setGuideData({...guideData, dateOfBirth: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    value={guideData.emergencyContact}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                    onChange={(e) => setGuideData({...guideData, emergencyContact: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={guideData.address}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                  onChange={(e) => setGuideData({...guideData, address: e.target.value})}
                />
              </div>
            </div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Professional Certifications</h3>
                {isEditing && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                    <PlusIcon className="h-4 w-4 mr-2 inline" />
                    Add Certification
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guideData.certifications.map((cert) => (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cert.status)}`}>
                        <BadgeCheckIcon className="h-3 w-3 inline mr-1" />
                        {cert.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Issuer:</span> {cert.issuer}
                      </div>
                      <div>
                        <span className="font-medium">Issue Date:</span> {cert.issueDate}
                      </div>
                      <div>
                        <span className="font-medium">Expiry:</span> {cert.expiryDate}
                      </div>
                      <div>
                        <span className="font-medium">Verification #:</span> {cert.verificationNumber}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                        View Certificate
                      </button>
                      {isEditing && (
                        <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                          <Upload className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages & Skills Tab */}
          {activeTab === 'languages' && (
            <div className="space-y-8">
              {/* Languages Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
                  {isEditing && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      <PlusIcon className="h-4 w-4 mr-2 inline" />
                      Add Language
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {guideData.languages.map((lang) => (
                    <div key={lang.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{lang.language}</h4>
                        {lang.certified && (
                          <BadgeCheckIcon className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getProficiencyColor(lang.proficiency)}`}>
                        {lang.proficiency}
                      </span>
                      
                      {lang.certification && (
                        <div className="mt-2 text-xs text-gray-600">
                          <span className="font-medium">Certified:</span> {lang.certification}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Skills Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Specialized Skills</h3>
                  {isEditing && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      <PlusIcon className="h-4 w-4 mr-2 inline" />
                      Add Skill
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {guideData.skills.map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                      {skill}
                      {isEditing && (
                        <button className="ml-2 text-blue-600 hover:text-blue-800">
                          <X className="h-3 w-3 inline" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(guideData.documents).map(([docType, docData]) => (
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
                        <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={guideData.preferences.workingHours.start}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      value={guideData.preferences.workingHours.end}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
              
              {/* Preferred Areas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Working Areas</h3>
                <div className="flex flex-wrap gap-3">
                  {guideData.preferences.preferredAreas.map((area, index) => (
                    <span key={index} className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                      {area}
                      {isEditing && (
                        <button className="ml-2 text-green-600 hover:text-green-800">
                          <X className="h-3 w-3 inline" />
                        </button>
                      )}
                    </span>
                  ))}
                  {isEditing && (
                    <button className="px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 text-sm">
                      <PlusIcon className="h-3 w-3 mr-1 inline" />
                      Add Area
                    </button>
                  )}
                </div>
              </div>
              
              {/* Other Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Group Size</label>
                  <input
                    type="number"
                    value={guideData.preferences.maxGroupSize}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Tour Types</label>
                  <div className="space-y-2">
                    {guideData.preferences.tourTypes.map((type, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={true}
                          disabled={!isEditing}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideProfile;
