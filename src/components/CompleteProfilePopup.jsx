import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';

const CompleteProfilePopup = ({ show, onClose, actionName = "access this feature" }) => {
  const navigate = useNavigate();

  if (!show) return null;

  const handleCompleteProfile = () => {
    onClose();
    navigate('/profile-setup'); // Navigate to profile completion page
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Complete Your Profile
          </h2>
          <p className="text-gray-600 mb-8">
            To {actionName}, please complete your profile first. This helps us provide you with personalized recommendations and a better experience.
          </p>


          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCompleteProfile}
              className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors"
            >
              <UserCheck className="h-5 w-5 mr-2" />
              Complete Profile
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
            <button
              onClick={handleSkip}
              className="w-full flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
            >
              Skip for Now
            </button>
          </div>

          {/* Additional Info */}
          <p className="text-sm text-gray-500 mt-6">
            Completing your profile takes less than 2 minutes and unlocks all features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePopup;