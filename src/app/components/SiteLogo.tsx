"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SiteLogoProps {
  variant?: "glassmorphism" | "contrast";
  showDownloadButton?: boolean;
}

export function SiteLogo({ variant = "glassmorphism", showDownloadButton = true }: SiteLogoProps) {
  // 可以添加内部状态来切换variant
  const [currentVariant, setCurrentVariant] = useState(variant);

  const handleDownload = () => {
    const logoContainer = document.getElementById("logo-container");
    if (logoContainer) {
      import("html2canvas").then((html2canvas) => {
        html2canvas
          .default(logoContainer, {
            scale: 3,
            backgroundColor: null,
            useCORS: true,
            allowTaint: true,
          })
          .then((canvas) => {
            const link = document.createElement("a");
            link.download = "which-choice-logo.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
          });
      });
    }
  };

  return (
    <div className="flex items-center">
      <div id="logo-container" className="inline-flex items-center">
        {currentVariant === "glassmorphism" ? (
          // 毛玻璃效果版本
          <div className="relative flex items-center gap-1 sm:gap-2 rounded-xl p-1.5 sm:p-2.5 border border-zinc-200 dark:border-zinc-700 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 shadow-sm group hover:shadow-md transition-all duration-300">
            {/* Regular dots background pattern */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <div className="w-full h-full">
                {Array.from({ length: 6 }).map((_, row) => (
                  <div key={`row-${row}`} className="flex justify-around">
                    {Array.from({ length: 12 }).map((_, col) => (
                      <div
                        key={`dot-${row}-${col}`}
                        className="w-1 h-1 mt-2 mx-1 rounded-full bg-zinc-300 dark:bg-zinc-500"
                        style={{
                          opacity: 0.3,
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Left side (which) with enhanced glassmorphism */}
            <div className="relative px-2 py-1 rounded-lg backdrop-blur-md bg-zinc-200/40 dark:bg-zinc-700/40 z-10 shadow-sm group-hover:shadow transition-all duration-300">
              <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-zinc-700 dark:text-zinc-200">
                which
              </span>
            </div>

            {/* Right side (choice) with enhanced glassmorphism */}
            <div className="relative px-2 py-1 rounded-lg backdrop-blur-md bg-zinc-100/40 dark:bg-zinc-800/40 z-10 shadow-sm group-hover:shadow transition-all duration-300">
              <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                choice
              </span>
            </div>

            {/* Question mark inside the container */}
            <div className="relative ml-1 mr-1 z-10">
              <span className="text-xl sm:text-2xl md:text-3xl font-serif italic text-zinc-700 dark:text-zinc-300">
                ?
              </span>
            </div>
          </div>
        ) : (
          // 高对比度版本
          <div className="relative flex items-center gap-1 sm:gap-2 rounded-xl p-1 sm:p-2 border border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 shadow-sm">
            {/* Grid background pattern */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <div className="w-full h-full grid grid-cols-8 grid-rows-2 opacity-10 pointer-events-none">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-zinc-400 dark:border-zinc-600"></div>
                ))}
              </div>
            </div>

            {/* Left side (which) */}
            <div className="relative px-2 py-1 rounded-lg bg-zinc-800 dark:bg-zinc-300 z-10">
              <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-zinc-100 dark:text-zinc-900">
                which
              </span>
            </div>

            {/* Right side (choice) */}
            <div className="relative px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-700 z-10">
              <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                choice
              </span>
            </div>

            {/* Question mark inside the container */}
            <div className="relative ml-1 mr-1 z-10">
              <span className="text-xl sm:text-2xl md:text-3xl font-serif italic text-zinc-700 dark:text-zinc-300">
                ?
              </span>
            </div>
          </div>
        )}
      </div>

      {/* {showDownloadButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
          className="ml-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          title="Download logo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </Button>
      )} */}
    </div>
  );
}
