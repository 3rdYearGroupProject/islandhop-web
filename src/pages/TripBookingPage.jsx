import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Car, Bus, Truck, ShipWheel, Compass } from 'lucide-react';
import axios from 'axios';
import { getUserData } from '../utils/userStorage';
import { getCityImageUrl, placeholderImage, logImageError } from '../utils/imageUtils';
import { tripPlanningApi } from '../api/axios';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentForm from '../components/PaymentForm';

const TripBookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tripId } = useParams();
  const tripData = location.state?.trip;
  const userData = getUserData();
  const userId = userData?.uid || null;

  // State for booking preferences
  const [needDriver, setNeedDriver] = useState(false);
  const [needGuide, setNeedGuide] = useState(false);
  const [numPassengers, setNumPassengers] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentOrderId, setPaymentOrderId] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [fetchingPrices, setFetchingPrices] = useState(false);
  const [priceError, setPriceError] = useState(null);

  // Map state
  const [places, setPlaces] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 7.8731, lng: 80.7718 });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [trip, setTrip] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Google Maps API loading
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''
  });

  // Load PayHere script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.payhere.lk/lib/payhere.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      console.log('PayHere script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load PayHere script');
    };
    document.head.appendChild(script); // Use head instead of body

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Check for authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load trip data
  useEffect(() => {
    const loadTrip = async () => {
      setLoading(true);
      
      try {
        if (tripId && currentUserId) {
          const response = await tripPlanningApi.get(`/itinerary/${tripId}?userId=${currentUserId}`);
          
          if (response.data && response.data.status === 'success') {
            // Extract all places from the daily plans for the map
            const allPlaces = [];
            response.data.dailyPlans.forEach(day => {
              // Add attractions
              if (day.attractions && day.attractions.length > 0) {
                day.attractions.forEach(attraction => {
                  if (attraction.location && attraction.location.lat && attraction.location.lng) {
                    allPlaces.push({
                      ...attraction,
                      dayNumber: day.day,
                      placeType: 'attraction'
                    });
                  }
                });
              }
              
              // Add hotels
              if (day.hotels && day.hotels.length > 0) {
                day.hotels.forEach(hotel => {
                  if (hotel.location && hotel.location.lat && hotel.location.lng) {
                    allPlaces.push({
                      ...hotel,
                      dayNumber: day.day,
                      placeType: 'hotel'
                    });
                  }
                });
              }
              
              // Add restaurants
              if (day.restaurants && day.restaurants.length > 0) {
                day.restaurants.forEach(restaurant => {
                  if (restaurant.location && restaurant.location.lat && restaurant.location.lng) {
                    allPlaces.push({
                      ...restaurant,
                      dayNumber: day.day,
                      placeType: 'restaurant'
                    });
                  }
                });
              }
            });
            
            setPlaces(allPlaces);
            
            // Set map center to first place
            if (allPlaces.length > 0 && allPlaces[0].location) {
              setMapCenter({
                lat: allPlaces[0].location.lat,
                lng: allPlaces[0].location.lng
              });
            }
            
            // Transform API response to match trip structure
            const transformedTrip = {
              id: response.data.tripId,
              name: `Trip to ${response.data.destination}`,
              dates: [response.data.startDate, response.data.endDate],
              totalDays: response.data.numberOfDays,
              destinations: [response.data.destination],
              coverImage: getCityImageUrl(response.data.destination),
              apiData: response.data
            };
            
            setTrip(transformedTrip);
          }
        } else if (tripData) {
          setTrip(tripData);
          // If using mock data, set default places
          setPlaces([]);
        }
      } catch (error) {
        console.error('Error loading trip:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [tripId, currentUserId, tripData]);

  // Fetch vehicles when driver is needed
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:8091/api/v1/admin/vehicle-types');
        if (response.status === 200 && response.data && response.data.data) {
          setVehicles(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setVehicles([]);
      }
    };

    if (needDriver) {
      fetchVehicles();
    }
  }, [needDriver]);

  // Fetch cost breakdown when preferences change
  useEffect(() => {
    const fetchCostBreakdown = async () => {
      if (!needDriver && !needGuide) {
        setPriceData(null);
        return;
      }

      if (needDriver && !selectedVehicle) {
        setPriceData(null);
        return;
      }

      setFetchingPrices(true);
      setPriceError(null);

      try {
        let preferredVehicleTypeId = null;
        if (needDriver && selectedVehicle) {
          const vehicleObj = vehicles.find((v) => v.typeName === selectedVehicle);
          preferredVehicleTypeId = vehicleObj ? vehicleObj.id : null;
        }

        const payload = {
          userId,
          tripId,
          preferredVehicleTypeId,
          setGuide: needGuide ? 1 : 0,
          setDriver: needDriver ? 1 : 0,
        };

        const response = await axios.post('http://localhost:8095/api/v1/trips/initiate', payload);
        console.log('Cost breakdown response:', response.data);

        if (response.data) {
          setPriceData(response.data);
        } else {
          setPriceError('Failed to fetch cost breakdown');
        }
      } catch (err) {
        console.error('Error fetching cost breakdown:', err);
        setPriceError('Failed to fetch cost breakdown. Please try again.');
      } finally {
        setFetchingPrices(false);
      }
    };

    fetchCostBreakdown();
  }, [needDriver, needGuide, selectedVehicle, vehicles, tripId, userId]);

  // Map functions
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '400px',
  };

  const getMarkerIcon = (placeType) => {
    switch (placeType) {
      case 'attraction':
        return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      case 'hotel':
        return 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
      case 'restaurant':
        return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
      default:
        return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    }
  };

  const handleMarkerClick = (place) => {
    setSelectedMarker(place);
    if (place.location) {
      setMapCenter({
        lat: place.location.lat,
        lng: place.location.lng
      });
    }
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  // Booking functions
  const calculateTotal = () => {
    if (!priceData) return 0;
    return (priceData.averageDriverCost || 0) + (priceData.averageGuideCost || 0);
  };

  const calculateAdvancePayment = () => {
    return calculateTotal() * 0.5;
  };

  const handlePaymentSuccess = (orderId) => {
    setPaymentOrderId(orderId);
    setPaymentCompleted(true);
    setShowPayment(false);
    console.log('Payment successful:', orderId);
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    setShowPayment(false);
  };

  const handleProceed = async () => {
    if (!paymentCompleted && calculateAdvancePayment() > 0) {
      // Simply show the payment form
      setShowPayment(true);
      return;
    }

    // Complete booking after payment
    setSubmitting(true);
    let preferredVehicleTypeId = null;
    if (needDriver && selectedVehicle) {
      const vehicleObj = vehicles.find(v => v.typeName === selectedVehicle);
      preferredVehicleTypeId = vehicleObj ? vehicleObj.id : null;
    }

    const payload = {
      userId,
      tripId,
      preferredVehicleTypeId,
      setGuide: needGuide ? 1 : 0,
      setDriver: needDriver ? 1 : 0,
      paymentOrderId,
    };

    try {
      const response = await axios.post('http://localhost:8095/api/v1/trips/initiate', payload);
      console.log('Trip initiated successfully:', response);
      navigate('/trips', { state: { bookingSuccess: true } });
    } catch (err) {
      console.error('Error initiating trip:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/trip/${tripId}`, { state: { trip: tripData } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Trip not found</p>
          <button 
            onClick={() => navigate('/trips')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* Trip Header */}
      <div className="relative">
        <div className="absolute inset-0 w-full h-[200px] bg-gradient-to-r from-primary-600 to-primary-700 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-white drop-shadow">Book Your Trip</h1>
            <p className="text-white/90 text-lg">{trip.name}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8 h-[calc(100vh-300px)]">
          {/* Left Side - Booking Content */}
          <div className="w-1/2 bg-white rounded-xl shadow-lg border border-gray-200 p-8 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Trip Preferences</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 mb-4">Please select your preferences for this trip:</p>
              
              {/* Driver/Guide Selection */}
              <div className="grid grid-cols-1 gap-4">
                <button
                  type="button"
                  className={`px-6 py-4 rounded-lg border-2 font-semibold transition-colors duration-150 focus:outline-none text-left flex items-center
                    ${needDriver ? 'bg-blue-100 text-blue-900 border-blue-600' : 'bg-white text-gray-800 border-gray-300 hover:bg-primary-50'}`}
                  onClick={() => setNeedDriver(!needDriver)}
                >
                  <ShipWheel className="mr-3" size={28} strokeWidth={2.2} />
                  <div className="flex flex-col items-start">
                    <span className="font-bold mb-1 text-base">Driver</span>
                    <span className={`text-xs ${needDriver ? 'text-blue-800' : 'text-gray-500'}`}>
                      {needDriver ? 'Driver Needed' : 'No Driver'}
                    </span>
                  </div>
                </button>
                
                <button
                  type="button"
                  className={`px-6 py-4 rounded-lg border-2 font-semibold transition-colors duration-150 focus:outline-none text-left flex items-center
                    ${needGuide ? 'bg-blue-100 text-blue-900 border-blue-600' : 'bg-white text-gray-800 border-gray-300 hover:bg-primary-50'}`}
                  onClick={() => setNeedGuide(!needGuide)}
                >
                  <Compass className="mr-3" size={28} strokeWidth={2.2} />
                  <div className="flex flex-col items-start">
                    <span className="font-bold mb-1 text-base">Guide</span>
                    <span className={`text-xs ${needGuide ? 'text-blue-800' : 'text-gray-500'}`}>
                      {needGuide ? 'Guide Needed' : 'No Guide'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Passenger and Vehicle Selection */}
              {needDriver && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Number of Passengers</label>
                    <select
                      value={numPassengers}
                      onChange={e => {
                        setNumPassengers(Number(e.target.value));
                        setSelectedVehicle('');
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {[...Array(15)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Passenger{i === 0 ? '' : 's'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Vehicle Type</label>
                    <div className="grid grid-cols-1 gap-3">
                      {vehicles.map(vehicle => {
                        const isSelected = selectedVehicle === vehicle.typeName;
                        const isInvalid = isSelected && vehicle.capacity < numPassengers;
                        
                        let icon = <Car className="mr-3" size={28} strokeWidth={2.2} />;
                        if (/van/i.test(vehicle.typeName)) {
                          icon = <Truck className="mr-3" size={28} strokeWidth={2.2} />;
                        } else if (/bus/i.test(vehicle.typeName)) {
                          icon = <Bus className="mr-3" size={28} strokeWidth={2.2} />;
                        }

                        return (
                          <button
                            key={vehicle.id}
                            type="button"
                            className={`px-6 py-4 rounded-lg border-2 font-semibold transition-colors duration-150 focus:outline-none text-left flex items-center
                              ${isSelected ? (isInvalid ? 'border-red-600 bg-white text-red-600' : 'bg-blue-100 text-blue-900 border-blue-600') : 'bg-white text-gray-800 border-gray-300 hover:bg-primary-50'}`}
                            onClick={() => setSelectedVehicle(vehicle.typeName)}
                            disabled={submitting}
                          >
                            {icon}
                            <div className="flex flex-col items-start">
                              <span className="font-bold mb-1">{vehicle.typeName}</span>
                              <span className={`text-xs ${isSelected ? (isInvalid ? 'text-red-600' : 'text-blue-800') : 'text-gray-500'}`}>
                                Capacity: {vehicle.capacity} passengers
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Cost Breakdown */}
              <div className="bg-gray-50 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Cost Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Driver</span>
                    <span className="font-medium">LKR {priceData ? priceData.averageDriverCost.toLocaleString() : '0.00'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Guide</span>
                    <span className="font-medium">LKR {priceData ? priceData.averageGuideCost.toLocaleString() : '0.00'}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-900 font-bold">Total</span>
                    <span className="font-bold text-primary-700 text-lg">LKR {calculateTotal().toLocaleString()}.00</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-900 font-bold">Advance Payment (50%)</span>
                    <span className="font-bold text-primary-600 text-lg">LKR {calculateAdvancePayment().toLocaleString()}.00</span>
                  </div>
                  {paymentCompleted && (
                    <div className="flex justify-between mt-2 text-green-600">
                      <span className="font-bold">Payment Status</span>
                      <span className="font-bold">✓ Paid</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    You must pay 50% of the total cost before the start of your trip.
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              {showPayment && calculateAdvancePayment() > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Payment Details</h3>
                  <PaymentForm
                    totalAmount={calculateAdvancePayment()} // Dynamically updating the payment amount
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    submitting={submitting}
                    setSubmitting={setSubmitting}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                {!showPayment && (
                  <button
                    onClick={handleProceed}
                    className={`flex-1 px-6 py-3 rounded-full font-semibold transition-colors ${
                      paymentCompleted 
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                    disabled={submitting || (needDriver && !selectedVehicle)}
                  >
                    {submitting 
                      ? 'Processing...' 
                      : paymentCompleted 
                        ? 'Complete Booking' 
                        : calculateAdvancePayment() > 0 
                          ? `Pay LKR ${calculateAdvancePayment().toLocaleString()}.00 & Proceed`
                          : 'Yes, Proceed'
                    }
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="w-1/2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {isLoaded ? (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-bold text-lg">Trip Map</h2>
                  <p className="text-sm text-gray-500">Your trip destinations</p>
                </div>
                <div className="flex-1">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={12}
                    options={{
                      fullscreenControl: true,
                      streetViewControl: true,
                      mapTypeControl: true,
                      zoomControl: true,
                    }}
                  >
                    {places.map((place, index) => (
                      <Marker
                        key={`${place.name}-${index}`}
                        position={{
                          lat: place.location.lat,
                          lng: place.location.lng
                        }}
                        onClick={() => handleMarkerClick(place)}
                        icon={getMarkerIcon(place.placeType)}
                        title={place.name}
                      />
                    ))}
                    {selectedMarker && (
                      <InfoWindow
                        position={{
                          lat: selectedMarker.location.lat,
                          lng: selectedMarker.location.lng
                        }}
                        onCloseClick={handleInfoWindowClose}
                      >
                        <div className="p-2">
                          <h3 className="font-bold">{selectedMarker.name}</h3>
                          <p className="text-sm">{selectedMarker.type}</p>
                          {selectedMarker.rating && (
                            <div className="flex items-center mt-1">
                              <span className="text-yellow-500">★</span>
                              <span className="ml-1 text-sm">{selectedMarker.rating}</span>
                            </div>
                          )}
                          <img 
                            src={getCityImageUrl(selectedMarker.name || 'Sri Lanka')}
                            alt={selectedMarker.name} 
                            className="mt-2 w-full h-24 object-cover rounded"
                            onError={(e) => {
                              logImageError('TripBookingPage InfoWindow', selectedMarker, e.target.src);
                              e.target.src = placeholderImage;
                            }}
                          />
                          <div className="mt-2 text-sm">
                            <p className="text-blue-600">Day {selectedMarker.dayNumber}</p>
                          </div>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </div>
                <div className="p-3 border-t border-gray-100">
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-xs">Attractions</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                      <span className="text-xs">Hotels</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-xs">Restaurants</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="font-medium">Loading Map...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TripBookingPage;