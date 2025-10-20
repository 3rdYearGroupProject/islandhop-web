import React from 'react';
import { useNavigate } from 'react-router-dom';

const TranslationTest = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          ← Back to Home
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Google Translate Test Page
          </h1>
          <p className="text-lg text-gray-600">
            Use the language selector in the navbar (🌐) to translate this page into different languages.
          </p>
        </div>

        {/* Test Sections */}
        <div className="space-y-6">
          {/* Section 1: Basic Text */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Sri Lanka
            </h2>
            <p className="text-gray-700 mb-4">
              Sri Lanka is a beautiful island nation in South Asia, known for its stunning beaches, 
              ancient temples, lush tea plantations, and incredible wildlife. Explore the historic 
              cities, enjoy authentic Sri Lankan cuisine, and experience the warm hospitality of the locals.
            </p>
            <p className="text-gray-700">
              From the sacred city of Kandy to the pristine beaches of Mirissa, every corner of 
              Sri Lanka offers unique experiences and unforgettable memories.
            </p>
          </div>

          {/* Section 2: Common Phrases */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Common Travel Phrases
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Hello - Good morning</li>
              <li>• Thank you - You're welcome</li>
              <li>• Where is the hotel?</li>
              <li>• How much does this cost?</li>
              <li>• Can you help me?</li>
              <li>• I would like to book a tour</li>
              <li>• Where is the nearest restaurant?</li>
            </ul>
          </div>

          {/* Section 3: Destinations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Colombo</h3>
                <p className="text-gray-700">The bustling capital city with modern attractions</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Kandy</h3>
                <p className="text-gray-700">Cultural capital and home to the Temple of the Tooth</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Galle</h3>
                <p className="text-gray-700">Historic fort city with Dutch colonial architecture</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Ella</h3>
                <p className="text-gray-700">Mountain paradise with breathtaking views</p>
              </div>
            </div>
          </div>

          {/* Section 4: Numbers and Dates */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Numbers and Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="font-semibold">Price: $1,500</p>
                <p className="font-semibold">Duration: 7 days</p>
                <p className="font-semibold">Group size: 10 people</p>
              </div>
              <div>
                <p className="font-semibold">Distance: 150 kilometers</p>
                <p className="font-semibold">Temperature: 28°C</p>
                <p className="font-semibold">Rating: 4.8 out of 5 stars</p>
              </div>
            </div>
          </div>

          {/* Section 5: Form Labels */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sample Booking Form
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Travel Dates
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Special Requests
                </label>
                <textarea
                  placeholder="Tell us about your preferences"
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                />
              </div>
              <button
                type="button"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Submit Booking Request
              </button>
            </form>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🧪 Testing Instructions
            </h2>
            <ol className="space-y-3 text-gray-700">
              <li>
                <strong>1.</strong> Click the language selector (🌐) in the top navigation bar
              </li>
              <li>
                <strong>2.</strong> Choose a language from the dropdown (e.g., Spanish, French, Chinese, Tamil, etc.)
              </li>
              <li>
                <strong>3.</strong> Watch as all text on this page automatically translates
              </li>
              <li>
                <strong>4.</strong> Try different languages to test various translations
              </li>
              <li>
                <strong>5.</strong> Refresh the page - your language selection should persist
              </li>
              <li>
                <strong>6.</strong> Navigate to other pages - translations should work across the entire site
              </li>
            </ol>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-800 text-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-3">🔍 Debug Information</h3>
          <div className="space-y-2 font-mono text-sm">
            <p>Current Language: <span className="text-green-400">{localStorage.getItem('selectedLanguage') || 'en'}</span></p>
            <p>Saved Language Code: <span className="text-green-400">{localStorage.getItem('googtrans') || 'Not set'}</span></p>
            <p>Google Translate Loaded: <span className="text-green-400">{typeof window.google !== 'undefined' ? 'Yes ✓' : 'No ✗'}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationTest;
