import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Clock,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertOctagon,
  Info,
  PhoneCall,
  Activity,
  ArrowRight
} from 'lucide-react';

export const AccidentDetectionView: React.FC = () => {
  const {
    detectionState,
    telemetry,
    falseAlarmSecondsRemaining,
    cancelFalseAlarm,
    confirmEmergencyDispatchNow,
    triggerSimulationScenario,
    thresholds,
    calibrateDetectionThresholds,
    setActiveTab
  } = useApp();

  const [inputPeakG, setInputPeakG] = useState(thresholds.peakGCutoff);
  const [inputTilt, setInputTilt] = useState(thresholds.tiltAngleCutoff);
  const [inputTimeout, setInputTimeout] = useState(thresholds.timeoutSeconds);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    calibrateDetectionThresholds(inputPeakG, inputTilt, inputTimeout);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">EDGE INFERENCE ENGINE</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-400">Automated Collision Decision Logic</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
            <span>Accident Detection & False-Alarm Validation Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-stage kinematic analysis differentiating benign road hazards (potholes, hard braking) from true severe collisions.
          </p>
        </div>

        {/* Current State Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">FSM State:</span>
          <span
            className={`font-mono text-xs font-bold ${
              detectionState === 'ACCIDENT_DETECTED'
                ? 'text-rose-400 animate-pulse'
                : detectionState === 'ANALYZING'
                ? 'text-amber-400'
                : detectionState === 'FALSE_ALARM_DISCARDED'
                ? 'text-blue-400'
                : 'text-emerald-400'
            }`}
          >
            {detectionState}
          </span>
        </div>
      </div>

      {/* Active Incident Alert Banner (if in ACCIDENT_DETECTED state) */}
      {detectionState === 'ACCIDENT_DETECTED' && (
        <div className="p-6 rounded-2xl bg-rose-950/40 border-2 border-rose-500/80 shadow-2xl shadow-rose-950/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-7 h-7 animate-bounce" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  IMPACT DETECTED: {telemetry.resultantG.toFixed(1)}g PEAK SHOCK
                </h2>
                <p className="text-xs text-rose-300">
                  Countdown to automated emergency dispatch: <span className="font-mono font-bold text-white text-sm">{falseAlarmSecondsRemaining} SECONDS</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={cancelFalseAlarm}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/40"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>CANCEL (I AM SAFE)</span>
              </button>

              <button
                onClick={confirmEmergencyDispatchNow}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Confirm Dispatch Now</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Peak G-Force:</span>
              <span className="text-rose-400 font-bold">{telemetry.resultantG.toFixed(2)}g</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Vehicle Inversion:</span>
              <span className="text-amber-400 font-bold">{telemetry.tiltAngle.toFixed(1)}°</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Impact Speed:</span>
              <span className="text-cyan-400 font-bold">{telemetry.speedKmh.toFixed(0)} km/h</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">GPS Coordinates:</span>
              <span className="text-slate-300 font-bold">{telemetry.latitude.toFixed(4)}, {telemetry.longitude.toFixed(4)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Finite State Machine (FSM) Diagram */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Detection Finite State Machine (FSM)</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">Continuous 10ms Evaluation Loop</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {/* State 1: Normal */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              detectionState === 'NORMAL'
                ? 'bg-emerald-950/20 border-emerald-500/50 shadow-md shadow-emerald-950/50'
                : 'bg-slate-950/60 border-slate-800/80 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-400">STATE 01</span>
              {detectionState === 'NORMAL' && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
            </div>
            <h3 className="text-sm font-semibold text-white">Normal Driving</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Resultant G &lt; {thresholds.peakGCutoff.toFixed(1)}g. Pitch/Roll &lt; {thresholds.tiltAngleCutoff}°. Continuous baseline calibration.
            </p>
          </div>

          {/* State 2: Analyzing */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              detectionState === 'ANALYZING'
                ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-950/50'
                : 'bg-slate-950/60 border-slate-800/80 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-amber-400">STATE 02</span>
              {detectionState === 'ANALYZING' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
            </div>
            <h3 className="text-sm font-semibold text-white">Anomaly Analysis</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Transient shock registered. Evaluates impulse duration &gt; 50ms and post-shock velocity collapse.
            </p>
          </div>

          {/* State 3: Crash Confirmed */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              detectionState === 'ACCIDENT_DETECTED'
                ? 'bg-rose-950/30 border-rose-500/80 shadow-md shadow-rose-950/60'
                : 'bg-slate-950/60 border-slate-800/80 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-rose-400">STATE 03</span>
              {detectionState === 'ACCIDENT_DETECTED' && <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />}
            </div>
            <h3 className="text-sm font-semibold text-white">Crash Detected</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Kinematics confirmed severe crash. 15s driver abort timer initiated. Siren & buzzer active.
            </p>
          </div>

          {/* State 4: Discarded */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              detectionState === 'FALSE_ALARM_DISCARDED'
                ? 'bg-blue-950/20 border-blue-500/50 shadow-md shadow-blue-950/50'
                : 'bg-slate-950/60 border-slate-800/80 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-blue-400">STATE 04</span>
              {detectionState === 'FALSE_ALARM_DISCARDED' && <span className="w-2 h-2 rounded-full bg-blue-400" />}
            </div>
            <h3 className="text-sm font-semibold text-white">False Alarm Discarded</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Driver pressed cancel button OR kinematic filters flagged pothole/phone drop. 911 dispatch aborted.
            </p>
          </div>
        </div>
      </div>

      {/* Two Columns: Trigger Simulator + Calibration Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trigger Simulator */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <span>Simulated Collision Event Generator</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Trigger specific physics profiles to verify how the algorithm responds to non-crash events versus genuine high-severity incidents.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Emergency Stop / Harsh Braking</div>
                <div className="text-[11px] text-slate-400">Ax = -1.85g, Pitch = 14.5°. Speed: 90 to 18 km/h</div>
              </div>
              <button
                onClick={() => triggerSimulationScenario('braking')}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-medium text-xs transition-colors"
              >
                Simulate Braking
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Deep Pothole / Speed Bump Impulse</div>
                <div className="text-[11px] text-slate-400">Az = 2.55g spike for &lt;80ms. Auto-filtered as false alarm</div>
              </div>
              <button
                onClick={() => triggerSimulationScenario('pothole')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
              >
                Simulate Pothole
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-rose-300">Severe Rollover Collision</div>
                <div className="text-[11px] text-slate-400">Ay = 5.6g, Roll Angle = 112°. Speed drops to 0 km/h</div>
              </div>
              <button
                onClick={() => triggerSimulationScenario('rollover')}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
              >
                Trigger Rollover
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-rose-300">High-G Frontal / T-Bone Impact</div>
                <div className="text-[11px] text-slate-400">Peak G = 8.8g, Delta-V = 65 km/h, Airbag fired</div>
              </div>
              <button
                onClick={() => triggerSimulationScenario('high_impact')}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
              >
                Trigger Impact
              </button>
            </div>
          </div>
        </div>

        {/* Configurable False-Alarm Validation Form */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>Configurable Threshold Parameters</span>
            </h2>
            {savedMessage && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Updated!
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Calibrate vehicle-specific inertial trigger thresholds (e.g. higher tolerances for off-road utility vehicles).
          </p>

          <form onSubmit={handleSaveThresholds} className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <label htmlFor="peak-g-input">Peak Deceleration Cutoff (G-Force):</label>
                <span className="font-mono text-cyan-400 font-bold">{inputPeakG.toFixed(1)} g</span>
              </div>
              <input
                id="peak-g-input"
                type="range"
                min="2.5"
                max="7.0"
                step="0.1"
                value={inputPeakG}
                onChange={(e) => setInputPeakG(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <span className="text-[10px] text-slate-500">Recommended: 3.8g - 4.5g to avoid false alarms from heavy potholes</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <label htmlFor="tilt-angle-input">Rollover Tilt Angle Cutoff:</label>
                <span className="font-mono text-amber-400 font-bold">{inputTilt}°</span>
              </div>
              <input
                id="tilt-angle-input"
                type="range"
                min="35"
                max="80"
                step="1"
                value={inputTilt}
                onChange={(e) => setInputTilt(parseInt(e.target.value))}
                className="w-full accent-amber-400"
              />
              <span className="text-[10px] text-slate-500">Normal highway banking rarely exceeds 18°</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <label htmlFor="timeout-input">Driver Abort Countdown Window:</label>
                <span className="font-mono text-emerald-400 font-bold">{inputTimeout} Seconds</span>
              </div>
              <input
                id="timeout-input"
                type="range"
                min="10"
                max="30"
                step="1"
                value={inputTimeout}
                onChange={(e) => setInputTimeout(parseInt(e.target.value))}
                className="w-full accent-emerald-400"
              />
              <span className="text-[10px] text-slate-500">Time allotted for conscious driver to cancel false alarms</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide transition-colors mt-2"
            >
              Save Calibrated Thresholds
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
