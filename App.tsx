import React, { useState, useEffect, useRef } from 'react';
import { ensureApiKey, requestApiKey, generateVideo } from './services/geminiService';
import { GenerationStatus, VideoData, VeoConfig } from './types';
import {
  KeyIcon, ShieldCheckIcon, LogOutIcon, XIcon, CheckCircleIcon,
  TrashIcon, DownloadIcon, AlertTriangleIcon, RefreshCcwIcon, HistoryIcon,
  ArrowUpRightIcon, SparklesIcon, ImageIcon, WandIcon, FilmIcon,
  PlusIcon, ChevronDownIcon, LayersIcon, InfoIcon, MenuIcon
} from './components/Icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Camera01Icon,
  ViewIcon,
  ThreeDViewIcon,
  Angle01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ZoomInAreaIcon,
  ZoomIcon,
  CraneIcon,
  CameraVideoIcon,
  Maximize01Icon,
  Minimize01Icon,
} from '@hugeicons/core-free-icons';
import { MoveUpIcon } from 'lucide-react';

// ============ CONSTANTS ============
const LOADING_STEPS = [
  "Initializing Veo neural engine...",
  "Parsing semantic structures...",
  "Synthesizing spatial geometry...",
  "Computing temporal motion vectors...",
  "Rendering high-fidelity textures...",
  "Applying cinematic lighting...",
  "Finalizing encoding stream..."
];

const PRESETS = [
  { id: 'cinematic', name: 'Cinematic', prompt: 'Cinematic wide shot with dramatic lighting, shallow depth of field, film grain, anamorphic lens flare, golden hour atmosphere', aspectRatio: '16:9' as const, resolution: '1080p' as const, icon: '🎬' },
  { id: 'viral', name: 'Viral Short', prompt: 'Dynamic fast-paced action, energetic movement, vibrant colors, high contrast, motion blur, trending aesthetic', aspectRatio: '9:16' as const, resolution: '720p' as const, icon: '🔥' },
  { id: 'dreamy', name: 'Dreamy', prompt: 'Ethereal dreamy atmosphere, soft focus, pastel colors, floating particles, magical lighting, surreal ambiance', aspectRatio: '9:16' as const, resolution: '720p' as const, icon: '✨' },
  { id: 'cyberpunk', name: 'Cyberpunk', prompt: 'Futuristic cyberpunk cityscape, neon lights, rain-soaked streets, holographic displays, vibrant purple and cyan', aspectRatio: '9:16' as const, resolution: '1080p' as const, icon: '🌃' },
  { id: 'nature', name: 'Nature', prompt: 'Stunning nature documentary, wildlife in natural habitat, breathtaking landscapes, golden hour lighting', aspectRatio: '16:9' as const, resolution: '1080p' as const, icon: '🌿' },
  { id: 'minimal', name: 'Minimal', prompt: 'Clean minimal aesthetic, simple composition, soft neutral colors, elegant movement, modern design', aspectRatio: '9:16' as const, resolution: '720p' as const, icon: '◯' },
];

interface HistoryItem {
  id: string;
  timestamp: number;
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
  hasStartFrame: boolean;
  hasEndFrame: boolean;
}

