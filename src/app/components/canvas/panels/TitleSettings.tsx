import { ColorPicker } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ArrowDownUp, Palette, Text, TextCursor } from "lucide-react";

interface TitleSettingsProps {
    titleSettings: {
        text: string;
        fontSize: number;
        color: string;
        gradientColor: string;
        useGradient: boolean;
        topSpacing: number;
        bottomSpacing: number;
        calculateDynamicTitleSize: (canvasWidth: number, baseSize: number) => number;
    };
    updateTitleSettings: <K extends keyof TitleSettingsProps['titleSettings']>(
        key: K, 
        value: TitleSettingsProps['titleSettings'][K]
    ) => void;
}

export function TitleSettings({ titleSettings, updateTitleSettings }: TitleSettingsProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Text className="h-4 w-4" />
                    <span>Title Text</span>
                </div>
                <Input
                    type="text"
                    value={titleSettings.text}
                    onChange={(e) => updateTitleSettings('text', e.target.value)}
                    placeholder="Enter title..."
                    className="w-full"
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TextCursor className="h-4 w-4" />
                    <span>Base Font Size</span>
                </div>
                <Slider
                    value={[titleSettings.fontSize]}
                    onValueChange={([value]) => updateTitleSettings('fontSize', value)}
                    min={16}
                    max={160}
                    step={1}
                    className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-1">
                    Font will scale automatically for larger images
                </div>
            </div>
            
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowDownUp className="h-4 w-4" />
                    <span>Title Spacing</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-xs mb-1 block">Top</Label>
                        <Slider
                            value={[titleSettings.topSpacing]}
                            onValueChange={([value]) => updateTitleSettings('topSpacing', value)}
                            min={10}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Label className="text-xs mb-1 block">Bottom</Label>
                        <Slider
                            value={[titleSettings.bottomSpacing]}
                            onValueChange={([value]) => updateTitleSettings('bottomSpacing', value)}
                            min={10}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Use Gradient</span>
                    <Switch
                        checked={titleSettings.useGradient}
                        onCheckedChange={(value) => updateTitleSettings('useGradient', value)}
                        className="data-[state=checked]:bg-primary"
                    />
                </div>

                <ColorPicker
                    label="Title Color"
                    value={titleSettings.color}
                    onChange={(value) => updateTitleSettings('color', value)}
                />

                {titleSettings.useGradient && (
                    <ColorPicker
                        label="Gradient Color"
                        value={titleSettings.gradientColor}
                        onChange={(value) => updateTitleSettings('gradientColor', value)}
                    />
                )}
            </div>
        </div>
    );
} 