import { Activity, Lock } from 'lucide-react';

export default function Header() {
    return (
        <>
            {/* Top Bar - Hello Bar */}
            <div suppressHydrationWarning={true} className="bg-red-50 py-2 px-4 text-center border-b border-red-100">
                <p className="text-xs md:text-sm font-semibold text-red-900">
                    ⚠️ ATENCIÓN: Esta evaluación gratuita estará disponible solo hasta hoy.
                </p>
            </div>

            {/* Main Header */}
            <header suppressHydrationWarning={true} className="bg-white border-b border-gray-200 py-4 shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Activity className="text-primary w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-primary font-serif font-bold text-lg md:text-xl leading-none">
                                Protocolo 99%
                            </span>
                            <span className="text-[10px] md:text-xs text-secondary uppercase tracking-widest font-sans font-semibold mt-1">
                                Ciencia de Longevidad
                            </span>
                        </div>
                    </div>

                    {/* Security Seal */}
                    <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                        <Lock size={14} className="text-green-600" />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-gray-600">
                            Sitio 100% Seguro
                        </span>
                    </div>
                </div>
            </header>
        </>
    );
}
