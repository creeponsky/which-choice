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
  { label: "Blue Gradient", value: "bg-gradient-blue", dark: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", light: "linear-gradient(135deg, #dbeafe 0%, #60a5fa 100%)" },
  { label: "Purple Gradient", value: "bg-gradient-purple", dark: "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)", light: "linear-gradient(135deg, #f3e8ff 0%, #a78bfa 100%)" },
  { label: "Green Gradient", value: "bg-gradient-green", dark: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)", light: "linear-gradient(135deg, #dcfce7 0%, #34d399 100%)" },
  { label: "Sunset", value: "bg-gradient-sunset", dark: "linear-gradient(135deg, #7f1d1d 0%, #f97316 100%)", light: "linear-gradient(135deg, #fff7ed 0%, #fb923c 100%)" },
  { label: "Pink Gradient", value: "bg-gradient-pink", dark: "linear-gradient(135deg, #831843 0%, #ec4899 100%)", light: "linear-gradient(135deg, #fce7f3 0%, #f472b6 100%)" },
  { label: "Cyan Gradient", value: "bg-gradient-cyan", dark: "linear-gradient(135deg, #164e63 0%, #06b6d4 100%)", light: "linear-gradient(135deg, #ecfeff 0%, #22d3ee 100%)" },
  { label: "Rainbow", value: "bg-gradient-rainbow", dark: "linear-gradient(135deg, #7f1d1d 0%, #4c1d95 50%, #164e63 100%)", light: "linear-gradient(135deg, #fee2e2 0%, #e0e7ff 50%, #cffafe 100%)" }
];