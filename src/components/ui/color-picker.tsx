"use client"

import { useState, useEffect } from "react"
import { Label } from "./label"
import { Input } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  className?: string
  showAlpha?: boolean
}

export function ColorPicker({ 
  value, 
  onChange, 
  label, 
  className,
  showAlpha = false 
}: ColorPickerProps) {
  const [colorValue, setColorValue] = useState(value || "#000000")
  const [alpha, setAlpha] = useState(1)

  useEffect(() => {
    // Handle color updates from parent
    if (value.startsWith('rgba')) {
      const match = value.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
      if (match) {
        const [, r, g, b, a] = match
        setAlpha(parseFloat(a))
        // Convert RGB to HEX for the color picker
        const hexColor = rgbToHex(parseInt(r), parseInt(g), parseInt(b))
        setColorValue(hexColor)
      }
    } else {
      setColorValue(value)
    }
  }, [value])

  // Helper to convert rgb to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  }

  // Helper to convert hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : { r: 0, g: 0, b: 0 }
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setColorValue(newColor)
    
    if (showAlpha) {
      const { r, g, b } = hexToRgb(newColor)
      onChange(`rgba(${r}, ${g}, ${b}, ${alpha})`)
    } else {
      onChange(newColor)
    }
  }

  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAlpha = parseFloat(e.target.value)
    setAlpha(newAlpha)
    
    const { r, g, b } = hexToRgb(colorValue)
    onChange(`rgba(${r}, ${g}, ${b}, ${newAlpha})`)
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <Label className="text-sm font-medium text-muted-foreground">{label}</Label>}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <div 
              className="h-8 w-8 rounded-md border shadow cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
              style={{ 
                backgroundColor: showAlpha 
                  ? `rgba(${hexToRgb(colorValue).r}, ${hexToRgb(colorValue).g}, ${hexToRgb(colorValue).b}, ${alpha})`
                  : colorValue,
                borderColor: 'rgba(0,0,0,0.2)'
              }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 shadow-lg">
            <div className="space-y-3">
              <input
                type="color"
                value={colorValue}
                onChange={handleColorChange}
                className="h-32 w-40 cursor-pointer"
              />
              
              {showAlpha && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Opacity: {Math.round(alpha * 100)}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={alpha}
                    onChange={handleAlphaChange}
                    className="w-full h-2 bg-gradient-to-r from-transparent to-current rounded-md appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, transparent, ${colorValue})`
                    }}
                  />
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        <Input
          type="text"
          value={showAlpha 
            ? `rgba(${hexToRgb(colorValue).r}, ${hexToRgb(colorValue).g}, ${hexToRgb(colorValue).b}, ${alpha})`
            : colorValue}
          onChange={handleColorChange}
          className="h-8 flex-1 text-sm font-mono"
        />
      </div>
    </div>
  )
}