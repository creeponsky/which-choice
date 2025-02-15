"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    CircleDot, CloudRain,
    CornerUpLeft, Download, FileImage, Image as ImageIcon, Layout,
    Palette, SlidersHorizontal, Square, TextCursor, Type
} from "lucide-react";
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from "react";
import { backgrounds, MAX_IMAGE_DIMENSION } from "../config/constants";
import { ImageItem } from "../types/image";
import { roundedRect } from "../utils/imageProcessing";

interface ImageCanvasProps {
    images: ImageItem[];
}

export function ImageCanvas({ images }: ImageCanvasProps) {
    const { theme } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [background, setBackground] = useState(backgrounds[backgrounds.length - 1].value);
    const [showShadow, setShowShadow] = useState(true);
    const [borderRadius, setBorderRadius] = useState(36);
    const [fontSize, setFontSize] = useState(88);
    const [padding, setPadding] = useState({
        top: 20,
        right: 20,
        bottom: 40,
        left: 20
    });
    const [showWatermark, setShowWatermark] = useState(true);
    const [watermarkSize, setWatermarkSize] = useState(24);
    const [letterSpacing, setLetterSpacing] = useState(120);
    const [shadowIntensity, setShadowIntensity] = useState(24);
    const [exportQuality, setExportQuality] = useState(0.8);

    // 添加一个通用的渲染函数
    const renderCanvas = (
        ctx: CanvasRenderingContext2D,
        canvasWidth: number,
        canvasHeight: number,
        loadedImages: HTMLImageElement[],
        maxHeight: number,
        actualPadding: { top: number; right: number; bottom: number; left: number },
        scale: number = 1,
        shouldDrawBorder: boolean = true
    ) => {
        // Background handling
        const bg = backgrounds.find(bg => bg.value === background);
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

        // Border (只在预览时绘制)
        if (shouldDrawBorder) {
            ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
        }

        let x = actualPadding.left;
        loadedImages.forEach((img, index) => {
            const aspectRatio = img.width / img.height;
            const height = maxHeight;
            const width = height * aspectRatio;

            if (showShadow) {
                ctx.save();
                ctx.shadowColor = theme === 'dark' 
                    ? `rgba(0, 0, 0, ${shadowIntensity / 50})` 
                    : `rgba(0, 0, 0, ${shadowIntensity / 100})`;
                ctx.shadowBlur = shadowIntensity * scale;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = (shadowIntensity / 2) * scale;
                
                ctx.fillStyle = theme === 'dark' ? '#2c2c2c' : '#ffffff';
                
                if (borderRadius > 0) {
                    ctx.beginPath();
                    roundedRect(ctx, x, actualPadding.top, width, height, borderRadius * scale);
                    ctx.fill();
                } else {
                    ctx.fillRect(x, actualPadding.top, width, height);
                }
                ctx.restore();
            }

            ctx.save();
            if (borderRadius > 0) {
                ctx.beginPath();
                roundedRect(ctx, x, actualPadding.top, width, height, borderRadius * scale);
                ctx.clip();
            }
            ctx.drawImage(img, x, actualPadding.top, width, height);
            ctx.restore();

            const letterY = maxHeight + actualPadding.top + (letterSpacing * scale);

            ctx.font = `bold ${fontSize * scale}px Inter`;
            ctx.fillStyle = theme === 'dark' ? "#ffffff" : "#18181b";
            ctx.textAlign = "center";
            ctx.fillText(
                String.fromCharCode(65 + index),
                x + width / 2,
                letterY
            );

            x += width + actualPadding.right;
        });

        if (showWatermark) {
            const baseSize = Math.min(canvasWidth, canvasHeight);
            const dynamicSize = Math.max(16, Math.round(baseSize * (watermarkSize / 1000)));

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

    // 修改 downloadImage 函数
    const downloadImage = async () => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const exportCanvas = document.createElement('canvas');
        const ctx = exportCanvas.getContext('2d');
        if (!ctx) return;

        const loadedImages = await Promise.all(
            images.map(img => {
                return new Promise<HTMLImageElement>((resolve) => {
                    const image = new Image();
                    image.src = img.preview;
                    image.onload = () => resolve(image);
                });
            })
        );

        const maxOriginalHeight = Math.min(Math.max(...loadedImages.map(img => img.height)), MAX_IMAGE_DIMENSION);
        const actualPadding = {
            top: Math.round((padding.top / 100) * maxOriginalHeight),
            right: Math.round((padding.right / 100) * maxOriginalHeight),
            bottom: Math.round((padding.bottom / 100) * maxOriginalHeight) + 60,
            left: Math.round((padding.left / 100) * maxOriginalHeight)
        };

        const totalWidth = loadedImages.reduce((sum, img) => {
            const aspectRatio = img.width / img.height;
            return sum + (maxOriginalHeight * aspectRatio);
        }, 0) + actualPadding.left + actualPadding.right + (images.length - 1) * actualPadding.right;

        exportCanvas.width = Math.round(totalWidth);
        exportCanvas.height = Math.round(maxOriginalHeight + actualPadding.top + actualPadding.bottom);

        const scale = exportCanvas.width / canvas.width;
        
        renderCanvas(
            ctx,
            exportCanvas.width,
            exportCanvas.height,
            loadedImages,
            maxOriginalHeight,
            actualPadding,
            scale,
            false // 导出时不显示边框
        );

        const link = document.createElement("a");
        if (exportQuality < 1) {
            link.download = "combined-image.jpg";
            link.href = exportCanvas.toDataURL("image/jpeg", exportQuality);
        } else {
            link.download = "combined-image.png";
            link.href = exportCanvas.toDataURL("image/png");
        }
        link.click();
    };

    // 修改 useEffect 中的 updateCanvas 函数
    useEffect(() => {
        const updateCanvas = async () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx || images.length === 0) return;

            const loadedImages = await Promise.all(
                images.map(img => {
                    return new Promise<HTMLImageElement>((resolve) => {
                        const image = new Image();
                        image.src = img.preview;
                        image.onload = () => resolve(image);
                    });
                })
            );

            const maxHeight = Math.min(800, Math.max(...loadedImages.map(img => img.height)));
            const actualPadding = {
                top: Math.round((padding.top / 100) * maxHeight),
                right: Math.round((padding.right / 100) * maxHeight),
                bottom: Math.round((padding.bottom / 100) * maxHeight) + 60,
                left: Math.round((padding.left / 100) * maxHeight)
            };

            const totalWidth = loadedImages.reduce((sum, img) => {
                const aspectRatio = img.width / img.height;
                return sum + (maxHeight * aspectRatio);
            }, 0) + actualPadding.left + actualPadding.right + (images.length - 1) * actualPadding.right;

            canvas.width = totalWidth;
            canvas.height = maxHeight + actualPadding.top + actualPadding.bottom;

            renderCanvas(
                ctx,
                canvas.width,
                canvas.height,
                loadedImages,
                maxHeight,
                actualPadding,
                1,
                true // 预览时显示边框
            );
        };

        updateCanvas();
    }, [images, background, showShadow, borderRadius, theme, padding, fontSize, showWatermark, watermarkSize, letterSpacing, shadowIntensity]);

    return (
        <div className="space-y-8">
            <div className="flex gap-8">
                <Card className="w-80 p-4">
                    <Tabs defaultValue="layout" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="layout">
                                <Layout className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="style">
                                <Palette className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="text">
                                <Type className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="watermark">
                                <ImageIcon className="h-4 w-4" />
                            </TabsTrigger>
                            {/* <TabsTrigger value="export">
                                <Download className="h-4 w-4" />
                            </TabsTrigger> */}
                        </TabsList>

                        {/* 布局设置 */}
                        <TabsContent value="layout" className="mt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <SlidersHorizontal className="h-4 w-4" />
                                        <span>Horizontal Padding</span>
                                    </div>
                                    <Slider
                                        value={[padding.left]}
                                        onValueChange={([value]) => setPadding({
                                            ...padding,
                                            left: value,
                                            right: value
                                        })}
                                        max={100}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CornerUpLeft className="h-4 w-4" />
                                        <span>Vertical Padding</span>
                                    </div>
                                    <Slider
                                        value={[padding.top]}
                                        onValueChange={([value]) => setPadding({
                                            ...padding,
                                            top: value,
                                            bottom: value + 20
                                        })}
                                        max={100}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* 样式设置 */}
                        <TabsContent value="style" className="mt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Square className="h-4 w-4" />
                                        <span>Background Style</span>
                                    </div>
                                    <Select value={background} onValueChange={setBackground}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {backgrounds.map((bg) => (
                                                <SelectItem key={bg.value} value={bg.value}>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-4 h-4 rounded-sm"
                                                            style={{
                                                                background: bg.value.includes('gradient')
                                                                    ? theme === 'dark' ? bg.dark : bg.light
                                                                    : theme === 'dark' ? bg.dark : bg.light,
                                                                border: '1px solid rgba(0,0,0,0.1)'
                                                            }}
                                                        />
                                                        {bg.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <CloudRain className="h-4 w-4 text-muted-foreground" />
                                        <Switch
                                            checked={showShadow}
                                            onCheckedChange={setShowShadow}
                                            className="data-[state=checked]:bg-primary"
                                        />
                                    </div>
                                    
                                    {showShadow && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span>Shadow Intensity</span>
                                            </div>
                                            <Slider
                                                value={[shadowIntensity]}
                                                onValueChange={([value]) => setShadowIntensity(value)}
                                                min={10}
                                                max={50}
                                                step={1}
                                                className="w-full"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CircleDot className="h-4 w-4" />
                                        <span>Border Radius</span>
                                    </div>
                                    <Slider
                                        value={[borderRadius]}
                                        onValueChange={([value]) => setBorderRadius(value)}
                                        max={50}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* 文字设置 */}
                        <TabsContent value="text" className="mt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <TextCursor className="h-4 w-4" />
                                        <span>Font Size</span>
                                    </div>
                                    <Slider
                                        value={[fontSize]}
                                        onValueChange={([value]) => setFontSize(value)}
                                        min={12}
                                        max={72}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <SlidersHorizontal className="h-4 w-4" />
                                        <span>Letter Spacing</span>
                                    </div>
                                    <Slider
                                        value={[letterSpacing]}
                                        onValueChange={([value]) => setLetterSpacing(value)}
                                        min={100}
                                        max={300}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* 水印设置 */}
                        <TabsContent value="watermark" className="mt-4">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <FileImage className="h-4 w-4 text-muted-foreground" />
                                    <Switch
                                        checked={showWatermark}
                                        onCheckedChange={setShowWatermark}
                                        className="data-[state=checked]:bg-primary"
                                    />
                                </div>

                                <div className={`space-y-2 transition-all duration-300 ${showWatermark ? 'opacity-100' : 'opacity-50'
                                    }`}>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <SlidersHorizontal className="h-4 w-4" />
                                        <span>Watermark Size</span>
                                    </div>
                                    <Slider
                                        value={[watermarkSize]}
                                        onValueChange={([value]) => setWatermarkSize(value)}
                                        min={8}
                                        max={48}
                                        step={1}
                                        disabled={!showWatermark}
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <SlidersHorizontal className="h-4 w-4" />
                                        <span>Export Quality</span>
                                    </div>
                                    <Slider
                                        value={[exportQuality * 100]}
                                        onValueChange={([value]) => setExportQuality(value / 100)}
                                        min={30}
                                        max={100}
                                        step={1}
                                        className="w-full"
                                    />
                                    <div className="text-sm text-muted-foreground text-right">
                                        {Math.round(exportQuality * 100)}%
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </Card>

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