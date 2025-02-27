import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Palette, SquareStack, Paintbrush, CornerRightDown, Layers } from "lucide-react";
import { backgrounds } from "@/app/config/constants";
import { CanvasSettings } from "../types";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface BackgroundSettingsProps {
    settings: CanvasSettings;
    updateSettings: <K extends keyof CanvasSettings>(key: K, value: CanvasSettings[K]) => void;
    updateCustomBackground: (
        key: keyof Required<CanvasSettings>['customBackground'],
        value: any
    ) => void;
}

export function BackgroundSettings({ 
    settings, 
    updateSettings,
    updateCustomBackground
}: BackgroundSettingsProps) {
    const { theme } = useTheme();
    const [color1, setColor1] = useState(settings.customBackground?.color1 || "#ffffff");
    const [color2, setColor2] = useState(settings.customBackground?.color2 || "#f3f4f6");
    
    // Sync color picker values with settings
    useEffect(() => {
        setColor1(settings.customBackground?.color1 || "#ffffff");
        setColor2(settings.customBackground?.color2 || "#f3f4f6");
    }, [settings.customBackground?.color1, settings.customBackground?.color2]);

    // Handle color changes
    const handleColor1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor1(e.target.value);
        updateCustomBackground('color1', e.target.value);
    };
    
    const handleColor2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor2(e.target.value);
        updateCustomBackground('color2', e.target.value);
    };

    return (
        <div className="space-y-5">
            {/* Background Type Selection */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Layers className="h-4 w-4" />
                    <span>Background Type</span>
                </div>
                
                <RadioGroup 
                    value={settings.useCustomBackground ? "custom" : "preset"}
                    onValueChange={(value) => updateSettings('useCustomBackground', value === "custom")}
                    className="flex space-x-1"
                >
                    <div className="flex items-center space-x-2 rounded-md border p-2 flex-1 cursor-pointer">
                        <RadioGroupItem value="preset" id="preset" />
                        <Label htmlFor="preset" className="cursor-pointer flex items-center gap-1">
                            <SquareStack className="h-3.5 w-3.5" />
                            <span>Preset</span>
                        </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 rounded-md border p-2 flex-1 cursor-pointer">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom" className="cursor-pointer flex items-center gap-1">
                            <Palette className="h-3.5 w-3.5" />
                            <span>Custom</span>
                        </Label>
                    </div>
                </RadioGroup>
            </div>
            
            {/* Preset Backgrounds */}
            {!settings.useCustomBackground && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <SquareStack className="h-4 w-4" />
                        <span>Background Presets</span>
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
            )}
            
            {/* Custom Background Settings */}
            {settings.useCustomBackground && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Paintbrush className="h-4 w-4" />
                            <span>Background Style</span>
                        </div>
                        <Select 
                            value={settings.customBackground?.type || "solid"} 
                            onValueChange={(value) => updateCustomBackground('type', value as "solid" | "gradient")}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="solid">
                                    <div className="flex items-center gap-2">
                                        <Paintbrush className="h-3.5 w-3.5" />
                                        Solid Color
                                    </div>
                                </SelectItem>
                                <SelectItem value="gradient">
                                    <div className="flex items-center gap-2">
                                        <CornerRightDown className="h-3.5 w-3.5" />
                                        Gradient
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    {/* Solid Color */}
                    {settings.customBackground?.type === "solid" && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Palette className="h-4 w-4" />
                                <span>Background Color</span>
                            </div>
                            <input
                                type="color"
                                value={color1}
                                onChange={handleColor1Change}
                                className="w-full h-8 cursor-pointer rounded-md"
                            />
                        </div>
                    )}
                    
                    {/* Gradient */}
                    {settings.customBackground?.type === "gradient" && (
                        <>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Palette className="h-4 w-4" />
                                    <span>Start Color</span>
                                </div>
                                <input
                                    type="color"
                                    value={color1}
                                    onChange={handleColor1Change}
                                    className="w-full h-8 cursor-pointer rounded-md"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Palette className="h-4 w-4" />
                                    <span>End Color</span>
                                </div>
                                <input
                                    type="color"
                                    value={color2}
                                    onChange={handleColor2Change}
                                    className="w-full h-8 cursor-pointer rounded-md"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CornerRightDown className="h-4 w-4" />
                                    <span>Gradient Angle</span>
                                </div>
                                <Slider
                                    value={[settings.customBackground?.gradientAngle || 135]}
                                    onValueChange={([value]) => updateCustomBackground('gradientAngle', value)}
                                    min={0}
                                    max={360}
                                    step={15}
                                    className="w-full"
                                />
                                <div className="text-xs text-muted-foreground">
                                    {settings.customBackground?.gradientAngle || 135}° angle
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}