# CLAUDE.md — CommutePilot Project Context
# This file gives Claude Code all the context it needs to work on this project.
# Place this in the root of C:\Users\ChesnoTechAdmin\Projects\CommutePilot\

---

## FOUNDER
- **Name:** Ayoub Mohamed Samir
- **Location:** Moscow, Russia (Egyptian national)
- **Email:** 7agtyadmin@gmail.com
- **GitHub:** ChesnoTech
- **Portfolio:** https://chesnotech.github.io
- **Landing Page:** https://chesnotech.github.io/commutepilot
- **Background:** Self-taught technologist, 20+ years experience, product thinker (not traditional coder). Uses Claude Code + AI as primary development tools.
- **Pattern:** Arrive → Observe → Reimagine → Build (verified across every job in career)

---

## WHAT IS COMMUTEPILOT?

A commute autopilot app. User sets multi-leg journey templates (train→bus→taxi→walk), the app runs the journey automatically every day. User can sleep on transit and wake up before their stop. Food is pre-ordered and timed to arrival. Taxi is pre-booked. Groceries collected on the route home. Zero mental effort.

**One sentence:** "Set your commute once. Sleep on the metro. Wake up at your stop. Coffee ordered. Taxi booked. Every single day."

---

## MVP SPECIFICATION — MOSCOW METRO ALARM

### Target Platform
- Android (React Native + Expo)
- Must work on RuStore (Russian app store, free to publish) + Google Play ($25)

### Core Problem
- Moscow Metro has 263 stations, deep underground
- GPS does NOT work underground
- Every existing alarm app fails in the metro
- Millions of commuters have NO way to set a reliable "wake me at my station" alarm

### MVP Features (ONLY THESE — nothing more)

1. **Station Selector**
   - User selects: Metro line → Departure station → Destination station
   - All 263 stations, all lines, in Russian + English
   - Save as template ("Morning commute", "Evening commute")

2. **Underground Alarm (Sensor Fusion)**
   - Station counting via accelerometer (detect train deceleration = arriving at station)
   - WiFi SSID changes between stations (each station has different WiFi)
   - Backup: manual station count button (user taps each station)
   - Works 100% OFFLINE — no internet required

3. **Progressive Alarm**
   - 2 stations before destination: gentle vibration
   - 1 station before: vibration + soft sound
   - At destination: full alarm (sound + vibration + screen flash)
   - User can configure intensity and advance warning

4. **Multi-Leg Journey Templates**
   - Template: Metro Line 1 → Walk 5 min → Bus 42 → Walk 3 min → Home
   - Save multiple templates
   - One-tap activation: "Start morning commute"

### What is NOT in the MVP
- No food ordering
- No taxi booking
- No delivery
- No maps
- No social features
- No payment
- No driver tracking
- No route optimization
- Just: alarm + station counting + templates

### Technical Approach

**Station Detection (Priority Order):**
1. Accelerometer: detect deceleration pattern (train slowing = approaching station)
2. WiFi scanning: SSID changes between stations
3. Barometer: pressure changes entering/exiting tunnels
4. Time-based estimation: average time between stations per line
5. Manual fallback: user taps "arrived at station" button

**Station Database:**
- JSON file with all Moscow Metro data
- Lines (number, name, color)
- Stations (name_ru, name_en, line_id, order, transfer_lines[])
- Average time between each pair of adjacent stations

**Offline First:**
- All station data embedded in app
- All detection algorithms run on-device
- No server required for core functionality
- Privacy: zero data leaves the phone

---

## FULL PRODUCT VISION (for reference — NOT for MVP)

The full CommutePilot has these novel concepts that no competitor has:

### Novel Innovation #1: 7-Signal Sensor Fusion Alarm
GPS + WiFi + BLE + Cell + Accelerometer + Barometer + Audio fingerprint. When GPS fails underground, 6 other signals maintain position awareness.

### Novel Innovation #2: "Deliver to My Future Self"
User's predicted location becomes a dynamic delivery address. Order coffee, food, pharmacy, parcels — delivered to where user WILL BE, not where they are now.

### Novel Innovation #3: Invisible Transit Mapping
Auto-discovers unofficial bus stops from sensor deceleration patterns. Names stops using conductor voice extraction (on-device, privacy-safe). Creates first-ever digital map of informal transit.

### Novel Innovation #4: Universal Surface Intelligence
Lane-level road quality mapping for cars, bikes, scooters, pedestrians, wheelchairs. Crowdsourced from phone sensors.

