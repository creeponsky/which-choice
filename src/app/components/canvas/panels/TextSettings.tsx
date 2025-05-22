import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, TextCursor, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SketchPicker } from "react-color";
import { useState } from "react";

interface TextSettingsProps {
    fontSize: number;
    setFontSize: (value: number) => void;
    letterSpacing: number;
    setLetterSpacing: (value: number) => void;
    letters: string[];
    setLetters: React.Dispatch<React.SetStateAction<string[]>>;
    imagesCount: number;
    textColor: string;
    setTextColor: (color: string) => void;
    textGradientColor: string;
    setTextGradientColor: (color: string) => void;
    useGradient: boolean;
    setUseGradient: (value: boolean) => void;
    letterColors: Record<number, { color: string, gradientColor?: string, useGradient?: boolean }>;
    setLetterColors: React.Dispatch<React.SetStateAction<Record<number, { color: string, gradientColor?: string, useGradient?: boolean }>>>;
}

export function TextSettings({
    fontSize,
    setFontSize,
    letterSpacing,
    setLetterSpacing,
    letters,
    setLetters,
    imagesCount,
    textColor,
    setTextColor,
    textGradientColor,
    setTextGradientColor,
    useGradient,
    setUseGradient,
    letterColors,
    setLetterColors
}: TextSettingsProps) {
    const [colorPickerOpen, setColorPickerOpen] = useState<number | null>(null);
    const [gradientPickerOpen, setGradientPickerOpen] = useState<number | null>(null);

    // 重置单独颜色设置，恢复为全局设置
    const resetLetterColors = () => {
        setLetterColors({});
    };

    // 更新单独字母颜色
    const updateLetterColor = (index: number, color: string) => {
        setLetterColors(prev => ({
            ...prev,
            [index]: { ...prev[index], color }
        }));
    };

    // 更新单独字母渐变色
    const updateLetterGradientColor = (index: number, gradientColor: string) => {
        setLetterColors(prev => ({
            ...prev,
            [index]: { ...prev[index], gradientColor }
        }));
    };

    // 切换单独字母渐变状态
    const toggleLetterGradient = (index: number, value: boolean) => {
        setLetterColors(prev => ({
            ...prev,
            [index]: {
                ...prev[index],
                useGradient: value,
                color: prev[index]?.color || textColor,
                gradientColor: prev[index]?.gradientColor || textGradientColor
            }
        }));
    };

    return (
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
                    onValueChange={([value]) => setLetterSpacing(value)}
                    min={30}
                    max={300}
                    step={1}
                    className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-1">
                    Controls vertical gap between image and letter
                </div>
            </div>

            <div className="space-y-2 border-t pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Palette className="h-4 w-4" />
                    <span>Letter Color</span>
                </div>

                <div className="flex items-center gap-4">
                    <div
                        className="w-10 h-10 rounded border-[2px] border-zinc-300 cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                        style={{ backgroundColor: textColor }}
                        onClick={() => setColorPickerOpen(colorPickerOpen === -1 ? null : -1)}
                    />

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="use-gradient"
                            checked={useGradient}
                            onCheckedChange={setUseGradient}
                        />
                        <Label htmlFor="use-gradient">Use Gradient</Label>
                    </div>

                    {useGradient && (
                        <div
                            className="w-10 h-10 rounded border-[2px] border-zinc-300 cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                            style={{ backgroundColor: textGradientColor }}
                            onClick={() => setGradientPickerOpen(gradientPickerOpen === -1 ? null : -1)}
                        />
                    )}
                </div>

                {colorPickerOpen === -1 && (
                    <div className="absolute z-10">
                        <div
                            className="fixed inset-0"
                            onClick={() => setColorPickerOpen(null)}
                        />
                        <SketchPicker
                            color={textColor}
                            onChange={(color: any) => setTextColor(color.hex)}
                        />
                    </div>
                )}

                {gradientPickerOpen === -1 && (
                    <div className="absolute z-10">
                        <div
                            className="fixed inset-0"
                            onClick={() => setGradientPickerOpen(null)}
                        />
                        <SketchPicker
                            color={textGradientColor}
                            onChange={(color: any) => setTextGradientColor(color.hex)}
                        />
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={resetLetterColors}
                        className="text-xs text-blue-500 hover:text-blue-700"
                    >
                        Reset individual letter colors
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="text-sm text-muted-foreground mb-2">Custom Letters</div>
                <div className="grid grid-cols-4 gap-2">
                    {letters.map((letter, index) => (
                        <div key={index} className="space-y-1">
                            <Input
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
                                className="h-8 text-center px-1"
                            />
                            <div className="group flex flex-col items-center justify-center gap-1">
                                <div className="flex items-center justify-center gap-1">
                                    <div
                                        className="w-6 h-6 rounded border border-zinc-300 cursor-pointer shadow-lg hover:shadow-2xl transition-shadow"
                                        style={{
                                            backgroundColor: letterColors[index]?.color || textColor,   
                                        }}
                                        onClick={() => setColorPickerOpen(colorPickerOpen === index ? null : index)}
                                    />

                                    {(letterColors[index]?.useGradient || (useGradient && !letterColors[index])) && (
                                        <div
                                            className="w-6 h-6 rounded border border-zinc-300 cursor-pointer shadow-lg hover:shadow-2xl transition-shadow"
                                            style={{
                                                backgroundColor: letterColors[index]?.gradientColor || textGradientColor,
                                            }}
                                            onClick={() => setGradientPickerOpen(gradientPickerOpen === index ? null : index)}
                                        />
                                    )}
                                </div>
                                <Switch
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    checked={letterColors[index]?.useGradient !== undefined
                                        ? letterColors[index]?.useGradient
                                        : useGradient}
                                    onCheckedChange={(value) => toggleLetterGradient(index, value)}
                                />
                            </div>


                            {colorPickerOpen === index && (
                                <div className="absolute z-10">
                                    <div
                                        className="fixed inset-0"
                                        onClick={() => setColorPickerOpen(null)}
                                    />
                                    <SketchPicker
                                        color={letterColors[index]?.color || textColor}
                                        onChange={(color: any) => updateLetterColor(index, color.hex)}
                                    />
                                </div>
                            )}

                            {gradientPickerOpen === index && (
                                <div className="absolute z-10">
                                    <div
                                        className="fixed inset-0"
                                        onClick={() => setGradientPickerOpen(null)}
                                    />
                                    <SketchPicker
                                        color={letterColors[index]?.gradientColor || textGradientColor}
                                        onChange={(color: any) => updateLetterGradientColor(index, color.hex)}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 