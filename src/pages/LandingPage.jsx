import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
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

// Detailed data for iconic places with descriptions
const iconicPlacesData = [
  { 
    title: 'Sigiriya Rock Fortress', 
    rating: 4.9, 
    reviewCount: 1500, 
    price: '$45', 
    image: sigiriyaImg,
    additionalImages: [
      sigiriyaImg,
      galleFortImg,
      teaPlantationsImg,
      wildlifeImg
    ],
    description: 'Rising dramatically from the central plains, Sigiriya is an ancient rock fortress built by King Kashyapa in the 5th century. This UNESCO World Heritage site features stunning frescoes, mirror walls, and the famous Lion Gate. The climb to the summit rewards visitors with breathtaking panoramic views and the ruins of a royal palace.',
    highlights: ['UNESCO World Heritage Site', 'Ancient frescoes and mirror wall', 'Royal palace ruins', 'Panoramic views', '5th century architecture'],
    duration: '4-5 hours',
    bestTime: 'Early morning or late afternoon'
  },
  { 
    title: 'Temple of the Tooth (Kandy)', 
    rating: 4.7, 
    reviewCount: 1200, 
    price: '$25', 
    image: templesImg,
    additionalImages: [
      templesImg,
      sigiriyaImg,
      galleFortImg,
      teaPlantationsImg
    ],
    description: 'Sri Dalada Maligawa, or the Temple of the Sacred Tooth Relic, is one of the most sacred Buddhist temples in the world. Located in the royal palace complex of Kandy, it houses the tooth relic of Lord Buddha. The temple features intricate architecture, beautiful paintings, and hosts the famous Esala Perahera festival.',
    highlights: ['Sacred tooth relic of Buddha', 'Traditional Kandyan architecture', 'Royal palace complex', 'Esala Perahera festival venue', 'Daily ritual ceremonies'],
    duration: '2-3 hours',
    bestTime: 'Morning or evening for ceremonies'
  },
  { 
    title: 'Galle Fort', 
    rating: 4.8, 
    reviewCount: 980, 
    price: '$35', 
    image: galleFortImg,
    additionalImages: [
      galleFortImg,
      sigiriyaImg,
      templesImg,
      bestBeachesImg
    ],
    description: 'Built by the Portuguese in 1588 and later fortified by the Dutch, Galle Fort is a stunning example of European colonial architecture in South Asia. This UNESCO World Heritage site features cobblestone streets, colonial buildings, ramparts with ocean views, and a vibrant community of shops, cafes, and galleries.',
    highlights: ['UNESCO World Heritage Site', 'Portuguese and Dutch colonial architecture', 'Ocean-facing ramparts', 'Art galleries and boutique shops', 'Lighthouse and clock tower'],
    duration: '3-4 hours',
    bestTime: 'Sunset for best rampart views'
  },
  { 
    title: 'Nine Arches Bridge (Ella)', 
    rating: 4.6, 
    reviewCount: 750, 
    price: '$20', 
    image: hikingImg,
    additionalImages: [
      hikingImg,
      teaPlantationsImg,
      templesImg,
      sigiriyaImg
    ],
    description: 'The Nine Arches Bridge, also known as the Bridge in the Sky, is an iconic railway bridge built during British colonial era. Surrounded by lush green tea plantations and hills, this architectural marvel offers spectacular photo opportunities, especially when trains cross the bridge.',
    highlights: ['Colonial era railway bridge', 'Surrounded by tea plantations', 'Train crossing photo opportunities', 'Hiking trails nearby', 'Panoramic hill country views'],
    duration: '2-3 hours',
    bestTime: 'Morning for train schedules'
  },
  { 
    title: 'Yala National Park', 
    rating: 4.5, 
    reviewCount: 650, 
    price: '$80', 
    image: wildlifeImg,
    additionalImages: [
      wildlifeImg,
      hikingImg,
      templesImg,
      galleFortImg
    ],
    description: 'Sri Lanka\'s most famous national park, Yala is renowned for having one of the highest leopard densities in the world. Spanning diverse ecosystems from scrublands to lagoons, the park is home to elephants, sloth bears, crocodiles, and over 200 bird species.',
    highlights: ['Highest leopard density globally', 'Asian elephants and sloth bears', '200+ bird species', 'Diverse ecosystems', 'Ancient archaeological sites'],
    duration: 'Full day safari',
    bestTime: 'Early morning or late afternoon'
  },
  { 
    title: 'Dambulla Cave Temple', 
    rating: 4.4, 
    reviewCount: 520, 
    price: '$30', 
    image: templesImg,
    additionalImages: [
      templesImg,
      sigiriyaImg,
      wildlifeImg,
      hikingImg
    ],
    description: 'The Dambulla Cave Temple, also known as the Golden Temple, is the largest and best-preserved cave temple complex in Sri Lanka. Dating back to the 1st century BC, it contains over 150 Buddha statues and intricate murals that cover 2,100 square meters of painted walls and ceilings.',
    highlights: ['Largest cave temple complex', '150+ Buddha statues', '2,100 sq meters of murals', '1st century BC origins', 'UNESCO World Heritage Site'],
    duration: '2-3 hours',
    bestTime: 'Morning to avoid crowds'
  }
];

