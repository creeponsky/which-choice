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