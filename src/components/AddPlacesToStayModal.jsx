import React from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';

const AddPlacesToStayModal = ({
  show,
  onClose,
  searchQuery,
  setSearchQuery,
  getFilteredSuggestions,
  selectedStayDates,
  setSelectedStayDates,
  days,
  formatDate,
  addItemToItinerary,
  isLoading = false,
  tripId
}) => {
  if (!show) return null;

  const suggestions = getFilteredSuggestions();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Add Places to Stay</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mt-2">Choose a place to stay, then select which days you'll be staying there.</p>
          <div className="mt-4 flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search hotels and accommodations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 focus:ring-0 text-sm placeholder-gray-400"
            />
          </div>
        </div>
        <div className="flex">
          {/* Left Side - Place Selection */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Searching for accommodations...</p>
                </div>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">
                  {tripId ? "No places found" : "Ready to search"}
                </p>
                <p>
                  {tripId ? "Try searching for a different accommodation." : "Use the search box above to find places to stay."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((place) => (
                  <div key={place.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                    <div className="relative">
                      <img 
                        src={place.image || place.photos?.[0]?.url || 'https://placehold.co/400x250'} 
                        alt={place.name || place.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-medium text-gray-900">
                        {place.type || place.category || 'Hotel'}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900">{place.name || place.title}</h4>
                          <p className="text-sm text-gray-500">{place.location || place.address}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">from</p>
                          <p className="text-lg font-bold text-primary-600">{place.price || place.priceRange || 'Contact'}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{place.description}</p>
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 mb-2">AMENITIES</p>
                        <div className="flex flex-wrap gap-1">
                          {place.priceRange && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {place.priceRange}
                            </span>
                          )}
                          {place.rating && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              ★ {place.rating}
                            </span>
                          )}
                          {place.reviews && (
                            <span className="text-xs text-gray-500">({place.reviews} reviews)</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => addItemToItinerary(place, selectedStayDates)}
                        disabled={selectedStayDates.length === 0}
                        className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {selectedStayDates.length === 0 ? 'Select dates first' : `Add to ${selectedStayDates.length} day${selectedStayDates.length !== 1 ? 's' : ''}`}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Right Side - Calendar */}
          <div className="w-80 bg-gradient-to-b from-primary-50 to-white border-l border-gray-200 p-6">
            <div className="sticky top-0">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Select check-in dates</h4>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Choose which days you'll be staying at this place. You can select multiple consecutive or separate days.
              </p>
              {selectedStayDates.length > 0 && (
                <div className="mb-6 p-4 bg-primary-100 border border-primary-200 rounded-xl">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-primary-600 rounded-full mr-2"></div>
                    <p className="text-sm font-semibold text-primary-800">
                      {selectedStayDates.length} day{selectedStayDates.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                  <div className="text-xs text-primary-700">
                    {selectedStayDates.map(dayIndex => formatDate(days[dayIndex])).join(', ')}
                  </div>
                </div>
              )}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {days.map((day, dayIndex) => (
                  <button
                    key={dayIndex}
                    onClick={() => setSelectedStayDates(prev => prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex].sort((a, b) => a - b))}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                      selectedStayDates.includes(dayIndex)
                        ? 'bg-primary-600 text-white border-primary-600 shadow-lg'
                        : 'bg-white border-gray-200 hover:border-primary-300 text-gray-900 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">
                          {formatDate(day)}
                        </div>
                        <div className={`text-xs ${
                          selectedStayDates.includes(dayIndex) ? 'text-primary-100' : 'text-gray-500'
                        }`}>
                          Day {dayIndex + 1} of your trip
                        </div>
                      </div>
                      {selectedStayDates.includes(dayIndex) && (
                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-300">
                <button
                  onClick={() => setSelectedStayDates([])}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                  disabled={selectedStayDates.length === 0}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear all selections
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlacesToStayModal;
