'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import RichText from './RichText';

interface InfoCardProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    buttonText: string;
    onNext: () => void;
}

export default function InfoCard({ icon: Icon, title, description, buttonText, onNext }: InfoCardProps) {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-green-50/50 rounded-3xl p-8 md:p-12 shadow-sm border border-green-100 flex flex-col items-center text-center"
            >
                {Icon && (
                    <div className="bg-green-100 p-4 rounded-full mb-6 text-green-700">
                        <Icon size={32} />
                    </div>
                )}

                <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                    {title}
                </h2>

                <RichText
                    content={description}
                    className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl"
                />

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onNext}
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold text-lg md:text-xl py-4 px-12 rounded-xl shadow-lg transition-colors"
                >
                    {buttonText}
                </motion.button>
            </motion.div>
        </div>
    );
}
