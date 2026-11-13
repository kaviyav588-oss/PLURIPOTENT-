import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Share2,
  Radio,
  WifiOff,
  Wifi,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Send,
  Zap,
  RotateCcw
} from 'lucide-react';

export const MeshConnectivityView: React.FC = () => {
  const { telemetry } = useApp();

  const [cellularOffline, setCellularOffline] = useState<boolean>(true);
  const [hopStep, setHopStep] = useState<number>(0);
  const [isSimulatingMesh, setIsSimulatingMesh] = useState<boolean>(false);

  const startMeshSimulation = () => {
    setIsSimulatingMesh(true);
    setHopStep(1);

    setTimeout(() => setHopStep(2), 1200);
    setTimeout(() => setHopStep(3), 2400);
    setTimeout(() => setHopStep(4), 3600);
    setTimeout(() => {
      setIsSimulatingMesh(false);
    }, 4500);
  };

  const resetMesh = () => {
    setHopStep(0);
    setIsSimulatingMesh(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">VEHICLE-TO-VEHICLE (V2V) ARCHITECTURE</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-400">IEEE 802.11p / ESP-NOW Store-and-Forward</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-cyan-400" />
            <span>Future Mesh Connectivity & Dead-Zone Relay System</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Decentralized ad-hoc vehicular relay architecture ensuring life-saving collision alerts transmit even in remote mountain valleys without GSM/4G coverage.
          </p>
        </div>

        {/* Future Development Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-slate-300">ARCHITECTURE SPECIFICATION: FUTURE DEVELOPMENT</span>
        </div>
      </div>

      {/* Mandatory Prototype Labeling Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white uppercase tracking-wider block">
            Future Development & Simulation Roadmap
          </span>
          <p className="text-slate-400 mt-1 leading-relaxed">
            In current field deployments, primary telemetry is routed through commercial GSM (SIM800L/4G) and vehicle Wi-Fi. The peer-to-peer V2V mesh protocol demonstrated below represents PLURIPOTENT's planned decentralized firmware architecture using ESP-NOW / 802.11p protocols for dead-zone redundancy.
          </p>
        </div>
      </div>

      {/* Interactive Mesh Relay Simulator */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              <span>Multi-Hop Ad-Hoc Packet Relay Simulation</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Watch how an incident packet travels through neighboring vehicles when primary cellular signal is 0%
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCellularOffline(!cellularOffline)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                cellularOffline
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                  : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              }`}
            >
              {cellularOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
              <span>Cellular State: {cellularOffline ? 'OFFLINE (Dead Zone)' : 'ONLINE'}</span>
            </button>

            <button
              onClick={startMeshSimulation}
              disabled={isSimulatingMesh}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>{isSimulatingMesh ? 'Transmitting Hops...' : 'Trigger Mesh Relay'}</span>
            </button>

            <button
              onClick={resetMesh}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Multi-Hop Visual Topology Diagram */}
        <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Node 1: Crashed Vehicle (Dead Zone) */}
            <div
              className={`p-4 rounded-xl border text-center transition-all ${
                hopStep >= 1
                  ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-950/50 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-mono text-rose-400 font-bold mb-1">ORIGIN NODE</div>
              <div className="text-sm font-bold text-white">Vehicle Alpha (Crash)</div>
              <div className="text-xs text-rose-300 font-mono mt-1">NO CELLULAR SIGNAL</div>
              <div className="mt-2 text-[11px] text-slate-400">
                Transmits 802.11p beacon on 5.9GHz DSRC channel
              </div>
            </div>

            {/* Node 2: Passing Intermediate Vehicle */}
            <div
              className={`p-4 rounded-xl border text-center transition-all ${
                hopStep >= 2
                  ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/50 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-mono text-amber-400 font-bold mb-1">RELAY HOP 01</div>
              <div className="text-sm font-bold text-white">Vehicle Bravo (Sedan)</div>
              <div className="text-xs text-amber-300 font-mono mt-1">
                {hopStep >= 2 ? 'PACKET RECEIVED (STORE)' : 'LISTENING'}
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Buffers encrypted payload in local flash memory
              </div>
            </div>

            {/* Node 3: Highway Commercial Truck */}
            <div
              className={`p-4 rounded-xl border text-center transition-all ${
                hopStep >= 3
                  ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-950/50 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-mono text-blue-400 font-bold mb-1">RELAY HOP 02</div>
              <div className="text-sm font-bold text-white">Truck Charlie (Semi)</div>
              <div className="text-xs text-blue-300 font-mono mt-1">
                {hopStep >= 3 ? 'FORWARDED TOWARD EXIT' : 'EN ROUTE'}
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Travels toward cellular tower coverage boundary
              </div>
            </div>

            {/* Node 4: Cloud Gateway & 911 CAD Dispatch */}
            <div
              className={`p-4 rounded-xl border text-center transition-all ${
                hopStep >= 4
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/50 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">DESTINATION</div>
              <div className="text-sm font-bold text-white">Highway 4G Gateway</div>
              <div className="text-xs text-emerald-300 font-mono mt-1">
                {hopStep >= 4 ? 'DISPATCHED TO 911 EMS' : 'AWAITING HOP'}
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Pushes JSON payload into Emergency Decision Hub
              </div>
            </div>
          </div>

          {/* Hop status text */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>
              Store-and-Forward Protocol Status: {hopStep === 4 ? 'Complete Relay Successful (4.1s total latency)' : hopStep > 0 ? `Transmitting Hop ${hopStep}...` : 'Idle'}
            </span>
            <span className="text-cyan-400">ESP-NOW AD-HOC V2V</span>
          </div>
        </div>
      </div>

      {/* Mesh Networking Technical Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-cyan-400 font-bold">01 / PHYSICAL LAYER</div>
          <div className="text-sm font-bold text-white">IEEE 802.11p / 5.9GHz DSRC</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Operates on dedicated Intelligent Transportation System (ITS) bands with a transmission range of up to 450 meters between vehicular transceivers.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-cyan-400 font-bold">02 / STORE & FORWARD</div>
          <div className="text-sm font-bold text-white">DTN Epidemic Routing</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Delay-Tolerant Networking (DTN) ensures messages persist across intermittent contacts until encountering an active cellular or roadside unit (RSU) gateway.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-cyan-400 font-bold">03 / CRYPTOGRAPHY</div>
          <div className="text-sm font-bold text-white">ECDSA Cryptographic Signing</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Vehicular telemetry payloads are cryptographically signed with elliptic curves to prevent spoofing, replay attacks, or fabricated collision dispatches.
          </p>
        </div>
      </div>
    </div>
  );
};