### Novel Innovation #5: Delay Cascade Engine
One change (metro delayed 3 min) triggers instant recalculation of ALL downstream elements: bus connection, taxi booking, food order timing, arrival time.

### Novel Innovation #6: Fresh Food Fire-Time Protocol
Order PENDING on boarding, FIRE signal sent at exact calculated time so food is hot when user arrives.

### Personas
- Sara (28, night nurse): safety routing, live tracking, panic button
- Ahmed (45, diabetic): toilet-aware routing, within 5 min of facilities
- Lena (34, working mother): kids tracking, grocery pickup timed to commute
- Thomas (67, wheelchair): elevator-only routing, accessibility alerts

### Monetization (full vision)
- Commerce commissions 28%, Employer plans 27%, Transport fees 18%
- User cost: $0-3/month. User saves: $30-80/month.

---

## MARKET

- $533B MaaS market (2025) → $2.5T (2034), 18.7% CAGR
- 3 billion daily commuters globally
- Moscow Metro: 2.5 billion rides/year, 263 stations

---

## PROJECT STRUCTURE

```
CommutePilot/
├── CLAUDE.md              ← THIS FILE (project context)
├── README.md              (project overview)
├── docs/
│   ├── MVP_SPEC.md        (MVP specification - extracted from above)
│   ├── FEATURES.md        (full feature list)
│   └── FUNDRAISING.md     (investor materials tracker)
├── landing/               (landing page - synced with GitHub Pages)
│   └── index.html
├── app/                   (React Native + Expo app)
│   ├── package.json
│   ├── App.js
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   │   ├── StationDetector.js    (accelerometer logic)
│   │   │   ├── AlarmManager.js       (progressive alarm)
│   │   │   └── JourneyManager.js     (templates)
│   │   └── data/
│   │       └── moscow_metro.json     (station database)
│   └── assets/
└── data/
    └── moscow_metro.json  (source station data)
```

---

## DEVELOPMENT PRIORITIES

### Phase 1: Foundation (Week 1)
- [ ] Project setup (React Native + Expo)
- [ ] Moscow Metro station database (all lines, all stations, JSON)
- [ ] Basic UI: line selector → station selector
- [ ] Accelerometer data capture prototype

### Phase 2: Core Logic (Week 2-3)
- [ ] Station counting algorithm (deceleration detection)
- [ ] WiFi SSID change detection
- [ ] Progressive alarm system (vibrate → sound → full)
- [ ] Journey template save/load

### Phase 3: Polish (Week 4)
- [ ] Template management UI
- [ ] Settings (alarm intensity, advance warning stations)
- [ ] Offline validation
- [ ] Russian localization
- [ ] App icon and branding

### Phase 4: Launch
- [ ] Build APK
- [ ] Publish to RuStore (free)
- [ ] Publish to Google Play ($25)
- [ ] Share with waitlist subscribers

---

## EXISTING MATERIALS

- **Pitch Deck:** Created (PPTX + PDF) — 13 slides, dark navy/teal/orange
- **One-Pager:** Created (DOCX + PDF) — professional investor format
- **Landing Page:** LIVE at chesnotech.github.io/commutepilot
- **Interactive Resume:** LIVE at chesnotech.github.io

---

## CONSTRAINTS & RULES

- Do NOT use the name "osTicket" anywhere — refer to it as "IT support ticketing system repurposed for order tracking"
- Do NOT mention "v2.0" for the OEM Activation System
- Do NOT mention CSV or SSH in relation to any of Ayoub's systems
- Do NOT put specific feature count numbers (like "124 features") — use "multiple novel concepts" instead
- The company Roo24 should be referred to anonymously as "#1 PC Brand on Wildberries.ru (2025)"
- Ayoub's emails: 7agtyadmin@gmail.com (international), ayoubmoham@yandex.ru (Russian market)

---

## TECH STACK DECISIONS

- **Mobile:** React Native + Expo (cross-platform, Ayoub's first mobile app)
- **Language:** JavaScript/TypeScript
- **Database:** SQLite (offline station data) or AsyncStorage
- **Sensors:** expo-sensors (accelerometer, barometer)
- **Notifications:** expo-notifications (alarm)
- **State:** React Context or Zustand (simple)
- **No backend needed for MVP** — everything on-device

---

## HOW TO WORK WITH AYOUB

- He's a product thinker, not a traditional coder
- He understands systems, architecture, and logic deeply
- He uses Claude Code as his primary development tool
- Explain technical decisions clearly
- Build incrementally — show working results at each step
- Test on his physical Android device (not just emulator)
- Keep it simple — MVP means MINIMUM features that prove the concept
