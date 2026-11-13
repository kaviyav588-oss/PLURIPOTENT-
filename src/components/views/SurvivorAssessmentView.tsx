import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartPulse,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Info,
  UserCheck,
  Stethoscope,
  Activity,
  Save,
  PhoneCall,
  Ambulance,
  Hospital
} from 'lucide-react';
import { IncidentRecord } from '../../types';

export const SurvivorAssessmentView: React.FC = () => {
  const { incidents, selectedIncident, setSelectedIncident, updateIncidentTriage, setActiveTab } = useApp();

  const activeInc = selectedIncident || incidents[0];

  // Paramedic interactive form state
  const [gcsEye, setGcsEye] = useState<number>(4);
  const [gcsVerbal, setGcsVerbal] = useState<number>(5);
  const [gcsMotor, setGcsMotor] = useState<number>(activeInc?.gcsScore ? Math.min(6, Math.max(1, activeInc.gcsScore - 9)) : 6);
  const [paramedicNotes, setParamedicNotes] = useState<string>(activeInc?.notes || '');
  const [extricationRequired, setExtricationRequired] = useState<boolean>(activeInc?.severity === 'Critical');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const totalGCS = gcsEye + gcsVerbal + gcsMotor;

  // Kinetic energy calculation: E = 0.5 * m * v^2
  // Assuming vehicle mass ~1800 kg for SUV / 1400 kg for Sedan
  const vehicleMassKg = activeInc?.vehicleType === 'Commercial Truck' ? 3800 : activeInc?.vehicleType === 'SUV' ? 2100 : 1500;
  const speedMs = ((activeInc?.speedAtImpact || 60) * 1000) / 3600;
  const kineticEnergyKj = Math.round((0.5 * vehicleMassKg * speedMs * speedMs) / 1000);

  const handleSaveTriage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInc) return;
    updateIncidentTriage(activeInc.id, totalGCS, paramedicNotes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">CLINICAL DECISION SUPPORT</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-400">Paramedic & Emergency Department Intake</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-rose-400" />
            <span>Survivor Assessment & Human Paramedic Triage</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pre-arrival kinetic dissipation profiling and Glasgow Coma Scale (GCS) assessment portal for emergency personnel.
          </p>
        </div>

        {/* Selected Incident Dropdown */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <label htmlFor="incident-select" className="text-slate-400 font-mono px-2">INCIDENT:</label>
          <select
            id="incident-select"
            value={activeInc?.id}
            onChange={(e) => {
              const inc = incidents.find((i) => i.id === e.target.value);
              if (inc) {
                setSelectedIncident(inc);
                setParamedicNotes(inc.notes || '');
              }
            }}
            className="bg-slate-950 text-cyan-300 font-mono text-xs rounded px-2.5 py-1.5 border border-slate-800 focus:outline-none"
          >
            {incidents.map((i) => (
              <option key={i.id} value={i.id}>
                {i.id} - {i.severity} ({i.vehicleId})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mandatory Medical Compliance Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 flex items-start gap-3 text-xs text-amber-200">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300 uppercase tracking-wide">
            Mandatory Clinical Assessment Protocol Notice
          </span>
          <p className="text-slate-300 leading-relaxed">
            This system functions strictly as a decision support aid for licensed emergency responders and hospital personnel. It does not provide medical diagnoses or determine biological survival automatically. Every patient requires in-person medical evaluation and stabilization by human paramedics upon arrival.
          </p>
        </div>
      </div>

      {/* Incident Kinetic Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400">Severity Tier</div>
          <div
            className={`text-xl font-bold font-mono mt-1 ${
              activeInc?.severity === 'Critical'
                ? 'text-rose-400'
                : activeInc?.severity === 'Moderate'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {activeInc?.severity} ({activeInc?.triagePriority})
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Confidence: {(activeInc?.predictionConfidence * 100).toFixed(0)}%</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400">Kinetic Energy Dissipation</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
            {kineticEnergyKj} <span className="text-xs font-normal text-slate-400">kJ</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Ek = ½ · {vehicleMassKg}kg · v²</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400">Peak Deceleration</div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1 tabular-nums">
            {activeInc?.peakGForce.toFixed(1)} <span className="text-xs font-normal text-slate-400">g</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Delta-V: {activeInc?.deltaV} km/h</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400">Restraint State</div>
          <div className="text-sm font-bold text-white mt-1">
            {activeInc?.seatbeltEngaged ? 'Seatbelt Fastened' : 'No Seatbelt'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Airbag: {activeInc?.airbagDeployed ? 'Fired (Deployed)' : 'Not Deployed'}
          </div>
        </div>
      </div>

      {/* Main Split: Glasgow Coma Scale (GCS) Assessment Form & Trauma Center Handover */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Human Paramedic Glasgow Coma Scale (GCS) Intake Form */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-cyan-400" />
              <span>Paramedic On-Scene Neurological Triage (GCS)</span>
            </h2>
            {savedSuccess && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Vitals Updated
              </span>
            )}
          </div>

          <form onSubmit={handleSaveTriage} className="space-y-4 pt-1">
            {/* Eye Opening Score (1-4) */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>1. Eye Opening Response (1-4):</span>
                <span className="font-mono text-cyan-400">{gcsEye} pts</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[
                  { val: 4, label: 'Spontaneous (4)' },
                  { val: 3, label: 'To Sound (3)' },
                  { val: 2, label: 'To Pressure (2)' },
                  { val: 1, label: 'None (1)' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.val}
                    onClick={() => setGcsEye(item.val)}
                    className={`py-1.5 px-1 text-[11px] font-medium rounded-lg transition-colors ${
                      gcsEye === item.val
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Verbal Response Score (1-5) */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>2. Verbal Response (1-5):</span>
                <span className="font-mono text-amber-400">{gcsVerbal} pts</span>
              </div>
              <div className="grid grid-cols-5 gap-1 pt-1">
                {[
                  { val: 5, label: 'Oriented (5)' },
                  { val: 4, label: 'Confused (4)' },
                  { val: 3, label: 'Words (3)' },
                  { val: 2, label: 'Sounds (2)' },
                  { val: 1, label: 'None (1)' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.val}
                    onClick={() => setGcsVerbal(item.val)}
                    className={`py-1.5 px-1 text-[10px] font-medium rounded-lg transition-colors ${
                      gcsVerbal === item.val
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Motor Response Score (1-6) */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>3. Motor Response (1-6):</span>
                <span className="font-mono text-emerald-400">{gcsMotor} pts</span>
              </div>
              <div className="grid grid-cols-6 gap-1 pt-1">
                {[
                  { val: 6, label: 'Obeys (6)' },
                  { val: 5, label: 'Local (5)' },
                  { val: 4, label: 'Normal (4)' },
                  { val: 3, label: 'Abnorm (3)' },
                  { val: 2, label: 'Extend (2)' },
                  { val: 1, label: 'None (1)' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.val}
                    onClick={() => setGcsMotor(item.val)}
                    className={`py-1.5 px-1 text-[10px] font-medium rounded-lg transition-colors ${
                      gcsMotor === item.val
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Total GCS Score Bar */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Total Glasgow Coma Scale:</span>
              <span
                className={`font-bold text-sm ${
                  totalGCS <= 8
                    ? 'text-rose-400'
                    : totalGCS <= 12
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                GCS {totalGCS}/15 (
                {totalGCS <= 8
                  ? 'Severe Impairment / Intubation Indicated'
                  : totalGCS <= 12
                  ? 'Moderate Impairment'
                  : 'Mild / Alert Consciousness'}
                )
              </span>
            </div>

            {/* Paramedic Observations / Field Notes */}
            <div className="space-y-1.5">
              <label htmlFor="notes-field" className="text-xs font-medium text-slate-300">
                Paramedic On-Scene Observations & Physical Findings:
              </label>
              <textarea
                id="notes-field"
                rows={3}
                value={paramedicNotes}
                onChange={(e) => setParamedicNotes(e.target.value)}
                placeholder="Note airway patency, cervical spine stabilization, external hemorrhage, entrapment details..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={extricationRequired}
                  onChange={(e) => setExtricationRequired(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
                <span>Vehicle Extrication Tools (Jaws of Life) Required</span>
              </label>

              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Save Clinical Triage</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Emergency Department Handover & Routing Destination */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Hospital className="w-5 h-5 text-cyan-400" />
              <span>Receiving Trauma Facility Status</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400">BEDS RESERVED</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-mono text-cyan-400">ASSIGNED RECOVERY DESTINATION</div>
            <div className="text-sm font-bold text-white">{activeInc?.assignedHospital || 'Central University Trauma Center'}</div>
            <div className="text-xs text-slate-400">
              Assigned EMS Unit: <strong className="text-slate-200 font-mono">{activeInc?.assignedAmbulance || 'Medic Unit Echo-4'}</strong>
            </div>
            <div className="text-xs text-slate-400">
              Estimated Transit ETA: <strong className="text-emerald-400 font-mono">{activeInc?.etaMinutes || 4} Minutes</strong>
            </div>
          </div>

          {/* Emergency Bay Readiness Checklist */}
          <div className="space-y-2.5 pt-1 text-xs">
            <div className="font-semibold text-slate-300">Hospital Pre-Arrival Readiness Checklist:</div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Level 1 Resuscitation Trauma Bay 02 Prepped</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Emergency Blood Transfusion (O-Negative) on Standby</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>On-Duty Neurotrauma & Orthopedic Surgeon Alerted</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full-Body CT / Radiography Suite Cleared</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <button
              onClick={() => setActiveTab('rescue-optimization')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Ambulance className="w-4 h-4" />
              <span>Manage Ambulance Dispatch Queue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
