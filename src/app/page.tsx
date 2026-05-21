"use client";

import { useState, useRef, useCallback } from "react";

// --- Types ---
interface NutrientDetail {
  amount: number;
  unit: string;
  percentDV: number;
  status: "good" | "moderate" | "warning" | "danger";
}

interface NutritionResult {
  foodName: string;
  portion: string;
  calories: number;
  nutrients: {
    protein: NutrientDetail;
    fat: NutrientDetail;
    carbs: NutrientDetail;
    fiber: NutrientDetail;
    sugar: NutrientDetail;
    sodium: NutrientDetail;
    cholesterol: NutrientDetail;
    vitaminA: NutrientDetail;
    vitaminC: NutrientDetail;
    calcium: NutrientDetail;
    iron: NutrientDetail;
  };
  healthImpact: string[];
  warnings: string[];
  suggestions: string[];
  score: number;
}

// --- Components ---

function Header() {
  return (
    <header className="text-center pt-10 pb-6 px-4">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl shadow-lg">
          🥗
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
          MiMo NutriCoach
        </h1>
      </div>
      <p className="text-slate-400 text-lg max-w-xl mx-auto">
        Analisis nutrisi makanan Indonesia dengan AI. Upload foto atau ketik
        nama makanan, langsung dapat breakdown lengkap.
      </p>
      <div className="flex items-center justify-center gap-2 mt-3">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Powered by MiMo
        </span>
      </div>
    </header>
  );
}

