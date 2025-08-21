import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../components/Navbar';
import FindPools from './pools/FindPools';
import MyPools from './pools/MyPools';
import ConfirmedPools from './pools/ConfirmedPools';
import OngoingPools from './pools/OngoingPools';
import InvitationsAndRequests from './pools/InvitationsAndRequests';
import CreatePoolModal from '../components/pools/CreatePoolModal';
import pool4kVideo from '../assets/pool4k.mp4';
import Footer from '../components/Footer';

const tabList = [
  { label: 'Find Pools', key: 'find' },
  { label: 'My Pools', key: 'my' },
  { label: 'Confirmed', key: 'confirmed' },
  { label: 'Ongoing', key: 'ongoing' },
  { label: 'Invitations & Requests', key: 'invitations' },
];

const PoolPage = () => {
  const [activeTab, setActiveTab] = useState('find');
  const [isCreatePoolModalOpen, setIsCreatePoolModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('🔐 Current user UID:', user.uid);
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCreatePool = (poolData) => {
    console.log('🚀 Creating pool with user UID:', currentUser?.uid);
    console.log('📝 Pool data:', poolData);
    
    // Navigate to pool duration page with pool data and user UID
    navigate('/pool-duration', { 
      state: { 
        poolName: poolData.name,
        poolDescription: poolData.description,
        poolPrivacy: poolData.privacy, // Pass privacy setting
        userUid: currentUser?.uid
      } 
    });
    setIsCreatePoolModalOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'find':
        return <FindPools />;
      case 'my':
        return <MyPools />;
      case 'confirmed':
        return <ConfirmedPools />;
      case 'ongoing':
        return <OngoingPools />;
      case 'invitations':
        return <InvitationsAndRequests />;
      default:
        return <FindPools />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative w-full h-[75vh] md:h-[45vh] overflow-hidden">
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover scale-105 z-0"
          autoPlay 
          muted 
          loop
          playsInline
        >
          <source src={pool4kVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        
        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl mx-auto mt-16 sm:mt-20 md:mt-24">
            <h1 className="text-4xl md:text-6xl font-normal mb-6 leading-tight text-white">
              Travel Pools
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-blue-100">
              Meet new friends and explore together, find your perfect travel pool!
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setIsCreatePoolModalOpen(true)}
                className="group inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-900 rounded-full font-bold text-sm sm:text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <svg className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                <span className="hidden sm:inline">Create New Pool</span>
                <span className="sm:hidden">Create Pool</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="relative z-10 -mt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Control Panel */}
          <div className="bg-white rounded-full shadow-xl border border-gray-100 p-3 sm:p-5 mb-6 sm:mb-8 w-full sm:w-fit mx-auto relative z-20">
            <div className="flex justify-center">
              {/* Mobile Layout - Two Rows */}
              <div className="flex flex-col gap-3 sm:hidden">
                {/* First Row - First 3 buttons */}
                <div className="flex gap-2 justify-center">
                  {tabList.slice(0, 3).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-3 py-2 rounded-full font-medium transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 text-xs flex-shrink-0 ${
                        activeTab === tab.key
                          ? 'bg-primary-600 text-white border-primary-600 scale-105'
                          : 'bg-white dark:bg-secondary-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-secondary-700 hover:bg-primary-50 hover:border-primary-300 dark:hover:bg-secondary-700 dark:hover:border-primary-400'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                {/* Second Row - Remaining 2 buttons */}
                <div className="flex gap-2 justify-center">
                  {tabList.slice(3).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-3 py-2 rounded-full font-medium transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 text-xs flex-shrink-0 ${
                        activeTab === tab.key
                          ? 'bg-primary-600 text-white border-primary-600 scale-105'
                          : 'bg-white dark:bg-secondary-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-secondary-700 hover:bg-primary-50 hover:border-primary-300 dark:hover:bg-secondary-700 dark:hover:border-primary-400'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Desktop Layout - Single Row */}
              <div className="hidden sm:flex gap-4 justify-center max-w-full">
                {tabList.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 text-base flex-shrink-0 ${
                      activeTab === tab.key
                        ? 'bg-primary-600 text-white border-primary-600 scale-105'
                        : 'bg-white dark:bg-secondary-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-secondary-700 hover:bg-primary-50 hover:border-primary-300 dark:hover:bg-secondary-700 dark:hover:border-primary-400'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Create Pool Modal */}
      <CreatePoolModal
        isOpen={isCreatePoolModalOpen}
        onClose={() => setIsCreatePoolModalOpen(false)}
        onCreatePool={handleCreatePool}
      />

      <Footer />
    </div>
  );
};

export default PoolPage;
