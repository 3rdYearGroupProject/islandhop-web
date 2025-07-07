import React, { useState, useEffect } from 'react';
import {
  CogIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const AISettings = () => {
  const [settings, setSettings] = useState({
    recommendationModel: "advanced",
    routeOptimization: true,
    priceOptimization: true,
    demandPrediction: true,
    trainingFrequency: "weekly",
    learningRate: 0.001,
    batchSize: 32,
    epochs: 100,
    dataRetention: "6months",
    smartMatching: true,
    predictiveAnalytics: true,
    autoResponseSystem: false,
    fraudDetection: true,
    sentimentAnalysis: true,
    chatbotAssistant: false,
    dynamicPricing: true,
    trafficPrediction: true,
    apiResponseTime: 500,
    confidenceThreshold: 0.8,
    fallbackEnabled: true,
    debugMode: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [modelStatus, setModelStatus] = useState({
    recommendation: "active",
    routing: "training",
    pricing: "active",
    fraud: "active",
  });

  useEffect(() => {
    // Simulate loading saved settings
    const savedTime = new Date().toLocaleString();
    setLastSaved(savedTime);
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setLastSaved(new Date().toLocaleString());
      // Show success message
    }, 2000);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all AI settings to default values?')) {
      setSettings({
        recommendationModel: "standard",
        routeOptimization: true,
        priceOptimization: false,
        demandPrediction: true,
        trainingFrequency: "daily",
        learningRate: 0.01,
        batchSize: 16,
        epochs: 50,
        dataRetention: "3months",
        smartMatching: true,
        predictiveAnalytics: false,
        autoResponseSystem: false,
        fraudDetection: true,
        sentimentAnalysis: false,
        chatbotAssistant: false,
        dynamicPricing: false,
        trafficPrediction: false,
        apiResponseTime: 1000,
        confidenceThreshold: 0.7,
        fallbackEnabled: true,
        debugMode: false,
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { icon: CheckCircleIcon, color: 'text-success-600', bg: 'bg-success-100', text: 'Active' },
      training: { icon: ArrowPathIcon, color: 'text-warning-600', bg: 'bg-warning-100', text: 'Training' },
      inactive: { icon: XCircleIcon, color: 'text-neutral-600', bg: 'bg-neutral-100', text: 'Inactive' },
      error: { icon: ExclamationTriangleIcon, color: 'text-danger-600', bg: 'bg-danger-100', text: 'Error' }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl ">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">AI Settings</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Configure artificial intelligence and machine learning features
          </p>
          {lastSaved && (
            <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
              Last saved: {lastSaved}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleResetToDefaults}
            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-secondary-800 border border-neutral-300 dark:border-secondary-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-secondary-700 transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 rounded-lg transition-colors flex items-center gap-2"
          >
            {isLoading && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Model Status Overview */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
            <ChartBarIcon className="h-6 w-6 text-primary-600" />
            Model Status Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(modelStatus).map(([key, status]) => (
              <div key={key} className="bg-neutral-50 dark:bg-secondary-900 rounded-lg p-4">
                <h4 className="font-medium text-neutral-900 dark:text-white capitalize mb-2">
                  {key.replace(/([A-Z])/g, ' $1').trim()} Model
                </h4>
                {getStatusBadge(status)}
              </div>
            ))}
          </div>
        </div>

        {/* General AI Settings */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
            <CogIcon className="h-6 w-6 text-primary-600" />
            General AI Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Recommendation Model
              </label>
              <select
                value={settings.recommendationModel}
                onChange={(e) => handleSettingChange('recommendationModel', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Training Frequency
              </label>
              <select
                value={settings.trainingFrequency}
                onChange={(e) => handleSettingChange('trainingFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Data Retention Period
              </label>
              <select
                value={settings.dataRetention}
                onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="1month">1 Month</option>
                <option value="3months">3 Months</option>
                <option value="6months">6 Months</option>
                <option value="1year">1 Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Confidence Threshold: {settings.confidenceThreshold}
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={settings.confidenceThreshold}
                onChange={(e) => handleSettingChange('confidenceThreshold', parseFloat(e.target.value))}
                className="w-full h-2 bg-neutral-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Features */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
            <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
            AI Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { key: 'routeOptimization', label: 'Route Optimization', description: 'AI-powered route planning and optimization' },
              { key: 'priceOptimization', label: 'Price Optimization', description: 'Dynamic pricing based on demand and market conditions' },
              { key: 'demandPrediction', label: 'Demand Prediction', description: 'Predict travel demand patterns' },
              { key: 'smartMatching', label: 'Smart Matching', description: 'AI-powered user and service matching' },
              { key: 'predictiveAnalytics', label: 'Predictive Analytics', description: 'Advanced analytics and forecasting' },
              { key: 'fraudDetection', label: 'Fraud Detection', description: 'AI-powered fraud detection and prevention' },
              { key: 'sentimentAnalysis', label: 'Sentiment Analysis', description: 'Analyze user sentiment from reviews and feedback' },
              { key: 'dynamicPricing', label: 'Dynamic Pricing', description: 'Real-time price adjustments' },
              { key: 'trafficPrediction', label: 'Traffic Prediction', description: 'Predict traffic patterns and congestion' }
            ].map((feature) => (
              <div key={feature.key} className="bg-neutral-50 dark:bg-secondary-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-neutral-900 dark:text-white">{feature.label}</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[feature.key]}
                      onChange={(e) => handleSettingChange(feature.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 dark:bg-secondary-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Advanced Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Learning Rate
              </label>
              <input
                type="number"
                step="0.001"
                value={settings.learningRate}
                onChange={(e) => handleSettingChange('learningRate', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Batch Size
              </label>
              <input
                type="number"
                value={settings.batchSize}
                onChange={(e) => handleSettingChange('batchSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Epochs
              </label>
              <input
                type="number"
                value={settings.epochs}
                onChange={(e) => handleSettingChange('epochs', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-secondary-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-neutral-900 dark:text-white">Debug Mode</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Enable detailed logging and debugging information</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.debugMode}
                  onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 dark:bg-secondary-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettings;
