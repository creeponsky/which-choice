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
    
    // Initialize letters when images change
    useEffect(() => {
        setLetters(images.map((_, index) => String.fromCharCode(65 + index)));
    }, [images.length]); // Only run when number of images changes

    // Download image function
    const downloadImage = async () => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const exportCanvas = document.createElement('canvas');
        const ctx = exportCanvas.getContext('2d');
        if (!ctx) return;

        const loadedImages = await loadImagesFromSources(images.map(img => img.preview));

        const maxOriginalHeight = Math.min(Math.max(...loadedImages.map(img => img.height)), MAX_IMAGE_DIMENSION);
        const actualPadding = {
            top: Math.round((settings.padding.top / 100) * maxOriginalHeight),
            right: Math.round((settings.padding.right / 100) * maxOriginalHeight),
            bottom: Math.round((settings.padding.bottom / 100) * maxOriginalHeight) + 60,
            left: Math.round((settings.padding.left / 100) * maxOriginalHeight)
        };

        const totalWidth = loadedImages.reduce((sum, img) => {
            const aspectRatio = img.width / img.height;
            return sum + (maxOriginalHeight * aspectRatio);
        }, 0) + actualPadding.left + actualPadding.right + (images.length - 1) * actualPadding.right;

        // Calculate title space for high-res export
        const titleSpace = settings.title.text ? (
            settings.title.calculateDynamicTitleSize(totalWidth, settings.title.fontSize) + 
            settings.title.topSpacing + 
            settings.title.bottomSpacing
        ) : 0;

        // Make canvas height account for letters below images
        const letterHeight = Math.max(settings.text.fontSize, maxOriginalHeight * 0.1) * 1.2;
        const verticalGap = (settings.text.letterSpacing / 300) * maxOriginalHeight * 0.5;
        const totalLetterSpace = letterHeight + verticalGap;

        exportCanvas.width = Math.round(totalWidth);
        exportCanvas.height = Math.round(
            maxOriginalHeight + 
            actualPadding.top + 
            actualPadding.bottom + 
            (settings.title.text ? titleSpace : 0) + 
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
            theme,
            {...settings, text: {...settings.text, letters}},
            scale,
            false // Don't show border on export
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

    // Update canvas function
    useEffect(() => {
        const updateCanvas = async () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx || images.length === 0) return;

            const loadedImages = await loadImagesFromSources(images.map(img => img.preview));

            const maxHeight = Math.min(800, Math.max(...loadedImages.map(img => img.height)));
            const actualPadding = {
                top: Math.round((settings.padding.top / 100) * maxHeight),
                right: Math.round((settings.padding.right / 100) * maxHeight),
                bottom: Math.round((settings.padding.bottom / 100) * maxHeight) + 60,
                left: Math.round((settings.padding.left / 100) * maxHeight)
            };

            const totalWidth = loadedImages.reduce((sum, img) => {
                const aspectRatio = img.width / img.height;
                return sum + (maxHeight * aspectRatio);
            }, 0) + actualPadding.left + actualPadding.right + (images.length - 1) * actualPadding.right;

            // Calculate title space for preview
            const titleSpace = settings.title.text ? (
                settings.title.calculateDynamicTitleSize(totalWidth, settings.title.fontSize) + 
                settings.title.topSpacing + 
                settings.title.bottomSpacing
            ) : 0;

            // Add space for letters below images
            const letterHeight = Math.max(settings.text.fontSize, maxHeight * 0.1) * 1.2;
            const verticalGap = (settings.text.letterSpacing / 300) * maxHeight * 0.5;
            const totalLetterSpace = letterHeight + verticalGap;

            canvas.width = totalWidth;
            canvas.height = maxHeight + actualPadding.top + actualPadding.bottom + 
                           (settings.title.text ? titleSpace : 0) + totalLetterSpace;

            renderCanvas(
                ctx,
                canvas.width,
                canvas.height,
                loadedImages,
                maxHeight,
                actualPadding,
                theme,
                {...settings, text: {...settings.text, letters}},
                1,
                true // Show border in preview
            );
        };

        updateCanvas();
    }, [images, settings, theme, letters]);

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