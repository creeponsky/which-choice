import { Background } from "../types/image";

export const MAX_IMAGE_DIMENSION = 4000;

export const backgrounds: Background[] = [
  { label: "Default", value: "bg-white", dark: "#1e1e1e", light: "#ffffff" },
  { label: "Zinc", value: "bg-zinc-50", dark: "#18181b", light: "#fafafa" },
  { label: "Slate", value: "bg-slate-50", dark: "#1e293b", light: "#f8fafc" },
  { label: "Stone", value: "bg-stone-50", dark: "#1c1917", light: "#fafaf9" },
  { label: "Rose", value: "bg-rose-50", dark: "#881337", light: "#fff1f2" },
  { label: "Amber", value: "bg-amber-50", dark: "#78350f", light: "#fffbeb" },
  { label: "Emerald", value: "bg-emerald-50", dark: "#064e3b", light: "#ecfdf5" },
  
  // Essential Gradients
  { label: "Blue Gradient", value: "bg-gradient-blue", dark: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", light: "linear-gradient(135deg, #dbeafe 0%, #60a5fa 100%)" },
  { label: "Purple Gradient", value: "bg-gradient-purple", dark: "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)", light: "linear-gradient(135deg, #f3e8ff 0%, #a78bfa 100%)" },
  { label: "Green Gradient", value: "bg-gradient-green", dark: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)", light: "linear-gradient(135deg, #dcfce7 0%, #34d399 100%)" },
  { label: "Sunset", value: "bg-gradient-sunset", dark: "linear-gradient(135deg, #7f1d1d 0%, #f97316 100%)", light: "linear-gradient(135deg, #fff7ed 0%, #fb923c 100%)" },
  { label: "Pink Gradient", value: "bg-gradient-pink", dark: "linear-gradient(135deg, #831843 0%, #ec4899 100%)", light: "linear-gradient(135deg, #fce7f3 0%, #f472b6 100%)" },
  { label: "Cyan Gradient", value: "bg-gradient-cyan", dark: "linear-gradient(135deg, #164e63 0%, #06b6d4 100%)", light: "linear-gradient(135deg, #ecfeff 0%, #22d3ee 100%)" },
  { label: "Rainbow", value: "bg-gradient-rainbow", dark: "linear-gradient(135deg, #7f1d1d 0%, #4c1d95 50%, #164e63 100%)", light: "linear-gradient(135deg, #fee2e2 0%, #e0e7ff 50%, #cffafe 100%)" },
  
  // Designer Palettes
  { label: "Pastel Dream", value: "bg-gradient-pastel", dark: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", light: "linear-gradient(135deg, #e9defa 0%, #fbfcdb 100%)" },
  { label: "Deep Ocean", value: "bg-gradient-ocean", dark: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)", light: "linear-gradient(135deg, #96deda 0%, #50c9c3 100%)" },
  { label: "Golden Hour", value: "bg-gradient-golden", dark: "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)", light: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" },
  { label: "Mint Breeze", value: "bg-gradient-mint", dark: "linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)", light: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)" },
  { label: "Velvet Night", value: "bg-gradient-velvet", dark: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)", light: "linear-gradient(135deg, #c9d6ff 0%, #e2e2e2 100%)" },
  { label: "Sweet Peach", value: "bg-gradient-peach", dark: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)", light: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" }
];