import React from 'react';
import islandHopFooter from '../assets/islandhop footer 1.png';

const Footer = () => {
  return (
    <footer className="w-full bg-blue-600 py-8 border-t border-blue-700">
      <div className="footer-container">
        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-white mb-4">About IslandHop</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><a href="#" className="hover:text-white">About us</a></li>
              <li><a href="#" className="hover:text-white">Press</a></li>
              <li><a href="#" className="hover:text-white">Resources and Policies</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><a href="#" className="hover:text-white">Write a review</a></li>
              <li><a href="#" className="hover:text-white">Add a place</a></li>
              <li><a href="#" className="hover:text-white">Join</a></li>
              <li><a href="#" className="hover:text-white">Travelers' Choice</a></li>
              <li><a href="#" className="hover:text-white">GreenLeaders</a></li>
              <li><a href="#" className="hover:text-white">Help Centre</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Do Business With Us</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><a href="#" className="hover:text-white">Owners</a></li>
              <li><a href="#" className="hover:text-white">Business Advantage</a></li>
              <li><a href="#" className="hover:text-white">Sponsored Placements</a></li>
              <li><a href="#" className="hover:text-white">Access our Content API</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">IslandHop Sites</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><a href="#" className="hover:text-white">Book tours and attraction tickets on Viator</a></li>
              <li><a href="#" className="hover:text-white">Reserve dining at your favorite restaurants</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-blue-500 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <img src={islandHopFooter} alt="IslandHop" className="h-8 w-auto" />
              <div className="text-sm text-blue-100">
                © 2025 IslandHop LLC All rights reserved.
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-100">
              <a href="#" className="hover:text-white">Terms of Use</a>
              <a href="#" className="hover:text-white">Privacy and Cookie Statement</a>
              <a href="#" className="hover:text-white">Cookie consent</a>
              <a href="#" className="hover:text-white">Site Map</a>
              <a href="#" className="hover:text-white">How the site works</a>
              <a href="#" className="hover:text-white">Contact us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
