import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Cpu,
  BrainCircuit,
  MapPin,
  Ambulance,
  Radio,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  AlertTriangle,
  Compass,
  HeartPulse,
  Bell
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-950/80 to-slate-950 p-8 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Generation Intelligent Road Safety Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              PLURIPOTENT
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
              IoT & Machine Learning Based Intelligent Road Accident Detection, Severity Prediction, and Emergency Decision Support System.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              Every second counts during the "Golden Hour" of trauma management. PLURIPOTENT unites low-latency vehicle edge IoT telemetry (ESP32 + MPU6050 + GPS) with validated ML severity classification and multi-agency emergency dispatch optimization to save lives faster.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/25"
              >
                <span>Launch Operational Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('iot-monitoring')}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-xs tracking-wide transition-colors flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Simulate IoT Hardware Node</span>
              </button>

              <button
                onClick={() => setActiveTab('hardware-hub')}
                className="px-4 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 font-medium text-xs transition-colors"
              >
                View ESP32 C++ Code
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">&lt; 1.2s</div>
                <div className="text-xs text-slate-400">Crash Anomaly Flag</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">94.8%</div>
                <div className="text-xs text-slate-400">Severity Accuracy</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-blue-400 tabular-nums">15s</div>
                <div className="text-xs text-slate-400">False-Alarm Abort Window</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900 shadow-2xl">
              <img
                src="/src/assets/images/iot_hardware_node_1794494005531.jpg"
                alt="Automotive IoT Accident Detection Hardware Unit"
                className="w-full h-72 object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  ESP32 + MPU6050 + NEO-6M
                </span>
                <span className="text-cyan-400">EDGE SENSOR v2.1</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement vs Proposed Solution */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-rose-500/20 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">The Road Safety Crisis</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            According to the WHO, approximately 1.19 million road traffic fatalities occur annually. A critical bottleneck in survival rates is delayed accident detection, inaccurate location reporting by disoriented victims, and unstratified emergency dispatch. First responders frequently arrive without knowing the collision magnitude, resulting in mismatched trauma triage.
          </p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              Delayed emergency notification in remote highway locations or nighttime collisions.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              Paramedics lack pre-arrival telemetry (G-force, rollover angle, delta-V).
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              High false-alarm rates from dropped smartphones or harsh braking events.
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/20 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">The PLURIPOTENT Solution</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            PLURIPOTENT delivers a complete end-to-end cyber-physical architecture: vehicular IoT nodes continuously process high-frequency inertial sensor inputs, filter transient bumps through kinematic verification, classify trauma severity via Machine Learning, and immediately mobilize the nearest appropriate trauma facility.
          </p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">✓</span>
              Dedicated vehicle-mounted IMU (MPU-6050 6-DOF) and GNSS module.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">✓</span>
              Multi-feature ML severity estimation (Minor, Moderate, Critical).
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">✓</span>
              15-second driver false-alarm abort button preventing spurious 911 dispatches.
            </li>
          </ul>
        </div>
      </section>

      {/* Complete Workflow Architecture */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              End-to-End Operational Pipeline
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Structured sequence from pre-trip environmental risk assessment to emergency hospital admission.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">9-STAGE REACTION CHAIN</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              title: 'Pre-Crash Risk Prediction',
              desc: 'Analyzes real-time road curvature, weather precipitation, speed deviation, and traffic density to predict hazard risk prior to impact.',
              icon: Compass,
              tab: 'risk-prediction' as const
            },
            {
              step: '02',
              title: 'IoT Sensor Telemetry',
              desc: 'ESP32 microcontroller samples MPU-6050 accelerometer and gyroscope at 100Hz with NEO-6M GPS coordinate locking.',
              icon: Cpu,
              tab: 'iot-monitoring' as const
            },
            {
              step: '03',
              title: 'Kinematic Crash Detection',
              desc: 'Evaluates resultant deceleration vector G = √(Ax² + Ay² + Az²), tilt angles, and post-shock velocity collapse.',
              icon: AlertTriangle,
              tab: 'accident-detection' as const
            },
            {
              step: '04',
              title: 'ML Severity Classification',
              desc: 'Predicts Minor, Moderate, or Critical trauma severity with transparent feature importance and statistical confidence metrics.',
              icon: BrainCircuit,
              tab: 'ml-severity' as const
            },
            {
              step: '05',
              title: 'Paramedic Survivor Triage',
              desc: 'Estimates kinetic energy dissipation (kJ) and provides human paramedic Glasgow Coma Scale (GCS) intake workflow.',
              icon: HeartPulse,
              tab: 'survivor-assessment' as const
            },
            {
              step: '06',
              title: 'High-Precision GPS Lock',
              desc: 'Identifies exact geographical coordinates, road segment, and nearest accessible highway exit with map pin generation.',
              icon: MapPin,
              tab: 'gps-tracking' as const
            },
            {
              step: '07',
              title: 'Multi-Agency Alert Dispatch',
              desc: 'Transmits structured SMS/GSM payloads to 112/911 police, EMS dispatch, insurance, and designated family next-of-kin.',
              icon: Bell,
              tab: 'emergency-alerts' as const
            },
            {
              step: '08',
              title: 'Rescue & Hospital Routing',
              desc: 'Calculates shortest ETA to Level 1 / Level 2 trauma centers with live ICU and emergency bay availability tracking.',
              icon: Ambulance,
              tab: 'rescue-optimization' as const
            },
            {
              step: '09',
              title: 'V2V Mesh & Prevention Learning',
              desc: 'Stores incident telemetry for highway safety analytics and prepares ad-hoc V2V mesh store-and-forward relay for dead zones.',
              icon: Radio,
              tab: 'mesh-connectivity' as const
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.step}
                onClick={() => setActiveTab(item.tab)}
                className="p-5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 text-left transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-cyan-400">{item.step}</span>
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center text-[11px] font-medium text-slate-400 group-hover:text-cyan-400">
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Emergency Operations & Hospital Intake Showcase */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400">
            <Ambulance className="w-4 h-4" />
            <span>INTELLIGENT DECISION SUPPORT</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Connecting Vehicle Sensors Directly to the Emergency Room
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            While typical systems merely send an SMS coordinates string, PLURIPOTENT provides hospitals with pre-arrival kinetic telemetry: estimated velocity delta, rollover impact geometry, passenger count, and severity predictions.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-xs font-medium text-slate-400">Paramedic Decision Support</div>
              <div className="text-sm font-semibold text-slate-200 mt-0.5">Glasgow Coma Triage</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-xs font-medium text-slate-400">Trauma Bay Preparation</div>
              <div className="text-sm font-semibold text-slate-200 mt-0.5">Pre-Warmed Blood & ICU</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-xl">
            <img
              src="/src/assets/images/emergency_command_center_1794494006077.jpg"
              alt="Emergency Medical Dispatch Operations Room"
              className="w-full h-64 object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 text-xs font-mono text-slate-300">
              EMS Operations Console — Incident Triage & Hospital Bed Coordination
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack & Architecture Details */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          System Technology Stack & Specifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <div className="text-xs font-mono text-cyan-400">01 / EDGE HARDWARE</div>
            <div className="text-sm font-bold text-white">ESP32 Dual-Core & IMU</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              ESP-WROOM-32 with 240MHz Xtensa core, MPU-6050 6-Axis Accelerometer & Gyroscope (I2C), and u-blox NEO-6M GNSS GPS receiver.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <div className="text-xs font-mono text-cyan-400">02 / MACHINE LEARNING</div>
            <div className="text-sm font-bold text-white">Severity Classification</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ensemble Gradient Boosted Trees and Random Forest calibrated on vehicular collision physics (G-force, Delta-V, tilt angle, restraints).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <div className="text-xs font-mono text-cyan-400">03 / CONNECTIVITY</div>
            <div className="text-sm font-bold text-white">GSM / 4G + V2V Mesh</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              SIM800L / SIM7600 GSM modem fallback with store-and-forward queue and 802.11p ad-hoc V2V mesh routing architecture.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <div className="text-xs font-mono text-cyan-400">04 / WEB PLATFORM</div>
            <div className="text-sm font-bold text-white">React 19 + TypeScript</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-performance responsive frontend, Web Audio API alarms, Web Speech emergency dispatch synthesizer, and REST/WebSocket API endpoints.
            </p>
          </div>
        </div>
      </section>

      {/* Contact & Academic Prototype Notice */}
      <section className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div>
          <span className="font-semibold text-slate-200">PLURIPOTENT Project Lab</span>
          <span className="mx-2">·</span>
          <span>IoT and ML Based Intelligent Road Accident Detection, Severity Prediction and Emergency Decision Support System</span>
        </div>
        <div className="text-slate-400">
          Software Prototype & Hardware Interface Specification
        </div>
      </section>
    </div>
  );
};
