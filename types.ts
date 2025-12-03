export enum GenerationStatus {
  IDLE = 'IDLE',
  PREPARING = 'PREPARING',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  FAILED = 'FAILED',
}

export interface VideoData {
  id: string;
  url: string; // The blob URL or fetchable URL
  prompt: string;
  createdAt: number;
  aspectRatio: '16:9' | '9:16';
  seed?: number;
}

export interface VeoConfig {
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
  duration?: number; // Duration in seconds
  cameraAngle?: string | null; // Camera angle preset
  cameraMode?: string | null; // Camera mode preset
  startFrame?: {
    file: File;
    previewUrl: string;
  } | null;
  endFrame?: {
    file: File;
    previewUrl: string;
  } | null;
}

// Window interface extension for AI Studio
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}
