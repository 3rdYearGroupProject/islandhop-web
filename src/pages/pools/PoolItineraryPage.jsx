import React, { useState, useEffect } from 'react';
import { useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import { MapPin, Plus, Utensils, Bed, Car, Camera, Search, Calendar, ChevronDown, Clock } from 'lucide-react';
import AddDestinationModal from '../../components/AddDestinationModal';
import AddThingsToDoModal from '../../components/AddThingsToDoModal';
import AddPlacesToStayModal from '../../components/AddPlacesToStayModal';
import AddFoodAndDrinkModal from '../../components/AddFoodAndDrinkModal';
import AddTransportationModal from '../../components/AddTransportationModal';
import Navbar from '../../components/Navbar';
import PoolProgressBar from '../../components/PoolProgressBar';

const PoolItineraryPage = () => {
  const location = useRouterLocation();
  const navigate = useNavigate();
  const { poolName, selectedDates, selectedTerrains, selectedActivities } = location.state || {};
  
  const [currentDay, setCurrentDay] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
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
      initialExpanded[index] = index < 1;
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
    if (category === 'Destinations') {
      setShowDestinationModal(true);
    } else {
      setShowAddModal(true);
    }
  };

  const addItemToItinerary = (item, selectedDates = null) => {
    // Helper function to get category key
    const getCategoryKey = (category) => {
      switch(category) {
        case 'Destinations': return 'places';
        case 'activities': return 'activities';
        case 'places': return 'places';
        case 'food': return 'food';
        case 'transportation': return 'transportation';
        default: return 'activities';
      }
    };

    if (selectedDates && selectedDates.length > 0) {
      // Add item to multiple selected days
      selectedDates.forEach(dateIndex => {
        setItinerary(prev => {
          const categoryKey = getCategoryKey(selectedCategory);
          const dayData = prev[dateIndex] || {
            date: days[dateIndex],
            activities: [],
            places: [],
            food: [],
            transportation: []
          };
          
          return {
            ...prev,
            [dateIndex]: {
              ...dayData,
              [categoryKey]: [
                ...(dayData[categoryKey] || []), 
                { ...item, selectedDates: selectedDates, isMultiDay: true }
              ]
            }
          };
        });
      });
    } else {
      // Add to single day (fallback for old logic)
      setItinerary(prev => {
        const categoryKey = getCategoryKey(selectedCategory);
        const dayData = prev[currentDay] || {
          date: days[currentDay],
          activities: [],
          places: [],
          food: [],
          transportation: []
        };
        
        return {
          ...prev,
          [currentDay]: {
            ...dayData,
            [categoryKey]: [
              ...(dayData[categoryKey] || []), 
              item
            ]
          }
        };
      });
    }
    setShowAddModal(false);
    setShowDestinationModal(false);
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
    const suggestionsKey = showDestinationModal ? 'cities' : selectedCategory;
    if (!searchQuery) return mockSuggestions[suggestionsKey] || [];
    
    return (mockSuggestions[suggestionsKey] || []).filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.destination && item.destination.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
    navigate('/pool-preferences', { 
      state: { poolName, selectedDates } 
    });
  };

  const handleSavePool = () => {
    navigate('/pools', {
      state: {
        newPool: {
          name: poolName,
          dates: selectedDates,
          terrains: selectedTerrains,
          activities: selectedActivities,
          itinerary: itinerary,
          createdAt: new Date()
        }
      }
    });
  };

  if (!poolName || !selectedDates) {
    return <div>Loading...</div>;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Pool Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 pt-2 pb-1">
          <PoolProgressBar currentStep={4} completedSteps={[1, 2, 3]} poolName={poolName} />
        </div>
      </div>
      
      {/* Pool Header removed as per request */}

      {/* Pool Tabs */}
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Itinerary */}
          <div className="w-full lg:w-1/2">
            <p className="text-gray-600 text-sm mb-6">What's a pool without experiences?</p>
            
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
                          onClick={() => handleAddItem('Destinations', dayIndex)}
                          className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Destination
                        </button>
                        </div>

                        {/* Added Items */}
                        {hasItems ? (
                          <div className="space-y-3 mb-6">
                            {Object.entries(dayItinerary).map(([category, items]) => {
                              // Ensure items is always an array before mapping
                              if (!Array.isArray(items) || items.length === 0) return null;
                              
                              const getCategoryIcon = (category) => {
                                switch(category) {
                                  case 'activities': return <Camera className="w-4 h-4 text-primary-600" />;
                                  case 'places': return <MapPin className="w-4 h-4 text-primary-600" />;
                                  case 'food': return <Utensils className="w-4 h-4 text-primary-600" />;
                                  case 'transportation': return <Car className="w-4 h-4 text-primary-600" />;
                                  default: return <MapPin className="w-4 h-4 text-primary-600" />;
                                }
                              };

                              const getCategoryName = (category) => {
                                switch(category) {
                                  case 'activities': return 'Things to Do';
                                  case 'places': return 'Places to Stay';
                                  case 'food': return 'Dining';
                                  case 'transportation': return 'Transportation';
                                  default: return category;
                                }
                              };
                              
                              return items.map((item, itemIndex) => (
                                <div key={`${category}-${itemIndex}`} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        {getCategoryIcon(category)}
                                        <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                                          {getCategoryName(category)}
                                        </span>
                                        {item.isMultiDay && (
                                          <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                                            Multi-day
                                          </span>
                                        )}
                                      </div>
                                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                                      <p className="text-sm text-gray-500">{item.location}</p>
                                      {item.duration && <p className="text-xs text-gray-400 mt-1">{item.duration}</p>}
                                      {item.description && (
                                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                                      )}
                                      {item.price && <p className="text-sm font-medium text-gray-900 mt-2">{item.price}</p>}
                                    </div>
                                    <div className="text-right ml-4">
                                      {item.rating && (
                                        <p className="text-xs text-yellow-600 mb-2">★ {item.rating}</p>
                                      )}
                                      <button className="text-gray-400 hover:text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ));
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 mb-6">
                            <div className="text-gray-400 mb-2">
                              <Calendar className="w-8 h-8 mx-auto" />
                            </div>
                            <p className="text-gray-500 text-sm mb-1">No activities planned for this day</p>
                            <p className="text-gray-400 text-xs">Use the buttons below to add activities, places, dining, or transportation</p>
                          </div>
                        )}

                        {/* Category Addition Buttons */}
                        <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-200">
                          <button 
                            onClick={() => handleAddItem('activities', dayIndex)}
                            className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg group border border-gray-200 w-24 h-20"
                            title="Add Things to Do"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 mb-1">
                              <Camera className="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
                            </div>
                            <span className="text-xs text-gray-600 group-hover:text-primary-600 text-center leading-tight">Things to Do</span>
                          </button>
                          <button 
                            onClick={() => handleAddItem('places', dayIndex)}
                            className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg group border border-gray-200 w-24 h-20"
                            title="Add Places to Stay"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 mb-1">
                              <Bed className="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
                            </div>
                            <span className="text-xs text-gray-600 group-hover:text-primary-600 text-center leading-tight">Places to Stay</span>
                          </button>
                          <button 
                            onClick={() => handleAddItem('food', dayIndex)}
                            className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg group border border-gray-200 w-24 h-20"
                            title="Add Dining"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 mb-1">
                              <Utensils className="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
                            </div>
                            <span className="text-xs text-gray-600 group-hover:text-primary-600 text-center leading-tight">Dining</span>
                          </button>
                          <button 
                            onClick={() => handleAddItem('transportation', dayIndex)}
                            className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg group border border-gray-200 w-24 h-20"
                            title="Add Transportation"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 mb-1">
                              <Car className="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
                            </div>
                            <span className="text-xs text-gray-600 group-hover:text-primary-600 text-center leading-tight">Transportation</span>
                          </button>
                        </div>
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
          <div className="w-full lg:w-1/2">
            <div className="sticky top-6">
              <div className="bg-gray-100 rounded-lg h-[calc(100vh-12rem)] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Interactive map</p>
                  <p className="text-xs">Your pool destinations will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="w-full lg:w-1/2">
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              className="bg-white border border-primary-600 text-primary-600 px-6 py-2 rounded-lg shadow hover:bg-primary-50 font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSavePool}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg shadow hover:bg-primary-700 font-medium transition-colors"
            >
              Save Pool
            </button>
          </div>
        </div>
      </div>

      {/* Modularized Add Item Modals */}
      <AddThingsToDoModal
        show={showAddModal && selectedCategory === 'activities'}
        onClose={() => {
          setShowAddModal(false);
          setSelectedStayDates([]);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getFilteredSuggestions={getFilteredSuggestions}
        selectedStayDates={selectedStayDates}
        setSelectedStayDates={setSelectedStayDates}
        days={days}
        formatDate={formatDate}
        addItemToItinerary={addItemToItinerary}
      />
      <AddPlacesToStayModal
        show={showAddModal && selectedCategory === 'places'}
        onClose={() => {
          setShowAddModal(false);
          setSelectedStayDates([]);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getFilteredSuggestions={getFilteredSuggestions}
        selectedStayDates={selectedStayDates}
        setSelectedStayDates={setSelectedStayDates}
        days={days}
        formatDate={formatDate}
        addItemToItinerary={addItemToItinerary}
      />
      <AddFoodAndDrinkModal
        show={showAddModal && selectedCategory === 'food'}
        onClose={() => {
          setShowAddModal(false);
          setSelectedStayDates([]);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getFilteredSuggestions={getFilteredSuggestions}
        selectedStayDates={selectedStayDates}
        setSelectedStayDates={setSelectedStayDates}
        days={days}
        formatDate={formatDate}
        addItemToItinerary={addItemToItinerary}
      />
      <AddTransportationModal
        show={showAddModal && selectedCategory === 'transportation'}
        onClose={() => {
          setShowAddModal(false);
          setSelectedStayDates([]);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getFilteredSuggestions={getFilteredSuggestions}
        selectedStayDates={selectedStayDates}
        setSelectedStayDates={setSelectedStayDates}
        days={days}
        formatDate={formatDate}
        addItemToItinerary={addItemToItinerary}
      />

      <AddDestinationModal
        show={showDestinationModal}
        onClose={() => {
          setShowDestinationModal(false);
          setSelectedStayDates([]);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getFilteredSuggestions={getFilteredSuggestions}
        selectedStayDates={selectedStayDates}
        setSelectedStayDates={setSelectedStayDates}
        days={days}
        formatDate={formatDate}
        addItemToItinerary={addItemToItinerary}
      />
      <Footer />
    </div>
  );
};

export default PoolItineraryPage;
