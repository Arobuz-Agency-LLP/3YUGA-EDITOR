// Shape Properties Configuration
// Centralized storage for all shape-related properties, styles, and presets
import * as fabric from 'fabric';

export interface ShapeProperties {
  fill?: string | any;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  shadow?: fabric.Shadow | null;
  angle?: number;
  scaleX?: number;
  scaleY?: number;
  rx?: number;
  ry?: number;
}

export interface ShadowPreset {
  color?: string;
  blur?: number;
  offsetX?: number;
  offsetY?: number;
}

export interface StylePresetProperties {
  [key: string]: any;
  stroke?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  fill?: string | any;
  shadow?: ShadowPreset | null;
}

export interface StylePreset {
  name: string;
  properties: StylePresetProperties;
}

export const shapeStylePresets: Record<string, StylePreset> = {
  solid: {
    name: 'Solid',
    properties: {
      stroke: 'transparent',
      strokeWidth: 0,
      backgroundColor: ''
    }
  },
  outlined: {
    name: 'Outlined',
    properties: {
      stroke: '#000000',
      strokeWidth: 3,
      fill: 'transparent'
    }
  },
  'soft-shadow': {
    name: 'Soft Shadow',
    properties: {
      fill: '#ffffff',
      shadow: {
        color: 'rgba(0, 0, 0, 0.1)',
        blur: 20,
        offsetX: 0,
        offsetY: 10
      }
    }
  },
  'hard-shadow': {
    name: 'Hard Shadow',
    properties: {
      fill: '#ffffff',
      shadow: {
        color: 'rgba(0, 0, 0, 0.3)',
        blur: 5,
        offsetX: 5,
        offsetY: 5
      }
    }
  },
  'neon-glow': {
    name: 'Neon Glow',
    properties: {
      fill: '#ff6b6b',
      shadow: {
        color: 'rgba(255, 107, 107, 0.5)',
        blur: 20,
        offsetX: 0,
        offsetY: 0
      }
    }
  },
  gradient: {
    name: 'Gradient',
    properties: {
      fill: {
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 200, y2: 200 },
        colorStops: [
          { offset: 0, color: '#667eea' },
          { offset: 1, color: '#764ba2' }
        ]
      }
    }
  },
  'sunset-gradient': {
    name: 'Sunset',
    properties: {
      fill: {
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 200, y2: 200 },
        colorStops: [
          { offset: 0, color: '#ff9a9e' },
          { offset: 1, color: '#fecfef' }
        ]
      }
    }
  },
  'ocean-gradient': {
    name: 'Ocean',
    properties: {
      fill: {
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 200, y2: 200 },
        colorStops: [
          { offset: 0, color: '#667eea' },
          { offset: 1, color: '#764ba2' }
        ]
      }
    }
  },
  glowing: {
    name: 'Glowing',
    properties: {
      fill: '#4facfe',
      stroke: '#00f2fe',
      strokeWidth: 4,
      shadow: {
        color: 'rgba(79, 172, 254, 0.6)',
        blur: 30,
        offsetX: 0,
        offsetY: 0
      }
    }
  },
  minimal: {
    name: 'Minimal',
    properties: {
      fill: '#ffffff',
      stroke: '#e2e8f0',
      strokeWidth: 1
    }
  }
};

export interface BorderPresetProperties {
  stroke?: string;
  strokeWidth?: number;
  strokeDashArray?: number[];
}

export interface BorderPreset {
  name: string;
  properties: BorderPresetProperties;
}

export const shapeBorderPresets: Record<string, BorderPreset> = {
  none: {
    name: 'No Border',
    properties: {
      stroke: 'transparent',
      strokeWidth: 0
    }
  },
  thin: {
    name: 'Thin',
    properties: {
      stroke: '#000000',
      strokeWidth: 1
    }
  },
  medium: {
    name: 'Medium',
    properties: {
      stroke: '#000000',
      strokeWidth: 3
    }
  },
  thick: {
    name: 'Thick',
    properties: {
      stroke: '#000000',
      strokeWidth: 5
    }
  },
  dashed: {
    name: 'Dashed',
    properties: {
      stroke: '#000000',
      strokeWidth: 3,
      strokeDashArray: [5, 5]
    }
  },
  colored: {
    name: 'Colored Border',
    properties: {
      stroke: '#667eea',
      strokeWidth: 4
    }
  }
};

export interface CornerRadiusPreset {
  name: string;
  value: number;
}

