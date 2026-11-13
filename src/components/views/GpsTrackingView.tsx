import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Navigation,
  Compass,
  Share2,
  Copy,
  CheckCircle2,
  Ambulance,
  Hospital,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

export const GpsTrackingView: React.FC = () => {
  const { telemetry, incidents, hospitals, selectedIncident, setSelectedIncident } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const activeLat = selectedIncident ? selectedIncident.latitude : telemetry.latitude;
  const activeLon = selectedIncident ? selectedIncident.longitude : telemetry.longitude;

  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${activeLat.toFixed(6)},${activeLon.toFixed(6)}`;
  const coordsString = `${activeLat.toFixed(6)}, ${activeLon.toFixed(6)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(gmapsUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(coordsString);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">GEOSPATIAL INTELLIGENCE</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-400">u-blox NEO-6M GNSS + GIS Routing</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-cyan-400" />
            <span>Interactive GPS Tracking & Emergency Geolocation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time geospatial vector map displaying collision crash coordinates, ambulance routing vectors, and location broadcast utilities.
          </p>
        </div>

        {/* Quick Location Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCoords}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            {copiedCoords ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copiedCoords ? 'Coordinates Copied!' : 'Copy Lat/Lon'}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Google Maps Pin'}</span>
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Vector Map Canvas */}
        <div className="lg:col-span-8 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              SATELLITE CARRIER FIX ({telemetry.satellites} SATS)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-slate-300">{(zoomLevel * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* SVG Map Screen */}
          <div className="relative w-full h-[450px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden select-none">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 telemetry-grid opacity-60" />

            {/* Simulated Geographic Road Network Lines */}
            <svg
              className="w-full h-full"
              viewBox="0 0 800 500"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
            >
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Major Highway Arterials */}
              <line x1="100" y1="20" x2="680" y2="480" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
              <line x1="100" y1="20" x2="680" y2="480" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
              <line x1="80" y1="280" x2="720" y2="120" stroke="#334155" strokeWidth="8" />
              <line x1="200" y1="460" x2="250" y2="40" stroke="#1e293b" strokeWidth="6" />
              <line x1="450" y1="480" x2="520" y2="30" stroke="#1e293b" strokeWidth="6" />

              {/* Secondary Street Grid */}
              <circle cx="420" cy="240" r="160" fill="none" stroke="#1e293b" strokeWidth="3" strokeDasharray="6 4" />
              <circle cx="420" cy="240" r="90" fill="none" stroke="#1e293b" strokeWidth="2" />

              {/* River / Waterway Curve */}
              <path
                d="M 50,420 Q 250,380 400,320 T 750,260"
                fill="none"
                stroke="#0369a1"
                strokeWidth="10"
                strokeOpacity="0.35"
              />

              {/* Dispatch Route Vector from Ambulance to Active Incident */}
              <path
                d="M 280,360 Q 320,300 420,240"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeDasharray="6 4"
                className="animate-pulse"
              />

              {/* Route from Crash to Level 1 Trauma Center */}
              <path
                d="M 420,240 Q 500,200 580,140"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray="4 4"
              />

              {/* Hospital Markers */}
              {hospitals.map((hosp, idx) => {
                const hx = 580 - idx * 110;
                const hy = 140 + idx * 80;
                return (
                  <g
                    key={hosp.id}
                    className="cursor-pointer group"
                    onClick={() => setActiveMarker(hosp.id)}
                  >
                    <circle cx={hx} cy={hy} r="14" fill="#047857" fillOpacity="0.4" />
                    <circle cx={hx} cy={hy} r="8" fill="#10b981" />
                    <text x={hx + 14} y={hy + 4} fill="#6ee7b7" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                      {hosp.name.substring(0, 18)}...
                    </text>
                  </g>
                );
              })}

              {/* Ambulance Response Unit Marker */}
              <g className="cursor-pointer" onClick={() => setActiveMarker('ambulance-unit')}>
                <circle cx="280" cy="360" r="16" fill="#0284c7" fillOpacity="0.3" className="animate-ping" />
                <circle cx="280" cy="360" r="10" fill="#0284c7" />
                <text x="295" y="364" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                  AMBULANCE ECHO-4 (ETA 4m)
                </text>
              </g>

              {/* Active Incident Crash Site Marker */}
              <g className="cursor-pointer" onClick={() => setActiveMarker('crash-site')}>
                <circle cx="420" cy="240" r="28" fill="#e11d48" fillOpacity="0.25" className="animate-ping" />
                <circle cx="420" cy="240" r="14" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
                <text x="440" y="244" fill="#f43f5e" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  COLLISION: {selectedIncident ? selectedIncident.id : 'CURRENT VEHICLE'}
                </text>
              </g>
            </svg>

            {/* Overlaid Interactive Marker Detail Pill */}
            {activeMarker && (
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-cyan-500/50 rounded-xl p-3 shadow-xl backdrop-blur-md flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">
                    {activeMarker === 'crash-site'
                      ? `Crash Incident Coordinates: ${coordsString}`
                      : activeMarker === 'ambulance-unit'
                      ? 'Ambulance Unit Echo-4 (En Route to Scene, ETA 4 Mins)'
                      : 'Hospital Trauma Emergency Facility'}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Lat: {activeLat.toFixed(6)}, Lon: {activeLon.toFixed(6)} · Corridor MP 234.8
                  </span>
                </div>
                <button
                  onClick={() => setActiveMarker(null)}
                  className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2">
            <span>Coordinate System: WGS84 Universal Transverse Mercator</span>
            <span>GIS Map Rendering Active</span>
          </div>
        </div>

        {/* Right Column: Location Details & Sharing Tools */}
        <div className="lg:col-span-4 space-y-5">
          {/* Geolocation Telemetry Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Fix Coordinates & Kinematics</span>
            </h2>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Latitude:</span>
                <span className="text-slate-200 font-bold">{activeLat.toFixed(6)}° N</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Longitude:</span>
                <span className="text-slate-200 font-bold">{activeLon.toFixed(6)}° W</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Altitude:</span>
                <span className="text-slate-200 font-bold">{telemetry.altitudeM.toFixed(1)} meters</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">GPS Course Heading:</span>
                <span className="text-cyan-400 font-bold">048° North-East</span>
              </div>
            </div>
          </div>

          {/* Emergency Location Sharing Payload Preview */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Location Sharing & SMS Dispatch Payload</span>
            </h2>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-2">
              <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                SMS / GSM MODEM STRING (SIM800L):
              </div>
              <div className="text-[11px] text-slate-200 bg-slate-900 p-2 rounded border border-slate-800 break-all leading-relaxed">
                PLURIPOTENT ALERT: Crash at Lat {activeLat.toFixed(4)}, Lon {activeLon.toFixed(4)}. Severity: {selectedIncident?.severity || 'Critical'}. G-force: {selectedIncident?.peakGForce || telemetry.resultantG.toFixed(1)}g. Map: {gmapsUrl}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Copy Google Maps Navigation Link</span>
              </button>

              <a
                href={gmapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>Open in External Google Maps Window</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
