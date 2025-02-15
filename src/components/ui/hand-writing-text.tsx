"use client";

import { motion } from "framer-motion";
interface HandWrittenTitleProps {
    title?: string;
    subtitle?: string;
    className?: string;
}

function HandWrittenTitle({
    title = "Hand Written",
    subtitle = "Optional subtitle",
    className = "",
}: HandWrittenTitleProps) {
    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] },
                opacity: { duration: 0.3 },
            },
        },
    };

    return (
        <div className={`relative w-full mx-auto py-12 ${className}`}>
            <div className="absolute inset-0">
                <motion.svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 800 300"
                    initial="hidden"
                    animate="visible"
                    className="w-full h-full"
                >
                    <title>KokonutUI</title>
                    <motion.path
                        d="M 600 45
                           C 800 150, 700 240, 400 260
                           C 175 260, 100 240, 100 150
                           C 100 60, 200 40, 400 40
                           C 550 40, 600 90, 600 90"
                        fill="none"
                        strokeWidth="8"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={draw}
                        className="text-black dark:text-white opacity-90"
                    />
                </motion.svg>
            </div>
            <div className="relative text-center z-10 flex flex-col items-center justify-center">
                <motion.h1
                    className="text-black dark:text-white tracking-tighter flex items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {title}
                </motion.h1>
                {subtitle && (
                    <motion.p
                        className="text-lg text-black/80 dark:text-white/80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
        </div>
    );
}

export { HandWrittenTitle }