import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Card, { CardBody, CardHeader } from '../components/Card';
import DestinationCard from '../components/DestinationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import waterfallVideo from '../assets/waterfall.mp4';

// Import destination images
import colomboImg from '../assets/destinations/colombo.jpg';
import kandyImg from '../assets/destinations/kandy.jpg';
import galleImg from '../assets/destinations/galle.jpg';
import nuwaraEliyaImg from '../assets/destinations/nuwara-eliya.jpg';
import anuradhapuraImg from '../assets/destinations/anuradhapura.jpg';
import sigiriyaImg from '../assets/destinations/sigiriya.jpg';
import ellaImg from '../assets/destinations/ella.jpg';
import mirissaImg from '../assets/destinations/mirissa.jpg';
import { 
  MapPinIcon, 
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PhotoIcon,
  SunIcon,
  BuildingLibraryIcon as TempleIcon,
  SparklesIcon,
  CakeIcon,
  HomeModernIcon,
  ClockIcon,
  PhoneIcon,
  GlobeAltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

const Discover = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tourist_attraction');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const mapRef = useRef(null);

  // Categories for filtering
  const categories = [
    { id: 'tourist_attraction', name: 'Tourist Attractions', icon: <SparklesIcon className="h-6 w-6 mx-auto" /> },
    { id: 'museum', name: 'Museums', icon: <BuildingLibraryIcon className="h-6 w-6 mx-auto" /> },
    { id: 'park', name: 'Parks & Nature', icon: <SunIcon className="h-6 w-6 mx-auto" /> },
    { id: 'temple', name: 'Temples', icon: <TempleIcon className="h-6 w-6 mx-auto" /> },
    { id: 'beach', name: 'Beaches', icon: <PhotoIcon className="h-6 w-6 mx-auto" /> },
    { id: 'restaurant', name: 'Restaurants', icon: <CakeIcon className="h-6 w-6 mx-auto" /> },
    { id: 'lodging', name: 'Hotels', icon: <HomeModernIcon className="h-6 w-6 mx-auto" /> },
  ];

  // Popular destinations in Sri Lanka
  const popularDestinations = [
    { name: 'Colombo', coords: { lat: 6.9271, lng: 79.8612 }, image: colomboImg },
    { name: 'Kandy', coords: { lat: 7.2906, lng: 80.6337 }, image: kandyImg },
    { name: 'Galle', coords: { lat: 6.0329, lng: 80.217 }, image: galleImg },
    { name: 'Nuwara Eliya', coords: { lat: 6.9497, lng: 80.7891 }, image: nuwaraEliyaImg },
    { name: 'Anuradhapura', coords: { lat: 8.3114, lng: 80.4037 }, image: anuradhapuraImg },
    { name: 'Sigiriya', coords: { lat: 7.9568, lng: 80.7608 }, image: sigiriyaImg },
    { name: 'Ella', coords: { lat: 6.8720, lng: 81.0463 }, image: ellaImg },
    { name: 'Mirissa', coords: { lat: 5.9487, lng: 80.4565 }, image: mirissaImg },
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Default to Colombo if location access denied
          setCurrentLocation({ lat: 6.9271, lng: 79.8612 });
        }
      );
    } else {
      setCurrentLocation({ lat: 6.9271, lng: 79.8612 });
    }
  }, []);

  useEffect(() => {
    if (currentLocation) {
      searchNearbyPlaces();
    }
  }, [currentLocation, selectedCategory]);

  const searchNearbyPlaces = async (location = currentLocation, query = '') => {
    if (!GOOGLE_PLACES_API_KEY) {
      console.error('Google Places API key is not configured');
      return;
    }

    setLoading(true);
    try {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        location: new window.google.maps.LatLng(location.lat, location.lng),
        radius: 50000, // 50km radius
        type: selectedCategory,
        keyword: query || 'Sri Lanka tourist attraction',
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Filter results to focus on Sri Lanka and popular attractions
          const filteredResults = results.filter(place => 
            place.rating && place.rating >= 3.5 && place.user_ratings_total > 10
          );
          setPlaces(filteredResults.slice(0, 20)); // Limit to 20 results
        } else {
          console.error('Places search failed:', status);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Error searching places:', error);
      setLoading(false);
    }
  };

  const searchByDestination = (destination) => {
    setCurrentLocation(destination.coords);
    searchNearbyPlaces(destination.coords, destination.name);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchNearbyPlaces(currentLocation, searchQuery);
    }
  };

  const toggleFavorite = (placeId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(placeId)) {
      newFavorites.delete(placeId);
    } else {
      newFavorites.add(placeId);
    }
    setFavorites(newFavorites);
    // Save to localStorage
    localStorage.setItem('discoverFavorites', JSON.stringify([...newFavorites]));
  };

  const getPlaceDetails = async (place) => {
    if (!GOOGLE_PLACES_API_KEY) return;

    setSelectedPlace(place);
    setPlaceDetails(null);

    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      placeId: place.place_id,
      fields: [
        'name', 'formatted_address', 'photos', 'rating', 'user_ratings_total',
        'opening_hours', 'formatted_phone_number', 'website', 'reviews',
        'price_level', 'types'
      ]
    };

    service.getDetails(request, (result, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaceDetails(result);
      }
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 fill-yellow-200 text-yellow-400" />
        );
      } else {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const getPhotoUrl = (photo, maxWidth = 400) => {
    if (!photo || !photo.getUrl) return 'https://placehold.co/400x300?text=No+Image';
    return photo.getUrl({ maxWidth });
  };

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('discoverFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay 
          muted 
          loop
          playsInline
        >
          <source src={waterfallVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-normal mb-6">
            Discover Sri Lanka
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Explore the Pearl of the Indian Ocean's hidden gems and popular attractions
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl w-full mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for attractions, restaurants, hotels..."
                className="w-full px-8 py-4 pl-16 text-gray-900 bg-white rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-300 text-lg"
              />
              <MagnifyingGlassIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Destinations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Popular Destinations
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {popularDestinations.map((destination) => (
              <div key={destination.name} className="flex-shrink-0 w-48 md:w-56">
                <DestinationCard
                  destination={destination}
                  imageUrl={destination.image}
                  onClick={searchByDestination}
                  className="h-48 md:h-56"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Categories Filter */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Categories
            </h2>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <FunnelIcon className="h-5 w-5" />
              <span className="text-sm">Filter by type</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group flex flex-col items-center justify-center py-3 px-2 rounded-full border transition-all duration-300 text-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400
                  ${selectedCategory === category.id
                    ? 'bg-primary-600 border-primary-600 scale-105 shadow'
                    : 'bg-transparent border-gray-300 hover:bg-primary-50 hover:border-primary-300'}
                `}
                style={{ '--tw-icon-color': selectedCategory === category.id ? '#fff' : undefined }}
              >
                <span
                  className={`mb-1 transition-colors duration-300
                    ${selectedCategory === category.id ? 'text-white' : 'text-gray-900 dark:text-white group-hover:text-primary-700 group-focus:text-primary-700'}`}
                >
                  {React.cloneElement(category.icon, {
                    className: `h-6 w-6 mx-auto transition-colors duration-300 ${selectedCategory === category.id ? 'text-white' : 'text-gray-900 dark:text-white group-hover:text-primary-700'}`,
                    style: undefined
                  })}
                </span>
                <span className={`text-xs font-medium transition-colors duration-300 ${selectedCategory === category.id ? 'text-white' : 'text-gray-900 dark:text-white group-hover:text-primary-700 group-focus:text-primary-700'}`}>{category.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Results Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? 'Searching...' : `Found ${places.length} places`}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {places.map((place) => (
                <Card
                  key={place.place_id}
                  hover
                  className="group cursor-pointer"
                  onClick={() => getPlaceDetails(place)}
                >
                  <div className="relative">
                    <img
                      src={place.photos ? getPhotoUrl(place.photos[0]) : 'https://placehold.co/400x300?text=No+Image'}
                      alt={place.name}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(place.place_id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      {favorites.has(place.place_id) ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                  
                  <CardBody>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                      {place.name}
                    </h3>
                    
                    {place.rating && (
                      <div className="flex items-center mb-2">
                        <div className="flex">{renderStars(place.rating)}</div>
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          {place.rating} ({place.user_ratings_total})
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-start mb-3">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {place.vicinity}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {place.types?.slice(0, 2).map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-xs rounded-full"
                        >
                          {type.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          {places.length === 0 && !loading && (
            <div className="text-center py-12">
              <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No places found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria or selecting a different category.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Place Details Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedPlace.name}
                </h2>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-secondary-700 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            
            <CardBody>
              {selectedPlace.photos && (
                <img
                  src={getPhotoUrl(selectedPlace.photos[0], 600)}
                  alt={selectedPlace.name}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}

              {selectedPlace.rating && (
                <div className="flex items-center mb-4">
                  <div className="flex">{renderStars(selectedPlace.rating)}</div>
                  <span className="ml-2 text-lg font-medium text-gray-900 dark:text-white">
                    {selectedPlace.rating}
                  </span>
                  <span className="ml-1 text-gray-600 dark:text-gray-400">
                    ({selectedPlace.user_ratings_total} reviews)
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedPlace.vicinity}
                  </span>
                </div>

                {placeDetails?.formatted_phone_number && (
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {placeDetails.formatted_phone_number}
                    </span>
                  </div>
                )}

                {placeDetails?.website && (
                  <div className="flex items-center">
                    <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <a
                      href={placeDetails.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {placeDetails?.opening_hours && (
                  <div className="flex items-start">
                    <ClockIcon className="h-5 w-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white mb-2">
                        Opening Hours
                      </div>
                      <div className="space-y-1">
                        {placeDetails.opening_hours.weekday_text?.map((day, index) => (
                          <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => toggleFavorite(selectedPlace.place_id)}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                    favorites.has(selectedPlace.place_id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-secondary-700 dark:text-white dark:hover:bg-secondary-600'
                  }`}
                >
                  {favorites.has(selectedPlace.place_id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                <button className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  Get Directions
                </button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Discover;
