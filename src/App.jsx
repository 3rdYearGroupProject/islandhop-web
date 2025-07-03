import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Import hooks
import { useAuth } from './hooks/useAuth';

// Import routes
import GeneralRoutes from './routes/GeneralRoutes';
import TouristRoutes from './routes/TouristRoutes';
import DriverRoutes from './routes/DriverRoutes';
import GuideRoutes from './routes/GuideRoutes';
import AdminRoutes from './routes/AdminRoutes';
import SupportRoutes from './routes/SupportRoutes';
import ProtectedRoute from './routes/ProtectedRoute';

// Import components
import LoadingSpinner from './components/LoadingSpinner';

// Import pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfessionalSignupPage from './pages/ProfessionalSignupPage';
import MyTripsPage from './pages/MyTripsPage';

function App() {
  const { user, loading, userRole, isDarkMode, toggleDarkMode } = useAuth();
  const [isAppLoading, setIsAppLoading] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen while app is initializing
  if (isAppLoading ) {
    return (
      <div className="min-h-screen bg-white dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <LoadingSpinner size="lg" color="primary" />
          </div>
          
        </div>
      </div>
    );
  }

  return (
    <div className={`App ${isDarkMode ? 'dark' : ''}`}>
      <Router>
        <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/trips" element={<MyTripsPage />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to={`/${userRole}`} replace /> : <LoginPage />} 
            />
            <Route 
              path="/signup" 
              element={user ? <Navigate to={`/${userRole}`} replace /> : <SignupPage />} 
            />
            <Route 
              path="/professional-signup" 
              element={user ? <Navigate to={`/${userRole}`} replace /> : <ProfessionalSignupPage />} 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/tourist/*" 
              element={
                <ProtectedRoute allowedRoles={['tourist']}>
                  <TouristRoutes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/driver/*" 
              element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <DriverRoutes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/guide/*" 
              element={
                <ProtectedRoute allowedRoles={['guide']}>
                  <GuideRoutes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminRoutes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/support/*" 
              element={
                <ProtectedRoute allowedRoles={['support']}>
                  <SupportRoutes />
                </ProtectedRoute>
              } 
            />
            
            {/* General Routes */}
            <Route path="/general/*" element={<GeneralRoutes />} />
            
            {/* Redirect based on user role */}
            {user && (
              <Route 
                path="*" 
                element={<Navigate to={`/${userRole}`} replace />} 
              />
            )}
            
            {/* Fallback for unauthenticated users */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={isDarkMode ? 'dark' : 'light'}
            className="toast-container"
          />
          
          {/* Dark Mode Toggle - Development only */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={toggleDarkMode}
              className="fixed bottom-4 right-4 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors duration-200 z-50"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </Router>
    </div>
  );
}

export default App;
