# App Intent Firewall

An explainable AI security layer that connects permission requests with context, app history, behavior, and behavioral changes to determine whether an app's action makes sense.

Built for the iQOO smartphone security hackathon.

## Problem
Traditional permission models are static. Users grant a permission once, and the app can use it anytime. But a Calculator requesting microphone access is vastly different from a Camera app requesting microphone access while recording video.

## Solution
App Intent Firewall analyzes *why* an app wants a permission by looking at context, historical usage, current behavioral changes (e.g. sudden network spikes), and device evidence to provide a deterministic risk score and recommendation.

## Architecture

```
iQOO DEVICE
Android/System APIs
        ↓
Signal Collector
        ↓
Feature Engine
        ↓
Intent Engine
        ↓
Risk Engine
        ↓
Explanation Engine
        ↓
Action Engine
        ↓
User Interface
```

*The prototype demonstrates the core Risk Engine, Context Analysis, and Explanation Engine through a React dashboard connected to a Node.js backend using MongoDB to simulate app states.*

## Tech Stack
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017, without auth)

### Backend Setup
```bash
cd server
npm install
npm run seed
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Demo Instructions

1. Open the Dashboard.
2. Click **Safe Demo** to simulate a normal Camera app requesting camera access while taking a photo. It evaluates to LOW risk (ALLOW).
3. Click **Suspicious Demo** to simulate a Calculator app requesting microphone access while calculating, accompanied by background moving and network spiking events. It evaluates to CRITICAL risk (BLOCK) due to context mismatch and behavioral changes.

## Limitations & Future Integration
This is a web prototype that demonstrates the conceptual risk engine. It does not actively intercept Android permissions. Future integration with iQOO/Android system-level APIs would allow real-time interception, ML model deployment on-device for privacy, and actual system-level enforcement of the Block/Ask recommendations.
