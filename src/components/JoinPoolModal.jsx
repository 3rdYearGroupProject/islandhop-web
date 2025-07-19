import React, { useState, useEffect } from 'react';
import { FiX, FiUsers, FiSend, FiInfo, FiAlertCircle } from 'react-icons/fi';
import { PoolsApi } from '../api/poolsApi';
import { useAuth } from '../hooks/useAuth';

const JoinPoolModal = ({ open, onClose, poolData, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [userProfile, setUserProfile] = useState({
    age: '',
    interests: [],
    experience: 'beginner'
  });
  const [newInterest, setNewInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setMessage('');
      setUserProfile({ age: '', interests: [], experience: 'beginner' });
      setNewInterest('');
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  const handleAddInterest = () => {
    if (newInterest.trim() && !userProfile.interests.includes(newInterest.trim())) {
      setUserProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest) => {
    setUserProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmitJoinRequest = async () => {
    if (!user) {
      setError('You must be logged in to join a pool');
      return;
    }

    if (!message.trim()) {
      setError('Please add a message to introduce yourself');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const joinData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        message: message.trim(),
        userProfile: {
          age: userProfile.age ? parseInt(userProfile.age) : null,
          interests: userProfile.interests,
          experience: userProfile.experience
        }
      };

      const result = await PoolsApi.joinPool(poolData.id, joinData);
      
      setSuccess(true);
      if (onSuccess) {
        onSuccess(result);
      }
      
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FiUsers className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">
              Join Pool Request
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <FiUsers className="text-green-600" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Request Sent Successfully!
                </h4>
                <p className="text-gray-600">
                  Your join request has been submitted. All group members will need to approve your request before you can join.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Pool Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {poolData?.title || poolData?.name || 'Pool Details'}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Destination:</strong> {poolData?.destination || 'N/A'}</p>
                  <p><strong>Duration:</strong> {poolData?.duration || 'N/A'}</p>
                  <p><strong>Budget:</strong> {poolData?.budget || 'N/A'}</p>
                  <p><strong>Members:</strong> {poolData?.members?.length || 0}/{poolData?.maxMembers || 'N/A'}</p>
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Introduction Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell the group members why you'd like to join and what you can bring to the trip..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {message.length}/500 characters
                </div>
              </div>

              {/* User Profile */}
              <div className="space-y-4 mb-6">
                <h5 className="font-medium text-gray-900">Your Profile (Optional)</h5>
                
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={userProfile.age}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="Your age"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="18"
                    max="100"
                  />
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Travel Experience
                  </label>
                  <select
                    value={userProfile.experience}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interests
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add an interest (e.g., hiking, photography)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                    />
                    <button
                      type="button"
                      onClick={handleAddInterest}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Interest Tags */}
                  <div className="flex flex-wrap gap-2">
                    {userProfile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center space-x-1"
                      >
                        <span>{interest}</span>
                        <button
                          onClick={() => handleRemoveInterest(interest)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Approval Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                <div className="flex items-start space-x-2">
                  <FiInfo className="text-amber-600 mt-0.5" size={16} />
                  <div className="text-sm text-amber-800">
                    <strong>Approval Required:</strong> All existing group members must approve your request before you can join the pool.
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start space-x-2">
                    <FiAlertCircle className="text-red-600 mt-0.5" size={16} />
                    <div className="text-sm text-red-800">{error}</div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitJoinRequest}
                  disabled={loading || !message.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <FiSend size={16} />
                      <span>Send Join Request</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinPoolModal;
