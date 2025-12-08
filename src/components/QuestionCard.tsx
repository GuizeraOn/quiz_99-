'use client';

import { motion } from 'framer-motion';
import { Option } from '@/data/quizData';
import { useState } from 'react';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';

interface QuizCardProps {
    question: string;
    options: Option[];
    onSelect: (option: Option) => void;
}

export default function QuizCard({ question, options, onSelect }: QuizCardProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelect = (option: Option) => {
        if (selectedId) return; // Prevent double clicks
        setSelectedId(option.id);

        // Add small delay for visual feedback before transitioning
        setTimeout(() => {
            onSelect(option);
            setSelectedId(null); // Reset selection for next question (although key change usually handles this)
        }, 400);
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-6 md:py-10">
            <motion.h2
                key={question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-serif font-bold text-primary mb-8 leading-snug"
            >
                {question}
            </motion.h2>

            <div className="flex flex-col gap-4">
                {options.map((option, index) => (
                    <motion.button
                        key={option.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        onClick={() => handleSelect(option)}
                        disabled={selectedId !== null}
                        className={clsx(
                            "w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden group",
                            selectedId === option.id
                                ? "border-secondary bg-orange-50 shadow-md ring-1 ring-secondary"
                                : "border-gray-200 bg-white hover:border-secondary/50 hover:bg-gray-50 hover:shadow-sm",
                            selectedId !== null && selectedId !== option.id && "opacity-50 blur-[1px]"
                        )}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <div className="flex items-center justify-between">
                            <span className={clsx(
                                "text-lg md:text-xl font-sans font-medium transition-colors pr-4",
                                selectedId === option.id ? "text-secondary font-bold" : "text-text-main"
                            )}>
                                {option.label}
                            </span>
                            <div className={clsx(
                                "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors min-w-[32px]",
                                selectedId === option.id
                                    ? "border-secondary bg-secondary"
                                    : "border-gray-300 group-hover:border-secondary/50"
                            )}>
                                {selectedId === option.id ? (
                                    <div className="w-3 h-3 bg-white rounded-full" />
                                ) : (
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-secondary/50" />
                                )}
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
