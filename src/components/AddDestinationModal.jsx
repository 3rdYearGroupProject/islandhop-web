import React, { useMemo, useState } from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';
import { tripPlanningApi } from '../api/axios';

const HARDCODED_CITIES = [  {
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
    name: 'Nuwara Eliya',
    region: 'Central Province',
    description: 'A cool-climate city in the heart of Sri Lanka’s tea country, known as Little England.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop',
    highlights: ['Tea Plantations', 'Gregory Lake', 'Horton Plains']
  },
  {
    id: 5,
    name: 'Anuradhapura',
    region: 'North Central Province',
    description: 'An ancient city and UNESCO World Heritage Site, known for its well-preserved ruins and sacred sites.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop',
    highlights: ['Sri Maha Bodhi', 'Ruwanwelisaya', 'Jetavanaramaya']
  },
  {
    id: 6,
    name: 'Sigiriya',
    region: 'Central Province',
    description: 'Home to the ancient rock fortress and UNESCO World Heritage Site, Sigiriya.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=300&fit=crop',
    highlights: ['Sigiriya Rock', 'Pidurangala Rock', 'Frescoes']
  },
  {
    id: 7,
    name: 'Ella',
    region: 'Uva Province',
    description: 'A small town with stunning views, popular for hiking and its relaxed atmosphere.',
    image: 'https://images.unsplash.com/photo-1517816428104-380fd9864b1b?w=400&h=300&fit=crop',
    highlights: ['Ella Rock', 'Nine Arch Bridge', 'Little Adam’s Peak']
  },
  {
    id: 8,
    name: 'Mirissa',
    region: 'Southern Province',
    description: 'A beautiful beach destination known for whale watching and vibrant nightlife.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    highlights: ['Mirissa Beach', 'Whale Watching', 'Coconut Tree Hill']
  },
  {
    id: 9,
    name: 'Jaffna',
    region: 'Northern Province',
    description: 'A culturally rich city in the north, famous for its unique cuisine and historic sites.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop',
    highlights: ['Jaffna Fort', 'Nallur Kandaswamy Temple', 'Casuarina Beach']
  },
  {
    id: 10,
    name: 'Negombo',
    region: 'Western Province',
    description: 'A coastal city known for its fishing industry and vibrant lagoon.',
    image: 'https://images.unsplash.com/photo-1508921912187-0e8a8e7c67f2?w=400&h=300&fit=crop',
    highlights: ['Negombo Lagoon', 'Fish Market', 'Dutch Fort']
  },
  {
    id: 11,
    name: 'Trincomalee',
    region: 'Eastern Province',
    description: 'A port city with beautiful beaches and historic temples on the east coast.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    highlights: ['Nilaveli Beach', 'Koneswaram Temple', 'Fort Frederick']
  },
  {
    id: 12,
    name: 'Batticaloa',
    region: 'Eastern Province',
    description: 'Known for its singing fish and scenic lagoons, a hidden gem in the east.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop',
    highlights: ['Batticaloa Lagoon', 'Kallady Bridge', 'Fort Batticaloa']
  },
  {
    id: 13,
    name: 'Ratnapura',
    region: 'Sabaragamuwa Province',
    description: 'The city of gems, famous for its gem mining and lush rainforests.',
    image: 'https://images.unsplash.com/photo-1469474968028-5663c0c8e537?w=400&h=300&fit=crop',
    highlights: ['Gem Museum', 'Maha Saman Devalaya', 'Sinharaja Forest']
  },
  {
    id: 14,
    name: 'Matara',
    region: 'Southern Province',
    description: 'A coastal city with historic charm and beautiful beaches.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    highlights: ['Polhena Beach', 'Matara Fort', 'Weherahena Temple']
  },
  {
    id: 15,
    name: 'Badulla',
    region: 'Uva Province',
    description: 'A gateway to the hill country, known for its waterfalls and tea estates.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop',
    highlights: ['Dunhinda Falls', 'Muthiyangana Temple', 'Bogoda Bridge']
  },
  {
    id: 16,
    name: 'Polonnaruwa',
    region: 'North Central Province',
    description: 'An ancient city with well-preserved ruins, a UNESCO World Heritage Site.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=300&fit=crop',
    highlights: ['Gal Vihara', 'Parakrama Samudra', 'Royal Palace']
  },
  {
    id: 17,
    name: 'Kurunegala',
    region: 'North Western Province',
    description: 'A historic city surrounded by rock formations and ancient temples.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop',
    highlights: ['Athugala Rock', 'Ridi Viharaya', 'Yapahuwa Rock Fortress']
  },
  {
    id: 18,
    name: 'Kalutara',
    region: 'Western Province',
    description: 'A coastal city with a prominent Buddhist temple and serene beaches.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    highlights: ['Kalutara Bodhiya', 'Richmond Castle', 'Kalutara Beach']
  },
  {
    id: 19,
    name: 'Hambantota',
    region: 'Southern Province',
    description: 'A developing city with wildlife attractions and beautiful beaches.',
    image: 'https://images.unsplash.com/photo-1517816428104-380fd9864b1b?w=400&h=300&fit=crop',
    highlights: ['Yala National Park', 'Bundala National Park', 'Hambantota Beach']
  },
  {
    id: 20,
    name: 'Dambulla',
    region: 'Central Province',
    description: 'Known for its ancient cave temples and vibrant wholesale markets.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=300&fit=crop',
    highlights: ['Dambulla Cave Temple', 'Golden Temple', 'Minneriya National Park']
  },
  {
    id: 21,
    name: 'Matale',
    region: 'Central Province',
    description: 'A city known for its spice gardens and historical temples.',
    image: 'https://images.unsplash.com/photo-1469474968028-5663c0c8e537?w=400&h=300&fit=crop',
    highlights: ['Aluvihara Rock Temple', 'Spice Gardens', 'Sembuwatta Lake']
  },
  {
    id: 22,
    name: 'Ampara',
    region: 'Eastern Province',
    description: 'A coastal district with serene beaches and wildlife reserves.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    highlights: ['Arugam Bay', 'Lahugala Kitulana National Park', 'Kumana National Park']
  },
  {
    id: 23,
    name: 'Mannar',
    region: 'Northern Province',
    description: 'An island city with historical significance and unique ecosystems.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop',
    highlights: ['Mannar Fort', 'Adam’s Bridge', 'Baobab Tree']
  },
  {
    id: 24,
    name: 'Vavuniya',
    region: 'Northern Province',
    description: 'A northern city known for its cultural heritage and agricultural significance.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop',
    highlights: ['Madukanda Vihara', 'Vavuniya Tank', 'Archaeological Museum']
  },
  {
    id: 25,
    name: 'Puttalam',
    region: 'North Western Province',
    description: 'A coastal town known for its salt production and lagoons.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    highlights: ['Puttalam Lagoon', 'Wilpattu National Park', 'St. Anne’s Church']
  },
  {
    id: 26,
    name: 'Beruwala',
    region: 'Western Province',
    description: 'A coastal town with beautiful beaches and historic mosques.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    highlights: ['Beruwala Beach', 'Kechimalai Mosque', 'Bentota River']
  },
  {
    id: 27,
    name: 'Chilaw',
    region: 'North Western Province',
    description: 'A coastal town known for its fishing industry and Munneswaram temple.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    highlights: ['Munneswaram Temple', 'Chilaw Lagoon', 'Anawilundawa Wetland']
  },
  {
    id: 28,
    name: 'Gampaha',
    region: 'Western Province',
    description: 'A city with lush greenery and historical Buddhist sites.',
    image: 'https://images.unsplash.com/photo-1469474968028-5663c0c8e537?w=400&h=300&fit=crop',
    highlights: ['Henarathgoda Botanical Garden', 'Maligatenna Raja Maha Vihara', 'Pansalwatta Temple']
  },
  {
    id: 29,
    name: 'Kegalle',
    region: 'Sabaragamuwa Province',
    description: 'A town surrounded by scenic hills and known for its spice plantations.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop',
    highlights: ['Pinnawala Elephant Orphanage', 'Bopath Ella', 'Alagalla Mountain']
  },
  {
    id: 30,
    name: 'Point Pedro',
    region: 'Northern Province',
    description: 'The northernmost point of Sri Lanka with scenic beaches and lighthouses.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    highlights: ['Point Pedro Lighthouse', 'Vallipuram Temple', 'Manalkadu Beach']
  },
  {
    id: 31,
    name: 'Tangalle',
    region: 'Southern Province',
    description: 'A tranquil coastal town with pristine beaches and turtle nesting sites.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    highlights: ['Tangalle Beach', 'Mulkirigala Rock Temple', 'Goyambokka Beach']
  },
  {
    id: 32,
    name: 'Monaragala',
    region: 'Uva Province',
    description: 'A gateway to wildlife reserves and ancient Buddhist sites.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop',
    highlights: ['Gal Oya National Park', 'Maligawila Buddha Statue', 'Yudaganawa Temple']
  },
  {
    id: 33,
    name: 'Balangoda',
    region: 'Sabaragamuwa Province',
    description: 'A town with archaeological significance and lush landscapes.',
    image: 'https://images.unsplash.com/photo-1469474968028-5663c0c8e537?w=400&h=300&fit=crop',
    highlights: ['Balangoda Caves', 'Samanalawewa Dam', 'Walawe River']
  },
  {
    id: 34,
    name: 'Hatton',
    region: 'Central Province',
    description: 'A town in the tea country known for its cool climate and scenic beauty.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop',
    highlights: ['Adam’s Peak', 'Castlereagh Reservoir', 'Tea Estates']
  },
  {
    id: 35,
    name: 'Weligama',
    region: 'Southern Province',
    description: 'A surfing hotspot with a laid-back vibe and beautiful beaches.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    highlights: ['Weligama Beach', 'Taprobane Island', 'Snake Farm']
  },
  {
    id: 36,
    name: 'Arugam Bay',
    region: 'Eastern Province',
    description: 'A world-famous surfing destination with a bohemian vibe.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    highlights: ['Arugam Bay Beach', 'Muhudu Maha Viharaya', 'Pottuvil Lagoon']
  },
  {
    id: 37,
    name: 'Tissamaharama',
    region: 'Southern Province',
    description: 'A historic town near Yala National Park, known for its ancient stupas.',
    image: 'https://images.unsplash.com/photo-1517816428104-380fd9864b1b?w=400&h=300&fit=crop',
    highlights: ['Tissa Wewa', 'Yala National Park', 'Tissamaharama Raja Maha Vihara']
  },
  {
    id: 38,
    name: 'Bentota',
    region: 'Southern Province',
    description: 'A coastal resort town known for water sports and luxury hotels.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    highlights: ['Bentota Beach', 'Kosgoda Turtle Hatchery', 'Brief Garden']
  },
  {
    id: 39,
    name: 'Kitulgala',
    region: 'Sabaragamuwa Province',
    description: 'An adventure hub known for white-water rafting and rainforest treks.',
    image: 'https://images.unsplash.com/photo-1469474968028-5663c0c8e537?w=400&h=300&fit=crop',
    highlights: ['Kelani River Rafting', 'Makandawa Rainforest', 'Bridge on the River Kwai']
  },
  {
    id: 40,
    name: 'Hikkaduwa',
    region: 'Southern Province',
    description: 'A vibrant beach town known for coral reefs and surfing.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    highlights: ['Hikkaduwa Coral Reef', 'Hikkaduwa Beach', 'Turtle Hatchery']
  }
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
  startDate,
  groupId
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
      console.error('🔍 Available data:', { tripId, userUid, startDate, groupId });
      alert('Missing trip information. Please try again or refresh the page.');
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
