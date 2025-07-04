import React, { useEffect, useState } from 'react';
import errorLogger from '../utils/errorLogger';

const DevTools = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    // Update error count every 5 seconds
    const interval = setInterval(() => {
      const logs = errorLogger.getErrorLogs();
      setErrorCount(logs.length);
    }, 5000);

    // Initial check
    const logs = errorLogger.getErrorLogs();
    setErrorCount(logs.length);

    return () => clearInterval(interval);
  }, []);

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isVisible) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-purple-600 text-white px-3 py-2 rounded shadow-lg hover:bg-purple-700 transition text-sm"
          title="Show Development Tools"
        >
          🔧 Dev Tools {errorCount > 0 && `(${errorCount})`}
        </button>
      </div>
    );
  }

  const runDebugScript = () => {
    console.log('🔍 Running debug script...');
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      environment: process.env.NODE_ENV,
      reactVersion: React.version,
      errors: [],
      warnings: []
    };

    // Check for root element
    const root = document.getElementById('root');
    if (!root) {
      debugInfo.errors.push('Root element not found');
    } else if (!root.innerHTML.trim()) {
      debugInfo.errors.push('Root element is empty - WHITE PAGE ISSUE');
    }

    // Check for environment variables
    if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
      debugInfo.warnings.push('Missing REACT_APP_GOOGLE_CLIENT_ID');
    }

    console.group('🔍 DEBUG REPORT');
    console.log('Debug Info:', debugInfo);
    console.log('Error Logs:', errorLogger.getErrorLogs());
    console.log('Error Summary:', errorLogger.getErrorSummary());
    console.groupEnd();

    return debugInfo;
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Dev Tools</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 p-2 rounded">
            <div className="font-medium text-blue-800">Environment</div>
            <div className="text-blue-600">{process.env.NODE_ENV}</div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="font-medium text-green-800">Errors</div>
            <div className="text-green-600">{errorCount}</div>
          </div>
        </div>

        <div className="space-y-1">
          <button
            onClick={runDebugScript}
            className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition text-xs"
          >
            🔍 Run Debug Check
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition text-xs"
          >
            🔄 Reload Page
          </button>
          
          <button
            onClick={() => errorLogger.clearErrorLogs()}
            className="w-full bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-xs"
          >
            🗑️ Clear Error Logs
          </button>
          
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            className="w-full bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700 transition text-xs"
          >
            🧹 Clear All & Reload
          </button>
        </div>

        <div className="pt-2 border-t text-xs text-gray-500">
          💡 Check browser console for detailed logs
        </div>
      </div>
    </div>
  );
};

export default DevTools;
