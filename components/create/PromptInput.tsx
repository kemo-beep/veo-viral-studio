import React from 'react';
import { ImageIcon, XIcon, ChevronDownIcon, MoveUpIcon } from '../Icons';

interface PromptInputProps {
    prompt: string;
    setPrompt: (value: string) => void;
    aspectRatio: '9:16' | '16:9';
    setAspectRatio: (value: '9:16' | '16:9') => void;
    resolution: '720p' | '1080p';
    setResolution: (value: '720p' | '1080p') => void;
    duration: number;
    setDuration: (value: number) => void;
    enhancePrompt: boolean;
    setEnhancePrompt: (value: boolean) => void;
    startFrameImage: { file: File; previewUrl: string } | null;
    endFrameImage: { file: File; previewUrl: string } | null;
    onStartFrameSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEndFrameSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveStartFrame: () => void;
    onRemoveEndFrame: () => void;
    startFrameInputRef: React.RefObject<HTMLInputElement>;
    endFrameInputRef: React.RefObject<HTMLInputElement>;
    onGenerate: () => void;
    isGenerating: boolean;
}

export const PromptInput = ({
    prompt,
    setPrompt,
    aspectRatio,
    setAspectRatio,
    resolution,
    setResolution,
    duration,
    setDuration,
    enhancePrompt,
    setEnhancePrompt,
    startFrameImage,
    endFrameImage,
    onStartFrameSelect,
    onEndFrameSelect,
    onRemoveStartFrame,
    onRemoveEndFrame,
    startFrameInputRef,
    endFrameInputRef,
    onGenerate,
    isGenerating,
}: PromptInputProps) => {
    return (
        <div className="glass-panel rounded-xl md:rounded-2xl overflow-hidden bg-white/5">
            {/* Frame Images - Two columns on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 pt-4">
                {/* Start Frame */}
                <div>
                    {startFrameImage ? (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                            <img
                                src={startFrameImage.previewUrl}
                                alt="Start Frame"
                                className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium truncate">Start Frame</p>
                                <p className="text-xs text-studio-500 truncate">{startFrameImage.file.name}</p>
                            </div>
                            <button
                                onClick={onRemoveStartFrame}
                                className="p-2 rounded-lg hover:bg-white/10 text-studio-500 hover:text-white transition-colors shrink-0"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => startFrameInputRef.current?.click()}
                            className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 transition-all w-full text-left active:scale-[0.99]"
                        >
                            <div className="p-2 rounded-lg bg-white/5">
                                <ImageIcon className="w-4 h-4 text-studio-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-studio-300">Start Frame</p>
                                <p className="text-xs text-studio-500 hidden sm:block">Optional</p>
                            </div>
                        </button>
                    )}
                </div>

                {/* End Frame */}
                <div>
                    {endFrameImage ? (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                            <img
                                src={endFrameImage.previewUrl}
                                alt="End Frame"
                                className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium truncate">End Frame</p>
                                <p className="text-xs text-studio-500 truncate">{endFrameImage.file.name}</p>
                            </div>
                            <button
                                onClick={onRemoveEndFrame}
                                className="p-2 rounded-lg hover:bg-white/10 text-studio-500 hover:text-white transition-colors shrink-0"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => endFrameInputRef.current?.click()}
                            className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 transition-all w-full text-left active:scale-[0.99]"
                        >
                            <div className="p-2 rounded-lg bg-white/5">
                                <ImageIcon className="w-4 h-4 text-studio-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-studio-300">End Frame</p>
                                <p className="text-xs text-studio-500 hidden sm:block">Optional</p>
                            </div>
                        </button>
                    )}
                </div>
            </div>

            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe new video..."
                className="w-full bg-transparent text-white text-base p-4 md:p-6 placeholder-studio-500 focus:outline-none min-h-[140px] md:min-h-[180px] resize-none leading-relaxed"
            />

            {/* Bottom Bar with Controls and Generate Button */}
            <div className="px-4 pb-4 md:px-6 md:pb-6 space-y-3 md:space-y-4">
                {/* Hidden file inputs */}
                <input
                    type="file"
                    ref={startFrameInputRef}
                    onChange={onStartFrameSelect}
                    accept="image/*"
                    className="hidden"
                />
                <input
                    type="file"
                    ref={endFrameInputRef}
                    onChange={onEndFrameSelect}
                    accept="image/*"
                    className="hidden"
                />

                <div className="flex items-center justify-between gap-3">
                    {/* Controls */}
                    <div className="flex items-center gap-1">
                        <div className="relative group">
                            <select
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value as '9:16' | '16:9')}
                                className="bg-studio-900 border border-white/5 rounded-lg px-3 md:px-4 py-2 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 hover:border-white/10 hover:bg-studio-800 active:bg-studio-700 transition-all cursor-pointer appearance-none pr-8 md:pr-9 min-w-[90px] md:min-w-[100px] shadow-sm active:scale-[0.98]"
                            >
                                <option value="9:16" className="bg-studio-900 text-white py-2">9:16</option>
                                <option value="16:9" className="bg-studio-900 text-white py-2">16:9</option>
                            </select>
                            <div className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDownIcon className="w-3.5 h-3.5 text-studio-400 group-hover:text-studio-300 transition-all duration-200" />
                            </div>
                        </div>

                        <div className="relative group">
                            <select
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value as '720p' | '1080p')}
                                className="bg-studio-900 border border-white/5 rounded-lg px-3 md:px-4 py-2 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 hover:border-white/10 hover:bg-studio-800 active:bg-studio-700 transition-all cursor-pointer appearance-none pr-8 md:pr-9 min-w-[90px] md:min-w-[100px] shadow-sm active:scale-[0.98]"
                            >
                                <option value="720p" className="bg-studio-900 text-white py-2">720p</option>
                                <option value="1080p" className="bg-studio-900 text-white py-2">1080p</option>
                            </select>
                            <div className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDownIcon className="w-3.5 h-3.5 text-studio-400 group-hover:text-studio-300 transition-all duration-200" />
                            </div>
                        </div>

                        <div className="relative group">
                            <select
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="bg-studio-900 border border-white/5 rounded-lg px-3 md:px-4 py-2 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 hover:border-white/10 hover:bg-studio-800 active:bg-studio-700 transition-all cursor-pointer appearance-none pr-8 md:pr-9 min-w-[90px] md:min-w-[100px] shadow-sm active:scale-[0.98]"
                            >
                                <option value={2} className="bg-studio-900 text-white py-2">2s</option>
                                <option value={4} className="bg-studio-900 text-white py-2">4s</option>
                                <option value={5} className="bg-studio-900 text-white py-2">5s</option>
                                <option value={8} className="bg-studio-900 text-white py-2">8s</option>
                                <option value={10} className="bg-studio-900 text-white py-2">10s</option>
                            </select>
                            <div className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDownIcon className="w-3.5 h-3.5 text-studio-400 group-hover:text-studio-300 transition-all duration-200" />
                            </div>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={onGenerate}
                        disabled={!prompt && !startFrameImage && !endFrameImage}
                        className={`p-3.5 md:p-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${!prompt && !startFrameImage && !endFrameImage
                                ? 'bg-studio-800 text-studio-500 cursor-not-allowed'
                                : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-glow'
                            }`}
                    >
                        <MoveUpIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Enhance Toggle */}
                <div className="px-4 md:px-6 pb-3 md:pb-4 border-t border-white/5 pt-3 md:pt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={enhancePrompt}
                                onChange={(e) => setEnhancePrompt(e.target.checked)}
                                className="sr-only"
                                disabled={isGenerating}
                            />
                            <div
                                className={`w-11 h-6 rounded-full transition-all duration-200 ${enhancePrompt ? 'bg-accent' : 'bg-studio-700'
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 rounded-full bg-white transition-all duration-200 transform ${enhancePrompt ? 'translate-x-5' : 'translate-x-0.5'
                                        } mt-0.5`}
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <span className="text-sm font-medium text-white">Enhance</span>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

