import React from 'react';
import islandHopFooter from '../assets/islandhop footer 1.png';

const Footer = () => {
  return (
    <footer className="w-full bg-blue-600 py-12 border-t border-blue-700">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 max-w-4xl mx-auto">
          {/* Left side - Logo and description */}
          <div className="mb-8 md:mb-0 md:w-2/5">
            <img src={islandHopFooter} alt="IslandHop" className="h-10 w-auto mb-4" />
            <p className="text-blue-100 text-sm leading-relaxed">
              Discover the beauty of Sri Lanka with IslandHop. Your gateway to unforgettable experiences and authentic adventures.
            </p>
          </div>
          
          {/* Right side - Links in a compact grid */}
          <div className="grid grid-cols-2 gap-8 md:gap-10 md:ml-8">
            <div>
              <ul className="space-y-3 text-sm text-blue-100">
                <li><a href="#" className="hover:text-white transition-colors touch-manipulation font-medium">About us</a></li>
                <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Help Centre</a></li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3 text-sm text-blue-100">
                <li><a href="#" className="hover:text-white transition-colors touch-manipulation font-medium">Write a review</a></li>
                <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Join</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-blue-500 pt-6">
          <div className="text-center">
            <div className="text-sm text-blue-100">
              © 2025 IslandHop LLC All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
