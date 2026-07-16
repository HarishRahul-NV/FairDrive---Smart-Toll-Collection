<div align="center">

# 🛣️ FairDrive V2.0

### Distance-Based Highway Tolling System for Tamil Nadu

*Pay only for the distance you drive — not a rupee more.*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)

</div>

---

## 📋 Overview

**FairDrive** is a modern, distance-based highway tolling system designed for Tamil Nadu's National Highways. Instead of flat-rate tolls at toll plazas, FairDrive calculates charges based on the **actual distance** a vehicle travels using real-time GPS tracking — saving commuters up to **40%** on toll costs.

The system consists of a **React + TypeScript** web application for the user-facing dashboard and a **FastAPI (Python)** backend that handles live GPS data streaming via WebSockets.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Distance-Based Tolling** | Pay per kilometer (₹1.70/km for cars) instead of flat toll rates |
| **Real-Time GPS Tracking** | Live NMEA data stream via WebSocket with turn detection |
| **Digital Wallet** | Top-up via UPI or card, auto-recharge, full transaction history |
| **Vehicle Management** | Register multiple vehicles with TN-format validation |
| **User Dashboard** | Trip summaries, savings tracker, notifications |
| **Secure Auth** | Registration with Aadhaar & license verification, protected routes |
| **Responsive UI** | Mobile-friendly design with custom highway-themed design system |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — Component-based UI
- **TypeScript** — Type-safe development
- **Vite** — Fast dev server and build tool
- **Tailwind CSS** — Utility-first styling with custom design tokens
- **shadcn/ui** — Radix-based accessible component library
- **React Router v6** — Client-side routing with protected routes
- **Recharts** — Data visualization
- **Lucide React** — Icon system

### Backend
- **FastAPI** — High-performance Python API framework
- **WebSocket** — Real-time GPS data streaming
- **pynmea2** — NMEA sentence parsing (GPS data)
- **geopy** — Geodesic distance calculations
- **Socket** — TCP connection to GPS hardware

---

## 📁 Project Structure

```
FairDriveV2.0-main/
├── public/
│   ├── highway.png            # Favicon
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── hero-highway.jpg   # Hero section background
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Footer.tsx     # Site footer
│   │   │   ├── Layout.tsx     # Root layout (Navbar + Footer)
│   │   │   └── Navbar.tsx     # Navigation bar
│   │   └── ui/                # shadcn/ui components
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication state management
│   ├── hooks/
│   │   ├── use-mobile.tsx     # Mobile breakpoint detection
│   │   └── use-toast.ts      # Toast notification hook
│   ├── lib/
│   │   └── utils.ts           # Utility functions (cn)
│   ├── pages/
│   │   ├── Home.tsx           # Landing page
│   │   ├── Login.tsx          # User login
│   │   ├── Register.tsx       # User registration
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── Vehicles.tsx       # Vehicle management
│   │   ├── Tracking.tsx       # GPS tracking interface
│   │   ├── Wallet.tsx         # Wallet & payments
│   │   ├── Profile.tsx        # Profile & settings
│   │   └── NotFound.tsx       # 404 page
│   ├── server/
│   │   ├── main.py            # FastAPI application entry
│   │   └── gps_stream.py      # WebSocket GPS data handler
│   ├── App.tsx                # Root component with routing
│   ├── main.tsx               # Application entry point
│   └── index.css              # Design system & global styles
├── index.html                 # HTML entry point with SEO meta tags
├── tailwind.config.ts         # Tailwind configuration
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 and **npm** (or Bun)
- **Python** ≥ 3.9 (for the GPS backend)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/FairDriveV2.0.git
cd FairDriveV2.0
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start the Frontend Dev Server

```bash
npm run dev
```

The app will be available at **http://localhost:8080**.

### 4. (Optional) Start the GPS Backend

If you have a GPS device streaming NMEA data:

```bash
# Install Python dependencies
pip install fastapi uvicorn pynmea2 geopy websockets

# Start the FastAPI server
cd src/server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

> **Note:** Update the `HOST` and `PORT` variables in `gps_stream.py` to match your GPS device's IP address.

---

## 📖 Usage

1. **Register** — Create an account with your name, Aadhaar ID, license, and contact details.
2. **Add Vehicles** — Register your vehicles with TN-format registration numbers.
3. **Start a Trip** — Go to GPS Tracking and click "Start Tracking" to begin a trip.
4. **Automatic Toll** — The system calculates toll based on actual distance traveled (₹1.70/km).
5. **Turn Detection** — When a turn >45° is detected, the trip ends automatically.
6. **Wallet** — Top up your wallet via UPI or card for automatic toll deductions.

---

## ⚙️ Configuration

### GPS Device
Update `src/server/gps_stream.py` to configure:
- `HOST` — IP address of your GPS-streaming device
- `PORT` — TCP port (default: 8080)
- `MIN_STEP` — Minimum movement threshold (default: 0.05m)
- `TURN_THRESHOLD` — Angle change to detect turns (default: 45°)

### Toll Rates
Current rate: **₹1.70/km** for cars. Modify `calculate_car_toll()` in `gps_stream.py` to adjust.

### Frontend
- Dev server port: Configured in `vite.config.ts` (default: 8080)
- Design tokens: Defined in `src/index.css` (CSS custom properties)

---

## 🧪 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                   Browser                    │
│  ┌─────────────────────────────────────────┐ │
│  │  React App (Vite + TypeScript)          │ │
│  │  ┌───────┐ ┌──────┐ ┌────────────────┐ │ │
│  │  │ Auth  │ │Router│ │  Pages         │ │ │
│  │  │Context│ │Guard │ │  Dashboard     │ │ │
│  │  └───────┘ └──────┘ │  Tracking      │ │ │
│  │                     │  Vehicles      │ │ │
│  │  ┌────────────────┐ │  Wallet        │ │ │
│  │  │  shadcn/ui     │ │  Profile       │ │ │
│  │  │  Components    │ └────────────────┘ │ │
│  │  └────────────────┘                    │ │
│  └────────────────┬────────────────────────┘ │
│                   │ WebSocket                │
└───────────────────┼──────────────────────────┘
                    │
┌───────────────────┼──────────────────────────┐
│  FastAPI Backend   │                          │
│  ┌────────────────┴────────────────────────┐ │
│  │  /ws/gps  WebSocket Endpoint            │ │
│  │  ┌──────────┐  ┌───────────┐            │ │
│  │  │  NMEA    │  │  Distance │            │ │
│  │  │  Parser  │→ │  Calc     │→ Toll ₹   │ │
│  │  │ (pynmea2)│  │  (geopy)  │            │ │
│  │  └──────────┘  └───────────┘            │ │
│  └─────────────────────────────────────────┘ │
│                   ↑ TCP Socket               │
│          GPS Device (NMEA stream)            │
└──────────────────────────────────────────────┘
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built for Tamil Nadu Highways** 🇮🇳

Made with React + Vite + FastAPI

</div>
#   F a i r D r i v e - - - S m a r t - T o l l - C o l l e c t i o n  
 