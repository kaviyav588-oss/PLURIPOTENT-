import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Radio,
  MapPin,
  Ambulance,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Cpu,
  Compass
} from 'lucide-react';
import { AccidentSeverity } from '../../types';

export const DashboardView: React.FC = () => {
  const {
    incidents,
    telemetry,
    detectionState,
    falseAlarmSecondsRemaining,
    triggerSimulationScenario,
    setActiveTab,
    setSelectedIncident,
    userRole
  } = useApp();

  const totalAccidents = incidents.length;
  const criticalCount = incidents.filter((i) => i.severity === 'Critical').length;
  const moderateCount = incidents.filter((i) => i.severity === 'Moderate').length;
  const minorCount = incidents.filter((i) => i.severity === 'Minor').length;
  const activeDispatches = incidents.filter(
    (i) => i.status === 'Dispatched' || i.status === 'On Scene' || i.status === 'Transporting'
  ).length;

  const severityDistribution: Record<AccidentSeverity, number> = {
    Critical: criticalCount,
    Moderate: moderateCount,
    Minor: minorCount
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner / Detection Alert Status */}
      {detectionState === 'ACCIDENT_DETECTED' && (
        <div className="p-4 rounded-xl bg-rose-500/15 border-2 border-rose-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                COLLISION DETECTION TRIGGERED — 15-SEC CANCELLATION RUNNING
              </div>
              <div className="text-xs text-rose-200">
                Peak G-force: {telemetry.resultantG.toFixed(1)}g · Tilt: {telemetry.tiltAngle.toFixed(0)}° · Driver cancellation window: {falseAlarmSecondsRemaining}s left
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('accident-detection')}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shrink-0"
          >
            Open Driver Validation Console
          </button>
        </div>
      )}

      {/* Header & Quick Simulation Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-cyan-400" />
            <span>Central Telemetry & Decision Support Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-vehicle safety surveillance, inertial kinematics, and emergency trauma triage queue.
          </p>
        </div>

        {/* Quick Scenario Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 mr-1">DEMO SIMULATOR:</span>
          <button
            onClick={() => triggerSimulationScenario('nominal')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-medium transition-colors"
            title="Reset to steady highway cruising"
          >
            Nominal
          </button>
          <button
            onClick={() => triggerSimulationScenario('braking')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-medium transition-colors"
            title="Simulate sudden hard brake deceleration"
          >
            Hard Brake
          </button>
          <button
            onClick={() => triggerSimulationScenario('pothole')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-medium transition-colors"
            title="Simulate transient road bump / pothole spike"
          >
            Pothole Bump
          </button>
          <button
            onClick={() => triggerSimulationScenario('rollover')}
            className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/50 text-xs font-medium transition-colors"
            title="Simulate high-G lateral rollover accident"
          >
            Trigger Rollover Crash
          </button>
          <button
            onClick={() => triggerSimulationScenario('high_impact')}
            className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/50 text-xs font-medium transition-colors"
            title="Simulate high-G frontal/T-bone collision"
          >
            Trigger Severe Impact
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Accidents */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Recorded Incidents</span>
            <AlertTriangle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-2 tabular-nums">
            {totalAccidents}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
            <span className="text-cyan-400 font-mono font-medium">{activeDispatches} Active</span>
            <span>·</span>
            <span>{totalAccidents - activeDispatches} Resolved</span>
          </div>
        </div>

        {/* Critical Severity */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-rose-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-300">Critical Severity (P1)</span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400 mt-2 tabular-nums">
            {criticalCount}
          </div>
          <div className="text-[11px] text-rose-300/80 mt-2 font-mono">
            {totalAccidents > 0 ? ((criticalCount / totalAccidents) * 100).toFixed(0) : 0}% of all collisions
          </div>
        </div>

        {/* Moderate Severity */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-300">Moderate Severity (P2)</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 mt-2 tabular-nums">
            {moderateCount}
          </div>
          <div className="text-[11px] text-amber-300/80 mt-2 font-mono">
            {totalAccidents > 0 ? ((moderateCount / totalAccidents) * 100).toFixed(0) : 0}% of all collisions
          </div>
        </div>

        {/* Minor Severity */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-300">Minor Severity (P3)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 mt-2 tabular-nums">
            {minorCount}
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-2 font-mono">
            {totalAccidents > 0 ? ((minorCount / totalAccidents) * 100).toFixed(0) : 0}% of all collisions
          </div>
        </div>
      </div>

      {/* Main Split: Live Vehicle Edge Telemetry & Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Node Live Telemetry Status */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Active Vehicle IoT Node Telemetry
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                ESP32 ONLINE
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-400">100Hz</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Resultant G</div>
              <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
                {telemetry.resultantG.toFixed(2)}g
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Normal: 0.98–1.05g</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Speed (GPS)</div>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                {telemetry.speedKmh.toFixed(0)} <span className="text-xs font-normal text-slate-400">km/h</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Sats: {telemetry.satellites} locked</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Vehicle Tilt</div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                {telemetry.tiltAngle.toFixed(1)}°
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Threshold: &gt;55°</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">GSM / Network</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                {telemetry.gsmSignalPercent}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">RSSI: {telemetry.wifiRssi} dBm</div>
            </div>
          </div>

          {/* Quick Real-Time Vector Status */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="font-semibold text-slate-200">
                Current Kinematic State:
                <span className={`ml-2 font-mono ${
                  detectionState === 'ACCIDENT_DETECTED'
                    ? 'text-rose-400'
                    : detectionState === 'ANALYZING'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {detectionState === 'ACCIDENT_DETECTED'
                    ? 'COLLISION ANOMALY CONFIRMED'
                    : detectionState === 'ANALYZING'
                    ? 'EVALUATING ACCELERATION TRANSIENT'
                    : 'NOMINAL STEADY DRIVING'}
                </span>
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                Lat: {telemetry.latitude.toFixed(6)}, Lon: {telemetry.longitude.toFixed(6)} · Altitude: {telemetry.altitudeM.toFixed(1)}m
              </div>
            </div>
            <button
              onClick={() => setActiveTab('iot-monitoring')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium text-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>Detailed Sensor Graphs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Severity Distribution & Quick Triage Stats */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Severity Breakdown & Risk</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">ML Calibrated</span>
          </div>

          {/* Visual Bar Stack for Severity */}
          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-rose-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Critical Incidents
                </span>
                <span className="font-mono text-slate-300 tabular-nums">
                  {criticalCount} ({totalAccidents > 0 ? ((criticalCount / totalAccidents) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalAccidents > 0 ? (criticalCount / totalAccidents) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Moderate Incidents
                </span>
                <span className="font-mono text-slate-300 tabular-nums">
                  {moderateCount} ({totalAccidents > 0 ? ((moderateCount / totalAccidents) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalAccidents > 0 ? (moderateCount / totalAccidents) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Minor Fender-Benders
                </span>
                <span className="font-mono text-slate-300 tabular-nums">
                  {minorCount} ({totalAccidents > 0 ? ((minorCount / totalAccidents) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalAccidents > 0 ? (minorCount / totalAccidents) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-xs text-slate-400 leading-relaxed">
              PLURIPOTENT's predictive engine evaluates impact energy in Joules, delta-V, and cabin intrusion to guide EMS triage prioritization.
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('ml-severity')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>View ML Explainability & Weights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Incidents Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Recent Incident Triage Registry
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live automated collision captures with verified response status
            </p>
          </div>
          <button
            onClick={() => setActiveTab('accident-history')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
          >
            <span>View All Records & Export</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">INCIDENT ID</th>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">VEHICLE & LOCATION</th>
                <th className="py-3 px-4">IMPACT G</th>
                <th className="py-3 px-4">SEVERITY</th>
                <th className="py-3 px-4">EMS STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {incidents.slice(0, 5).map((inc) => (
                <tr
                  key={inc.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => {
                    setSelectedIncident(inc);
                    setActiveTab('survivor-assessment');
                  }}
                >
                  <td className="py-3 px-4 font-mono font-medium text-cyan-400 whitespace-nowrap">
                    {inc.id}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono whitespace-nowrap">
                    {inc.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-200">{inc.vehicleId}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">{inc.locationName}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200 tabular-nums">
                    {inc.peakGForce.toFixed(1)}g
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium font-mono ${
                        inc.severity === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : inc.severity === 'Moderate'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-slate-300 font-medium">{inc.status}</span>
                    {inc.assignedAmbulance && (
                      <span className="text-[11px] text-slate-400 block font-mono">
                        {inc.assignedAmbulance}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIncident(inc);
                        setActiveTab('survivor-assessment');
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-medium text-[11px] transition-colors"
                    >
                      Triage / Vitals
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