// ============ MAIN APP ============
export default function App() {
  // Auth & Status
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);

  // Content
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [previewVideo, setPreviewVideo] = useState<VideoData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Form State
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [duration, setDuration] = useState<number>(5);
  const [enhancePrompt, setEnhancePrompt] = useState<boolean>(true);
  const [cameraAngle, setCameraAngle] = useState<string | null>(null);
  const [cameraMode, setCameraMode] = useState<string | null>(null);
  const [cameraAngleOpen, setCameraAngleOpen] = useState<boolean>(false);
  const [cameraModeOpen, setCameraModeOpen] = useState<boolean>(false);
  const [startFrameImage, setStartFrameImage] = useState<{ file: File; previewUrl: string } | null>(null);
  const [endFrameImage, setEndFrameImage] = useState<{ file: File; previewUrl: string } | null>(null);

  // UI State
  const [activeView, setActiveView] = useState<'create' | 'gallery' | 'history'>('create');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastConfig, setLastConfig] = useState<VeoConfig | null>(null);
  const [progress, setProgress] = useState(0);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const startFrameInputRef = useRef<HTMLInputElement>(null);
  const endFrameInputRef = useRef<HTMLInputElement>(null);

  // Close mobile menu when view changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeView]);

  // ============ EFFECTS ============
  useEffect(() => {
    checkKey();
    loadHistory();
    loadVideos();
  }, []);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let stepInterval: NodeJS.Timeout;

    if (status === GenerationStatus.GENERATING) {
      setProgress(0);
      setLoadingStepIndex(0);
      progressInterval = setInterval(() => {
        setProgress(prev => prev >= 95 ? 95 : prev + Math.max(0.1, (95 - prev) * 0.05));
      }, 200);
      stepInterval = setInterval(() => {
        setLoadingStepIndex(prev => (prev + 1) % LOADING_STEPS.length);
      }, 3000);
    } else {
      setProgress(0);
    }

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [status]);

  // ============ DATA FUNCTIONS ============
  const checkKey = async () => {
    try {
      const ready = await ensureApiKey();
      setApiKeyReady(ready);
    } catch (e) {
      console.error("Failed to check API key status", e);
    }
  };

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('veo_history');
      if (stored) setHistory(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  const loadVideos = () => {
    try {
      const stored = localStorage.getItem('veo_videos');
      if (stored) setVideos(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load videos", e);
    }
  };

  const saveVideos = (newVideos: VideoData[]) => {
    setVideos(newVideos);
    localStorage.setItem('veo_videos', JSON.stringify(newVideos));
  };

  const addToHistory = (config: VeoConfig) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      prompt: config.prompt,
      aspectRatio: config.aspectRatio,
      resolution: config.resolution,
      hasStartFrame: !!config.startFrame,
      hasEndFrame: !!config.endFrame
    };
    const newHistory = [newItem, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('veo_history', JSON.stringify(newHistory));
  };

  // ============ HANDLERS ============
  const handleConnectKey = async () => {
    try {
      await requestApiKey();
      await checkKey();
    } catch (e) {
      console.error("Error selecting key", e);
    }
  };

  const handleDisconnect = () => {
    setApiKeyReady(false);
    setShowSettings(false);
  };

  // Enhance prompt with cinematic and technical details
  const enhancePromptText = (text: string, angle?: string | null, mode?: string | null): string => {
    if (!text.trim()) return text;

    // Add cinematic enhancements
    let enhanced = text.trim();

    // Add camera angle if selected
    if (angle) {
      const angleDescriptions: Record<string, string> = {
        'wide': 'wide angle shot',
        'close-up': 'close-up shot',
        'medium': 'medium shot',
        'extreme-close': 'extreme close-up',
        'bird-eye': 'bird\'s eye view',
        'low-angle': 'low angle shot',
        'high-angle': 'high angle shot',
        'dutch': 'dutch angle',
        'over-shoulder': 'over-the-shoulder shot',
        'point-of-view': 'point of view shot'
      };
      const angleDesc = angleDescriptions[angle] || angle;
      if (!enhanced.toLowerCase().includes(angleDesc.toLowerCase())) {
        enhanced = `${enhanced}, ${angleDesc}`;
      }
    }

    // Add camera mode if selected
    if (mode) {
      const modeDescriptions: Record<string, string> = {
        'handheld': 'handheld camera movement',
        'steady': 'steady camera movement',
        'tracking': 'tracking shot',
        'dolly': 'dolly shot',
        'pan': 'panning camera',
        'tilt': 'tilting camera',
        'zoom': 'zoom effect',
        'static': 'static camera',
        'orbital': 'orbital camera movement',
        'crane': 'crane shot'
      };
      const modeDesc = modeDescriptions[mode] || mode;
      if (!enhanced.toLowerCase().includes(modeDesc.toLowerCase())) {
        enhanced = `${enhanced}, ${modeDesc}`;
      }
    }

    // Add quality descriptors if not already present
    const qualityTerms = ['cinematic', 'high quality', 'professional', '4k', '8k', 'ultra hd', 'stunning', 'breathtaking'];
    const hasQualityTerm = qualityTerms.some(term => enhanced.toLowerCase().includes(term));

    if (!hasQualityTerm) {
      enhanced = `Cinematic ${enhanced}`;
    }

    // Add motion and visual descriptors if not present (only if no camera mode specified)
    if (!mode) {
      const motionTerms = ['smooth', 'fluid', 'dynamic', 'motion', 'movement', 'animated'];
      const hasMotionTerm = motionTerms.some(term => enhanced.toLowerCase().includes(term));

      if (!hasMotionTerm && !enhanced.toLowerCase().includes('static')) {
        enhanced = `${enhanced}, smooth camera movement`;
      }
    }

    // Add lighting if not specified
    const lightingTerms = ['lighting', 'lit', 'bright', 'dark', 'shadow', 'glow', 'illuminated'];
    const hasLightingTerm = lightingTerms.some(term => enhanced.toLowerCase().includes(term));

    if (!hasLightingTerm) {
      enhanced = `${enhanced}, professional lighting`;
    }

    // Add color grading if not specified
    const colorTerms = ['color', 'grading', 'saturated', 'vibrant', 'palette', 'tone'];
    const hasColorTerm = colorTerms.some(term => enhanced.toLowerCase().includes(term));

    if (!hasColorTerm) {
      enhanced = `${enhanced}, cinematic color grading`;
    }

    return enhanced;
  };

  const handleGenerate = async () => {
    if (!prompt && !startFrameImage && !endFrameImage) return;

    // Enhance prompt if toggle is on
    const finalPrompt = enhancePrompt ? enhancePromptText(prompt, cameraAngle, cameraMode) : prompt;

    const config: VeoConfig = {
      prompt: finalPrompt,
      aspectRatio,
      resolution,
      duration,
      cameraAngle,
      cameraMode,
      startFrame: startFrameImage,
      endFrame: endFrameImage
    };
    setErrorMsg(null);
    setStatus(GenerationStatus.PREPARING);
    setLastConfig(config);

    try {
      const hasKey = await ensureApiKey();
      if (!hasKey) await requestApiKey();

      setStatus(GenerationStatus.GENERATING);
      const videoUrl = await generateVideo(config);

      if (videoUrl) {
        const newVideo: VideoData = {
          id: Math.random().toString(36).substring(7),
          url: videoUrl,
          prompt: config.prompt,
          createdAt: Date.now(),
          aspectRatio: config.aspectRatio,
        };
        addToHistory(config);
        setPreviewVideo(newVideo);
        setStatus(GenerationStatus.COMPLETE);
      } else {
        throw new Error("Failed to generate video URL");
      }
    } catch (error: any) {
      console.error("Generation failed:", error);
      setStatus(GenerationStatus.FAILED);
      setErrorMsg(error.message || "Something went wrong during generation.");
      if (error.message === "API_KEY_INVALID") setApiKeyReady(false);
    }
  };

  const handleRetry = () => {
    if (lastConfig) {
      setPrompt(lastConfig.prompt);
      setAspectRatio(lastConfig.aspectRatio);
      setResolution(lastConfig.resolution);
      setDuration(lastConfig.duration || 5);
      setCameraAngle(lastConfig.cameraAngle || null);
      setCameraMode(lastConfig.cameraMode || null);
      setStartFrameImage(lastConfig.startFrame || null);
      setEndFrameImage(lastConfig.endFrame || null);
      handleGenerate();
    }
  };

  const handleSavePreview = () => {
    if (previewVideo) {
      const newVideos = [previewVideo, ...videos];
      saveVideos(newVideos);
      setPreviewVideo(null);
      setStatus(GenerationStatus.IDLE);
      setActiveView('gallery');
    }
  };

  const handleDiscardPreview = () => {
    setPreviewVideo(null);
    setStatus(GenerationStatus.IDLE);
  };

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    setPrompt(preset.prompt);
    setAspectRatio(preset.aspectRatio);
    setResolution(preset.resolution);
    // Keep current duration when selecting preset
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setAspectRatio(item.aspectRatio);
    setResolution(item.resolution);
    setActiveView('create');
  };

  const handleStartFrameSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStartFrameImage({ file, previewUrl: URL.createObjectURL(file) });
    }
  };

  const handleEndFrameSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEndFrameImage({ file, previewUrl: URL.createObjectURL(file) });
    }
  };

  const removeStartFrame = () => {
    setStartFrameImage(null);
    if (startFrameInputRef.current) startFrameInputRef.current.value = '';
  };

  const removeEndFrame = () => {
    setEndFrameImage(null);
    if (endFrameInputRef.current) endFrameInputRef.current.value = '';
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('veo_history');
  };

  const deleteVideo = (id: string) => {
    const newVideos = videos.filter(v => v.id !== id);
    saveVideos(newVideos);
  };

  const isGenerating = status === GenerationStatus.GENERATING || status === GenerationStatus.PREPARING;
  const maskedKey = (process.env.API_KEY || '').length > 10
    ? `${process.env.API_KEY?.slice(0, 4)}...${process.env.API_KEY?.slice(-4)}`
    : 'Configured';

  // ============ RENDER ============
  return (
    <div className="h-screen flex flex-col md:flex-row bg-studio-950 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="bg-noise"></div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-accent/3 rounded-full blur-[150px]" />
      </div>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-studio-950/90 backdrop-blur-xl relative z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center shadow-glow">
            <span className="font-bold text-white text-sm">V</span>
          </div>
          <span className="font-bold text-sm tracking-tight">VeoStudio</span>
        </div>

        <div className="flex items-center gap-2">
          {apiKeyReady && (
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-14">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative bg-studio-950 border-b border-white/5 p-4 space-y-2 animate-fade-in-up">
            <MobileNavItem icon={<PlusIcon className="w-5 h-5" />} label="Create" active={activeView === 'create'} onClick={() => setActiveView('create')} />
            <MobileNavItem icon={<LayersIcon className="w-5 h-5" />} label="Gallery" active={activeView === 'gallery'} onClick={() => setActiveView('gallery')} badge={videos.length > 0 ? videos.length : undefined} />
            <MobileNavItem icon={<HistoryIcon className="w-5 h-5" />} label="History" active={activeView === 'history'} onClick={() => setActiveView('history')} />

            <div className="h-px bg-white/5 my-3" />

            {apiKeyReady ? (
              <button onClick={() => { setShowSettings(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-emerald-400 font-medium">API Connected</span>
              </button>
            ) : (
              <button onClick={() => { handleConnectKey(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <KeyIcon className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-amber-400 font-medium">Connect API Key</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
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
          <NavItem icon={<PlusIcon className="w-4 h-4" />} label="Create" active={activeView === 'create'} collapsed={sidebarCollapsed} onClick={() => setActiveView('create')} />
          <NavItem icon={<LayersIcon className="w-4 h-4" />} label="Gallery" active={activeView === 'gallery'} collapsed={sidebarCollapsed} onClick={() => setActiveView('gallery')} badge={videos.length > 0 ? videos.length : undefined} />
          <NavItem icon={<HistoryIcon className="w-4 h-4" />} label="History" active={activeView === 'history'} collapsed={sidebarCollapsed} onClick={() => setActiveView('history')} />
        </nav>

        {/* Status & Settings */}
        <div className="p-3 border-t border-white/5 space-y-2">
          {apiKeyReady ? (
            <button onClick={() => setShowSettings(true)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 transition-all ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
              {!sidebarCollapsed && <span className="text-xs text-emerald-400 font-medium">Connected</span>}
            </button>
          ) : (
            <button onClick={handleConnectKey} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-all ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <KeyIcon className="w-4 h-4 text-amber-400" />
              {!sidebarCollapsed && <span className="text-xs text-amber-400 font-medium">Connect API</span>}
            </button>
          )}

          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="w-full flex items-center justify-center p-2 rounded-lg text-studio-500 hover:text-white hover:bg-white/5 transition-all">
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-[-90deg]' : 'rotate-90'}`} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Desktop Top Bar */}
        <header className="hidden md:flex items-center justify-between px-6 py-4 border-b border-white/5 bg-studio-950/50 backdrop-blur-sm">
          <div>
            <h1 className="text-lg font-semibold capitalize">{activeView === 'create' ? 'Create Video' : activeView}</h1>
            <p className="text-xs text-studio-500">{activeView === 'create' ? 'Transform your ideas into cinematic videos' : activeView === 'gallery' ? `${videos.length} videos saved` : `${history.length} recent prompts`}</p>
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {!apiKeyReady ? (
            <AuthGate onConnect={handleConnectKey} />
          ) : activeView === 'create' ? (
            <CreateView
              prompt={prompt}
              setPrompt={setPrompt}
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
              resolution={resolution}
              setResolution={setResolution}
              duration={duration}
              setDuration={setDuration}
              enhancePrompt={enhancePrompt}
              setEnhancePrompt={setEnhancePrompt}
              cameraAngle={cameraAngle}
              setCameraAngle={setCameraAngle}
              cameraMode={cameraMode}
              setCameraMode={setCameraMode}
              cameraAngleOpen={cameraAngleOpen}
              setCameraAngleOpen={setCameraAngleOpen}
              cameraModeOpen={cameraModeOpen}
              setCameraModeOpen={setCameraModeOpen}
              startFrameImage={startFrameImage}
              endFrameImage={endFrameImage}
              onStartFrameSelect={handleStartFrameSelect}
              onEndFrameSelect={handleEndFrameSelect}
              onRemoveStartFrame={removeStartFrame}
              onRemoveEndFrame={removeEndFrame}
              startFrameInputRef={startFrameInputRef}
              endFrameInputRef={endFrameInputRef}
              onGenerate={handleGenerate}
              onPresetSelect={handlePresetSelect}
              isGenerating={isGenerating}
              status={status}
              progress={progress}
              loadingStep={LOADING_STEPS[loadingStepIndex]}
              errorMsg={errorMsg}
              onRetry={handleRetry}
              onDismissError={() => setErrorMsg(null)}
              previewVideo={previewVideo}
              onSavePreview={handleSavePreview}
              onDiscardPreview={handleDiscardPreview}
            />
          ) : activeView === 'gallery' ? (
            <GalleryView videos={videos} onDelete={deleteVideo} />
          ) : (
            <HistoryView history={history} onSelect={handleHistorySelect} onClear={clearHistory} />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-studio-950/95 backdrop-blur-xl border-t border-white/5 px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          <MobileBottomNavItem
            icon={<PlusIcon className="w-5 h-5" />}
            label="Create"
            active={activeView === 'create'}
            onClick={() => setActiveView('create')}
          />
          <MobileBottomNavItem
            icon={<LayersIcon className="w-5 h-5" />}
            label="Gallery"
            active={activeView === 'gallery'}
            onClick={() => setActiveView('gallery')}
            badge={videos.length > 0 ? videos.length : undefined}
          />
          <MobileBottomNavItem
            icon={<HistoryIcon className="w-5 h-5" />}
            label="History"
            active={activeView === 'history'}
            onClick={() => setActiveView('history')}
          />
        </div>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <Modal onClose={() => setShowSettings(false)} title="Settings">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium text-emerald-400">API Connected</span>
              </div>
              <code className="text-xs text-studio-400 font-mono">{maskedKey}</code>
            </div>
            <button onClick={handleDisconnect} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all text-sm active:scale-95">
              <LogOutIcon className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}


// ============ COMPONENTS ============

// Navigation Item (Desktop)
const NavItem = ({ icon, label, active, collapsed, onClick, badge }: {
  icon: React.ReactNode; label: string; active: boolean; collapsed: boolean; onClick: () => void; badge?: number
}) => (
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

// Mobile Navigation Item (Menu)
const MobileNavItem = ({ icon, label, active, onClick, badge }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: number
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all active:scale-[0.98] ${active
      ? 'bg-white/10 text-white'
      : 'text-studio-400 hover:bg-white/5'
      }`}
  >
    {icon}
    <span className="text-base font-medium flex-1 text-left">{label}</span>
    {badge !== undefined && (
      <span className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold">{badge}</span>
    )}
  </button>
);

// Mobile Bottom Navigation Item
const MobileBottomNavItem = ({ icon, label, active, onClick, badge }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: number
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all active:scale-95 relative ${active
      ? 'text-accent'
      : 'text-studio-500'
      }`}
  >
    <div className="relative">
      {icon}
      {badge !== undefined && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[9px] font-bold text-white flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </div>
    <span className="text-[10px] font-medium">{label}</span>
    {active && (
      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
    )}
  </button>
);

// Auth Gate
const AuthGate = ({ onConnect }: { onConnect: () => void }) => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="max-w-md w-full animate-fade-in-up">
      <div className="glass-panel rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 to-orange-500/50" />
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <KeyIcon className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Connect Your API Key</h3>
        <p className="text-studio-500 text-sm mb-6 leading-relaxed">
          To start creating videos with Veo 3, connect your Google Cloud API key.
        </p>
        <button onClick={onConnect} className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-studio-100 transition-all shadow-glow">
          Connect API Key
        </button>
        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="inline-block mt-4 text-xs text-studio-500 hover:text-white transition-colors">
          Learn about API billing →
        </a>
      </div>
    </div>
  </div>
);

// Modal
const Modal = ({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-w-md bg-studio-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <button onClick={onClose} className="text-studio-500 hover:text-white transition-colors">
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// Create View
const CreateView = ({
  prompt, setPrompt, aspectRatio, setAspectRatio, resolution, setResolution,
  duration, setDuration,
  enhancePrompt, setEnhancePrompt,
  cameraAngle, setCameraAngle,
  cameraMode, setCameraMode,
  cameraAngleOpen, setCameraAngleOpen,
  cameraModeOpen, setCameraModeOpen,
  startFrameImage, endFrameImage,
  onStartFrameSelect, onEndFrameSelect, onRemoveStartFrame, onRemoveEndFrame,
  startFrameInputRef, endFrameInputRef,
  onGenerate, onPresetSelect,
  isGenerating, status, progress, loadingStep, errorMsg, onRetry, onDismissError,
  previewVideo, onSavePreview, onDiscardPreview
}: {
  prompt: string; setPrompt: (v: string) => void;
  aspectRatio: '9:16' | '16:9'; setAspectRatio: (v: '9:16' | '16:9') => void;
  resolution: '720p' | '1080p'; setResolution: (v: '720p' | '1080p') => void;
  duration: number; setDuration: (v: number) => void;
  enhancePrompt: boolean; setEnhancePrompt: (v: boolean) => void;
  cameraAngle: string | null; setCameraAngle: (v: string | null) => void;
  cameraMode: string | null; setCameraMode: (v: string | null) => void;
  cameraAngleOpen: boolean; setCameraAngleOpen: (v: boolean) => void;
  cameraModeOpen: boolean; setCameraModeOpen: (v: boolean) => void;
  startFrameImage: { file: File; previewUrl: string } | null;
  endFrameImage: { file: File; previewUrl: string } | null;
  onStartFrameSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndFrameSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveStartFrame: () => void;
  onRemoveEndFrame: () => void;
  startFrameInputRef: React.RefObject<HTMLInputElement>;
  endFrameInputRef: React.RefObject<HTMLInputElement>;
  onGenerate: () => void;
  onPresetSelect: (preset: typeof PRESETS[0]) => void;
  isGenerating: boolean;
  status: GenerationStatus;
  progress: number;
  loadingStep: string;
  errorMsg: string | null;
  onRetry: () => void;
  onDismissError: () => void;
  previewVideo: VideoData | null;
  onSavePreview: () => void;
  onDiscardPreview: () => void;
}) => {
  // Show preview if we have one
  if (previewVideo) {
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
                <video src={previewVideo.url} className="max-h-[300px] md:max-h-[500px] w-auto max-w-full" controls autoPlay loop playsInline />
              </div>

              {/* Details */}
              <div className="w-full lg:w-80 p-4 md:p-6 border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div>
                      <h4 className="text-white font-medium mb-0.5">Your Video</h4>
                      <p className="text-[10px] text-studio-500 font-mono">{previewVideo.id.toUpperCase()}</p>
                    </div>
                    <div className="flex gap-2 lg:hidden">
                      <span className="text-[10px] text-white font-mono bg-white/5 px-2 py-1 rounded">{previewVideo.aspectRatio}</span>
                      <span className="text-[10px] text-white font-mono bg-white/5 px-2 py-1 rounded">MP4</span>
                    </div>
                  </div>

                  <div className="space-y-4 hidden lg:block">
                    <div>
                      <span className="text-[10px] uppercase text-studio-500 tracking-wider block mb-1">Prompt</span>
                      <p className="text-sm text-studio-300 italic leading-relaxed border-l-2 border-accent/30 pl-3 line-clamp-4">
                        "{previewVideo.prompt || "Frame-based video"}"
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <span className="text-[10px] uppercase text-studio-500 tracking-wider block mb-1">Ratio</span>
                        <span className="text-xs text-white font-mono bg-white/5 px-2 py-1 rounded">{previewVideo.aspectRatio}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-studio-500 tracking-wider block mb-1">Format</span>
                        <span className="text-xs text-white font-mono bg-white/5 px-2 py-1 rounded">MP4</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-4 lg:mt-6">
                  <button onClick={onSavePreview} className="w-full flex items-center justify-center gap-2 py-3.5 md:py-3 rounded-xl bg-white text-black font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow">
                    <CheckCircleIcon className="w-4 h-4" />
                    Save to Gallery
                  </button>
                  <div className="flex gap-2 md:gap-3">
                    <a href={previewVideo.url} download={`veo-${previewVideo.id}.mp4`} className="flex-1 flex items-center justify-center gap-2 py-3 md:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/5 transition-colors active:scale-[0.98]">
                      <DownloadIcon className="w-3.5 h-3.5 md:w-3 md:h-3" />
                      Download
                    </a>
                    <button onClick={onDiscardPreview} className="flex-1 flex items-center justify-center gap-2 py-3 md:py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition-colors active:scale-[0.98]">
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
  }

  // Show generating state
  if (isGenerating) {
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
            <span className="text-studio-400 font-mono text-[10px] md:text-xs truncate max-w-[200px] md:max-w-none">{loadingStep}</span>
            <span className="text-white font-bold tabular-nums ml-2">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    );
  }

  const [activePreset, setActivePreset] = useState<string | null>(null);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto pb-20 md:pb-8">
      {/* Error Message */}
      {errorMsg && (
        <div className="mb-4 md:mb-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 md:p-4 rounded-xl bg-red-950/30 border border-red-500/30">
            <div className="flex items-center gap-3 flex-1">
              <AlertTriangleIcon className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-300 line-clamp-2">{errorMsg}</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button onClick={onRetry} className="flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors active:scale-95">
                <RefreshCcwIcon className="w-3 h-3 inline mr-1" />
                Retry
              </button>
              <button onClick={onDismissError} className="p-2 sm:p-1.5 text-red-400/50 hover:text-red-300 transition-colors">
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Presets - Horizontal Scrolling on Mobile */}
      <div className="mb-4 md:mb-6">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <WandIcon className="w-4 h-4 text-studio-500" />
          <span className="text-sm font-medium text-studio-400">Quick Presets</span>
        </div>

        {/* Scrollable container on mobile, wrap on desktop */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible scrollbar-hide">
          {PRESETS.map(preset => (
            <PresetChip
              key={preset.id}
              preset={preset}
              isActive={activePreset === preset.id}
              onSelect={() => {
                setActivePreset(preset.id);
                onPresetSelect(preset);
              }}
            />
          ))}
        </div>
      </div>

      {/* Two Column Layout - Stacks on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 md:gap-6">
        {/* Left Column - Main Input */}
        <div className="space-y-4 md:space-y-6">
          {/* Prompt Input */}
          <div className="glass-panel rounded-xl md:rounded-2xl overflow-hidden  bg-white/5">
            {/* Frame Images - Two columns on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 pt-4">
              {/* Start Frame */}
              <div>
                {startFrameImage ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <img src={startFrameImage.previewUrl} alt="Start Frame" className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">Start Frame</p>
                      <p className="text-xs text-studio-500 truncate">{startFrameImage.file.name}</p>
                    </div>
                    <button onClick={onRemoveStartFrame} className="p-2 rounded-lg hover:bg-white/10 text-studio-500 hover:text-white transition-colors shrink-0">
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
                    <img src={endFrameImage.previewUrl} alt="End Frame" className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">End Frame</p>
                      <p className="text-xs text-studio-500 truncate">{endFrameImage.file.name}</p>
                    </div>
                    <button onClick={onRemoveEndFrame} className="p-2 rounded-lg hover:bg-white/10 text-studio-500 hover:text-white transition-colors shrink-0">
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

            

            {/* Bottom Bar with Frame Image Uploads and Generate Button */}
            <div className="px-4 pb-4 md:px-6 md:pb-6 space-y-3 md:space-y-4">
              {/* Hidden file inputs */}
              <input type="file" ref={startFrameInputRef} onChange={onStartFrameSelect} accept="image/*" className="hidden" />
              <input type="file" ref={endFrameInputRef} onChange={onEndFrameSelect} accept="image/*" className="hidden" />


              <div className="flex items-center justify-between gap-3">
                {/* Aspect Ratio */}
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

                  {/* duration */}
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
                  <div className={`w-11 h-6 rounded-full transition-all duration-200 ${enhancePrompt
                    ? 'bg-accent'
                    : 'bg-studio-700'
                    }`}>
                    <div className={`w-5 h-5 rounded-full bg-white transition-all duration-200 transform ${enhancePrompt
                      ? 'translate-x-5'
                      : 'translate-x-0.5'
                      } mt-0.5`} />
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-white">Enhance</span>
                 
                </div>
              </label>

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

            </div>
          </div>
        </div>

        {/* Right Column - Settings (Horizontal on mobile, vertical on desktop) */}
        <div className="space-y-3 md:space-y-4 order-first lg:order-last">
          {/* Settings Panel - Horizontal scroll on mobile */}
          <div className="glass-panel rounded-xl md:rounded-2xl p-4 md:p-5">
            {/* dummy */}
          </div>

          {/* Camera Settings Panel */}
          <div className="glass-panel rounded-xl md:rounded-2xl p-4 md:p-5">
            <div className="flex gap-4 md:flex-col md:gap-5">
              {/* Camera Angle */}
              <div className="flex-1 min-w-[140px]">
                <button
                  onClick={() => setCameraAngleOpen(!cameraAngleOpen)}
                  className="w-full flex items-center justify-between mb-2 md:mb-3 group"
                >
                  <label className="text-[10px] md:text-xs text-studio-500 uppercase tracking-wider font-medium cursor-pointer group-hover:text-studio-400 transition-colors">
                    Camera Angle
                  </label>
                  <ChevronDownIcon className={`w-3.5 h-3.5 text-studio-500 transition-transform duration-200 ${cameraAngleOpen ? 'rotate-180' : ''}`} />
                </button>
                {cameraAngleOpen && (
                  <div className="grid grid-cols-2 gap-1.5 bg-studio-900 p-1 rounded-lg border border-white/5">
                    <button
                      onClick={() => setCameraAngle(null)}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${!cameraAngle
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="None"
                    >
                      <XIcon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">None</span>
                    </button>
                    <button
                      onClick={() => setCameraAngle('wide')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'wide'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Wide Shot"
                    >
                      <HugeiconsIcon icon={Maximize01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Wide</span>
                    </button>
                    <button
                      onClick={() => setCameraAngle('medium')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'medium'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Medium Shot"
                    >
                      <HugeiconsIcon icon={ViewIcon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Medium</span>
                    </button>
                    <button
                      onClick={() => setCameraAngle('close-up')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'close-up'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Close-Up"
                    >
                      <HugeiconsIcon icon={ZoomInAreaIcon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Close</span>
                    </button>
                    <button
                      onClick={() => setCameraAngle('extreme-close')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'extreme-close'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Extreme Close-Up"
                    >
                      <HugeiconsIcon icon={Camera01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Extreme</span>
                    </button>
                    <button
                      onClick={() => setCameraAngle('bird-eye')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'bird-eye'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Bird's Eye View"
                    >
                      <HugeiconsIcon icon={ThreeDViewIcon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Bird's Eye</span>
                    </button>
                    <button
                      onClick={() => setCameraAngle('low-angle')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'low-angle'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Low Angle"
                    >
                      <HugeiconsIcon icon={ArrowUp01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Low</span>
                    </button>
                    <button
                      onClick={() => setCameraAngle('high-angle')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'high-angle'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="High Angle"
                    >
                      <HugeiconsIcon icon={ArrowDown01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">High</span>
                    </button>
                    <button
                      onClick={() => setCameraAngle('dutch')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'dutch'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Dutch Angle"
                    >
                      <HugeiconsIcon icon={Angle01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Dutch</span>
                    </button>
                    <button
                      onClick={() => setCameraAngle('point-of-view')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'point-of-view'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Point of View"
                    >
                      <HugeiconsIcon icon={CameraVideoIcon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">POV</span>
                    </button>
                  </div>
                )}
                {cameraAngleOpen && (
                  <p className="text-[10px] text-studio-600 mt-1.5 md:mt-2 hidden md:block">
                    Optional camera angle preset
                  </p>
                )}
              </div>

              {/* Divider - vertical on mobile, horizontal on desktop */}
              <div className="w-px md:w-full h-auto md:h-px bg-white/5" />

              {/* Camera Mode */}
              <div className="flex-1 min-w-[140px]">
                <button
                  onClick={() => setCameraModeOpen(!cameraModeOpen)}
                  className="w-full flex items-center justify-between mb-2 md:mb-3 group"
                >
                  <label className="text-[10px] md:text-xs text-studio-500 uppercase tracking-wider font-medium cursor-pointer group-hover:text-studio-400 transition-colors">
                    Camera Mode
                  </label>
                  <ChevronDownIcon className={`w-3.5 h-3.5 text-studio-500 transition-transform duration-200 ${cameraModeOpen ? 'rotate-180' : ''}`} />
                </button>
                {cameraModeOpen && (
                  <div className="grid grid-cols-2 gap-1.5 bg-studio-900 p-1 rounded-lg border border-white/5">
                    <button
                      onClick={() => setCameraMode(null)}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${!cameraMode
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="None"
                    >
                      <XIcon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">None</span>
                    </button>
                    <button
                      onClick={() => setCameraMode('handheld')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'handheld'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Handheld"
                    >
                      <HugeiconsIcon icon={Camera01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Handheld</span>
                    </button>
                    <button
                      onClick={() => setCameraMode('steady')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'steady'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Steady"
                    >
                      <HugeiconsIcon icon={Minimize01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Steady</span>
                    </button>
                    <button
                      onClick={() => setCameraMode('tracking')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'tracking'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Tracking Shot"
                    >
                      <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Tracking</span>
                    </button>
                    <button
                      onClick={() => setCameraMode('dolly')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'dolly'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Dolly Shot"
                    >
                      <HugeiconsIcon icon={ArrowLeft01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Dolly</span>
                    </button>
                    <button
                      onClick={() => setCameraMode('pan')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'pan'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Pan"
                    >
                      <HugeiconsIcon icon={ArrowLeft01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Pan</span>
                    </button>
                    <button
                      onClick={() => setCameraMode('tilt')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'tilt'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Tilt"
                    >
                      <HugeiconsIcon icon={ArrowUp01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Tilt</span>
                    </button>
                    <button
                      onClick={() => setCameraMode('zoom')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'zoom'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Zoom"
                    >
                      <HugeiconsIcon icon={ZoomInAreaIcon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Zoom</span>
                    </button>
                    <button
                      onClick={() => setCameraMode('static')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'static'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Static"
                    >
                      <HugeiconsIcon icon={Minimize01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Static</span>
                    </button>
                    <button
                      onClick={() => setCameraMode('crane')}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'crane'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-studio-500 hover:text-white hover:bg-white/5'
                        }`}
                      title="Crane Shot"
                    >
                      <HugeiconsIcon icon={CraneIcon} size={14} color="currentColor" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Crane</span>
                    </button>
                  </div>
                )}
                {cameraModeOpen && (
                  <p className="text-[10px] text-studio-600 mt-1.5 md:mt-2 hidden md:block">
                    Optional camera movement preset
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Info Card - Hidden on mobile to save space */}
          <div className="hidden md:block glass-panel rounded-xl p-4 border-accent/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/10 shrink-0">
                <InfoIcon className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white mb-1">Generation Tips</h4>
                <p className="text-[11px] text-studio-500 leading-relaxed">
                  Be specific with details like lighting, camera angles, and mood for best results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// Preset Chip with Popover
const PresetChip = ({
  preset,
  isActive,
  onSelect
}: {
  preset: typeof PRESETS[0];
  isActive: boolean;
  onSelect: () => void;
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chipRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowPopover(true);
    }, 400); // Delay before showing popover
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
        {/* Icon with subtle animation */}
        <span className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
          {preset.icon}
        </span>

        {/* Name */}
        <span className="text-sm font-medium whitespace-nowrap">{preset.name}</span>

        {/* Active indicator dot */}
        {isActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        )}
      </button>

      {/* Popover */}
      {showPopover && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 animate-fade-in-up"
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setShowPopover(true);
          }}
          onMouseLeave={handleMouseLeave}
        >
          {/* Arrow */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-studio-900 border-l border-t border-white/10" />

          {/* Content */}
          <div className="relative w-72 p-4 rounded-xl bg-studio-900 border border-white/10 shadow-2xl">
            {/* Header */}
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

            {/* Divider */}
            <div className="h-px bg-white/5 mb-3" />

            {/* Prompt Preview */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <InfoIcon className="w-3 h-3 text-studio-500" />
                <span className="text-[10px] uppercase tracking-wider text-studio-500 font-medium">Prompt Template</span>
              </div>
              <p className="text-xs text-studio-400 leading-relaxed italic">
                "{preset.prompt}"
              </p>
            </div>

            {/* Click hint */}
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

// Gallery View
const GalleryView = ({ videos, onDelete }: { videos: VideoData[]; onDelete: (id: string) => void }) => {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="group relative bg-studio-900 rounded-xl md:rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`${video.aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[400px]' : 'aspect-video'} bg-black relative`}>
              <video src={video.url} controls className="w-full h-full object-cover" loop playsInline />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* Info */}
            <div className="p-3 md:p-4">
              <p className="text-sm text-white line-clamp-2 mb-2">{video.prompt || "Frame-based video"}</p>
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

// History View
const HistoryView = ({ history, onSelect, onClear }: {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void
}) => {
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
        <button onClick={onClear} className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 -mr-2 active:scale-95">
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
