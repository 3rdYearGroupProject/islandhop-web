import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/islandHopIcon.png'; // Adjust the path as necessary

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white w-full border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="IslandHop Logo" className="h-8 w-8 mr-2" />
          <span className="text-2xl font-bold text-primary-600 tracking-tight">IslandHop</span>
        </Link>
        {/* Nav Links */}
        <div className="hidden md:flex space-x-6 mx-auto">
          <Link to="/discover" className="text-gray-700 hover:text-primary-600 font-medium">Discover</Link>
          <Link to="/trips" className="text-gray-700 hover:text-primary-600 font-medium">Trips</Link>
          <Link to="/review" className="text-gray-700 hover:text-primary-600 font-medium">Review</Link>
          <Link to="/more" className="text-gray-700 hover:text-primary-600 font-medium">More</Link>
        </div>
        {/* User/Currency */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-700 hover:text-primary-600 font-medium flex items-center">
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            USD
          </button>
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.displayName?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-gray-700 font-medium">{user.displayName}</span>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">Sign in</Link>
              <Link to="/signup" className="ml-2 px-4 py-2 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition">Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
