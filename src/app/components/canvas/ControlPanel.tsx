import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Image,
    Layout,
    LayoutGrid,
    Palette,
    SquareCode,
    Text,
    Type
} from "lucide-react";
import { useTheme } from 'next-themes';
import { useEffect } from "react";
import { BorderSettings } from "./panels/BorderSettings";
import { LayoutSettings } from "./panels/LayoutSettings";
import { PatternSettings } from "./panels/PatternSettings";
import { StyleSettings } from "./panels/StyleSettings";
import { TextSettings } from "./panels/TextSettings";
import { TitleSettings } from "./panels/TitleSettings";
import { WatermarkSettings } from "./panels/WatermarkSettings";
import { CanvasSettings } from "./types";

interface ControlPanelProps {
    settings: CanvasSettings;
    setSettings: React.Dispatch<React.SetStateAction<CanvasSettings>>;
    letters: string[];
    setLetters: React.Dispatch<React.SetStateAction<string[]>>;
    imagesCount: number;
}

export function ControlPanel({ 
    settings, 
    setSettings,
    letters,
    setLetters,
    imagesCount 
}: ControlPanelProps) {
    const { theme } = useTheme();
    
    // Ensure colors are in sync with theme
    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            title: {
                ...prev.title,
                color: theme === 'dark' ? "#ffffff" : "#18181b",
                gradientColor: theme === 'dark' ? "#cccccc" : "#666666"
            },
            border: {
                ...prev.border,
                color: theme === 'dark' ? "#ffffff" : "#18181b"
            }
        }));
    }, [theme, setSettings]);

    // Update specific settings
    const updateSettings = <K extends keyof CanvasSettings>(
        key: K,
        value: CanvasSettings[K]
    ) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Update nested settings
    const updateNestedSettings = <
        K extends keyof CanvasSettings,
        N extends keyof CanvasSettings[K]
    >(
        key: K,
        nestedKey: N,
        value: CanvasSettings[K][N]
    ) => {
        setSettings(prev => ({
            ...prev,
            [key]: {
                ...(prev[key] as any),
                [nestedKey]: value
            }
        }));
    };
    
    // Update custom background settings
    const updateCustomBackground = <K extends keyof NonNullable<CanvasSettings['customBackground']>>(
        key: K,
        value: NonNullable<CanvasSettings['customBackground']>[K]
    ) => {
        setSettings(prev => ({
            ...prev,
            customBackground: {
                ...(prev.customBackground || { type: 'solid', color1: '#ffffff', color2: '#cccccc', gradientAngle: 45 }),
                [key]: value
            }
        }));
    };

    return (
        <Card className="w-80 p-4">
            <Tabs defaultValue="layout" className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                    <TabsTrigger value="layout">
                        <Layout className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="style">
                        <Palette className="h-4 w-4" />
                    </TabsTrigger>
                    {/* <TabsTrigger value="background">
                        <SquareDot className="h-4 w-4" />
                    </TabsTrigger> */}
                    <TabsTrigger value="text">
                        <Type className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="title">
                        <Text className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="pattern">
                        <LayoutGrid className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="border">
                        <SquareCode className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="watermark">
                        <Image className="h-4 w-4" />
                    </TabsTrigger>
                </TabsList>

                {/* 布局设置 */}
                <TabsContent value="layout" className="mt-4">
                    <LayoutSettings 
                        padding={settings.padding}
                        setPadding={(newPadding) => updateSettings('padding', newPadding)}
                        hasTitle={Boolean(settings.title.text)}
                        layoutDirection={settings.layoutDirection}
                        setLayoutDirection={(direction) => updateSettings('layoutDirection', direction)}
                        textPosition={settings.textPosition}
                        setTextPosition={(position) => updateSettings('textPosition', position)}
                    />
                </TabsContent>

                {/* 样式设置 */}
                <TabsContent value="style" className="mt-4">
                    <StyleSettings 
                        settings={settings}
                        updateSettings={updateSettings}
                        updateCustomBackground={updateCustomBackground}
                    />
                </TabsContent>
                
                {/* 背景设置 */}
                {/* <TabsContent value="background" className="mt-4">
                    <BackgroundSettings 
                        settings={settings}
                        updateSettings={updateSettings}
                    />
                </TabsContent> */}

                {/* 文本设置 */}
                <TabsContent value="text" className="mt-4">
                    <TextSettings 
                        showText={settings.showText}
                        setShowText={(value) => updateSettings('showText', value)}
                        fontSize={settings.text.fontSize}
                        setFontSize={(value) => updateNestedSettings('text', 'fontSize', value)}
                        letterSpacing={settings.text.letterSpacing}
                        setLetterSpacing={(value) => updateNestedSettings('text', 'letterSpacing', value)}
                        letters={letters}
                        setLetters={setLetters}
                        imagesCount={imagesCount}
                        textColor={settings.text.color}
                        setTextColor={(value) => updateNestedSettings('text', 'color', value)}
                        textGradientColor={settings.text.gradientColor}
                        setTextGradientColor={(value) => updateNestedSettings('text', 'gradientColor', value)}
                        useGradient={settings.text.useGradient}
                        setUseGradient={(value) => updateNestedSettings('text', 'useGradient', value)}
                        letterColors={settings.text.letterColors || {}}
                        setLetterColors={(value) => {
                            if (typeof value === 'function') {
                                const newValue = value(settings.text.letterColors || {});
                                updateNestedSettings('text', 'letterColors', newValue);
                            } else {
                                updateNestedSettings('text', 'letterColors', value);
                            }
                        }}
                        
                    />
                </TabsContent>

                {/* 标题设置 */}
                <TabsContent value="title" className="mt-4">
                    <TitleSettings
                        titleSettings={settings.title}
                        updateTitleSettings={(key, value) => updateNestedSettings('title', key, value)}
                    />
                </TabsContent>

                {/* 图案设置 */}
                <TabsContent value="pattern" className="mt-4">
                    <PatternSettings 
                        patternSettings={settings.pattern}
                        updatePatternSettings={(key, value) => updateNestedSettings('pattern', key, value)}
                    />
                </TabsContent>

                {/* 边框设置 */}
                <TabsContent value="border" className="mt-4">
                    <BorderSettings 
                        borderSettings={settings.border}
                        updateBorderSettings={(key, value) => updateNestedSettings('border', key, value)}
                    />
                </TabsContent>

                {/* 水印设置 */}
                <TabsContent value="watermark" className="mt-4">
                    <WatermarkSettings 
                        showWatermark={settings.showWatermark}
                        setShowWatermark={(value) => updateSettings('showWatermark', value)}
                        watermarkSize={settings.watermarkSize}
                        setWatermarkSize={(value) => updateSettings('watermarkSize', value)}
                        watermarkOpacity={settings.watermarkOpacity || 1}
                        setWatermarkOpacity={(value) => updateSettings('watermarkOpacity', value)}
                        exportQuality={settings.exportQuality}
                        setExportQuality={(value) => updateSettings('exportQuality', value)}
                    />
                </TabsContent>
            </Tabs>
        </Card>
    );
} 