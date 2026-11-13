import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BrainCircuit,
  Cpu,
  BarChart2,
  Sliders,
  CheckCircle2,
  Info,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Layers,
  Database
} from 'lucide-react';
import { predictAccidentSeverity, MLFeatureInput } from '../../utils/mlModel';
import { AccidentSeverity } from '../../types';

export const MLSeverityView: React.FC = () => {
  const { incidents, telemetry, setActiveTab } = useApp();

  // Test form state for live model inference
  const [features, setFeatures] = useState<MLFeatureInput>({
    peakGForce: 6.8,
    impactSpeedKmh: 75,
    deltaV: 48,
    rolloverAngle: 75,
    airbagDeployed: true,
    seatbeltEngaged: true,
    vehicleType: 'SUV'
  });

  const [selectedModelArchitecture, setSelectedModelArchitecture] = useState<string>('ensemble_gbdt');

  // Compute live prediction explanation
  const explanation = predictAccidentSeverity(features);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">SUPERVISED MACHINE LEARNING</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-400">Multiclass Trauma Classification</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-cyan-400" />
            <span>ML Collision Severity Prediction & Explainability</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ensemble classification pipeline estimating human injury severity (Minor, Moderate, Critical) from vehicle kinematics and restraint telemetry.
          </p>
        </div>

        {/* Model Architecture Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <label htmlFor="model-select" className="text-slate-400 font-mono px-2">PIPELINE:</label>
          <select
            id="model-select"
            value={selectedModelArchitecture}
            onChange={(e) => setSelectedModelArchitecture(e.target.value)}
            className="bg-slate-950 text-cyan-300 font-mono text-xs rounded px-2.5 py-1.5 border border-slate-800 focus:outline-none"
          >
            <option value="ensemble_gbdt">Gradient Boosted Trees (Calibrated)</option>
            <option value="random_forest">Random Forest 150-Tree Ensemble</option>
            <option value="kinematic_onnx">Kinematic Deep Net (ONNX Ready)</option>
          </select>
        </div>
      </div>

      {/* Main Split: Interactive Feature Inputs & Real-Time ML Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Feature Input Tuning */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Inference Feature Inputs</span>
            </h2>
            <button
              onClick={() => {
                setFeatures({
                  peakGForce: telemetry.resultantG > 1 ? telemetry.resultantG : 5.5,
                  impactSpeedKmh: telemetry.speedKmh > 10 ? telemetry.speedKmh : 65,
                  deltaV: Math.round((telemetry.speedKmh > 10 ? telemetry.speedKmh : 65) * 0.75),
                  rolloverAngle: telemetry.tiltAngle,
                  airbagDeployed: telemetry.resultantG > 4.5,
                  seatbeltEngaged: true,
                  vehicleType: 'SUV'
                });
              }}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
            >
              Copy Live Telemetry
            </button>
          </div>

          <div className="space-y-4 pt-1">
            {/* Peak G-Force */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Peak Deceleration (G-Force):</span>
                <span className="font-mono text-rose-400 font-bold">{features.peakGForce.toFixed(1)} g</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="12.0"
                step="0.1"
                value={features.peakGForce}
                onChange={(e) => setFeatures({ ...features, peakGForce: parseFloat(e.target.value) })}
                className="w-full accent-rose-400"
              />
              <span className="text-[10px] text-slate-500">Critical trauma threshold: &ge; 6.5g</span>
            </div>

            {/* Impact Speed */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Pre-Impact Velocity:</span>
                <span className="font-mono text-cyan-400 font-bold">{features.impactSpeedKmh} km/h</span>
              </div>
              <input
                type="range"
                min="10"
                max="160"
                step="2"
                value={features.impactSpeedKmh}
                onChange={(e) => setFeatures({ ...features, impactSpeedKmh: parseInt(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Delta-V */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Velocity Change (Delta-V):</span>
                <span className="font-mono text-amber-400 font-bold">{features.deltaV} km/h</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="1"
                value={features.deltaV}
                onChange={(e) => setFeatures({ ...features, deltaV: parseInt(e.target.value) })}
                className="w-full accent-amber-400"
              />
            </div>

            {/* Rollover Angle */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Vehicle Inversion / Rollover:</span>
                <span className="font-mono text-purple-400 font-bold">{features.rolloverAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={features.rolloverAngle}
                onChange={(e) => setFeatures({ ...features, rolloverAngle: parseInt(e.target.value) })}
                className="w-full accent-purple-400"
              />
            </div>

            {/* Restraints & Airbag Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700">
                <span className="text-xs text-slate-300">Seatbelt Fastened:</span>
                <input
                  type="checkbox"
                  checked={features.seatbeltEngaged}
                  onChange={(e) => setFeatures({ ...features, seatbeltEngaged: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </label>

              <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700">
                <span className="text-xs text-slate-300">Airbag Deployed:</span>
                <input
                  type="checkbox"
                  checked={features.airbagDeployed}
                  onChange={(e) => setFeatures({ ...features, airbagDeployed: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Model Output, Confidence & SHAP Feature Attributions */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono text-slate-400">PREDICTED SEVERITY TIER</span>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className={`text-2xl font-extrabold font-mono tracking-tight px-3 py-1 rounded-lg ${
                    explanation.severity === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : explanation.severity === 'Moderate'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {explanation.severity.toUpperCase()}
                </span>
                <span className="text-xs text-slate-400">
                  Confidence: <strong className="text-white font-mono">{(explanation.confidenceScore * 100).toFixed(1)}%</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('survivor-assessment')}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Paramedic Triage View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            {explanation.heuristicSummary}
          </div>

          {/* Feature Importance & Contribution Breakdown (SHAP-Style) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono uppercase text-slate-400 tracking-wider">
                Feature Attribution Breakdown (Local SHAP Values)
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Additive Log-Odds Impact</span>
            </div>

            <div className="space-y-2 pt-1">
              {explanation.featureContributions.map((contrib, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{contrib.feature}</span>
                    <span
                      className={`font-mono font-bold ${
                        contrib.impact > 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {contrib.impact > 0 ? `+${contrib.impact}% Risk` : `${contrib.impact}% Risk Mitigation`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {contrib.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>PIPELINE: {explanation.modelArchitecture}</span>
            <span className="text-emerald-400">ACTIVE INFERENCE</span>
          </div>
        </div>
      </div>

      {/* Historical Model Validation Matrix */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span>Historical Model Prediction Audit Log</span>
          </h2>
          <span className="text-xs text-slate-400">Trained on NHTSA NASS-CDS Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">RECORD ID</th>
                <th className="py-2.5 px-3">VEHICLE TYPE</th>
                <th className="py-2.5 px-3">PEAK G</th>
                <th className="py-2.5 px-3">DELTA-V</th>
                <th className="py-2.5 px-3">PREDICTED SEVERITY</th>
                <th className="py-2.5 px-3">CONFIDENCE</th>
                <th className="py-2.5 px-3">CLINICAL TRIAGE OUTCOME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {incidents.slice(0, 4).map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 text-cyan-400">{inc.id}</td>
                  <td className="py-2.5 px-3 text-slate-300">{inc.vehicleType}</td>
                  <td className="py-2.5 px-3 text-slate-200">{inc.peakGForce.toFixed(1)}g</td>
                  <td className="py-2.5 px-3 text-slate-200">{inc.deltaV} km/h</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inc.severity === 'Critical'
                          ? 'text-rose-400 bg-rose-500/10'
                          : inc.severity === 'Moderate'
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-emerald-400 bg-emerald-500/10'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{(inc.predictionConfidence * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans text-[11px]">
                    {inc.triagePriority} · {inc.notes?.substring(0, 40)}...
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
