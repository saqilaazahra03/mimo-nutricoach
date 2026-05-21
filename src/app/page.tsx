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

// --- Icons (inline SVG) ---
function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 1 8-1 3.5-3.5 5.5-6.5 7" />
      <path d="M11.7 13.5c-2-2.5-4.5-3.5-6-3.5 0 3 1 6.5 4 8.5 1.5 1 3.5 1.5 5.5 1" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function TypeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L14 9L21 9L15.5 13.5L17.5 21L12 16.5L6.5 21L8.5 13.5L3 9L10 9Z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// --- Header ---
function Header() {
  return (
    <header className="text-center pt-16 pb-10 px-4">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
        <SparkleIcon className="w-3.5 h-3.5" />
        Powered by MiMo AI
      </div>
      <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
        MiMo{" "}
        <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
          NutriCoach
        </span>
      </h1>
      <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
        AI nutrition analyzer for Indonesian food. Upload a photo or type a meal — get instant health insights.
      </p>
      <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Photo Analysis
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
          Health Score
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          Smart Suggestions
        </div>
      </div>
    </header>
  );
}

// --- Input Section ---
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
    <div className="max-w-2xl mx-auto px-4 mb-12">
      {/* Mode Toggle */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setMode("text")}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-medium transition-all duration-300 ${
            mode === "text"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-lg shadow-emerald-500/5"
              : "glass-light text-slate-400 hover:text-slate-300 hover:border-slate-600/50"
          }`}
          disabled={loading}
        >
          <TypeIcon className="w-4 h-4" />
          Type Food
        </button>
        <button
          onClick={() => setMode("image")}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-medium transition-all duration-300 ${
            mode === "image"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-lg shadow-emerald-500/5"
              : "glass-light text-slate-400 hover:text-slate-300 hover:border-slate-600/50"
          }`}
          disabled={loading}
        >
          <CameraIcon className="w-4 h-4" />
          Upload Photo
        </button>
      </div>

      {/* Text Input */}
      {mode === "text" && (
        <div className="fade-up">
          <div className="relative group">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="e.g., Nasi goreng ayam 1 porsi"
              className="w-full glass rounded-2xl px-5 py-4 pr-28 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              disabled={loading}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !textInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700/50 disabled:text-slate-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              Analyze
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Sample Chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {sampleFoods.map((food) => (
              <button
                key={food}
                onClick={() => setTextInput(food)}
                className="chip text-sm px-4 py-2 rounded-xl bg-slate-800/60 text-slate-400 border border-slate-700/50 transition-all"
                disabled={loading}
              >
                {food}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Upload */}
      {mode === "image" && (
        <div className="fade-up">
          <div
            className={`drop-zone rounded-2xl p-10 text-center cursor-pointer ${dragOver ? "drag-over" : ""}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-56 mx-auto rounded-xl shadow-2xl"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                    setImageBase64(null);
                  }}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-red-500/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="py-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/80 flex items-center justify-center">
                  <UploadIcon className="w-7 h-7 text-slate-500" />
                </div>
                <p className="text-slate-300 text-lg font-medium mb-1">
                  Drop your food photo here
                </p>
                <p className="text-slate-500 text-sm">
                  or click to browse — JPG, PNG, WebP
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
            className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700/50 disabled:text-slate-500 text-white font-semibold py-4 rounded-2xl transition-all text-lg flex items-center justify-center gap-2"
          >
            <CameraIcon className="w-5 h-5" />
            Analyze Photo
          </button>
        </div>
      )}
    </div>
  );
}

// --- Loading ---
function LoadingState() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center fade-up">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 mb-8 shimmer">
        <LeafIcon className="w-10 h-10 text-emerald-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Analyzing your food...
      </h3>
      <p className="text-slate-400 max-w-sm mx-auto">
        MiMo is identifying ingredients and calculating nutritional content
      </p>
      <div className="flex justify-center gap-1.5 mt-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-emerald-500/60"
            style={{
              animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// --- Score Ring ---
function ScoreCircle({ score }: { score: number }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 75 ? "#10b981" : score >= 50 ? "#eab308" : score >= 25 ? "#f97316" : "#ef4444";
  const label =
    score >= 75 ? "Healthy" : score >= 50 ? "Moderate" : score >= 25 ? "Caution" : "Unhealthy";
  const bg =
    score >= 75 ? "rgba(16,185,129,0.1)" : score >= 50 ? "rgba(234,179,8,0.1)" : score >= 25 ? "rgba(249,115,22,0.1)" : "rgba(239,68,68,0.1)";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <div className="absolute inset-0 rounded-full" style={{ background: bg }} />
        <svg className="w-full h-full -rotate-90 relative" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="score-ring"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{score}</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{label}</span>
        </div>
      </div>
    </div>
  );
}

// --- Nutrient Row ---
function NutrientRow({
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
  const clampedPercent = Math.min(percentDV, 100);
  const statusLabel = { good: "Good", moderate: "Fair", warning: "Watch", danger: "High" }[status] || "Fair";
  const pillClass = `pill-${status}`;

  return (
    <div className="flex items-center gap-4 py-3 group">
      <div className="w-24 text-sm text-slate-400 shrink-0 group-hover:text-slate-300 transition-colors">{label}</div>
      <div className="flex-1">
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bar-${status} nutrition-bar`}
            style={{ "--bar-width": `${clampedPercent}%` } as React.CSSProperties}
          />
        </div>
      </div>
      <div className="w-20 text-right text-sm font-medium text-slate-300 shrink-0 tabular-nums">
        {amount % 1 === 0 ? amount : amount.toFixed(1)}
        <span className="text-slate-500 ml-1 text-xs">{unit}</span>
      </div>
      <div className={`w-14 text-center shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${pillClass}`}>
        {statusLabel}
      </div>
    </div>
  );
}

// --- Result ---
function NutritionResult({ data }: { data: NutritionResult }) {
  const nutrientLabels: Record<string, string> = {
    protein: "Protein",
    fat: "Fat",
    carbs: "Carbs",
    fiber: "Fiber",
    sugar: "Sugar",
    sodium: "Sodium",
    cholesterol: "Cholesterol",
    vitaminA: "Vitamin A",
    vitaminC: "Vitamin C",
    calcium: "Calcium",
    iron: "Iron",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20">
      {/* Hero Card */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-4 fade-up fade-up-1">
        <div className="flex items-start justify-between flex-wrap gap-6">
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Analysis Result</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{data.foodName}</h2>
            <p className="text-slate-400 mt-1">{data.portion}</p>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-bold text-white">{data.calories}</span>
              <span className="text-slate-500 text-lg">kcal</span>
            </div>
          </div>
          <ScoreCircle score={data.score} />
        </div>
      </div>

      {/* Nutrients */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-4 fade-up fade-up-2">
        <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <LeafIcon className="w-4 h-4 text-emerald-400" />
          </div>
          Nutrient Breakdown
        </h3>
        <div className="divide-y divide-slate-800/50">
          {Object.entries(data.nutrients).map(([key, val]) => (
            <NutrientRow
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
        <div className="glass rounded-3xl p-6 sm:p-8 mb-4 fade-up fade-up-3">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckIcon className="w-4 h-4 text-emerald-400" />
            </div>
            Health Benefits
          </h3>
          <ul className="space-y-3">
            {data.healthImpact.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                <CheckIcon className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {data.warnings.length > 0 && (
        <div className="rounded-3xl p-6 sm:p-8 mb-4 fade-up fade-up-3" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)" }}>
          <h3 className="text-base font-semibold text-red-400 mb-4 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertIcon className="w-4 h-4 text-red-400" />
            </div>
            Warnings
          </h3>
          <ul className="space-y-3">
            {data.warnings.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-red-300/90 text-sm">
                <AlertIcon className="w-4 h-4 text-red-400/60 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {data.suggestions.length > 0 && (
        <div className="rounded-3xl p-6 sm:p-8 fade-up fade-up-4" style={{ background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.1)" }}>
          <h3 className="text-base font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <LightbulbIcon className="w-4 h-4 text-blue-400" />
            </div>
            Suggestions
          </h3>
          <ul className="space-y-3">
            {data.suggestions.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                <ArrowRightIcon className="w-4 h-4 text-blue-400/60 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// --- Main ---
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (input: { type: "text" | "image"; value: string }) => {
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
        throw new Error(err.error || "Analysis failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-mesh min-h-screen">
      <Header />

      {error && (
        <div className="max-w-2xl mx-auto px-4 mb-6 fade-up">
          <div className="rounded-2xl px-5 py-4 flex items-center gap-3" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <AlertIcon className="w-5 h-5 text-red-400 shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        </div>
      )}

      <FoodInput onAnalyze={handleAnalyze} loading={loading} />

      {loading && <LoadingState />}
      {result && !loading && <NutritionResult data={result} />}

      {/* Footer */}
      {!result && !loading && (
        <footer className="text-center text-slate-600 text-sm pb-12 mt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <LeafIcon className="w-4 h-4 text-emerald-500/40" />
            <span>MiMo NutriCoach</span>
          </div>
          <p>Focused on Indonesian cuisine</p>
        </footer>
      )}
    </main>
  );
}
