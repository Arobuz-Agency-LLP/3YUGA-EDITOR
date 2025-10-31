/**
 * Shape & Sticker Helper for DesignCombo
 * 
 * Since DesignCombo doesn't support "shape" or "sticker" track item types,
 * we convert them to SVG images and add as "image" type (which IS supported).
 * 
 * This is a pragmatic solution that works with the existing DesignCombo API.
 */

import { dispatch } from "@designcombo/events";
import { ADD_ITEMS } from "@designcombo/state";
import { generateId } from "@designcombo/timeline";

export interface ShapeConfig {
  id: string;
  name: string;
  color: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}

export interface StickerConfig {
  id: string;
  name: string;
  preview: string; // emoji
  left?: number;
  top?: number;
  size?: number;
}

/**
 * Generate SVG string for a given shape
 */
const generateShapeSVG = (shapeId: string, color: string): string => {
  const svgShapes: Record<string, string> = {
    circle: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="90" fill="${color}"/></svg>`,
    
    square: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="180" height="180" x="10" y="10" rx="8" fill="${color}"/></svg>`,
    
    triangle: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><polygon points="100,20 20,180 180,180" fill="${color}"/></svg>`,
    
    heart: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><path d="M100,180 C20,120 10,80 30,60 C50,40 70,40 100,70 C130,40 150,40 170,60 C190,80 180,120 100,180 Z" fill="${color}"/></svg>`,
    
    hexagon: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="${color}"/></svg>`,
    
    "arrow-right": `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><path d="M40,100 L140,100 L140,60 L180,100 L140,140 L140,100 Z" fill="${color}"/></svg>`,
    
    "arrow-left": `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><path d="M160,100 L60,100 L60,60 L20,100 L60,140 L60,100 Z" fill="${color}"/></svg>`,
    
    "arrow-up": `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><path d="M100,40 L100,140 L60,140 L100,20 L140,140 L100,140 Z" fill="${color}"/></svg>`,
    
    "arrow-down": `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><path d="M100,160 L100,60 L60,60 L100,180 L140,60 L100,60 Z" fill="${color}"/></svg>`
  };
  
  return svgShapes[shapeId] || svgShapes.circle;
};

/**
 * Generate SVG string for an emoji sticker
 */
const generateStickerSVG = (emoji: string): string => {
  return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <text x="50%" y="50%" font-size="120" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif">${emoji}</text>
  </svg>`;
};

/**
 * Safely encode SVG to base64 (handles Unicode characters like emojis)
 */
const encodeSVG = (svgString: string): string => {
  // Use encodeURIComponent for Unicode support
  return `data:image/svg+xml,${encodeURIComponent(svgString)}`;
};

/**
 * Add a shape to the timeline as an image track item
 * 
 * @param canvas - Not used (kept for API compatibility)
 * @param shapeId - Shape identifier (circle, square, triangle, etc.)
 * @param config - Shape configuration
 */
export const addShapeToCanvas = (canvas: any, shapeId: string, config: ShapeConfig) => {
  const id = generateId();
  
  // Generate SVG and convert to data URL (URL-encoded, not base64)
  const svgString = generateShapeSVG(shapeId, config.color);
  const svgDataUrl = encodeSVG(svgString);
  
  // Add as image track item (supported by DesignCombo)
  dispatch(ADD_ITEMS, {
    payload: {
      trackItems: [{
        id,
        type: "image",
        display: { from: 0, to: 5000 },
        details: {
          src: svgDataUrl,
          width: config.width || 200,
          height: config.height || 200
        },
        metadata: {
          elementType: "shape",
          shapeName: config.name,
          shapeId: config.id,
          shapeColor: config.color
        }
      }]
    }
  });
  
  console.log(`✅ Shape "${config.name}" added to timeline as SVG image`);
};

/**
 * Add a sticker to the timeline as an image track item
 * 
 * @param canvas - Not used (kept for API compatibility)
 * @param config - Sticker configuration
 */
export const addStickerToCanvas = (canvas: any, config: StickerConfig) => {
  const id = generateId();
  
  // Generate emoji SVG and convert to data URL (URL-encoded for emoji support)
  const emojiSvg = generateStickerSVG(config.preview);
  const emojiDataUrl = encodeSVG(emojiSvg);
  
  // Add as image track item (supported by DesignCombo)
  dispatch(ADD_ITEMS, {
    payload: {
      trackItems: [{
        id,
        type: "image",
        display: { from: 0, to: 5000 },
        details: {
          src: emojiDataUrl,
          width: config.size || 150,
          height: config.size || 150
        },
        metadata: {
          elementType: "sticker",
          stickerName: config.name,
          stickerId: config.id,
          emoji: config.preview
        }
      }]
    }
  });
  
  console.log(`✅ Sticker "${config.name}" (${config.preview}) added to timeline as SVG image`);
};
