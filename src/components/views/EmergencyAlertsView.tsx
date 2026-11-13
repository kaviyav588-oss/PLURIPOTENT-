import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  PhoneCall,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Users,
  Send,
  Radio,
  Info,
  Clock
} from 'lucide-react';
import { playEmergencyAlertSound, speakDispatchBroadcast } from '../../utils/audioAlert';

export const EmergencyAlertsView: React.FC = () => {
  const { emergencyContacts, selectedIncident, telemetry, audioEnabled } = useApp();

  const [testDispatched, setTestDispatched] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const activeInc = selectedIncident;
  const dispatchMessage = `Emergency alert broadcast: Severe vehicular collision registered at coordinates ${telemetry.latitude.toFixed(4)} North, ${telemetry.longitude.toFixed(4)} West. Impact magnitude: ${telemetry.resultantG.toFixed(1)} G-force. Severity level: ${activeInc?.severity || 'Critical'}. Medic Unit Alpha-1 dispatched.`;

  const handleTriggerSimulatedBroadcast = () => {
    setIsPlayingAudio(true);
    if (audioEnabled) {
      playEmergencyAlertSound();
    }
    speakDispatchBroadcast(dispatchMessage);
    setTestDispatched(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 8000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">MULTI-CHANNEL DISPATCH HUB</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-400">SIM800L GSM / VoLTE / REST Gateways</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Bell className="w-6 h-6 text-cyan-400" />
            <span>Emergency Alert Dispatch & Notification Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulated high-priority telemetry broadcast transmission to law enforcement, trauma hospitals, and next-of-kin contacts.
          </p>
        </div>

        {/* Action Button: Test Voice Broadcast */}
        <button
          onClick={handleTriggerSimulatedBroadcast}
          disabled={isPlayingAudio}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-colors flex items-center gap-2 shadow-lg ${
            isPlayingAudio
              ? 'bg-amber-500 text-slate-950 animate-pulse'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>{isPlayingAudio ? 'Broadcasting Audio Dispatch...' : 'Play Synthesized Voice Dispatch'}</span>
        </button>
      </div>

      {/* Mandatory Safety / Non-Live Demonstration Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border-2 border-cyan-500/40 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white uppercase tracking-wider block">
            DEMONSTRATION SIMULATION ENVIRONMENT
          </span>
          <p className="text-slate-400 mt-1 leading-relaxed">
            All emergency phone call synthesis, SMS transmissions, and 911 dispatch packets are executed within a local sandbox preview. No actual emergency calls or text messages are transmitted to public safety answering points.
          </p>
        </div>
      </div>

      {/* 4 Multi-Agency Channel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Channel 1: Police 112/911 */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400">CHANNEL 01</span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> READY
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">Police & Highway Patrol (112 / 911)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Automated CAD (Computer-Aided Dispatch) XML packet generated with GPS coordinates and roadway blockage risk.
          </p>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-cyan-400">
            Status: {testDispatched ? 'Transmitted (200 OK)' : 'Listening for Trigger'}
          </div>
        </div>

        {/* Channel 2: Trauma Center EMS */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400">CHANNEL 02</span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> READY
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">Trauma Emergency Medical Services</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Transmits kinetic dissipation profile, Delta-V, rollover status, and suspected trauma category to nearest trauma unit.
          </p>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-cyan-400">
            Unit: Medic Unit Echo-4 (Dispatched)
          </div>
        </div>

        {/* Channel 3: Designated Family Contacts */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400">CHANNEL 03</span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> 3 CONTACTS
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">Family / Next-of-Kin Contacts</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Direct SMS text containing vehicle plate, incident status, Google Maps location pin, and hospital routing destination.
          </p>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-cyan-400">
            Gateway: SIM800L GSM Queue
          </div>
        </div>

        {/* Channel 4: Automotive Insurance & Fleet Telematics */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400">CHANNEL 04</span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> SECURE
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">Automotive Insurer & Roadside Hub</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tamper-proof black-box telemetry hash recorded for expedited insurance claims and flatbed towing dispatch.
          </p>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-cyan-400">
            Protocol: Encrypted JSON Webhook
          </div>
        </div>
      </div>

      {/* Synthesized Voice Broadcast Dispatcher Preview */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            <span>Automated Text-to-Speech (TTS) Radio Dispatch Script</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">Web Speech API Voice Generator</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 leading-relaxed space-y-2">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">
            SYNTHESIZED DISPATCH VOICE PAYLOAD:
          </div>
          <p className="italic">
            "{dispatchMessage}"
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleTriggerSimulatedBroadcast}
            disabled={isPlayingAudio}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            <span>Play Synthesized Audio Callout</span>
          </button>
          <span className="text-xs text-slate-400">
            Uses your browser's native speech synthesis to simulate emergency channel voice alerts.
          </span>
        </div>
      </div>

      {/* Emergency Contacts Management Registry */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Registered Next-of-Kin & Emergency Contacts</span>
          </h2>
          <span className="text-xs text-slate-400">Priority Notification Chain</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">CONTACT NAME</th>
                <th className="py-2.5 px-3">RELATIONSHIP</th>
                <th className="py-2.5 px-3">PHONE NUMBER</th>
                <th className="py-2.5 px-3">EMAIL</th>
                <th className="py-2.5 px-3">CHANNELS</th>
                <th className="py-2.5 px-3 text-right">DISPATCH STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {emergencyContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{contact.name}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans">{contact.relationship}</td>
                  <td className="py-2.5 px-3 text-cyan-400">{contact.phone}</td>
                  <td className="py-2.5 px-3 text-slate-400">{contact.email}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                      SMS {contact.notifyCall ? '+ Voice' : ''}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Queued / Active
                    </span>
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