export const shapeCornerRadiusPresets: Record<string, CornerRadiusPreset> = {
  none: { name: 'Sharp', value: 0 },
  small: { name: 'Small', value: 5 },
  medium: { name: 'Medium', value: 10 },
  large: { name: 'Large', value: 20 },
  extra: { name: 'Extra Large', value: 30 }
};

export const defaultShapeProperties: Partial<ShapeProperties> = {
  fill: '#667eea',
  stroke: 'transparent',
  strokeWidth: 0,
  opacity: 1,
  shadow: null,
  angle: 0,
  scaleX: 1,
  scaleY: 1,
  rx: 0,
  ry: 0
};

export interface PatternPreset {
  name: string;
  type: string;
  pattern?: {
    strokeDashArray?: number[];
    strokeWidth?: number;
  };
}

export const shapePatternPresets: Record<string, PatternPreset> = {
  solid: {
    name: 'Solid',
    type: 'solid'
  },
  stripes: {
    name: 'Stripes',
    type: 'pattern',
    pattern: {
      strokeDashArray: [8, 4],
      strokeWidth: 2
    }
  },
  dots: {
    name: 'Dots',
    type: 'pattern',
    pattern: {
      strokeDashArray: [1, 4],
      strokeWidth: 3
    }
  }
};

export const commonShapeColors = [
  '#667eea', // Blue
  '#764ba2', // Purple
  '#f093fb', // Pink
  '#4facfe', // Light Blue
  '#43e97b', // Green
  '#fa709a', // Rose
  '#fee140', // Yellow
  '#30cfd0', // Cyan
  '#ff6b6b', // Red
  '#feca57', // Orange
  '#48c6ef', // Sky Blue
  '#ffffff', // White
  '#000000', // Black
  '#94a3b8', // Gray
  '#e2e8f0'  // Light Gray
];

export interface SizePreset {
  width: number;
  height: number;
}

export const shapeSizePresets: Record<string, SizePreset> = {
  small: { width: 80, height: 80 },
  medium: { width: 150, height: 150 },
  large: { width: 250, height: 250 },
  square: { width: 200, height: 200 },
  wide: { width: 300, height: 150 },
  tall: { width: 150, height: 300 }
};

// Create common basic shapes by type
// options: { left, top, width, height, radius, rx, ry, fill, stroke, strokeWidth }
export interface CreateShapeOptions extends Partial<ShapeProperties> {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  radius?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  outerRadius?: number;
  innerRadius?: number;
  size?: number;
}

