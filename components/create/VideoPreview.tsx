import React from 'react';
import { VideoData } from '../../types';
import { CheckCircleIcon, DownloadIcon, TrashIcon } from '../Icons';

interface VideoPreviewProps {
    video: VideoData;
    onSave: () => void;
    onDiscard: () => void;
}

export const VideoPreview = ({ video, onSave, onDiscard }: VideoPreviewProps) => {
    return (
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
            <div className="max-w-4xl w-full animate-fade-in-up">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-medium text-emerald-400">Generation Complete</span>
                </div>

                <div className="glass-panel rounded-xl md:rounded-2xl overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Video */}
                        <div className="flex-1 bg-black flex items-center justify-center min-h-[250px] md:min-h-[400px] relative">
                            <video
                                src={video.url}
                                className="max-h-[300px] md:max-h-[500px] w-auto max-w-full"
                                controls
                                autoPlay
                                loop
                                playsInline
                            />
                        </div>

                        {/* Details */}
                        <div className="w-full lg:w-80 p-4 md:p-6 border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-4 md:mb-6">
                                    <div>
                                        <h4 className="text-white font-medium mb-0.5">Your Video</h4>
                                        <p className="text-[10px] text-studio-500 font-mono">{video.id.toUpperCase()}</p>
                                    </div>
                                    <div className="flex gap-2 lg:hidden">
                                        <span className="text-[10px] text-white font-mono bg-white/5 px-2 py-1 rounded">{video.aspectRatio}</span>
                                        <span className="text-[10px] text-white font-mono bg-white/5 px-2 py-1 rounded">MP4</span>
                                    </div>
                                </div>

                                <div className="space-y-4 hidden lg:block">
                                    <div>
                                        <span className="text-[10px] uppercase text-studio-500 tracking-wider block mb-1">Prompt</span>
                                        <p className="text-sm text-studio-300 italic leading-relaxed border-l-2 border-accent/30 pl-3 line-clamp-4">
                                            "{video.prompt || "Frame-based video"}"
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div>
                                            <span className="text-[10px] uppercase text-studio-500 tracking-wider block mb-1">Ratio</span>
                                            <span className="text-xs text-white font-mono bg-white/5 px-2 py-1 rounded">{video.aspectRatio}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase text-studio-500 tracking-wider block mb-1">Format</span>
                                            <span className="text-xs text-white font-mono bg-white/5 px-2 py-1 rounded">MP4</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mt-4 lg:mt-6">
                                <button
                                    onClick={onSave}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 md:py-3 rounded-xl bg-white text-black font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow"
                                >
                                    <CheckCircleIcon className="w-4 h-4" />
                                    Save to Gallery
                                </button>
                                <div className="flex gap-2 md:gap-3">
                                    <a
                                        href={video.url}
                                        download={`veo-${video.id}.mp4`}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 md:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/5 transition-colors active:scale-[0.98]"
                                    >
                                        <DownloadIcon className="w-3.5 h-3.5 md:w-3 md:h-3" />
                                        Download
                                    </a>
                                    <button
                                        onClick={onDiscard}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 md:py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition-colors active:scale-[0.98]"
                                    >
                                        <TrashIcon className="w-3.5 h-3.5 md:w-3 md:h-3" />
                                        Discard
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

