import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  History,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  AlertTriangle,
  Eye,
  CheckCircle2,
  X,
  FileSpreadsheet,
  FileCode,
  MapPin,
  Calendar,
  Activity,
  UserCheck
} from 'lucide-react';
import { IncidentRecord, AccidentSeverity } from '../../types';

export const AccidentHistoryView: React.FC = () => {
  const { incidents, setSelectedIncident, setActiveTab, resetAllDemoData } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | AccidentSeverity>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'g_desc' | 'speed_desc'>('date_desc');
  const [modalIncident, setModalIncident] = useState<IncidentRecord | null>(null);

  // Filtered and sorted incidents
  const filteredIncidents = useMemo(() => {
    return incidents
      .filter((inc) => {
        const matchesSearch =
          inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.driverName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
        const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;

        return matchesSearch && matchesSeverity && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') return b.timestamp.localeCompare(a.timestamp);
        if (sortBy === 'date_asc') return a.timestamp.localeCompare(b.timestamp);
        if (sortBy === 'g_desc') return b.peakGForce - a.peakGForce;
        if (sortBy === 'speed_desc') return b.speedAtImpact - a.speedAtImpact;
        return 0;
      });
  }, [incidents, searchTerm, severityFilter, statusFilter, sortBy]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['IncidentID', 'Timestamp', 'VehicleID', 'Driver', 'Location', 'Severity', 'PeakGForce', 'SpeedKmh', 'Status', 'GCS', 'Hospital'];
    const rows = filteredIncidents.map((i) => [
      i.id,
      `"${i.timestamp}"`,
      `"${i.vehicleId}"`,
      `"${i.driverName}"`,
      `"${i.locationName}"`,
      i.severity,
      i.peakGForce.toFixed(2),
      i.speedAtImpact,
      i.status,
      i.gcsScore || 'N/A',
      `"${i.assignedHospital || 'N/A'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PLURIPOTENT_Incidents_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredIncidents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `PLURIPOTENT_Telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">DATA AUDIT REGISTRY</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-400">Persistent Incident Log</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>Accident Incident History & Audit Records</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Searchable historical collision records with kinematic telematics, ML severity classifications, and response resolutions.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, Vehicle, Location, Driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Severity Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono">SEVERITY:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as 'ALL' | AccidentSeverity)}
              className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Moderate">Moderate</option>
              <option value="Minor">Minor</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="g_desc">Highest G-Force</option>
              <option value="speed_desc">Highest Speed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents Data Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">INCIDENT ID</th>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">VEHICLE & OCCUPANT</th>
                <th className="py-3 px-4">ROADWAY LOCATION</th>
                <th className="py-3 px-4">PEAK G</th>
                <th className="py-3 px-4">SEVERITY</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">INSPECT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-sans">
                    No matching collision incidents found for your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => setModalIncident(inc)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 text-cyan-400 font-bold whitespace-nowrap">
                      {inc.id}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {inc.timestamp}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <div className="font-semibold text-slate-200">{inc.vehicleId}</div>
                      <div className="text-[11px] text-slate-400">{inc.driverName} ({inc.occupantCount} occ.)</div>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-300 max-w-xs truncate">
                      {inc.locationName}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-200 tabular-nums whitespace-nowrap">
                      {inc.peakGForce.toFixed(1)}g
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
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
                    <td className="py-3 px-4 font-sans whitespace-nowrap text-slate-300">
                      {inc.status}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalIncident(inc);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 transition-colors"
                        title="View Detailed Incident Card"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredIncidents.length} of {incidents.length} recorded incidents</span>
          <button
            onClick={resetAllDemoData}
            className="text-[11px] text-slate-500 hover:text-rose-400 font-mono transition-colors"
          >
            Reset All Demo Records to Initial Seed
          </button>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {modalIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Incident Telemetry Dossier: {modalIncident.id}
                  </h2>
                  <div className="text-xs text-slate-400 font-mono">
                    {modalIncident.timestamp} · {modalIncident.locationName}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setModalIncident(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of kinematic specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Peak Deceleration:</span>
                <span className="text-rose-400 font-bold text-sm">{modalIncident.peakGForce.toFixed(2)}g</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Pre-Impact Speed:</span>
                <span className="text-cyan-400 font-bold text-sm">{modalIncident.speedAtImpact} km/h</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Delta-V:</span>
                <span className="text-amber-400 font-bold text-sm">{modalIncident.deltaV} km/h</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Rollover Angle:</span>
                <span className="text-purple-400 font-bold text-sm">{modalIncident.rolloverAngle}°</span>
              </div>
            </div>

            {/* Restraints, Airbag & Status */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Emergency Dispatch:</span>
                <span className="font-bold text-slate-200">{modalIncident.assignedAmbulance || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Receiving Trauma Facility:</span>
                <span className="font-bold text-cyan-400">{modalIncident.assignedHospital || 'Central University'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Glasgow Coma Scale Triage:</span>
                <span className="font-bold text-emerald-400">GCS {modalIncident.gcsScore || 15}/15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mesh Network Relay:</span>
                <span className="font-mono text-slate-300">{modalIncident.meshRelayed ? 'Yes (Relayed via V2V Node)' : 'Direct Cellular Link'}</span>
              </div>
            </div>

            {/* Paramedic notes */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Paramedic Field Observations:
              </span>
              <p className="text-slate-300 leading-relaxed font-sans">
                {modalIncident.notes || 'No field notes submitted yet.'}
              </p>
            </div>

            {/* Action footer */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setSelectedIncident(modalIncident);
                  setModalIncident(null);
                  setActiveTab('survivor-assessment');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Open in Paramedic Triage
              </button>

              <button
                onClick={() => setModalIncident(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
