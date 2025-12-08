'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface LoadingDiagnosisProps {
    loadingText: string[];
    onComplete: () => void;
}

export default function LoadingDiagnosis({ loadingText, onComplete }: LoadingDiagnosisProps) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Start processing steps
        const stepDuration = 2000; // 2 seconds per step

        // We want to show step 0 as processing, then checked. Then step 1 processing, then checked.
        // Total time = steps * duration.

        const timer = setInterval(() => {
            setCurrentStep((prev) => prev + 1);
        }, stepDuration);

        const matchTimer = setTimeout(() => {
            onComplete();
        }, stepDuration * loadingText.length + 1000); // 1s buffer at the end

        return () => {
            clearInterval(timer);
            clearTimeout(matchTimer);
        };
    }, [loadingText, onComplete]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 max-w-xl mx-auto w-full">
            <div className="w-full space-y-4">
                <h2 className="text-2xl font-serif font-bold text-center text-primary mb-8 animate-pulse">
                    Generando su diagnóstico médico...
                </h2>

                {loadingText.map((text, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                            opacity: currentStep >= index ? 1 : 0.5,
                            y: 0,
                        }}
                        className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="shrink-0">
                            {currentStep > index ? (
                                <CheckCircle2 className="text-green-500 w-6 h-6" />
                            ) : currentStep === index ? (
                                <Loader2 className="text-secondary w-6 h-6 animate-spin" />
                            ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-gray-200" />
                            )}
                        </div>
                        <span className={`text-lg font-sans ${currentStep >= index ? 'text-text-main font-medium' : 'text-gray-400'}`}>
                            {text}
                        </span>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                    className="h-full bg-secondary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 * loadingText.length + 1, ease: "linear" }}
                />
            </div>
        </div>
    );
}
