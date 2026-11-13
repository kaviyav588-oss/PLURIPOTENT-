import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  AlertTriangle,
  CloudRain,
  Sun,
  CloudFog,
  Snowflake,
  ShieldCheck,
  TrendingUp,
  Info,
  Car,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const RiskPredictionView: React.FC = () => {
  const { riskFactors, telemetry, setActiveTab } = useApp();

  // Dynamic simulation inputs for pre-collision risk
  const [weatherCondition, setWeatherCondition] = useState<'Clear' | 'Rain' | 'Fog' | 'Ice'>('Rain');
  const [curvatureIndex, setCurvatureIndex] = useState<number>(65); // 0 (straight) to 100 (mountain hairpin)
  const [trafficDensity, setTrafficDensity] = useState<'Low' | 'Medium' | 'Heavy'>('Medium');
  const [speedDelta, setSpeedDelta] = useState<number>(8); // km/h over flow

  // Calculate dynamic Road Safety Risk Score (0 - 100)
  let weatherPenalty = weatherCondition === 'Ice' ? 40 : weatherCondition === 'Rain' ? 25 : weatherCondition === 'Fog' ? 20 : 5;
  let trafficPenalty = trafficDensity === 'Heavy' ? 25 : trafficDensity === 'Medium' ? 15 : 5;
  let curvePenalty = (curvatureIndex / 100) * 30;
  let speedPenalty = Math.max(0, speedDelta * 1.5);

  const totalRiskScore = Math.min(98, Math.round(weatherPenalty + trafficPenalty + curvePenalty + speedPenalty));
  const riskLevel: 'Low' | 'Medium' | 'High' = totalRiskScore > 70 ? 'High' : totalRiskScore > 40 ? 'Medium' : 'Low';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">PREVENTIVE SAFETY INTELLIGENCE</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-400">Pre-Collision Assessment</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-400" />
            <span>Pre-Crash Road Safety Risk Prediction</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time environmental and kinematic risk scoring that predicts hazard probability <strong className="text-slate-200">before</strong> an accident occurs.
          </p>
        </div>

        {/* Big Risk Indicator Badge */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-slate-400">Corridor Risk Level</div>
            <div
              className={`text-base font-bold font-mono ${
                riskLevel === 'High'
                  ? 'text-rose-400'
                  : riskLevel === 'Medium'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {riskLevel.toUpperCase()} ({totalRiskScore}/100)
            </div>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${
              riskLevel === 'High'
                ? 'bg-rose-500 animate-pulse'
                : riskLevel === 'Medium'
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
          />
        </div>
      </div>

      {/* Critical Clarification Callout: Risk Prediction vs Accident Detection */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-cyan-300">Architectural Distinction: Risk Prediction vs Accident Detection</span>
          <p className="text-slate-400 leading-relaxed">
            <strong className="text-slate-200">Risk Prediction (this view)</strong> monitors dynamic road conditions, weather, and driving smoothness proactively to alert drivers to reduce speed and prevent collisions. In contrast, <strong className="text-slate-200">Accident Detection</strong> evaluates post-impact inertial shocks (&gt;3.5g) to initiate automated emergency rescue dispatch.
          </p>
        </div>
      </div>

      {/* Interactive Road Condition Simulation Controls */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Interactive Environmental Risk Simulator</h2>
            <p className="text-xs text-slate-400 mt-0.5">Adjust environmental conditions to simulate how the pre-crash risk engine computes risk probability</p>
          </div>
          <span className="text-xs font-mono text-cyan-400">CALCULATING LIVE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Weather Selector */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              <span>Weather / Road Condition:</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {(['Clear', 'Rain', 'Fog', 'Ice'] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => setWeatherCondition(w)}
                  className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-colors ${
                    weatherCondition === w
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Road Curvature Slider */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Road Curvature Severity:</span>
              <span className="font-mono text-amber-400 font-bold">{curvatureIndex}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={curvatureIndex}
              onChange={(e) => setCurvatureIndex(parseInt(e.target.value))}
              className="w-full accent-amber-400 mt-2"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Straight Highway</span>
              <span>Sharp Mountain Curve</span>
            </div>
          </div>

          {/* Traffic Density Selector */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-blue-400" />
              <span>Traffic Corridor Density:</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {(['Low', 'Medium', 'Heavy'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setTrafficDensity(d)}
                  className={`py-1.5 px-1.5 text-xs font-medium rounded-lg transition-colors ${
                    trafficDensity === d
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Speed Delta Slider */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Speed vs Flow Delta:</span>
              <span className="font-mono text-rose-400 font-bold">+{speedDelta} km/h</span>
            </div>
            <input
              type="range"
              min="-15"
              max="35"
              value={speedDelta}
              onChange={(e) => setSpeedDelta(parseInt(e.target.value))}
              className="w-full accent-rose-400 mt-2"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Below Flow</span>
              <span>Excessive Speed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Score Dial & Specific Preventive Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Score Summary Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">Composite Risk Analysis</h2>
            <span className="text-xs font-mono text-slate-400">Formula V3.1</span>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <div
              className={`w-36 h-36 rounded-full border-8 flex flex-col items-center justify-center relative transition-colors ${
                riskLevel === 'High'
                  ? 'border-rose-500/80 bg-rose-950/20 shadow-lg shadow-rose-900/30'
                  : riskLevel === 'Medium'
                  ? 'border-amber-500/80 bg-amber-950/20 shadow-lg shadow-amber-900/30'
                  : 'border-emerald-500/80 bg-emerald-950/20 shadow-lg shadow-emerald-900/30'
              }`}
            >
              <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                {totalRiskScore}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Index / 100
              </span>
            </div>

            <div className="mt-4 text-center">
              <span
                className={`text-sm font-bold font-mono px-3 py-1 rounded-full ${
                  riskLevel === 'High'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : riskLevel === 'Medium'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {riskLevel.toUpperCase()} RISK ENVIRONMENT
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono pt-2 border-t border-slate-800/80">
            <div className="flex justify-between text-slate-400">
              <span>Weather Penalty:</span>
              <span className="text-slate-200">+{weatherPenalty} pts</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Curvature Geometry:</span>
              <span className="text-slate-200">+{curvePenalty.toFixed(0)} pts</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Traffic Congestion:</span>
              <span className="text-slate-200">+{trafficPenalty} pts</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Speed Differential:</span>
              <span className="text-slate-200">+{speedPenalty.toFixed(0)} pts</span>
            </div>
          </div>
        </div>

        {/* Actionable Preventive Recommendations */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Real-Time Driver Safety Advisories</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">Active Advisory</span>
          </div>

          <div className="space-y-3 pt-1">
            {/* Recommendation 1 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-cyan-300">1. Speed Advisory for {weatherCondition} Conditions</span>
                <span className="text-[10px] font-mono text-amber-400">TARGET: 65 KM/H</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {weatherCondition === 'Ice'
                  ? 'Black ice hazard detected on overpasses. Reduce velocity by at least 30 km/h and avoid sharp steering inputs.'
                  : weatherCondition === 'Rain'
                  ? 'Wet asphalt significantly lengthens stopping distance. Hydroplaning threshold is 70 km/h. Maintain 4-second gap.'
                  : weatherCondition === 'Fog'
                  ? 'Visibility restricted below 150m. Activate low-beam fog lamps and disengage cruise control.'
                  : 'Clear road conditions. Maintain regular highway headway and watch for merging vehicles.'}
              </p>
            </div>

            {/* Recommendation 2 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-cyan-300">2. Geometry Deceleration Profile</span>
                <span className="text-[10px] font-mono text-slate-400">SEGMENT MP 234.2</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {curvatureIndex > 50
                  ? 'Approaching decreasing radius turn within 800 meters. Begin gradual engine braking prior to apex entry.'
                  : 'Gentle road curvature. Nominal centrifugal lateral acceleration expected (< 0.2g).'}
              </p>
            </div>

            {/* Recommendation 3 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-cyan-300">3. Collision Prevention Corridor Readiness</span>
                <span className="text-[10px] font-mono text-emerald-400">EDGE SENSOR ARMED</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                ESP32 IMU sampling frequency at 100Hz with 15-second driver false alarm validation active.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setActiveTab('accident-detection')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5"
            >
              <span>View Collision Detection Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
