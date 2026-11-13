import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { FalseAlarmModal } from './components/layout/FalseAlarmModal';

import { HomeView } from './components/views/HomeView';
import { DashboardView } from './components/views/DashboardView';
import { SensorMonitoringView } from './components/views/SensorMonitoringView';
import { AccidentDetectionView } from './components/views/AccidentDetectionView';
import { RiskPredictionView } from './components/views/RiskPredictionView';
import { MLSeverityView } from './components/views/MLSeverityView';
import { SurvivorAssessmentView } from './components/views/SurvivorAssessmentView';
import { GpsTrackingView } from './components/views/GpsTrackingView';
import { EmergencyAlertsView } from './components/views/EmergencyAlertsView';
import { RescueOptimizationView } from './components/views/RescueOptimizationView';
import { AccidentHistoryView } from './components/views/AccidentHistoryView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { MeshConnectivityView } from './components/views/MeshConnectivityView';
import { HardwareHubView } from './components/views/HardwareHubView';
import { Menu, Activity, ShieldCheck, HeartPulse } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, userRole } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'dashboard':
        return <DashboardView />;
      case 'iot-monitoring':
        return <SensorMonitoringView />;
      case 'accident-detection':
        return <AccidentDetectionView />;
      case 'risk-prediction':
        return <RiskPredictionView />;
      case 'ml-severity':
        return <MLSeverityView />;
      case 'survivor-assessment':
        return <SurvivorAssessmentView />;
      case 'gps-tracking':
        return <GpsTrackingView />;
      case 'emergency-alerts':
        return <EmergencyAlertsView />;
      case 'rescue-optimization':
        return <RescueOptimizationView />;
      case 'accident-history':
        return <AccidentHistoryView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'mesh-connectivity':
        return <MeshConnectivityView />;
      case 'hardware-hub':
        return <HardwareHubView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg,#080b14)] text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 15-second driver countdown overlay if crash occurs */}
      <FalseAlarmModal />

      {/* Top Bar Header */}
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 flex flex-col min-w-0 overflow-y-auto">
          {/* Mobile Top Controls Bar */}
          <div className="lg:hidden p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2 text-xs font-medium"
            >
              <Menu className="w-4 h-4" />
              <span>Navigation Menu</span>
            </button>
            <span className="text-xs font-mono text-cyan-400 capitalize">
              Role: {userRole}
            </span>
          </div>

          {/* Viewport Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {renderActiveView()}
          </div>

          {/* Clean Engineering Footer */}
          <footer className="mt-auto px-6 py-4 border-t border-slate-800/80 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">PLURIPOTENT</span>
              <span>·</span>
              <span>IoT & ML Intelligent Road Safety System</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
              <span>ESP32 100Hz IMU Telemetry</span>
              <span>·</span>
              <span>NHTSA Calibrated ML Weights</span>
              <span>·</span>
              <span>Prototype Platform</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
