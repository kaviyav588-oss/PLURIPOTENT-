import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, ColorTheme } from '../../types';
import { Volume2, VolumeX, ShieldAlert, Cpu, Palette, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    userRole,
    setUserRole,
    colorTheme,
    setColorTheme,
    detectionState,
    audioEnabled,
    setAudioEnabled,
    falseAlarmSecondsRemaining
  } = useApp();

  const [paletteMenuOpen, setPaletteMenuOpen] = useState(false);

  const themeOptions: { id: ColorTheme; label: string; colorHex: string; isLight?: boolean }[] = [
    { id: 'emerald', label: 'Cyber Emerald / Bio-Safe', colorHex: '#10b981' },
    { id: 'amber', label: 'Tactical Amber / Safety Gold', colorHex: '#f59e0b' },
    { id: 'blue', label: 'Electric Cobalt / Sapphire', colorHex: '#3b82f6' },
    { id: 'violet', label: 'Hyper Violet / Nightfall', colorHex: '#8b5cf6' },
    { id: 'crimson', label: 'Rapid Trauma / Crimson Red', colorHex: '#f43f5e' },
    { id: 'cyan', label: 'Deep Space Cyan', colorHex: '#06b6d4' },
    { id: 'light', label: 'Daylight Titanium (Light Mode)', colorHex: '#e2e8f0', isLight: true }
  ];

  const currentTheme = themeOptions.find((t) => t.id === colorTheme) || themeOptions[0];

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-6 px-6 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Zone 1: Wordmark Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 text-left group focus:outline-none"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-colors"
            style={{ backgroundColor: currentTheme.isLight ? '#0284c7' : currentTheme.colorHex }}
          >
            <Cpu className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              PLURIPOTENT
            </span>
            <span className="hidden sm:inline text-xs text-slate-400 ml-2">
              IoT & ML Road Safety
            </span>
          </div>
        </button>

        {/* Real-time Status Badge */}
        {detectionState === 'ACCIDENT_DETECTED' ? (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>CRASH DETECTED ({falseAlarmSecondsRemaining}s)</span>
          </div>
        ) : detectionState === 'ANALYZING' ? (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>VERIFYING KINEMATICS</span>
          </div>
        ) : null}
      </div>

      {/* Zone 2: Concise Quick Navigation Links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('home')}
          className={`hover:text-white transition-colors whitespace-nowrap ${
            activeTab === 'home' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`hover:text-white transition-colors whitespace-nowrap ${
            activeTab === 'dashboard' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Live Dashboard
        </button>
        <button
          onClick={() => setActiveTab('iot-monitoring')}
          className={`hover:text-white transition-colors whitespace-nowrap ${
            activeTab === 'iot-monitoring' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          IoT Sensors
        </button>
        <button
          onClick={() => setActiveTab('ml-severity')}
          className={`hover:text-white transition-colors whitespace-nowrap ${
            activeTab === 'ml-severity' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          ML Severity
        </button>
        <button
          onClick={() => setActiveTab('rescue-optimization')}
          className={`hover:text-white transition-colors whitespace-nowrap ${
            activeTab === 'rescue-optimization' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Rescue Dispatch
        </button>
      </nav>

      {/* Zone 3: Interactive Theme Color Picker, Role Switcher & Audio Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Color Palette Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setPaletteMenuOpen(!paletteMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-slate-600 transition-colors text-xs font-medium text-slate-300"
            title="Change Theme & Accent Color"
          >
            <span
              className="w-3 h-3 rounded-full shrink-0 border border-black/40"
              style={{ backgroundColor: currentTheme.colorHex }}
            />
            <span className="hidden md:inline font-mono text-[11px] capitalize">
              {colorTheme}
            </span>
            <Palette className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* Palette Dropdown Popover */}
          {paletteMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setPaletteMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 z-50 w-56 p-2 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Select Theme Palette
                </div>
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setColorTheme(opt.id);
                      setPaletteMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-colors text-left ${
                      colorTheme === opt.id
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/30"
                        style={{ backgroundColor: opt.colorHex }}
                      />
                      <span className="text-[11px] truncate">{opt.label}</span>
                    </div>
                    {colorTheme === opt.id && (
                      <span className="text-[10px] text-cyan-400 font-mono">Active</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Audio Mute/Unmute */}
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          title={audioEnabled ? 'Mute Alert Audio' : 'Enable Alert Audio'}
          className={`p-2 rounded-lg border transition-colors ${
            audioEnabled
              ? 'bg-slate-900 border-slate-700 text-cyan-400 hover:bg-slate-800'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          aria-label={audioEnabled ? 'Mute Sound' : 'Enable Sound'}
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* User Role Selector Dropdown */}
        <div className="relative">
          <label htmlFor="role-select" className="sr-only">Select User Role</label>
          <select
            id="role-select"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="bg-slate-900 text-xs font-medium text-slate-200 border border-slate-700/80 rounded-lg px-2.5 sm:px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer hover:border-slate-600 transition-colors"
          >
            <option value="driver">Role: Driver</option>
            <option value="ambulance">Role: Paramedic / EMS</option>
            <option value="hospital">Role: Trauma Staff</option>
            <option value="admin">Role: Admin</option>
          </select>
        </div>
      </div>
    </header>
  );
};
