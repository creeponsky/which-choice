import { ColorPicker } from "@/components/ui/color-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { LayoutGrid, SlidersHorizontal } from "lucide-react";

interface PatternSettingsProps {
    patternSettings: {
        show: boolean;
        type: "grid" | "dots" | "lines" | "none";
        color: string;
        spacing: number;
        size: number;
        calculateDynamicPatternSettings: (
            canvasWidth: number, 
            canvasHeight: number,
            baseSpacing: number,
            baseSize: number
        ) => { spacing: number; size: number };
    };
    updatePatternSettings: <K extends keyof PatternSettingsProps['patternSettings']>(
        key: K, 
        value: PatternSettingsProps['patternSettings'][K]
    ) => void;
}

export function PatternSettings({ patternSettings, updatePatternSettings }: PatternSettingsProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Show Pattern</span>
                <Switch
                    checked={patternSettings.show}
                    onCheckedChange={(value) => updatePatternSettings('show', value)}
                    className="data-[state=checked]:bg-primary"
                />
            </div>

            {patternSettings.show && (
                <>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Pattern Type</span>
                        </div>
                        <Select 
                            value={patternSettings.type} 
                            onValueChange={(value: "grid" | "dots" | "lines" | "none") => 
                                updatePatternSettings('type', value)
                            }
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
                        value={patternSettings.color}
                        onChange={(value) => updatePatternSettings('color', value)}
                        showAlpha={true}
                    />

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <SlidersHorizontal className="h-4 w-4" />
                            <span>Base Spacing</span>
                        </div>
                        <Slider
                            value={[patternSettings.spacing]}
                            onValueChange={([value]) => updatePatternSettings('spacing', value)}
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
                            value={[patternSettings.size]}
                            onValueChange={([value]) => updatePatternSettings('size', value)}
                            min={0.5}
                            max={5}
                            step={0.1}
                            className="w-full"
                        />
                    </div>
                </>
            )}
        </div>
    );
} 