import React from 'react';

interface HeaderProps {
    activeView: 'create' | 'gallery' | 'history';
    videosCount: number;
    historyCount: number;
    apiKeyReady: boolean;
    aspectRatio?: '9:16' | '16:9';
    resolution?: '720p' | '1080p';
}

export const Header = ({
    activeView,
    videosCount,
    historyCount,
    apiKeyReady,
    aspectRatio,
    resolution,
}: HeaderProps) => {
    return (
        <header className="hidden md:flex items-center justify-between px-6 py-4 border-b border-white/5 bg-studio-950/50 backdrop-blur-sm">
            <div>
                <h1 className="text-lg font-semibold capitalize">{activeView === 'create' ? 'Create Video' : activeView}</h1>
                <p className="text-xs text-studio-500">
                    {activeView === 'create'
                        ? 'Transform your ideas into cinematic videos'
                        : activeView === 'gallery'
                            ? `${videosCount} videos saved`
                            : `${historyCount} recent prompts`}
                </p>
            </div>

            {activeView === 'create' && apiKeyReady && (
                <div className="flex items-center gap-2 text-xs text-studio-500">
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-glow" />
                        Veo 3
                    </span>
                    <span className="px-2 py-1 rounded-full bg-white/5">{resolution}</span>
                    <span className="px-2 py-1 rounded-full bg-white/5">{aspectRatio}</span>
                </div>
            )}
        </header>
    );
};

