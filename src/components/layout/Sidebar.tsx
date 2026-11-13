import React from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import {
  Home,
  LayoutDashboard,
  Cpu,
  AlertTriangle,
  Compass,
  BrainCircuit,
  HeartPulse,
  MapPin,
  Bell,
  Ambulance,
  History,
  BarChart3,
  Share2,
  Terminal,
  Activity,
  Radio
} from 'lucide-react';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  highlightForRoles?: string[];
}

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, userRole, telemetry, colorTheme, setColorTheme } = useApp();

  const themes: { id: 'amber' | 'emerald' | 'blue' | 'violet' | 'crimson' | 'cyan' | 'light'; colorHex: string; title: string }[] = [
    { id: 'emerald', colorHex: '#10b981', title: 'Cyber Emerald / Bio-Safe' },
    { id: 'amber', colorHex: '#f59e0b', title: 'Amber / Hazard Gold' },
    { id: 'blue', colorHex: '#3b82f6', title: 'Electric Cobalt' },
    { id: 'violet', colorHex: '#8b5cf6', title: 'Neon Violet' },
    { id: 'crimson', colorHex: '#f43f5e', title: 'Trauma Crimson' },
    { id: 'cyan', colorHex: '#06b6d4', title: 'Deep Space Cyan' },
    { id: 'light', colorHex: '#e2e8f0', title: 'Titanium Light' }
  ];

  const coreNavItems: NavItem[] = [
    { id: 'home', label: 'Project Overview', icon: Home },
    { id: 'dashboard', label: 'Real-Time Dashboard', icon: LayoutDashboard },
    { id: 'iot-monitoring', label: 'IoT Sensor Telemetry', icon: Cpu, badge: 'ESP32' },
    { id: 'accident-detection', label: 'Collision Detection', icon: AlertTriangle, highlightForRoles: ['driver', 'admin'] }
  ];

  const intelligenceNavItems: NavItem[] = [
    { id: 'risk-prediction', label: 'Pre-Crash Risk Index', icon: Compass, highlightForRoles: ['driver', 'admin'] },
    { id: 'ml-severity', label: 'ML Severity Prediction', icon: BrainCircuit, badge: 'AI/ML' },
    { id: 'survivor-assessment', label: 'Paramedic Triage Support', icon: HeartPulse, highlightForRoles: ['ambulance', 'hospital'] }
  ];

  const emergencyNavItems: NavItem[] = [
    { id: 'gps-tracking', label: 'Live GPS & Route Map', icon: MapPin },
    { id: 'emergency-alerts', label: 'Emergency Alerts (SOS)', icon: Bell },
    { id: 'rescue-optimization', label: 'Rescue & Hospital Triage', icon: Ambulance, highlightForRoles: ['ambulance', 'hospital'] }
  ];

  const analyticsNavItems: NavItem[] = [
    { id: 'accident-history', label: 'Incident History & Logs', icon: History },
    { id: 'analytics', label: 'Prevention & Analytics', icon: BarChart3 },
    { id: 'mesh-connectivity', label: 'V2V Mesh Network', icon: Share2, badge: 'Future' },
    { id: 'hardware-hub', label: 'Firmware & API Hub', icon: Terminal, badge: 'C++ / API' }
  ];

  const renderNavSection = (title: string, items: NavItem[]) => (
    <div className="mb-6">
      <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isRoleTarget = item.highlightForRoles?.includes(userRole);

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors group ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {isRoleTarget && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" title="Key view for your role" />
                )}
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header inside Sidebar */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight">PLURIPOTENT</div>
              <div className="text-[10px] text-slate-400 font-mono">v2.4 TELEMETRY</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {renderNavSection('Core Operations', coreNavItems)}
          {renderNavSection('ML & Clinical Triage', intelligenceNavItems)}
          {renderNavSection('Emergency & Dispatch', emergencyNavItems)}
          {renderNavSection('Data & Hardware Lab', analyticsNavItems)}
        </div>

        {/* Sidebar Theme Palette Swatches */}
        <div className="px-3 pt-2 pb-1 border-t border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
            <span>THEME COLOR:</span>
            <span className="capitalize text-slate-300 font-bold">{colorTheme}</span>
          </div>
          <div className="flex items-center justify-between gap-1 pb-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setColorTheme(t.id)}
                title={t.title}
                className={`w-5 h-5 rounded-full transition-transform hover:scale-110 border ${
                  colorTheme === t.id
                    ? 'ring-2 ring-white scale-110 border-white'
                    : 'border-black/40 opacity-75 hover:opacity-100'
                }`}
                style={{ backgroundColor: t.colorHex }}
                aria-label={`Switch to ${t.title}`}
              />
            ))}
          </div>
        </div>

        {/* Sidebar Hardware Telemetry Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              ESP32 Node Status
            </span>
            <span className="font-mono text-emerald-400">ONLINE</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800/60">
            <div>
              <span className="text-slate-400">G-FORCE: </span>
              <span className="text-slate-200 tabular-nums">{telemetry.resultantG.toFixed(2)}g</span>
            </div>
            <div>
              <span className="text-slate-400">SPEED: </span>
              <span className="text-slate-200 tabular-nums">{telemetry.speedKmh.toFixed(0)} km/h</span>
            </div>
            <div>
              <span className="text-slate-400">TILT: </span>
              <span className="text-slate-200 tabular-nums">{telemetry.tiltAngle.toFixed(1)}°</span>
            </div>
            <div>
              <span className="text-slate-400">WIFI: </span>
              <span className="text-slate-200 tabular-nums">{telemetry.wifiRssi} dBm</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
