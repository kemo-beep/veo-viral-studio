import React from 'react';
import { KeyIcon, ChevronDownIcon, PlusIcon, LayersIcon, HistoryIcon } from '../Icons';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    collapsed: boolean;
    onClick: () => void;
    badge?: number;
}

const NavItem = ({ icon, label, active, collapsed, onClick, badge }: NavItemProps) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${active
            ? 'bg-white/10 text-white shadow-lg'
            : 'text-studio-500 hover:text-white hover:bg-white/5'
            } ${collapsed ? 'justify-center' : ''}`}
    >
        {icon}
        {!collapsed && (
            <>
                <span className="text-sm font-medium flex-1 text-left">{label}</span>
                {badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-bold">{badge}</span>
                )}
            </>
        )}
    </button>
);

interface SidebarProps {
    activeView: 'create' | 'gallery' | 'history';
    setActiveView: (view: 'create' | 'gallery' | 'history') => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    apiKeyReady: boolean;
    onConnectKey: () => void;
    onShowSettings: () => void;
    videosCount: number;
}

export const Sidebar = ({
    activeView,
    setActiveView,
    sidebarCollapsed,
    setSidebarCollapsed,
    apiKeyReady,
    onConnectKey,
    onShowSettings,
    videosCount,
}: SidebarProps) => {
    return (
        <aside className={`hidden md:flex relative z-20 flex-col border-r border-white/5 bg-studio-950/80 backdrop-blur-xl transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
            {/* Logo */}
            <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center shadow-glow shrink-0">
                        <span className="font-bold text-white text-lg">V</span>
                    </div>
                    {!sidebarCollapsed && (
                        <div className="animate-fade-in-up">
                            <span className="font-bold text-base tracking-tight">VeoStudio</span>
                            <span className="text-[10px] text-studio-500 block -mt-0.5">by Google Veo 3</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                <NavItem
                    icon={<PlusIcon className="w-4 h-4" />}
                    label="Create"
                    active={activeView === 'create'}
                    collapsed={sidebarCollapsed}
                    onClick={() => setActiveView('create')}
                />
                <NavItem
                    icon={<LayersIcon className="w-4 h-4" />}
                    label="Gallery"
                    active={activeView === 'gallery'}
                    collapsed={sidebarCollapsed}
                    onClick={() => setActiveView('gallery')}
                    badge={videosCount > 0 ? videosCount : undefined}
                />
                <NavItem
                    icon={<HistoryIcon className="w-4 h-4" />}
                    label="History"
                    active={activeView === 'history'}
                    collapsed={sidebarCollapsed}
                    onClick={() => setActiveView('history')}
                />
            </nav>

            {/* Status & Settings */}
            <div className="p-3 border-t border-white/5 space-y-2">
                {apiKeyReady ? (
                    <button
                        onClick={onShowSettings}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 transition-all ${sidebarCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
                        {!sidebarCollapsed && <span className="text-xs text-emerald-400 font-medium">Connected</span>}
                    </button>
                ) : (
                    <button
                        onClick={onConnectKey}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-all ${sidebarCollapsed ? 'justify-center' : ''}`}
                    >
                        <KeyIcon className="w-4 h-4 text-amber-400" />
                        {!sidebarCollapsed && <span className="text-xs text-amber-400 font-medium">Connect API</span>}
                    </button>
                )}

                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="w-full flex items-center justify-center p-2 rounded-lg text-studio-500 hover:text-white hover:bg-white/5 transition-all"
                >
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-[-90deg]' : 'rotate-90'}`} />
                </button>
            </div>
        </aside>
    );
};

