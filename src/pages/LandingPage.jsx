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
      <section className="relative w-full h-screen overflow-hidden">
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay 
          muted 
          loop
          playsInline
          preload="auto"
          onLoadedData={(e) => {
            // Ensure smooth looping by setting playback rate and handling end event
            e.target.playbackRate = 1.0;
          }}
          onEnded={(e) => {
            // Force smooth restart if loop fails
            e.target.currentTime = 0;
            e.target.play();
          }}
        >
          <source src={sriLankaVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Enhanced Video Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          {/* Logo/Brand */}
          <div className="mb-8">
            <img 
              src={require('../assets/islandhop footer 1.png')} 
              alt="IslandHop" 
              className="h-12 md:h-16 w-auto mx-auto mb-4"
              draggable="false"
            />
          </div>
          
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-light mb-6 tracking-tight leading-tight">
            Your Sri Lankan<br />
            <span className="font-semibold text-primary-600">
              Adventure
            </span> Awaits
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-4 max-w-4xl font-light opacity-90">
            Discover the pearl of the Indian Ocean with verified local guides
          </p>
          <p className="text-lg md:text-xl mb-12 max-w-3xl opacity-75">
            From ancient temples to pristine beaches, create unforgettable memories with IslandHop
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <button
              className="relative inline-flex items-center px-8 py-4 min-w-[240px] border-2 border-white rounded-full font-bold text-lg transition-all duration-300 justify-center overflow-hidden bg-white hover:bg-gray-200 group"
              style={{}}
            >
              {/* The text and icon as a cutout */}
              <span
                className="absolute inset-0 flex items-center justify-center select-none"
                style={{
                  WebkitMaskImage: 'linear-gradient(white, white)',
                  maskImage: 'linear-gradient(white, white)',
                  WebkitMaskComposite: 'destination-out',
                  color: 'black',
                  zIndex: 2,
                  pointerEvents: 'none',
                  mixBlendMode: 'destination-out',
                }}
              >
                <Sparkles className="mr-3 h-6 w-6" aria-hidden="true" />
                <span>Start Your Journey</span>
              </span>
              {/* Fallback text for accessibility, visually hidden */}
              <span className="opacity-0">Start Your Journey</span>
            </button>
            <button className="inline-flex items-center px-8 py-4 min-w-[240px] border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm justify-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 000-6h-1m5 6h1a3 3 0 000-6h-1m-7 6h7m-7 0v8a2 2 0 002 2h10a2 2 0 002-2v-8m-9 0V9a2 2 0 012-2h5a2 2 0 012 2v3.028M12 17.5V21" />
              </svg>
              Join a Pool
            </button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span>4.8 rating from 10K+ travelers</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-white/60 rounded-full"></div>
            <div>500+ verified professionals</div>
            <div className="hidden sm:block w-1 h-1 bg-white/60 rounded-full"></div>
            <div>Available 24/7</div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Problem/Solution Statement */}
      <section className="w-full py-16 bg-gray-50">
        <div className="content-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Planning a Sri Lankan Adventure Shouldn't Be Overwhelming
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            From finding trusted guides to discovering hidden gems, IslandHop connects you with verified local professionals 
            and like-minded travelers to create unforgettable experiences across Sri Lanka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition">
              Start Your Journey
            </button>
            <button className="px-8 py-3 border-2 border-primary-600 text-primary-600 font-semibold rounded-full hover:bg-primary-600 hover:text-white transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose IslandHop section - Key Features */}
      <WhyChooseIslandHop />

      {/* Interest Cards - What you can explore */}
      <InterestCards />

      {/* Main Showcase: Experiences Near Colombo */}
      <ColomboExperiences />

      {/* AI Trip Creation CTA Section */}
      <div className="mb-12">
        <AiTripCta />
      </div>

      {/* Secondary Showcase: Iconic places */}
      <section className="w-full py-8">
        <div className="content-container">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Must-Visit Iconic Places</h2>
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

      {/* Inspiration Section */}
      <section className="w-full py-8">
        <div className="content-container">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Discover Sri Lanka's Best</h2>
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

      {/* Pool CTA - pooling feature */}
      <div className="mb-12">
        <PoolCta />
      </div>

      {/* Things to do right now */}
      <section className="w-full py-8">
        <div className="content-container">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Popular Activities</h2>
          <CardGrid cardType="scroll" maxCards={6}>
            {[
              {
                title: 'Zip Lining in Flying Ravana',
                rating: 4.9,
                reviewCount: 420,
                price: '$20',
                image: require('../assets/activities/ziplining.jpg')
              },
              {
                title: 'White Water Rafting in Kitulgala',
                rating: 4.8,
                reviewCount: 350,
                price: '$25',
                image: require('../assets/activities/rafting.jpg')
              },
              {
                title: 'Surfing in Arugam Bay',
                rating: 4.7,
                reviewCount: 390,
                price: '$15',
                image: require('../assets/activities/surfing.jpg')
              },
              {
                title: 'Hot Air Ballooning in Dambulla',
                rating: 4.8,
                reviewCount: 210,
                price: '$120',
                image: require('../assets/activities/balloning.png')
              },
              {
                title: 'Scuba Diving in Hikkaduwa',
                rating: 4.6,
                reviewCount: 180,
                price: '$40',
                image: require('../assets/activities/scubadiving.jpg')
              },
              {
                title: 'Safari at Yala National Park',
                rating: 4.9,
                reviewCount: 500,
                price: '$60',
                image: require('../assets/activities/safari.jpg')
              }
            ].map((activity, i) => (
              <ExploreCard
                key={i}
                image={activity.image}
                title={activity.title}
                rating={activity.rating}
                reviewCount={activity.reviewCount}
                price={activity.price}
                className="flex-shrink-0"
                onClick={() => {}}
              />
            ))}
          </CardGrid>
        </div>
      </section>

      {/* Themed collections */}
      <section className="w-full py-8">
        <div className="content-container">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Browse themed collections</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {[
              {
                name: 'Tea Plantation Tours',
                image: require('../assets/exp-colombo/tea-plantations.jpg'),
                description: 'Tour lush tea estates and scenic hills'
              },
              {
                name: 'Ancient Temple Trails',
                image: require('../assets/landing/temples.jpg'),
                description: 'Walk through centuries of history'
              },
              {
                name: 'Wildlife Safari Adventures',
                image: require('../assets/landing/wildlife.webp'),
                description: 'See elephants, leopards, and more'
              },
              {
                name: 'Coastal Beach Escapes',
                image: require('../assets/landing/best-beaches.jpg'),
                description: 'Relax on golden sands and blue seas'
              },
              {
                name: 'Hill Country Retreats',
                image: require('../assets/landing/hiking.jpg'),
                description: 'Unwind in cool, misty mountains'
              }
            ].map((collection, i) => (
              <div key={i} className="flex-shrink-0 w-64 md:w-72">
                <DestinationCard
                  destination={collection}
                  imageUrl={collection.image}
                  onClick={() => {}}
                  className="h-48 md:h-56"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="w-full py-16 bg-gray-50">
        <div className="content-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Trusted by Thousands of Travelers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Verified Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">4.8★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center justify-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-4">
                "IslandHop made our Sri Lankan adventure absolutely incredible. The local guide was knowledgeable, 
                friendly, and showed us places we never would have discovered on our own."
              </p>
              <div className="flex items-center justify-center gap-3">
                <img src={avatar} alt="Customer" className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-semibold text-gray-900">Sarah Johnson</div>
                  <div className="text-sm text-gray-600">Traveled to Kandy & Ella</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;