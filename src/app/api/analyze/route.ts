import { NextRequest, NextResponse } from "next/server";

const MIMO_API_URL = process.env.MIMO_API_URL || "https://token-plan-sgp.xiaomimimo.com";
const MIMO_API_KEY = process.env.MIMO_API_KEY || "tp-so6nn344p56bocr3gx2j3zz7we3iwycd6sdw5js5ym2jy3yi";

const SYSTEM_PROMPT = `Kamu adalah MiMo NutriCoach, ahli nutrisi makanan Indonesia. Tugasmu: analisis makanan dan berikan data nutrisi lengkap dalam format JSON.

ATURAN PENTING:
1. Fokus pada makanan Indonesia
2. Gunakan data nutrisi yang akurat berdasarkan porsi standar Indonesia
3. Semua satuan dalam gram (g) atau miligram (mg)
4. percentDV = persentase kebutuhan harian (Daily Value)
5. Status: "good" (0-25% DV), "moderate" (26-50%), "warning" (51-75%), "danger" (>75%)
6. Skor kesehatan 0-100 berdasarkan keseimbangan nutrisi
7. Berikan healthImpact (positif), warnings (negatif), dan saran

RESPONSE FORMAT (JSON only, no markdown):
{
  "foodName": "Nama makanan",
  "portion": "Deskripsi porsi",
  "calories": 0,
  "nutrients": {
    "protein": {"amount": 0, "unit": "g", "percentDV": 0, "status": "good"},
    "fat": {"amount": 0, "unit": "g", "percentDV": 0, "status": "good"},
    "carbs": {"amount": 0, "unit": "g", "percentDV": 0, "status": "good"},
    "fiber": {"amount": 0, "unit": "g", "percentDV": 0, "status": "good"},
    "sugar": {"amount": 0, "unit": "g", "percentDV": 0, "status": "good"},
    "sodium": {"amount": 0, "unit": "mg", "percentDV": 0, "status": "good"},
    "cholesterol": {"amount": 0, "unit": "mg", "percentDV": 0, "status": "good"},
    "vitaminA": {"amount": 0, "unit": "mcg", "percentDV": 0, "status": "good"},
    "vitaminC": {"amount": 0, "unit": "mg", "percentDV": 0, "status": "good"},
    "calcium": {"amount": 0, "unit": "mg", "percentDV": 0, "status": "good"},
    "iron": {"amount": 0, "unit": "mg", "percentDV": 0, "status": "good"}
  },
  "healthImpact": ["dampak positif..."],
  "warnings": ["peringatan jika ada..."],
  "suggestions": ["saran perbaikan..."],
  "score": 75
}

Daily Value reference (dewasa):
- Protein: 50g, Fat: 65g, Carbs: 300g, Fiber: 25g, Sugar: 50g
- Sodium: 2300mg, Cholesterol: 300mg
- Vitamin A: 900mcg, Vitamin C: 90mg, Calcium: 1000mg, Iron: 18mg`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, value } = body;

    if (!type || !value) {
      return NextResponse.json(
        { error: "Input tidak lengkap" },
        { status: 400 }
      );
    }

    let userMessage = "";

    if (type === "text") {
      userMessage = `Analisis makanan berikut dan berikan data nutrisi lengkap: "${value}"`;
    } else if (type === "image") {
      userMessage = `Identifikasi makanan dalam foto ini dan berikan data nutrisi lengkap. Ini adalah foto makanan Indonesia.`;
    }

    // Build messages for MiMo
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    if (type === "image") {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: userMessage },
          {
            type: "image_url",
            image_url: { url: value },
          },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: userMessage,
      });
    }

    const model = type === "image" ? "mimo-v2-omni" : "mimo-v2-pro";

    // Call MiMo
    const response = await fetch(`${MIMO_API_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(MIMO_API_KEY ? { Authorization: `Bearer ${MIMO_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("MiMo API error:", response.status, errText);
      return NextResponse.json(
        { error: "Gagal menghubungi AI. Coba lagi." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Respons AI kosong" },
        { status: 502 }
      );
    }

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = content.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    try {
      const result = JSON.parse(jsonStr);
      return NextResponse.json(result);
    } catch {
      console.error("Failed to parse AI response:", content);
      return NextResponse.json(
        { error: "Format respons AI tidak valid" },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal" },
      { status: 500 }
    );
  }
}
