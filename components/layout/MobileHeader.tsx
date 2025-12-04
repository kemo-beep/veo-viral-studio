import React from 'react';
import { XIcon, MenuIcon } from '../Icons';

interface MobileHeaderProps {
    apiKeyReady: boolean;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export const MobileHeader = ({ apiKeyReady, mobileMenuOpen, setMobileMenuOpen }: MobileHeaderProps) => {
    return (
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-studio-950/90 backdrop-blur-xl relative z-30">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center shadow-glow">
                    <span className="font-bold text-white text-sm">V</span>
                </div>
                <span className="font-bold text-sm tracking-tight">VeoStudio</span>
            </div>

            <div className="flex items-center gap-2">
                {apiKeyReady && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                )}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
                </button>
            </div>
        </header>
    );
};

