import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExperienceCard from '../components/ExperienceCard';
import ExploreCard from '../components/ExploreCard';
import InterestCard from '../components/InterestCard';
import PlaceCard from '../components/PlaceCard';
import CollectionCard from '../components/CollectionCard';
import InspirationCard from '../components/InspirationCard';
import CardGrid from '../components/CardGrid';
import sriLankaVideo from '../assets/sri-lanka-video.mp4';
import sigiriyaImg from '../assets/exp-colombo/sigiriya.jpeg';
import pinnawalaImg from '../assets/exp-colombo/pinnawala.jpg';
import galleFortImg from '../assets/exp-colombo/galle-fort.jpg';
import teaPlantationsImg from '../assets/exp-colombo/tea-plantations.jpg';
import whaleWatchingImg from '../assets/exp-colombo/whale-watching-mirissa.jpg';
import colomboTourImg from '../assets/exp-colombo/colombo-tour.jpg';

const placeholder = 'https://placehold.co/400x250';
const avatar = 'https://placehold.co/64x64';

const LandingPage = () => (
  <div className="min-h-screen bg-white">
    {/* Navbar - Floating over all content */}
    <Navbar />

    {/* Hero Video Section */}
    <section className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden">
      <video 
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay 
        muted 
        loop
        playsInline
      >
        <source src={sriLankaVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Video Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4 pt-24">
        {/* ...existing content... */}
        <h1 className="text-5xl md:text-7xl font-normal mb-6">
          Ready For Your<br />
          Next Adventure?
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          Get an experience like never before with IslandHop
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition">
            Start Planning
          </button>
          <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-gray-900 transition">
            Join a Pool
          </button>
        </div>
      </div>
    </section>

    {/* Interest Cards */}
    <section className="w-full py-8">
      <div className="w-full flex justify-center">
        <div className="flex flex-nowrap gap-3 px-2 justify-center">
          {/* Use icons directly instead of InterestCard */}
          {[
            { name: 'Beach', icon: 'FaUmbrellaBeach' },
            { name: 'Adventure', icon: 'FaHiking' },
            { name: 'Cultural', icon: 'FaLandmark' },
            { name: 'Scenic', icon: 'FaMountain' },
            { name: 'Wellness', icon: 'FaSpa' },
            { name: 'Shopping', icon: 'FaShoppingBag' },
            { name: 'Food', icon: 'FaUtensils' },
          ].map(({ name, icon }) => {
            const Icon = require('react-icons/fa')[icon];
            return (
              <div key={name} className="flex flex-col items-center justify-end min-w-[6rem] max-w-[6rem] w-24 h-32 mx-1 cursor-pointer group">
                <Icon className="text-4xl text-primary-600 mb-2 group-hover:text-primary-700 transition" aria-label={name} />
                <span className="text-base font-light text-gray-900 mt-1">{name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* Experiences Near Colombo */}
    <section className="w-full py-8">
      <div className="content-container">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Explore experiences near Colombo</h2>
        <CardGrid cardType="scroll" maxCards={6}>
          {[
            { title: 'Sigiriya Rock Fortress Day Trip', rating: 4.8, reviewCount: 1000, price: '$99', image: sigiriyaImg },
            { title: 'Elephant Orphanage & Spice Garden Tour', rating: 4.6, reviewCount: 850, price: '$75', image: pinnawalaImg },
            { title: 'Galle Fort & Southern Coast Tour', rating: 4.9, reviewCount: 1200, price: '$120', image: galleFortImg },
            { title: 'Tea Plantation & Kandy City Tour', rating: 4.7, reviewCount: 950, price: '$85', image: teaPlantationsImg },
            { title: 'Whale Watching in Mirissa', rating: 4.5, reviewCount: 600, price: '$65', image: whaleWatchingImg },
            { title: 'Colombo City Walking Tour', rating: 4.4, reviewCount: 400, price: '$45', image: colomboTourImg }
          ].map((experience, i) => (
            <ExploreCard 
              key={i}
              image={experience.image}
              title={experience.title}
              rating={experience.rating}
              reviewCount={experience.reviewCount}
              price={experience.price}
              className="flex-shrink-0"
            />
          ))}
        </CardGrid>
      </div>
    </section>

    {/* Inspiration Section */}
    <section className="w-full py-8">
      <div className="content-container">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Inspiration to get you going</h2>
        <CardGrid cardType="scroll" maxCards={5}>
          {[
            'Best beaches in Sri Lanka',
            'Ancient temples and culture',
            'Wildlife safari adventures',
            'Mountain hiking trails',
            'Local food experiences'
          ].map((inspiration, i) => (
            <InspirationCard 
              key={i}
              image={placeholder}
              title={inspiration}
              className="min-w-[260px] flex-shrink-0"
            />
          ))}
        </CardGrid>
      </div>
    </section>

    {/* Things to do right now */}
    {/* Things to do right now */}
    <section className="w-full py-8">
      <div className="content-container">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Things to do—right now</h2>
        <CardGrid cardType="scroll" maxCards={6}>
          {[
            'Sunset at Galle Face Green',
            'Visit Gangaramaya Temple',
            'Shopping at Pettah Market',
            'Colombo National Museum',
            'Viharamahadevi Park stroll',
            'Street food tour in Fort'
          ].map((activity, i) => (
            <InspirationCard 
              key={i}
              image={placeholder}
              title={activity}
              className="min-w-[260px] flex-shrink-0"
            />
          ))}
        </CardGrid>
      </div>
    </section>

    {/* Sponsored Section */}
    <section className="w-full py-8">
      <div className="page-container">
        <div className="bg-white rounded-2xl shadow border border-gray-200 flex items-center p-4">
          <img src={avatar} alt="Sponsored" className="w-20 h-20 object-cover rounded-xl mr-4" />
          <div>
            <div className="text-xs text-gray-500 mb-1">Sponsored by CSHAP</div>
            <div className="font-bold text-gray-900 mb-1">Adventure is better with your pup</div>
            <div className="text-gray-700 text-sm mb-2">Traveling with your dog? Get all your USA pet-friendly stays, tips, and more with USA.Hotels.com. Start planning your perfect getaway together.</div>
            <button className="bg-primary-600 text-white rounded-full px-5 py-2 font-semibold hover:bg-primary-700 transition">Learn more</button>
          </div>
        </div>
      </div>
    </section>

    {/* Iconic places */}
    <section className="w-full py-8">
      <div className="content-container">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Iconic places you need to see</h2>
        <CardGrid cardType="place" maxCards={6}>
          {['Rome, Italy', 'Paris, France', 'Las Vegas, NV', 'Reykjavik, Iceland', 'Tokyo, Japan', 'Sydney, Australia'].map((place) => (
            <PlaceCard 
              key={place}
              image={placeholder}
              title={place}
              className="w-full max-w-[180px]"
            />
          ))}
        </CardGrid>
      </div>
    </section>

    {/* Themed collections */}
    <section className="w-full py-8">
      <div className="content-container">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Browse themed collections</h2>
        <CardGrid cardType="collection" maxCards={5}>
          {[
            'Pizza, Roman style',
            'Get right to the reef',
            'Take a grand detour',
            'London, after dark',
            'Island hopping adventures'
          ].map((collection) => (
            <CollectionCard 
              key={collection}
              image={placeholder}
              title={collection}
              className="w-full max-w-[220px]"
            />
          ))}
        </CardGrid>
      </div>
    </section>

    {/* Footer */}
    <Footer />
  </div>
);

export default LandingPage;