function FoodInput({
  onAnalyze,
  loading,
}: {
  onAnalyze: (input: { type: "text" | "image"; value: string }) => void;
  loading: boolean;
}) {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [textInput, setTextInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleSubmit = () => {
    if (mode === "text" && textInput.trim()) {
      onAnalyze({ type: "text", value: textInput.trim() });
    } else if (mode === "image" && imageBase64) {
      onAnalyze({ type: "image", value: imageBase64 });
    }
  };

  const sampleFoods = [
    "Nasi goreng ayam 1 porsi",
    "Sate ayam 10 tusuk + lontong",
    "Rendang daging 1 porsi",
    "Gado-gado 1 piring",
    "Bakso 1 mangkuk",
    "Mie goreng telur",
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 mb-8">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("text")}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            mode === "text"
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600"
          }`}
        >
          ✏️ Ketik Makanan
        </button>
        <button
          onClick={() => setMode("image")}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            mode === "image"
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600"
          }`}
        >
          📷 Upload Foto
        </button>
      </div>

      {/* Text Input Mode */}
      {mode === "text" && (
        <div>
          <div className="relative">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Contoh: Nasi goreng ayam 1 porsi"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
              disabled={loading}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !textInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 hover:bg-green-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium px-5 py-2 rounded-lg transition-all"
            >
              Analisis
            </button>
          </div>

          {/* Sample Foods */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-slate-500 text-sm py-1">Coba:</span>
            {sampleFoods.map((food) => (
              <button
                key={food}
                onClick={() => setTextInput(food)}
                className="text-sm px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 hover:border-green-500/30 hover:text-green-400 transition-all"
                disabled={loading}
              >
                {food}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Upload Mode */}
      {mode === "image" && (
        <div>
          <div
            className={`drop-zone rounded-xl p-8 text-center cursor-pointer ${
              dragOver ? "drag-over" : ""
            }`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                    setImageBase64(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="py-8">
                <div className="text-5xl mb-3">📸</div>
                <p className="text-slate-400 text-lg mb-1">
                  Drop foto makanan di sini
                </p>
                <p className="text-slate-500 text-sm">
                  atau klik untuk pilih file
                </p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !imageBase64}
            className="w-full mt-3 bg-green-500 hover:bg-green-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium py-3 rounded-xl transition-all text-lg"
          >
            Analisis Foto
          </button>
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
        <div className="w-10 h-10 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Sedang menganalisis...
      </h3>
      <p className="text-slate-400">
        MiMo sedang mengidentifikasi makanan dan menghitung nutrisinya
      </p>
      <div className="flex justify-center gap-1 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    good: { bg: "bg-green-500/10", text: "text-green-400", label: "Baik" },
    moderate: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-400",
      label: "Sedang",
    },
    warning: {
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      label: "Perhatian",
    },
    danger: { bg: "bg-red-500/10", text: "text-red-400", label: "Tinggi" },
  };
  const c = config[status] || config.moderate;
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}

function NutritionBar({
  label,
  amount,
  unit,
  percentDV,
  status,
}: {
  label: string;
  amount: number;
  unit: string;
  percentDV: number;
  status: string;
}) {
  const barColor: Record<string, string> = {
    good: "bg-green-500",
    moderate: "bg-yellow-500",
    warning: "bg-orange-500",
    danger: "bg-red-500",
  };
  const clampedPercent = Math.min(percentDV, 100);

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-28 text-sm text-slate-300 shrink-0">{label}</div>
      <div className="flex-1">
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full nutrition-bar ${barColor[status] || "bg-blue-500"}`}
            style={{ width: `${clampedPercent}%` }}
          />
        </div>
      </div>
      <div className="w-20 text-right text-sm text-slate-300 shrink-0">
        {amount.toFixed(1)} {unit}
      </div>
      <div className="w-12 text-right shrink-0">
        <StatusBadge status={status} />
      </div>
    </div>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 75
      ? "#22c55e"
      : score >= 50
        ? "#eab308"
        : score >= 25
          ? "#f97316"
          : "#ef4444";
  const label =
    score >= 75
      ? "Sehat"
      : score >= 50
        ? "Cukup"
        : score >= 25
          ? "Perlu Perhatian"
          : "Kurang Baik";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#334155"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="nutrition-bar"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>
            {score}
          </span>
          <span className="text-xs text-slate-400">/ 100</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

function NutritionResult({ data }: { data: NutritionResult }) {
  const nutrientLabels: Record<string, string> = {
    protein: "Protein",
    fat: "Lemak",
    carbs: "Karbohidrat",
    fiber: "Serat",
    sugar: "Gula",
    sodium: "Natrium",
    cholesterol: "Kolesterol",
    vitaminA: "Vitamin A",
    vitaminC: "Vitamin C",
    calcium: "Kalsium",
    iron: "Zat Besi",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16">
      {/* Food Header */}
      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4 border border-slate-700/50">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{data.foodName}</h2>
            <p className="text-slate-400 mt-1">{data.portion}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-3xl font-bold text-green-400">
                {data.calories}
              </span>
              <span className="text-slate-400">kkal</span>
            </div>
          </div>
          <ScoreCircle score={data.score} />
        </div>
      </div>

      {/* Nutrients Grid */}
      <div className="bg-slate-800/50 rounded-2xl p-6 mb-4 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">
          📊 Breakdown Nutrisi
        </h3>
        <div className="divide-y divide-slate-700/50">
          {Object.entries(data.nutrients).map(([key, val]) => (
            <NutritionBar
              key={key}
              label={nutrientLabels[key] || key}
              amount={val.amount}
              unit={val.unit}
              percentDV={val.percentDV}
              status={val.status}
            />
          ))}
        </div>
      </div>

      {/* Health Impact */}
      {data.healthImpact.length > 0 && (
        <div className="bg-slate-800/50 rounded-2xl p-6 mb-4 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-3">
            💚 Dampak Kesehatan
          </h3>
          <ul className="space-y-2">
            {data.healthImpact.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {data.warnings.length > 0 && (
        <div className="bg-red-500/5 rounded-2xl p-6 mb-4 border border-red-500/20">
          <h3 className="text-lg font-semibold text-red-400 mb-3">
            ⚠️ Peringatan
          </h3>
          <ul className="space-y-2">
            {data.warnings.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-red-300">
                <span className="text-red-400 mt-0.5">!</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {data.suggestions.length > 0 && (
        <div className="bg-blue-500/5 rounded-2xl p-6 border border-blue-500/20">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">
            💡 Saran dari NutriCoach
          </h3>
          <ul className="space-y-2">
            {data.suggestions.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300">
                <span className="text-blue-400 mt-0.5">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// --- Main Page ---
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (input: {
    type: "text" | "image";
    value: string;
  }) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menganalisis");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-20">
      <Header />

      {error && (
        <div className="max-w-2xl mx-auto px-4 mb-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3 text-red-400">
            {error}
          </div>
        </div>
      )}

      <FoodInput onAnalyze={handleAnalyze} loading={loading} />

      {loading && <LoadingState />}
      {result && !loading && <NutritionResult data={result} />}

      {/* Footer */}
      {!result && !loading && (
        <div className="text-center text-slate-600 text-sm mt-16">
          <p>MiMo NutriCoach — Powered by MiMo AI</p>
          <p className="mt-1">Fokus makanan Indonesia 🇮🇩</p>
        </div>
      )}
    </main>
  );
}
