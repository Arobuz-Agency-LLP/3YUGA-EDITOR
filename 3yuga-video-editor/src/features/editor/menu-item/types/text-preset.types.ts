/**
 * Text Preset System - Type Definitions
 * Canva-like text presets with multiple styles and categories
 */

export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  fontUrl?: string;
  fontWeight?: "normal" | "bold" | "light" | "medium" | "semibold" | "extrabold" | "black";
  color: string;
  textAlign?: "left" | "center" | "right";
  lineHeight?: number;
  letterSpacing?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  fontStyle?: "normal" | "italic";
}

export interface TextEffect {
  type: "shadow" | "outline" | "glow" | "gradient" | "3d" | "neon" | "none";
  color?: string;
  secondaryColor?: string;
  intensity?: number;
  angle?: number;
  distance?: number;
  blur?: number;
  borderWidth?: number;
  borderColor?: string;
}

export interface TextAnimation {
  type: "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "typewriter" | "bounce" | "zoom" | "rotate" | "none";
  duration?: number; // in milliseconds
  delay?: number; // in milliseconds
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
}

export interface TextPreset {
  id: string;
  name: string;
  category: "heading" | "subheading" | "body" | "modern" | "elegant" | "bold" | "creative" | "minimal" | "premium" | "social";
  previewText: string;
  style: TextStyle;
  effect?: TextEffect;
  animation?: TextAnimation;
  width?: number;
  wordWrap?: "normal" | "break-word" | "break-all";
  isPremium?: boolean;
  tags?: string[];
}

export interface TextCategory {
  id: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface FontOption {
  id: string;
  name: string;
  family: string;
  url?: string;
  postScriptName: string;
  category: "serif" | "sans-serif" | "display" | "handwriting" | "monospace";
  weight?: number;
  isPremium?: boolean;
  previewText?: string;
}

export interface TextEffectPreset {
  id: string;
  name: string;
  effect: TextEffect;
  thumbnail?: string;
  isPremium?: boolean;
}
