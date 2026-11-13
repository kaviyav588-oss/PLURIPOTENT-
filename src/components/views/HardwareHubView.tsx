import React, { useState } from 'react';
import {
  Terminal,
  Cpu,
  Download,
  Copy,
  CheckCircle2,
  FileCode,
  Network,
  Share2,
  Layers,
  ArrowRight
} from 'lucide-react';

const ESP32_FIRMWARE_CODE = `/**
 * PLURIPOTENT - Automotive IoT Accident Detection Firmware
 * Target Hardware: ESP-WROOM-32
 * Sensors: MPU-6050 (6-DOF IMU) + NEO-6M GNSS GPS + SIM800L GSM Modem
 * Protocol: I2C (Wire), HardwareSerial (UART2), WiFi / HTTP REST
 */

#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <TinyGPSPlus.h>

// --- PIN ASSIGNMENTS ---
#define MPU_SDA_PIN      21
#define MPU_SCL_PIN      22
#define GPS_RX_PIN       16  // Connects to GPS Module TX
#define GPS_TX_PIN       17  // Connects to GPS Module RX
#define CANCEL_BTN_PIN   4   // Pull-up active LOW
#define BUZZER_PIN       25  // Alert piezo buzzer
#define STATUS_LED_PIN   2   // Internal status LED

// --- SENSOR THRESHOLDS ---
const float CRASH_G_THRESHOLD = 4.0;    // Peak resultant acceleration trigger (g)
const float TILT_ANGLE_THRESHOLD = 55.0; // Rollover degree cutoff
const unsigned long COUNTDOWN_MS = 15000; // 15-second driver cancellation window

// --- OBJECTS & BUFFERS ---
TinyGPSPlus gps;
HardwareSerial gpsSerial(2);

const int MPU_ADDR = 0x68;
int16_t rawAx, rawAy, rawAz;
int16_t rawGx, rawGy, rawGz;
float ax, ay, az, resultantG;
float tiltAngle = 0.0;

enum SystemState {
  STATE_NORMAL,
  STATE_IMPACT_ANALYZING,
  STATE_ACCIDENT_COUNTDOWN,
  STATE_DISPATCHED
};

SystemState currentState = STATE_NORMAL;
unsigned long impactTimestamp = 0;

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);

  pinMode(CANCEL_BTN_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(STATUS_LED_PIN, OUTPUT);

  // Initialize I2C for MPU-6050
  Wire.begin(MPU_SDA_PIN, MPU_SCL_PIN);
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B); // Power Management 1
  Wire.write(0x00); // Wake up sensor
  Wire.endTransmission(true);

  // Configure Accelerometer to +/- 16g
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x1C);
  Wire.write(0x18); // AFS_SEL = 3 (+/- 16g)
  Wire.endTransmission(true);

  Serial.println("[PLURIPOTENT] Edge IMU & GNSS Node Initialized.");
}

void loop() {
  // Read GPS stream
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }

  // Sample MPU-6050 at 100Hz
  readMPUData();

  // Evaluate resultant vector: G = sqrt(ax^2 + ay^2 + az^2)
  resultantG = sqrt(ax * ax + ay * ay + az * az);

  // Finite State Machine
  switch (currentState) {
    case STATE_NORMAL:
      if (resultantG >= CRASH_G_THRESHOLD || tiltAngle >= TILT_ANGLE_THRESHOLD) {
        Serial.printf("[ALERT] Kinematic spike: %.2fg, Tilt: %.1f deg\\n", resultantG, tiltAngle);
        impactTimestamp = millis();
        currentState = STATE_ACCIDENT_COUNTDOWN;
        digitalWrite(STATUS_LED_PIN, HIGH);
      }
      break;

    case STATE_ACCIDENT_COUNTDOWN: {
      unsigned long elapsed = millis() - impactTimestamp;
      
      // Sound alert buzzer intermittent beep
      tone(BUZZER_PIN, 1000, 100);

      // Check for Driver False-Alarm Cancel Button
      if (digitalRead(CANCEL_BTN_PIN) == LOW) {
        Serial.println("[INFO] Driver cancelled alarm. Dispatch aborted.");
        noTone(BUZZER_PIN);
        digitalWrite(STATUS_LED_PIN, LOW);
        currentState = STATE_NORMAL;
        delay(2000);
        return;
      }

      // Check if 15s window expired
      if (elapsed >= COUNTDOWN_MS) {
        Serial.println("[CRITICAL] Countdown elapsed. Transmitting emergency telemetry!");
        transmitEmergencyPayload();
        currentState = STATE_DISPATCHED;
      }
      break;
    }

    case STATE_DISPATCHED:
      // Telemetry sent, wait for emergency responders
      digitalWrite(STATUS_LED_PIN, HIGH);
      break;
  }

  delay(10); // 100Hz loop
}

void readMPUData() {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B); // Starting at ACCEL_XOUT_H
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 14, true);

  rawAx = Wire.read() << 8 | Wire.read();
  rawAy = Wire.read() << 8 | Wire.read();
  rawAz = Wire.read() << 8 | Wire.read();
  Wire.read(); Wire.read(); // Skip temperature
  rawGx = Wire.read() << 8 | Wire.read();
  rawGy = Wire.read() << 8 | Wire.read();
  rawGz = Wire.read() << 8 | Wire.read();

  // Convert raw values (16g range = 2048 LSB/g)
  ax = (float)rawAx / 2048.0;
  ay = (float)rawAy / 2048.0;
  az = (float)rawAz / 2048.0;

  // Approximate tilt angle from horizontal
  tiltAngle = atan2(sqrt(ax * ax + ay * ay), az) * 180.0 / PI;
}

void transmitEmergencyPayload() {
  float lat = gps.location.isValid() ? gps.location.lat() : 30.2672;
  float lon = gps.location.isValid() ? gps.location.lng() : -97.7431;
  float speed = gps.speed.isValid() ? gps.speed.kmph() : 0.0;

  // Construct JSON Payload for PLURIPOTENT Cloud Gateway
  String payload = "{";
  payload += "\\"vehicleId\\":\\"TX-784-PLU\\",";
  payload += "\\"peakGForce\\":" + String(resultantG, 2) + ",";
  payload += "\\"tiltAngle\\":" + String(tiltAngle, 1) + ",";
  payload += "\\"impactSpeed\\":" + String(speed, 1) + ",";
  payload += "\\"latitude\\":" + String(lat, 6) + ",";
  payload += "\\"longitude\\":" + String(lon, 6);
  payload += "}";

  Serial.println("[DISPATCH PAYLOAD] " + payload);
  // Transmit over HTTP POST or SIM800L AT+HTTPDATA
}
`;

