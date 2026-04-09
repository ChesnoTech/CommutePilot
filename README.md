# CommutePilot

**Sleep on the metro. Wake up at your stop.**

A Moscow Metro alarm app that works underground where GPS fails. Set your commute once, and CommutePilot wakes you before your station — every single day.

## The Problem

Moscow Metro has 288+ stations deep underground. GPS does not work. Every existing alarm app fails in the metro. Millions of commuters have no way to set a reliable "wake me at my station" alarm.

## How It Works

CommutePilot uses sensor fusion to track your position without GPS:

- **Accelerometer** — detects train deceleration patterns (braking = arriving at station)
- **WiFi scanning** — each station has a different WiFi SSID
- **Time estimation** — average travel time between adjacent stations
- **Manual fallback** — tap button when arriving at each station

### Progressive Alarm

| Distance | Alert |
|----------|-------|
| 2 stations before | Gentle vibration |
| 1 station before | Vibration + soft sound |
| At destination | Full alarm + screen flash |

## Features

- **Station Selector** — pick line, departure, and destination from all 288 stations
- **Russian + English** — full bilingual station names
- **Journey Templates** — save "Morning commute" / "Evening commute" for one-tap activation
- **100% Offline** — all data on-device, no internet required, zero data leaves your phone
- **Accelerometer Debug** — real-time sensor data display for testing and calibration

## Tech Stack

- React Native + Expo (SDK 54)
- TypeScript
- Expo Router (file-based navigation)
- Zustand (state management)
- expo-sensors (accelerometer)
- AsyncStorage (template persistence)
- Android target (RuStore + Google Play)

## Getting Started

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on your Android device.

## Metro Coverage

15 lines, 288 stations:

| Line | Name | Stations |
|------|------|----------|
| 1 | Sokolnicheskaya | 27 |
| 2 | Zamoskvoretskaya | 24 |
| 3 | Arbatsko-Pokrovskaya | 22 |
| 4 | Filyovskaya | 13 |
| 5 | Koltsevaya (Ring) | 12 |
| 6 | Kaluzhsko-Rizhskaya | 24 |
| 7 | Tagansko-Krasnopresnenskaya | 23 |
| 8 | Kalininskaya | 8 |
| 8A | Solntsevskaya | 11 |
| 9 | Serpukhovsko-Timiryazevskaya | 25 |
| 10 | Lyublinsko-Dmitrovskaya | 26 |
| 11 | Bolshaya Koltsevaya | 27 |
| 12 | Butovskaya | 7 |
| 14 | MCC | 31 |
| 15 | Nekrasovskaya | 8 |

## Links

- **Landing Page:** https://chesnotech.github.io/commutepilot
- **Author:** Ayoub Mohamed Samir ([@ChesnoTech](https://github.com/ChesnoTech))

## License

All rights reserved.
