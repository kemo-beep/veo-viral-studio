import React from 'react';
import { VideoData } from '../../types';
import { FilmIcon, DownloadIcon, TrashIcon } from '../Icons';

interface GalleryViewProps {
    videos: VideoData[];
    onDelete: (id: string) => void;
}

export const GalleryView = ({ videos, onDelete }: GalleryViewProps) => {
    if (videos.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-6 md:p-8">
                <div className="text-center animate-fade-in-up">
                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-2xl bg-studio-900 border border-white/5 flex items-center justify-center">
                        <FilmIcon className="w-6 h-6 md:w-8 md:h-8 text-studio-600" />
                    </div>
                    <h3 className="text-base md:text-lg font-medium text-white mb-2">No Videos Yet</h3>
                    <p className="text-sm text-studio-500 max-w-xs px-4">Your saved videos will appear here. Start creating!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                {videos.map((video, index) => (
                    <div
                        key={video.id}
                        className="group relative bg-studio-900 rounded-xl md:rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className={`mx-auto rounded-xl md:rounded-2xl ${video.aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[400px]' : 'aspect-video'} bg-black relative`}>
                            <video src={video.url} controls className="w-full h-full object-cover rounded-2xl md:rounded-2xl" autoPlay muted loop playsInline />

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>

                        {/* Info */}
                        <div className="p-3 md:p-4 h-40 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
                            <p className="text-sm text-white line-clamp-2 mb-2">
                                {video.prompt
                                    ? (video.prompt.length > 50 ? video.prompt.slice(0, 50) + '...' : video.prompt)
                                    : "Frame-based video"}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-studio-500">
                                    {new Date(video.createdAt).toLocaleDateString()}
                                </span>
                                <div className="flex items-center gap-1">
                                    <a
                                        href={video.url}
                                        download={`veo-${video.id}.mp4`}
                                        className="p-2.5 md:p-2 rounded-lg hover:bg-white/10 text-studio-500 hover:text-white transition-colors active:scale-95"
                                    >
                                        <DownloadIcon className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => onDelete(video.id)}
                                        className="p-2.5 md:p-2 rounded-lg hover:bg-red-500/10 text-studio-500 hover:text-red-400 transition-colors active:scale-95"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

