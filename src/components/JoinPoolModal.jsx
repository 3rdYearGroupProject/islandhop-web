import React, { useState, useEffect } from 'react';
import { FiX, FiUsers, FiSend, FiInfo, FiAlertCircle } from 'react-icons/fi';
import { PoolsApi } from '../api/poolsApi';
import { useAuth } from '../hooks/useAuth';

const JoinPoolModal = ({ open, onClose, poolData, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [userProfile, setUserProfile] = useState({
    preferredActivities: [],
    preferredTerrains: [],
    experience: 'beginner'
  });
  const [newActivity, setNewActivity] = useState('');
  const [newTerrain, setNewTerrain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setMessage('');
      setUserProfile({ 
        preferredActivities: [],
        preferredTerrains: [],
        experience: 'beginner' 
      });
      setNewActivity('');
      setNewTerrain('');
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  const handleAddActivity = () => {
    if (newActivity.trim() && !userProfile.preferredActivities.includes(newActivity.trim())) {
      setUserProfile(prev => ({
        ...prev,
        preferredActivities: [...prev.preferredActivities, newActivity.trim()]
      }));
      setNewActivity('');
    }
  };

  const handleRemoveActivity = (activity) => {
    setUserProfile(prev => ({
      ...prev,
      preferredActivities: prev.preferredActivities.filter(a => a !== activity)
    }));
  };

  const handleAddTerrain = () => {
    if (newTerrain.trim() && !userProfile.preferredTerrains.includes(newTerrain.trim())) {
      setUserProfile(prev => ({
        ...prev,
        preferredTerrains: [...prev.preferredTerrains, newTerrain.trim()]
      }));
      setNewTerrain('');
    }
  };

  const handleRemoveTerrain = (terrain) => {
    setUserProfile(prev => ({
      ...prev,
      preferredTerrains: prev.preferredTerrains.filter(t => t !== terrain)
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
          nationality: user.nationality || null,
          preferredActivities: userProfile.preferredActivities,
          preferredTerrains: userProfile.preferredTerrains,
          travelExperience: userProfile.experience
        }
      };

      // Use the correct groupId from poolData structure
      const groupId = poolData?.groupInfo?.groupId || poolData?.id;
      if (!groupId) {
        throw new Error('Group ID not found in pool data');
      }

      const result = await PoolsApi.joinPool(groupId, joinData);
      
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
    <div className="fixed inset-0" style={{ zIndex: 1000 }}>
      <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-40">
        <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 p-6 relative max-h-[90vh] overflow-y-auto" style={{ zIndex: 1001 }}>
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <FiUsers className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Join Pool Request</h2>
          </div>
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
                  {poolData?.groupInfo?.groupName || poolData?.name || 'Pool Details'}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Destinations:</strong> {
                    poolData?.tripDetails?.dailyPlans?.map(day => day.city).join(', ') || 
                    poolData?.destination || 
                    'Sri Lanka'
                  }</p>
                  <p><strong>Duration:</strong> {
                    poolData?.tripDetails?.dailyPlans?.length ? 
                    `${poolData.tripDetails.dailyPlans.length} days` : 
                    poolData?.duration || 'N/A'
                  }</p>
                  <p><strong>Members:</strong> {
                    poolData?.groupInfo?.currentMembers || poolData?.members?.length || 0
                  }/{
                    poolData?.groupInfo?.maxMembers || poolData?.maxMembers || 'N/A'
                  }</p>
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
                <h5 className="font-medium text-gray-900">Your Travel Preferences (Optional)</h5>
                
                {/* Travel Experience */}
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

                {/* Preferred Activities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Activities
                  </label>
                  
                  {/* Quick select common activities */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['Hiking', 'Cultural Tours', 'Photography', 'Wildlife Watching', 'Beach Activities', 'Adventure Sports'].map(activity => (
                      <button
                        key={activity}
                        type="button"
                        onClick={() => {
                          if (!userProfile.preferredActivities.includes(activity)) {
                            setUserProfile(prev => ({
                              ...prev,
                              preferredActivities: [...prev.preferredActivities, activity]
                            }));
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          userProfile.preferredActivities.includes(activity)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {activity}
                      </button>
                    ))}
                  </div>

                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newActivity}
                      onChange={(e) => setNewActivity(e.target.value)}
                      placeholder="Add a custom activity"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddActivity()}
                    />
                    <button
                      type="button"
                      onClick={handleAddActivity}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Activity Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {userProfile.preferredActivities.map((activity, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center space-x-1"
                      >
                        <span>{activity}</span>
                        <button
                          onClick={() => handleRemoveActivity(activity)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preferred Terrains */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Terrains
                  </label>
                  
                  {/* Quick select common terrains */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['Mountains', 'Beaches', 'Forests', 'Cities', 'Countryside', 'Islands'].map(terrain => (
                      <button
                        key={terrain}
                        type="button"
                        onClick={() => {
                          if (!userProfile.preferredTerrains.includes(terrain)) {
                            setUserProfile(prev => ({
                              ...prev,
                              preferredTerrains: [...prev.preferredTerrains, terrain]
                            }));
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          userProfile.preferredTerrains.includes(terrain)
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {terrain}
                      </button>
                    ))}
                  </div>

                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newTerrain}
                      onChange={(e) => setNewTerrain(e.target.value)}
                      placeholder="Add a custom terrain"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTerrain()}
                    />
                    <button
                      type="button"
                      onClick={handleAddTerrain}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Terrain Tags */}
                  <div className="flex flex-wrap gap-2">
                    {userProfile.preferredTerrains.map((terrain, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center space-x-1"
                      >
                        <span>{terrain}</span>
                        <button
                          onClick={() => handleRemoveTerrain(terrain)}
                          className="text-green-600 hover:text-green-800"
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
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitJoinRequest}
                  disabled={loading || !message.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-sm font-medium transition-colors flex items-center justify-center space-x-2"
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
