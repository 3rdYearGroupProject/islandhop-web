import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Placeholder components for general routes
const AboutPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        About IslandHop
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Your gateway to exploring beautiful Sri Lanka
      </p>
    </div>
  </div>
);

const ContactPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Contact Us
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Get in touch with our support team
      </p>
    </div>
  </div>
);

const GeneralRoutes = () => {
  return (
    <Routes>
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
    </Routes>
  );
};

export default GeneralRoutes;
