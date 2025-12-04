import React from 'react';
import { SparklesIcon } from '../Icons';

interface GeneratingStateProps {
    progress: number;
    loadingStep: string;
}

export const GeneratingState = ({ progress, loadingStep }: GeneratingStateProps) => {
    return (
        <div className="flex-1 flex items-center justify-center p-6 md:p-8">
            <div className="max-w-md w-full text-center animate-fade-in-up">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 md:mb-8 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center relative">
                    <SparklesIcon className="w-6 h-6 md:w-8 md:h-8 text-accent animate-pulse" />
                    <div className="absolute inset-0 rounded-2xl bg-accent/20 animate-ping" />
                </div>

                <h3 className="text-lg md:text-xl font-semibold mb-2">Creating Your Video</h3>
                <p className="text-sm text-studio-500 mb-6 md:mb-8">This usually takes 1-2 minutes</p>

                {/* Progress Bar */}
                <div className="relative h-2 bg-studio-900 rounded-full overflow-hidden border border-white/5 mb-3 md:mb-4">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent via-accent-glow to-accent bg-[length:200%_100%] animate-shimmer rounded-full transition-all duration-200"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex justify-between items-center text-xs">
                    <span className="text-studio-400 font-mono text-[10px] md:text-xs truncate max-w-[200px] md:max-w-none">
                        {loadingStep}
                    </span>
                    <span className="text-white font-bold tabular-nums ml-2">{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    );
};

