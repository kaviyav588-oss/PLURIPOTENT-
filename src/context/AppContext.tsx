import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  UserRole,
  ColorTheme,
  DetectionState,
  TelemetryData,
  IncidentRecord,
  HospitalCenter,
  EmergencyContact,
  RiskFactor
} from '../types';
import {
  INITIAL_TELEMETRY,
  INITIAL_INCIDENTS,
  INITIAL_HOSPITALS,
  INITIAL_EMERGENCY_CONTACTS,
  INITIAL_RISK_FACTORS
} from '../utils/mockData';
import { predictAccidentSeverity } from '../utils/mlModel';
import {
  playEmergencyAlertSound,
  playCountdownTickSound,
  playConfirmationSound,
  speakDispatchBroadcast
} from '../utils/audioAlert';

export type NavigationTab =
  | 'home'
  | 'dashboard'
  | 'iot-monitoring'
  | 'accident-detection'
  | 'risk-prediction'
  | 'ml-severity'
  | 'survivor-assessment'
  | 'gps-tracking'
  | 'emergency-alerts'
  | 'rescue-optimization'
  | 'accident-history'
  | 'analytics'
  | 'mesh-connectivity'
  | 'hardware-hub';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  telemetry: TelemetryData;
  setTelemetry: React.Dispatch<React.SetStateAction<TelemetryData>>;
  telemetryHistory: TelemetryData[];
  detectionState: DetectionState;
  falseAlarmSecondsRemaining: number;
  isSimulatingLiveDrive: boolean;
  setIsSimulatingLiveDrive: React.Dispatch<React.SetStateAction<boolean>>;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  incidents: IncidentRecord[];
  hospitals: HospitalCenter[];
  emergencyContacts: EmergencyContact[];
  riskFactors: RiskFactor[];
  selectedIncident: IncidentRecord | null;
  setSelectedIncident: (inc: IncidentRecord | null) => void;
  
  // Actions
  triggerSimulationScenario: (scenario: 'nominal' | 'braking' | 'pothole' | 'rollover' | 'high_impact') => void;
  cancelFalseAlarm: () => void;
  confirmEmergencyDispatchNow: () => void;
  updateIncidentStatus: (id: string, status: IncidentRecord['status'], notes?: string) => void;
  updateIncidentTriage: (id: string, gcsScore: number, notes: string) => void;
  resetAllDemoData: () => void;
  calibrateDetectionThresholds: (peakG: number, tilt: number, timeout: number) => void;
  thresholds: {
    peakGCutoff: number;
    tiltAngleCutoff: number;
    timeoutSeconds: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [userRole, setUserRole] = useState<UserRole>('driver');
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    try {
      const saved = localStorage.getItem('pluripotent_color_theme_v3');
      if (saved && ['emerald', 'amber', 'blue', 'violet', 'crimson', 'cyan', 'light'].includes(saved)) {
        return saved as ColorTheme;
      }
    } catch {
      // Ignore
    }
    return 'emerald'; // Active: Cyber Emerald / Bio-Safe (High-tech vibrant mint green)
  });
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isSimulatingLiveDrive, setIsSimulatingLiveDrive] = useState<boolean>(true);

  // Sync colorTheme to DOM attribute & localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pluripotent_color_theme_v3', colorTheme);
      document.documentElement.setAttribute('data-theme', colorTheme);
      if (colorTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    } catch {
      // Ignore
    }
  }, [colorTheme]);

  // Calibration thresholds
  const [thresholds, setThresholds] = useState({
    peakGCutoff: 4.0,
    tiltAngleCutoff: 55,
    timeoutSeconds: 15
  });

  // Sensor Telemetry
  const [telemetry, setTelemetry] = useState<TelemetryData>(INITIAL_TELEMETRY);
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryData[]>([INITIAL_TELEMETRY]);

  // Detection & Countdown
  const [detectionState, setDetectionState] = useState<DetectionState>('NORMAL');
  const [falseAlarmSecondsRemaining, setFalseAlarmSecondsRemaining] = useState<number>(15);

  // Persistent Incidents
  const [incidents, setIncidents] = useState<IncidentRecord[]>(() => {
    try {
      const stored = localStorage.getItem('pluripotent_incidents_v2');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return INITIAL_INCIDENTS;
  });

  const [hospitals] = useState<HospitalCenter[]>(INITIAL_HOSPITALS);
  const [emergencyContacts] = useState<EmergencyContact[]>(INITIAL_EMERGENCY_CONTACTS);
  const [riskFactors] = useState<RiskFactor[]>(INITIAL_RISK_FACTORS);
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(INITIAL_INCIDENTS[0] || null);

  // Sync incidents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pluripotent_incidents_v2', JSON.stringify(incidents));
    } catch {
      // Storage quota or error
    }
  }, [incidents]);

  // False Alarm Countdown Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (detectionState === 'ACCIDENT_DETECTED' && falseAlarmSecondsRemaining > 0) {
      if (audioEnabled) {
        playCountdownTickSound();
      }
      timer = setTimeout(() => {
        setFalseAlarmSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (detectionState === 'ACCIDENT_DETECTED' && falseAlarmSecondsRemaining === 0) {
      // Countdown expired: Auto-confirm dispatch
      confirmEmergencyDispatchNow();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [detectionState, falseAlarmSecondsRemaining, audioEnabled]);

  // Simulated live drive sensor oscillations (when in normal mode)
  useEffect(() => {
    if (!isSimulatingLiveDrive || detectionState !== 'NORMAL') return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const noiseX = (Math.random() - 0.5) * 0.08;
        const noiseY = (Math.random() - 0.5) * 0.08;
        const noiseZ = (Math.random() - 0.5) * 0.06;
        const ax = Number((0.02 + noiseX).toFixed(2));
        const ay = Number((-0.01 + noiseY).toFixed(2));
        const az = Number((0.98 + noiseZ).toFixed(2));
        const resultantG = Number(Math.sqrt(ax * ax + ay * ay + az * az).toFixed(2));
        const gyroX = Number(((Math.random() - 0.5) * 2.0).toFixed(1));
        const gyroY = Number(((Math.random() - 0.5) * 2.0).toFixed(1));
        const gyroZ = Number(((Math.random() - 0.5) * 1.5).toFixed(1));
        const tilt = Number((1.5 + (Math.random() - 0.5) * 0.8).toFixed(1));
        const speed = Math.max(0, Number((prev.speedKmh + (Math.random() - 0.48) * 1.5).toFixed(1)));

        // Micro-wander lat/lon along highway corridor
        const lat = prev.latitude + (Math.random() - 0.5) * 0.00008;
        const lon = prev.longitude + (Math.random() - 0.5) * 0.00008;

        const updated: TelemetryData = {
          ...prev,
          timestamp: Date.now(),
          accelX: ax,
          accelY: ay,
          accelZ: az,
          resultantG,
          gyroX,
          gyroY,
          gyroZ,
          tiltAngle: tilt,
          speedKmh: speed,
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lon.toFixed(6))
        };

        setTelemetryHistory((hist) => {
          const next = [...hist, updated];
          if (next.length > 30) next.shift();
          return next;
        });

        return updated;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulatingLiveDrive, detectionState]);

  // Cancel False Alarm function
  const cancelFalseAlarm = useCallback(() => {
    setDetectionState('FALSE_ALARM_DISCARDED');
    if (audioEnabled) {
      playConfirmationSound();
    }
    // Return telemetry to baseline
    setTelemetry((prev) => ({
      ...prev,
      accelX: 0.02,
      accelY: 0.01,
      accelZ: 0.99,
      resultantG: 1.0,
      tiltAngle: 2.0,
      speedKmh: 45.0
    }));

    setTimeout(() => {
      setDetectionState('NORMAL');
    }, 4000);
  }, [audioEnabled]);

  // Confirm Emergency Dispatch Function
  const confirmEmergencyDispatchNow = useCallback(() => {
    // Generate ML prediction based on collision telemetry
    const mlPrediction = predictAccidentSeverity({
      peakGForce: telemetry.resultantG,
      impactSpeedKmh: telemetry.speedKmh,
      deltaV: Math.max(20, telemetry.speedKmh * 0.85),
      rolloverAngle: telemetry.tiltAngle,
      airbagDeployed: telemetry.resultantG > 4.5,
      seatbeltEngaged: true,
      vehicleType: 'SUV'
    });

    const newId = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const nearestHosp = hospitals[0];

    const newIncident: IncidentRecord = {
      id: newId,
      timestamp,
      vehicleId: 'TX-784-PLU (Current Vehicle)',
      vehicleType: 'SUV',
      driverName: 'Robert Vance',
      locationName: `Highway Corridor MP 234.8 (Lat: ${telemetry.latitude.toFixed(4)}, Lon: ${telemetry.longitude.toFixed(4)})`,
      latitude: telemetry.latitude,
      longitude: telemetry.longitude,
      speedAtImpact: telemetry.speedKmh > 0 ? telemetry.speedKmh : 75,
      peakGForce: telemetry.resultantG,
      deltaV: Math.round(telemetry.speedKmh * 0.8),
      rolloverAngle: telemetry.tiltAngle,
      airbagDeployed: telemetry.resultantG > 4.5,
      seatbeltEngaged: true,
      severity: mlPrediction.severity,
      predictionConfidence: mlPrediction.confidenceScore,
      status: 'Dispatched',
      assignedAmbulance: 'Medic Unit Alpha-1',
      assignedHospital: nearestHosp ? nearestHosp.name : 'Central University Trauma Center',
      etaMinutes: 6,
      occupantCount: 1,
      triagePriority: mlPrediction.severity === 'Critical' ? 'P1 - Immediate' : mlPrediction.severity === 'Moderate' ? 'P2 - Delayed' : 'P3 - Minimal',
      notes: `Automated IoT collision detection registered ${telemetry.resultantG.toFixed(1)}g peak deceleration with ${telemetry.tiltAngle.toFixed(0)}° vehicle tilt. ML model classified severity as ${mlPrediction.severity}.`,
      gcsScore: mlPrediction.severity === 'Critical' ? 11 : 15,
      meshRelayed: false
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setSelectedIncident(newIncident);
    setDetectionState('NORMAL');

    if (audioEnabled) {
      playEmergencyAlertSound();
      speakDispatchBroadcast(
        `Emergency alert: ${mlPrediction.severity} collision detected. Impact force ${telemetry.resultantG.toFixed(1)} G. Dispatching Medic Unit Alpha-1 to location.`
      );
    }
  }, [telemetry, hospitals, audioEnabled]);

  // Trigger Simulation Scenarios
  const triggerSimulationScenario = useCallback((scenario: 'nominal' | 'braking' | 'pothole' | 'rollover' | 'high_impact') => {
    const baseLat = 30.2672;
    const baseLon = -97.7431;

    if (scenario === 'nominal') {
      setDetectionState('NORMAL');
      setTelemetry({
        ...INITIAL_TELEMETRY,
        timestamp: Date.now(),
        accelX: 0.03,
        accelY: -0.01,
        accelZ: 0.99,
        resultantG: 1.0,
        tiltAngle: 1.8,
        speedKmh: 72.0
      });
    } else if (scenario === 'braking') {
      // Sudden braking: high negative Ax (~1.9g), pitch tilt forward, speed drops
      setDetectionState('ANALYZING');
      setTelemetry((prev) => ({
        ...prev,
        timestamp: Date.now(),
        accelX: -1.85,
        accelY: 0.05,
        accelZ: 0.98,
        resultantG: 2.1,
        gyroX: 0.4,
        gyroY: -14.2,
        gyroZ: 0.1,
        tiltAngle: 14.5,
        speedKmh: 18.0
      }));

      // Auto-recovers to normal within 2.5s (filtered as safe braking maneuver)
      setTimeout(() => {
        setDetectionState('NORMAL');
      }, 2500);
    } else if (scenario === 'pothole') {
      // Pothole impulse: vertical Az spike (2.6g) for <100ms
      setDetectionState('ANALYZING');
      setTelemetry((prev) => ({
        ...prev,
        timestamp: Date.now(),
        accelX: 0.1,
        accelY: -0.15,
        accelZ: 2.55,
        resultantG: 2.56,
        gyroX: 8.5,
        gyroY: 4.2,
        gyroZ: 1.0,
        tiltAngle: 6.0,
        speedKmh: 55.0
      }));

      // Filtered out as road vibration / pothole
      setTimeout(() => {
        setDetectionState('FALSE_ALARM_DISCARDED');
        setTimeout(() => setDetectionState('NORMAL'), 2500);
      }, 800);
    } else if (scenario === 'rollover') {
      // Rollover: high lateral acceleration, tilt > 90°
      const peakG = 7.4;
      const tilt = 112.0;
      setTelemetry((prev) => ({
        ...prev,
        timestamp: Date.now(),
        accelX: -3.8,
        accelY: 5.6,
        accelZ: -2.4,
        resultantG: peakG,
        gyroX: 145.0,
        gyroY: 62.0,
        gyroZ: 94.0,
        tiltAngle: tilt,
        speedKmh: 0,
        latitude: baseLat + 0.0042,
        longitude: baseLon - 0.0031
      }));

      setDetectionState('ACCIDENT_DETECTED');
      setFalseAlarmSecondsRemaining(thresholds.timeoutSeconds);
      if (audioEnabled) {
        playEmergencyAlertSound();
      }
    } else if (scenario === 'high_impact') {
      // Severe frontal/T-Bone impact: 8.8g peak force, sudden zero velocity
      const peakG = 8.8;
      const tilt = 28.0;
      setTelemetry((prev) => ({
        ...prev,
        timestamp: Date.now(),
        accelX: -7.9,
        accelY: 3.2,
        accelZ: 1.4,
        resultantG: peakG,
        gyroX: 35.0,
        gyroY: -58.0,
        gyroZ: 22.0,
        tiltAngle: tilt,
        speedKmh: 0,
        latitude: baseLat - 0.0035,
        longitude: baseLon + 0.0028
      }));

      setDetectionState('ACCIDENT_DETECTED');
      setFalseAlarmSecondsRemaining(thresholds.timeoutSeconds);
      if (audioEnabled) {
        playEmergencyAlertSound();
      }
    }
  }, [thresholds.timeoutSeconds, audioEnabled]);

  const updateIncidentStatus = useCallback((id: string, status: IncidentRecord['status'], notes?: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status, notes: notes || inc.notes } : inc))
    );
    setSelectedIncident((prev) => (prev && prev.id === id ? { ...prev, status, notes: notes || prev.notes } : prev));
  }, []);

  const updateIncidentTriage = useCallback((id: string, gcsScore: number, notes: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, gcsScore, notes } : inc))
    );
    setSelectedIncident((prev) => (prev && prev.id === id ? { ...prev, gcsScore, notes } : prev));
  }, []);

  const resetAllDemoData = useCallback(() => {
    setIncidents(INITIAL_INCIDENTS);
    setTelemetry(INITIAL_TELEMETRY);
    setDetectionState('NORMAL');
    setFalseAlarmSecondsRemaining(15);
    localStorage.removeItem('pluripotent_incidents_v2');
  }, []);

  const calibrateDetectionThresholds = useCallback((peakG: number, tilt: number, timeout: number) => {
    setThresholds({
      peakGCutoff: peakG,
      tiltAngleCutoff: tilt,
      timeoutSeconds: timeout
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        colorTheme,
        setColorTheme,
        telemetry,
        setTelemetry,
        telemetryHistory,
        detectionState,
        falseAlarmSecondsRemaining,
        isSimulatingLiveDrive,
        setIsSimulatingLiveDrive,
        audioEnabled,
        setAudioEnabled,
        incidents,
        hospitals,
        emergencyContacts,
        riskFactors,
        selectedIncident,
        setSelectedIncident,
        triggerSimulationScenario,
        cancelFalseAlarm,
        confirmEmergencyDispatchNow,
        updateIncidentStatus,
        updateIncidentTriage,
        resetAllDemoData,
        calibrateDetectionThresholds,
        thresholds
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
