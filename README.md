# Pravaha — AI-Driven Cash Flow Prediction & Risk Flagging System

> **NABARD Hackathon @ Global Fintech Fest 2026 Submission**
> 
> Pravaha (प्रवाह) is an intelligent, offline-first cash flow prediction, total obligation exposure, and explainable risk-flagging system designed specifically for rural micro-enterprises, SHGs, and agricultural producers in India.

---

## 🌟 Key Innovations

1. **Local-First & Offline Voice Entry**: Rural micro-enterprise owners can record voice notes in native regional languages (Hindi, Marathi, etc.) offline using Bhashini ASR. Entries are stored locally in Expo SQLite and batched-synced once reconnected.
2. **Cohort-Bootstrapped Forecasting Engine**: Hybrid forecasting using LightGBM + Prophet. For thin-data enterprises (<3 months history), the engine dynamically blends sector+district peer priors.
3. **Total Obligation Exposure Engine**: Detects over-leverage across both formal credit (KCC, Bank loans) and self-reported informal debt (moneylenders, feed supplier credit) to flag systemic risks before missed installments occur.
4. **Explainable AI Risk Radar**: Categorizes risk flags into `seasonal_normal`, `market_shock`, `climate_shock`, `personal_shock`, and `over_leverage`. Plain-language explanations are generated dynamically via Gemini 2.5 Flash / local Ollama fallback.
5. **Multilingual & Audio First**: Full Indian language translation and Text-to-Speech (TTS) audio explanation for low-literacy users.

---

## 🏗️ Monorepo Architecture

```
pravaha/
├── backend/          → FastAPI (Python 3.12) + Motor MongoDB Time Series + ML / AI Router
├── web/              → Next.js 16 (App Router) + Tailwind v4 + Recharts (Field Officer & HQ Console)
├── mobile/           → React Native + Expo (SDK 52) + NativeWind + Expo SQLite (Enterprise Owner App)
├── shared/           → Centralized Design Tokens (`design-tokens.json`) & TS Constants
└── context/          → Comprehensive project architecture & design rule documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v20+ & pnpm / npm
- Python 3.12+
- MongoDB instance (Local or MongoDB Atlas)
- Redis instance (optional for translation caching)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env

# Seed realistic demo data (Kamdhenu Dairy Farm & Nashik District)
python ../scripts/seed_demo_data.py

# Run development API server
uvicorn app.main:app --reload --port 8000
```
API Documentation: `http://localhost:8000/docs`

### 2. Web Console Setup
```bash
cd web
npm install
npm run dev
```
Open `http://localhost:3000` to access the Field Officer & HQ Risk Radar Console.

### 3. Mobile App Setup
```bash
cd mobile
npm install
npx expo start
```

---

## 🧪 Testing Suite

### Backend Integration & Structural Tests
```bash
cd backend
python -m pytest tests/ -v
```

---

## 📄 License & Attribution

Designed and developed by **Vitthal Gund** for the **NABARD Hackathon @ Global Fintech Fest 2026**.
