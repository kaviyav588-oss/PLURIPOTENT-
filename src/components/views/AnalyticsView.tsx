import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Clock,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { incidents } = useApp();

  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');

  // Summary statistics
  const total = incidents.length;
  const critical = incidents.filter((i) => i.severity === 'Critical').length;
  const moderate = incidents.filter((i) => i.severity === 'Moderate').length;
  const minor = incidents.filter((i) => i.severity === 'Minor').length;

  const avgGForce = total > 0 ? (incidents.reduce((acc, i) => acc + i.peakGForce, 0) / total).toFixed(1) : '0.0';
  const avgEta = '6.4';
  const falseAlarmRejectionRate = '97.2%';
  const goldenHourDeliveryRate = '94.8%';

  // Hourly distribution bins (0-4h, 4-8h, 8-12h, 12-16h, 16-20h, 20-24h)
  const hourlyData = [
    { label: '00:00 - 04:00', count: 18, risk: 'Medium' },
    { label: '04:00 - 08:00', count: 12, risk: 'Low' },
    { label: '08:00 - 12:00', count: 28, risk: 'High' },
    { label: '12:00 - 16:00', count: 22, risk: 'Medium' },
    { label: '16:00 - 20:00', count: 42, risk: 'High' }, // Peak evening rush
    { label: '20:00 - 24:00', count: 31, risk: 'High' }
  ];

  const maxHourCount = 42;

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">CORRIDOR SAFETY INTELLIGENCE</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-400">Longitudinal Epidemiological Metrics</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <span>Road Safety Analytics & Prevention Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated statistical performance dashboards, peak hazard periods, collision kinematics, and automated report exports.
          </p>
        </div>

        {/* Timeframe Selector & Print Report */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {(['Daily', 'Weekly', 'Monthly'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  timeframe === t ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrintSummary}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Generate Executive Report</span>
          </button>
        </div>
      </div>

      {/* KPI Performance Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Mean EMS Dispatch Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400 mt-2 tabular-nums">
            {avgEta} <span className="text-sm font-normal text-slate-400">min</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">62% faster than 911 verbal call</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">False-Alarm Filter Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 mt-2 tabular-nums">
            {falseAlarmRejectionRate}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Potholes & dropped phones rejected</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Golden Hour Intake Rate</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-400 mt-2 tabular-nums">
            {goldenHourDeliveryRate}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Target delivery under 60 minutes</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Average Collision G-Force</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400 mt-2 tabular-nums">
            {avgGForce} <span className="text-sm font-normal text-slate-400">g</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Kinematic deceleration average</div>
        </div>
      </div>

      {/* Two Column Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Peak Crash Hour Distribution Bar Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>Incident Frequency by Time of Day</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Corridor collision probability peaks during evening commute (16:00–20:00)</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">HEATMAP</span>
          </div>

          <div className="space-y-3 pt-2">
            {hourlyData.map((slot) => {
              const widthPct = (slot.count / maxHourCount) * 100;
              const isPeak = slot.count === maxHourCount;
              return (
                <div key={slot.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{slot.label}</span>
                    <span className={isPeak ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {slot.count} Collisions {isPeak && '(Peak Commute)'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPeak
                          ? 'bg-rose-500'
                          : slot.risk === 'High'
                          ? 'bg-amber-500'
                          : 'bg-cyan-500'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Low risk: 04:00 - 08:00</span>
            <span>Critical peak: 17:30 - 19:15</span>
          </div>
        </div>

        {/* Collision Type Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <PieChart className="w-5 h-5 text-cyan-400" />
              <span>Collision Typology Distribution</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">Physics Kinematics</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Rear-End Impact (Ax Deceleration)</div>
                <div className="text-[11px] text-slate-400">Predominantly stop-and-go highway traffic</div>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">41%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Side-Impact / T-Bone (Ay Lateral)</div>
                <div className="text-[11px] text-slate-400">Signalized intersections & left-turn maneuvers</div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">29%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Head-On Barrier Collision (Extreme G)</div>
                <div className="text-[11px] text-slate-400">Median barrier impacts and wrong-way events</div>
              </div>
              <span className="text-xs font-mono font-bold text-rose-400">18%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Rollover / Inversion (&gt;60° Tilt)</div>
                <div className="text-[11px] text-slate-400">Embankment departure and high-speed tripping</div>
              </div>
              <span className="text-xs font-mono font-bold text-purple-400">12%</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
            Data insights are used to calibrate city traffic signal timing, deploy automated variable speed limits on rainy days, and preposition emergency ambulances near critical high-collision nodes.
          </div>
        </div>
      </div>
    </div>
  );
};
