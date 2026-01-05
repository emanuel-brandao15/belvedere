
import React, { useState } from 'react';
import Layout from './components/Layout';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import PredictiveAI from './components/PredictiveAI';
import SupplierAnalysis from './components/SupplierAnalysis';
import Login from './components/Login';
import { AppTab } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.WELCOME);

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.WELCOME:
        return <Welcome onStart={(tab) => setActiveTab(tab)} />;
      case AppTab.DASHBOARD:
        return <Dashboard />;
      case AppTab.PREDICTIVE:
        return <PredictiveAI />;
      case AppTab.SUPPLIERS:
        return <SupplierAnalysis />;
      default:
        return <Welcome onStart={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="pb-24 md:pb-8">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;