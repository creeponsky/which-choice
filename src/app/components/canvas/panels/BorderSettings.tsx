import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "@/components/ui/color-picker";
import { Square, Palette, SquareCode, ArrowDownUp } from "lucide-react";
import { useTheme } from 'next-themes';

interface BorderSettingsProps {
    borderSettings: {
        show: boolean;
        width: number;
        color: string;
        padding: number;
        borderRadius: number;
    };
    updateBorderSettings: <K extends keyof BorderSettingsProps['borderSettings']>(
        key: K,
        value: BorderSettingsProps['borderSettings'][K]
    ) => void;
}

export function BorderSettings({
    borderSettings,
    updateBorderSettings
}: BorderSettingsProps) {
    const { theme } = useTheme();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Square className="h-4 w-4" />
                    <span>Show Border</span>
                </div>
                <Switch
                    checked={borderSettings.show}
                    onCheckedChange={(checked) => updateBorderSettings('show', checked)}
                />
            </div>

            {borderSettings.show && (
                <>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Square className="h-4 w-4" />
                            <span>Border Width</span>
                        </div>
                        <Slider
                            value={[borderSettings.width]}
                            onValueChange={([value]) => updateBorderSettings('width', value)}
                            min={1}
                            max={20}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ArrowDownUp className="h-4 w-4" />
                            <span>Border Padding</span>
                        </div>
                        <Slider
                            value={[borderSettings.padding]}
                            onValueChange={([value]) => updateBorderSettings('padding', value)}
                            min={0}
                            max={50}
                            step={1}
                            className="w-full"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                            Space between canvas edge and border
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <SquareCode className="h-4 w-4" />
                            <span>Border Radius</span>
                        </div>
                        <Slider
                            value={[borderSettings.borderRadius]}
                            onValueChange={([value]) => updateBorderSettings('borderRadius', value)}
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    <ColorPicker
                        label="Border Color"
                        value={borderSettings.color}
                        onChange={(value) => updateBorderSettings('color', value)}
                        showAlpha={true}
                    />
                </>
            )}
        </div>
    );
}