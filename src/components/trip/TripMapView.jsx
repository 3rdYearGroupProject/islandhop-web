import React from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Users } from 'lucide-react';
import { GOOGLE_MAPS_LIBRARIES } from '../../utils/googleMapsConfig';

const TripMapView = ({ 
  dailyPlans, 
  mapCenter, 
  selectedMarker, 
  setSelectedMarker,
  setShowTravelersModal,
  setSelectedDestination,
  setSelectedLocationData 
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  const getMarkerIcon = (placeType) => {
    const iconBase = 'http://maps.google.com/mapfiles/ms/icons/';
    switch (placeType) {
      case 'attraction':
        return `${iconBase}blue-dot.png`;
      case 'restaurant':
        return `${iconBase}yellow-dot.png`;
      case 'hotel':
        return `${iconBase}orange-dot.png`;
      default:
        return `${iconBase}red-dot.png`;
    }
  };

  const handleNavigateToPlace = (location) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
    window.open(url, '_blank');
  };

  const handleImHere = (placeName, location) => {
    setSelectedDestination(placeName);
    setSelectedLocationData(location);
    setShowTravelersModal(true);
  };

  const handleSeeWhoElseIsComing = (destinationName, location) => {
    setSelectedDestination(destinationName);
    setSelectedLocationData(location);
    setShowTravelersModal(true);
  };

  return (
    <div className="w-full md:w-1/2 min-w-0 flex flex-col h-[calc(100vh-160px)] md:sticky top-32">
      <div className="bg-white rounded-xl w-full h-full shadow-lg border border-gray-200 overflow-hidden flex flex-col">
        {isLoaded ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-100 shrink-0">
              <h2 className="font-bold text-lg">Trip Map</h2>
              <p className="text-sm text-gray-500">Explore your trip destinations</p>
            </div>
            <div className="flex-1 min-h-[400px]">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%', minHeight: '400px' }}
                center={mapCenter}
                zoom={10}
                options={{
                  fullscreenControl: true,
                  streetViewControl: true,
                  mapTypeControl: true,
                  zoomControl: true,
                }}
              >
                {dailyPlans.flatMap(dayPlan => 
                  dayPlan.attractions?.map((attraction, index) => (
                    <Marker
                      key={`${attraction.name}-${index}`}
                      position={attraction.location}
                      onClick={() => {
                        const markerData = {
                          name: attraction.name,
                          location: attraction.location,
                          type: 'Attraction',
                          rating: attraction.rating,
                          description: attraction.description,
                          image: attraction.image,
                          dayNumber: dayPlan.day
                        };
                        setSelectedMarker(markerData);
                      }}
                      icon={getMarkerIcon('attraction')}
                      title={attraction.name}
                    />
                  )) || []
                )}
                {selectedMarker && (
                  <InfoWindow
                    position={selectedMarker.location}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="p-0 min-w-[280px] max-w-[320px]">
                      {/* Image */}
                      {selectedMarker.image && (
                        <div className="w-full h-32 mb-3 rounded-t-lg overflow-hidden">
                          <img
                            src={selectedMarker.image}
                            alt={selectedMarker.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="px-3 pb-3">
                        <h3 className="font-bold text-lg mb-1">{selectedMarker.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{selectedMarker.type}</p>
                        
                        {selectedMarker.description && (
                          <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                            {selectedMarker.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mb-3">
                          {selectedMarker.rating && (
                            <div className="flex items-center">
                              <span className="text-yellow-500 text-base">★</span>
                              <span className="ml-1 text-sm font-medium">{selectedMarker.rating}</span>
                              <span className="ml-1 text-xs text-gray-500">/5</span>
                            </div>
                          )}
                          <div className="text-sm">
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                              Day {selectedMarker.dayNumber}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleNavigateToPlace(selectedMarker.location)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                              </svg>
                              Navigate
                            </button>
                            
                          </div>
                          <button
                            onClick={() => handleSeeWhoElseIsComing(selectedMarker.name, selectedMarker.location)}
                            className="w-full bg-blue-800 hover:bg-blue-900 text-white text-sm px-3 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <Users className="w-4 h-4" />
                            See who else is coming
                          </button>
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
            <div className="p-3 border-t border-gray-100 shrink-0">
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-xs">Attractions</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                  <span className="text-xs">Hotels</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-xs">Restaurants</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="font-medium">Loading Map...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripMapView;
