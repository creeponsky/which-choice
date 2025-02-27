import { BackgroundPattern } from "@/app/types/image";
import { backgrounds } from "@/app/config/constants";

// Canvas Settings 类型定义
export interface CanvasSettings {
    background: string;
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
    shadowIntensity: number;
    exportQuality: number;
    
    // Text settings
    text: {
        fontSize: number;
        letterSpacing: number;
        letters?: string[];
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
}

// 默认设置
export const defaultCanvasSettings: CanvasSettings = {
    background: backgrounds[backgrounds.length - 1].value,
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
    shadowIntensity: 24,
    exportQuality: 0.8,
    
    text: {
        fontSize: 88,
        letterSpacing: 120,
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
    }
}; 