// Detailed data for popular activities
const activitiesData = [
  {
    title: 'Zip Lining in Flying Ravana',
    rating: 4.9,
    reviewCount: 420,
    price: '$20',
    image: require('../assets/activities/ziplining.jpg'),
    description: 'Experience the thrill of soaring through the air on Sri Lanka\'s longest zip line. Flying Ravana offers breathtaking views of Ella\'s lush landscapes, waterfalls, and tea estates as you zip across valleys at exhilarating speeds.',
    highlights: ['Longest zip line in Sri Lanka', 'Spectacular valley views', 'Professional safety equipment', 'Multiple zip line stages', 'Photography opportunities'],
    duration: '2-3 hours',
    bestTime: 'Morning for best visibility'
  },
  {
    title: 'White Water Rafting in Kitulgala',
    rating: 4.8,
    reviewCount: 350,
    price: '$25',
    image: require('../assets/activities/rafting.jpg'),
    description: 'Navigate the rapids of the Kelani River in Kitulgala, famous for being a filming location for "Bridge on the River Kwai." This thrilling adventure takes you through grade 2 and 3 rapids surrounded by tropical rainforest.',
    highlights: ['Kelani River rapids', 'Grade 2-3 difficulty levels', 'Tropical rainforest setting', 'Professional guides included', 'Safety equipment provided'],
    duration: '3-4 hours',
    bestTime: 'Year-round, best after rains'
  },
  {
    title: 'Surfing in Arugam Bay',
    rating: 4.7,
    reviewCount: 390,
    price: '$15',
    image: require('../assets/activities/surfing.jpg'),
    description: 'Arugam Bay is Sri Lanka\'s premier surfing destination, offering consistent waves and a laid-back beach culture. Perfect for both beginners and experienced surfers, with surf schools and board rentals readily available.',
    highlights: ['World-class surf breaks', 'Consistent waves year-round', 'Surf schools for beginners', 'Vibrant beach culture', 'Beachfront accommodation'],
    duration: 'Half or full day',
    bestTime: 'April to September'
  },
  {
    title: 'Hot Air Ballooning in Dambulla',
    rating: 4.8,
    reviewCount: 210,
    price: '$120',
    image: require('../assets/activities/balloning.png'),
    description: 'Soar above the Cultural Triangle in a hot air balloon, offering bird\'s eye views of ancient temples, lush forests, and rural villages. This peaceful journey provides unforgettable sunrise or sunset experiences.',
    highlights: ['Aerial views of Cultural Triangle', 'Sunrise/sunset flights', 'Ancient temple views from above', 'Professional pilot guidance', 'Champagne celebration'],
    duration: '3-4 hours total',
    bestTime: 'Early morning for sunrise'
  },
  {
    title: 'Scuba Diving in Hikkaduwa',
    rating: 4.6,
    reviewCount: 180,
    price: '$40',
    image: require('../assets/activities/scubadiving.jpg'),
    description: 'Explore vibrant coral reefs and diverse marine life in Hikkaduwa\'s protected marine sanctuary. Encounter tropical fish, sea turtles, and colorful corals in crystal-clear waters perfect for diving.',
    highlights: ['Marine sanctuary protection', 'Vibrant coral reefs', 'Sea turtle encounters', 'Tropical fish diversity', 'PADI certified instructors'],
    duration: 'Half day',
    bestTime: 'November to April'
  },
  {
    title: 'Safari at Yala National Park',
    rating: 4.9,
    reviewCount: 500,
    price: '$60',
    image: require('../assets/activities/safari.jpg'),
    description: 'Embark on an exciting safari adventure in Yala National Park, home to the highest density of leopards in the world. Spot elephants, sloth bears, crocodiles, and numerous bird species in their natural habitat.',
    highlights: ['Highest leopard density globally', 'Big game viewing', 'Professional safari guides', 'Multiple park zones', 'Bird watching opportunities'],
    duration: 'Full day',
    bestTime: 'Early morning or late afternoon'
  }
];

