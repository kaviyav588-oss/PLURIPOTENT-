import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Ambulance,
  Hospital,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Activity,
  AlertTriangle,
  HeartPulse,
  Navigation
} from 'lucide-react';
import { IncidentRecord } from '../../types';

export const RescueOptimizationView: React.FC = () => {
  const { hospitals, incidents, selectedIncident, setSelectedIncident, updateIncidentStatus } = useApp();

  const activeInc = selectedIncident || incidents[0];

  const [activeStep, setActiveStep] = useState<IncidentRecord['status']>(activeInc?.status || 'Dispatched');

  const handleUpdateStatus = (newStatus: IncidentRecord['status']) => {
    if (!activeInc) return;
    setActiveStep(newStatus);
    updateIncidentStatus(activeInc.id, newStatus);
  };

  const steps: { key: IncidentRecord['status']; label: string; desc: string }[] = [
    { key: 'Detected', label: '01. Crash Detected', desc: 'Kinematic shock verified; countdown elapsed' },
    { key: 'Dispatched', label: '02. Unit Dispatched', desc: 'Nearest paramedic ambulance mobilized' },
    { key: 'On Scene', label: '03. Arrived On Scene', desc: 'C-spine control, extrication & vital triage' },
    { key: 'Transporting', label: '04. En Route to Trauma', desc: 'Code 3 transit with siren and pre-arrival vitals' },
    { key: 'Resolved', label: '05. Hospital Handover', desc: 'Patient admitted to Trauma Resuscitation Bay' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">EMERGENCY LOGISTICS & DISPATCH</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-400">Golden Hour Trauma Routing</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Ambulance className="w-6 h-6 text-cyan-400" />
            <span>Rescue Optimization & Trauma Hospital Routing</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic emergency facility capacity matching, shortest transit ETA calculation, and responder workflow execution.
          </p>
        </div>

        {/* Selected Incident Dropdown */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <label htmlFor="rescue-inc-select" className="text-slate-400 font-mono px-2">INCIDENT:</label>
          <select
            id="rescue-inc-select"
            value={activeInc?.id}
            onChange={(e) => {
              const inc = incidents.find((i) => i.id === e.target.value);
              if (inc) {
                setSelectedIncident(inc);
                setActiveStep(inc.status);
              }
            }}
            className="bg-slate-950 text-cyan-300 font-mono text-xs rounded px-2.5 py-1.5 border border-slate-800 focus:outline-none"
          >
            {incidents.map((i) => (
              <option key={i.id} value={i.id}>
                {i.id} ({i.severity} · {i.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Responder Lifecycle Progress Workflow */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Emergency Responder Lifecycle Stage: {activeInc?.assignedAmbulance || 'Medic Unit Echo-4'}</span>
          </h2>
          <span className="text-xs font-mono text-emerald-400">LIVE CAD INTEGRATION</span>
        </div>

        {/* 5-Step Visual Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {steps.map((st, idx) => {
            const isCurrent = activeInc?.status === st.key;
            return (
              <button
                key={st.key}
                onClick={() => handleUpdateStatus(st.key)}
                className={`p-3.5 rounded-xl border text-left transition-all group ${
                  isCurrent
                    ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-lg shadow-cyan-950/50'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-cyan-400' : 'text-slate-500'}`}>
                    STEP 0{idx + 1}
                  </span>
                  {isCurrent && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                </div>
                <div className="text-xs font-bold truncate group-hover:text-cyan-300 transition-colors">
                  {st.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {st.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nearest Trauma Facilities Matching Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Hospital className="w-5 h-5 text-cyan-400" />
            <span>Nearest Emergency Facilities Ranked by Trauma Capability & ETA</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">Automated Radius Search (15 km)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hospitals.map((hosp, idx) => {
            const isOptimal = idx === 0;
            return (
              <div
                key={hosp.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isOptimal
                    ? 'bg-slate-900/90 border-cyan-500/60 shadow-xl shadow-cyan-950/30'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{hosp.name}</h3>
                      {isOptimal && (
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/40">
                          RECOMMENDED (ETA 7m)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{hosp.traumaLevel}</div>
                  </div>

                  <div className="text-right font-mono shrink-0">
                    <div className="text-sm font-bold text-cyan-400 tabular-nums">{hosp.distanceKm} km</div>
                    <div className="text-[11px] text-slate-400">ETA: {hosp.etaMinutes} mins</div>
                  </div>
                </div>

                {/* Capacity Badges */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Trauma Resuscitation Bays:</span>
                    <span className="text-emerald-400 font-bold tabular-nums">
                      {hosp.availableBays} of {hosp.totalBays} Available
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">ICU Beds Available:</span>
                    <span className="text-cyan-400 font-bold tabular-nums">{hosp.icuBedsAvailable} Beds Free</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  {hosp.specialties.map((spec, sidx) => (
                    <span key={sidx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Action button */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">{hosp.phone}</span>
                  <button
                    onClick={() => {
                      if (activeInc) {
                        updateIncidentStatus(activeInc.id, activeInc.status, `Rerouted to ${hosp.name}`);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-medium text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Assign as Primary Destination</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
