import React from 'react';
import { PlusIcon, LayersIcon, HistoryIcon } from '../Icons';

interface MobileBottomNavItemProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
    badge?: number;
}

const MobileBottomNavItem = ({ icon, label, active, onClick, badge }: MobileBottomNavItemProps) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all active:scale-95 relative ${active
            ? 'text-accent'
            : 'text-studio-500'
            }`}
    >
        <div className="relative">
            {icon}
            {badge !== undefined && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[9px] font-bold text-white flex items-center justify-center">
                    {badge > 9 ? '9+' : badge}
                </span>
            )}
        </div>
        <span className="text-[10px] font-medium">{label}</span>
        {active && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
        )}
    </button>
);

interface MobileBottomNavProps {
    activeView: 'create' | 'gallery' | 'history';
    setActiveView: (view: 'create' | 'gallery' | 'history') => void;
    videosCount: number;
}

export const MobileBottomNav = ({ activeView, setActiveView, videosCount }: MobileBottomNavProps) => {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-studio-950/95 backdrop-blur-xl border-t border-white/5 px-2 pb-safe">
            <div className="flex items-center justify-around py-2">
                <MobileBottomNavItem
                    icon={<PlusIcon className="w-5 h-5" />}
                    label="Create"
                    active={activeView === 'create'}
                    onClick={() => setActiveView('create')}
                />
                <MobileBottomNavItem
                    icon={<LayersIcon className="w-5 h-5" />}
                    label="Gallery"
                    active={activeView === 'gallery'}
                    onClick={() => setActiveView('gallery')}
                    badge={videosCount > 0 ? videosCount : undefined}
                />
                <MobileBottomNavItem
                    icon={<HistoryIcon className="w-5 h-5" />}
                    label="History"
                    active={activeView === 'history'}
                    onClick={() => setActiveView('history')}
                />
            </div>
        </nav>
    );
};

