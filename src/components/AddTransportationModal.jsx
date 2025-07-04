import React from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';

const AddTransportationModal = ({
  show,
  onClose,
  searchQuery,
  setSearchQuery,
  getFilteredSuggestions,
  selectedStayDates,
  setSelectedStayDates,
  days,
  formatDate,
  addItemToItinerary
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Add Transportation</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mt-2">Choose a transportation option, then select which days you'll need it.</p>
          <div className="mt-4 flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search transportation options..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 focus:ring-0 text-sm placeholder-gray-400"
            />
          </div>
        </div>
        <div className="flex">
          {/* Left Side - Transportation Selection */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getFilteredSuggestions().map((transport) => (
                <div key={transport.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                  <div className="relative">
                    <img 
                      src={transport.image} 
                      alt={transport.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-medium text-gray-900">
                      {transport.type}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">{transport.name}</h4>
                        <p className="text-sm text-gray-500">{transport.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">from</p>
                        <p className="text-lg font-bold text-primary-600">{transport.price}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{transport.description}</p>
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">FEATURES</p>
                      <div className="flex flex-wrap gap-1">
                        {transport.features && transport.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                        {transport.features && transport.features.length > 3 && (
                          <span className="text-xs text-gray-500">+{transport.features.length - 3} more</span>
                        )}
                        {transport.rating && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            ★ {transport.rating}
                          </span>
                        )}
                        {transport.reviews && (
                          <span className="text-xs text-gray-500">({transport.reviews} reviews)</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => addItemToItinerary(transport, selectedStayDates)}
                      disabled={selectedStayDates.length === 0}
                      className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {selectedStayDates.length === 0 ? 'Select dates first' : `Add to ${selectedStayDates.length} day${selectedStayDates.length !== 1 ? 's' : ''}`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {getFilteredSuggestions().length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No transportation found</p>
                <p>Try searching for a different transportation option.</p>
              </div>
            )}
          </div>
          {/* Right Side - Calendar */}
          <div className="w-80 bg-gradient-to-b from-primary-50 to-white border-l border-gray-200 p-6">
            <div className="sticky top-0">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Select travel dates</h4>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Choose which days you'll need this transportation. You can select multiple consecutive or separate days.
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

export default AddTransportationModal;
