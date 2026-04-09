# CommutePilot

**Sleep on the metro. Wake up at your stop.**

A Moscow Metro alarm app that works underground where GPS fails. Set your commute once, and CommutePilot wakes you before your station — every single day.

## Download

**[Download APK v1.0.0](https://expo.dev/artifacts/eas/w5zZd4vWM2SoDixiaUG5ny.apk)** — Install directly on your Android device.

Coming soon to RuStore and Google Play.

## The Problem

Moscow Metro has 430+ stations across 19 lines, deep underground. GPS does not work. Every existing alarm app fails in the metro. Millions of commuters have no way to set a reliable "wake me at my station" alarm.

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

- **Route Finder** — search by address or station name, get multiple route options with transfers
- **Address Search** — type your home/work address, find nearest metro stations (free geocoding via OpenStreetMap)
- **Station Selector** — pick line, departure, and destination from all 430 stations across 19 lines
- **Interactive Metro Map** — tap stations directly on the map to select your route
- **Multi-Leg Journeys** — chain metro + bus + walk segments into one template
- **Journey Templates** — save "Morning commute" / "Evening commute" for one-tap activation
- **Share Routes** — share journey templates via QR code or text link
- **3 Languages** — Russian, English, Arabic
- **Accessibility** — profiles for wheelchair, elderly, vision-impaired users
- **100% Offline** — all data on-device, no internet required, zero data leaves your phone

## Tech Stack

- React Native + Expo (SDK 54)
- TypeScript
- Expo Router (file-based navigation)
- Zustand (state management)
- expo-sensors (accelerometer, barometer)
- react-native-reanimated (animations)
- react-native-svg (metro map)
- AsyncStorage (template persistence)
- OpenStreetMap Nominatim (free geocoding)
- Android target (RuStore + Google Play)

## Getting Started

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on your Android device.

## Metro Coverage

19 lines, 430 stations including:

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
| D1 | MCD-1 Belorussko-Savyolovskiy | 28 |
| D2 | MCD-2 Kursko-Rizhskiy | 38 |
| D3 | MCD-3 Leningradsko-Kazanskiy | 44 |
| D4 | MCD-4 Kiyevsko-Gorkovskiy | 39 |

## Links

- **Landing Page:** https://chesnotech.github.io/commutepilot
- **Author:** Ayoub Mohamed Samir ([@ChesnoTech](https://github.com/ChesnoTech))

## License

All rights reserved.
