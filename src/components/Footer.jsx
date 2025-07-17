import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import islandHopFooter from '../assets/islandhop footer 1.png';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <img src={islandHopFooter} alt="IslandHop" className="h-8 w-auto" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted partner for authentic Sri Lankan adventures. Connect with verified local guides and fellow travelers to create unforgettable memories.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/discover" className="hover:text-primary-500 transition-colors">Destinations</Link></li>
              <li><Link to="/pools" className="hover:text-primary-500 transition-colors">Travel Pools</Link></li>
              <li><Link to="/experiences" className="hover:text-primary-500 transition-colors">Experiences</Link></li>
              <li><Link to="/guides" className="hover:text-primary-500 transition-colors">Local Guides</Link></li>
              <li><Link to="/activities" className="hover:text-primary-500 transition-colors">Activities</Link></li>
              <li><Link to="/trips" className="hover:text-primary-500 transition-colors">Plan Your Trip</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/signup?role=guide" className="hover:text-primary-500 transition-colors">Become a Guide</Link></li>
              <li><Link to="/signup?role=driver" className="hover:text-primary-500 transition-colors">Become a Driver</Link></li>
              <li><Link to="/business" className="hover:text-primary-500 transition-colors">Business Solutions</Link></li>
              <li><Link to="/partnerships" className="hover:text-primary-500 transition-colors">Partnerships</Link></li>
              <li><Link to="/support" className="hover:text-primary-500 transition-colors">Help Center</Link></li>
              <li><Link to="/safety" className="hover:text-primary-500 transition-colors">Safety Guidelines</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p>IslandHop Headquarters</p>
                  <p className="text-gray-400">Colombo, Sri Lanka</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-500 flex-shrink-0" />
                <p>+94 11 123 4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-500 flex-shrink-0" />
                <p>hello@islandhop.lk</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 IslandHop. All rights reserved. | Made with ❤️ in Sri Lanka
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-500 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-500 transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="text-gray-400 hover:text-primary-500 transition-colors">Cookie Policy</Link>
              <Link to="/about" className="text-gray-400 hover:text-primary-500 transition-colors">About Us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
