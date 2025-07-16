import React, { useState } from 'react';
import {
  CheckBadgeIcon,
  XMarkIcon,
  UserIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  IdentificationIcon,
  GlobeAltIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const GuideVerificationForm = ({ guide, onVerify, onCancel }) => {
  const [formData, setFormData] = useState({
    guideId: guide.id,
    certificateIssuer: '',
    issueDate: '',
    expiryDate: '',
    verificationNumber: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.certificateIssuer.trim()) {
      newErrors.certificateIssuer = 'Certificate issuer is required';
    }
    
    if (!formData.issueDate) {
      newErrors.issueDate = 'Issue date is required';
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
      newErrors.expiryDate = 'Expiry date must be after issue date';
    }
    
    if (!formData.verificationNumber.trim()) {
      newErrors.verificationNumber = 'Verification number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call
      // await axios.post('/api/guides/verify', formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onVerify(formData);
    } catch (error) {
      console.error('Error verifying guide:', error);
      // Handle error appropriately
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manual Guide Verification</h1>
            <p className="text-gray-600">Enter verification details for guide license</p>
          </div>
          <button
            onClick={onCancel}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <XMarkIcon className="h-4 w-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Guide Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <UserIcon className="h-5 w-5 mr-2" />
            Guide Information
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{guide.name}</h3>
                <p className="text-sm text-gray-600">{guide.email}</p>
                <p className="text-sm text-gray-600">{guide.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                <p className="text-sm text-gray-900">{guide.licenseNumber}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                <p className="text-sm text-gray-900">{formatDate(guide.submittedAt)}</p>
              </div>
            </div>

            {/* Guide Professional Information */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <AcademicCapIcon className="h-4 w-4 mr-1" />
                Professional Information
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Experience: </span>
                  <span className="text-sm font-medium">{guide.experience}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Qualifications: </span>
                  <span className="text-sm font-medium">{guide.qualifications}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 flex items-center">
                    <GlobeAltIcon className="h-3 w-3 mr-1" />
                    Languages: 
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {guide.languages.map((lang, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Specializations: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {guide.specializations.map((spec, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-900 mb-2">Submitted Documents</h4>
              <div className="space-y-2">
                {Object.entries(guide.documents).map(([type, url]) => (
                  <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-700">
                      {type.charAt(0).toUpperCase() + type.slice(1)} Document
                    </span>
                    <button
                      onClick={() => window.open(url, '_blank')}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CheckBadgeIcon className="h-5 w-5 mr-2" />
            Verification Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Certificate Issuer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IdentificationIcon className="h-4 w-4 inline mr-1" />
                Certificate Issuer *
              </label>
              <input
                type="text"
                name="certificateIssuer"
                value={formData.certificateIssuer}
                onChange={handleInputChange}
                placeholder="e.g., Sri Lanka Tourism Development Authority"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.certificateIssuer ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.certificateIssuer && (
                <p className="mt-1 text-sm text-red-600">{errors.certificateIssuer}</p>
              )}
            </div>

            {/* Issue Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                Issue Date *
              </label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.issueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.issueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.issueDate}</p>
              )}
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                Expiry Date *
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
              )}
            </div>

            {/* Verification Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DocumentTextIcon className="h-4 w-4 inline mr-1" />
                Verification Number *
              </label>
              <input
                type="text"
                name="verificationNumber"
                value={formData.verificationNumber}
                onChange={handleInputChange}
                placeholder="Enter verification number"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.verificationNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.verificationNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.verificationNumber}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any additional verification notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckBadgeIcon className="h-4 w-4 mr-2" />
                    Verify Guide
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuideVerificationForm;
