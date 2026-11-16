# PaaniLink — Water Tanker Booking & Dispatch Management System

A web-based water tanker booking and management system for a city water board.

## Tech Stack
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Mock Backend:** JSON Server (temporary — will be replaced with real backend)
- **Data Exchange:** Fetch API

## Project Roles
| Role | Description |
|------|-------------|
| Customer | Books water tankers, tracks deliveries |
| Zone Officer | Approves subsidised bookings, reviews disputes |
| Hydrant Operator | Assigns tankers, records filling, dispatches |
| Driver | Manages assigned delivery trips |
| Administrator | City-wide system management |

## How to Run

### Step 1: Install Node.js
Download from https://nodejs.org (LTS version)

### Step 2: Install JSON Server
Open terminal inside this folder and run:
```
npm install
```

### Step 3: Start the Mock API
```
npm start
```
The API will run at: http://127.0.0.1:3000

### Step 4: Open the App
Open `index.html` in your browser (use Live Server in VS Code for best results).

## Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@demo.com | demo1234 |
| Zone Officer | officer@demo.com | demo1234 |
| Hydrant Operator | operator@demo.com | demo1234 |
| Driver | driver@demo.com | demo1234 |
| Administrator | admin@demo.com | demo1234 |

## Project Structure
```
PaaniLink/
├── index.html              ← Login page
├── register.html           ← Customer registration
├── db.json                 ← JSON Server mock database
├── package.json            ← npm config
├── README.md
├── css/
│   └── style.css           ← Shared stylesheet
├── js/
│   ├── api.js              ← Centralized API helper functions
│   ├── auth.js             ← Authentication & session management
│   └── nav.js              ← Navigation & role-based menu
└── pages/
    ├── customer/
    │   └── dashboard.html
    ├── officer/
    │   └── dashboard.html
    ├── operator/
    │   └── dashboard.html
    ├── driver/
    │   └── dashboard.html
    └── admin/
        └── dashboard.html
```

## Sprint Progress
- [x] Sprint 1 — Foundation & Authentication
- [ ] Sprint 2 — Customer & Zone Officer Modules
- [ ] Sprint 3 — Hydrant Operator & Driver Modules
- [ ] Sprint 4 — Admin, Integration & Testing
