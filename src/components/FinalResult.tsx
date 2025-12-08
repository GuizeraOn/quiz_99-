'use client';

import { useEffect, useState } from 'react';

export default function FinalResult() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
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

    const embedHtml = `
        <div id="ifr_6935c6812200385961f4429d_wrapper" style="margin: 0 auto; width: 100%; max-width: 400px;">
            <div style="position: relative; padding: 177.77777777777777% 0 0 0;" id="ifr_6935c6812200385961f4429d_aspect">
                <iframe frameborder="0" allowfullscreen src="about:blank" id="ifr_6935c6812200385961f4429d" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" referrerpolicy="origin" onload="this.onload=null; this.src='https://scripts.converteai.net/2d2f47c5-b088-472f-a9cf-7a9674004f30/players/6935c6812200385961f4429d/v4/embed.html' + (location.search || '?') + '&vl=' + encodeURIComponent(location.href)"></iframe>
            </div>
        </div>
    `;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 text-left rounded-r-lg shadow-sm">
                <p className="text-red-800 font-bold uppercase text-sm tracking-wide mb-1">Diagnóstico Completado</p>
                <p className="text-red-900 font-serif text-lg">Perfil Metabólico: <span className="font-extrabold">CRÍTICO</span> - Malabsorción de Proteínas Detectada.</p>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-main leading-tight mb-6">
                <span className="text-red-600">ATENCIÓN:</span> La mayoría de las proteínas que comes podrían estar convirtiéndose en <span className="bg-yellow-200 px-2 rounded">AZÚCAR</span> en lugar de músculo...
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light italic">
                "Mira la historia de Roberto, de 70 años, que revirtió esto en 4 semanas."
            </p>

            {/* VSL Embed */}
            <div className="w-full mb-8 flex justify-center">
                <div dangerouslySetInnerHTML={{ __html: embedHtml }} className="w-full" />
            </div>

            {/* Delayed CTA Button */}
            {showButton && (
                <div className="animate-fade-in-up">
                    <button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold text-xl md:text-2xl py-6 px-12 rounded-lg shadow-xl transform transition hover:scale-[1.02] animate-bounce-slow mb-4">
                        QUIERO ACCEDER AL PROTOCOLO
                    </button>
                    <p className="text-sm text-gray-500">Oferta válida por tiempo limitado.</p>
                </div>
            )}

            <div className="mt-8 text-sm text-gray-500 max-w-2xl mx-auto">
                <p>Este video contiene información sensible sobre su salud. Por favor, mírelo en un lugar privado.</p>
            </div>
        </div>
    );
}
