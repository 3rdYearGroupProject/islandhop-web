import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <LoadingSpinner size="lg" color="primary" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
