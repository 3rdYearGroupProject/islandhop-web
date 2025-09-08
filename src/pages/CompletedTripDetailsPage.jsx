import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, Star, Clock, User, Car, Map } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCityImageUrl } from '../utils/imageUtils';

const CompletedTripDetailsPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get trip data from location state or fetch it
  const [tripData, setTripData] = useState(location.state?.trip || null);
  const [loading, setLoading] = useState(!location.state?.trip);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Review states
  const [showDriverReview, setShowDriverReview] = useState(false);
  const [showGuideReview, setShowGuideReview] = useState(false);
  const [driverRating, setDriverRating] = useState(0);
  const [guideRating, setGuideRating] = useState(0);
  const [driverReviewText, setDriverReviewText] = useState('');
  const [guideReviewText, setGuideReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch trip data if not provided in location state
  useEffect(() => {
    const fetchTripData = async () => {
      if (tripData) return;
      
      try {
        setLoading(true);
        // You would typically fetch the specific trip data here
        // For now, we'll use the originalData from the trip object
        const response = await fetch(`http://localhost:4015/api/trip-details/${tripId}`);
        if (response.ok) {
          const data = await response.json();
          setTripData(data);
        } else {
          setError('Failed to fetch trip details');
        }
      } catch (err) {
        setError('Error fetching trip details');
        console.error('Error fetching trip:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId, tripData]);

  // Initialize review states from trip data
  useEffect(() => {
    if (tripData) {
      const originalData = tripData._originalData || tripData;
      setDriverReviewText(originalData.driver_review || '');
      setGuideReviewText(originalData.guide_review || '');
      // Set default ratings for new reviews (only used when creating new reviews)
      if (!originalData.driver_reviewed) {
        setDriverRating(0);
      }
      if (!originalData.guide_reviewed) {
        setGuideRating(0);
      }
    }
  }, [tripData]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateObj) => {
    if (!dateObj) return 'N/A';
    try {
      const date = dateObj.$date ? new Date(dateObj.$date) : new Date(dateObj);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const calculateTotalDistance = (dailyPlans) => {
    if (!dailyPlans || !Array.isArray(dailyPlans)) return 0;
    
    return dailyPlans.reduce((total, day) => {
      const startMeter = day.start_meter_read || 0;
      const endMeter = day.end_meter_read || 0;
      return total + (endMeter - startMeter);
    }, 0);
  };

  const submitReview = async (type) => {
    const originalData = tripData._originalData || tripData;
    
    // Check if user is authenticated
    if (!currentUser) {
      alert('Please log in to submit a review.');
      return;
    }
    
    try {
      setSubmittingReview(true);
      
      const reviewText = type === 'driver' ? driverReviewText : guideReviewText;
      const rating = type === 'driver' ? driverRating : guideRating;
      const email = type === 'driver' ? originalData.driver_email : originalData.guide_email;
      
      // Validate inputs
      if (!reviewText.trim()) {
        alert('Please write a review before submitting.');
        return;
      }
      
      if (rating === 0) {
        alert('Please provide a rating before submitting.');
        return;
      }
      
      if (!email) {
        alert(`No ${type} email found for this trip.`);
        return;
      }
      
      // Prepare data for both endpoints
      const generalReviewData = {
        email: email,
        review: reviewText,
        reviewerEmail: currentUser?.email || "user@example.com",
        reviewerFirstname: currentUser?.displayName?.split(' ')[0] || "User",
        reviewerLastname: currentUser?.displayName?.split(' ')[1] || "Name",
        rating: rating
      };
      
      const tripSpecificReviewData = {
        tripId: originalData._id || originalData.id,
        review: reviewText
      };
      
      // Determine endpoints based on type
      const generalEndpoint = type === 'driver' 
        ? 'http://localhost:8082/api/v1/reviews/drivers'
        : 'http://localhost:8082/api/v1/reviews/guides';
      
      const tripSpecificEndpoint = type === 'driver'
        ? 'http://localhost:4015/api/driver-review'
        : 'http://localhost:4015/api/guide-review';
      
      console.log(`Submitting ${type} review to both endpoints...`);
      console.log('General review data:', generalReviewData);
      console.log('Trip-specific review data:', tripSpecificReviewData);
      
      // Submit to both endpoints
      const [generalResponse, tripSpecificResponse] = await Promise.all([
        fetch(generalEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(generalReviewData)
        }),
        fetch(tripSpecificEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tripSpecificReviewData)
        })
      ]);

      console.log('General review response:', generalResponse.status, generalResponse.statusText);
      console.log('Trip-specific review response:', tripSpecificResponse.status, tripSpecificResponse.statusText);

      // Check if both requests were successful
      if (generalResponse.ok && tripSpecificResponse.ok) {
        // Update local state to reflect the review submission
        const updatedTripData = { ...tripData };
        const updatedOriginalData = { ...originalData };
        
        if (type === 'driver') {
          updatedOriginalData.driver_reviewed = 1;
          updatedOriginalData.driver_review = reviewText;
          setShowDriverReview(false);
          setDriverReviewText('');
          setDriverRating(0);
        } else {
          updatedOriginalData.guide_reviewed = 1;
          updatedOriginalData.guide_review = reviewText;
          setShowGuideReview(false);
          setGuideReviewText('');
          setGuideRating(0);
        }
        
        updatedTripData._originalData = updatedOriginalData;
        setTripData(updatedTripData);
        
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} review submitted successfully!`);
      } else {
        let errorMessage = `Failed to submit ${type} review. `;
        if (!generalResponse.ok) {
          errorMessage += `General review failed (${generalResponse.status}). `;
        }
        if (!tripSpecificResponse.ok) {
          errorMessage += `Trip-specific review failed (${tripSpecificResponse.status}).`;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error(`Error submitting ${type} review:`, err);
      alert(`Failed to submit ${type} review. Please try again.`);
    } finally {
      setSubmittingReview(false);
    }
  };

  const StarRating = ({ rating, setRating, readonly = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && setRating(star)}
            className={`p-1 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trip details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !tripData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The requested trip could not be found.'}</p>
            <button
              onClick={() => navigate('/trips')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Trips
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const originalData = tripData._originalData || tripData;
  const totalDistance = calculateTotalDistance(originalData.dailyPlans);
  const cityImage = getCityImageUrl(originalData.baseCity || 'Sri Lanka');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/trips')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to My Trips
          </button>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative h-64 md:h-80">
              <img
                src={cityImage}
                alt={originalData.baseCity}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full font-semibold">
                    Completed
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{originalData.tripName}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {originalData.baseCity}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(originalData.startDate)} - {formatDate(originalData.endDate)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  ${originalData.payedAmount?.toLocaleString() || '0'}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Distance</p>
                <p className="text-2xl font-bold text-blue-600">{totalDistance} km</p>
              </div>
              <Map className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vehicle Type</p>
                <p className="text-lg font-semibold text-gray-800">{originalData.vehicleType}</p>
              </div>
              <Car className="h-8 w-8 text-gray-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Trip Duration</p>
                <p className="text-lg font-semibold text-gray-800">
                  {originalData.dailyPlans?.length || 0} Days
                </p>
              </div>
              <Clock className="h-8 w-8 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Daily Plans */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Itinerary</h2>
          <div className="space-y-6">
            {originalData.dailyPlans?.map((day, index) => (
              <div key={day.day} className="border rounded-xl p-6 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-blue-900">Day {day.day} - {day.city}</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Completed
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Start Time</p>
                    <p className="font-medium">{formatDateTime(day.start)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Time</p>
                    <p className="font-medium">{formatDateTime(day.end)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Odometer</p>
                    <p className="font-medium">{day.start_meter_read || 0} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Odometer</p>
                    <p className="font-medium">{day.end_meter_read || 0} km</p>
                  </div>
                </div>

                {day.deduct_amount > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Deduction:</strong> ${day.deduct_amount}
                      {day.additional_note && (
                        <span className="block mt-1">{day.additional_note}</span>
                      )}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Attractions Visited</h4>
                  <div className="space-y-2">
                    {day.attractions?.map((attraction, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-700">{attraction.name}</span>
                        {attraction.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{attraction.rating}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Driver Review */}
          {originalData.driverNeeded === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Car className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900">Driver Review</h2>
              </div>

              {originalData.driver_reviewed === 1 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold">✓ Review Already Submitted</span>
                  </div>
                  {originalData.driver_review && originalData.driver_review.trim() !== "" ? (
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <h4 className="font-semibold text-gray-900 mb-2">Your Review:</h4>
                      <p className="text-gray-700 italic">"{originalData.driver_review}"</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                      <p className="text-gray-500 italic">Review submitted without comments</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">How was your experience with the driver?</p>
                  <button
                    onClick={() => setShowDriverReview(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Write Driver Review
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Guide Review */}
          {originalData.guideNeeded === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="h-6 w-6 text-green-500" />
                <h2 className="text-xl font-bold text-gray-900">Guide Review</h2>
              </div>

              {originalData.guide_reviewed === 1 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold">✓ Review Already Submitted</span>
                  </div>
                  {originalData.guide_review && originalData.guide_review.trim() !== "" ? (
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                      <h4 className="font-semibold text-gray-900 mb-2">Your Review:</h4>
                      <p className="text-gray-700 italic">"{originalData.guide_review}"</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                      <p className="text-gray-500 italic">Review submitted without comments</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">How was your experience with the guide?</p>
                  <button
                    onClick={() => setShowGuideReview(true)}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Write Guide Review
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Driver Review Modal */}
        {showDriverReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rate Your Driver</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <StarRating rating={driverRating} setRating={setDriverRating} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review (Optional)
                  </label>
                  <textarea
                    value={driverReviewText}
                    onChange={(e) => setDriverReviewText(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share your experience with the driver..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDriverReview(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={submittingReview}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => submitReview('driver')}
                    disabled={driverRating === 0 || submittingReview || !currentUser || !driverReviewText.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guide Review Modal */}
        {showGuideReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rate Your Guide</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <StarRating rating={guideRating} setRating={setGuideRating} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review (Optional)
                  </label>
                  <textarea
                    value={guideReviewText}
                    onChange={(e) => setGuideReviewText(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Share your experience with the guide..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowGuideReview(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={submittingReview}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => submitReview('guide')}
                    disabled={guideRating === 0 || submittingReview || !currentUser || !guideReviewText.trim()}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CompletedTripDetailsPage;
