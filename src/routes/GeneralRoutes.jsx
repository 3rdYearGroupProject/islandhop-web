import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ProfessionalSignupPage from '../pages/ProfessionalSignupPage';
import LandingPage from '../pages/LandingPage';
import DiscoverPage from '../pages/Discover';
import PoolPage from '../pages/PoolPage'; 
import { Navigate } from 'react-router-dom';

const ProtectedRouteWrapper = ({ children }) => {
  // ...existing code for auth check...
  return children;
};
const PublicRoute = ({ children }) => {
  // ...existing code for public route check...
  return children;
};

const GeneralRoutes = () => (
  <Routes>
    <Route path="/" element={
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    } />
    <Route path="/login" element={
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    } />
    <Route path="/discover" element={
      <PublicRoute>
        <DiscoverPage />
      </PublicRoute>
    } />
    <Route path="/pools" element={
      <PublicRoute>
        <PoolPage />
      </PublicRoute>
    } />

    <Route path="/signup" element={
      <PublicRoute>
        <SignupPage />
      </PublicRoute>
    } />
    <Route path="/signup/professional" element={
      <PublicRoute>
        <ProfessionalSignupPage />
      </PublicRoute>
    } />
    
    {/* Catch-all for general routes */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default GeneralRoutes;