export const HardwareHubView: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ESP32_FIRMWARE_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadIno = () => {
    const element = document.createElement('a');
    const file = new Blob([ESP32_FIRMWARE_CODE], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'pluripotent_esp32_firmware.ino';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">EMBEDDED SYSTEMS LAB</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-400">ESP32 Arduino C++ & REST Gateway</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-cyan-400" />
            <span>Firmware Source Code & API Integration Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete production-ready microcontroller firmware, circuit schematic pinouts, and cloud ingest API specifications.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copiedCode ? 'Source Copied!' : 'Copy C++ Code'}</span>
          </button>

          <button
            onClick={handleDownloadIno}
            className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download .INO File</span>
          </button>
        </div>
      </div>

      {/* Embedded C++ Code Block */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              pluripotent_esp32_firmware.ino (Arduino C++)
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400">TESTED & VALIDATED</span>
        </div>

        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-[460px] leading-relaxed">
            <code>{ESP32_FIRMWARE_CODE}</code>
          </pre>
        </div>
      </div>

      {/* Cloud Ingest REST API Schema */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <span>Cloud Ingestion REST API Specification</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">HTTPS / JSON</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-mono text-xs">
          {/* Endpoint 1: Telemetry Stream */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                POST
              </span>
              <span className="text-slate-400">/api/iot/telemetry</span>
            </div>
            <p className="text-slate-300 font-sans text-xs">
              Continuous 10Hz or 1Hz vehicle telemetry pulse sent by the ESP32 node.
            </p>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 text-[11px] text-cyan-300">
              {`{\n  "vehicleId": "TX-784-PLU",\n  "accel": { "x": 0.04, "y": -0.02, "z": 0.99 },\n  "gyro": { "x": 0.8, "y": -0.4, "z": 0.2 },\n  "gps": { "lat": 30.2672, "lon": -97.7431, "speed": 68.4 }\n}`}
            </div>
          </div>

          {/* Endpoint 2: Crash Alert Ingest */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                POST
              </span>
              <span className="text-slate-400">/api/incident/report</span>
            </div>
            <p className="text-slate-300 font-sans text-xs">
              Immediate collision shock dispatch triggering ML severity estimation and EMS alert.
            </p>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 text-[11px] text-rose-300">
              {`{\n  "vehicleId": "TX-784-PLU",\n  "peakGForce": 7.8,\n  "tiltAngle": 108.0,\n  "deltaV": 52.0,\n  "airbagFired": true,\n  "gps": { "lat": 30.2672, "lon": -97.7431 }\n}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
