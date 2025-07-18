import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const TripDetailsModal = ({ isOpen, onClose, tripDetails }) => {
  const [expandedDays, setExpandedDays] = useState({});
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 7.8731, lng: 80.7718 }); // Default to Sri Lanka

  if (!isOpen) return null;

  const toggleDayExpansion = (dayIndex) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayIndex]: !prev[dayIndex],
    }));
  };

  const handleMarkerClick = (place) => {
    setSelectedMarker(place);
    if (place.location) {
      setMapCenter({
        lat: place.location.lat,
        lng: place.location.lng,
      });
    }
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-6xl h-[90vh] overflow-y-auto flex relative">
        {/* Left: Itinerary Section */}
        <div className="w-1/2 pr-4 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="sticky top-0 z-20 bg-white pb-2 pt-1">
            <h2 className="text-xl font-bold">Trip Itinerary</h2>
          </div>
          {/* Vertical Timeline Mock Itinerary */}
          <div className="relative ml-6">
            {/* Timeline line */}
            <div className="absolute left-0 top-0 h-full w-1 bg-gray-200" style={{ zIndex: 0 }}></div>
            {/* Timeline days */}
            <div className="space-y-8 relative z-10">
              {/* Day 1 */}
              <div className="relative">
                <div className="flex items-center mb-2 -ml-6">
                  <div className="bg-white border-4 border-primary-600 w-6 h-6 rounded-full z-10"></div>
                  <h3 className="ml-4 font-semibold text-primary-700 text-lg">Day 1 - Colombo</h3>
                </div>
                <div className="ml-8 mt-2 space-y-2">
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Arrival in Colombo</span>
                      <span className="text-gray-500 text-sm">14:00</span>
                    </div>
                    <div className="text-sm text-gray-600">Airport pickup and transfer to hotel</div>
                  </div>
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Colombo City Tour</span>
                      <span className="text-gray-500 text-sm">16:30</span>
                    </div>
                    <div className="text-sm text-gray-600">Explore the bustling capital city</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Dinner at Ministry of Crab</span>
                      <span className="text-gray-500 text-sm">19:30</span>
                    </div>
                    <div className="text-sm text-gray-600">World-renowned restaurant specializing in Sri Lankan crab</div>
                  </div>
                </div>
              </div>
              {/* Day 2 */}
              <div className="relative">
                <div className="flex items-center mb-2 -ml-6">
                  <div className="bg-white border-4 border-primary-600 w-6 h-6 rounded-full z-10"></div>
                  <h3 className="ml-4 font-semibold text-primary-700 text-lg">Day 2 - Kandy</h3>
                </div>
                <div className="ml-8 mt-2 space-y-2">
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Temple of the Sacred Tooth</span>
                      <span className="text-gray-500 text-sm">10:00</span>
                    </div>
                    <div className="text-sm text-gray-600">Visit the most sacred Buddhist temple in Sri Lanka</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Lunch at The Empire Cafe</span>
                      <span className="text-gray-500 text-sm">12:30</span>
                    </div>
                    <div className="text-sm text-gray-600">Cozy cafe with mountain views</div>
                  </div>
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Kandy Lake Walk</span>
                      <span className="text-gray-500 text-sm">17:00</span>
                    </div>
                    <div className="text-sm text-gray-600">Peaceful walk around the scenic Kandy Lake</div>
                  </div>
                </div>
              </div>
              {/* Day 3 */}
              <div className="relative">
                <div className="flex items-center mb-2 -ml-6">
                  <div className="bg-white border-4 border-primary-600 w-6 h-6 rounded-full z-10"></div>
                  <h3 className="ml-4 font-semibold text-primary-700 text-lg">Day 3 - Ella</h3>
                </div>
                <div className="ml-8 mt-2 space-y-2">
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Nine Arches Bridge</span>
                      <span className="text-gray-500 text-sm">09:00</span>
                    </div>
                    <div className="text-sm text-gray-600">Iconic railway bridge with stunning views</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Cafe Chill</span>
                      <span className="text-gray-500 text-sm">12:00</span>
                    </div>
                    <div className="text-sm text-gray-600">Popular local spot with amazing views</div>
                  </div>
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Little Adams Peak Hike</span>
                      <span className="text-gray-500 text-sm">14:00</span>
                    </div>
                    <div className="text-sm text-gray-600">Moderate hike with panoramic views</div>
                  </div>
                </div>
              </div>
              {/* Day 4 */}
              <div className="relative">
                <div className="flex items-center mb-2 -ml-6">
                  <div className="bg-white border-4 border-primary-600 w-6 h-6 rounded-full z-10"></div>
                  <h3 className="ml-4 font-semibold text-primary-700 text-lg">Day 4 - Galle</h3>
                </div>
                <div className="ml-8 mt-2 space-y-2">
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Galle Fort Exploration</span>
                      <span className="text-gray-500 text-sm">10:00</span>
                    </div>
                    <div className="text-sm text-gray-600">Explore the historic Dutch colonial fort</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Pedlar's Inn Cafe</span>
                      <span className="text-gray-500 text-sm">13:00</span>
                    </div>
                    <div className="text-sm text-gray-600">Historic cafe within the fort walls</div>
                  </div>
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Unawatuna Beach</span>
                      <span className="text-gray-500 text-sm">14:00</span>
                    </div>
                    <div className="text-sm text-gray-600">Relax on one of Sri Lanka's most beautiful beaches</div>
                  </div>
                </div>
              </div>
              {/* Day 5 */}
              <div className="relative">
                <div className="flex items-center mb-2 -ml-6">
                  <div className="bg-white border-4 border-primary-600 w-6 h-6 rounded-full z-10"></div>
                  <h3 className="ml-4 font-semibold text-primary-700 text-lg">Day 5 - Mirissa & Departure</h3>
                </div>
                <div className="ml-8 mt-2 space-y-2">
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Whale Watching</span>
                      <span className="text-gray-500 text-sm">06:30</span>
                    </div>
                    <div className="text-sm text-gray-600">Spot blue whales and dolphins in their natural habitat</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Lunch at Coconut Tree Hill Restaurant</span>
                      <span className="text-gray-500 text-sm">12:00</span>
                    </div>
                    <div className="text-sm text-gray-600">Beachfront dining with fresh seafood</div>
                  </div>
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Departure</span>
                      <span className="text-gray-500 text-sm">15:00</span>
                    </div>
                    <div className="text-sm text-gray-600">Transfer to airport for departure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Map Section */}
        <div className="w-1/2" style={{ height: '77.5vh' }}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={mapCenter}
            zoom={10}
          >
            {tripDetails.itinerary && Object.values(tripDetails.itinerary).flatMap((day) => day.activities).map((activity, index) => (
              <Marker
                key={index}
                position={{
                  lat: activity.location.lat,
                  lng: activity.location.lng,
                }}
                onClick={() => handleMarkerClick(activity)}
              />
            ))}
            {selectedMarker && (
              <InfoWindow
                position={{
                  lat: selectedMarker.location.lat,
                  lng: selectedMarker.location.lng,
                }}
                onCloseClick={handleInfoWindowClose}
              >
                <div>
                  <h4 className="font-bold">{selectedMarker.name}</h4>
                  <p className="text-sm">{selectedMarker.description}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Accept Button bottom right (inside modal container) */}
        <button
          onClick={() => {/* handle accept logic here */}}
          className="absolute bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-full shadow-lg z-30"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default TripDetailsModal;