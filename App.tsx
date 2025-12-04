import React, { useState, useEffect, useRef } from 'react';
import { ensureApiKey, requestApiKey, generateVideo } from './services/geminiService';
import { GenerationStatus, VideoData, VeoConfig, HistoryItem } from './types';
import { LOADING_STEPS, PRESETS } from './constants';
import { enhancePromptText } from './utils/promptEnhancer';
import { LogOutIcon } from './components/Icons';

// Layout Components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileHeader } from './components/layout/MobileHeader';
import { MobileMenu } from './components/layout/MobileMenu';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

// View Components
import { CreateView } from './components/views/CreateView';
import { GalleryView } from './components/views/GalleryView';
import { HistoryView } from './components/views/HistoryView';

// Common Components
import { AuthGate } from './components/common/AuthGate';
import { Modal } from './components/common/Modal';

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
      <MobileHeader
        apiKeyReady={apiKeyReady}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Mobile Menu Overlay */}
      <MobileMenu
        activeView={activeView}
        setActiveView={setActiveView}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        apiKeyReady={apiKeyReady}
        onConnectKey={handleConnectKey}
        onShowSettings={() => setShowSettings(true)}
        videosCount={videos.length}
      />

      {/* Desktop Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        apiKeyReady={apiKeyReady}
        onConnectKey={handleConnectKey}
        onShowSettings={() => setShowSettings(true)}
        videosCount={videos.length}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Desktop Top Bar */}
        <Header
          activeView={activeView}
          videosCount={videos.length}
          historyCount={history.length}
          apiKeyReady={apiKeyReady}
          aspectRatio={aspectRatio}
          resolution={resolution}
        />

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
      <MobileBottomNav
        activeView={activeView}
        setActiveView={setActiveView}
        videosCount={videos.length}
      />

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
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all text-sm active:scale-95"
            >
              <LogOutIcon className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
