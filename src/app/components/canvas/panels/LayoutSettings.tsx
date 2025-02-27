import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, CornerUpLeft, ArrowRight, ArrowDown, ArrowUp, CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
    layoutDirection: "horizontal" | "vertical";
    setLayoutDirection: (direction: "horizontal" | "vertical") => void;
    textPosition: "top" | "bottom";
    setTextPosition: (position: "top" | "bottom") => void;
}

export function LayoutSettings({ 
    padding, 
    setPadding, 
    hasTitle = false,
    layoutDirection,
    setLayoutDirection,
    textPosition,
    setTextPosition
}: LayoutSettingsProps) {
    const minVerticalPadding = hasTitle ? 25 : 10;
    
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">Layout Direction</Label>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={layoutDirection === "horizontal" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLayoutDirection("horizontal")}
                        className="flex-1"
                    >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Horizontal
                    </Button>
                    <Button
                        variant={layoutDirection === "vertical" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLayoutDirection("vertical")}
                        className="flex-1"
                    >
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Vertical
                    </Button>
                </div>
            </div>
            
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">Letter Position</Label>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={textPosition === "top" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTextPosition("top")}
                        className="flex-1"
                    >
                        <ArrowUp className="h-4 w-4 mr-2" />
                        Top
                    </Button>
                    <Button
                        variant={textPosition === "bottom" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTextPosition("bottom")}
                        className="flex-1"
                    >
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Bottom
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Horizontal Padding</span>
                </div>
                <Slider
                    value={[padding.left]}
                    onValueChange={([value]) => {
                        const newPadding = {...padding, left: value, right: value};
                        setPadding(newPadding);
                    }}
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
                    onValueChange={([value]) => {
                        const newValue = Math.max(value, hasTitle ? minVerticalPadding : value);
                        const newPadding = {...padding, top: newValue};
                        setPadding(newPadding);
                    }}
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
                    <CornerDownRight className="h-4 w-4" />
                    <span>Bottom Padding</span>
                </div>
                <Slider
                    value={[padding.bottom]}
                    onValueChange={([value]) => {
                        const newPadding = {...padding, bottom: value};
                        setPadding(newPadding);
                    }}
                    min={10}
                    max={100}
                    step={1}
                    className="w-full"
                />
            </div>
        </div>
    );
} 