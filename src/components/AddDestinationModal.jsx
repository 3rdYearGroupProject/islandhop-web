import React, { useMemo, useState } from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';
import { tripPlanningApi } from '../api/axios';

const HARDCODED_CITIES = [
  {
    id: 1,
    name: 'Colombo',
    region: 'Western Province',
    description: 'The bustling commercial capital of Sri Lanka, known for its colonial heritage and vibrant city life.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop',
    highlights: ['Galle Face Green', 'Gangaramaya Temple', 'Pettah Market']
  },
  {
    id: 2,
    name: 'Kandy',
    region: 'Central Province',
    description: 'A scenic city surrounded by mountains, famous for the Temple of the Tooth and its cultural significance.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&fit=crop',
    highlights: ['Temple of the Tooth', 'Kandy Lake', 'Royal Botanical Gardens']
  },
  {
    id: 3,
    name: 'Galle',
    region: 'Southern Province',
    description: 'A historic city on the southwest coast, known for its Dutch Fort and beautiful beaches.',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=300&fit=crop',
    highlights: ['Galle Fort', 'Unawatuna Beach', 'Jungle Beach']
  },
  {
    id: 4,
    name: 'Sigiriya',
    region: 'Central Province',
    description: 'Home to the ancient rock fortress and UNESCO World Heritage Site, Sigiriya.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=300&fit=crop',
    highlights: ['Sigiriya Rock', 'Pidurangala Rock', 'Frescoes']
  },
  {
    id: 5,
    name: 'Nuwara Eliya',
    region: 'Central Province',
    description: 'A cool-climate city in the heart of Sri Lanka’s tea country, known as Little England.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop',
    highlights: ['Tea Plantations', 'Gregory Lake', 'Horton Plains']
  },
  {
    id: 6,
    name: 'Jaffna',
    region: 'Northern Province',
    description: 'A culturally rich city in the north, famous for its unique cuisine and historic sites.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop',
    highlights: ['Jaffna Fort', 'Nallur Kandaswamy Temple', 'Casuarina Beach']
  },
  // Add more cities as needed
];

const AddDestinationModal = ({
  show,
  onClose,
  searchQuery,
  setSearchQuery,
  dayIndex,
  formatDate,
  addItemToItinerary,
  isSearchingCities,
  // New props for backend integration
  tripId,
  userUid,
  startDate
}) => {
  // Early return BEFORE any hooks to prevent hook order issues
  if (!show) return null;
  
  const [loadingCities, setLoadingCities] = useState({}); // Track loading state per city

  // Calculate day number based on dayIndex and startDate
  const calculateDayNumber = (dayIndex, startDate) => {
    // dayIndex is 0-based, day number is 1-based
    return dayIndex + 1;
  };

  // Function to add city to backend
  const addCityToBackend = async (cityName, dayIndex) => {
    if (!tripId || !userUid || !startDate) {
      console.error('❌ Missing required data for backend API:', { tripId, userUid, startDate });
      alert('Missing trip information. Please try again.');
      return false;
    }

    const dayNumber = calculateDayNumber(dayIndex, startDate);
    const cityKey = `${cityName}-${dayIndex}`;
    
    try {
      setLoadingCities(prev => ({ ...prev, [cityKey]: true }));
      
      console.log('🏙️ Adding city to backend:', {
        tripId,
        dayNumber,
        cityName,
        userUid
      });

      const response = await tripPlanningApi.post(
        `/itinerary/${tripId}/day/${dayNumber}/city`,
        {
          userId: userUid,
          city: cityName
        }
      );

      console.log('✅ City added successfully:', response.data);
      
      if (response.data.status === 'success') {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to add city');
      }
    } catch (error) {
      console.error('❌ Error adding city to backend:', error);
      
      let errorMessage = 'Failed to add city to trip';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error: ${errorMessage}`);
      return false;
    } finally {
      setLoadingCities(prev => ({ ...prev, [cityKey]: false }));
    }
  };

  // Enhanced addItemToItinerary function that calls backend first
  const handleAddCityToItinerary = async (city, selectedDates) => {
    console.log('🚀 Adding city to itinerary:', { city: city.name, dayIndex, selectedDates });
    
    // First, try to add to backend
    const backendSuccess = await addCityToBackend(city.name, dayIndex);
    
    if (backendSuccess) {
      // If backend succeeds, add to local state
      console.log('✅ Backend update successful, updating local state');
      addItemToItinerary(city, selectedDates);
    }
    // Note: If backend fails, we don't update local state
  };

  // Filter the hardcoded cities array by search query
  const filteredCities = useMemo(() => {
    if (!searchQuery) return HARDCODED_CITIES;
    return HARDCODED_CITIES.filter(city =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (city.region && city.region.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCities.map((city) => (
              <div key={city.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
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
                    onClick={() => handleAddCityToItinerary(city, [dayIndex])}
                    disabled={loadingCities[`${city.name}-${dayIndex}`]}
                    className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loadingCities[`${city.name}-${dayIndex}`] ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      'Add to this day'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filteredCities.length === 0 && !isSearchingCities && (
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
