"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from "react";
import { backgrounds, MAX_IMAGE_DIMENSION } from "../config/constants";
import { ImageItem } from "../types/image";
import { ControlPanel } from "./canvas/ControlPanel";
import { CanvasSettings, defaultCanvasSettings } from "./canvas/types";
import { loadImagesFromSources, renderCanvas } from "./canvas/canvasRenderer";

interface ImageCanvasProps {
    images: ImageItem[];
}

export function ImageCanvas({ images }: ImageCanvasProps) {
    const { theme } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [settings, setSettings] = useState<CanvasSettings>(defaultCanvasSettings);
    const [letters, setLetters] = useState<string[]>([]);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [canvasParams, setCanvasParams] = useState<{
        maxHeight: number;
        maxWidth: number;
        actualPadding: { top: number; right: number; bottom: number; left: number };
    } | null>(null);
    
    // Initialize letters when images change
    useEffect(() => {
        setLetters(images.map((_, index) => String.fromCharCode(65 + index)));
    }, [images.length]); // Only run when number of images changes

    // Calculate canvas dimensions and parameters
    const calculateCanvasParameters = (images: HTMLImageElement[]) => {
        if (images.length === 0) return null;
        
        // 初始化变量
        let totalWidth, totalHeight, maxHeight: number, maxWidth: number;
        const actualPadding = {
            top: Math.round((settings.padding.top / 100) * 800),
            right: Math.round((settings.padding.right / 100) * 800),
            bottom: Math.round((settings.padding.bottom / 100) * 800) + 60,
            left: Math.round((settings.padding.left / 100) * 800)
        };

        // 计算标题空间
        const titleSpace = settings.title.text ? (
            settings.title.calculateDynamicTitleSize(1000, settings.title.fontSize) + 
            settings.title.topSpacing + 
            settings.title.bottomSpacing
        ) : 0;

        if (settings.layoutDirection === "horizontal") {
            // 横向布局时的尺寸计算
            maxHeight = Math.min(800, Math.max(...images.map(img => img.height)));
            
            totalWidth = images.reduce((sum, img) => {
                const aspectRatio = img.width / img.height;
                return sum + (maxHeight * aspectRatio);
            }, 0) + actualPadding.left + actualPadding.right + (images.length - 1) * actualPadding.right;
            
            // 添加字母空间
            const letterHeight = Math.max(settings.text.fontSize, maxHeight * 0.1) * 1.2;
            const verticalGap = (settings.text.letterSpacing / 300) * maxHeight * 0.5;
            const totalLetterSpace = letterHeight + verticalGap;
            
            // 基础高度（图片 + 内边距 + 标题）
            totalHeight = maxHeight + actualPadding.top + actualPadding.bottom + 
                          (settings.title.text ? titleSpace : 0);
            
            // 根据字母位置添加额外空间
            if (settings.textPosition === "top") {
                totalHeight += totalLetterSpace; // 顶部文字空间
            } else if (settings.textPosition === "bottom") {
                totalHeight += totalLetterSpace; // 底部文字空间
            }
            
            maxWidth = 0; // 不需要在横向布局中使用
        } else {
            // 纵向布局时的尺寸计算
            maxWidth = Math.min(1200, Math.max(...images.map(img => img.width)));
            
            // 计算字母空间
            const letterHeight = Math.max(settings.text.fontSize, maxWidth * 0.05) * 1.2;
            const verticalGap = (settings.text.letterSpacing / 300) * maxWidth * 0.2;
            const letterSpacePerImage = letterHeight + verticalGap;
            
            // 根据字母位置调整图片布局
            let extraLetterSpace = 0;
            if (settings.textPosition === "top") {
                // 每张图片上方都需要加上字母空间
                extraLetterSpace = letterSpacePerImage * images.length;
            } else if (settings.textPosition === "bottom") {
                // 每张图片下方都需要加上字母空间
                extraLetterSpace = letterSpacePerImage * images.length;
            }
            
            // 计算图片高度总和（不含字母空间）
            const totalImagesHeight = images.reduce((sum, img) => {
                const aspectRatio = img.width / img.height;
                return sum + (maxWidth / aspectRatio);
            }, 0);
            
            // 计算总高度（图片 + 内边距 + 标题 + 字母空间）
            totalHeight = totalImagesHeight + 
                          actualPadding.top + 
                          actualPadding.bottom + 
                          (images.length - 1) * actualPadding.bottom + 
                          (settings.title.text ? titleSpace : 0) +
                          extraLetterSpace;
            
            totalWidth = maxWidth + actualPadding.left + actualPadding.right;
            
            maxHeight = 0; // 不需要在纵向布局中使用
        }

        return {
            width: totalWidth,
            height: totalHeight,
            maxHeight,
            maxWidth,
            actualPadding
        };
    };

    // Update canvas function
    useEffect(() => {
        const updateCanvas = async () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx || images.length === 0) return;

            const loadedImages = await loadImagesFromSources(images.map(img => img.preview));
            
            // 计算画布参数
            const params = calculateCanvasParameters(loadedImages);
            if (!params) return;
            
            // 保存参数以便下载时使用
            setCanvasSize({ width: params.width, height: params.height });
            setCanvasParams({
                maxHeight: params.maxHeight,
                maxWidth: params.maxWidth,
                actualPadding: params.actualPadding
            });

            canvas.width = params.width;
            canvas.height = params.height;

            renderCanvas(
                ctx,
                canvas.width,
                canvas.height,
                loadedImages,
                params.maxHeight,
                params.maxWidth,
                params.actualPadding,
                theme,
                {...settings, text: {...settings.text, letters}},
                1, // 预览使用1:1缩放
                true // 显示边框
            );
        };

        updateCanvas();
    }, [images, settings, theme, letters]);

    // Download image function
    const downloadImage = async () => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0 || !canvasParams) return;

        const exportCanvas = document.createElement('canvas');
        const ctx = exportCanvas.getContext('2d');
        if (!ctx) return;

        const loadedImages = await loadImagesFromSources(images.map(img => img.preview));
        
        // 使用与预览相同的布局，但应用更高的缩放比例
        const exportScale = Math.max(2, Math.min(4, 3000 / Math.max(canvasSize.width, canvasSize.height)));
        
        exportCanvas.width = Math.round(canvasSize.width * exportScale);
        exportCanvas.height = Math.round(canvasSize.height * exportScale);

        renderCanvas(
            ctx,
            exportCanvas.width,
            exportCanvas.height,
            loadedImages,
            canvasParams.maxHeight * exportScale,
            canvasParams.maxWidth * exportScale,
            {
                top: canvasParams.actualPadding.top * exportScale,
                right: canvasParams.actualPadding.right * exportScale,
                bottom: canvasParams.actualPadding.bottom * exportScale,
                left: canvasParams.actualPadding.left * exportScale
            },
            theme,
            {...settings, text: {...settings.text, letters}},
            exportScale,
            false // 不显示边框
        );

        const link = document.createElement("a");
        if (settings.exportQuality < 1) {
            link.download = "combined-image.jpg";
            link.href = exportCanvas.toDataURL("image/jpeg", settings.exportQuality);
        } else {
            link.download = "combined-image.png";
            link.href = exportCanvas.toDataURL("image/png");
        }
        link.click();
    };

    return (
        <div className="space-y-8">
            <div className="flex gap-8">
                <ControlPanel 
                    settings={settings} 
                    setSettings={setSettings}
                    letters={letters}
                    setLetters={setLetters}
                    imagesCount={images.length}
                />

                <div className="flex-1">
                    <div className="relative">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-auto rounded-lg"
                        />
                        {images.length > 0 && (
                            <Button
                                onClick={downloadImage}
                                size="icon"
                                className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 text-zinc-900"
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}