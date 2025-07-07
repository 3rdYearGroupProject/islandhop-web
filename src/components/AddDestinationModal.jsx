import React from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';

console.log('AddDestinationModal loaded');

const AddDestinationModal = ({
  show,
  onClose,
  searchQuery,
  setSearchQuery,
  getFilteredSuggestions,
  dayIndex,
  formatDate,
  addItemToItinerary
}) => {
  console.log('AddDestinationModal props', {
    show,
    searchQuery,
    selectedStayDates,
    days
  });
  if (!show) return null;
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
          <p className="text-gray-600 mt-2">Choose a city or region to stay for this day.</p>
          <div className="mt-4 flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search cities and regions in Sri Lanka..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 focus:ring-0 text-sm placeholder-gray-400"
            />
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getFilteredSuggestions().map((city) => (
              <div key={city.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                <div className="relative">
                  <img 
                    src={city.image} 
                    alt={city.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-medium text-gray-900">
                    {city.accommodations} hotels
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{city.name}</h4>
                      <p className="text-sm text-gray-500">{city.region}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">from</p>
                      <p className="text-lg font-bold text-primary-600">{city.averagePrice}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{city.description}</p>
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
          {getFilteredSuggestions().length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No cities found</p>
              <p>Try searching for a different destination.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddDestinationModal;
