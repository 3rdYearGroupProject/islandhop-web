import React from "react";
import { Routes, Route } from "react-router-dom";
import SupportDashboardLayout from "../components/SupportDashboardLayout";
import ProtectedSupportRoute from "../components/ProtectedSupportRoute";

// Import support pages
import SupportDashboard from "../pages/support/SupportDashboard";
import ViewTickets from "../pages/support/ViewTickets";
import Reviews from "../pages/support/Reviews";
import ChatEmailSupport from "../pages/support/ChatEmailSupport";
import ResolveComplaint from "../pages/support/ResolveComplaint";
import LostItemTracker from "../pages/support/LostItemTracker";
import PanicAlerts from "../pages/support/PanicAlerts";
import SupportProfile from "../pages/support/SupportProfile";
import Communications from "../pages/admin/Communications";
import Verifications from "../pages/support/Verification";

const SupportRoutes = () => {
  return (
    <SupportDashboardLayout>
      <Routes>
        <Route path="/" element={<SupportDashboard />} />
        <Route path="dashboard" element={<SupportDashboard />} />
        <Route path="tickets" element={<ViewTickets />} />
        <Route 
          path="reviews" 
          element={
            <ProtectedSupportRoute requiredPermissions={[2, 4]}>
              <Reviews />
            </ProtectedSupportRoute>
          } 
        />
        <Route path="chat-email" element={<ChatEmailSupport />} />
        <Route path="communications" element={<Communications />} />
        <Route 
          path="verifications" 
          element={
            <ProtectedSupportRoute requiredPermissions={[1, 4]}>
              <Verifications />
            </ProtectedSupportRoute>
          } 
        />
        <Route 
          path="resolve-complaint" 
          element={
            <ProtectedSupportRoute requiredPermissions={[3, 4]}>
              <ResolveComplaint />
            </ProtectedSupportRoute>
          } 
        />
        <Route path="lost-item-tracker" element={<LostItemTracker />} />
        <Route path="panic-alerts" element={<PanicAlerts />} />
        <Route path="profile" element={<SupportProfile />} />
      </Routes>
    </SupportDashboardLayout>
  );
};

export default SupportRoutes;
