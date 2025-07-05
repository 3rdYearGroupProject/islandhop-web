import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';

const PoolProgressBar = ({ poolName, onBack, currentStep = 2, completedSteps = [] }) => {
  const steps = [
    { number: 1, label: 'Name' },
    { number: 2, label: 'Dates' },
    { number: 3, label: 'Preferences' },
    { number: 4, label: 'Destinations' }
  ];

  const getStepDescription = (step) => {
    switch(step) {
      case 1: return 'Choose your pool name';
      case 2: return 'Select dates and pool size';
      case 3: return 'Set preferences and details';
      case 4: return 'Plan your destinations';
      case 5: return 'Finalize pool details';
      default: return 'Create your pool';
    }
  };

  const getStepStyle = (stepNumber) => {
    const isCompleted = completedSteps.includes(stepNumber);
    const isCurrent = currentStep === stepNumber;
    
    if (isCompleted) {
      return {
        circle: 'bg-green-600 text-white border-2 border-green-600 shadow-sm',
        text: 'text-gray-900',
        connector: 'bg-green-600'
      };
    }
    
    if (isCurrent) {
      return {
        circle: 'bg-blue-600 text-white border-2 border-blue-600 shadow-lg ring-4 ring-blue-100',
        text: 'text-blue-600 font-semibold',
        connector: 'bg-gray-300'
      };
    }
    
    return {
      circle: 'bg-white text-gray-400 border-2 border-gray-300',
      text: 'text-gray-500',
      connector: 'bg-gray-300'
    };
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Back Button and Pool Name */}
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-6 group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 truncate max-w-xs sm:max-w-md">
                {poolName || 'Create Pool'}
              </h1>
              <p className="text-sm text-gray-600">
                {getStepDescription(currentStep)}
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="hidden md:flex items-center space-x-8">
            {steps.map((step, index) => {
              const style = getStepStyle(step.number);
              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${style.circle}`}>
                      {completedSteps.includes(step.number) ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="ml-3">
                      <div className={`text-sm font-medium transition-colors ${style.text}`}>
                        {step.label}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-4 rounded-full transition-colors ${style.connector}`}></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Progress Indicator */}
          <div className="md:hidden">
            <div className="text-sm font-medium text-gray-900">
              {currentStep > steps.length ? 'Final Step' : `Step ${currentStep} of ${steps.length}`}
            </div>
            <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((currentStep / steps.length) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolProgressBar;
