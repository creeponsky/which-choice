import { roundedRect } from "@/app/utils/imageProcessing";
import { CanvasSettings } from "./types";
import { backgrounds } from "@/app/config/constants";

// 加载图片工具函数
export const loadImagesFromSources = (sources: string[]): Promise<HTMLImageElement[]> => {
    return Promise.all(
        sources.map(src => {
            return new Promise<HTMLImageElement>((resolve) => {
                const image = new Image();
                image.src = src;
                image.onload = () => resolve(image);
            });
        })
    );
};

// 绘制背景图案
export const drawPatterns = (
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    settings: CanvasSettings,
    scale: number = 1
) => {
    const { pattern } = settings;
    
    if (!pattern.show || pattern.type === 'none') return;

    const { spacing: dynamicSpacing, size: dynamicSize } = pattern.calculateDynamicPatternSettings(
        canvasWidth, 
        canvasHeight, 
        pattern.spacing * scale,
        pattern.size * scale
    );

    ctx.save();
    ctx.strokeStyle = pattern.color;
    ctx.fillStyle = pattern.color;
    ctx.lineWidth = dynamicSize;

    if (pattern.type === 'grid') {
        // Draw vertical lines
        for (let x = dynamicSpacing; x < canvasWidth; x += dynamicSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
            ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = dynamicSpacing; y < canvasHeight; y += dynamicSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
            ctx.stroke();
        }
    } else if (pattern.type === 'dots') {
        for (let x = dynamicSpacing; x < canvasWidth; x += dynamicSpacing) {
            for (let y = dynamicSpacing; y < canvasHeight; y += dynamicSpacing) {
                ctx.beginPath();
                ctx.arc(x, y, dynamicSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    } else if (pattern.type === 'lines') {
        for (let y = dynamicSpacing; y < canvasHeight; y += dynamicSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
            ctx.stroke();
        }
    }

    ctx.restore();
};

// 绘制标题
export const drawTitle = (
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    actualPadding: { top: number },
    settings: CanvasSettings,
    scale: number = 1
) => {
    const { title } = settings;
    
    if (!title.text) return;

    const dynamicFontSize = title.calculateDynamicTitleSize(canvasWidth, title.fontSize * scale);
    const scaledTopSpacing = title.topSpacing * scale;
    
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = `bold ${dynamicFontSize}px Inter`;

    if (title.useGradient) {
        const gradient = ctx.createLinearGradient(
            canvasWidth / 2 - 200 * scale,
            0,
            canvasWidth / 2 + 200 * scale,
            0
        );
        gradient.addColorStop(0, title.color);
        gradient.addColorStop(1, title.gradientColor);
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = title.color;
    }

    // Position the title properly - relative to top padding not the title space
    const titleY = actualPadding.top + scaledTopSpacing;
    ctx.fillText(title.text, canvasWidth / 2, titleY);
    ctx.restore();
};

// 主要渲染函数
export const renderCanvas = (
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    loadedImages: HTMLImageElement[],
    maxHeight: number,
    actualPadding: { top: number; right: number; bottom: number; left: number },
    theme: string | undefined,
    settings: CanvasSettings,
    scale: number = 1,
    shouldDrawBorder: boolean = true
) => {
    // Background handling
    const bg = backgrounds.find(bg => bg.value === settings.background);
    if (bg?.value.includes('gradient')) {
        const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
        const colors = theme === 'dark' ? bg.dark : bg.light;
        const colorMatches = colors.match(/#[a-f0-9]{6}/gi) || ['#ffffff'];

        if (colorMatches.length === 2) {
            gradient.addColorStop(0, colorMatches[0]);
            gradient.addColorStop(1, colorMatches[1]);
        } else if (colorMatches.length > 2) {
            colorMatches.forEach((color, index) => {
                gradient.addColorStop(index / (colorMatches.length - 1), color);
            });
        }
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = theme === 'dark' ? bg?.dark || '#1e1e1e' : bg?.light || '#ffffff';
    }
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw background patterns
    drawPatterns(ctx, canvasWidth, canvasHeight, settings, scale);

    // Border (only in preview)
    if (shouldDrawBorder) {
        ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
    }

    // Draw title
    drawTitle(ctx, canvasWidth, actualPadding, settings, scale);

    // Calculate title space
    const titleSpace = settings.title.text ? (
        settings.title.calculateDynamicTitleSize(canvasWidth, settings.title.fontSize * scale) + 
        settings.title.topSpacing * scale + 
        settings.title.bottomSpacing * scale
    ) : 0;
                                
    // Adjust image Y position to account for title
    const imageY = actualPadding.top + (settings.title.text ? titleSpace : 0);

    let x = actualPadding.left;
    loadedImages.forEach((img, index) => {
        const aspectRatio = img.width / img.height;
        const height = maxHeight;
        const width = height * aspectRatio;

        if (settings.showShadow) {
            ctx.save();
            ctx.shadowColor = theme === 'dark'
                ? `rgba(0, 0, 0, ${settings.shadowIntensity / 50})`
                : `rgba(0, 0, 0, ${settings.shadowIntensity / 100})`;
            ctx.shadowBlur = settings.shadowIntensity * scale;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = (settings.shadowIntensity / 2) * scale;

            ctx.fillStyle = theme === 'dark' ? '#2c2c2c' : '#ffffff';

            if (settings.borderRadius > 0) {
                ctx.beginPath();
                roundedRect(ctx, x, imageY, width, height, settings.borderRadius * scale);
                ctx.fill();
            } else {
                ctx.fillRect(x, imageY, width, height);
            }
            ctx.restore();
        }

        ctx.save();
        if (settings.borderRadius > 0) {
            ctx.beginPath();
            roundedRect(ctx, x, imageY, width, height, settings.borderRadius * scale);
            ctx.clip();
        }
        ctx.drawImage(img, x, imageY, width, height);
        ctx.restore();

        const letter = settings.text.letters?.[index] || String.fromCharCode(65 + index);

        // Calculate letter position with proper spacing below the image
        const letterFontSize = Math.min(
            Math.max(settings.text.fontSize * scale, width * 0.15), 
            settings.text.fontSize * scale * 1.5
        );
        
        // Use letterSpacing as a percentage of the image height to control spacing
        const letterSpacingPixels = settings.text.letterSpacing * scale * 0.2;
        const letterY = imageY + height + letterSpacingPixels + letterFontSize * 0.8;

        ctx.font = `bold ${letterFontSize}px Inter`;
        ctx.fillStyle = theme === 'dark' ? "#ffffff" : "#18181b";
        ctx.textAlign = "center";
        ctx.fillText(letter, x + width / 2, letterY);

        x += width + actualPadding.right;
    });

    if (settings.showWatermark) {
        const baseSize = Math.min(canvasWidth, canvasHeight);
        const dynamicSize = Math.max(16, Math.round(baseSize * (settings.watermarkSize / 1000)));

        ctx.font = `bold ${dynamicSize}px system-ui, -apple-system, Inter`;
        ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
        ctx.textAlign = 'right';

        // Add stroke for better visibility
        ctx.strokeStyle = theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = dynamicSize / 8;
        ctx.strokeText(
            'which-choice.com',
            canvasWidth - dynamicSize,
            canvasHeight - dynamicSize
        );

        ctx.fillText(
            'which-choice.com',
            canvasWidth - dynamicSize,
            canvasHeight - dynamicSize
        );
    }
}; 