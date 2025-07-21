import OngoingTripPage from './pages/OngoingTripPage';
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/ToastProvider'
import ErrorBoundary from './components/ErrorBoundary'
import DevTools from './components/DevTools'

// Import error logger to initialize global error handling
import './utils/errorLogger'

// --- Route Imports ---
import SupportRoutes from './routes/SupportRoutes';
import AdminRoutes from './routes/AdminRoutes';
import GuideRoutes from './routes/GuideRoutes';
import DriverRoutes from './routes/DriverRoutes';
import TouristRoutes from './routes/TouristRoutes'; 
import GeneralRoutes from './routes/GeneralRoutes'; 

// --- Protected Route Imports ---
import ProtectedRoute from './routes/ProtectedRoute'; 

// --- End Route Imports ---


import './App.css'
import QuickActionsButton from './components/QuickActionsButton';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <ErrorBoundary>
      <ToastProvider>
        <DevTools />
        {/* Quick Actions Button always visible for logged in users */}
        <QuickActionsButton isLoggedIn={isAuthenticated} />
        <Routes>
          {/* General/Public and Tourist Routes */}
          <Route path="/*" element={<GeneralRoutes />} />
          {/* Ongoing Trip Page */}
          <Route path="/ongoing-trip" element={<OngoingTripPage />} />
          {/* Admin Dashboard */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          {/* Support Dashboard */}
          <Route path="/support/*" element={<SupportRoutes />} />
          {/* Tourist Dashboard */}
          <Route path="/tourist/*" element={<TouristRoutes />} /> 
          {/* Driver Dashboard */}
          <Route path="/driver/*" element={<DriverRoutes />} />
          {/* Guide Dashboard */}
          <Route path="/guide/*" element={<GuideRoutes />} />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
