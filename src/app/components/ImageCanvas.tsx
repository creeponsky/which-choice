"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Download } from "lucide-react";
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from "react";
import { backgrounds } from "../config/constants";
import { ImageItem } from "../types/image";
import { roundedRect } from "../utils/imageProcessing";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Layout,
    Palette,
    Type,
    Image as ImageIcon,
    Square,
    SlidersHorizontal,
    CloudRain,
    CornerUpLeft,
    CircleDot,
    FileImage,
    TextCursor
} from "lucide-react";

interface ImageCanvasProps {
    images: ImageItem[];
}

export function ImageCanvas({ images }: ImageCanvasProps) {
    const { theme, setTheme } = useTheme();
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

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement("a");
        link.download = "combined-image.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

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

            // Calculate base dimensions
            const maxHeight = Math.min(800, Math.max(...loadedImages.map(img => img.height)));

            // Calculate actual padding (based on image size percentage)
            const actualPadding = {
                top: Math.round((padding.top / 100) * maxHeight),
                right: Math.round((padding.right / 100) * maxHeight),
                bottom: Math.round((padding.bottom / 100) * maxHeight) + 60, // Extra space for letters
                left: Math.round((padding.left / 100) * maxHeight)
            };

            // Calculate total width (including padding)
            const totalWidth = loadedImages.reduce((sum, img) => {
                const aspectRatio = img.width / img.height;
                return sum + (maxHeight * aspectRatio);
            }, 0) + actualPadding.left + actualPadding.right + (images.length - 1) * actualPadding.right;

            canvas.width = totalWidth;
            canvas.height = maxHeight + actualPadding.top + actualPadding.bottom;

            // Background handling
            const bg = backgrounds.find(bg => bg.value === background);
            if (bg?.value.includes('gradient')) {
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                const colors = theme === 'dark' ? bg.dark : bg.light;
                const colorMatches = colors.match(/#[a-f0-9]{6}/gi) || ['#ffffff'];

                if (colorMatches.length === 2) {
                    // Two color gradient
                    gradient.addColorStop(0, colorMatches[0]);
                    gradient.addColorStop(1, colorMatches[1]);
                } else if (colorMatches.length > 2) {
                    // Multi-color gradient
                    colorMatches.forEach((color, index) => {
                        gradient.addColorStop(index / (colorMatches.length - 1), color);
                    });
                }
                ctx.fillStyle = gradient;
            } else {
                ctx.fillStyle = theme === 'dark' ? bg?.dark || '#1e1e1e' : bg?.light || '#ffffff';
            }
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Border
            ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            let x = actualPadding.left;
            loadedImages.forEach((img, index) => {
                const aspectRatio = img.width / img.height;
                const height = maxHeight;
                const width = height * aspectRatio;

                if (showShadow) {
                    // 先绘制阴影
                    ctx.save();
                    ctx.shadowColor = theme === 'dark' 
                        ? `rgba(0, 0, 0, ${shadowIntensity / 50})` 
                        : `rgba(0, 0, 0, ${shadowIntensity / 100})`;
                    ctx.shadowBlur = shadowIntensity;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = shadowIntensity / 2;
                    
                    // 设置填充颜色为白色或者与背景相近的颜色
                    ctx.fillStyle = theme === 'dark' ? '#2c2c2c' : '#ffffff';
                    
                    // 绘制带阴影的矩形
                    if (borderRadius > 0) {
                        ctx.beginPath();
                        roundedRect(ctx, x, actualPadding.top, width, height, borderRadius);
                        ctx.fill();
                    } else {
                        ctx.fillRect(x, actualPadding.top, width, height);
                    }
                    ctx.restore();
                }

                // 绘制实际图片
                ctx.save();
                if (borderRadius > 0) {
                    ctx.beginPath();
                    roundedRect(ctx, x, actualPadding.top, width, height, borderRadius);
                    ctx.clip();
                }
                ctx.drawImage(img, x, actualPadding.top, width, height);
                ctx.restore();


                // 使用letterSpacing来控制字母与图片的距离
                const letterY = maxHeight + actualPadding.top + letterSpacing;

                ctx.font = `bold ${fontSize}px Inter`;
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
                // Calculate dynamic watermark size based on canvas dimensions
                const baseSize = Math.min(canvas.width, canvas.height);
                const dynamicSize = Math.max(16, Math.round(baseSize * (watermarkSize / 1000))); // Convert slider value to relative size

                ctx.font = `${dynamicSize}px Inter`;
                ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
                ctx.textAlign = 'right';
                ctx.fillText(
                    'which-choice.com',
                    canvas.width - dynamicSize, // Adjust margin based on font size
                    canvas.height - dynamicSize
                );
            }
        };

        updateCanvas();
    }, [images, background, showShadow, borderRadius, theme, padding, fontSize, showWatermark, watermarkSize, letterSpacing, shadowIntensity]);

    return (
        <div className="space-y-8">
            <div className="flex gap-8">
                <Card className="w-80 p-4">
                    <Tabs defaultValue="layout" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="layout" className="p-2">
                                <Layout className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="style" className="p-2">
                                <Palette className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="text" className="p-2">
                                <Type className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="watermark" className="p-2">
                                <ImageIcon className="h-4 w-4" />
                            </TabsTrigger>
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