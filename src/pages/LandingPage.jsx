import React from 'react';
import { Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExperienceCard from '../components/ExperienceCard';
import ExploreCard from '../components/ExploreCard';
import InterestCard from '../components/InterestCard';
import PlaceCard from '../components/PlaceCard';
import CollectionCard from '../components/CollectionCard';
import InspirationCard from '../components/InspirationCard';
import DestinationCard from '../components/DestinationCard';
import Card, { CardBody } from '../components/Card';
import { ShieldCheckIcon, UserGroupIcon, HeartIcon } from '@heroicons/react/24/outline';
import CardGrid from '../components/CardGrid';
import { useNavigate } from 'react-router-dom';
import sriLankaVideo from '../assets/sri-lanka-video.mp4';
import sigiriyaImg from '../assets/exp-colombo/sigiriya.jpeg';
import pinnawalaImg from '../assets/exp-colombo/pinnawala.jpg';
import galleFortImg from '../assets/exp-colombo/galle-fort.jpg';
import teaPlantationsImg from '../assets/exp-colombo/tea-plantations.jpg';
import whaleWatchingImg from '../assets/exp-colombo/whale-watching-mirissa.jpg';
import colomboTourImg from '../assets/exp-colombo/colombo-tour.jpg';


// Import landing inspiration images
import bestBeachesImg from '../assets/landing/best-beaches.jpg';
import templesImg from '../assets/landing/temples.jpg';
import wildlifeImg from '../assets/landing/wildlife.webp';
import hikingImg from '../assets/landing/hiking.jpg';
import foodImg from '../assets/landing/food.jpg';
import InterestCards from '../components/landing/InterestCards';
import ColomboExperiences from '../components/landing/ColomboExperiences';
import AiTripCta from '../components/landing/AiTripCta';
import PoolCta from '../components/landing/PoolCta';

const placeholder = 'https://placehold.co/400x250';
const avatar = 'https://placehold.co/64x64';

// Inspiration destinations with images and descriptions (using assets/landing)
const inspirationDestinations = [
  {
    name: 'Best beaches in Sri Lanka',
    image: bestBeachesImg,
    description: 'Discover pristine coastlines and crystal waters'
  },
  {
    name: 'Ancient temples and culture',
    image: templesImg,
    description: 'Explore centuries-old Buddhist heritage'
  },
  {
    name: 'Wildlife safari adventures',
    image: wildlifeImg,
    description: 'Encounter elephants and leopards in nature'
  },
  {
    name: 'Mountain hiking trails',
    image: hikingImg,
    description: 'Trek through misty peaks and tea estates'
  },
  {
    name: 'Local food experiences',
    image: foodImg,
    description: 'Taste authentic Sri Lankan street food'
  }
];

// Why Choose IslandHop section (imported from AboutPage)
const WhyChooseIslandHop = () => (
  <section className="w-full py-16">
    <div className="content-container">
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white text-center mb-12">
        Why Choose IslandHop?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card hover className="text-center">
          <CardBody>
            <ShieldCheckIcon className="h-16 w-16 text-success-600 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Verified Professionals
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              All our drivers and guides undergo strict verification processes including background checks, 
              license verification, and continuous performance monitoring.
            </p>
          </CardBody>
        </Card>
        <Card hover className="text-center">
          <CardBody>
            <UserGroupIcon className="h-16 w-16 text-primary-600 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Travel Pools
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Join travel pools to meet like-minded travelers, share costs, and create unforgettable 
              group experiences while exploring Sri Lanka together.
            </p>
          </CardBody>
        </Card>
        <Card hover className="text-center">
          <CardBody>
            <HeartIcon className="h-16 w-16 text-danger-600 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Authentic Experiences
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our local professionals provide insider knowledge and authentic cultural experiences 
              that you won't find in typical tourist guides.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  </section>
);
const LandingPage = () => {
  const navigate = useNavigate();
  return (
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
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
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
      <InterestCards />

      {/* Experiences Near Colombo */}
      <ColomboExperiences />

      {/* Inspiration Section */}
      <section className="w-full py-8">
        <div className="content-container">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Inspiration to get you going</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {inspirationDestinations.map((inspiration, i) => (
              <div key={i} className="flex-shrink-0 w-64 md:w-72">
                <DestinationCard
                  destination={inspiration}
                  imageUrl={inspiration.image}
                  onClick={(dest) => console.log('Clicked inspiration:', dest.name)}
                  className="h-48 md:h-56"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Trip Creation CTA Section */}
      <AiTripCta />

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

      {/* Iconic places */}
      <section className="w-full py-8">
        <div className="content-container">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Iconic places you need to see</h2>
          <CardGrid cardType="scroll" maxCards={6}>
            {[
              { title: 'Sigiriya Rock Fortress', rating: 4.9, reviewCount: 1500, price: '$45', image: sigiriyaImg },
              { title: 'Temple of the Tooth (Kandy)', rating: 4.7, reviewCount: 1200, price: '$25', image: templesImg },
              { title: 'Galle Fort', rating: 4.8, reviewCount: 980, price: '$35', image: galleFortImg },
              { title: 'Nine Arches Bridge (Ella)', rating: 4.6, reviewCount: 750, price: '$20', image: hikingImg },
              { title: 'Yala National Park', rating: 4.5, reviewCount: 650, price: '$80', image: wildlifeImg },
              { title: 'Dambulla Cave Temple', rating: 4.4, reviewCount: 520, price: '$30', image: templesImg }
            ].map((place, i) => (
              <ExploreCard
                key={i}
                image={place.image}
                title={place.title}
                rating={place.rating}
                reviewCount={place.reviewCount}
                price={place.price}
                className="flex-shrink-0"
                onClick={() => navigate(`/place/${place.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`, { state: place })}
              />
            ))}
          </CardGrid>
        </div>
      </section>

      {/* Why Choose IslandHop section (imported from AboutPage) */}
      <WhyChooseIslandHop />

      {/* Pool CTA - pooling feature */}
      <PoolCta />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;