import React from 'react';
import { HistoryItem } from '../../types';
import { HistoryIcon, ArrowUpRightIcon } from '../Icons';

interface HistoryViewProps {
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
    onClear: () => void;
}

export const HistoryView = ({ history, onSelect, onClear }: HistoryViewProps) => {
    if (history.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-6 md:p-8">
                <div className="text-center animate-fade-in-up">
                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-2xl bg-studio-900 border border-white/5 flex items-center justify-center">
                        <HistoryIcon className="w-6 h-6 md:w-8 md:h-8 text-studio-600" />
                    </div>
                    <h3 className="text-base md:text-lg font-medium text-white mb-2">No History</h3>
                    <p className="text-sm text-studio-500 max-w-xs px-4">Your generation history will appear here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6">
                <p className="text-sm text-studio-500">{history.length} recent prompts</p>
                <button
                    onClick={onClear}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 -mr-2 active:scale-95"
                >
                    Clear All
                </button>
            </div>

            <div className="space-y-2 md:space-y-3">
                {history.map((item, index) => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className="w-full p-3 md:p-4 rounded-xl bg-studio-900/50 border border-white/5 hover:border-white/10 hover:bg-studio-900 transition-all text-left group animate-fade-in-up active:scale-[0.99]"
                        style={{ animationDelay: `${index * 30}ms` }}
                    >
                        <div className="flex items-start gap-3 md:gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white line-clamp-2 group-hover:text-accent transition-colors">
                                    {item.prompt || <span className="text-studio-500 italic">Frame-based video</span>}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2">
                                    <span className="text-[10px] md:text-xs text-studio-500">
                                        {new Date(item.timestamp).toLocaleDateString()}
                                    </span>
                                    <span className="text-[10px] text-studio-600 bg-white/5 px-1.5 py-0.5 rounded">{item.aspectRatio}</span>
                                    <span className="text-[10px] text-studio-600 bg-white/5 px-1.5 py-0.5 rounded">{item.resolution}</span>
                                    {item.hasStartFrame && (
                                        <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">START</span>
                                    )}
                                    {item.hasEndFrame && (
                                        <span className="text-[10px] text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">END</span>
                                    )}
                                </div>
                            </div>
                            <ArrowUpRightIcon className="w-4 h-4 text-studio-600 group-hover:text-accent transition-colors shrink-0 mt-0.5" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

