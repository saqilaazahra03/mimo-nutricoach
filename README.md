# 🥗 MiMo NutriCoach

**AI-Powered Indonesian Food Nutrition Analyzer — Powered by MiMo**

[![Powered by MiMo](https://img.shields.io/badge/Powered%20by-MiMo-blue)](https://mimo.xiaomi.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🎯 Overview

**MiMo NutriCoach** is an AI-powered web application that analyzes the nutritional content of Indonesian food. Upload a photo of your meal or type a food description, and NutriCoach provides a complete nutritional breakdown, health impact analysis, and personalized recommendations — all powered by Xiaomi's MiMo AI model.

### The Problem

Indonesia has over 5,000 traditional dishes, yet most people have no idea what's actually in their food. Existing nutrition apps focus on Western cuisine, lack Indonesian food databases, and provide no contextual health guidance. People with dietary restrictions (diabetes, hypertension, high cholesterol) are left guessing.

### The Solution

MiMo NutriCoach uses a multi-agent AI system powered by MiMo to:

- **Identify** Indonesian food from photos or text descriptions
- **Calculate** precise nutritional content per portion
- **Analyze** health impact based on individual nutrients
- **Recommend** healthier alternatives and portion adjustments

---

## ✨ Features

### 📷 Photo Analysis
Upload a photo of any Indonesian dish — MiMo identifies the food, estimates portions, and delivers a full nutritional report.

### ✏️ Text-Based Analysis
Type something like "Sate ayam 10 tusuk + lontong" and get instant results. Supports casual Indonesian food descriptions.

### 📊 Complete Nutrient Breakdown
- Calories, Protein, Fat, Carbohydrates
- Fiber, Sugar, Sodium, Cholesterol
- Vitamin A, Vitamin C, Calcium, Iron
- Per-nutrient status indicator (Good / Moderate / Warning / High)

### 💚 Health Impact Analysis
- Positive health effects of the meal
- Warnings for concerning nutrient levels
- Personalized suggestions for healthier alternatives

### 🎯 Health Score
A 0–100 overall health score based on nutritional balance, giving users an at-a-glance assessment.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│              Next.js Frontend                │
│                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────┐ │
│  │   Photo    │  │    Text    │  │ Result │ │
│  │   Upload   │  │   Input    │  │Display │ │
│  └─────┬──────┘  └─────┬──────┘  └───┬────┘ │
│        │               │              │      │
│        └───────────────┼──────────────┘      │
│                        │                     │
│                ┌───────▼────────┐            │
│                │  /api/analyze  │            │
│                └───────┬────────┘            │
└────────────────────────┼─────────────────────┘
                         │
                ┌────────▼────────┐
                │   MiMo Model    │
                │  (mimo-v2-pro)  │
                │   via 9Router   │
                └─────────────────┘
```

### Multi-Agent Pipeline

The `/api/analyze` endpoint orchestrates a single MiMo call with a structured prompt that handles:

1. **Food Identification** — Recognize the dish from photo or text, map to Indonesian food database
2. **Nutrient Calculation** — Compute per-nutrient values based on portion size
3. **Health Assessment** — Evaluate each nutrient against daily value benchmarks
4. **Recommendation Generation** — Produce actionable health suggestions

---

## 🚀 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 16 + React 19 | App Router, SSR, API routes |
| Styling | Tailwind CSS v4 | Utility-first responsive design |
| Language | TypeScript 5 | Type safety across the stack |
| AI Engine | MiMo v2 Pro | Food analysis and reasoning |
| Gateway | 9Router | MiMo API gateway |

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/saqilaazahra03/mimo-nutricoach.git
cd mimo-nutricoach

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your MiMo API configuration

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MIMO_API_URL` | MiMo API endpoint | `https://token-plan-sgp.xiaomimimo.com/v1` |
| `MIMO_API_KEY` | API key (if required) | — |

---

## 📸 How It Works

1. **Choose input mode** — Type a food description or upload a photo
2. **Submit** — The request is sent to the MiMo-powered API
3. **Get results** — View nutrient breakdown, health score, warnings, and suggestions

### Example Input
```
Sate ayam 10 tusuk + lontong + bumbu kacang
```

### Example Output
- **Food**: Sate Ayam with Lontong
- **Calories**: 485 kcal
- **Health Score**: 62/100
- **Highlights**: High protein (32g), elevated sodium (890mg), good iron content
- **Warning**: Bumbu kacang adds significant fat and sodium
- **Suggestion**: Request less bumbu kacang, add fresh vegetables

---

## 🤖 Powered by MiMo

MiMo NutriCoach is built on **MiMo v2 Pro**, Xiaomi's advanced reasoning model. MiMo handles:

- **Vision-based food recognition** from uploaded photos
- **Nutritional estimation** based on Indonesian food knowledge
- **Health reasoning** to contextualize nutrient data
- **Natural language generation** for clear, actionable advice

---

## 🌏 Why Indonesian Food?

Indonesia is the world's 4th most populous country with one of the most diverse culinary traditions — yet digital nutrition tools barely cover local dishes. MiMo NutriCoach fills this gap by combining MiMo's reasoning capabilities with deep knowledge of Indonesian cuisine.

---

## 📄 License

MIT
