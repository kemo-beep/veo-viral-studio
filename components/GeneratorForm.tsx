import React, { useState, useRef, useEffect } from 'react';
import { VeoConfig, GenerationStatus } from '../types';
import { UploadIcon, XIcon, SparklesIcon, ImageIcon, WandIcon } from './Icons';

interface Preset {
  id: string;
  name: string;
  prompt: string;
  aspectRatio: '9:16' | '16:9';
  resolution: '720p' | '1080p';
  description: string;
}

const PRESETS: Preset[] = [
  {
    id: 'cinematic',
    name: 'Cinematic',
    prompt: 'Cinematic wide shot with dramatic lighting, shallow depth of field, film grain, anamorphic lens flare, golden hour atmosphere, professional color grading',
    aspectRatio: '16:9',
    resolution: '1080p',
    description: 'Hollywood-style dramatic visuals'
  },
  {
    id: 'fast-paced',
    name: 'Fast-Paced',
    prompt: 'Dynamic fast-paced action sequence, quick cuts, energetic movement, vibrant colors, high contrast, motion blur, intense energy',
    aspectRatio: '9:16',
    resolution: '720p',
    description: 'High-energy viral content'
  },
  {
    id: 'documentary',
    name: 'Documentary',
    prompt: 'Documentary style footage, natural lighting, authentic atmosphere, observational perspective, realistic colors, handheld camera feel',
    aspectRatio: '16:9',
    resolution: '1080p',
    description: 'Authentic storytelling style'
  },
  {
    id: 'dreamy',
    name: 'Dreamy',
    prompt: 'Ethereal dreamy atmosphere, soft focus, pastel colors, floating particles, magical lighting, surreal ambiance, gentle movements',
    aspectRatio: '9:16',
    resolution: '720p',
    description: 'Soft and magical aesthetic'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    prompt: 'Futuristic cyberpunk cityscape, neon lights, rain-soaked streets, holographic displays, dark atmosphere, vibrant purple and cyan colors, high-tech aesthetic',
    aspectRatio: '9:16',
    resolution: '1080p',
    description: 'Sci-fi neon aesthetic'
  },
  {
    id: 'nature',
    name: 'Nature',
    prompt: 'Stunning nature documentary, wildlife in natural habitat, breathtaking landscapes, golden hour lighting, 4K clarity, David Attenborough style',
    aspectRatio: '16:9',
    resolution: '1080p',
    description: 'Natural world beauty'
  }
];

