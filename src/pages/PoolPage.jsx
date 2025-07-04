import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FindPools from './pools/FindPools';
import MyPools from './pools/MyPools';
import ConfirmedPools from './pools/ConfirmedPools';
import OngoingPools from './pools/OngoingPools';
import pool4kVideo from '../assets/pool4k.mp4';

const tabList = [
  { label: 'Find Pools', key: 'find' },
  { label: 'My Pools', key: 'my' },
  { label: 'Confirmed', key: 'confirmed' },
  { label: 'Ongoing', key: 'ongoing' },
];

const PoolPage = () => {
  const [activeTab, setActiveTab] = useState('find');

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
      default:
        return <FindPools />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative w-full h-[18vh] md:h-[37.5vh] overflow-hidden">
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover scale-105"
          autoPlay 
          muted 
          loop
          playsInline
        >
          <source src={pool4kVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-normal mb-6">
            Travel Pools
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Meet new friends and explore together, find your perfect travel pool!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="group inline-flex items-center px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              // TODO: Add onClick handler to open create pool modal when implemented
            >
              <svg className="mr-3 h-6 w-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              Create New Pool
            </button>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-8 gap-4 flex-wrap">
          {tabList.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 text-base ${
                activeTab === tab.key
                  ? 'bg-primary-600 text-white border-primary-600 scale-105'
                  : 'bg-white dark:bg-secondary-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-secondary-700 hover:bg-primary-50 hover:border-primary-300 dark:hover:bg-secondary-700 dark:hover:border-primary-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PoolPage;
