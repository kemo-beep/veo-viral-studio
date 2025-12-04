export const LOADING_STEPS = [
    "Initializing Veo neural engine...",
    "Parsing semantic structures...",
    "Synthesizing spatial geometry...",
    "Computing temporal motion vectors...",
    "Rendering high-fidelity textures...",
    "Applying cinematic lighting...",
    "Finalizing encoding stream..."
];

export const PRESETS = [
    { id: 'cinematic', name: 'Cinematic', prompt: 'Cinematic wide shot with dramatic lighting, shallow depth of field, film grain, anamorphic lens flare, golden hour atmosphere', aspectRatio: '16:9' as const, resolution: '1080p' as const, icon: '🎬' },
    { id: 'viral', name: 'Viral Short', prompt: 'Dynamic fast-paced action, energetic movement, vibrant colors, high contrast, motion blur, trending aesthetic', aspectRatio: '9:16' as const, resolution: '720p' as const, icon: '🔥' },
    { id: 'dreamy', name: 'Dreamy', prompt: 'Ethereal dreamy atmosphere, soft focus, pastel colors, floating particles, magical lighting, surreal ambiance', aspectRatio: '9:16' as const, resolution: '720p' as const, icon: '✨' },
    { id: 'cyberpunk', name: 'Cyberpunk', prompt: 'Futuristic cyberpunk cityscape, neon lights, rain-soaked streets, holographic displays, vibrant purple and cyan', aspectRatio: '9:16' as const, resolution: '1080p' as const, icon: '🌃' },
    { id: 'nature', name: 'Nature', prompt: 'Stunning nature documentary, wildlife in natural habitat, breathtaking landscapes, golden hour lighting', aspectRatio: '16:9' as const, resolution: '1080p' as const, icon: '🌿' },
    { id: 'minimal', name: 'Minimal', prompt: 'Clean minimal aesthetic, simple composition, soft neutral colors, elegant movement, modern design', aspectRatio: '9:16' as const, resolution: '720p' as const, icon: '◯' },
];

