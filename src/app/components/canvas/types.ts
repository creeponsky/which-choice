import { BackgroundPattern } from "@/app/types/image";
import { backgrounds } from "@/app/config/constants";

// Canvas Settings 类型定义
export interface CanvasSettings {
    background: string;
    customBackground?: {
        type: "solid" | "gradient";
        color1: string;
        color2?: string;
        gradientAngle?: number;
    };
    useCustomBackground: boolean;
    showShadow: boolean;
    borderRadius: number;
    padding: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    showWatermark: boolean;
    watermarkSize: number;
    watermarkOpacity: number;
    shadowIntensity: number;
    exportQuality: number;
    
    // Text settings
    text: {
        fontSize: number;
        letterSpacing: number;
        letters?: string[];
        color: string;
        gradientColor: string;
        useGradient: boolean;
        letterColors?: Record<number, {
            color: string;
            gradientColor?: string;
            useGradient?: boolean;
        }>;
    };
    
    // Title settings
    title: {
        text: string;
        fontSize: number;
        color: string;
        gradientColor: string;
        useGradient: boolean;
        topSpacing: number;
        bottomSpacing: number;
        calculateDynamicTitleSize: (canvasWidth: number, baseSize: number) => number;
    };
    
    // Pattern settings
    pattern: {
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
    
    // Border settings
    border: {
        show: boolean;
        width: number;
        color: string;
        padding: number;
        borderRadius: number;
    };
    
    // 添加布局类型设置
    layoutDirection: "horizontal" | "vertical";
    
    // 文字位置设置
    textPosition: "top" | "bottom";
}

// 默认设置
export const defaultCanvasSettings: CanvasSettings = {
    background: backgrounds[backgrounds.length - 1].value,
    customBackground: {
        type: "solid",
        color1: "#ffffff",
        color2: "#f3f4f6",
        gradientAngle: 135
    },
    useCustomBackground: false,
    showShadow: true,
    borderRadius: 36,
    padding: {
        top: 20,
        right: 20,
        bottom: 40,
        left: 20
    },
    showWatermark: true,
    watermarkSize: 24,
    watermarkOpacity: 1,
    shadowIntensity: 24,
    exportQuality: 0.8,
    
    text: {
        fontSize: 88,
        letterSpacing: 120,
        color: "#ffffff", // 默认白色
        gradientColor: "#cccccc", // 默认浅灰色渐变
        useGradient: false,
        letterColors: {},
    },
    
    title: {
        text: "",
        fontSize: 48,
        color: "#ffffff", // 默认会根据主题动态更改
        gradientColor: "#cccccc", // 默认会根据主题动态更改
        useGradient: false,
        topSpacing: 30,
        bottomSpacing: 20,
        calculateDynamicTitleSize: (canvasWidth: number, baseSize: number): number => {
            return Math.min(Math.max(baseSize, canvasWidth * 0.03), baseSize * 2);
        }
    },
    
    pattern: {
        show: false,
        type: "grid",
        color: 'rgba(51, 51, 51, 0.5)',
        spacing: 20,
        size: 1,
        calculateDynamicPatternSettings: (
            canvasWidth: number, 
            canvasHeight: number,
            baseSpacing: number,
            baseSize: number
        ) => {
            const maxDimension = Math.max(canvasWidth, canvasHeight);
            const scaleFactor = maxDimension > 2000 ? maxDimension / 2000 : 1;
            
            return {
                spacing: baseSpacing * scaleFactor,
                size: baseSize * scaleFactor
            };
        }
    },
    
    border: {
        show: false,
        width: 2,
        color: "#ffffff",
        padding: 20,
        borderRadius: 36
    },
    
    layoutDirection: "horizontal",
    textPosition: "bottom"
}; 