import { MAX_IMAGE_DIMENSION } from "@/app/config/constants";

export const compressImage = async (file: File): Promise<{ url: string; width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      let newWidth = width;
      let newHeight = height;

      if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        if (width > height) {
          newWidth = MAX_IMAGE_DIMENSION;
          newHeight = (height * MAX_IMAGE_DIMENSION) / width;
        } else {
          newHeight = MAX_IMAGE_DIMENSION;
          newWidth = (width * MAX_IMAGE_DIMENSION) / height;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      
      const compressedUrl = canvas.toDataURL('image/jpeg', 0.9);
      resolve({ url: compressedUrl, width: newWidth, height: newHeight });
    };
    img.src = URL.createObjectURL(file);
  });
};

export const roundedRect = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  radius: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}; 