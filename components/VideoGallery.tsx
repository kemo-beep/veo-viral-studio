import React from 'react';
import { VideoData } from '../types';
import { DownloadIcon, FilmIcon, PlayIcon } from './Icons';

interface VideoGalleryProps {
  videos: VideoData[];
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({ videos }) => {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-studio-500 border border-dashed border-studio-800 rounded-2xl bg-studio-900/20">
        <div className="relative">
             <div className="absolute inset-0 bg-accent-glow blur-2xl opacity-10 rounded-full"></div>
             <div className="w-16 h-16 bg-studio-800/50 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/5 relative z-10 shadow-lg">
                <FilmIcon className="w-6 h-6 text-studio-400" />
             </div>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Canvas Empty</h3>
        <p className="text-sm max-w-xs text-center text-studio-500">Your generated masterpieces will appear here. Start creating above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {videos.map((video, index) => (
        <div 
            key={video.id} 
            className="group relative bg-studio-900 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-500 shadow-lg hover:shadow-2xl animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Aspect Ratio Container */}
          <div className={`${video.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'} bg-black relative overflow-hidden`}>
            <video
              src={video.url}
              controls
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              loop
              playsInline
            />
             {/* Play Button Overlay (fades out on hover/play) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-300 bg-black/20">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <PlayIcon className="w-5 h-5 text-white fill-white" />
                </div>
            </div>
          </div>
          
          {/* Top Gradient Overlay */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Bottom Info Bar with Download */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-studio-950 via-studio-950/90 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 pointer-events-none">
             <div className="flex items-end justify-between gap-3">
                 <div className="flex-1 min-w-0 pointer-events-auto">
                     <p className="text-xs font-medium text-white/90 line-clamp-2 mb-1 drop-shadow-md">{video.prompt || "Image Reference Video"}</p>
                     <p className="text-[10px] text-studio-400 font-mono uppercase tracking-wider">Generated {new Date(video.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                 </div>
                 
                 <a 
                    href={video.url} 
                    download={`veo-creation-${video.id}.mp4`}
                    className="flex items-center justify-center p-2 rounded-lg bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all border border-white/10 hover:border-white/20 shadow-lg active:scale-95 pointer-events-auto"
                    title="Download Video"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DownloadIcon className="w-4 h-4" />
                </a>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};