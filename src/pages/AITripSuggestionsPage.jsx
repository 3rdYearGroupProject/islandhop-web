import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getProfileCompletionStatus } from '../utils/profileStorage';
import LoginRequiredPopup from '../components/LoginRequiredPopup';
import CompleteProfilePopup from '../components/CompleteProfilePopup';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AITripSuggestionsPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tripName, setTripName] = useState('');
  const [isPool, setIsPool] = useState(false);
  const [showLoginRequiredPopup, setShowLoginRequiredPopup] = useState(false);
  const [showCompleteProfilePopup, setShowCompleteProfilePopup] = useState(false);
  const [currentActionName, setCurrentActionName] = useState('');
  
  const navigate = useNavigate();

  // Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Check authentication and profile completion
  const checkUserAccessAndProfile = (actionName) => {
    if (!currentUser) {
      setCurrentActionName(actionName);
      setShowLoginRequiredPopup(true);
      return false;
    }

    const { isComplete } = getProfileCompletionStatus();
    if (!isComplete) {
      setCurrentActionName(actionName);
      setShowCompleteProfilePopup(true);
      return false;
    }

    return true;
  };

  const handleBack = () => {
    navigate('/trips');
  };

  const handleContinue = () => {
    if (!tripName.trim()) {
      alert('Please enter a trip name');
      return;
    }

    if (checkUserAccessAndProfile('create AI trip')) {
      navigate('/ai-trip-duration', {
        state: {
          tripName: tripName.trim(),
          isPool,
          userUid: currentUser.uid,
          isAI: true
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-800">AI Trip Suggestions</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Let our AI create the perfect trip for you based on your preferences
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-8">
              {/* Trip Name Section */}
              <div className="space-y-4">
                <label className="block text-xl font-semibold text-gray-800 mb-4">
                  What would you like to name your trip?
                </label>
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="e.g., Summer Adventure in Sri Lanka"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>

              {/* Pool Selection */}
              <div className="space-y-4">
                <label className="block text-xl font-semibold text-gray-800 mb-4">
                  Are you interested in joining a pool trip?
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsPool(true)}
                    className={`flex-1 py-3 px-6 rounded-lg border-2 transition-all duration-200 ${
                      isPool
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-medium">Yes</div>
                      <div className="text-sm opacity-75">Join a pool trip</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setIsPool(false)}
                    className={`flex-1 py-3 px-6 rounded-lg border-2 transition-all duration-200 ${
                      !isPool
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-medium">No</div>
                      <div className="text-sm opacity-75">Individual trip</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8">
                <button
                  onClick={handleBack}
                  className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
                
                <button
                  onClick={handleContinue}
                  disabled={!tripName.trim()}
                  className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                    tripName.trim()
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popups */}
      {showLoginRequiredPopup && (
        <LoginRequiredPopup
          isOpen={showLoginRequiredPopup}
          onClose={() => setShowLoginRequiredPopup(false)}
          actionName={currentActionName}
        />
      )}

      {showCompleteProfilePopup && (
        <CompleteProfilePopup
          isOpen={showCompleteProfilePopup}
          onClose={() => setShowCompleteProfilePopup(false)}
          actionName={currentActionName}
        />
      )}

      <Footer />
    </div>
  );
};

export default AITripSuggestionsPage;
