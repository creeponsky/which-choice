import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CircleDot, CloudRain, Square } from "lucide-react";
import { backgrounds } from "@/app/config/constants";
import { CanvasSettings } from "../types";

interface StyleSettingsProps {
    settings: CanvasSettings;
    updateSettings: <K extends keyof CanvasSettings>(key: K, value: CanvasSettings[K]) => void;
    theme: string | undefined;
}

export function StyleSettings({ settings, updateSettings, theme }: StyleSettingsProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Square className="h-4 w-4" />
                    <span>Background Style</span>
                </div>
                <Select 
                    value={settings.background} 
                    onValueChange={(value) => updateSettings('background', value)}
                >
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
                        checked={settings.showShadow}
                        onCheckedChange={(value) => updateSettings('showShadow', value)}
                        className="data-[state=checked]:bg-primary"
                    />
                </div>

                {settings.showShadow && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Shadow Intensity</span>
                        </div>
                        <Slider
                            value={[settings.shadowIntensity]}
                            onValueChange={([value]) => updateSettings('shadowIntensity', value)}
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
                    value={[settings.borderRadius]}
                    onValueChange={([value]) => updateSettings('borderRadius', value)}
                    max={50}
                    step={1}
                    className="w-full"
                />
            </div>
        </div>
    );
} 