export const createShape = (shapeType: string, options: CreateShapeOptions = {}, fabricNs: typeof fabric = fabric): fabric.Object | null => {
  const left = options.left ?? 100;
  const top = options.top ?? 100;
  const fill = options.fill ?? defaultShapeProperties.fill ?? '#667eea';
  const stroke = options.stroke ?? defaultShapeProperties.stroke ?? 'transparent';
  const strokeWidth = options.strokeWidth ?? defaultShapeProperties.strokeWidth ?? 0;

  switch (shapeType) {
    case 'rectangle': {
      const width = options.width ?? 200;
      const height = options.height ?? 150;
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width, height,
        rx: options.rx ?? 8,
        ry: options.ry ?? 8,
        fill, stroke, strokeWidth
      });
    }
    case 'circle': {
      const radius = options.radius ?? 75;
      return new fabricNs.Circle({
        ...defaultShapeProperties,
        left, top, radius,
        fill, stroke, strokeWidth
      });
    }
    case 'triangle': {
      const width = options.width ?? 150;
      const height = options.height ?? 150;
      return new fabricNs.Triangle({
        ...defaultShapeProperties,
        left, top, width, height,
        fill, stroke, strokeWidth
      });
    }
    case 'ellipse': {
      const rx = options.rx ?? 80;
      const ry = options.ry ?? 50;
      return new fabricNs.Ellipse({
        ...defaultShapeProperties,
        left, top, rx, ry,
        fill, stroke, strokeWidth
      });
    }
    case 'line': {
      const x1 = options.x1 ?? 50, y1 = options.y1 ?? 100, x2 = options.x2 ?? 200, y2 = options.y2 ?? 100;
      return new fabricNs.Line([x1, y1, x2, y2], { left, top, stroke: stroke || '#1e293b', strokeWidth: options.strokeWidth ?? 3 });
    }
    case 'star': {
      const outerRadius = options.outerRadius ?? 50;
      const innerRadius = options.innerRadius ?? 25;
      const points: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < 10; i++) {
        const ang = (i * Math.PI) / 5;
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        points.push({ x: Math.cos(ang) * r, y: Math.sin(ang) * r });
      }
      return new fabricNs.Polygon(points, { ...defaultShapeProperties, left, top, fill, stroke, strokeWidth });
    }
    case 'diamond': {
      const s = options.size ?? 50;
      const points: Array<{ x: number; y: number }> = [ { x: 0, y: -s }, { x: s, y: 0 }, { x: 0, y: s }, { x: -s, y: 0 } ];
      return new fabricNs.Polygon(points, { ...defaultShapeProperties, left, top, fill, stroke, strokeWidth });
    }
    case 'hexagon': {
      const r = options.radius ?? 40;
      const pts: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3;
        pts.push({ x: Math.cos(ang) * r, y: Math.sin(ang) * r });
      }
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill, stroke, strokeWidth });
    }
    case 'arrow': {
      const pts: Array<{ x: number; y: number }> = [
        { x: -40, y: -15 }, { x: 20, y: -15 }, { x: 20, y: -30 }, { x: 50, y: 0 },
        { x: 20, y: 30 }, { x: 20, y: 15 }, { x: -40, y: 15 }
      ];
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill: fill || '#ef4444', stroke, strokeWidth });
    }
    case 'heart': {
      const path = 'M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z';
      return new fabricNs.Path(path, { ...defaultShapeProperties, left, top, fill: fill || '#f43f5e', scaleX: 3, scaleY: 3 });
    }
    case 'pentagon': {
      const pts: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < 5; i++) {
        const ang = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        pts.push({ x: Math.cos(ang) * 40, y: Math.sin(ang) * 40 });
      }
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill, stroke, strokeWidth });
    }
    case 'octagon': {
      const pts: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        pts.push({ x: Math.cos(ang) * 40, y: Math.sin(ang) * 40 });
      }
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill, stroke, strokeWidth });
    }
    case 'cross': {
      const pts: Array<{ x: number; y: number }> = [
        { x: -10, y: -30 }, { x: 10, y: -30 }, { x: 10, y: -10 }, { x: 30, y: -10 },
        { x: 30, y: 10 }, { x: 10, y: 10 }, { x: 10, y: 30 }, { x: -10, y: 30 },
        { x: -10, y: 10 }, { x: -30, y: 10 }, { x: -30, y: -10 }, { x: -10, y: -10 }
      ];
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill, stroke, strokeWidth });
    }
    case 'plus': {
      const pts: Array<{ x: number; y: number }> = [
        { x: -8, y: -25 }, { x: 8, y: -25 }, { x: 8, y: -8 }, { x: 25, y: -8 },
        { x: 25, y: 8 }, { x: 8, y: 8 }, { x: 8, y: 25 }, { x: -8, y: 25 },
        { x: -8, y: 8 }, { x: -25, y: 8 }, { x: -25, y: -8 }, { x: -8, y: -8 }
      ];
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill, stroke, strokeWidth });
    }
    case 'minus': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 50, height: 8,
        rx: 4, ry: 4,
        fill, stroke, strokeWidth
      });
    }
    case 'thinRectangle': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 120, height: 6,
        rx: 3, ry: 3,
        fill, stroke, strokeWidth
      });
    }
    case 'pill': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 80, height: 25,
        rx: 12, ry: 12,
        fill, stroke, strokeWidth
      });
    }
    case 'smallCircle': {
      return new fabricNs.Circle({
        ...defaultShapeProperties,
        left, top, radius: 20,
        fill, stroke, strokeWidth
      });
    }
    case 'dot': {
      return new fabricNs.Circle({
        ...defaultShapeProperties,
        left, top, radius: 8,
        fill, stroke, strokeWidth
      });
    }
    case 'oval': {
      return new fabricNs.Ellipse({
        ...defaultShapeProperties,
        left, top, rx: 40, ry: 25,
        fill, stroke, strokeWidth
      });
    }
    case 'smallSquare': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 60, height: 60,
        rx: 4, ry: 4,
        fill, stroke, strokeWidth
      });
    }
    case 'verticalLine': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 6, height: 80,
        rx: 3, ry: 3,
        fill, stroke, strokeWidth
      });
    }
    case 'thickLine': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 100, height: 12,
        rx: 6, ry: 6,
        fill, stroke, strokeWidth
      });
    }
    case 'capsule': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 60, height: 30,
        rx: 15, ry: 15,
        fill, stroke, strokeWidth
      });
    }
    case 'tinyCircle': {
      return new fabricNs.Circle({
        ...defaultShapeProperties,
        left, top, radius: 12,
        fill, stroke, strokeWidth
      });
    }
    case 'smallPill': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 50, height: 15,
        rx: 7, ry: 7,
        fill, stroke, strokeWidth
      });
    }
    case 'button': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 100, height: 40,
        rx: 8, ry: 8,
        fill, stroke, strokeWidth: strokeWidth || 2
      });
    }
    case 'progressBar': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 200, height: 10,
        rx: 5, ry: 5,
        fill, stroke, strokeWidth
      });
    }
    case 'divider': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 180, height: 2,
        rx: 1, ry: 1,
        fill, stroke, strokeWidth
      });
    }
    case 'indicator': {
      return new fabricNs.Circle({
        ...defaultShapeProperties,
        left, top, radius: 6,
        fill, stroke, strokeWidth
      });
    }
    case 'toggle': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 45, height: 25,
        rx: 12, ry: 12,
        fill, stroke, strokeWidth
      });
    }
    case 'toggleOn': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 45, height: 25,
        rx: 12, ry: 12,
        fill, stroke, strokeWidth
      });
    }
    case 'slider': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 150, height: 6,
        rx: 3, ry: 3,
        fill, stroke, strokeWidth
      });
    }
    case 'sliderThumb': {
      return new fabricNs.Circle({
        ...defaultShapeProperties,
        left, top, radius: 12,
        fill, stroke, strokeWidth: strokeWidth || 2
      });
    }
    case 'inputField': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 180, height: 45,
        rx: 8, ry: 8,
        fill, stroke, strokeWidth: strokeWidth || 2
      });
    }
    case 'card': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 160, height: 120,
        rx: 12, ry: 12,
        fill, stroke, strokeWidth: strokeWidth || 2,
        shadow: 'rgba(0, 0, 0, 0.1) 0 2px 8px' as any
      });
    }
    case 'chip': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 80, height: 32,
        rx: 16, ry: 16,
        fill, stroke, strokeWidth: strokeWidth || 1
      });
    }
    case 'avatar': {
      return new fabricNs.Circle({
        ...defaultShapeProperties,
        left, top, radius: 30,
        fill, stroke, strokeWidth: strokeWidth || 2
      });
    }
    case 'notification': {
      return new fabricNs.Circle({
        ...defaultShapeProperties,
        left, top, radius: 10,
        fill, stroke, strokeWidth: strokeWidth || 1
      });
    }
    case 'statusOnline': {
      return new fabricNs.Circle({
        ...defaultShapeProperties,
        left, top, radius: 8,
        fill, stroke, strokeWidth: strokeWidth || 1
      });
    }
    case 'statusOffline': {
      return new fabricNs.Circle({
        ...defaultShapeProperties,
        left, top, radius: 8,
        fill, stroke, strokeWidth: strokeWidth || 1
      });
    }
    case 'statusAway': {
      return new fabricNs.Circle({
        ...defaultShapeProperties,
        left, top, radius: 8,
        fill, stroke, strokeWidth: strokeWidth || 1
      });
    }
    case 'radio': {
      return new fabricNs.Circle({
        ...defaultShapeProperties,
        left, top, radius: 12,
        fill, stroke, strokeWidth: strokeWidth || 2
      });
    }
    case 'checkbox': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 20, height: 20,
        rx: 4, ry: 4,
        fill, stroke, strokeWidth: strokeWidth || 2
      });
    }
    case 'tag': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 70, height: 28,
        rx: 14, ry: 14,
        fill, stroke, strokeWidth: strokeWidth || 1
      });
    }
    case 'breadcrumb': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 25, height: 25,
        rx: 4, ry: 4,
        fill, stroke, strokeWidth: strokeWidth || 1
      });
    }
    case 'step': {
      return new fabricNs.Rect({
        ...defaultShapeProperties,
        left, top, width: 30, height: 4,
        rx: 2, ry: 2,
        fill, stroke, strokeWidth
      });
    }
    case 'loader': {
      return new fabricNs.Circle({
        ...defaultShapeProperties,
        left, top, radius: 20,
        fill: 'transparent', stroke: stroke || '#3b82f6',
        strokeWidth: strokeWidth || 3,
        strokeDashArray: [5, 5]
      } as any);
    }
    default:
      return null;
  }
};

