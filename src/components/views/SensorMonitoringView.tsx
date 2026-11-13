import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Activity,
  Compass,
  Radio,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Info,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const SensorMonitoringView: React.FC = () => {
  const {
    telemetry,
    setTelemetry,
    telemetryHistory,
    isSimulatingLiveDrive,
    setIsSimulatingLiveDrive,
    triggerSimulationScenario,
    detectionState,
    setActiveTab
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'stream' | 'manual_sliders' | 'hardware_spec'>('stream');

  // Manual override sliders
  const [manualAx, setManualAx] = useState(telemetry.accelX);
  const [manualAy, setManualAy] = useState(telemetry.accelY);
  const [manualAz, setManualAz] = useState(telemetry.accelZ);
  const [manualGx, setManualGx] = useState(telemetry.gyroX);
  const [manualGy, setManualGy] = useState(telemetry.gyroY);
  const [manualGz, setManualGz] = useState(telemetry.gyroZ);
  const [manualSpeed, setManualSpeed] = useState(telemetry.speedKmh);

  const applyManualSliders = () => {
    setIsSimulatingLiveDrive(false);
    const resultantG = Number(Math.sqrt(manualAx * manualAx + manualAy * manualAy + manualAz * manualAz).toFixed(2));
    const tilt = Number(Math.min(180, Math.abs(manualAy * 15) + Math.abs(manualAx * 10)).toFixed(1));

    setTelemetry((prev) => ({
      ...prev,
      timestamp: Date.now(),
      accelX: manualAx,
      accelY: manualAy,
      accelZ: manualAz,
      resultantG,
      gyroX: manualGx,
      gyroY: manualGy,
      gyroZ: manualGz,
      tiltAngle: tilt,
      speedKmh: manualSpeed
    }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">EDGE TELEMETRY INTERFACE</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-400">ESP32 + MPU-6050 + NEO-6M</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <span>IoT Sensor Monitoring & In-Flight Kinematics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-channel inertial sensor stream, coordinate vector projections, and hardware validation interface.
          </p>
        </div>

        {/* Toggle Live Stream vs Pause */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTabSub('stream')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTabSub === 'stream'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Telemetry
            </button>
            <button
              onClick={() => setActiveTabSub('manual_sliders')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTabSub === 'manual_sliders'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Manual Sliders
            </button>
            <button
              onClick={() => setActiveTabSub('hardware_spec')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTabSub === 'hardware_spec'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pinout & Circuit
            </button>
          </div>

          <button
            onClick={() => setIsSimulatingLiveDrive(!isSimulatingLiveDrive)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
              isSimulatingLiveDrive
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'bg-emerald-600 border-emerald-500 text-white'
            }`}
          >
            {isSimulatingLiveDrive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Auto Feed</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Auto Feed</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulated Preset Scenario Trays */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">Inject Simulated Physical Dynamic:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => triggerSimulationScenario('nominal')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-medium transition-colors"
          >
            Nominal Cruising (~1.0g)
          </button>
          <button
            onClick={() => triggerSimulationScenario('braking')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
          >
            Emergency Braking (-1.8g)
          </button>
          <button
            onClick={() => triggerSimulationScenario('pothole')}
            className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-medium transition-colors"
          >
            Pothole Anomaly (Spike)
          </button>
          <button
            onClick={() => triggerSimulationScenario('rollover')}
            className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-colors"
          >
            Rollover Crash (&gt;90°)
          </button>
          <button
            onClick={() => triggerSimulationScenario('high_impact')}
            className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-colors"
          >
            High-G Impact (8.8g)
          </button>
        </div>
      </div>

      {activeTabSub === 'manual_sliders' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/40 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Manual Kinematic Parameter Calibrator</h2>
              <p className="text-xs text-slate-400">Directly adjust simulated MPU6050 and GPS outputs to test edge threshold algorithms</p>
            </div>
            <button
              onClick={applyManualSliders}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Push Values to Telemetry Stream
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-mono font-bold text-cyan-400">ACCELEROMETER (g)</div>
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Ax (Longitudinal):</span>
                  <span className="font-mono">{manualAx.toFixed(2)}g</span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="0.1"
                  value={manualAx}
                  onChange={(e) => setManualAx(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Ay (Lateral):</span>
                  <span className="font-mono">{manualAy.toFixed(2)}g</span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="0.1"
                  value={manualAy}
                  onChange={(e) => setManualAy(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Az (Vertical):</span>
                  <span className="font-mono">{manualAz.toFixed(2)}g</span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="0.1"
                  value={manualAz}
                  onChange={(e) => setManualAz(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            <div className="space-y-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-mono font-bold text-amber-400">GYROSCOPE (°/s)</div>
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Gx (Roll Rate):</span>
                  <span className="font-mono">{manualGx.toFixed(1)}°/s</span>
                </div>
                <input
                  type="range"
                  min="-250"
                  max="250"
                  step="5"
                  value={manualGx}
                  onChange={(e) => setManualGx(parseFloat(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Gy (Pitch Rate):</span>
                  <span className="font-mono">{manualGy.toFixed(1)}°/s</span>
                </div>
                <input
                  type="range"
                  min="-250"
                  max="250"
                  step="5"
                  value={manualGy}
                  onChange={(e) => setManualGy(parseFloat(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Gz (Yaw Rate):</span>
                  <span className="font-mono">{manualGz.toFixed(1)}°/s</span>
                </div>
                <input
                  type="range"
                  min="-250"
                  max="250"
                  step="5"
                  value={manualGz}
                  onChange={(e) => setManualGz(parseFloat(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>
            </div>

            <div className="space-y-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-mono font-bold text-emerald-400">GPS & KINETICS</div>
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Vehicle Speed:</span>
                  <span className="font-mono">{manualSpeed.toFixed(0)} km/h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="160"
                  step="1"
                  value={manualSpeed}
                  onChange={(e) => setManualSpeed(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>
              <div className="pt-2 text-[11px] text-slate-400">
                Adjusting speed to 0 with high G forces simulates sudden obstacle arrest / frontal impact.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTabSub === 'hardware_spec' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">ESP32 + MPU-6050 Hardware Pinout Specification</h2>
            <button
              onClick={() => setActiveTab('hardware-hub')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Open C++ Source Firmware</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-cyan-400 font-bold">I2C BUS (MPU-6050)</div>
              <div className="text-slate-300">SDA: GPIO 21</div>
              <div className="text-slate-300">SCL: GPIO 22</div>
              <div className="text-slate-300">VCC: 3.3V (Filtered)</div>
              <div className="text-slate-300">GND: Common Ground</div>
              <div className="text-slate-400 text-[11px]">Sampling: 100Hz with DLPF (Digital Low Pass Filter)</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold">UART2 (NEO-6M GPS)</div>
              <div className="text-slate-300">TX: GPIO 16 (ESP32 RX2)</div>
              <div className="text-slate-300">RX: GPIO 17 (ESP32 TX2)</div>
              <div className="text-slate-300">Baud: 9600 bps</div>
              <div className="text-slate-300">NMEA sentences: $GPRMC, $GPGGA</div>
              <div className="text-slate-400 text-[11px]">Cold fix: ~32s, Warm fix: ~1s</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-amber-400 font-bold">I/O & ALARM INTERFACES</div>
              <div className="text-slate-300">Buzzer: GPIO 25 (PWM 2kHz)</div>
              <div className="text-slate-300">False-Alarm Cancel Button: GPIO 4 (Pull-up)</div>
              <div className="text-slate-300">Status LED Red: GPIO 2</div>
              <div className="text-slate-300">GSM MODEM (SIM800L): UART1 GPIO 18/19</div>
              <div className="text-slate-400 text-[11px]">Hardware interrupt on INT pin: GPIO 19</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Sensor Cluster: Gauges & Visual Vectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Accelerometer 3-Axis Box */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400">ACCELEROMETER (MPU-6050)</span>
            <span className="text-[10px] font-mono text-cyan-400">±16g RANGE</span>
          </div>
          <div className="space-y-2 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">X-Axis (Longitudinal):</span>
              <span className={`font-bold tabular-nums ${Math.abs(telemetry.accelX) > 2.5 ? 'text-rose-400' : 'text-slate-200'}`}>
                {telemetry.accelX >= 0 ? `+${telemetry.accelX.toFixed(2)}` : telemetry.accelX.toFixed(2)} g
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Y-Axis (Lateral):</span>
              <span className={`font-bold tabular-nums ${Math.abs(telemetry.accelY) > 2.5 ? 'text-rose-400' : 'text-slate-200'}`}>
                {telemetry.accelY >= 0 ? `+${telemetry.accelY.toFixed(2)}` : telemetry.accelY.toFixed(2)} g
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Z-Axis (Vertical):</span>
              <span className="font-bold text-slate-200 tabular-nums">
                {telemetry.accelZ >= 0 ? `+${telemetry.accelZ.toFixed(2)}` : telemetry.accelZ.toFixed(2)} g
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Resultant Vector:</span>
            <span className={`font-mono font-bold tabular-nums ${telemetry.resultantG > 4.0 ? 'text-rose-400' : 'text-cyan-400'}`}>
              {telemetry.resultantG.toFixed(2)} g
            </span>
          </div>
        </div>

        {/* 2. Gyroscope 3-Axis Box */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400">GYROSCOPE (ANGULAR)</span>
            <span className="text-[10px] font-mono text-amber-400">±2000°/s</span>
          </div>
          <div className="space-y-2 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Gx (Roll Rate):</span>
              <span className="font-bold text-slate-200 tabular-nums">{telemetry.gyroX.toFixed(1)} °/s</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Gy (Pitch Rate):</span>
              <span className="font-bold text-slate-200 tabular-nums">{telemetry.gyroY.toFixed(1)} °/s</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Gz (Yaw Rate):</span>
              <span className="font-bold text-slate-200 tabular-nums">{telemetry.gyroZ.toFixed(1)} °/s</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Calculated Tilt:</span>
            <span className={`font-mono font-bold tabular-nums ${telemetry.tiltAngle > 55 ? 'text-rose-400' : 'text-amber-400'}`}>
              {telemetry.tiltAngle.toFixed(1)}°
            </span>
          </div>
        </div>

        {/* 3. GPS GNSS Location Module */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400">GNSS GPS (NEO-6M)</span>
            <span className="text-[10px] font-mono text-emerald-400">3D FIX ACQUIRED</span>
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Latitude:</span>
              <span className="text-slate-200 tabular-nums">{telemetry.latitude.toFixed(6)}° N</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Longitude:</span>
              <span className="text-slate-200 tabular-nums">{telemetry.longitude.toFixed(6)}° W</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Altitude:</span>
              <span className="text-slate-200 tabular-nums">{telemetry.altitudeM.toFixed(1)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Satellites:</span>
              <span className="text-emerald-400 tabular-nums">{telemetry.satellites} Locked</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Ground Speed:</span>
            <span className="font-mono font-bold text-cyan-400 tabular-nums">{telemetry.speedKmh.toFixed(0)} km/h</span>
          </div>
        </div>

        {/* 4. Connectivity & Battery */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400">MODEM & TELEMETRY LINK</span>
            <span className="text-[10px] font-mono text-cyan-400">DUAL-BAND</span>
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Wi-Fi RSSI:</span>
                <span className="text-slate-200">{telemetry.wifiRssi} dBm (Good)</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full w-4/5 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>GSM 4G Fallback:</span>
                <span className="text-slate-200">{telemetry.gsmSignalPercent}% Signal</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[88%] rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Internal Battery:</span>
                <span className="text-slate-200">{telemetry.batteryPercent}% Li-Po</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[94%] rounded-full" />
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">State:</span>
            <span className="font-mono font-bold text-emerald-400">ONLINE · SYNCED</span>
          </div>
        </div>
      </div>

      {/* Live Waveform Stream Chart (SVG High Density) */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>Dynamic Acceleration Waveform Stream (Last 30 Samples)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous 100Hz inertial buffer with peak shock detection window
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block" /> Ax (Longitudinal)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-0.5 bg-amber-400 inline-block" /> Ay (Lateral)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-0.5 bg-rose-400 inline-block" /> Total Resultant G
            </span>
          </div>
        </div>

        {/* SVG Polyline Visualization */}
        <div className="h-48 w-full bg-slate-950 rounded-xl border border-slate-800 p-2 relative overflow-hidden telemetry-grid">
          {/* Reference baseline line */}
          <div className="absolute left-0 right-0 top-1/2 border-b border-slate-800/80 pointer-events-none" />
          <div className="absolute right-3 top-2 text-[10px] font-mono text-slate-500">
            Threshold Cutoff: 4.0g
          </div>

          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
            {/* Draw Ax Line */}
            {telemetryHistory.length > 1 && (
              <polyline
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                points={telemetryHistory
                  .map((point, index) => {
                    const x = (index / (Math.max(1, telemetryHistory.length - 1))) * 600;
                    // Center is y=80 (0g), 1g = 18px
                    const y = Math.max(10, Math.min(150, 80 - point.accelX * 16));
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            )}

            {/* Draw Ay Line */}
            {telemetryHistory.length > 1 && (
              <polyline
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                points={telemetryHistory
                  .map((point, index) => {
                    const x = (index / (Math.max(1, telemetryHistory.length - 1))) * 600;
                    const y = Math.max(10, Math.min(150, 80 - point.accelY * 16));
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            )}

            {/* Draw Resultant G Line */}
            {telemetryHistory.length > 1 && (
              <polyline
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                points={telemetryHistory
                  .map((point, index) => {
                    const x = (index / (Math.max(1, telemetryHistory.length - 1))) * 600;
                    const y = Math.max(10, Math.min(150, 140 - point.resultantG * 14));
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            )}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>T - 30s</span>
          <span>Sample Rate: 100Hz IMU FIFO Buffer</span>
          <span>Live (T - 0s)</span>
        </div>
      </div>
    </div>
  );
};
