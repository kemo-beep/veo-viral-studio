import React, { useState } from 'react';
import { GenerationStatus, VideoData, VeoConfig } from '../../types';
import { WandIcon, AlertTriangleIcon, RefreshCcwIcon, XIcon, InfoIcon } from '../Icons';
import { PRESETS } from '../../constants';
import { PresetChip } from '../create/PresetChip';
import { PromptInput } from '../create/PromptInput';
import { CameraControls } from '../create/CameraControls';
import { VideoPreview } from '../create/VideoPreview';
import { GeneratingState } from '../create/GeneratingState';

interface CreateViewProps {
    prompt: string;
    setPrompt: (v: string) => void;
    aspectRatio: '9:16' | '16:9';
    setAspectRatio: (v: '9:16' | '16:9') => void;
    resolution: '720p' | '1080p';
    setResolution: (v: '720p' | '1080p') => void;
    duration: number;
    setDuration: (v: number) => void;
    enhancePrompt: boolean;
    setEnhancePrompt: (v: boolean) => void;
    cameraAngle: string | null;
    setCameraAngle: (v: string | null) => void;
    cameraMode: string | null;
    setCameraMode: (v: string | null) => void;
    cameraAngleOpen: boolean;
    setCameraAngleOpen: (v: boolean) => void;
    cameraModeOpen: boolean;
    setCameraModeOpen: (v: boolean) => void;
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
}

export const CreateView = ({
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
    cameraAngle,
    setCameraAngle,
    cameraMode,
    setCameraMode,
    cameraAngleOpen,
    setCameraAngleOpen,
    cameraModeOpen,
    setCameraModeOpen,
    startFrameImage,
    endFrameImage,
    onStartFrameSelect,
    onEndFrameSelect,
    onRemoveStartFrame,
    onRemoveEndFrame,
    startFrameInputRef,
    endFrameInputRef,
    onGenerate,
    onPresetSelect,
    isGenerating,
    status,
    progress,
    loadingStep,
    errorMsg,
    onRetry,
    onDismissError,
    previewVideo,
    onSavePreview,
    onDiscardPreview,
}: CreateViewProps) => {
    const [activePreset, setActivePreset] = useState<string | null>(null);

    // Show preview if we have one
    if (previewVideo) {
        return <VideoPreview video={previewVideo} onSave={onSavePreview} onDiscard={onDiscardPreview} />;
    }

    // Show generating state
    if (isGenerating) {
        return <GeneratingState progress={progress} loadingStep={loadingStep} />;
    }

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
                            <button
                                onClick={onRetry}
                                className="flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors active:scale-95"
                            >
                                <RefreshCcwIcon className="w-3 h-3 inline mr-1" />
                                Retry
                            </button>
                            <button
                                onClick={onDismissError}
                                className="p-2 sm:p-1.5 text-red-400/50 hover:text-red-300 transition-colors"
                            >
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
                    {PRESETS.map((preset) => (
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
                    <PromptInput
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
                        startFrameImage={startFrameImage}
                        endFrameImage={endFrameImage}
                        onStartFrameSelect={onStartFrameSelect}
                        onEndFrameSelect={onEndFrameSelect}
                        onRemoveStartFrame={onRemoveStartFrame}
                        onRemoveEndFrame={onRemoveEndFrame}
                        startFrameInputRef={startFrameInputRef}
                        endFrameInputRef={endFrameInputRef}
                        onGenerate={onGenerate}
                        isGenerating={isGenerating}
                    />
                </div>

                {/* Right Column - Settings (Horizontal on mobile, vertical on desktop) */}
                <div className="space-y-3 md:space-y-4 order-first lg:order-last">
                    {/* Settings Panel - Horizontal scroll on mobile */}
                    <div className="glass-panel rounded-xl md:rounded-2xl p-4 md:p-5">
                        {/* dummy */}
                    </div>

                    {/* Camera Settings Panel */}
                    <CameraControls
                        cameraAngle={cameraAngle}
                        setCameraAngle={setCameraAngle}
                        cameraMode={cameraMode}
                        setCameraMode={setCameraMode}
                        cameraAngleOpen={cameraAngleOpen}
                        setCameraAngleOpen={setCameraAngleOpen}
                        cameraModeOpen={cameraModeOpen}
                        setCameraModeOpen={setCameraModeOpen}
                    />

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

