import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Card, { CardBody } from '../components/Card';
import { 
  StarIcon,
  MapPinIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ClockIcon,
  PhoneIcon,
  LanguageIcon,
  TruckIcon,
  CameraIcon,
  HeartIcon,
  CheckCircleIcon,
  UsersIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import aboutVideo from '../assets/about.mp4';
import Footer from '../components/Footer';

const AboutPage = () => {
  const [activeDriverIndex, setActiveDriverIndex] = useState(0);
  const [activeGuideIndex, setActiveGuideIndex] = useState(0);

  // Featured Drivers Data
  const featuredDrivers = [
    {
      id: 1,
      name: 'Priyantha Silva',
      rating: 4.9,
      reviewCount: 245,
      experience: '8 years',
      location: 'Colombo',
      specialties: ['City Tours', 'Airport Transfers', 'Cultural Sites'],
      languages: ['English', 'Sinhala', 'Tamil'],
      vehicle: 'Toyota KDH Van (12 seats)',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      verified: true,
      joinedYear: 2016,
      totalTrips: 1250
    },
    {
      id: 2,
      name: 'Kasun Fernando',
      rating: 4.8,
      reviewCount: 189,
      experience: '6 years',
      location: 'Kandy',
      specialties: ['Hill Country', 'Adventure Tours', 'Wildlife Safaris'],
      languages: ['English', 'Sinhala'],
      vehicle: 'Mitsubishi Montero (7 seats)',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
      verified: true,
      joinedYear: 2018,
      totalTrips: 890
    },
    {
      id: 3,
      name: 'Tharaka Perera',
      rating: 4.9,
      reviewCount: 156,
      experience: '5 years',
      location: 'Galle',
      specialties: ['Beach Tours', 'Southern Coast', 'Photography Tours'],
      languages: ['English', 'Sinhala', 'German'],
      vehicle: 'Toyota Hiace (15 seats)',
      image: 'https://randomuser.me/api/portraits/men/28.jpg',
      verified: true,
      joinedYear: 2019,
      totalTrips: 675
    }
  ];

  // Featured Guides Data
  const featuredGuides = [
    {
      id: 1,
      name: 'Chaminda Wickramasinghe',
      rating: 4.9,
      reviewCount: 198,
      experience: '12 years',
      location: 'Kandy',
      specialties: ['Cultural Heritage', 'Buddhist Temples', 'History'],
      languages: ['English', 'Sinhala', 'French', 'Japanese'],
      certification: 'Licensed Tourist Guide',
      image: 'https://randomuser.me/api/portraits/men/52.jpg',
      verified: true,
      joinedYear: 2012,
      totalTours: 1450
    },
    {
      id: 2,
      name: 'Nimesha Rathnayake',
      rating: 4.8,
      reviewCount: 142,
      experience: '7 years',
      location: 'Nuwara Eliya',
      specialties: ['Tea Plantations', 'Nature Walks', 'Photography'],
      languages: ['English', 'Sinhala', 'Hindi'],
      certification: 'Eco-Tourism Specialist',
      image: 'https://randomuser.me/api/portraits/women/35.jpg',
      verified: true,
      joinedYear: 2017,
      totalTours: 820
    },
    {
      id: 3,
      name: 'Ruwan Gunasekara',
      rating: 4.9,
      reviewCount: 167,
      experience: '9 years',
      location: 'Sigiriya',
      specialties: ['Ancient Cities', 'Archaeology', 'Wildlife'],
      languages: ['English', 'Sinhala', 'German', 'Dutch'],
      certification: 'Archaeological Guide',
      image: 'https://randomuser.me/api/portraits/men/38.jpg',
      verified: true,
      joinedYear: 2015,
      totalTours: 1180
    }
  ];

  // Tourist Reviews Data
  const touristReviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      country: 'United States',
      rating: 5,
      date: '2025-06-15',
      review: 'IslandHop made our Sri Lankan adventure absolutely magical! Our driver Priyantha was incredibly knowledgeable and took us to hidden gems we never would have found on our own. The pool feature helped us meet amazing fellow travelers!',
      image: 'https://randomuser.me/api/portraits/women/32.jpg',
      tripType: 'Cultural Tour',
      duration: '10 days'
    },
    {
      id: 2,
      name: 'Marcus Schmidt',
      country: 'Germany',
      rating: 5,
      date: '2025-06-08',
      review: 'Fantastic platform! The guide Chaminda was a walking encyclopedia of Sri Lankan history. The driver was punctual and the vehicle was comfortable. Highly recommend for anyone wanting an authentic experience.',
      image: 'https://randomuser.me/api/portraits/men/25.jpg',
      tripType: 'Heritage Tour',
      duration: '7 days'
    },
    {
      id: 3,
      name: 'Emily Chen',
      country: 'Australia',
      rating: 5,
      date: '2025-05-28',
      review: 'The travel pool feature is genius! We joined a group going to Ella and made lifelong friends. Our guide Nimesha showed us the most beautiful tea plantations and taught us so much about the local culture.',
      image: 'https://randomuser.me/api/portraits/women/28.jpg',
      tripType: 'Hill Country',
      duration: '5 days'
    },
    {
      id: 4,
      name: 'David Thompson',
      country: 'United Kingdom',
      rating: 4,
      date: '2025-05-20',
      review: 'Excellent service from start to finish. The platform is easy to use and the verification system gives great peace of mind. Our driver Kasun was professional and the wildlife safari was unforgettable!',
      image: 'https://randomuser.me/api/portraits/men/42.jpg',
      tripType: 'Wildlife Safari',
      duration: '8 days'
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      country: 'Canada',
      rating: 5,
      date: '2025-05-12',
      review: 'Best decision we made for our honeymoon! The platform connected us with amazing local professionals who made our trip special. The beach tours in the south were incredible!',
      image: 'https://randomuser.me/api/portraits/women/26.jpg',
      tripType: 'Beach Tour',
      duration: '6 days'
    },
    {
      id: 6,
      name: 'Ahmed Al-Rashid',
      country: 'UAE',
      rating: 5,
      date: '2025-04-30',
      review: 'Professional and reliable service. The cultural tour exceeded all expectations. Great value for money and the local insights were invaluable. Will definitely use IslandHop again!',
      image: 'https://randomuser.me/api/portraits/men/48.jpg',
      tripType: 'Cultural Tour',
      duration: '12 days'
    }
  ];

  // Platform Statistics
  const platformStats = [
    { label: 'Launching Soon', value: '2025', icon: TruckIcon },
    { label: 'Ready to Serve', value: 'You', icon: UsersIcon },
    { label: 'New Platform', value: 'Fresh', icon: HeartIcon },
    { label: 'Sri Lanka Focus', value: '100%', icon: GlobeAltIcon }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-yellow-200" />
        );
      } else {
        stars.push(
          <StarIcon key={i} className="h-5 w-5 text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      <Navbar />
      
      {/* Hero Video Section */}
      <section className="relative w-full h-[25vh] md:h-[45vh] overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay 
          muted 
          loop
          playsInline
        >
          <source src={aboutVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <div className="mt-16 md:mt-24">
            <h1 className="text-4xl md:text-6xl font-normal mb-6">
              About IslandHop
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Connecting travelers with authentic Sri Lankan experiences through verified local professionals
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Platform Overview */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-6">
              Your Gateway to Sri Lanka
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              IslandHop is Sri Lanka's premier travel platform that connects tourists with verified local drivers and guides. 
              We believe in authentic experiences, safe travels, and creating memories that last a lifetime. Our platform 
              ensures quality service through rigorous verification processes and continuous feedback systems.
            </p>
          </div>

          {/* Platform Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {platformStats.map((stat, index) => (
              <Card key={index} className="text-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700">
                <CardBody>
                  <stat.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                  <div className="text-2xl md:text-3xl font-bold text-primary-800 dark:text-primary-200 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                    {stat.label}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Choose IslandHop */}
        <section className="mb-16">
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
        </section>

        {/* About Our Platform */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-6">
              Building Sri Lanka's Travel Community
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              IslandHop is a new platform dedicated to connecting travelers with authentic Sri Lankan experiences. 
              We're building a community of verified local drivers and guides who are passionate about sharing 
              the beauty and culture of Sri Lanka with visitors from around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Our Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We believe that the best way to experience Sri Lanka is through the eyes of locals who know 
                and love their homeland. Our platform ensures safe, authentic, and memorable travel experiences 
                while supporting local communities.
              </p>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-success-600 mr-3 mt-0.5 flex-shrink-0" />
                  Connecting travelers with verified local professionals
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-success-600 mr-3 mt-0.5 flex-shrink-0" />
                  Promoting sustainable and responsible tourism
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-success-600 mr-3 mt-0.5 flex-shrink-0" />
                  Supporting local communities and economies
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-success-600 mr-3 mt-0.5 flex-shrink-0" />
                  Creating unforgettable travel memories
                </li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Join Our Growing Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Whether you're a traveler seeking authentic experiences or a local professional 
                wanting to share your expertise, IslandHop is the perfect platform to connect 
                and create meaningful travel experiences together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition">
                  Start Your Journey
                </button>
                <button className="border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-primary-50 transition">
                  Become a Professional
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl text-white p-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Ready to Start Your Sri Lankan Adventure?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied travelers who have discovered the beauty of Sri Lanka with IslandHop.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
              Find Your Adventure
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-600 transition">
              Join as Professional
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
