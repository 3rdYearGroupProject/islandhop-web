import React, { useState } from 'react';
import { X, Share2, Users, Globe, MessageCircle, Calendar } from 'lucide-react';

const FellowTravelersModal = ({ isOpen, onClose, location, dayNumber }) => {
  // Mock data for fellow travelers - replace with real API data
  const [fellowTravelers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      age: 28,
      nationality: "🇺🇸 United States",
      languages: ["English", "Spanish"],
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      isPublic: true,
      groupSize: 2,
      visitTime: "Morning (9-12 PM)"
    },
    {
      id: 2,
      name: "Marco Rodriguez",
      age: 32,
      nationality: "🇪🇸 Spain",
      languages: ["Spanish", "English", "French"],
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      isPublic: true,
      groupSize: 1,
      visitTime: "Afternoon (2-5 PM)"
    },
    {
      id: 3,
      name: "Yuki Tanaka",
      age: 25,
      nationality: "🇯🇵 Japan",
      languages: ["Japanese", "English"],
      profileImage: "https://images.unsplash.com/photo-1507101105822-7472b28e22ac?w=150&h=150&fit=crop&crop=face",
      isPublic: false,
      groupSize: 3,
      visitTime: "Evening (5-8 PM)"
    }
  ]);

  const [showShareMyVisit, setShowShareMyVisit] = useState(false);

  if (!isOpen) return null;

  const handleShareMyVisit = () => {
    setShowShareMyVisit(true);
    // Add logic to make user's visit public
    console.log('Making visit public for:', location, 'Day:', dayNumber);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 pt-20">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Fellow Travelers</h2>
            <p className="text-sm text-gray-600">
              {location} • Day {dayNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Share My Visit Section */}
          {!showShareMyVisit ? (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-900">Make yourself visible</h3>
                  <p className="text-sm text-blue-700">Let other travelers know you'll be here</p>
                </div>
                <button
                  onClick={handleShareMyVisit}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
                >
                  <Share2 size={16} className="mr-2" />
                  Share My Visit
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <h3 className="font-medium text-green-900">Your visit is now public!</h3>
                  <p className="text-sm text-green-700">Other travelers can now see you'll be here</p>
                </div>
              </div>
            </div>
          )}

          {/* Fellow Travelers List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Users size={18} className="mr-2" />
              Travelers visiting on Day {dayNumber}
            </h3>
            
            {fellowTravelers.map((traveler) => (
              <div key={traveler.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Profile Image */}
                  <img
                    src={traveler.profileImage}
                    alt={traveler.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  
                  {/* Traveler Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{traveler.name}</h4>
                      <span className="text-sm text-gray-500">Age {traveler.age}</span>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Nationality */}
                      <div className="flex items-center text-sm">
                        <Globe size={14} className="mr-2 text-gray-400" />
                        <span className="text-gray-600">{traveler.nationality}</span>
                      </div>
                      
                      {/* Languages */}
                      <div className="flex items-center text-sm">
                        <MessageCircle size={14} className="mr-2 text-gray-400" />
                        <span className="text-gray-600">
                          Speaks: {traveler.languages.join(', ')}
                        </span>
                      </div>
                      
                      {/* Visit Time & Group Size */}
                      <div className="flex items-center text-sm">
                        <Calendar size={14} className="mr-2 text-gray-400" />
                        <span className="text-gray-600">
                          {traveler.visitTime} • Group of {traveler.groupSize}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {fellowTravelers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No fellow travelers found for this location on Day {dayNumber}</p>
                <p className="text-sm mt-2">Be the first to share your visit!</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Main Join Button */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          {fellowTravelers.length > 0 ? (
            <div className="flex gap-3">
              <button
                onClick={() => console.log('Joining fellow travelers group')}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
              >
                <Users size={18} className="mr-2" />
                Join Fellow Travelers
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FellowTravelersModal;
