import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, TextCursor } from "lucide-react";

interface TextSettingsProps {
    fontSize: number;
    setFontSize: (value: number) => void;
    letterSpacing: number;
    setLetterSpacing: (value: number) => void;
    letters: string[];
    setLetters: React.Dispatch<React.SetStateAction<string[]>>;
    imagesCount: number;
}

export function TextSettings({
    fontSize,
    setFontSize,
    letterSpacing,
    setLetterSpacing,
    letters,
    setLetters,
    imagesCount
}: TextSettingsProps) {
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
    );
} 