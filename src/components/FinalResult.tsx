'use client';

import { useEffect, useState } from 'react';
import { trackCheckout } from '@/actions/analytics';
import AdvertorialHeader from './AdvertorialHeader';
import FacebookComments from './FacebookComments';

interface FinalResultProps {
    sessionId: string | null;
}

export default function FinalResult({ sessionId }: FinalResultProps) {
    const [showButton, setShowButton] = useState(false);
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        // Set formatted date on client side to avoid hydration mismatch
        const date = new Date();
        setCurrentDate(date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }));

        // Load Vturb SDK Script
        if (!document.querySelector('script[src="https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js"]')) {
            const s = document.createElement("script");
            s.src = "https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js";
            s.async = true;
            document.head.appendChild(s);
        }

        // Delay Button (5m 33s = 333 seconds = 333000ms)
        const timer = setTimeout(() => {
            setShowButton(true);
        }, 333000);

        return () => clearTimeout(timer);
    }, []);

    const handleCheckout = () => {
        if (sessionId) {
            trackCheckout(sessionId);
        }
        console.log('Redirecting to checkout...');
    };

    const embedHtml = `
        <div id="ifr_69375d239491786676f17592_wrapper" style="margin: 0 auto; width: 100%; max-width: 400px;">
            <div style="position: relative; padding: 133.33333333333331% 0 0 0;" id="ifr_69375d239491786676f17592_aspect">
                <iframe frameborder="0" allowfullscreen src="about:blank" id="ifr_69375d239491786676f17592" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" referrerpolicy="origin" onload="this.onload=null; this.src='https://scripts.converteai.net/2d2f47c5-b088-472f-a9cf-7a9674004f30/players/69375d239491786676f17592/v4/embed.html' + (location.search || '?') + '&vl=' + encodeURIComponent(location.href)"></iframe>
            </div>
        </div>
    `;

    return (
        <div className="flex flex-col min-h-[100dvh] bg-white text-gray-900 font-sans">
            {/* 1. Fake News Navigation (Fixed Height ~50px) */}
            <AdvertorialHeader />

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-4 pb-8">

                {/* 2. Editorial Typography & Metadata */}
                <article className="mb-4">
                    <h1 className="font-serif font-bold text-xl md:text-3xl leading-tight text-gray-900 mb-2">
                        <span className="text-[#c0392b]">ALERTA MÉDICA:</span> La mayoría de las proteínas que comes podrían convertirse en <span className="bg-yellow-100 px-1">AZÚCAR</span> en lugar de músculo
                    </h1>

                    <div className="flex items-center gap-2 text-xs text-gray-500 border-b border-gray-100 pb-3 mb-3">
                        <span className="font-semibold text-gray-700">Por Dr. Javier Martínez</span>
                        <span>|</span>
                        <span>Atualizado: {currentDate}</span>
                    </div>
                </article>

                {/* 3. "Above the Fold" Video Constraint 
                    To ensure 100dvh fit on typical mobile, we minimize padding.
                */}
                <section className="w-full mb-8 bg-black rounded-lg overflow-hidden shadow-sm relative z-10">
                    <div dangerouslySetInnerHTML={{ __html: embedHtml }} className="w-full" />
                </section>

                {/* 4. CTA Button (Appears after delay) */}
                {showButton && (
                    <div className="animate-fade-in-up mt-8 mb-12 text-center">
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-[#27ae60] hover:bg-[#219150] active:bg-[#1e8449] text-white font-bold text-xl py-4 px-6 rounded-lg shadow-lg transform transition-all hover:-translate-y-0.5"
                        >
                            QUIERO ACCEDER AL PROTOCOLO
                        </button>
                    </div>
                )}

                {/* 5. Social Proof Comments */}
                <div className="mt-12 border-t border-gray-100 pt-8">
                    <FacebookComments />
                </div>
            </main>
        </div>
    );
}
