import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and any external service
    console.error('🚨 Error Boundary caught an error:', error);
    console.error('📍 Error Info:', errorInfo);
    
    // Store error details in state
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log detailed error information
    this.logError(error, errorInfo);
  }

  logError = (error, errorInfo) => {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId(), // Get user ID if available
    };

    console.group('🔥 DETAILED ERROR LOG');
    console.error('Error Message:', errorDetails.message);
    console.error('Error Stack:', errorDetails.stack);
    console.error('Component Stack:', errorDetails.componentStack);
    console.error('Timestamp:', errorDetails.timestamp);
    console.error('User Agent:', errorDetails.userAgent);
    console.error('URL:', errorDetails.url);
    console.error('User ID:', errorDetails.userId);
    console.groupEnd();

    // Store in localStorage for persistence
    try {
      const existingErrors = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      existingErrors.push(errorDetails);
      // Keep only last 50 errors
      if (existingErrors.length > 50) {
        existingErrors.splice(0, existingErrors.length - 50);
      }
      localStorage.setItem('errorLogs', JSON.stringify(existingErrors));
    } catch (e) {
      console.error('Failed to store error in localStorage:', e);
    }

    // Send to external logging service if needed
    // this.sendToLoggingService(errorDetails);
  };

  getUserId = () => {
    try {
      // Try to get user ID from localStorage
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed.uid || 'unknown';
      }
    } catch (e) {
      // Ignore errors when getting user ID
    }
    return 'anonymous';
  };

  sendToLoggingService = (errorDetails) => {
    // Uncomment and configure this to send to your logging service
    // fetch('/api/log-error', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorDetails)
    // }).catch(err => console.error('Failed to send error to logging service:', err));
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Something went wrong
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  We're sorry, but something unexpected happened. The error has been logged and we'll look into it.
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Reload Page
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/'}
                    className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Go to Home
                  </button>
                </div>

                {/* Show error details in development */}
                {process.env.NODE_ENV === 'development' && (
                  <details className="mt-6 text-left">
                    <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                      Show Error Details (Development)
                    </summary>
                    <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto max-h-40">
                      <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                      <br />
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
