import React, { useState } from 'react';
import { MapPin, Calendar, Users, Sparkles, Globe, Camera, Heart } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';

const CreateTripModal = ({ isOpen, onClose, onCreateTrip }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: '', // adventure, relaxation, cultural, business
    travelers: 1,
    budget: ''
  });

  const [errors, setErrors] = useState({});

  const tripTypes = [
    { 
      id: 'adventure', 
      name: 'Adventure', 
      icon: Globe,
      description: 'Hiking, exploring, outdoor activities',
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'relaxation', 
      name: 'Relaxation', 
      icon: Heart,
      description: 'Beach, spa, peaceful getaway',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'cultural', 
      name: 'Cultural', 
      icon: Camera,
      description: 'Museums, history, local experiences',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'business', 
      name: 'Business', 
      icon: MapPin,
      description: 'Work travel, conferences, meetings',
      color: 'from-gray-500 to-gray-600'
    }
  ];

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

  const handleTypeSelect = (typeId) => {
    setFormData(prev => ({
      ...prev,
      type: typeId
    }));
    if (errors.type) {
      setErrors(prev => ({ ...prev, type: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Trip name is required';
      } else if (formData.name.length > 80) {
        newErrors.name = 'Trip name must be 80 characters or less';
      }
      
      if (!formData.type) {
        newErrors.type = 'Please select a trip type';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1) {
        setCurrentStep(2);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateForm = () => {
    return validateStep(1) && validateStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCreateTrip(formData);
      // Reset form
      setFormData({ name: '', type: '', travelers: 1, budget: '' });
      setErrors({});
      setCurrentStep(1);
      onClose();
    }
  };

  const handleCancel = () => {
    // Reset form and close
    setFormData({ name: '', type: '', travelers: 1, budget: '' });
    setErrors({});
    setCurrentStep(1);
    onClose();
  };

  const remainingChars = 80 - formData.name.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={currentStep === 1 ? "Create Your Trip" : "Trip Details"}
      size="lg"
      showCloseButton={true}
    >
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
            currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 rounded ${currentStep > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
            currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Trip Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                  What should we call your trip?
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Summer Adventure in Sri Lanka"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  className="w-full text-lg"
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.name && (
                    <span className="text-sm text-red-600">{errors.name}</span>
                  )}
                  <span className={`text-sm ml-auto ${remainingChars < 10 ? 'text-red-600' : 'text-gray-500'}`}>
                    {remainingChars}/80 characters
                  </span>
                </div>
              </div>

              {/* Trip Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-4">
                  What type of trip is this?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tripTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleTypeSelect(type.id)}
                        className={`relative p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                          formData.type === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${type.color} text-white mb-4`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{type.name}</h3>
                        <p className="text-sm text-gray-600">{type.description}</p>
                        {formData.type === type.id && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.type && (
                  <p className="text-sm text-red-600 mt-2">{errors.type}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Number of Travelers */}
              <div>
                <label htmlFor="travelers" className="block text-sm font-medium text-gray-900 mb-2">
                  How many travelers?
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, travelers: Math.max(1, prev.travelers - 1) }))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-2xl font-bold text-gray-900 w-8 text-center">{formData.travelers}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, travelers: prev.travelers + 1 }))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-900 mb-2">
                  Estimated budget (optional)
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select budget range</option>
                  <option value="under-500">Under $500</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="2500-5000">$2,500 - $5,000</option>
                  <option value="over-5000">Over $5,000</option>
                </select>
              </div>

              {/* AI Suggestions */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Suggestions</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Let our AI suggest personalized itineraries, accommodations, and activities based on your preferences.
                    </p>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable AI recommendations</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="ghost"
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Back
                </Button>
              )}
              <Button
                type="button"
                onClick={handleCancel}
                variant="ghost"
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </Button>
            </div>
            
            {currentStep === 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                variant="primary"
                disabled={!formData.name.trim() || !formData.type}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  !formData.name.trim() || !formData.type
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Create Trip
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateTripModal;
