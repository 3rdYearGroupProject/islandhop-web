import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SupportDashboardLayout from '../components/SupportDashboardLayout';

// Import support pages
import SupportDashboard from '../pages/support/SupportDashboard';
import ViewTickets from '../pages/support/ViewTickets';
import ChatEmailSupport from '../pages/support/ChatEmailSupport';
import ResolveComplaint from '../pages/support/ResolveComplaint';
import EscalateIssue from '../pages/support/EscalateIssue';
import RefundCompensation from '../pages/support/RefundCompensation';
import LostItemTracker from '../pages/support/LostItemTracker';
import PanicAlerts from '../pages/support/PanicAlerts';
import SupportReports from '../pages/support/SupportReports';
import SupportProfile from '../pages/support/SupportProfile';

const SupportRoutes = () => {
  return (
    <SupportDashboardLayout>
      <Routes>
        <Route path="/" element={<SupportDashboard />} />
        <Route path="dashboard" element={<SupportDashboard />} />
        <Route path="tickets" element={<ViewTickets />} />
        <Route path="chat-email" element={<ChatEmailSupport />} />
        <Route path="resolve-complaint" element={<ResolveComplaint />} />
        <Route path="escalate-issue" element={<EscalateIssue />} />
        <Route path="refund-compensation" element={<RefundCompensation />} />
        <Route path="lost-item-tracker" element={<LostItemTracker />} />
        <Route path="panic-alerts" element={<PanicAlerts />} />
        <Route path="reports" element={<SupportReports />} />
        <Route path="profile" element={<SupportProfile />} />
      </Routes>
    </SupportDashboardLayout>
  );
};

export default SupportRoutes;
