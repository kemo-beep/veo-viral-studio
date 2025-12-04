import React, { useState, useEffect, useRef } from 'react';
import { InfoIcon } from '../Icons';

interface Preset {
    id: string;
    name: string;
    prompt: string;
    aspectRatio: '9:16' | '16:9';
    resolution: '720p' | '1080p';
    icon: string;
}

interface PresetChipProps {
    preset: Preset;
    isActive: boolean;
    onSelect: () => void;
}

export const PresetChip = ({ preset, isActive, onSelect }: PresetChipProps) => {
    const [showPopover, setShowPopover] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const chipRef = useRef<HTMLButtonElement>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setShowPopover(true);
        }, 400);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setShowPopover(false);
        }, 150);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div className="relative">
            <button
                ref={chipRef}
                onClick={onSelect}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`
          group flex items-center gap-2.5 px-4 py-2.5 rounded-full
          transition-all duration-300 ease-out
          border backdrop-blur-sm
          ${isActive
                        ? 'bg-accent/20 border-accent/40 text-white shadow-[0_0_20px_rgba(255,103,29,0.15)]'
                        : 'bg-white/5 border-white/10 text-studio-300 hover:bg-white/10 hover:border-white/20 hover:text-white'
                    }
        `}
            >
                <span className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {preset.icon}
                </span>
                <span className="text-sm font-medium whitespace-nowrap">{preset.name}</span>
                {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                )}
            </button>

            {showPopover && (
                <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 animate-fade-in-up"
                    onMouseEnter={() => {
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                        setShowPopover(true);
                    }}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-studio-900 border-l border-t border-white/10" />
                    <div className="relative w-72 p-4 rounded-xl bg-studio-900 border border-white/10 shadow-2xl">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{preset.icon}</span>
                            <div>
                                <h4 className="text-sm font-semibold text-white">{preset.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-studio-500 bg-white/5 px-1.5 py-0.5 rounded font-mono">
                                        {preset.aspectRatio}
                                    </span>
                                    <span className="text-[10px] text-studio-500 bg-white/5 px-1.5 py-0.5 rounded font-mono">
                                        {preset.resolution}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="h-px bg-white/5 mb-3" />
                        <div>
                            <div className="flex items-center gap-1.5 mb-2">
                                <InfoIcon className="w-3 h-3 text-studio-500" />
                                <span className="text-[10px] uppercase tracking-wider text-studio-500 font-medium">Prompt Template</span>
                            </div>
                            <p className="text-xs text-studio-400 leading-relaxed italic">
                                "{preset.prompt}"
                            </p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] text-studio-600">Click to apply</span>
                            <span className="text-[10px] text-accent font-medium">↵ Enter</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

