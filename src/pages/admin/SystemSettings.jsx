import React, { useState } from 'react';
import {
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  ComputerDesktopIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    systemName: 'IslandHop Platform',
    darkMode: false,
    notifications: true,
    autoBackup: true,
    cacheSize: 75,
    maxConcurrentUsers: 1000,
    apiTimeout: 30,
    twoFactorAuth: true,
    sessionTimeout: 120,
    passwordComplexity: true,
    loginAttempts: 5,
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    logLevel: 'info',
    betaFeatures: false,
    analytics: true,
    errorReporting: true,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSliderChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: parseInt(value)
    }));
  };

  const handleSelectChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={enabled}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-200 dark:bg-secondary-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
    </label>
  );

  const SliderInput = ({ label, value, min, max, onChange, description }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-secondary-600 rounded-lg appearance-none cursor-pointer slider"
      />
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            System Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure platform preferences and security settings
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          
          {/* General Settings - 2 columns wide */}
          <div className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <CogIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">General Settings</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  System Name
                </label>
                <input
                  type="text"
                  value={settings.systemName}
                  onChange={(e) => handleInputChange('systemName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enable dark theme</p>
                </div>
                <ToggleSwitch 
                  enabled={settings.darkMode}
                  onChange={() => handleToggle('darkMode')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enable system notifications</p>
                </div>
                <ToggleSwitch 
                  enabled={settings.notifications}
                  onChange={() => handleToggle('notifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto Backup</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Automatic system backups</p>
                </div>
                <ToggleSwitch 
                  enabled={settings.autoBackup}
                  onChange={() => handleToggle('autoBackup')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSelectChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="si">Sinhala</option>
                  <option value="ta">Tamil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSelectChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                >
                  <option value="UTC">UTC</option>
                  <option value="Asia/Colombo">Asia/Colombo</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>
            </div>
          </div>

          {/* Performance Settings - 2 columns wide */}
          <div className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-success-100 dark:bg-success-900/20 rounded-lg">
                <ComputerDesktopIcon className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Performance</h2>
            </div>

            <div className="space-y-6">
              <SliderInput
                label="Cache Size (GB)"
                value={settings.cacheSize}
                min={10}
                max={500}
                onChange={(value) => handleSliderChange('cacheSize', value)}
                description="Amount of disk space for caching"
              />

              <SliderInput
                label="Max Concurrent Users"
                value={settings.maxConcurrentUsers}
                min={100}
                max={10000}
                onChange={(value) => handleSliderChange('maxConcurrentUsers', value)}
                description="Maximum simultaneous users"
              />

              <SliderInput
                label="API Timeout (seconds)"
                value={settings.apiTimeout}
                min={5}
                max={120}
                onChange={(value) => handleSliderChange('apiTimeout', value)}
                description="Request timeout duration"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Log Level
                </label>
                <select
                  value={settings.logLevel}
                  onChange={(e) => handleSelectChange('logLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warn">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Settings - 2 columns wide */}
          <div className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-warning-100 dark:bg-warning-900/20 rounded-lg">
                <ShieldCheckIcon className="h-6 w-6 text-warning-600 dark:text-warning-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Require 2FA for admin access</p>
                </div>
                <ToggleSwitch 
                  enabled={settings.twoFactorAuth}
                  onChange={() => handleToggle('twoFactorAuth')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password Complexity</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enforce strong passwords</p>
                </div>
                <ToggleSwitch 
                  enabled={settings.passwordComplexity}
                  onChange={() => handleToggle('passwordComplexity')}
                />
              </div>

              <SliderInput
                label="Session Timeout (minutes)"
                value={settings.sessionTimeout}
                min={30}
                max={480}
                onChange={(value) => handleSliderChange('sessionTimeout', value)}
                description="Auto-logout after inactivity"
              />

              <SliderInput
                label="Max Login Attempts"
                value={settings.loginAttempts}
                min={3}
                max={10}
                onChange={(value) => handleSliderChange('loginAttempts', value)}
                description="Before account lockout"
              />
            </div>
          </div>

          {/* Notifications Settings - 2 columns wide (bottom row) */}
          <div className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-info-100 dark:bg-info-900/20 rounded-lg">
                <BellIcon className="h-6 w-6 text-info-600 dark:text-info-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Send alerts via email</p>
                </div>
                <ToggleSwitch 
                  enabled={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Push Notifications</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Browser push notifications</p>
                </div>
                <ToggleSwitch 
                  enabled={settings.pushNotifications}
                  onChange={() => handleToggle('pushNotifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SMS Notifications</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Send critical alerts via SMS</p>
                </div>
                <ToggleSwitch 
                  enabled={settings.smsNotifications}
                  onChange={() => handleToggle('smsNotifications')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleSelectChange('dateFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          {/* System Preferences - 2 columns wide (bottom row) */}
          <div className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <GlobeAltIcon className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preferences</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Beta Features</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enable experimental features</p>
                </div>
                <ToggleSwitch 
                  enabled={settings.betaFeatures}
                  onChange={() => handleToggle('betaFeatures')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Analytics</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Collect usage analytics</p>
                </div>
                <ToggleSwitch 
                  enabled={settings.analytics}
                  onChange={() => handleToggle('analytics')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Error Reporting</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Automatic error reports</p>
                </div>
                <ToggleSwitch 
                  enabled={settings.errorReporting}
                  onChange={() => handleToggle('errorReporting')}
                />
              </div>
            </div>
          </div>

          {/* Advanced Settings - 2 columns wide (bottom row) */}
          <div className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-danger-100 dark:bg-danger-900/20 rounded-lg">
                <ClockIcon className="h-6 w-6 text-danger-600 dark:text-danger-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Advanced</h2>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-warning-50 dark:bg-warning-900/10 border border-warning-200 dark:border-warning-800 rounded-lg">
                <h4 className="text-sm font-medium text-warning-800 dark:text-warning-300 mb-2">
                  ⚠️ Advanced Settings
                </h4>
                <p className="text-xs text-warning-700 dark:text-warning-400">
                  These settings can affect system performance and security. Change with caution.
                </p>
              </div>

              <div className="space-y-4">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 rounded-lg border border-gray-200 dark:border-secondary-600 transition-colors">
                  Clear System Cache
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 rounded-lg border border-gray-200 dark:border-secondary-600 transition-colors">
                  Rebuild Search Index
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 rounded-lg border border-gray-200 dark:border-secondary-600 transition-colors">
                  Export System Logs
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/10 rounded-lg border border-danger-200 dark:border-danger-800 transition-colors">
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
