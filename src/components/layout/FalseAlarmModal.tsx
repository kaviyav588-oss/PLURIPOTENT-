import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, CheckCircle2, PhoneCall, ShieldAlert, X } from 'lucide-react';

export const FalseAlarmModal: React.FC = () => {
  const {
    detectionState,
    falseAlarmSecondsRemaining,
    cancelFalseAlarm,
    confirmEmergencyDispatchNow,
    telemetry,
    thresholds
  } = useApp();

  if (detectionState !== 'ACCIDENT_DETECTED') {
    return null;
  }

  const progressPercent = Math.max(0, (falseAlarmSecondsRemaining / thresholds.timeoutSeconds) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-rose-500/80 rounded-2xl p-6 shadow-2xl shadow-rose-950/60 overflow-hidden relative">
        {/* Urgent header banner */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 animate-bounce">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Abnormal Collision Shock Detected
              </h2>
              <p className="text-xs text-rose-300">
                Automatic Emergency Response Dispatch Sequence
              </p>
            </div>
          </div>
          <button
            onClick={cancelFalseAlarm}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Dismiss / Cancel False Alarm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Countdown Timer Visual */}
        <div className="py-6 text-center">
          <div className="inline-flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 border-rose-500/40 bg-rose-950/40 relative shadow-inner shadow-rose-900/50">
            <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
              {falseAlarmSecondsRemaining}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300">
              Seconds
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
            <div
              className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            Emergency telemetry and GPS coordinates will be transmitted to 911 / EMS and designated family contacts when timer expires.
          </p>
        </div>

        {/* Telemetry Snapshot at Impact */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800 mb-6 text-center font-mono">
          <div>
            <div className="text-[10px] text-slate-400">PEAK G-FORCE</div>
            <div className="text-sm font-bold text-rose-400">{telemetry.resultantG.toFixed(1)}g</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">ROLL/TILT</div>
            <div className="text-sm font-bold text-amber-400">{telemetry.tiltAngle.toFixed(0)}°</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">IMPACT SPEED</div>
            <div className="text-sm font-bold text-cyan-400">{telemetry.speedKmh.toFixed(0)} km/h</div>
          </div>
        </div>

        {/* Two Clear Primary Action Buttons */}
        <div className="space-y-2.5">
          {/* Cancel False Alarm */}
          <button
            onClick={cancelFalseAlarm}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>I AM SAFE — CANCEL EMERGENCY DISPATCH</span>
          </button>

          {/* Immediate Dispatch Override */}
          <button
            onClick={confirmEmergencyDispatchNow}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-rose-200 border border-rose-500/30 font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Dispatch Immediately (Bypass Timer)</span>
          </button>
        </div>

        <div className="mt-4 text-[10px] text-center text-slate-400">
          Demo Mode: All notifications and dispatches are safely simulated. No real emergency calls will be placed.
        </div>
      </div>
    </div>
  );
};
