/**
 * Video Template System - Type Definitions
 * Supports both full video templates and add-on templates (intros/outros)
 */

export interface VideoLayer {
  id: string;
  assetUrl: string;
  type: "video" | "image";
  start: number; // in seconds
  end: number; // in seconds
  position?: {
    x: number; // percentage or pixels
    y: number;
  };
  scale?: number; // 1 = 100%
  opacity?: number; // 0-1
  blendMode?: "normal" | "multiply" | "screen" | "overlay";
}

export interface TextLayer {
  id: string;
  text: string;
  animation: "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "typewriter" | "bounce" | "zoom" | "scale" | "rotate" | "glitch" | "none";
  position: {
    x: number; // percentage (0-100)
    y: number; // percentage (0-100)
  };
  start: number; // in seconds
  end: number; // in seconds
  style?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    fontWeight?: "normal" | "bold" | "light" | "black" | "extrabold";
    textAlign?: "left" | "center" | "right";
    backgroundColor?: string;
    padding?: number;
    borderRadius?: number;
    // Advanced text effects
    textStroke?: {
      width: number;
      color: string;
    };
    textShadow?: {
      offsetX: number;
      offsetY: number;
      blur: number;
      color: string;
    };
    gradient?: {
      type: "linear" | "radial";
      colors: string[];
      angle?: number; // for linear gradients
    };
    letterSpacing?: number;
    lineHeight?: number;
    textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
    opacity?: number;
    rotation?: number;
  };
}

export interface Transition {
  type: "fade" | "dissolve" | "wipe" | "slide" | "zoom" | "none";
  duration: number; // in seconds
  position: number; // where in timeline (seconds)
}

export interface MusicTrack {
  url: string;
  name: string;
  start: number; // in seconds
  end: number; // in seconds
  volume?: number; // 0-1
  fadeIn?: number; // fade in duration in seconds
  fadeOut?: number; // fade out duration in seconds
}

export interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  category: "business" | "social" | "event" | "education" | "marketing" | "intro" | "outro" | "abstract";
  duration: number; // total duration in seconds
  thumbnail: string; // preview image URL
  isAddOn: boolean; // true if it's an intro/outro overlay template
  aspectRatio?: "16:9" | "9:16" | "1:1" | "4:5";
  resolution?: "HD" | "Full HD" | "4K" | "UHD 4K";
  
  // Layers
  videoLayers: VideoLayer[];
  textLayers: TextLayer[];
  
  // Optional features
  musicTrack?: MusicTrack;
  transitions?: Transition[];
  
  // Metadata
  tags?: string[];
  usage: "free" | "premium";
  createdAt?: string;
  updatedAt?: string;
}

// Category configuration
export interface TemplateCategory {
  id: string;
  label: string;
  icon?: string;
  description?: string;
}

// Filter options
export interface TemplateFilters {
  category?: string;
  isAddOn?: boolean;
  aspectRatio?: string;
  usage?: "free" | "premium";
  tags?: string[];
}
