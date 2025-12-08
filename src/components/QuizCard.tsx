'use client';

import { motion } from 'framer-motion';
import { Option } from '@/data/quizData';
import { useState } from 'react';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

import RichText from './RichText';

interface QuizCardProps {
    question: string;
    options: Option[];
    onSelect: (option: Option) => void;
}

export default function QuizCard({ question, options, onSelect }: QuizCardProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Check if this step has images for at least one option. 
    // If so, we use the grid layout mode.
    const hasImages = options.some(opt => opt.imageUrl);

    const handleSelect = (option: Option) => {
        if (selectedId) return; // Prevent double clicks
        setSelectedId(option.id);

        // Add small delay for visual feedback before transitioning
        setTimeout(() => {
            onSelect(option);
            setSelectedId(null);
        }, 400);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-10">
            <motion.div
                key={question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 md:mb-10"
            >
                <RichText
                    content={question}
                    className="text-xl md:text-3xl font-serif font-bold text-primary leading-snug md:leading-relaxed text-center md:text-left"
                />
            </motion.div>

            <div className={clsx(
                "gap-4",
                hasImages ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col space-y-4 md:space-y-0 md:gap-4"
            )}>
                {options.map((option, index) => (
                    <motion.button
                        key={option.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        onClick={() => handleSelect(option)}
                        disabled={selectedId !== null}
                        className={clsx(
                            "text-left rounded-2xl border-2 transition-all duration-200 relative overflow-hidden group w-full min-h-[56px] active:scale-[0.98] active:bg-orange-100",
                            // Layout specific styles
                            hasImages ? "flex flex-col h-full bg-white hover:shadow-lg" : "px-6 py-4 bg-white hover:shadow-sm",
                            // Selection state
                            selectedId === option.id
                                ? "border-secondary ring-1 ring-secondary bg-orange-50"
                                : "border-gray-200 hover:border-secondary/50 hover:bg-gray-50",
                            selectedId !== null && selectedId !== option.id && "opacity-50 blur-[1px]"
                        )}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        {/* Image Section for Grid Layout */}
                        {hasImages && option.imageUrl && (
                            <div className="relative w-full h-48 md:h-56 bg-gray-100 overflow-hidden">
                                <Image
                                    src={option.imageUrl}
                                    alt={option.label.replace(/<[^>]*>?/gm, '')} // Strip HTML for alt text
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        )}
                        {/* Fallback for grid items without image - keep consistent height/space */}
                        {hasImages && !option.imageUrl && (
                            <div className="w-full h-48 md:h-56 bg-gray-50 flex items-center justify-center text-gray-300">
                                <span className="text-sm">No Image</span>
                            </div>
                        )}

                        <div className={clsx(
                            "flex items-center justify-between",
                            hasImages ? "p-4 md:p-5 grow" : ""
                        )}>
                            <RichText
                                content={option.label}
                                className={clsx(
                                    "font-sans transition-colors pr-4",
                                    hasImages ? "text-base md:text-lg" : "text-base md:text-xl", // Mobile text base
                                    selectedId === option.id ? "text-secondary font-bold" : "text-text-main font-medium"
                                )}
                            />

                            <div className={clsx(
                                "rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                                hasImages ? "w-6 h-6 min-w-[24px]" : "w-8 h-8 min-w-[32px]",
                                selectedId === option.id
                                    ? "border-secondary bg-secondary"
                                    : "border-gray-300 group-hover:border-secondary/50"
                            )}>
                                {selectedId === option.id ? (
                                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                                ) : (
                                    <ChevronRight size={hasImages ? 14 : 16} className="text-gray-300 group-hover:text-secondary/50" />
                                )}
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
