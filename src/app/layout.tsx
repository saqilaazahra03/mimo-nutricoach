import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MiMo NutriCoach — Analisis Nutrisi Makanan Indonesia",
  description:
    "AI-powered nutrition analyzer for Indonesian food. Upload a photo or describe your meal to get instant nutritional breakdown, health impact analysis, and personalized recommendations.",
  keywords: [
    "nutrisi",
    "makanan indonesia",
    "kalori",
    "analisis makanan",
    "AI nutrition",
    "MiMo",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
