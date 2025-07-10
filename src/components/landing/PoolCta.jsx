import React from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';

const PoolCta = () => (
  <section className="w-full py-12 md:py-20 relative overflow-hidden">
    <img
      src={require('../../assets/landing/CTApool.jpg')}
      alt="Travel Pool Background"
      className="absolute inset-0 w-full h-full object-cover object-center z-0 select-none pointer-events-none"
      draggable="false"
      aria-hidden="true"
    />
    <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none"></div>
    <div className="content-container relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 py-8 px-4 md:px-12">
      {/* Image on the left */}
      <div className="flex-1 flex items-center justify-center order-1 md:order-1">
        <img src="/assets/landing/pool-cta.png" alt="Travel Pool" className="w-64 md:w-80 max-w-full rounded-xl bg-white shadow-md" onError={e => e.target.style.display='none'} />
      </div>
      {/* Content on the right */}
      <div className="flex-1 text-right md:text-right order-2 md:order-2 flex flex-col items-end">
        <img
          src={require('../../assets/islandhop footer 1.png')}
          alt="IslandHop Logo"
          className="mb-8 h-6 md:h-8 lg:h-9 w-auto ml-0 md:ml-0"
          draggable="false"
          aria-hidden="true"
        />
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Join a Travel Pool
        </h2>
        <p className="text-lg text-white mb-6 max-w-xl ml-auto">
          Meet like-minded travelers, share costs, and create unforgettable group experiences. IslandHop pools make travel more social, affordable, and fun!
        </p>
        <button
          className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          onClick={() => window.location.href = '/pools'}
        >
          <UserGroupIcon className="mr-3 h-6 w-6" aria-hidden="true" />
          Find a Pool
        </button>
      </div>
    </div>
  </section>
);

export default PoolCta;
