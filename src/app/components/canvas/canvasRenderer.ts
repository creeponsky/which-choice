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
    // 添加防御性检查
    if (!settings || !settings.pattern) return;
    
    const { pattern } = settings;
    
    if (!pattern.show || pattern.type === 'none') return;

    // 对于导出时的高分辨率，我们需要保持视觉一致性
    // 通过使用适应性的spacing和size计算方式
    const baseSpacing = pattern.spacing;
    const baseSize = pattern.size;
    
    // 使用相对画布尺寸计算模式密度，而不是简单地乘以scale
    const { spacing: dynamicSpacing, size: dynamicSize } = pattern.calculateDynamicPatternSettings(
        canvasWidth / scale, 
        canvasHeight / scale, 
        baseSpacing,
        baseSize
    );
    
    // 然后将计算出的值应用缩放系数
    const finalSpacing = dynamicSpacing * scale;
    const finalSize = dynamicSize * scale;

    ctx.save();
    ctx.strokeStyle = pattern.color;
    ctx.fillStyle = pattern.color;
    ctx.lineWidth = finalSize;

    if (pattern.type === 'grid') {
        // Draw vertical lines
        for (let x = finalSpacing; x < canvasWidth; x += finalSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
            ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = finalSpacing; y < canvasHeight; y += finalSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
            ctx.stroke();
        }
    } else if (pattern.type === 'dots') {
        for (let x = finalSpacing; x < canvasWidth; x += finalSpacing) {
            for (let y = finalSpacing; y < canvasHeight; y += finalSpacing) {
                ctx.beginPath();
                ctx.arc(x, y, finalSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    } else if (pattern.type === 'lines') {
        for (let y = finalSpacing; y < canvasHeight; y += finalSpacing) {
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
    maxHeight: number, // 横向布局时使用
    maxWidth: number, // 纵向布局时使用
    actualPadding: { top: number; right: number; bottom: number; left: number },
    theme: string | undefined,
    settings: CanvasSettings,
    scale: number = 1,
    shouldDrawBorder: boolean = true
) => {
    // Background handling
    if (settings.useCustomBackground && settings.customBackground) {
        // Use custom background
        const { type, color1, color2, gradientAngle = 135 } = settings.customBackground;
        
        if (type === 'gradient' && color2) {
            // Calculate gradient coordinates based on angle
            const angleRad = (gradientAngle * Math.PI) / 180;
            const x1 = 0.5 - 0.5 * Math.cos(angleRad);
            const y1 = 0.5 - 0.5 * Math.sin(angleRad);
            const x2 = 0.5 + 0.5 * Math.cos(angleRad);
            const y2 = 0.5 + 0.5 * Math.sin(angleRad);
            
            const gradient = ctx.createLinearGradient(
                x1 * canvasWidth, 
                y1 * canvasHeight, 
                x2 * canvasWidth, 
                y2 * canvasHeight
            );
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            ctx.fillStyle = gradient;
        } else {
            // Solid color
            ctx.fillStyle = color1;
        }
    } else {
        // Use preset backgrounds
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
    }
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw background patterns
    drawPatterns(ctx, canvasWidth, canvasHeight, settings, scale);

    // 绘制内部模拟边框 (如果启用)
    if (settings.border.show) {
        const borderWidth = settings.border.width * scale;
        const borderPadding = settings.border.padding * scale;
        const borderRadius = settings.border.borderRadius * scale;
        
        // 计算边框的位置（内部缩进）
        const borderX = borderPadding;
        const borderY = borderPadding;
        const borderWidth2 = canvasWidth - (borderPadding * 2);
        const borderHeight = canvasHeight - (borderPadding * 2);
        
        ctx.save();
        ctx.strokeStyle = settings.border.color;
        ctx.lineWidth = borderWidth;
        
        // 绘制内部边框
        ctx.beginPath();
        roundedRect(ctx, borderX, borderY, borderWidth2, borderHeight, borderRadius);
        ctx.stroke();
        ctx.restore();
    }

    // Preview border (only in preview)
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
    
    // 根据布局方向和字母位置进行不同的渲染
    if (settings.layoutDirection === "horizontal") {
        // 水平布局逻辑
        let x = actualPadding.left;
        
        // 如果文字在顶部，计算图片应该下移的距离
        const baseLetterHeight = Math.max(settings.text.fontSize, maxHeight * 0.1) * 1.2;
        const verticalLetterGap = (settings.text.letterSpacing / 300) * maxHeight * 0.5;
        const totalLetterOffset = settings.textPosition === "top" ? (baseLetterHeight * scale + verticalLetterGap * scale) : 0;
        
        // 图片的Y坐标，考虑标题空间和文字位置
        const imageY = actualPadding.top + (settings.title.text ? titleSpace : 0) + totalLetterOffset;
        
        loadedImages.forEach((img, index) => {
            const aspectRatio = img.width / img.height;
            const height = maxHeight;
            const width = height * aspectRatio;
            
            // 添加阴影（如果启用）
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
            
            // 绘制带有圆角的实际图像
            ctx.save();
            if (settings.borderRadius > 0) {
                ctx.beginPath();
                roundedRect(ctx, x, imageY, width, height, settings.borderRadius * scale);
                ctx.clip();
            }
            ctx.drawImage(img, x, imageY, width, height);
            ctx.restore();
            
            const letter = settings.text.letters?.[index] || String.fromCharCode(65 + index);
            
            // 获取字母颜色设置
            const letterColorSettings = settings.text.letterColors?.[index];
            const useGradient = letterColorSettings?.useGradient !== undefined 
                ? letterColorSettings.useGradient 
                : settings.text.useGradient;
            
            // 计算字母大小
            const baseWidth = width / scale;
            const baseFontSize = Math.min(
                Math.max(settings.text.fontSize, baseWidth * 0.15), 
                settings.text.fontSize * 1.5
            );
            const letterFontSize = baseFontSize * scale;
            
            // 根据文字位置设置纵向位置
            ctx.font = `bold ${letterFontSize}px Inter`;
            
            if (useGradient) {
                // 使用渐变色
                const gradientX = x + width / 2;
                const gradientWidth = width * 0.8;
                const gradient = ctx.createLinearGradient(
                    gradientX - gradientWidth / 2, 
                    0, 
                    gradientX + gradientWidth / 2, 
                    0
                );
                
                const color1 = letterColorSettings?.color || settings.text.color;
                const color2 = letterColorSettings?.gradientColor || settings.text.gradientColor;
                
                gradient.addColorStop(0, color1);
                gradient.addColorStop(1, color2);
                ctx.fillStyle = gradient;
            } else {
                // 使用纯色
                ctx.fillStyle = letterColorSettings?.color || settings.text.color;
            }
            
            ctx.textAlign = "center";
            
            if (settings.textPosition === "top") {
                // 在图片上方显示字母
                const letterY = imageY - verticalLetterGap * scale;
                ctx.fillText(letter, x + width / 2, letterY);
            } else {
                // 在图片下方显示字母
                const letterY = imageY + height + verticalLetterGap * scale + letterFontSize * 0.8;
                ctx.fillText(letter, x + width / 2, letterY);
            }
            
            x += width + actualPadding.right;
        });
    } else {
        // 纵向布局逻辑
        let y = actualPadding.top + (settings.title.text ? titleSpace : 0);
        const imageX = actualPadding.left;
        
        loadedImages.forEach((img, index) => {
            const aspectRatio = img.width / img.height;
            const width = maxWidth;
            const height = width / aspectRatio;
            
            // 计算字母大小
            const baseWidth = width / scale;
            const baseFontSize = Math.min(
                Math.max(settings.text.fontSize, baseWidth * 0.15), 
                settings.text.fontSize * 1.5
            );
            const letterFontSize = baseFontSize * scale;
            const verticalGap = (settings.text.letterSpacing / 300) * height * 0.5;
            
            // 绘制字母（如果位置是top）
            if (settings.textPosition === "top") {
                const letter = settings.text.letters?.[index] || String.fromCharCode(65 + index);
                
                // 获取字母颜色设置
                const letterColorSettings = settings.text.letterColors?.[index];
                const useGradient = letterColorSettings?.useGradient !== undefined 
                    ? letterColorSettings.useGradient 
                    : settings.text.useGradient;
                
                ctx.font = `bold ${letterFontSize}px Inter`;
                
                if (useGradient) {
                    // 使用渐变色
                    const gradientX = imageX + width / 2;
                    const gradientWidth = width * 0.8;
                    const gradient = ctx.createLinearGradient(
                        gradientX - gradientWidth / 2, 
                        0, 
                        gradientX + gradientWidth / 2, 
                        0
                    );
                    
                    const color1 = letterColorSettings?.color || settings.text.color;
                    const color2 = letterColorSettings?.gradientColor || settings.text.gradientColor;
                    
                    gradient.addColorStop(0, color1);
                    gradient.addColorStop(1, color2);
                    ctx.fillStyle = gradient;
                } else {
                    // 使用纯色
                    ctx.fillStyle = letterColorSettings?.color || settings.text.color;
                }
                
                ctx.textAlign = "center";
                ctx.fillText(letter, imageX + width / 2, y + letterFontSize * 0.8);
                
                // 调整图片位置，为顶部字母留出空间
                y += letterFontSize + verticalGap;
            }
            
            // 绘制带有阴影的图片背景
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
                    roundedRect(ctx, imageX, y, width, height, settings.borderRadius * scale);
                    ctx.fill();
                } else {
                    ctx.fillRect(imageX, y, width, height);
                }
                ctx.restore();
            }
            
            // 绘制带有圆角的实际图像
            ctx.save();
            if (settings.borderRadius > 0) {
                ctx.beginPath();
                roundedRect(ctx, imageX, y, width, height, settings.borderRadius * scale);
                ctx.clip();
            }
            ctx.drawImage(img, imageX, y, width, height);
            ctx.restore();
            
            // 绘制字母（如果位置是bottom）
            if (settings.textPosition === "bottom") {
                const letter = settings.text.letters?.[index] || String.fromCharCode(65 + index);
                
                // 获取字母颜色设置
                const letterColorSettings = settings.text.letterColors?.[index];
                const useGradient = letterColorSettings?.useGradient !== undefined 
                    ? letterColorSettings.useGradient 
                    : settings.text.useGradient;
                
                ctx.font = `bold ${letterFontSize}px Inter`;
                
                if (useGradient) {
                    // 使用渐变色
                    const gradientX = imageX + width / 2;
                    const gradientWidth = width * 0.8;
                    const gradient = ctx.createLinearGradient(
                        gradientX - gradientWidth / 2, 
                        0, 
                        gradientX + gradientWidth / 2, 
                        0
                    );
                    
                    const color1 = letterColorSettings?.color || settings.text.color;
                    const color2 = letterColorSettings?.gradientColor || settings.text.gradientColor;
                    
                    gradient.addColorStop(0, color1);
                    gradient.addColorStop(1, color2);
                    ctx.fillStyle = gradient;
                } else {
                    // 使用纯色
                    ctx.fillStyle = letterColorSettings?.color || settings.text.color;
                }
                
                ctx.textAlign = "center";
                ctx.fillText(letter, imageX + width / 2, y + height + verticalGap + letterFontSize * 0.8);
            }
            
            // 为下一张图片更新Y坐标
            y += height + actualPadding.bottom;
        });
    }
    
    if (settings.showWatermark) {
        const baseSize = Math.min(canvasWidth, canvasHeight);
        const dynamicSize = Math.max(16, Math.round(baseSize * (settings.watermarkSize / 1000)));
        const opacity = settings.watermarkOpacity;

        ctx.font = `bold ${dynamicSize}px system-ui, -apple-system, Inter`;
        ctx.fillStyle = theme === 'dark' ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`;
        ctx.textAlign = 'right';

        // Add stroke for better visibility
        ctx.strokeStyle = theme === 'dark' ? `rgba(0, 0, 0, ${opacity / 2})` : `rgba(255, 255, 255, ${opacity / 2})`;
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