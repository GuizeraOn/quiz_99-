'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
    progress: number;
    label: string;
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
    return (
        <div className="sticky top-[70px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-2 md:py-3 px-4 shadow-sm transition-all duration-300">
            <div className="container mx-auto max-w-2xl">
                <div className="flex justify-between items-center mb-1 md:mb-2">
                    <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider">
                        {label}
                    </span>
                    <span className="text-[10px] md:text-xs font-bold text-secondary">
                        {Math.round(progress)}%
                    </span>
                </div>
                <div className="h-1 md:h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
            </div>
        </div>
    );
}
