export interface ImageItem {
  id: string;
  file: File;
  preview: string;
  letter: string;
  originalWidth: number;
  originalHeight: number;
  compressedWidth?: number;
  compressedHeight?: number;
}

export interface Background {
  label: string;
  value: string;
  dark: string;
  light: string;
}

export interface CanvasTitle {
  text: string;
  fontSize: number;
  color: string;
  gradientColor: string;
  useGradient: boolean;
}

export interface BackgroundPattern {
  type: "grid" | "dots" | "lines" | "none";
  color: string;
  spacing: number;
  size: number;
}