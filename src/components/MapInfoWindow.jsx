import React, { useState } from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { Users, Share2 } from 'lucide-react';
import { getCityImageUrl, placeholderImage, logImageError } from '../utils/imageUtils';
import FellowTravelersModal from './FellowTravelersModal';

const MapInfoWindow = ({ selectedMarker, onClose }) => {
  const [showFellowTravelersModal, setShowFellowTravelersModal] = useState(false);
  
  if (!selectedMarker) return null;

  const handleSeeFellowTravelers = () => {
    setShowFellowTravelersModal(true);
  };

  const handleShareMyVisit = () => {
    // Add logic to make user's visit public
    console.log('Making visit public for:', selectedMarker.name, 'Day:', selectedMarker.dayNumber);
  };

  return (
    <>
      <InfoWindow
      position={{
        lat: selectedMarker.location.lat,
        lng: selectedMarker.location.lng
      }}
      onCloseClick={onClose}
    >
      <div className="max-w-xs">
        {/* Header */}
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 mb-1 leading-tight">{selectedMarker.name}</h3>
          <p className="text-sm text-gray-600 capitalize">{selectedMarker.type}</p>
        </div>
        
        {/* Image */}
        <div className="mb-3">
          <img 
            src={getCityImageUrl(selectedMarker.name || selectedMarker.location?.city || 'Sri Lanka')}
            alt={selectedMarker.name} 
            className="w-full h-32 object-cover rounded-lg shadow-sm"
            onError={(e) => {
              logImageError('ViewTripPage InfoWindow', selectedMarker, e.target.src);
              e.target.src = placeholderImage;
            }}
          />
        </div>
        
        {/* Details */}
        <div className="space-y-2">
          {selectedMarker.rating && (
            <div className="flex items-center">
              <span className="text-yellow-500 text-lg mr-1">★</span>
              <span className="font-medium text-gray-800">{selectedMarker.rating}</span>
              <span className="text-gray-500 text-sm ml-1">rating</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-blue-600">Day {selectedMarker.dayNumber}</span>
            </div>
            
            {selectedMarker.placeType && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedMarker.placeType === 'attraction' 
                  ? 'bg-blue-100 text-blue-800' 
                  : selectedMarker.placeType === 'hotel'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedMarker.placeType === 'attraction' ? 'Attraction' : 
                 selectedMarker.placeType === 'hotel' ? 'Hotel' : 'Restaurant'}
              </span>
            )}
          </div>
          
          {selectedMarker.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{selectedMarker.description}</p>
          )}
        </div>

        {/* Social Buttons */}
        <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
          <button 
            onClick={handleSeeFellowTravelers}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Users size={16} className="mr-2" />
            See Fellow Travelers
          </button>
          <button 
            onClick={handleShareMyVisit}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Share2 size={16} className="mr-2" />
            Share My Visit
          </button>
        </div>
      </div>
    </InfoWindow>

    {/* Fellow Travelers Modal */}
    <FellowTravelersModal
      isOpen={showFellowTravelersModal}
      onClose={() => setShowFellowTravelersModal(false)}
      location={selectedMarker.name}
      dayNumber={selectedMarker.dayNumber}
    />
  </>
  );
};

export default MapInfoWindow;
