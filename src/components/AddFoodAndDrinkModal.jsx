import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star } from 'lucide-react';

console.log('AddFoodAndDrinkModal loaded');

const AddFoodAndDrinkModal = ({
  show,
  onClose,
  searchQuery,
  setSearchQuery,
  fetchSuggestionsForModal,
  days,
  formatDate,
  addItemToItinerary,
  isLoading = false,
  tripId,
  currentDay
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  console.log('AddFoodAndDrinkModal props', {
    show,
    searchQuery,
    days,
    currentDay
  });

  // Effect to prevent body scroll when modal is open
  useEffect(() => {
    if (show) {
      // Prevent body scroll - more robust for mobile
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore body scroll
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [show]);

  // Effect to fetch suggestions when modal opens
  useEffect(() => {
    if (!show || !fetchSuggestionsForModal) return;

    const fetchData = async () => {
      setIsLoadingSuggestions(true);
      try {
        console.log('🔍 AddFoodAndDrinkModal: Fetching suggestions for currentDay:', currentDay);
        const result = await fetchSuggestionsForModal('food', currentDay);
        
        // Ensure we always have an array
        const validSuggestions = Array.isArray(result) ? result : [];
        console.log('📋 AddFoodAndDrinkModal: Got suggestions:', validSuggestions.length, 'items');
        setSuggestions(validSuggestions);
      } catch (error) {
        console.error('❌ AddFoodAndDrinkModal: Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchData();
  }, [show, currentDay, fetchSuggestionsForModal]);

  // Effect to filter suggestions when search query changes
  useEffect(() => {
    if (!searchQuery) return;
    
    // Filter existing suggestions based on search query
    const fetchData = async () => {
      setIsLoadingSuggestions(true);
      try {
        const result = await fetchSuggestionsForModal('food', currentDay);
        const validSuggestions = Array.isArray(result) ? result : [];
        
        // Filter suggestions based on search query
        const filtered = validSuggestions.filter(item =>
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setSuggestions(filtered);
      } catch (error) {
        console.error('❌ Error filtering suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchData, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentDay, fetchSuggestionsForModal]);

  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Add Dining</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mt-2">Choose a dining experience for Day {currentDay + 1} of your trip.</p>
          <div className="mt-4 flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search restaurants and dining experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 focus:ring-0 text-sm placeholder-gray-400"
            />
          </div>
        </div>
        {/* Full Width - Dining Selection */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
            {(isLoading || isLoadingSuggestions) ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Searching for dining options...</p>
                </div>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">
                  {tripId ? "No dining options found" : "Ready to search"}
                </p>
                <p>
                  {tripId ? "Try searching for a different restaurant or cuisine." : "Use the search box above to find restaurants."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {suggestions.map((dining) => (
                  <div key={dining.id} className={`border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col ${dining.isRecommended ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
                    {dining.isRecommended && (
                      <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 text-center">
                        ⭐ RECOMMENDED
                      </div>
                    )}
                    <div className="relative">
                      <img 
                        src={dining.image || dining.photos?.[0]?.url || 'https://via.placeholder.com/400x300'} 
                        alt={dining.name || dining.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-medium text-gray-900">
                        {dining.cuisine || dining.type || dining.category || 'Restaurant'}
                      </div>
                      {dining.distanceKm && (
                        <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 text-sm font-medium text-gray-900">
                          {dining.distanceKm.toFixed(1)} km away
                        </div>
                      )}
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white rounded px-2 py-1">
                        <p className="text-xs font-bold">{dining.price || dining.priceRange || 'Contact'}</p>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900">{dining.name || dining.title}</h4>
                          <p className="text-sm text-gray-500 hidden md:block">{dining.location || dining.address}</p>
                          {dining.isOpenNow !== undefined && (
                            <p className={`text-xs font-medium mt-1 ${dining.isOpenNow ? 'text-green-600' : 'text-red-600'}`}>
                              {dining.isOpenNow ? '🟢 Open Now' : '🔴 Closed'}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{dining.description}</p>
                      <div className="mb-4 flex-grow">
                        <p className="text-xs font-medium text-gray-500 mb-2">SPECIALTIES</p>
                        <div className="flex flex-wrap gap-1">
                          {(dining.cuisine || dining.category) && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {dining.cuisine || dining.category}
                            </span>
                          )}
                          {dining.rating && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {dining.rating}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">({dining.reviews || 0} reviews)</span>
                        </div>
                      </div>
                      <button
                        onClick={() => addItemToItinerary(dining, [currentDay])}
                        className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium mt-auto"
                      >
                        Add to Day {currentDay + 1}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AddFoodAndDrinkModal;
