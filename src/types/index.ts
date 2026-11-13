export type UserRole = 
  | 'driver' 
  | 'ambulance' 
  | 'hospital' 
  | 'admin';

export type ColorTheme = 
  | 'amber'     // Tactical Safety Gold / Amber
  | 'emerald'   // High-Tech Cyber Emerald
  | 'blue'      // Electric Cobalt Blue
  | 'violet'    // Sentinel Neon Violet
  | 'crimson'   // Rapid Trauma Crimson
  | 'cyan'      // Deep Space Cyan
  | 'light';    // Clean Titanium Light Mode

export type AccidentSeverity = 'Minor' | 'Moderate' | 'Critical';

export type DetectionState = 
  | 'NORMAL' 
  | 'ANALYZING' 
  | 'ACCIDENT_DETECTED' 
  | 'FALSE_ALARM_DISCARDED';

export interface TelemetryData {
  timestamp: number;
  accelX: number; // in g
  accelY: number; // in g
  accelZ: number; // in g
  resultantG: number; // sqrt(x^2 + y^2 + z^2)
  gyroX: number; // in deg/s
  gyroY: number; // in deg/s
  gyroZ: number; // in deg/s
  tiltAngle: number; // in degrees
  speedKmh: number; // GPS speed
  latitude: number;
  longitude: number;
  altitudeM: number;
  satellites: number;
  wifiRssi: number; // in dBm
  gsmSignalPercent: number;
  batteryPercent: number;
  deviceStatus: 'ONLINE' | 'STANDBY' | 'CONNECTING' | 'OFFLINE';
}

export interface IncidentRecord {
  id: string;
  timestamp: string;
  vehicleId: string;
  vehicleType: 'Sedan' | 'SUV' | 'Commercial Truck' | 'Motorcycle' | 'Hatchback';
  driverName: string;
  locationName: string;
  latitude: number;
  longitude: number;
  speedAtImpact: number;
  peakGForce: number;
  deltaV: number;
  rolloverAngle: number;
  airbagDeployed: boolean;
  seatbeltEngaged: boolean;
  severity: AccidentSeverity;
  predictionConfidence: number;
  status: 'Detected' | 'Dispatched' | 'On Scene' | 'Transporting' | 'Resolved' | 'Cancelled';
  assignedAmbulance?: string;
  assignedHospital?: string;
  etaMinutes?: number;
  occupantCount: number;
  triagePriority: 'P1 - Immediate' | 'P2 - Delayed' | 'P3 - Minimal';
  notes?: string;
  gcsScore?: number; // Glasgow Coma Scale (3-15)
  meshRelayed?: boolean;
}

export interface HospitalCenter {
  id: string;
  name: string;
  traumaLevel: 'Level 1 Trauma Center' | 'Level 2 Trauma Center' | 'Community Emergency';
  distanceKm: number;
  etaMinutes: number;
  latitude: number;
  longitude: number;
  availableBays: number;
  totalBays: number;
  icuBedsAvailable: number;
  phone: string;
  specialties: string[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  notifySms: boolean;
  notifyCall: boolean;
}

export interface RiskFactor {
  id: string;
  name: string;
  value: number; // 0 to 100
  weight: number;
  category: 'Weather' | 'Road Geometry' | 'Driver Behavior' | 'Traffic Density';
  status: 'Low' | 'Medium' | 'High';
  recommendation: string;
}

export interface MLPredictionExplanation {
  severity: AccidentSeverity;
  confidenceScore: number;
  featureContributions: {
    feature: string;
    impact: number; // positive or negative attribution
    description: string;
  }[];
  modelArchitecture: string;
  heuristicSummary: string;
}
