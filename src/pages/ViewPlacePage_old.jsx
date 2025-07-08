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
          <article className="mt-10 bg-gray-50 rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-primary-700">
              Discovering Sigiriya: The Lion Rock of Sri Lanka
            </h2>
            <p className="mb-4 text-gray-800">
              Rising dramatically from the central plains of Sri Lanka, Sigiriya—also
              known as the Lion Rock—is one of the country’s most iconic landmarks and
              a UNESCO World Heritage Site. This ancient rock fortress, standing nearly
              200 meters tall, is both a marvel of engineering and a testament to the
              island’s rich history.
            </p>
            <h3 className="text-xl font-semibold mb-2 mt-6">
              A Royal Citadel in the Sky
            </h3>
            <p className="mb-4 text-gray-800">
              Sigiriya was transformed into a royal citadel by King Kashyapa in the 5th
              century AD. The king chose this massive column of rock as his palace and
              fortress, constructing elaborate gardens, moats, and ramparts at its
              base. The summit, accessible via a series of staircases and walkways,
              once housed the king’s palace and offered breathtaking panoramic views of
              the surrounding jungle.
            </p>
            <h3 className="text-xl font-semibold mb-2 mt-6">
              The World-Famous Frescoes
            </h3>
            <p className="mb-4 text-gray-800">
              Halfway up the rock, visitors encounter the world-renowned Sigiriya
              frescoes—vivid paintings of celestial maidens, or "Apsaras," that have
              survived for over 1,500 years. These masterpieces are considered some of
              the finest examples of ancient Sri Lankan art.
            </p>
            <h3 className="text-xl font-semibold mb-2 mt-6">
              The Mirror Wall and Lion’s Gate
            </h3>
            <p className="mb-4 text-gray-800">
              The Mirror Wall, once polished to a gleaming finish, still bears ancient
              graffiti from visitors dating back centuries. Further up, the entrance to
              the summit is marked by the massive Lion’s Gate, where only the giant
              paws remain today—remnants of a colossal lion statue that once guarded
              the stairway.
            </p>
            <h3 className="text-xl font-semibold mb-2 mt-6">
              Gardens and Engineering Marvels
            </h3>
            <p className="mb-4 text-gray-800">
              At the base of Sigiriya, you’ll find some of the oldest landscaped
              gardens in the world, featuring symmetrical water gardens, boulder
              gardens, and terraced gardens. The sophisticated hydraulic systems,
              including fountains that still work during the rainy season, highlight
              the advanced engineering skills of ancient Sri Lankans.
            </p>
            <h3 className="text-xl font-semibold mb-2 mt-6">
              Visiting Sigiriya Today
            </h3>
            <p className="mb-4 text-gray-800">
              Today, Sigiriya is a must-visit destination for travelers to Sri Lanka.
              The climb to the top is challenging but rewarding, offering a unique
              glimpse into the island’s past and unforgettable views. Whether you’re a
              history buff, an art lover, or an adventurer, Sigiriya promises an
              experience like no other.
            </p>
            <p className="mt-6 text-gray-600 italic">
              Tip: Visit early in the morning or late afternoon to avoid crowds and
              enjoy cooler temperatures during your ascent.
            </p>
          </article>
        )}
      </div>
      {/* Ratings & Reviews Section */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Ratings & Reviews</h2>
          <div className="flex items-center mb-2">
            <span className="text-3xl font-semibold text-yellow-500 mr-2">
              {place.rating ? place.rating.toFixed(1) : '4.8'}
            </span>
            <span className="text-lg text-gray-700 mr-2">/ 5.0</span>
            <span className="text-gray-500">({place.reviewCount || 1024} reviews)</span>
          </div>
          {/* Star display */}
          <div className="flex items-center mb-6">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className={`h-6 w-6 ${i <= Math.round(place.rating || 4.8) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
            ))}
          </div>
          {/* Mock reviews for Sigiriya */}
          {place.name === 'Sigiriya Rock Fortress' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex items-center mb-2">
                  <span className="font-bold text-gray-900 mr-2">Ayesha P.</span>
                  <span className="text-yellow-500">★★★★★</span>
                </div>
                <p className="text-gray-700">An unforgettable climb! The views from the top are breathtaking and the frescoes are stunning. Go early to beat the heat and crowds.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex items-center mb-2">
                  <span className="font-bold text-gray-900 mr-2">Lars M.</span>
                  <span className="text-yellow-500">★★★★☆</span>
                </div>
                <p className="text-gray-700">A must-see in Sri Lanka. The gardens and engineering are impressive. The climb is a bit tough but worth it!</p>
              </div>
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex items-center mb-2">
                  <span className="font-bold text-gray-900 mr-2">Chen W.</span>
                  <span className="text-yellow-500">★★★★★</span>
                </div>
                <p className="text-gray-700">Loved the history and the scenery. The Lion’s Gate is iconic. Highly recommended for families and solo travelers alike.</p>
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
