import { GoogleGenAI } from "@google/genai";
import { VeoConfig } from "../types";

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove data url prefix (e.g. "data:image/png;base64,")
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

export const ensureApiKey = async (): Promise<boolean> => {
  // Check if API key is available in environment variables first
  if (process.env.API_KEY) {
    return true;
  }

  // Fallback to AI Studio key selection if available
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    return hasKey;
  }

  return false;
};

export const requestApiKey = async (): Promise<void> => {
  // If API key is already in environment, no need to request
  if (process.env.API_KEY) {
    return;
  }

  // Otherwise, use AI Studio key selection
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
    // No delay, assume success as per instructions to handle race condition
  }
};

export const generateVideo = async (config: VeoConfig): Promise<string | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please select a key.");
  }

  // Create new instance per request to ensure fresh key
  const ai = new GoogleGenAI({ apiKey });

  // Prepare input config
  const generationConfig: any = {
    numberOfVideos: 1,
    resolution: config.resolution,
    aspectRatio: config.aspectRatio,
  };

  // Add duration if specified
  if (config.duration) {
    generationConfig.duration = config.duration;
  }

  // Determine model based on resolution/quality needs
  // Fast model is great for viral shorts (usually 720p is enough for phone screens), 
  // but if user wants 1080p, we use the standard model for better quality.
  const modelName = config.resolution === '1080p'
    ? 'veo-3.1-generate-preview'
    : 'veo-3.1-fast-generate-preview';

  let params: any = {
    model: modelName,
    config: generationConfig,
  };

  // Build prompt with frame information if available
  let enhancedPrompt = config.prompt || '';

  if (config.startFrame && config.endFrame) {
    enhancedPrompt = enhancedPrompt
      ? `${enhancedPrompt} Start with the provided start frame and end with the provided end frame.`
      : 'Generate a video starting with the provided start frame and ending with the provided end frame.';
  } else if (config.startFrame) {
    enhancedPrompt = enhancedPrompt
      ? `${enhancedPrompt} Start with the provided start frame.`
      : 'Generate a video starting with the provided start frame.';
  } else if (config.endFrame) {
    enhancedPrompt = enhancedPrompt
      ? `${enhancedPrompt} End with the provided end frame.`
      : 'Generate a video ending with the provided end frame.';
  }

  if (enhancedPrompt) {
    params.prompt = enhancedPrompt;
  }

  // Add image(s) to params
  // Priority: If startFrame exists, use it as the main image
  // If only endFrame exists, use it as the main image
  // The prompt already includes instructions about both frames
  if (config.startFrame) {
    const base64Image = await fileToBase64(config.startFrame.file);
    params.image = {
      imageBytes: base64Image,
      mimeType: config.startFrame.file.type,
    };
  } else if (config.endFrame) {
    const base64Image = await fileToBase64(config.endFrame.file);
    params.image = {
      imageBytes: base64Image,
      mimeType: config.endFrame.file.type,
    };
  }

  // Note: If the Veo API supports multiple images in the future, we can add:
  // if (config.startFrame) params.startFrame = {...}
  // if (config.endFrame) params.endFrame = {...}

  console.log("Starting video generation with params:", params);

  try {
    let operation = await ai.models.generateVideos(params);

    // Polling loop
    while (!operation.done) {
      console.log("Polling for video status...");
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5s poll interval
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) {
      console.error("Video generation operation error:", operation.error);
      // Fix: Ensure message is a string using template literal to handle 'unknown' type
      throw new Error(`${operation.error.message || "Unknown generation error"}`);
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!videoUri) {
      throw new Error("No video URI returned from successful operation.");
    }

    console.log("Video generated, fetching bytes from:", videoUri);

    // Fetch the actual video bytes using the key
    const videoResponse = await fetch(`${videoUri}&key=${apiKey}`);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video bytes: ${videoResponse.statusText}`);
    }

    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);

  } catch (error: any) {
    console.error("Error in generateVideo:", error);
    // If it's a "Requested entity was not found" (often key issue), we should prompt re-selection
    if (error.message && error.message.includes("Requested entity was not found")) {
      // We can't auto-trigger the UI from here easily without context, but we can throw specific error
      throw new Error("API_KEY_INVALID");
    }
    throw error;
  }
};