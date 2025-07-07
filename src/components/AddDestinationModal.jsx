import React from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';

const AddDestinationModal = ({
  show,
  onClose,
  searchQuery,
  setSearchQuery,
  getFilteredSuggestions,
  dayIndex,
  formatDate,
  addItemToItinerary,
  isSearchingCities
}) => {
  if (!show) return null;

  const cities = getFilteredSuggestions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Add Destination</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mt-2">Choose a city or region in Sri Lanka for your destination.</p>
          <div className="mt-4 flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search cities in Sri Lanka..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 focus:ring-0 text-sm placeholder-gray-400"
            />
            {isSearchingCities && (
              <div className="ml-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              </div>
            )}
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cities.map((city) => (
              <div key={city.id || city.place_id || city.name} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                <div className="relative">
                  <img 
                    src={city.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'} 
                    alt={city.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{city.name}</h4>
                      <p className="text-sm text-gray-500">
                        {city.address || city.region || 'Sri Lanka'}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {city.description || `Explore the beautiful city of ${city.name} in Sri Lanka.`}
                  </p>
                  {city.highlights && city.highlights.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">TOP HIGHLIGHTS</p>
                      <div className="flex flex-wrap gap-1">
                        {city.highlights.slice(0, 3).map((highlight, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {highlight}
                          </span>
                        ))}
                        {city.highlights.length > 3 && (
                          <span className="text-xs text-gray-500">+{city.highlights.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => addItemToItinerary(city, [dayIndex])}
                    className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Add to this day
                  </button>
                </div>
              </div>
            ))}
          </div>
          {cities.length === 0 && !isSearchingCities && (
            <div className="text-center py-12 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No cities found</p>
              <p>Try searching for a different destination in Sri Lanka.</p>
            </div>
          )}
          {isSearchingCities && (
            <div className="text-center py-12 text-gray-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium">Searching cities...</p>
              <p>Finding the best destinations in Sri Lanka for you.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddDestinationModal;
