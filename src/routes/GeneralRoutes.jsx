import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ProfessionalSignupPage from '../pages/ProfessionalSignupPage';
import LandingPage from '../pages/LandingPage';
import DiscoverPage from '../pages/Discover';
import PoolPage from '../pages/PoolPage'; 
import AboutPage from '../pages/AboutPage'; 
import TripDurationPage from '../pages/TripDurationPage';
import TripPreferencesPage from '../pages/TripPreferencesPage';
import TripItineraryPage from '../pages/TripItineraryPage';
import ViewTripPage from '../pages/ViewTripPage';
import MyTripsPage from '../pages/MyTripsPage';
import SelectDriverGuidePage from '../pages/SelectDriverGuidePage';
import PoolDurationPage from '../pages/pools/PoolDurationPage';
import PoolPreferencesPage from '../pages/pools/PoolPreferencesPage';
import PoolItineraryPage from '../pages/pools/PoolItineraryPage';
import PoolDetailsPage from '../pages/pools/PoolDetailsPage';
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
    <Route path="/about" element={
      <PublicRoute>
        <AboutPage />
      </PublicRoute>
    } />
    <Route path="/trips" element={
      <PublicRoute>
        <MyTripsPage />
      </PublicRoute>
    } />
    <Route path="/trip-duration" element={
      <PublicRoute>
        <TripDurationPage />
      </PublicRoute>
    } />
    <Route path="/trip-preferences" element={
      <PublicRoute>
        <TripPreferencesPage />
      </PublicRoute>
    } />
    <Route path="/trip-itinerary" element={
      <PublicRoute>
        <TripItineraryPage />
      </PublicRoute>
    } />
    <Route path="/trip/:tripId" element={
      <PublicRoute>
        <ViewTripPage />
      </PublicRoute>
    } />
    <Route path="/select-driver-guide" element={
      <PublicRoute>
        <SelectDriverGuidePage />
      </PublicRoute>
    } />
    
    {/* Pool Creation Routes */}
    <Route path="/pool-duration" element={
      <PublicRoute>
        <PoolDurationPage />
      </PublicRoute>
    } />
    <Route path="/pool-preferences" element={
      <PublicRoute>
        <PoolPreferencesPage />
      </PublicRoute>
    } />
    <Route path="/pool-itinerary" element={
      <PublicRoute>
        <PoolItineraryPage />
      </PublicRoute>
    } />
    <Route path="/pool-details" element={
      <PublicRoute>
        <PoolDetailsPage />
      </PublicRoute>
    } />
    
    {/* Protected Routes */}

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
