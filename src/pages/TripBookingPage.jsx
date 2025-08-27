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
  const [showNonRefundModal, setShowNonRefundModal] = useState(false);
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
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places', 'marker'], // Use same libraries as ViewTripPage
    preventGoogleFontsLoading: true
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

  const handlePaymentSuccess = async (orderId) => {
    setPaymentOrderId(orderId);
    setPaymentCompleted(true);
    setShowPayment(false);
    console.log('Payment successful:', orderId);
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    setShowPayment(false);
  };

  const handleProceed = () => {
    setShowNonRefundModal(true);
  };

  const handleNonRefundConfirm = async () => {
    setShowNonRefundModal(false);
    if (!paymentCompleted && calculateAdvancePayment() > 0) {
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
      advancePaymentAmount: paymentCompleted ? calculateAdvancePayment() : 0,
      totalAmount: calculateTotal(),
      paymentStatus: paymentCompleted ? 'advance_paid' : 'pending'
    };

    try {
      const response = await axios.post('http://localhost:8095/api/v1/trips/initiate', payload);
      console.log('Trip initiated successfully:', response);
      
      // Show success message with payment details
      const successMessage = paymentCompleted 
        ? `Trip booked successfully! Advance payment of LKR ${calculateAdvancePayment().toLocaleString()} confirmed.`
        : 'Trip booked successfully!';
        
      navigate('/trips', { 
        state: { 
          bookingSuccess: true, 
          message: successMessage,
          paymentDetails: paymentCompleted ? {
            orderId: paymentOrderId,
            amount: calculateAdvancePayment()
          } : null
        } 
      });
    } catch (err) {
      console.error('Error initiating trip:', err);
      
      // Show specific error message
      let errorMessage = 'Failed to complete booking. Please try again.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNonRefundCancel = () => {
    setShowNonRefundModal(false);
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

      {/* Trip Header - blue background behind navbar, pulled up to be visible behind floating navbar */}
      <div className="relative">
        <div className="absolute inset-0 w-full h-[300px] bg-gradient-to-r from-primary-600 to-primary-700 pointer-events-none" style={{ zIndex: 0 }}></div>
        <div className="relative max-w-7xl mx-auto px-4 pt-40 pb-12" style={{ zIndex: 1 }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Booking
                </span>
                <span className="text-white/80 text-sm">
                  {trip.totalDays ? `${trip.totalDays} days` : ''}
                  {Array.isArray(trip.destinations) && trip.destinations.length > 0 ? ` • ${trip.destinations.join(', ')}` : ''}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2 text-white drop-shadow">{trip.name || 'Book Your Trip'}</h1>
              {trip.dates && trip.dates.length === 2 && (
                <p className="text-white/90 text-lg">
                  {new Date(trip.dates[0]).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  {' - '}
                  {new Date(trip.dates[1]).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>
            {/* No edit/share/like buttons for booking page */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Left Side - Booking Content */}
          <div className="w-full md:w-1/2 min-w-0 bg-white rounded-xl border border-gray-200 p-8 overflow-y-auto">
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
                    <div className="relative">
                      <select
                        value={numPassengers}
                        onChange={e => {
                          setNumPassengers(Number(e.target.value));
                          setSelectedVehicle('');
                        }}
                        className="w-full appearance-none bg-white border-2 border-gray-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-50 rounded-lg px-4 py-3 pr-10 text-base font-semibold text-gray-800 shadow-sm transition-all duration-150 cursor-pointer hover:border-primary-50"
                        style={{ minHeight: '48px' }}
                      >
                        {[...Array(15)].map((_, i) => (
                          <option key={i + 1} value={i + 1} className="text-base text-gray-800">
                            {i + 1} Passenger{i === 0 ? '' : 's'}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
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
                    <div className="flex justify-between mt-2">
                      <span className="font-bold">Payment Status</span>
                      <div className="flex items-center">
                        <span className="font-bold text-green-600">✓ Paid</span>
                      </div>
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
                    tripId={tripId} // Pass the tripId prop
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 rounded-full border border-gray-300 bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
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
      {/* Non-Refundable Advance Payment Modal */}
      {showNonRefundModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 relative">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Non-Refundable Advance Payment</h2>
            <p className="text-gray-700 mb-6">
              Please note: <span className="font-semibold">The 50% advance payment will <span className="text-red-600">not be refunded</span> after the trip is confirmed under any circumstances.</span>
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={handleNonRefundCancel}
                className="px-5 py-2 rounded-full border border-gray-300 bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleNonRefundConfirm}
                className="px-5 py-2 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
              >
                I Understand, Continue
              </button>
            </div>
          </div>
        </div>
      )}
              </div>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="w-full md:w-1/2 min-w-0 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-160px)] md:sticky top-32">
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