// Modal component for displaying detailed information
const PlaceModal = ({ place, isOpen, onClose }) => {
  console.log('🎭 Modal render - isOpen:', isOpen, 'place:', place?.title || 'none');
  
  if (!isOpen || !place) return null;

  // Sample reviews for demonstration
  const sampleReviews = [
    {
      name: "Sarah M.",
      rating: 5,
      comment: "Absolutely breathtaking! The views were incredible and our guide was very knowledgeable.",
      date: "2 weeks ago"
    },
    {
      name: "John D.",
      rating: 5,
      comment: "A must-visit destination. The history and beauty of this place is unmatched.",
      date: "1 month ago"
    },
    {
      name: "Maria L.",
      rating: 4,
      comment: "Beautiful place with rich culture. Would definitely recommend to anyone visiting Sri Lanka.",
      date: "3 weeks ago"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative z-[10000]">
        <div className="relative">
          {/* Main image */}
          <img 
            src={place.image} 
            alt={place.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{place.title}</h2>
            <div className="flex items-center">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(place.rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-700">{place.rating}</span>
              <span className="text-gray-600 ml-2">({place.reviewCount} reviews)</span>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6 leading-relaxed text-lg">{place.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-xl">Highlights</h3>
              <ul className="space-y-3">
                {place.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2 text-lg">Visit Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-gray-700">Duration: </span>
                    <span className="text-gray-600">{place.duration}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Best Time: </span>
                    <span className="text-gray-600">{place.bestTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-xl">Recent Reviews</h3>
            <div className="space-y-4">
              {sampleReviews.map((review, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{review.name}</span>
                      <div className="flex text-yellow-400 ml-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inspiration destinations with images and descriptions (using assets/landing)
const inspirationDestinations = [
  {
    name: 'Best beaches in Sri Lanka',
    image: bestBeachesImg,
    description: 'Discover pristine coastlines and crystal waters along Sri Lanka\'s magnificent shores. From the golden sands of Bentota to the turquoise waters of Passikudah, experience some of the world\'s most beautiful beaches with perfect waves for surfing and calm bays for relaxation.',
    highlights: ['Golden sand beaches', 'Crystal clear waters', 'Perfect surfing conditions', 'Calm swimming bays', 'Beachfront resorts'],
    duration: 'Multiple days recommended',
    bestTime: 'Year-round, varies by coast',
    title: 'Best beaches in Sri Lanka',
    rating: 4.8,
    reviewCount: 2500,
    price: 'From $50/day'
  },
  {
    name: 'Ancient temples and culture',
    image: templesImg,
    description: 'Explore centuries-old Buddhist heritage through magnificent temples and cultural sites. From the sacred Temple of the Tooth in Kandy to the ancient caves of Dambulla, immerse yourself in Sri Lanka\'s rich spiritual and architectural legacy.',
    highlights: ['Sacred Buddhist temples', 'Ancient cave complexes', 'Traditional architecture', 'Cultural ceremonies', 'Historical significance'],
    duration: 'Multiple days for full experience',
    bestTime: 'Year-round, morning visits preferred',
    title: 'Ancient temples and culture',
    rating: 4.9,
    reviewCount: 1800,
    price: 'From $25/site'
  },
  {
    name: 'Wildlife safari adventures',
    image: wildlifeImg,
    description: 'Encounter elephants and leopards in nature through thrilling safari experiences. Sri Lanka boasts incredible biodiversity with national parks offering sightings of majestic elephants, elusive leopards, sloth bears, and hundreds of bird species.',
    highlights: ['Leopard sightings', 'Elephant herds', 'Diverse bird species', 'Natural habitats', 'Photography opportunities'],
    duration: 'Full day safaris',
    bestTime: 'Early morning and late afternoon',
    title: 'Wildlife safari adventures',
    rating: 4.7,
    reviewCount: 1200,
    price: 'From $60/safari'
  },
  {
    name: 'Mountain hiking trails',
    image: hikingImg,
    description: 'Trek through misty peaks and tea estates in Sri Lanka\'s scenic hill country. Experience breathtaking mountain vistas, cool climate, and lush tea plantations while hiking through some of the most beautiful landscapes in South Asia.',
    highlights: ['Mountain vistas', 'Tea plantation walks', 'Cool climate', 'Scenic trails', 'Hill country culture'],
    duration: '2-5 hours per hike',
    bestTime: 'Early morning for clear views',
    title: 'Mountain hiking trails',
    rating: 4.6,
    reviewCount: 950,
    price: 'From $30/hike'
  },
  {
    name: 'Local food experiences',
    image: foodImg,
    description: 'Taste authentic Sri Lankan street food and traditional cuisine. From spicy curry dishes to sweet treats like kokis and kavum, discover the rich flavors and aromatic spices that make Sri Lankan cuisine unique and unforgettable.',
    highlights: ['Traditional curry dishes', 'Street food tours', 'Spice experiences', 'Cooking classes', 'Local markets'],
    duration: '2-4 hours per experience',
    bestTime: 'Meal times for best variety',
    title: 'Local food experiences',
    rating: 4.8,
    reviewCount: 1400,
    price: 'From $20/tour'
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
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Effect to handle body scroll lock when modal is open
  React.useEffect(() => {
    if (isModalOpen) {
      // Disable body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scroll is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const openModal = (place) => {
    console.log('🔍 Opening modal for:', place);
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('❌ Closing modal');
    setSelectedPlace(null);
    setIsModalOpen(false);
  };
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
          loop w
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
              onClick={() => navigate('/trips')}
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
            <button
              className="inline-flex items-center px-8 py-4 min-w-[240px] border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm justify-center"
              onClick={() => navigate('/pools')}
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 000-6h-1m5 6h1a3 3 0 000-6h-1m-7 6h7m-7 0v8a2 2 0 002 2h10a2 2 0 002-2v-8m-9 0V9a2 2 0 012-2h5a2 2 0 012 2v3.028M12 17.5V21" />
              </svg>
              Join a Pool
            </button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm opacity-80">
            <div>Verified Professionals</div>
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
            <button
              className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition"
              onClick={() => navigate('/trips')}
            >
              Start Your Journey
            </button>
            <button
              className="px-8 py-3 border-2 border-primary-600 text-primary-600 font-semibold rounded-full hover:bg-primary-600 hover:text-white transition"
              onClick={() => navigate('/discover')}
            >
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
      <ColomboExperiences onExperienceClick={openModal} />

      {/* AI Trip Creation CTA Section */}
      <div className="mb-12">
        <AiTripCta />
      </div>

      {/* Secondary Showcase: Iconic places */}
      <section className="w-full py-8">
        <div className="content-container">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Must-Visit Iconic Places</h2>
          <CardGrid cardType="scroll" maxCards={6}>
            {iconicPlacesData.map((place, i) => (
              <ExploreCard
                key={i}
                image={place.image}
                title={place.title}
                rating={place.rating}
                reviewCount={place.reviewCount}
                price={place.price}
                className="flex-shrink-0"
                onClick={() => openModal(place)}
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
                  onClick={() => openModal(inspiration)}
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
            {activitiesData.map((activity, i) => (
              <ExploreCard
                key={i}
                image={activity.image}
                title={activity.title}
                rating={activity.rating}
                reviewCount={activity.reviewCount}
                price={activity.price}
                className="flex-shrink-0"
                onClick={() => openModal(activity)}
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
                description: 'Tour lush tea estates and scenic hills in Sri Lanka\'s central highlands. Learn about the tea-making process from leaf to cup, enjoy fresh Ceylon tea tastings, and experience the cool mountain climate of Nuwara Eliya and Ella.',
                title: 'Tea Plantation Tours',
                rating: 4.7,
                reviewCount: 850,
                price: 'From $45/tour',
                highlights: ['Tea factory visits', 'Ceylon tea tasting', 'Mountain scenery', 'Cool climate', 'Colonial history'],
                duration: 'Half to full day',
                bestTime: 'Morning for best weather'
              },
              {
                name: 'Ancient Temple Trails',
                image: require('../assets/landing/temples.jpg'),
                description: 'Walk through centuries of history exploring Sri Lanka\'s most sacred Buddhist temples and archaeological sites. Discover ancient cave paintings, massive Buddha statues, and architectural marvels that showcase the island\'s rich spiritual heritage.',
                title: 'Ancient Temple Trails',
                rating: 4.8,
                reviewCount: 1200,
                price: 'From $35/trail',
                highlights: ['Sacred Buddhist sites', 'Ancient cave temples', 'Historical significance', 'Architectural beauty', 'Spiritual experiences'],
                duration: 'Multiple days recommended',
                bestTime: 'Early morning visits'
              },
              {
                name: 'Wildlife Safari Adventures',
                image: require('../assets/landing/wildlife.webp'),
                description: 'See elephants, leopards, and more in Sri Lanka\'s pristine national parks. Experience incredible biodiversity with opportunities to spot the Big Five, hundreds of bird species, and unique endemic wildlife in their natural habitats.',
                title: 'Wildlife Safari Adventures',
                rating: 4.9,
                reviewCount: 950,
                price: 'From $60/safari',
                highlights: ['Leopard sightings', 'Elephant encounters', 'Bird watching', 'Natural habitats', 'Photography tours'],
                duration: 'Full day experiences',
                bestTime: 'Early morning and evening'
              },
              {
                name: 'Coastal Beach Escapes',
                image: require('../assets/landing/best-beaches.jpg'),
                description: 'Relax on golden sands and blue seas along Sri Lanka\'s stunning coastline. From surfing hotspots to tranquil bays, discover pristine beaches perfect for swimming, snorkeling, and watching magnificent sunsets.',
                title: 'Coastal Beach Escapes',
                rating: 4.6,
                reviewCount: 1800,
                price: 'From $40/day',
                highlights: ['Pristine beaches', 'Water sports', 'Sunset views', 'Beach resorts', 'Coral reefs'],
                duration: 'Multiple days',
                bestTime: 'Year-round varies by coast'
              },
              {
                name: 'Hill Country Retreats',
                image: require('../assets/landing/hiking.jpg'),
                description: 'Unwind in cool, misty mountains where rolling hills meet cloud forests. Experience a different side of tropical Sri Lanka with cooler temperatures, scenic train rides, and charming colonial-era towns.',
                title: 'Hill Country Retreats',
                rating: 4.5,
                reviewCount: 720,
                price: 'From $55/retreat',
                highlights: ['Cool mountain climate', 'Scenic train journeys', 'Colonial architecture', 'Hiking trails', 'Cloud forests'],
                duration: '2-3 days recommended',
                bestTime: 'Year-round, especially hot months'
              }
            ].map((collection, i) => (
              <div key={i} className="flex-shrink-0 w-64 md:w-72">
                <DestinationCard
                  destination={collection}
                  imageUrl={collection.image}
                  onClick={() => openModal(collection)}
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
          {/* Removed testimonial/review content as requested */}
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Place Details Modal */}
      <PlaceModal 
        place={selectedPlace} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default LandingPage;