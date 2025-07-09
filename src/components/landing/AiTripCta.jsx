import React from 'react';
import { Sparkles } from 'lucide-react';

const AiTripCta = () => (
  <section className="w-full py-20 md:py-28 relative overflow-hidden">
    <img
      src={require('../../assets/landing/CTAAI.jpg')}
      alt="AI Trip Planner Background"
      className="absolute inset-0 w-full h-full object-cover object-center z-0 select-none pointer-events-none"
      draggable="false"
      aria-hidden="true"
    />
    <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none"></div>
    <div className="content-container relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 py-8 px-4 md:px-12">
      <div className="flex-1 text-center md:text-left">
        <img 
          src={require('../../assets/islandhop footer 1.png')} 
          alt="IslandHop Logo" 
          className="mb-8 h-6 md:h-8 lg:h-9 w-auto ml-0 md:ml-0"
          draggable="false"
          aria-hidden="true"
        />
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Let AI Plan Your Dream Trip</h2>
        <p className="text-lg text-white mb-6 max-w-xl">Not sure where to start? Our AI-powered trip planner can create a personalized itinerary for you in seconds. Just tell us your interests and preferences, and let IslandHop AI do the rest!</p>
        <button
          className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          onClick={() => window.location.href = '/trip/ai-create'}
        >
          <Sparkles className="mr-3 h-6 w-6" aria-hidden="true" />
          Try AI Trip Planner
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <img src="/assets/landing/ai-trip-planner.png" alt="AI Trip Planner" className="w-64 md:w-80 max-w-full rounded-xl bg-white" onError={e => e.target.style.display='none'} />
      </div>
    </div>
  </section>
);

export default AiTripCta;