interface GeneratorFormProps {
  onGenerate: (config: VeoConfig) => void;
  status: GenerationStatus;
  prefillConfig?: VeoConfig | null;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, status, prefillConfig }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [selectedImage, setSelectedImage] = useState<{ file: File; previewUrl: string } | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const presetsRef = useRef<HTMLDivElement>(null);

  // Apply prefill settings when they change
  useEffect(() => {
    if (prefillConfig) {
        setPrompt(prefillConfig.prompt);
        setAspectRatio(prefillConfig.aspectRatio);
        setResolution(prefillConfig.resolution);
        // Note: We intentionally do not restore the image file from history as it cannot be persisted reliably in localStorage.
        // If the prefillConfig comes with an image (from a retry in same session), we use it.
        if (prefillConfig.image) {
            setSelectedImage(prefillConfig.image);
        } else {
            // Reset image if prefill has none, or keep current if we want to mix? 
            // Better to reset to match the "load history" intent.
            setSelectedImage(null);
        }
    }
  }, [prefillConfig]);

  // Close presets dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (presetsRef.current && !presetsRef.current.contains(event.target as Node)) {
        setShowPresets(false);
      }
    };

    if (showPresets) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPresets]);

  const handlePresetSelect = (preset: Preset) => {
    setPrompt(preset.prompt);
    setAspectRatio(preset.aspectRatio);
    setResolution(preset.resolution);
    setShowPresets(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage({ file, previewUrl });
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt && !selectedImage) return;
    
    onGenerate({
      prompt,
      aspectRatio,
      resolution,
      image: selectedImage
    });
  };

  const isGenerating = status === GenerationStatus.GENERATING || status === GenerationStatus.PREPARING;

  return (
    <div className="w-full max-w-4xl mx-auto transform transition-all">
      <form onSubmit={handleSubmit} className="relative group">
        
        {/* Main Input Container */}
        <div className="relative overflow-hidden rounded-2xl glass-panel shadow-2xl transition-shadow duration-500 hover:shadow-glow/20 border-opacity-50">
          
          {/* Glowing Top Border Effect */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-glow/50 to-transparent opacity-50" />
          
          <div className="p-1">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe new vision... e.g. 'A futuristic cyberpunk city with neon rain, cinematic lighting, 8k resolution'"
              className="w-full bg-transparent border-none text-white text-lg md:text-xl p-6 placeholder-studio-500 focus:ring-0 focus:outline-none min-h-[140px] resize-none leading-relaxed"
              disabled={isGenerating}
            />
          </div>

          {/* Controls Bar */}
          <div className="bg-studio-900/30 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5">
            
            {/* Left Actions */}
            <div className="flex items-center gap-4 w-full md:w-auto flex-wrap">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                
                {/* Presets Dropdown */}
                <div className="relative" ref={presetsRef}>
                  <button
                    type="button"
                    onClick={() => setShowPresets(!showPresets)}
                    disabled={isGenerating}
                    className="flex items-center gap-2 text-studio-300 hover:text-white transition-colors group/btn"
                  >
                    <div className="p-2 rounded-lg bg-white/5 group-hover/btn:bg-white/10 transition-colors">
                      <WandIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Presets</span>
                  </button>

                  {showPresets && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-studio-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
                      <div className="p-3 border-b border-white/5 bg-white/5">
                        <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Style Presets</h4>
                      </div>
                      <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {PRESETS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handlePresetSelect(preset)}
                            className="w-full text-left p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 group"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-semibold text-white mb-1 group-hover:text-accent-glow transition-colors">
                                  {preset.name}
                                </h5>
                                <p className="text-xs text-studio-500 mb-2 line-clamp-2">
                                  {preset.description}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono text-studio-600 bg-white/5 px-1.5 py-0.5 rounded">
                                    {preset.aspectRatio}
                                  </span>
                                  <span className="text-[10px] font-mono text-studio-600 bg-white/5 px-1.5 py-0.5 rounded">
                                    {preset.resolution}
                                  </span>
                                </div>
                              </div>
                              <SparklesIcon className="w-4 h-4 text-studio-600 group-hover:text-accent-glow transition-colors shrink-0" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedImage ? (
                  <div className="relative group/image overflow-hidden rounded-lg border border-white/10">
                    <img 
                      src={selectedImage.previewUrl} 
                      alt="Reference" 
                      className="h-10 w-10 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity cursor-pointer" onClick={removeImage}>
                      <XIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isGenerating}
                    className="flex items-center gap-2 text-studio-300 hover:text-white transition-colors group/btn"
                  >
                    <div className="p-2 rounded-lg bg-white/5 group-hover/btn:bg-white/10 transition-colors">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Add Image</span>
                  </button>
                )}
                
                <div className="h-6 w-[1px] bg-white/10 hidden md:block" />

                <div className="flex items-center gap-2">
                    {/* Aspect Ratio */}
                    <div className="flex bg-studio-950/50 p-1 rounded-lg border border-white/5">
                       <button
                        type="button"
                        onClick={() => setAspectRatio('9:16')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${aspectRatio === '9:16' ? 'bg-accent text-white shadow-glow' : 'text-studio-500 hover:text-studio-300'}`}
                       >
                         9:16
                       </button>
                       <button
                        type="button"
                        onClick={() => setAspectRatio('16:9')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${aspectRatio === '16:9' ? 'bg-accent text-white shadow-glow' : 'text-studio-500 hover:text-studio-300'}`}
                       >
                         16:9
                       </button>
                    </div>

                    {/* Resolution */}
                    <div className="flex bg-studio-950/50 p-1 rounded-lg border border-white/5">
                       <button
                        type="button"
                        onClick={() => setResolution('720p')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${resolution === '720p' ? 'bg-accent text-white shadow-glow' : 'text-studio-500 hover:text-studio-300'}`}
                       >
                         720p
                       </button>
                       <button
                        type="button"
                        onClick={() => setResolution('1080p')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${resolution === '1080p' ? 'bg-accent text-white shadow-glow' : 'text-studio-500 hover:text-studio-300'}`}
                       >
                         1080p
                       </button>
                    </div>
                </div>
            </div>

            {/* Right Action: Generate */}
            <div className="w-full md:w-auto flex justify-end">
                <button
                    type="submit"
                    disabled={isGenerating || (!prompt && !selectedImage)}
                    className={`
                        relative px-6 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300
                        ${isGenerating || (!prompt && !selectedImage)
                            ? 'bg-studio-800 text-studio-500 cursor-not-allowed border border-white/5' 
                            : 'bg-white text-black hover:scale-105 hover:shadow-glow shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-transparent'
                        }
                    `}
                >
                    {isGenerating ? (
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border-2 border-studio-500 border-t-black rounded-full animate-spin"></div>
                           <span>Processing...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span>Generate Video</span>
                            <SparklesIcon className="w-4 h-4" />
                        </div>
                    )}
                </button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-glow to-primary-glow rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000 -z-10"></div>
      </form>
      
      {/* Tips */}
      <div className="mt-4 flex justify-center space-x-6 text-xs text-studio-500 font-medium">
        <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-accent-glow"></span>
            Veo 3 Model
        </span>
        <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-primary-glow"></span>
            HD {resolution}
        </span>
      </div>
    </div>
  );
};