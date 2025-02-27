"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ColorPicker } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    CircleDot, CloudRain, CornerUpLeft, Download, 
    FileImage, Grid, Image as ImageIcon, Layout,
    Palette, SlidersHorizontal, Square, TextCursor, Type,
    Text, LayoutGrid, Dot, LineChart, PanelTopClose, ArrowDownUp
} from "lucide-react";
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from "react";
import { backgrounds, MAX_IMAGE_DIMENSION } from "../config/constants";
import { BackgroundPattern, CanvasTitle, ImageItem } from "../types/image";
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
    const [letters, setLetters] = useState<string[]>([]);
    
    // New state for the added features
    const [title, setTitle] = useState<string>("");
    const [titleFontSize, setTitleFontSize] = useState<number>(48);
    const [titleColor, setTitleColor] = useState<string>(theme === 'dark' ? "#ffffff" : "#18181b");
    const [titleGradientColor, setTitleGradientColor] = useState<string>(theme === 'dark' ? "#cccccc" : "#666666");
    const [useTitleGradient, setUseTitleGradient] = useState<boolean>(false);
    const [titleTopSpacing, setTitleTopSpacing] = useState<number>(30);
    const [titleBottomSpacing, setTitleBottomSpacing] = useState<number>(20);
    
    // Background pattern options
    const [showBackgroundPattern, setShowBackgroundPattern] = useState<boolean>(false);
    const [patternType, setPatternType] = useState<"grid" | "dots" | "lines" | "none">("grid");
    const [patternColor, setPatternColor] = useState<string>('rgba(51, 51, 51, 0.5)');
    const [patternSpacing, setPatternSpacing] = useState<number>(20);
    const [patternSize, setPatternSize] = useState<number>(1);

    // Initialize letters when images change
    useEffect(() => {
        setLetters(images.map((_, index) => String.fromCharCode(65 + index)));
    }, [images.length]); // Only run when number of images changes

    // Calculate dynamic title font size based on canvas width
    const calculateDynamicTitleSize = (canvasWidth: number, baseSize: number): number => {
        return Math.min(Math.max(baseSize, canvasWidth * 0.03), baseSize * 2);
    };
    
    // Calculate dynamic pattern settings - fixed to use actual values
    const calculateDynamicPatternSettings = (
        canvasWidth: number, 
        canvasHeight: number,
        baseSpacing: number,
        baseSize: number
    ) => {
        // Use the base values directly but scale up for very large canvases
        const maxDimension = Math.max(canvasWidth, canvasHeight);
        const scaleFactor = maxDimension > 2000 ? maxDimension / 2000 : 1;
        
        return {
            spacing: baseSpacing * scaleFactor,
            size: baseSize * scaleFactor
        };
    };

    // Draw background patterns
    const drawPatterns = (
        ctx: CanvasRenderingContext2D,
        canvasWidth: number,
        canvasHeight: number,
        scale: number = 1
    ) => {
        if (!showBackgroundPattern || patternType === 'none') return;

        const { spacing: dynamicSpacing, size: dynamicSize } = calculateDynamicPatternSettings(
            canvasWidth, 
            canvasHeight, 
            patternSpacing * scale,
            patternSize * scale
        );

        ctx.save();
        ctx.strokeStyle = patternColor;
        ctx.fillStyle = patternColor;
        ctx.lineWidth = dynamicSize;

        if (patternType === 'grid') {
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
        } else if (patternType === 'dots') {
            for (let x = dynamicSpacing; x < canvasWidth; x += dynamicSpacing) {
                for (let y = dynamicSpacing; y < canvasHeight; y += dynamicSpacing) {
                    ctx.beginPath();
                    ctx.arc(x, y, dynamicSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        } else if (patternType === 'lines') {
            for (let y = dynamicSpacing; y < canvasHeight; y += dynamicSpacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvasWidth, y);
                ctx.stroke();
            }
        }

        ctx.restore();
    };

    // Draw title
    const drawTitle = (
        ctx: CanvasRenderingContext2D,
        canvasWidth: number,
        actualPadding: { top: number },
        scale: number = 1
    ) => {
        if (!title) return;

        const dynamicFontSize = calculateDynamicTitleSize(canvasWidth, titleFontSize * scale);
        const scaledTopSpacing = titleTopSpacing * scale;
        
        ctx.save();
        ctx.textAlign = "center";
        ctx.font = `bold ${dynamicFontSize}px Inter`;

        if (useTitleGradient) {
            const gradient = ctx.createLinearGradient(
                canvasWidth / 2 - 200 * scale,
                0,
                canvasWidth / 2 + 200 * scale,
                0
            );
            gradient.addColorStop(0, titleColor);
            gradient.addColorStop(1, titleGradientColor);
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = titleColor;
        }

        // Position the title properly - relative to top padding not the title space
        const titleY = actualPadding.top + scaledTopSpacing;
        ctx.fillText(title, canvasWidth / 2, titleY);
        ctx.restore();
    };

    // Render canvas
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

        // Draw background patterns
        drawPatterns(ctx, canvasWidth, canvasHeight, scale);

        // Border (only in preview)
        if (shouldDrawBorder) {
            ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
        }

        // Draw title
        drawTitle(ctx, canvasWidth, actualPadding, scale);

        // Calculate title space
        const titleSpace = title ? (calculateDynamicTitleSize(canvasWidth, titleFontSize * scale) + 
                                    titleTopSpacing * scale + 
                                    titleBottomSpacing * scale) : 0;
                                    
        // Adjust image Y position to account for title
        // Make sure the image Y position is aligned properly with the title
        const imageY = actualPadding.top + (title ? titleSpace : 0);

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
                    roundedRect(ctx, x, imageY, width, height, borderRadius * scale);
                    ctx.fill();
                } else {
                    ctx.fillRect(x, imageY, width, height);
                }
                ctx.restore();
            }

            ctx.save();
            if (borderRadius > 0) {
                ctx.beginPath();
                roundedRect(ctx, x, imageY, width, height, borderRadius * scale);
                ctx.clip();
            }
            ctx.drawImage(img, x, imageY, width, height);
            ctx.restore();

            const letter = letters[index] || String.fromCharCode(65 + index);

            // Calculate letter position with proper spacing below the image
            const letterFontSize = Math.min(Math.max(fontSize * scale, width * 0.15), fontSize * scale * 1.5);
            
            // Make sure letters are placed below the image with adequate spacing
            // Use letterSpacing as a percentage of the image height to control spacing
            const letterSpacingPixels = letterSpacing * scale * 0.2; // Scale down to make spacing reasonable
            const letterY = imageY + height + letterSpacingPixels + letterFontSize * 0.8; // Position letters below image

            ctx.font = `bold ${letterFontSize}px Inter`;
            ctx.fillStyle = theme === 'dark' ? "#ffffff" : "#18181b";
            ctx.textAlign = "center";
            ctx.fillText(letter, x + width / 2, letterY);

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

    // Download image function
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

        // Calculate title space for high-res export
        const titleSpace = title ? (calculateDynamicTitleSize(totalWidth, titleFontSize) + 
                                  titleTopSpacing + titleBottomSpacing) : 0;

        // Make canvas height account for letters below images
        // Add extra space for letter height based on font size and letter spacing
        const letterHeight = Math.max(fontSize, maxOriginalHeight * 0.1) * 1.2;
        const letterSpace = letterSpacing * 0.5;
        const totalLetterSpace = letterHeight + letterSpace;

        exportCanvas.width = Math.round(totalWidth);
        exportCanvas.height = Math.round(
            maxOriginalHeight + 
            actualPadding.top + 
            actualPadding.bottom + 
            (title ? titleSpace : 0) + 
            totalLetterSpace
        );

        const scale = exportCanvas.width / canvas.width;

        renderCanvas(
            ctx,
            exportCanvas.width,
            exportCanvas.height,
            loadedImages,
            maxOriginalHeight,
            actualPadding,
            scale,
            false // Don't show border on export
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

    // Update canvas function
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

            // Calculate title space for preview
            const titleSpace = title ? (calculateDynamicTitleSize(totalWidth, titleFontSize) + 
                                      titleTopSpacing + titleBottomSpacing) : 0;

            // Add space for letters below images
            const letterHeight = Math.max(fontSize, maxHeight * 0.1) * 1.2;
            const letterSpace = letterSpacing * 0.5;
            const totalLetterSpace = letterHeight + letterSpace;

            canvas.width = totalWidth;
            canvas.height = maxHeight + actualPadding.top + actualPadding.bottom + 
                           (title ? titleSpace : 0) + totalLetterSpace;

            renderCanvas(
                ctx,
                canvas.width,
                canvas.height,
                loadedImages,
                maxHeight,
                actualPadding,
                1,
                true // Show border in preview
            );
        };

        updateCanvas();
    }, [
        images, background, showShadow, borderRadius, theme, padding, fontSize,
        showWatermark, watermarkSize, letterSpacing, shadowIntensity, letters,
        title, titleFontSize, titleColor, titleGradientColor, useTitleGradient,
        showBackgroundPattern, patternType, patternColor, patternSpacing, patternSize,
        titleTopSpacing, titleBottomSpacing
    ]);

    return (
        <div className="space-y-8">
            <div className="flex gap-8">
                <Card className="w-80 p-4">
                    <Tabs defaultValue="layout" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="layout">
                                <Layout className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="style">
                                <Palette className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="text">
                                <Type className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="title">
                                <Text className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="pattern">
                                <LayoutGrid className="h-4 w-4" />
                            </TabsTrigger>
                        </TabsList>

                        {/* Layout settings */}
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

                        {/* Style settings */}
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
                                        <span className="text-sm text-muted-foreground">Show Shadow</span>
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

                        {/* Text settings */}
                        <TabsContent value="text" className="mt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <TextCursor className="h-4 w-4" />
                                        <span>Font Size</span>
                                    </div>
                                    <Slider
                                        value={[fontSize]}
                                        onValueChange={([value]) => {
                                            setFontSize(value);
                                        }}
                                        min={12}
                                        max={160}
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
                                        onValueChange={([value]) => {
                                            setLetterSpacing(value);
                                        }}
                                        min={30}
                                        max={300}
                                        step={1}
                                        className="w-full"
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        Controls space between image and letter
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-2">
                                    {letters.map((letter, index) => (
                                        <Input
                                            key={index}
                                            type="text"
                                            value={letter}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                setLetters(prevLetters => {
                                                    const newLetters = [...prevLetters];
                                                    newLetters[index] = newValue || String.fromCharCode(65 + index);
                                                    return newLetters;
                                                });
                                            }}
                                            className="h-8 text-center px-0"
                                        />
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        {/* Title settings */}
                        <TabsContent value="title" className="mt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Text className="h-4 w-4" />
                                        <span>Title Text</span>
                                    </div>
                                    <Input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter title..."
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <TextCursor className="h-4 w-4" />
                                        <span>Base Font Size</span>
                                    </div>
                                    <Slider
                                        value={[titleFontSize]}
                                        onValueChange={([value]) => setTitleFontSize(value)}
                                        min={16}
                                        max={160}
                                        step={1}
                                        className="w-full"
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        Font will scale automatically for larger images
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <ArrowDownUp className="h-4 w-4" />
                                        <span>Title Spacing</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs mb-1 block">Top</Label>
                                            <Slider
                                                value={[titleTopSpacing]}
                                                onValueChange={([value]) => setTitleTopSpacing(value)}
                                                min={10}
                                                max={100}
                                                step={1}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs mb-1 block">Bottom</Label>
                                            <Slider
                                                value={[titleBottomSpacing]}
                                                onValueChange={([value]) => setTitleBottomSpacing(value)}
                                                min={10}
                                                max={100}
                                                step={1}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Palette className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Use Gradient</span>
                                        <Switch
                                            checked={useTitleGradient}
                                            onCheckedChange={setUseTitleGradient}
                                            className="data-[state=checked]:bg-primary"
                                        />
                                    </div>

                                    <ColorPicker
                                        label="Title Color"
                                        value={titleColor}
                                        onChange={setTitleColor}
                                    />

                                    {useTitleGradient && (
                                        <ColorPicker
                                            label="Gradient Color"
                                            value={titleGradientColor}
                                            onChange={setTitleGradientColor}
                                        />
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* Pattern settings */}
                        <TabsContent value="pattern" className="mt-4">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Show Pattern</span>
                                    <Switch
                                        checked={showBackgroundPattern}
                                        onCheckedChange={setShowBackgroundPattern}
                                        className="data-[state=checked]:bg-primary"
                                    />
                                </div>

                                {showBackgroundPattern && (
                                    <>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span>Pattern Type</span>
                                            </div>
                                            <Select 
                                                value={patternType} 
                                                onValueChange={(value: "grid" | "dots" | "lines" | "none") => setPatternType(value)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="grid">Grid</SelectItem>
                                                    <SelectItem value="dots">Dots</SelectItem>
                                                    <SelectItem value="lines">Lines</SelectItem>
                                                    <SelectItem value="none">None</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Pattern will scale automatically for larger images
                                            </div>
                                        </div>

                                        <ColorPicker
                                            label="Pattern Color"
                                            value={patternColor}
                                            onChange={setPatternColor}
                                            showAlpha={true}
                                        />

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <SlidersHorizontal className="h-4 w-4" />
                                                <span>Base Spacing</span>
                                            </div>
                                            <Slider
                                                value={[patternSpacing]}
                                                onValueChange={([value]) => setPatternSpacing(value)}
                                                min={10}
                                                max={80}
                                                step={1}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <SlidersHorizontal className="h-4 w-4" />
                                                <span>Base Size</span>
                                            </div>
                                            <Slider
                                                value={[patternSize]}
                                                onValueChange={([value]) => setPatternSize(value)}
                                                min={0.5}
                                                max={5}
                                                step={0.1}
                                                className="w-full"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </TabsContent>

                        {/* Watermark settings */}
                        <TabsContent value="watermark" className="mt-4">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <FileImage className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Show Watermark</span>
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