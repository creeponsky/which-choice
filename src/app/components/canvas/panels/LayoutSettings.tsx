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
    hasTitle?: boolean;
}

export function LayoutSettings({ padding, setPadding, hasTitle = false }: LayoutSettingsProps) {
    const minVerticalPadding = hasTitle ? 25 : 10;
    
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
                    <CornerUpLeft className="h-4 w-4 rotate-180" />
                    <span>Top Padding</span>
                </div>
                <Slider
                    value={[padding.top]}
                    onValueChange={([value]) => setPadding({
                        ...padding,
                        top: Math.max(value, hasTitle ? minVerticalPadding : value)
                    })}
                    min={minVerticalPadding}
                    max={100}
                    step={1}
                    className="w-full"
                />
                {hasTitle && (
                    <div className="text-xs text-muted-foreground mt-1">
                        Minimum padding increased to accommodate title
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CornerUpLeft className="h-4 w-4" />
                    <span>Bottom Padding</span>
                </div>
                <Slider
                    value={[padding.bottom]}
                    onValueChange={([value]) => setPadding({
                        ...padding,
                        bottom: Math.max(value, hasTitle ? minVerticalPadding : value)
                    })}
                    min={minVerticalPadding}
                    max={100}
                    step={1}
                    className="w-full"
                />
            </div>
        </div>
    );
} 