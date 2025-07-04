import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';

const TripProgressBar = ({ tripName, onBack, currentStep = 3 }) => (
  <div className="bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {tripName || 'New Trip'}
            </h1>
            <p className="text-gray-600 mt-1">Step 3 of 4 - Set your preferences</p>
          </div>
        </div>
        {/* Progress Indicator */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="flex items-center">
            <div className={`w-8 h-8 ${currentStep > 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'} rounded-full flex items-center justify-center text-sm font-bold`}>
              <Check className="w-4 h-4" />
            </div>
            <span className={`ml-2 text-sm font-medium ${currentStep > 1 ? 'text-gray-900' : 'text-gray-500'}`}>Name</span>
          </div>
          <div className={`w-8 h-1 ${currentStep > 1 ? 'bg-blue-600' : 'bg-gray-200'} rounded`}></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 ${(currentStep > 2 || currentStep === 3) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'} rounded-full flex items-center justify-center text-sm font-bold`}>
              {(currentStep > 2 || currentStep === 3) ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <span className={`ml-2 text-sm font-medium ${(currentStep > 2 || currentStep === 3) ? 'text-gray-900' : 'text-gray-500'}`}>Dates</span>
          </div>
          <div className={`w-8 h-1 ${currentStep > 2 ? 'bg-blue-600' : 'bg-gray-200'} rounded`}></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 ${currentStep > 3 ? 'bg-blue-600 text-white' : currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'} rounded-full flex items-center justify-center text-sm font-bold`}>
              3
            </div>
            <span className={`ml-2 text-sm font-medium ${currentStep === 3 ? 'text-gray-900' : 'text-gray-500'}`}>Preferences</span>
          </div>
          <div className={`w-8 h-1 ${currentStep > 3 ? 'bg-blue-600' : 'bg-gray-200'} rounded`}></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
              4
            </div>
            <span className="ml-2 text-sm font-medium text-gray-500">Review</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TripProgressBar;
