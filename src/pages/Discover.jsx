import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card, { CardBody, CardHeader } from '../components/Card';
import DestinationCard from '../components/DestinationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import waterfallVideo from '../assets/waterfall.mp4';
import Footer from '../components/Footer';

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
  HeartIcon,
  StarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

const Discover = () => {
  const location = useLocation();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tourist_attraction');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const mapRef = useRef(null);
  // Map filter string to category id
  const filterToCategoryId = (filter) => {
    if (!filter) return 'tourist_attraction';
    const map = {
      beaches: 'beach',
      temples: 'temple',
      wildlife: 'park',
      hiking: 'park',
      food: 'restaurant',
    };
    return map[filter] || 'tourist_attraction';
  };

  // On mount, set selectedCategory from navigation state or query string if present
  useEffect(() => {
    let filter = null;
    // Check navigation state first
    if (location.state && location.state.filter) {
      filter = location.state.filter;
    } else {
      // Parse query string for ?filter=...
      const params = new URLSearchParams(location.search);
      if (params.has('filter')) {
        filter = params.get('filter');
      }
    }
    if (filter) {
      setSelectedCategory(filterToCategoryId(filter));
    }
    // eslint-disable-next-line
  }, [location.state, location.search]);

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
      const searchText = query || `${selectedCategory} near ${location.lat},${location.lng} Sri Lanka`;
      
      const request = {
        textQuery: searchText,
        fields: ['displayName', 'location', 'rating', 'userRatingCount', 'photos', 'priceLevel', 'types', 'formattedAddress'],
        maxResultCount: 8,
      };

      const { places } = await window.google.maps.places.Place.searchByText(request);

      if (places && places.length > 0) {
        const filteredResults = places.filter(place => 
          place.rating && place.rating >= 3.5 && place.userRatingCount > 10
        );
        setPlaces(filteredResults);
      } else {
        console.error('No places found');
        setPlaces([]);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      setPlaces([]);
    } finally {
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
    setSelectedPlace(place);
    setPlaceDetails(place); // Since new API already returns most details
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
    if (!photo) return 'https://placehold.co/400x300?text=No+Image';
    
    // Handle new Places API photo format
    if (photo.name) {
      return `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=${maxWidth}&key=${GOOGLE_PLACES_API_KEY}`;
    }
    
    // Fallback for old format
    if (photo.getUrl) {
      return photo.getUrl({ maxWidth });
    }
    
    return 'https://placehold.co/400x300?text=No+Image';
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
      <section className="relative w-full h-[75vh] md:h-[45vh] overflow-hidden">
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
          <div className="mt-16 md:mt-24">
            <h1 className="text-4xl md:text-6xl font-normal mb-6">
              Discover Sri Lanka
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Explore the Pearl of the Indian Ocean's hidden gems and popular attractions
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar - Pill Shaped Container */}
        <div className="bg-white rounded-full shadow-xl border border-gray-100 p-3 md:p-5 mb-8 w-full max-w-4xl mx-auto relative -mt-8 z-20">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex items-center w-full md:min-w-[600px] lg:min-w-[700px]">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              {/* Mobile input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="md:hidden pl-12 pr-20 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full text-base bg-transparent"
              />
              {/* Desktop input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for attractions, restaurants, hotels..."
                className="hidden md:block pl-12 pr-28 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full text-base bg-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 md:px-6 py-2 bg-primary-600 text-white rounded-full font-semibold shadow hover:bg-primary-700 transition-colors text-sm"
              >
                Search
              </button>
            </div>
          </form>
        </div>

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
              {categories.find(cat => cat.id === selectedCategory)?.name || 'Tourist Attractions'}
            </h2>
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowCategoryModal(true)}
              className="md:hidden flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
            >
              <FunnelIcon className="h-5 w-5" />
              <span className="text-sm">Filter by type</span>
            </button>
            {/* Desktop Filter Label */}
            <div className="hidden md:flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <FunnelIcon className="h-5 w-5" />
              <span className="text-sm">Filter by type</span>
            </div>
          </div>
          
          {/* Desktop Categories Grid */}
          <div className="hidden md:grid grid-cols-4 lg:grid-cols-7 gap-3">
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

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {places.map((place) => (
                <Card
                  key={place.id}
                  hover
                  padding="none"
                  className="group cursor-pointer bg-white rounded-2xl border border-gray-200 hover:border-blue-300 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1 flex flex-col h-[320px] md:h-[380px]"
                  onClick={() => getPlaceDetails(place)}
                >
                  <div className="relative">
                    <img
                      src={place.photos && place.photos.length > 0 ? getPhotoUrl(place.photos[0]) : 'https://placehold.co/400x300?text=No+Image'}
                      alt={place.displayName?.text || place.name}
                      className="w-full h-32 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(place.id);
                      }}
                      className="absolute top-3 right-3 p-1.5 md:p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md"
                    >
                      {favorites.has(place.id) ? (
                        <HeartSolidIcon className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                      )}
                    </button>
                    
                    {/* Rating overlay */}
                    {place.rating && (
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-md">
                          <StarIcon className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-xs md:text-sm font-semibold text-gray-900">{place.rating}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <CardBody className="p-3 md:p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors leading-tight line-clamp-2 flex-1">
                        {place.displayName?.text || place.name}
                      </h3>
                    </div>
                    
                    <div className="space-y-1.5 mb-3 flex-1">
                      <div className="flex items-start">
                        <MapPinIcon className="h-3 w-3 md:h-4 md:w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-tight">
                          {place.formattedAddress || place.vicinity}
                        </span>
                      </div>
                      
                      {place.rating && (
                        <div className="flex items-center">
                          <StarIcon className="h-3 w-3 md:h-4 md:w-4 text-blue-500 mr-2" />
                          <span className="text-xs md:text-sm text-gray-600">
                            {place.rating} ({place.userRatingCount || place.user_ratings_total} reviews)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="mb-3">
                      <div className="flex gap-1 overflow-x-auto scrollbar-hide md:flex-wrap md:overflow-visible">
                        {place.types?.slice(0, 2).map((type) => (
                          <span
                            key={type}
                            className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md whitespace-nowrap flex-shrink-0"
                          >
                            {type.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
                      <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-500">
                        {place.rating && (
                          <div className="flex items-center">
                            <StarIcon className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-current mr-1" />
                            <span className="font-medium">{place.rating}</span>
                          </div>
                        )}
                        {place.priceLevel && (
                          <div className="flex items-center">
                            <span className="text-green-600 font-medium">
                              {'$'.repeat(place.priceLevel)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add share functionality
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <svg className="h-3 w-3 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </button>
                      </div>
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

      {/* Category Filter Modal - Mobile Only */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 pt-20 md:hidden">
          <div className="bg-white dark:bg-secondary-800 rounded-lg max-w-md w-full max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-secondary-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filter by Category</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose a category to filter places
                </p>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Categories Grid */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setShowCategoryModal(false);
                    }}
                    className={`group flex flex-col items-center justify-center py-4 px-3 rounded-lg border transition-all duration-300 text-center font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400
                      ${selectedCategory === category.id
                        ? 'bg-primary-600 border-primary-600 shadow-lg'
                        : 'bg-transparent border-gray-300 dark:border-secondary-600 hover:bg-primary-50 dark:hover:bg-secondary-700 hover:border-primary-300'}
                    `}
                  >
                    <span
                      className={`mb-2 transition-colors duration-300
                        ${selectedCategory === category.id ? 'text-white' : 'text-gray-900 dark:text-white group-hover:text-primary-700'}`}
                    >
                      {React.cloneElement(category.icon, {
                        className: `h-8 w-8 mx-auto transition-colors duration-300 ${selectedCategory === category.id ? 'text-white' : 'text-gray-900 dark:text-white group-hover:text-primary-700'}`,
                      })}
                    </span>
                    <span className={`text-sm font-medium transition-colors duration-300 ${selectedCategory === category.id ? 'text-white' : 'text-gray-900 dark:text-white group-hover:text-primary-700'}`}>
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Place Details Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedPlace.displayName?.text || selectedPlace.name}
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
              {selectedPlace.photos && selectedPlace.photos.length > 0 && (
                <img
                  src={getPhotoUrl(selectedPlace.photos[0], 600)}
                  alt={selectedPlace.displayName?.text || selectedPlace.name}
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
                    ({selectedPlace.userRatingCount || selectedPlace.user_ratings_total} reviews)
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedPlace.formattedAddress || selectedPlace.vicinity}
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
                  onClick={() => toggleFavorite(selectedPlace.id)}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                    favorites.has(selectedPlace.id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-secondary-700 dark:text-white dark:hover:bg-secondary-600'
                  }`}
                >
                  {favorites.has(selectedPlace.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                <button className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  Get Directions
                </button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      <div className="mt-16"></div>
      <Footer />
    </div>
  );
};

export default Discover;
