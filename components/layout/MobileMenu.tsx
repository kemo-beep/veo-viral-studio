import React from 'react';
import { PlusIcon, LayersIcon, HistoryIcon, KeyIcon, XIcon } from '../Icons';

interface MobileNavItemProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
    badge?: number;
}

const MobileNavItem = ({ icon, label, active, onClick, badge }: MobileNavItemProps) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all active:scale-[0.98] ${active
            ? 'bg-white/10 text-white'
            : 'text-studio-400 hover:bg-white/5'
            }`}
    >
        {icon}
        <span className="text-base font-medium flex-1 text-left">{label}</span>
        {badge !== undefined && (
            <span className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold">{badge}</span>
        )}
    </button>
);

interface MobileMenuProps {
    activeView: 'create' | 'gallery' | 'history';
    setActiveView: (view: 'create' | 'gallery' | 'history') => void;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    apiKeyReady: boolean;
    onConnectKey: () => void;
    onShowSettings: () => void;
    videosCount: number;
}

export const MobileMenu = ({
    activeView,
    setActiveView,
    mobileMenuOpen,
    setMobileMenuOpen,
    apiKeyReady,
    onConnectKey,
    onShowSettings,
    videosCount,
}: MobileMenuProps) => {
    if (!mobileMenuOpen) return null;

    return (
        <div className="md:hidden fixed inset-0 z-40 pt-14">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative bg-studio-950 border-b border-white/5 p-4 space-y-2 animate-fade-in-up">
                <MobileNavItem
                    icon={<PlusIcon className="w-5 h-5" />}
                    label="Create"
                    active={activeView === 'create'}
                    onClick={() => setActiveView('create')}
                />
                <MobileNavItem
                    icon={<LayersIcon className="w-5 h-5" />}
                    label="Gallery"
                    active={activeView === 'gallery'}
                    onClick={() => setActiveView('gallery')}
                    badge={videosCount > 0 ? videosCount : undefined}
                />
                <MobileNavItem
                    icon={<HistoryIcon className="w-5 h-5" />}
                    label="History"
                    active={activeView === 'history'}
                    onClick={() => setActiveView('history')}
                />

                <div className="h-px bg-white/5 my-3" />

                {apiKeyReady ? (
                    <button
                        onClick={() => {
                            onShowSettings();
                            setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm text-emerald-400 font-medium">API Connected</span>
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            onConnectKey();
                            setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
                    >
                        <KeyIcon className="w-5 h-5 text-amber-400" />
                        <span className="text-sm text-amber-400 font-medium">Connect API Key</span>
                    </button>
                )}
            </div>
        </div>
    );
};

