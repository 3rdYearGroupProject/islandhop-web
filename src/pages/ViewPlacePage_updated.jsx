import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Share2, Heart, Star, Calendar, Clock, Camera, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ViewPlacePage = () => {
  const location = useLocation();
  const place = location.state;
  const [isSaved, setIsSaved] = useState(false);

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
          <div className="flex items-center text-lg">
            <MapPin className="h-5 w-5 mr-2" />
            <span>Sri Lanka</span>
          </div>
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
            <div className="bg-white rounded-2xl shadow-md p-6">
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
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">About {place.name}</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{place.description}</p>
            </div>

            {/* Sigiriya Article */}
            {place.name === 'Sigiriya Rock Fortress' && (
              <div className="bg-white rounded-2xl shadow-md p-6">
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
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Plan Your Visit</h3>
                <div className="space-y-4">
                  <button className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition">
                    Book a Tour
                  </button>
                  <button className="w-full border-2 border-primary-600 text-primary-600 py-3 px-4 rounded-lg font-semibold hover:bg-primary-50 transition">
                    Add to Trip
                  </button>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3">Best Time to Visit</h4>
                  <p className="text-sm text-gray-600">December to March for ideal weather conditions</p>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="bg-white rounded-2xl shadow-md p-6">
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
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Location</h3>
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <p className="text-gray-500">Interactive Map Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings & Reviews Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-md p-8">
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

          {/* Sample Reviews */}
          {place.name === 'Sigiriya Rock Fortress' && (
            <div className="space-y-6">
              <div className="border-l-4 border-primary-500 bg-gray-50 p-6 rounded-r-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    A
                  </div>
                  <div>
                    <p className="font-semibold">Ayesha P.</p>
                    <div className="flex items-center">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">2 weeks ago</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">"An unforgettable climb! The views from the top are breathtaking and the frescoes are stunning. Go early to beat the heat and crowds."</p>
              </div>
              
              <div className="border-l-4 border-blue-500 bg-gray-50 p-6 rounded-r-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    L
                  </div>
                  <div>
                    <p className="font-semibold">Lars M.</p>
                    <div className="flex items-center">
                      {[1,2,3,4].map(i => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                      <Star className="h-4 w-4 text-gray-300" />
                      <span className="text-sm text-gray-500 ml-2">1 month ago</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">"A must-see in Sri Lanka. The gardens and engineering are impressive. The climb is a bit tough but worth it!"</p>
              </div>

              <div className="border-l-4 border-green-500 bg-gray-50 p-6 rounded-r-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    C
                  </div>
                  <div>
                    <p className="font-semibold">Chen W.</p>
                    <div className="flex items-center">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">3 weeks ago</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">"Loved the history and the scenery. The Lion's Gate is iconic. Highly recommended for families and solo travelers alike."</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ViewPlacePage;
