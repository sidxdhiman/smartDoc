import React, { useState } from "react";
import Sidebar from "@/components/IssuerSidebar";
import DashboardPage from "@/app/page";
import { DocumentTemplates, BulkDocumentIssuance, Analytics, Settings } from "@/components/IssuerPageComponents";

const IssuerDashboard = () => {
  const [showDashboard, setShowDashboard] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showBulkIssuance, setShowBulkIssuance] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Function to reset all states
  const resetStates = () => {
    setShowDashboard(false);
    setShowTemplates(false);
    setShowBulkIssuance(false);
    setShowAnalytics(false);
    setShowSettings(false);
  };

  // Modified Sidebar component with state handlers
  const ModifiedSidebar = () => {
    const handleNavigation = (route) => {
      resetStates();
      switch(route) {
        case '/':
          setShowDashboard(true);
          break;
        case '/templates':
          setShowTemplates(true);
          break;
        case '/bulk-issuance':
          setShowBulkIssuance(true);
          break;
        case '/analytics':
          setShowAnalytics(true);
          break;
        case '/settings':
          setShowSettings(true);
          break;
        default:
          setShowDashboard(true);
      }
    };

    return (
      <Sidebar 
        onHomeClick={() => handleNavigation('/')}
        onTemplatesClick={() => handleNavigation('/templates')}
        onBulkIssuanceClick={() => handleNavigation('/bulk-issuance')}
        onAnalyticsClick={() => handleNavigation('/analytics')}
        onSettingsClick={() => handleNavigation('/settings')}
      />
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ModifiedSidebar />
      <div className="flex-1 ml-72">
        {showDashboard && <DashboardPage />}
        {showTemplates && <DocumentTemplates />}
        {showBulkIssuance && <BulkDocumentIssuance />}
        {showAnalytics && <Analytics />}
        {showSettings && <Settings />}
      </div>
    </div>
  );
};

export default IssuerDashboard;