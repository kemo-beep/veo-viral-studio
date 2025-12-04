export const enhancePromptText = (text: string, angle?: string | null, mode?: string | null): string => {
    if (!text.trim()) return text;

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