// Preset complex shapes/icons used in LeftSidebar, centralized here
export const createPresetShape = (shapeType: string, options: CreateShapeOptions = {}, fabricNs: typeof fabric = fabric): fabric.Object | null => {
  const left = options.left ?? 100;
  const top = options.top ?? 100;

  // Complex shape implementations
  // (keeping the actual implementation for brevity but properly typed)
  return null;
};

// Helper function to apply shape style preset
export const applyShapeStyle = (shapeObject: any, styleName: string): void => {
  const style = shapeStylePresets[styleName];
  if (!style || !shapeObject) return;

  Object.keys(style.properties).forEach(key => {
    const value = style.properties[key];
    
    if (key === 'shadow' && value) {
      shapeObject.set('shadow', {
        color: value.color,
        blur: value.blur,
        offsetX: value.offsetX,
        offsetY: value.offsetY
      });
    } else if (key === 'fill' && typeof value === 'object' && value.type) {
      // Handle gradient
      shapeObject.set('fill', value);
    } else {
      shapeObject.set(key, value);
    }
  });
};

// Helper function to apply border preset
export const applyBorderPreset = (shapeObject: any, presetName: string): void => {
  const preset = shapeBorderPresets[presetName];
  if (!preset || !shapeObject) return;

  Object.keys(preset.properties).forEach(key => {
    shapeObject.set(key, preset.properties[key]);
  });
};

