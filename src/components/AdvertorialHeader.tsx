import { Menu, Search } from 'lucide-react';

export default function AdvertorialHeader() {
    return (
        <header className="flex items-center justify-between px-4 h-[50px] bg-white border-b border-gray-200 shrink-0 select-none">
            {/* Left: Hamburger Menu (Non-functional) */}
            <div className="p-2 cursor-default text-gray-800">
                <Menu size={24} strokeWidth={1.5} />
            </div>

            {/* Center: Branding */}
            <div className="font-serif font-bold text-xl tracking-wider text-gray-800 uppercase">
                SALUD HOY
            </div>

            {/* Right: Search (Non-functional) */}
            <div className="p-2 cursor-default text-gray-800">
                <Search size={22} strokeWidth={1.5} />
            </div>
        </header>
    );
}
