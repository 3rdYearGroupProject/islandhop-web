import React from 'react';
import islandHopFooter from '../assets/islandhop footer 1.png';

const Footer = () => {
  return (
    <footer className="w-full bg-blue-600 py-6 sm:py-8 border-t border-blue-700">
      <div className="footer-container">
        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <h3 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">About IslandHop</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-blue-100">
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">About us</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Press</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Resources and Policies</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">Explore</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-blue-100">
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Write a review</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Add a place</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Join</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Travelers' Choice</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">GreenLeaders</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Help Centre</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">Do Business With Us</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-blue-100">
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Owners</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Business Advantage</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Sponsored Placements</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Access our Content API</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">IslandHop Sites</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-blue-100">
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Book tours and attraction tickets on Viator</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-manipulation">Reserve dining at your favorite restaurants</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-blue-500 pt-4 sm:pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              <img src={islandHopFooter} alt="IslandHop" className="h-6 sm:h-8 w-auto" />
              <div className="text-xs sm:text-sm text-blue-100 text-center sm:text-left">
                © 2025 IslandHop LLC All rights reserved.
              </div>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-blue-100">
              <a href="#" className="hover:text-white transition-colors touch-manipulation">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors touch-manipulation">Privacy and Cookie Statement</a>
              <a href="#" className="hover:text-white transition-colors touch-manipulation">Cookie consent</a>
              <a href="#" className="hover:text-white transition-colors touch-manipulation">Site Map</a>
              <a href="#" className="hover:text-white transition-colors touch-manipulation">How the site works</a>
              <a href="#" className="hover:text-white transition-colors touch-manipulation">Contact us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