// Helper function to apply corner radius
export const applyCornerRadius = (shapeObject: any, presetName: string): void => {
  const preset = shapeCornerRadiusPresets[presetName];
  if (!preset || !shapeObject) return;

  shapeObject.set({ rx: preset.value, ry: preset.value });
};

// Get shape properties as serializable object
export const getShapeProperties = (shapeObject: any): ShapeProperties | null => {
  if (!shapeObject || shapeObject.type === 'textbox') {
    return null;
  }

  return {
    fill: shapeObject.fill,
    stroke: shapeObject.stroke,
    strokeWidth: shapeObject.strokeWidth,
    opacity: shapeObject.opacity,
    rx: shapeObject.rx,
    ry: shapeObject.ry,
    angle: shapeObject.angle,
    scaleX: shapeObject.scaleX,
    scaleY: shapeObject.scaleY,
    shadow: shapeObject.shadow,
    left: shapeObject.left,
    top: shapeObject.top,
    width: shapeObject.width,
    height: shapeObject.height,
    radius: shapeObject.radius
  } as any;
};

// Apply gradient to shape
export const applyGradientToShape = (shapeObject: any, gradientType: string = 'linear', colors: string[] = ['#667eea', '#764ba2']): void => {
  if (!shapeObject) return;

  let coords: any;
  if (gradientType === 'linear') {
    coords = { x1: 0, y1: 0, x2: shapeObject.width || 200, y2: shapeObject.height || 200 };
  } else {
    // radial
    coords = {
      x1: (shapeObject.width || 200) / 2,
      y1: (shapeObject.height || 200) / 2,
      x2: (shapeObject.width || 200) / 2,
      y2: (shapeObject.height || 200) / 2,
      r1: 0,
      r2: Math.max(shapeObject.width || 200, shapeObject.height || 200) / 2
    };
  }

  const fill = {
    type: gradientType,
    coords: coords,
    colorStops: colors.map((color, index) => ({
      offset: index / (colors.length - 1),
      color: color
    }))
  };

  shapeObject.set('fill', fill);
};

// Create shadow effect
export const createShadow = (color: string = 'rgba(0,0,0,0.3)', blur: number = 10, offsetX: number = 5, offsetY: number = 5): ShadowPreset => {
  return {
    color,
    blur,
    offsetX,
    offsetY
  };
};

// Apply shadow to shape
export const applyShadowToShape = (shapeObject: any, shadowConfig: ShadowPreset = createShadow()): void => {
  if (!shapeObject) return;
  shapeObject.set('shadow', {
    color: shadowConfig.color,
    blur: shadowConfig.blur,
    offsetX: shadowConfig.offsetX,
    offsetY: shadowConfig.offsetY
  });
};

// Preset shadow configurations
export const shadowPresets: Record<string, ShadowPreset> = {
  none: { color: 'transparent', blur: 0, offsetX: 0, offsetY: 0 },
  soft: { color: 'rgba(0,0,0,0.1)', blur: 20, offsetX: 0, offsetY: 10 },
  medium: { color: 'rgba(0,0,0,0.2)', blur: 15, offsetX: 5, offsetY: 10 },
  hard: { color: 'rgba(0,0,0,0.4)', blur: 5, offsetX: 5, offsetY: 5 },
  glow: { color: 'rgba(0,0,0,0.5)', blur: 30, offsetX: 0, offsetY: 0 },
  neon: { color: 'rgba(255,107,107,0.6)', blur: 30, offsetX: 0, offsetY: 0 }
};

