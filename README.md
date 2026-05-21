# 🥗 MiMo NutriCoach

**AI-Powered Indonesian Food Nutrition Analyzer — Powered by MiMo**

[![Powered by MiMo](https://img.shields.io/badge/Powered%20by-MiMo-blue)](https://mimo.xiaomi.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🎯 Overview

**MiMo NutriCoach** adalah aplikasi web yang menggunakan AI untuk menganalisis nutrisi makanan Indonesia. Cukup upload foto makanan atau ketik nama makanan, NutriCoach akan memberikan breakdown nutrisi lengkap, dampak kesehatan, dan rekomendasi personal.

---

## ✨ Fitur

### 📷 Analisis dari Foto
Upload foto makanan — AI akan mengidentifikasi jenis makanan, menghitung porsi, dan memberikan analisis nutrisi lengkap.

### ✏️ Analisis dari Deskripsi
Ketik nama makanan seperti "Sate ayam 10 tusuk + lontong" — langsung dapat data nutrisi.

### 📊 Breakdown Nutrisi Lengkap
- Kalori, Protein, Lemak, Karbohidrat
- Serat, Gula, Natrium, Kolesterol
- Vitamin A, Vitamin C, Kalsium, Zat Besi
- Status per nutrisi (Baik/Sedang/Perhatian/Tinggi)

### 💚 Analisis Dampak Kesehatan
- Dampak positif makanan terhadap kesehatan
- Peringatan untuk kandungan yang perlu diwaspadai
- Saran perbaikan dan alternatif lebih sehat

### 🎯 Health Score
Skor kesehatan 0-100 berdasarkan keseimbangan nutrisi keseluruhan.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────┐
│          Next.js Frontend            │
│  ┌────────┐  ┌────────┐  ┌───────┐ │
│  │ Photo  │  │  Text  │  │Result │ │
│  │Upload  │  │ Input  │  │Display│ │
│  └───┬────┘  └───┬────┘  └───┬───┘ │
│      │           │           │      │
│      └───────────┼───────────┘      │
│                  │                   │
│          ┌───────▼────────┐         │
│          │  /api/analyze  │         │
│          └───────┬────────┘         │
└──────────────────┼──────────────────┘
                   │
          ┌────────▼────────┐
          │   MiMo Model    │
          │  (mimo-v2-pro)  │
          │   via 9Router   │
          └─────────────────┘
```

---

## 🚀 Tech Stack

- **Next.js 16** — React framework with App Router
- **TypeScript** — type-safe development
- **Tailwind CSS v4** — utility-first styling
- **MiMo Model** — `mimo-v2-pro` via 9Router gateway

---

## 📦 Installation

```bash
# Clone
git clone https://github.com/zolakripto02/mimo-nutricoach.git
cd mimo-nutricoach

# Install
npm install

# Environment
cp .env.local.example .env.local
# Edit .env.local dengan MiMo API URL

# Dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MIMO_API_URL` | 9Router gateway URL | `http://150.109.4.149:20128` |
| `MIMO_API_KEY` | API key (jika diperlukan) | - |

---

## 📸 Demo

1. **Ketik makanan**: Masukkan "Nasi goreng ayam 1 porsi"
2. **Upload foto**: Foto makanan Indonesia → analisis otomatis
3. **Lihat hasil**: Breakdown nutrisi, health score, saran

---

## 🤖 Powered by MiMo

MiMo NutriCoach menggunakan **MiMo v2 Pro** dari Xiaomi sebagai AI engine utama. MiMo bertugas:
- Mengidentifikasi makanan dari foto atau deskripsi
- Menghitung kandungan nutrisi per porsi
- Menganalisis dampak kesehatan
- Memberikan rekomendasi personal

---

## 📄 License

MIT
