'use client';

import { useState, useEffect, useRef } from 'react';
import { QUIZ_DATA, Option } from '@/data/quizData';
import QuizCard from './QuizCard';
import InfoCard from './InfoCard';
import TransitionLoader from './TransitionLoader';
import { startSession, trackProgress, completeSession } from '@/actions/analytics';

import ProgressBar from './ProgressBar';
import LoadingDiagnosis from './LoadingDiagnosis';
import FinalResult from './FinalResult';
import Header from './Header';
import { AnimatePresence, motion } from 'framer-motion';

export default function QuizContainer() {
    const [currentIndex, setCurrentIndex] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isCompleted, setIsCompleted] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [startTime] = useState(Date.now());

    // Analytics
    const sessionIdRef = useRef<string | null>(null);

    useEffect(() => {
        setIsClient(true);

        // Start Session
        const initSession = async () => {
            const id = await startSession(QUIZ_DATA.length);
            if (id) sessionIdRef.current = id;
        };
        initSession();
    }, []);

    if (!isClient) return null; // Avoid hydration mismatch

    const currentStep = QUIZ_DATA[currentIndex];

    // Calculate progress logic
    const totalQuestions = QUIZ_DATA.filter(q => q.type !== 'loading').length;
    // Progress formula: (current / total) * 100
    // minimal progress 5%
    const progressPercentage = Math.min(100, Math.round(((currentIndex) / totalQuestions) * 100) + 5);

    // Generic Next Step Handler
    const handleNext = () => {
        // Track generic steps (interactions without explicit option value)
        if (sessionIdRef.current) {
            // Only track 'viewed' if it's NOT a question (because questions track their own answers)
            if (currentStep.type !== 'question') {
                trackProgress(sessionIdRef.current, currentIndex + 1, 'viewed', currentStep.id);
            }
        }

        if (currentIndex < QUIZ_DATA.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handleAnswer = (option: Option) => {
        setAnswers(prev => ({ ...prev, [currentStep.id]: option.value }));

        // Track Answer
        if (sessionIdRef.current) {
            trackProgress(sessionIdRef.current, currentIndex + 1, option.value, currentStep.id);
        }

        handleNext();
    };

    const handleLoadingComplete = () => {
        if (sessionIdRef.current) {
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            completeSession(sessionIdRef.current, totalTime);
        }
        setIsCompleted(true);
    };

    if (isCompleted) {
        return <FinalResult sessionId={sessionIdRef.current} />;
    }

    // Special Case: Final Checklist Loading Screen
    if (currentStep.type === 'loading') {
        return (
            <>
                <Header />
                <LoadingDiagnosis
                    loadingText={currentStep.loadingText || []}
                    onComplete={handleLoadingComplete}
                />
            </>
        );
    }

    const renderStepContent = () => {
        switch (currentStep.type) {
            case 'question':
                return (
                    <QuizCard
                        question={currentStep.question}
                        options={currentStep.options || []}
                        onSelect={handleAnswer}
                    />
                );
            case 'info':
                return (
                    <InfoCard
                        title={currentStep.title}
                        description={currentStep.description}
                        buttonText={currentStep.buttonText}
                        icon={currentStep.icon}
                        onNext={handleNext}
                    />
                );
            case 'loader':
                return (
                    <TransitionLoader
                        text={currentStep.text}
                        duration={currentStep.duration}
                        onComplete={handleNext}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Header />
            <div className="w-full flex flex-col items-center">
                <ProgressBar progress={progressPercentage} label={currentStep.progressBarText} />

                <div className="w-full max-w-3xl mt-4 md:mt-8 mb-20 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-full"
                        >
                            {renderStepContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}
