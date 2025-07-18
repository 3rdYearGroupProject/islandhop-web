import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Share2, Heart, Star, Calendar, Clock, Camera, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExploreCard from '../components/ExploreCard';

const ViewPlacePage = () => {
  const location = useLocation();
  const place = location.state;
  const [isSaved, setIsSaved] = useState(false);
  const [reviewFilter, setReviewFilter] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ stars: 5, text: '' });

  // Scroll to top on mount or when place changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [place]);

  // Mock reviews for Sigiriya
  const [sigiriyaReviews, setSigiriyaReviews] = useState([
    {
      name: 'Ayesha P.',
      initial: 'A',
      avatarColor: 'bg-primary-600',
      stars: 5,
      timeAgo: '2 weeks ago',
      text: 'An unforgettable climb! The views from the top are breathtaking and the frescoes are stunning. Go early to beat the heat and crowds.'
    },
    {
      name: 'Lars M.',
      initial: 'L',
      avatarColor: 'bg-blue-600',
      stars: 4,
      timeAgo: '1 month ago',
      text: 'A must-see in Sri Lanka. The gardens and engineering are impressive. The climb is a bit tough but worth it!'
    },
    {
      name: 'Chen W.',
      initial: 'C',
      avatarColor: 'bg-green-600',
      stars: 5,
      timeAgo: '3 weeks ago',
      text: "Loved the history and the scenery. The Lion's Gate is iconic. Highly recommended for families and solo travelers alike."
    },
    {
      name: 'Samantha R.',
      initial: 'S',
      avatarColor: 'bg-pink-600',
      stars: 5,
      timeAgo: '5 days ago',
      text: 'Absolutely magical! The sunrise from the top was worth the early wake-up. The site is well maintained and the guides are very knowledgeable.'
    },
    {
      name: 'Diego F.',
      initial: 'D',
      avatarColor: 'bg-yellow-600',
      stars: 4,
      timeAgo: '2 months ago',
      text: 'Great for history buffs! The climb is challenging but the view and the story behind Sigiriya make it a must-do. Bring water and a hat!'
    },
  ]);

  const filteredReviews = place?.name === 'Sigiriya Rock Fortress'
    ? (reviewFilter ? sigiriyaReviews.filter(r => r.stars === reviewFilter) : sigiriyaReviews)
    : [];

  const handleReviewInput = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };

  const handleStarSelect = (stars) => {
    setNewReview(prev => ({ ...prev, stars }));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.text.trim()) return;
    // Generate a random guest name and color
    const guestNames = [
      'Guest', 'Traveler', 'Explorer', 'Visitor', 'Adventurer', 'Nomad', 'Wanderer', 'Tourist'
    ];
    const guestColors = [
      'bg-gray-500', 'bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-indigo-500'
    ];
    const randomIdx = Math.floor(Math.random() * guestNames.length);
    const randomColor = guestColors[Math.floor(Math.random() * guestColors.length)];
    const guestName = guestNames[randomIdx];
    setSigiriyaReviews([
      {
        name: guestName,
        initial: guestName.charAt(0),
        avatarColor: randomColor,
        stars: newReview.stars,
        timeAgo: 'Just now',
        text: newReview.text,
      },
      ...sigiriyaReviews,
    ]);
    setShowReviewModal(false);
    setNewReview({ stars: 5, text: '' });
  };

  if (!place) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12 mt-20">
          <p className="text-center text-gray-500">Place not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const toggleSave = () => setIsSaved(!isSaved);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Image Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <img 
          src={place.image} 
          alt={place.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-5xl font-bold mb-2">{place.name}</h1>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-8 right-8 flex gap-3">
          <button className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition">
            <Share2 className="h-5 w-5 text-white" />
          </button>
          <button 
            onClick={toggleSave}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition"
          >
            <Heart className={`h-5 w-5 ${isSaved ? 'text-red-400 fill-current' : 'text-white'}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Info Bar */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                    <span className="font-bold text-lg">{place.rating || '4.8'}</span>
                  </div>
                  <p className="text-gray-500 text-sm">Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-blue-500 mr-1" />
                    <span className="font-bold text-lg">2-4h</span>
                  </div>
                  <p className="text-gray-500 text-sm">Duration</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-5 w-5 text-green-500 mr-1" />
                    <span className="font-bold text-lg">Daily</span>
                  </div>
                  <p className="text-gray-500 text-sm">Open</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-purple-500 mr-1" />
                    <span className="font-bold text-lg">All Ages</span>
                  </div>
                  <p className="text-gray-500 text-sm">Suitable</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold mb-4">About {place.name}</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{place.description}</p>
            </div>

            {/* Sigiriya Article */}
            {place.name === 'Sigiriya Rock Fortress' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold mb-6 text-primary-700">
                  Discovering Sigiriya: The Lion Rock of Sri Lanka
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="mb-6 text-gray-700 leading-relaxed">
                    Rising dramatically from the central plains of Sri Lanka, Sigiriya—also
                    known as the Lion Rock—is one of the country's most iconic landmarks and
                    a UNESCO World Heritage Site. This ancient rock fortress, standing nearly
                    200 meters tall, is both a marvel of engineering and a testament to the
                    island's rich history.
                  </p>
                  <h3 className="text-xl font-semibold mb-3 mt-8 text-gray-900">
                    A Royal Citadel in the Sky
                  </h3>
                  <p className="mb-6 text-gray-700 leading-relaxed">
                    Sigiriya was transformed into a royal citadel by King Kashyapa in the 5th
                    century AD. The king chose this massive column of rock as his palace and
                    fortress, constructing elaborate gardens, moats, and ramparts at its
                    base. The summit, accessible via a series of staircases and walkways,
                    once housed the king's palace and offered breathtaking panoramic views of
                    the surrounding jungle.
                  </p>
                  <h3 className="text-xl font-semibold mb-3 mt-8 text-gray-900">
                    The World-Famous Frescoes
                  </h3>
                  <p className="mb-6 text-gray-700 leading-relaxed">
                    Halfway up the rock, visitors encounter the world-renowned Sigiriya
                    frescoes—vivid paintings of celestial maidens, or "Apsaras," that have
                    survived for over 1,500 years. These masterpieces are considered some of
                    the finest examples of ancient Sri Lankan art.
                  </p>
                  <h3 className="text-xl font-semibold mb-3 mt-8 text-gray-900">
                    The Mirror Wall and Lion's Gate
                  </h3>
                  <p className="mb-6 text-gray-700 leading-relaxed">
                    The Mirror Wall, once polished to a gleaming finish, still bears ancient
                    graffiti from visitors dating back centuries. Further up, the entrance to
                    the summit is marked by the massive Lion's Gate, where only the giant
                    paws remain today—remnants of a colossal lion statue that once guarded
                    the stairway.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 mt-8">
                    <p className="text-blue-800 font-medium">
                      💡 Tip: Visit early in the morning or late afternoon to avoid crowds and
                      enjoy cooler temperatures during your ascent.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Booking Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold mb-4">Plan Your Visit</h3>
                <div className="space-y-4">
                  <button className="w-full bg-primary-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-primary-700 transition">
                    Book a Tour
                  </button>
                  <button className="w-full border-2 border-primary-600 text-primary-600 py-3 px-6 rounded-full font-semibold hover:bg-primary-50 transition">
                    Add to Trip
                  </button>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3">Best Time to Visit</h4>
                  <p className="text-sm text-gray-600">December to March for ideal weather conditions</p>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold mb-4">Quick Facts</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entry Fee:</span>
                    <span className="font-medium">$30 USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Height:</span>
                    <span className="font-medium">200 meters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Built:</span>
                    <span className="font-medium">5th Century AD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">UNESCO:</span>
                    <span className="font-medium">World Heritage</span>
                  </div>
                </div>
              </div>

              {/* Location Map Placeholder */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold mb-4">Location</h3>
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <p className="text-gray-500">Interactive Map Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings & Reviews Section */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Ratings & Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-4xl font-bold text-yellow-500 mr-3">
                  {place.rating ? place.rating.toFixed(1) : '4.8'}
                </span>
                <div>
                  <div className="flex items-center mb-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`h-5 w-5 ${i <= Math.round(place.rating || 4.8) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-gray-600">Based on {place.reviewCount || 1024} reviews</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {[5,4,3,2,1].map(stars => (
                <div key={stars} className="flex items-center text-sm">
                  <span className="w-8">{stars}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 3 : 2}%`}}
                    ></div>
                  </div>
                  <span className="text-gray-600 w-10">{stars === 5 ? '70%' : stars === 4 ? '20%' : '5%'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Filter, Write Button & Sample Reviews */}
          {place.name === 'Sigiriya Rock Fortress' && (
            <>
              <div className="flex flex-wrap gap-2 mb-4 items-center">
                <span className="font-medium text-gray-700 mr-2">Filter by rating:</span>
                {[5,4,3,2,1].map(star => (
                  <button
                    key={star}
                    onClick={() => setReviewFilter(star)}
                    className={`px-3 py-1 rounded-full border text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary-300 ${reviewFilter === star ? 'bg-yellow-400 text-white border-yellow-400' : 'bg-white text-gray-700 border-gray-300 hover:bg-yellow-50'}`}
                  >
                    {star} <Star className="inline h-4 w-4 mb-0.5" />
                  </button>
                ))}
                <button
                  onClick={() => setReviewFilter(null)}
                  className={`px-3 py-1 rounded-full border text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary-300 ${reviewFilter === null ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-primary-50'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="ml-auto px-4 py-2 rounded-full bg-primary-600 text-white font-semibold shadow-sm hover:bg-primary-700 transition"
                >
                  Write a Review
                </button>
              </div>
              {/* Review Modal */}
              {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                      onClick={() => setShowReviewModal(false)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                    <h3 className="text-xl font-bold mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmitReview}>
                      {/* No name input needed */}
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Your Rating</label>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(star => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => handleStarSelect(star)}
                              className="focus:outline-none"
                            >
                              <Star className={`h-7 w-7 ${newReview.stars >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Your Review</label>
                        <textarea
                          name="text"
                          value={newReview.text}
                          onChange={handleReviewInput}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
                          rows={4}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-primary-600 text-white py-2 rounded-full font-semibold hover:bg-primary-700 transition"
                      >
                        Submit Review
                      </button>
                    </form>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {filteredReviews.map((review, idx) => (
                  <div key={idx} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 ${review.avatarColor}`}>{review.initial}</div>
                      <div>
                        <p className="font-semibold">{review.name}</p>
                        <div className="flex items-center">
                          {[...Array(review.stars)].map((_, i) => (<Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />))}
                          {[...Array(5 - review.stars)].map((_, i) => (<Star key={i} className="h-4 w-4 text-gray-300" />))}
                          <span className="text-sm text-gray-500 ml-2">{review.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.text}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Similar Places Section */}
      {place && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Similar Places</h2>
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {getSimilarPlaces(place).map((sim, idx) => (
              <div key={idx} className="flex-shrink-0 w-72">
                <ExploreCard
                  image={sim.image}
                  title={sim.name}
                  rating={sim.rating}
                  reviewCount={sim.reviewCount || 0}
                  // No price
                  onClick={() => handleSimilarPlaceClick(sim)}
                  className="flex-shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

// Example similar places data and logic
const allPlaces = [
  {
    name: 'Dambulla Cave Temple',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewCount: 800,
    description: 'A UNESCO World Heritage Site, famous for its stunning cave temples and Buddhist murals.'
  },
  {
    name: 'Pidurangala Rock',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    reviewCount: 650,
    description: 'A popular hike near Sigiriya, offering panoramic views of the Lion Rock and the surrounding jungle.'
  },
  {
    name: 'Polonnaruwa Ancient City',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewCount: 1200,
    description: 'The ruins of Sri Lanka’s medieval capital, with impressive temples, statues, and reservoirs.'
  },
  {
    name: 'Anuradhapura',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewCount: 950,
    description: 'An ancient city and UNESCO site, known for its well-preserved ruins of Sri Lankan civilization.'
  },
  {
    name: 'Yapahuwa Rock Fortress',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    rating: 4.4,
    reviewCount: 400,
    description: 'A lesser-known rock fortress with a dramatic staircase and panoramic views.'
  },
  {
    name: 'Ritigala Forest Monastery',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    reviewCount: 320,
    description: 'Ancient Buddhist monastery ruins hidden in a lush forest reserve.'
  },
  {
    name: 'Mihintale',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    reviewCount: 410,
    description: 'A mountain peak with religious significance, considered the cradle of Buddhism in Sri Lanka.'
  },
  {
    name: 'Kandy Lake',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    reviewCount: 700,
    description: 'A scenic lake in the heart of Kandy, perfect for a relaxing stroll.'
  },
  {
    name: 'Sigiriya Museum',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    rating: 4.3,
    reviewCount: 210,
    description: 'A modern museum with artifacts and exhibits about the Sigiriya Rock Fortress.'
  },
  {
    name: 'Kaudulla National Park',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewCount: 540,
    description: 'A wildlife park famous for elephant gatherings and bird watching.'
  },
];

function getSimilarPlaces(currentPlace) {
  // For demo, return all places except the current one
  return allPlaces.filter(p => p.name !== currentPlace.name);
}

function handleSimilarPlaceClick(place) {
  // For demo, just alert. In a real app, navigate to the place detail page.
  alert(`Navigate to details for ${place.name}`);
}

export default ViewPlacePage;
