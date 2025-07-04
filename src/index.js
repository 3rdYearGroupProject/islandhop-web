import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './components/ToastProvider';
import errorLogger from './utils/errorLogger';

// Initialize error logging
console.log('🚀 IslandHop Web App Starting...');
console.log('Environment:', process.env.NODE_ENV);
console.log('React Version:', React.version);

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

// Check for missing environment variables
if (!clientId) {
  console.warn('⚠️ Missing REACT_APP_GOOGLE_CLIENT_ID environment variable');
  errorLogger.logWarning('Missing Google Client ID', { 
    env: process.env.NODE_ENV,
    availableEnvVars: Object.keys(process.env).filter(key => key.startsWith('REACT_APP_'))
  });
}

// Log app initialization
errorLogger.logInfo('app_initialization', {
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
  url: window.location.href,
  hasGoogleClientId: !!clientId
});

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  if (!root) {
    throw new Error('Root element not found');
  }

  console.log('✅ Root element found, rendering app...');

  root.render(
    <GoogleOAuthProvider clientId={clientId}>
      <ToastProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ToastProvider>
    </GoogleOAuthProvider>
  );

  console.log('✅ App rendered successfully');
  errorLogger.logInfo('app_render_success', { timestamp: new Date().toISOString() });

} catch (error) {
  console.error('❌ Failed to render app:', error);
  errorLogger.logError({
    type: 'app_render_error',
    message: 'Failed to render React app',
    error: error.message,
    stack: error.stack
  });

  // Fallback: show error message in the root element
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background: #f9f9f9;">
          <h2 style="color: #d32f2f;">Application Failed to Load</h2>
          <p>There was an error loading the application. Please try refreshing the page.</p>
          <p style="font-size: 12px; color: #666;">Error: ${error.message}</p>
          <button onclick="window.location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}


