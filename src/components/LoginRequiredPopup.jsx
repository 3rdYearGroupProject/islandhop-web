import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, Lock } from 'lucide-react';

const LoginRequiredPopup = ({ show, onClose, actionName = "access this feature" }) => {
  const navigate = useNavigate();

  if (!show) return null;

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleSignup = () => {
    onClose();
    navigate('/signup');
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
            <Lock className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Login Required
          </h2>
          <p className="text-gray-600 mb-8">
            You need to be logged in to {actionName}. Join IslandHop today and start planning your dream adventures!
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors"
            >
              <User className="h-5 w-5 mr-2" />
              Sign In
            </button>
            <button
              onClick={handleSignup}
              className="w-full flex items-center justify-center px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-full font-semibold hover:bg-primary-50 transition-colors"
            >
              Create Account
            </button>
          </div>

          {/* Additional Info */}
          <p className="text-sm text-gray-500 mt-6">
            Already have an account? <button onClick={handleLogin} className="text-primary-600 hover:underline">Sign in here</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredPopup;