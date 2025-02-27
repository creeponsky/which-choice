import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, CornerUpLeft } from "lucide-react";

interface LayoutSettingsProps {
    padding: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    setPadding: (padding: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    }) => void;
}

export function LayoutSettings({ padding, setPadding }: LayoutSettingsProps) {
    return (
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
    );
} 