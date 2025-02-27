import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { FormItem, FormLabel } from "@/components/ui/form";

interface WatermarkSettingsProps {
    showWatermark: boolean;
    setShowWatermark: (value: boolean) => void;
    watermarkSize: number;
    setWatermarkSize: (value: number) => void;
    watermarkOpacity: number;
    setWatermarkOpacity: (value: number) => void;
    exportQuality: number;
    setExportQuality: (value: number) => void;
}

export function WatermarkSettings({
    showWatermark,
    setShowWatermark,
    watermarkSize,
    setWatermarkSize,
    watermarkOpacity,
    setWatermarkOpacity,
    exportQuality,
    setExportQuality
}: WatermarkSettingsProps) {
    return (
        <div className="space-y-4">
            <div className="text-sm font-medium mb-4 text-muted-foreground">Watermark Settings</div>
            
            <div className="flex items-center justify-between">
                <Label htmlFor="showWatermark" className="text-sm text-muted-foreground">Show Watermark</Label>
                <Switch
                    id="showWatermark"
                    checked={showWatermark}
                    onCheckedChange={setShowWatermark}
                />
            </div>
            
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">Watermark Size</Label>
                    <span className="text-xs text-muted-foreground">{watermarkSize}px</span>
                </div>
                <Slider
                    value={[watermarkSize]}
                    min={12}
                    max={48}
                    step={1}
                    onValueChange={(value) => setWatermarkSize(value[0])}
                    disabled={!showWatermark}
                />
            </div>
            
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">Opacity</Label>
                    <span className="text-xs text-muted-foreground">{Math.round(watermarkOpacity * 100)}%</span>
                </div>
                <Slider
                    value={[watermarkOpacity]}
                    min={0.1}
                    max={1}
                    step={0.05}
                    onValueChange={(value) => setWatermarkOpacity(value[0])}
                    disabled={!showWatermark}
                />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">Export Quality</Label>
                    <span className="text-xs text-muted-foreground">{Math.round(exportQuality * 100)}%</span>
                </div>
                <Slider
                    value={[exportQuality]}
                    min={0.1}
                    max={1}
                    step={0.1}
                    onValueChange={(value) => setExportQuality(value[0])}
                />
                <div className="text-xs text-muted-foreground mt-1">
                    Lower quality results in smaller file size (JPEG). 100% exports as PNG.
                </div>
            </div>
        </div>
    );
}