import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FindPools from './pools/FindPools';
import MyPools from './pools/MyPools';
import ConfirmedPools from './pools/ConfirmedPools';
import OngoingPools from './pools/OngoingPools';

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
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Travel Pools
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Meet new friends and explore together, find your perfect travel pool!
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white dark:bg-secondary-800 p-1 rounded-xl shadow-lg">
            {tabList.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-secondary-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
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
