'use client';

import { MAX_IMAGE_DIMENSION } from "@/app/config/constants";
import { ImageItem } from "@/app/types/image";
import { compressImage } from "@/app/utils/imageProcessing";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { AlertCircle, Moon, Plus, Sun, Trash2, Upload } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";
import { ImageCanvas } from "./ImageCanvas";
import { SiteLogo } from "./SiteLogo";

export function PageContent() {
    const { theme, setTheme } = useTheme();
    const [images, setImages] = useState<ImageItem[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [compressionWarning, setCompressionWarning] = useState<string | null>(null);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer?.files || []);
        handleFiles(files);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        handleFiles(files);
    }, []);

    const handleFiles = async (files: File[]) => {
        const imageFiles = files.filter(file => file.type.startsWith("image/"));
        let hasCompression = false;

        const newImages = await Promise.all(imageFiles.map(async (file, index) => {
            const img = new Image();
            await new Promise(resolve => {
                img.onload = resolve;
                img.src = URL.createObjectURL(file);
            });

            let preview = URL.createObjectURL(file);
            let compressedWidth = img.width;
            let compressedHeight = img.height;

            if (img.width > MAX_IMAGE_DIMENSION || img.height > MAX_IMAGE_DIMENSION) {
                hasCompression = true;
                const compressed = await compressImage(file);
                preview = compressed.url;
                compressedWidth = compressed.width;
                compressedHeight = compressed.height;
            }

            return {
                id: Math.random().toString(36).substr(2, 9),
                file,
                preview,
                letter: String.fromCharCode(65 + images.length + index),
                originalWidth: img.width,
                originalHeight: img.height,
                compressedWidth,
                compressedHeight
            };
        }));

        if (hasCompression) {
            setCompressionWarning(`Some images were larger than ${MAX_IMAGE_DIMENSION}px and have been automatically resized for better performance while maintaining aspect ratio.`);
        }

        setImages(prev => [...prev, ...newImages]);
    };

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(images);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedItems = items.map((item, index) => ({
            ...item,
            letter: String.fromCharCode(65 + index)
        }));

        setImages(updatedItems);
    };

    const removeImage = (id: string) => {
        setImages(images.filter(img => img.id !== id));
    };
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div className="flex-1">
                            <SiteLogo variant="contrast" showDownloadButton={true} />
                        </div>
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {images.length === 0 ? (
                <Card
                    className={`h-[300px] flex flex-col items-center justify-center border-2 border-dashed relative transition-colors ${theme === 'dark'
                        ? `border-zinc-700 ${isDragging ? "border-zinc-600 bg-zinc-800" : ""}`
                        : `border-zinc-300 ${isDragging ? "border-zinc-400 bg-zinc-50" : ""}`
                        }`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileInput}
                    />
                    <Upload className={`h-12 w-12 mb-4 ${theme === 'dark' ? "text-zinc-500" : "text-zinc-400"}`} />
                    <p className={`text-lg mb-2 ${theme === 'dark' ? "text-zinc-300" : "text-zinc-600"}`}>
                        Drag and drop your images here
                    </p>
                    <p className={theme === 'dark' ? "text-zinc-500" : "text-zinc-400"}>
                        or click to select files
                    </p>
                </Card>
            ) : (
                <div className="space-y-8">
                    <ImageCanvas images={images} />

                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">
                            Arrange Images
                        </h2>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="images" direction="horizontal">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="flex gap-6 flex-wrap items-start"
                                    >
                                        {images.map((image, index) => (
                                            <Draggable key={image.id} draggableId={image.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="relative group"
                                                    >
                                                        <Card className={`p-4 transition-all ${theme === 'dark' ? "bg-zinc-800" : ""}`}>
                                                            <button
                                                                onClick={() => removeImage(image.id)}
                                                                className={`absolute -right-2 -top-2 p-1.5 rounded-full 
                                    opacity-0 group-hover:opacity-100 transition-opacity
                                    ${theme === 'dark' ? "bg-red-500 hover:bg-red-600" : "bg-red-500 hover:bg-red-600"}
                                    text-white`}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                            <img
                                                                src={image.preview}
                                                                alt={`Image ${image.letter}`}
                                                                className="h-32 w-auto object-contain"
                                                            />
                                                            <div className={`mt-3 text-center font-semibold text-lg ${theme === 'dark' ? "text-zinc-300" : "text-zinc-600"
                                                                }`}>
                                                                {image.letter}
                                                            </div>
                                                        </Card>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        <div
                                            onClick={() => {
                                                const input = document.createElement("input");
                                                input.type = "file";
                                                input.multiple = true;
                                                input.accept = "image/*";
                                                input.onchange = (e) => handleFileInput(e as any);
                                                input.click();
                                            }}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                e.currentTarget.classList.add('border-zinc-400');
                                            }}
                                            onDragLeave={(e) => {
                                                e.preventDefault();
                                                e.currentTarget.classList.remove('border-zinc-400');
                                            }}
                                            onDrop={handleDrop}
                                            className={`cursor-pointer h-[180px] w-[140px] flex flex-col items-center justify-center
                          border-2 border-dashed rounded-lg transition-colors
                          ${theme === 'dark'
                                                    ? "border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300"
                                                    : "border-zinc-300 hover:border-zinc-400 text-zinc-400 hover:text-zinc-600"
                                                }`}
                                        >
                                            <Plus className="h-8 w-8 mb-2" />
                                            <span className="text-sm">Add Images</span>
                                        </div>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        {compressionWarning && (
                            <Alert className={theme === 'dark' ? "bg-blue-950 border-blue-900" : "bg-blue-50 border-blue-200"}>
                                <AlertCircle className={`h-4 w-4 ${theme === 'dark' ? "text-blue-400" : "text-blue-600"}`} />
                                <AlertDescription className={theme === 'dark' ? "text-blue-200" : "text-blue-700"}>
                                    {compressionWarning}
                                </AlertDescription>
                            </Alert>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
} 