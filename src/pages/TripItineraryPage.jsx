import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Plus, Utensils, Bed, Car, Camera, Search, Calendar, ChevronDown, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';

const TripItineraryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tripName, selectedDates, selectedTerrains, selectedActivities } = location.state || {};
  
  const [currentDay, setCurrentDay] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [itinerary, setItinerary] = useState({});
  const [expandedDays, setExpandedDays] = useState({});
  const [selectedStayDates, setSelectedStayDates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate days array from selected dates
  const generateDays = () => {
    if (!selectedDates || selectedDates.length < 2) return [];
    
    const days = [];
    const startDate = new Date(selectedDates[0]);
    const endDate = new Date(selectedDates[1]);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    
    return days;
  };

  const days = generateDays();

  useEffect(() => {
    // Initialize empty itinerary for each day and expand first few days
    const initialItinerary = {};
    const initialExpanded = {};
    days.forEach((day, index) => {
      initialItinerary[index] = {
        date: day,
        activities: [],
        places: [],
        food: [],
        transportation: []
      };
      // Expand first 3 days by default
      initialExpanded[index] = index < 3;
    });
    setItinerary(initialItinerary);
    setExpandedDays(initialExpanded);
  }, [days.length]);

  const mockSuggestions = {
    activities: [
      { 
        id: 1, 
        name: 'Sigiriya Rock Fortress', 
        location: 'Sigiriya', 
        duration: '3 hours', 
        rating: 4.8,
        reviews: 2847,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        description: 'Ancient rock fortress with stunning views',
        price: '$25'
      },
      { 
        id: 2, 
        name: 'Temple of the Tooth', 
        location: 'Kandy', 
        duration: '2 hours', 
        rating: 4.7,
        reviews: 1923,
        image: 'https://images.unsplash.com/photo-1546172799-48f3b4e1c4e3?w=400&h=300&fit=crop',
        description: 'Sacred Buddhist temple housing Buddha\'s tooth relic',
        price: '$15'
      },
      { 
        id: 3, 
        name: 'Galle Fort', 
        location: 'Galle', 
        duration: '2-3 hours', 
        rating: 4.6,
        reviews: 3421,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        description: 'Historic colonial fort with ocean views',
        price: '$10'
      },
      { 
        id: 4, 
        name: 'Ella Rock Hike', 
        location: 'Ella', 
        duration: '4-5 hours', 
        rating: 4.9,
        reviews: 892,
        image: 'https://images.unsplash.com/photo-1566054992766-3d4677dccb67?w=400&h=300&fit=crop',
        description: 'Challenging hike with panoramic mountain views',
        price: 'Free'
      },
      { 
        id: 5, 
        name: 'Whale Watching Tour', 
        location: 'Mirissa', 
        duration: '3-4 hours', 
        rating: 4.5,
        reviews: 1234,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        description: 'Spot blue whales and dolphins in their natural habitat',
        price: '$45'
      },
      { 
        id: 6, 
        name: 'Safari at Yala National Park', 
        location: 'Yala', 
        duration: '6 hours', 
        rating: 4.7,
        reviews: 987,
        image: 'https://images.unsplash.com/photo-1549366021-9f761d040a87?w=400&h=300&fit=crop',
        description: 'Wildlife safari to see leopards, elephants, and birds',
        price: '$65'
      }
    ],
    places: [
      { 
        id: 1, 
        name: 'Jetwing Spa', 
        location: 'Negombo', 
        price: '$120/night', 
        rating: 4.5,
        reviews: 1834,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
        description: 'Luxury beachfront resort with spa facilities'
      },
      { 
        id: 2, 
        name: 'Grand Sands Hotel', 
        location: 'Kandy', 
        price: '$85/night', 
        rating: 4.3,
        reviews: 967,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
        description: 'Modern hotel in the heart of Kandy'
      },
      { 
        id: 3, 
        name: 'Galle Face Hotel', 
        location: 'Colombo', 
        price: '$200/night', 
        rating: 4.7,
        reviews: 2156,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
        description: 'Historic luxury hotel facing the Indian Ocean'
      },
      { 
        id: 4, 
        name: 'Heritance Tea Factory', 
        location: 'Nuwara Eliya', 
        price: '$180/night', 
        rating: 4.6,
        reviews: 743,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
        description: 'Unique hotel converted from a tea factory'
      },
      { 
        id: 5, 
        name: 'Anantara Peace Haven', 
        location: 'Tangalle', 
        price: '$350/night', 
        rating: 4.8,
        reviews: 456,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
        description: 'Luxury beachfront resort with clifftop location'
      }
    ],
    cities: [
      { 
        id: 1, 
        name: 'Colombo', 
        region: 'Western Province', 
        description: 'Bustling capital city with modern attractions and historic sites', 
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
        highlights: ['Galle Face Green', 'National Museum', 'Pettah Market', 'Red Mosque'],
        accommodations: 156,
        averagePrice: '$85/night'
      },
      { 
        id: 2, 
        name: 'Kandy', 
        region: 'Central Province', 
        description: 'Cultural capital surrounded by hills and home to sacred temples', 
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
        highlights: ['Temple of the Tooth', 'Kandy Lake', 'Royal Botanical Gardens', 'Cultural Shows'],
        accommodations: 89,
        averagePrice: '$65/night'
      },
      { 
        id: 3, 
        name: 'Galle', 
        region: 'Southern Province', 
        description: 'Historic coastal city with colonial Dutch architecture', 
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        highlights: ['Galle Fort', 'Dutch Reformed Church', 'Maritime Museum', 'Beaches'],
        accommodations: 67,
        averagePrice: '$95/night'
      },
      { 
        id: 4, 
        name: 'Ella', 
        region: 'Uva Province', 
        description: 'Mountain town famous for hiking trails and tea plantations', 
        image: 'https://images.unsplash.com/photo-1566054992766-3d4677dccb67?w=400&h=300&fit=crop',
        highlights: ['Nine Arch Bridge', 'Little Adam\'s Peak', 'Ella Rock', 'Tea Factories'],
        accommodations: 43,
        averagePrice: '$55/night'
      },
      { 
        id: 5, 
        name: 'Nuwara Eliya', 
        region: 'Central Province', 
        description: 'Cool climate hill station known as "Little England"', 
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
        highlights: ['Horton Plains', 'Gregory Lake', 'Tea Plantations', 'Victoria Park'],
        accommodations: 71,
        averagePrice: '$75/night'
      },
      { 
        id: 6, 
        name: 'Sigiriya', 
        region: 'North Central Province', 
        description: 'Ancient city home to the famous Lion Rock fortress', 
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        highlights: ['Sigiriya Rock', 'Pidurangala Rock', 'Ancient Frescoes', 'Water Gardens'],
        accommodations: 34,
        averagePrice: '$110/night'
      }
    ],
    food: [
      { 
        id: 1, 
        name: 'Ministry of Crab', 
        location: 'Colombo', 
        cuisine: 'Seafood', 
        rating: 4.8,
        reviews: 3247,
        image: 'https://images.unsplash.com/photo-1559847844-d825b6b9f5b1?w=400&h=300&fit=crop',
        description: 'World-renowned restaurant specializing in Sri Lankan crab',
        priceRange: '$30-50'
      },
      { 
        id: 2, 
        name: 'The Station Restaurant', 
        location: 'Kandy', 
        cuisine: 'International', 
        rating: 4.4,
        reviews: 892,
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
        description: 'Fine dining with mountain views',
        priceRange: '$15-25'
      },
      { 
        id: 3, 
        name: 'Pedlar\'s Inn Cafe', 
        location: 'Galle', 
        cuisine: 'Local', 
        rating: 4.5,
        reviews: 1456,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
        description: 'Charming cafe in historic Galle Fort',
        priceRange: '$8-15'
      }
    ],
    transportation: [
      { 
        id: 1, 
        name: 'Private Car with Driver', 
        type: 'Car Rental', 
        price: '$50/day', 
        rating: 4.6,
        reviews: 234,
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
        description: 'Comfortable air-conditioned vehicle with experienced driver',
        features: ['AC', 'English Speaking Driver', 'Fuel Included']
      },
      { 
        id: 2, 
        name: 'Blue Line Train', 
        type: 'Train', 
        price: '$15', 
        rating: 4.8,
        reviews: 1567,
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
        description: 'Scenic train journey through tea plantations',
        features: ['Scenic Route', 'Observation Car', 'First Class Available']
      },
      { 
        id: 3, 
        name: 'Tuk Tuk Adventure', 
        type: 'Local Transport', 
        price: '$25/day', 
        rating: 4.4,
        reviews: 678,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        description: 'Authentic local experience with tuk tuk tours',
        features: ['Local Guide', 'Flexible Stops', 'Cultural Experience']
      }
    ]
  };

  const handleAddItem = (category, dayIndex) => {
    setSelectedCategory(category);
    setCurrentDay(dayIndex);
    if (category === 'locations') {
      setShowLocationModal(true);
    } else {
      setShowAddModal(true);
    }
  };

  const addItemToItinerary = (item, selectedDates = null) => {
    if (selectedDates && selectedDates.length > 0) {
      // Add location to multiple days
      selectedDates.forEach(dateIndex => {
        setItinerary(prev => ({
          ...prev,
          [dateIndex]: {
            ...prev[dateIndex],
            places: [...prev[dateIndex].places, { ...item, stayDates: selectedDates, isLocation: true }]
          }
        }));
      });
    } else {
      // Add to single day
      setItinerary(prev => ({
        ...prev,
        [currentDay]: {
          ...prev[currentDay],
          [selectedCategory]: [...prev[currentDay][selectedCategory], item]
        }
      }));
    }
    setShowAddModal(false);
    setShowLocationModal(false);
    setSelectedStayDates([]);
  };

  const handleStayDateSelect = (dayIndex) => {
    setSelectedStayDates(prev => {
      if (prev.includes(dayIndex)) {
        return prev.filter(d => d !== dayIndex);
      } else {
        return [...prev, dayIndex].sort((a, b) => a - b);
      }
    });
  };

  const getFilteredSuggestions = () => {
    const suggestionsKey = showLocationModal ? 'cities' : selectedCategory;
    if (!searchQuery) return mockSuggestions[suggestionsKey] || [];
    
    return (mockSuggestions[suggestionsKey] || []).filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.region && item.region.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const toggleDayExpansion = (dayIndex) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayIndex]: !prev[dayIndex]
    }));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleBack = () => {
    navigate('/trip-preferences', { 
      state: { tripName, selectedDates } 
    });
  };

  const handleSaveTrip = () => {
    navigate('/trips', {
      state: {
        newTrip: {
          name: tripName,
          dates: selectedDates,
          terrains: selectedTerrains,
          activities: selectedActivities,
          itinerary: itinerary,
          createdAt: new Date()
        }
      }
    });
  };

  if (!tripName || !selectedDates) {
    return <div>Loading...</div>;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Trip Header */}
      <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{tripName}</h1>
              <p className="text-primary-100 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {selectedDates[0]?.toLocaleDateString()} - {selectedDates[1]?.toLocaleDateString()} • Sri Lanka
              </p>
            </div>
            <button
              onClick={handleSaveTrip}
              className="bg-white text-primary-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Save Trip
            </button>
          </div>
        </div>
      </div>

      {/* Trip Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button className="py-4 border-b-2 border-primary-600 text-primary-600 font-medium">
              Itinerary
            </button>
            <button className="py-4 text-gray-500 hover:text-gray-700">
              For you
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Itinerary */}
          <div className="lg:col-span-2">
            <p className="text-gray-600 text-sm mb-6">What's a trip without experiences?</p>
            
            {/* Day Timeline */}
            <div className="space-y-0">
              {days.map((day, dayIndex) => {
                const dayItinerary = itinerary[dayIndex] || { activities: [], places: [], food: [], transportation: [] };
                const isExpanded = expandedDays[dayIndex];
                const hasItems = dayItinerary.activities.length > 0 || dayItinerary.places.length > 0 || 
                               dayItinerary.food.length > 0 || dayItinerary.transportation.length > 0;
                
                return (
                  <div key={dayIndex} className="border-l-2 border-gray-200 relative">
                    {/* Day Header */}
                    <div className="flex items-center mb-4 -ml-3">
                      <div className="bg-white border-4 border-gray-200 w-6 h-6 rounded-full"></div>
                      <button 
                        onClick={() => toggleDayExpansion(dayIndex)}
                        className="ml-4 flex items-center text-lg font-semibold text-gray-900 hover:text-primary-600"
                      >
                        {formatDate(day)}
                        <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Day Content */}
                    {isExpanded && (
                      <div className="ml-6 pb-8">
                        {/* Add Location Button */}
                        <div className="mb-6">
                          <button 
                            onClick={() => handleAddItem('locations', dayIndex)}
                            className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add a location
                          </button>
                        </div>

                        {/* Activity Input Area */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                          <div className="flex items-center text-gray-500 mb-3">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="text-sm">Start your day by visiting from places or adding custom travel/vacation activities</span>
                          </div>
                          
                          <textarea 
                            placeholder="Add details or leave them blank for recommendations."
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            rows="3"
                          />
                          
                          {/* Category Icons */}
                          <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-gray-300">
                            <button 
                              onClick={() => handleAddItem('activities', dayIndex)}
                              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg group"
                              title="Things to Do"
                            >
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-primary-100">
                                <Camera className="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
                              </div>
                            </button>
                            <button 
                              onClick={() => handleAddItem('places', dayIndex)}
                              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg group"
                              title="Places to Stay"
                            >
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-primary-100">
                                <Bed className="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
                              </div>
                            </button>
                            <button 
                              onClick={() => handleAddItem('food', dayIndex)}
                              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg group"
                              title="Food & Drink"
                            >
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-primary-100">
                                <Utensils className="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
                              </div>
                            </button>
                            <button 
                              onClick={() => handleAddItem('transportation', dayIndex)}
                              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg group"
                              title="Transportation"
                            >
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-primary-100">
                                <Car className="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
                              </div>
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Added Items */}
                        {hasItems && (
                          <div className="space-y-3">
                            {Object.entries(dayItinerary).map(([category, items]) => {
                              if (!items || items.length === 0) return null;
                              
                              return items.map((item, itemIndex) => (
                                <div key={`${category}-${itemIndex}`} className="bg-white border border-gray-200 rounded-lg p-4">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                                      <p className="text-sm text-gray-500">{item.location}</p>
                                      {item.duration && <p className="text-xs text-gray-400">{item.duration}</p>}
                                      {item.price && <p className="text-sm font-medium text-gray-900 mt-1">{item.price}</p>}
                                    </div>
                                    <div className="text-right">
                                      {item.rating && (
                                        <p className="text-xs text-yellow-600">★ {item.rating}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ));
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Collapsed Day Summary */}
                    {!isExpanded && hasItems && (
                      <div className="ml-6 pb-8">
                        <div className="text-sm text-gray-600">
                          {Object.entries(dayItinerary).reduce((total, [, items]) => total + items.length, 0)} items planned
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Interactive map</p>
                  <p className="text-xs">Your trip locations will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Modal - Regular Items */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Add {selectedCategory === 'activities' ? 'Things to Do' : 
                       selectedCategory === 'places' ? 'Places to Stay' :
                       selectedCategory === 'food' ? 'Food & Drink' : 'Transportation'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search recommendations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 focus:ring-0 text-sm placeholder-gray-400"
                />
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-1 gap-2">
                {getFilteredSuggestions().map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex">
                      {/* Compact Image */}
                      <div className="w-16 h-16 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Compact Content */}
                      <div className="flex-1 p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{item.location}</p>
                            
                            {/* Rating */}
                            {item.rating && (
                              <div className="flex items-center mt-1">
                                <span className="text-xs text-yellow-500">★ {item.rating}</span>
                                {item.reviews && (
                                  <span className="text-xs text-gray-400 ml-1">({item.reviews})</span>
                                )}
                              </div>
                            )}
                            
                            {/* Additional compact details */}
                            <div className="mt-1 flex gap-2 text-xs text-gray-500">
                              {item.duration && <span>{item.duration}</span>}
                              {item.cuisine && <span>{item.cuisine}</span>}
                              {item.type && <span>{item.type}</span>}
                              {item.priceRange && <span>{item.priceRange}</span>}
                            </div>
                          </div>
                          
                          {/* Price and Add Button */}
                          <div className="ml-2 flex flex-col items-end justify-between">
                            {item.price && (
                              <span className="text-sm font-bold text-gray-900">{item.price}</span>
                            )}
                            <button
                              onClick={() => addItemToItinerary(item)}
                              className="bg-primary-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-primary-700 transition-colors mt-1"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {getFilteredSuggestions().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No recommendations found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Location Selection Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Add a location to your trip</h3>
                <button
                  onClick={() => {
                    setShowLocationModal(false);
                    setSelectedStayDates([]);
                    setSearchQuery('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mt-2">Choose a city or region to stay, then select which days you'll be there.</p>
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
            
            <div className="flex">
              {/* Left Side - City Selection */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
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
                          onClick={() => addItemToItinerary(city, selectedStayDates)}
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
                    <p className="text-lg font-medium">No cities found</p>
                    <p>Try searching for a different location.</p>
                  </div>
                )}
              </div>

              {/* Right Side - Calendar */}
              <div className="w-80 bg-gradient-to-b from-primary-50 to-white border-l border-gray-200 p-6">
                <div className="sticky top-0">
                  <div className="flex items-center mb-4">
                    <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Select your stay dates</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Choose which days you'll be staying in this city. You can select multiple consecutive or separate days.
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
                        onClick={() => handleStayDateSelect(dayIndex)}
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
      )}
    </div>
  );
};

export default TripItineraryPage;
