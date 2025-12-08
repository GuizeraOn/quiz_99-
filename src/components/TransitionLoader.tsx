'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface TransitionLoaderProps {
    text: string;
    duration?: number; // Duration in milliseconds
    onComplete: () => void;
}

export default function TransitionLoader({ text, duration = 2000, onComplete }: TransitionLoaderProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onComplete]);

    return (
        <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
            >
                <div className="relative mb-8">
                    {/* Ring Animation */}
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                    <motion.div
                        className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="text-secondary/20" size={24} />
                    </div>
                </div>

                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl font-serif font-bold text-gray-800 animate-pulse"
                >
                    {text}
                </motion.h3>
            </motion.div>
        </div>
    );
}
