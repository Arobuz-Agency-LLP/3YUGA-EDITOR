// Shape Properties Configuration
// Centralized storage for all shape-related properties, styles, and presets
import * as fabric from 'fabric';

export const shapeStylePresets = {
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

export const shapeBorderPresets = {
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

export const shapeCornerRadiusPresets = {
  none: { name: 'Sharp', value: 0 },
  small: { name: 'Small', value: 5 },
  medium: { name: 'Medium', value: 10 },
  large: { name: 'Large', value: 20 },
  extra: { name: 'Extra Large', value: 30 }
};

export const defaultShapeProperties = {
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

export const shapePatternPresets = {
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

export const shapeSizePresets = {
  small: { width: 80, height: 80 },
  medium: { width: 150, height: 150 },
  large: { width: 250, height: 250 },
  square: { width: 200, height: 200 },
  wide: { width: 300, height: 150 },
  tall: { width: 150, height: 300 }
};

// Create common basic shapes by type
// options: { left, top, width, height, radius, rx, ry, fill, stroke, strokeWidth }
export const createShape = (shapeType, options = {}, fabricNs = fabric) => {
  const left = options.left ?? 100;
  const top = options.top ?? 100;
  const fill = options.fill ?? defaultShapeProperties.fill;
  const stroke = options.stroke ?? defaultShapeProperties.stroke;
  const strokeWidth = options.strokeWidth ?? defaultShapeProperties.strokeWidth;

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
      const points = [];
      for (let i = 0; i < 10; i++) {
        const ang = (i * Math.PI) / 5;
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        points.push({ x: Math.cos(ang) * r, y: Math.sin(ang) * r });
      }
      return new fabricNs.Polygon(points, { ...defaultShapeProperties, left, top, fill, stroke, strokeWidth });
    }
    case 'diamond': {
      const s = options.size ?? 50;
      const points = [ { x: 0, y: -s }, { x: s, y: 0 }, { x: 0, y: s }, { x: -s, y: 0 } ];
      return new fabricNs.Polygon(points, { ...defaultShapeProperties, left, top, fill, stroke, strokeWidth });
    }
    case 'hexagon': {
      const r = options.radius ?? 40;
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3;
        pts.push({ x: Math.cos(ang) * r, y: Math.sin(ang) * r });
      }
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill, stroke, strokeWidth });
    }
    case 'arrow': {
      const pts = [
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
      const pts = [];
      for (let i = 0; i < 5; i++) {
        const ang = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        pts.push({ x: Math.cos(ang) * 40, y: Math.sin(ang) * 40 });
      }
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill, stroke, strokeWidth });
    }
    case 'octagon': {
      const pts = [];
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        pts.push({ x: Math.cos(ang) * 40, y: Math.sin(ang) * 40 });
      }
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill, stroke, strokeWidth });
    }
    case 'cross': {
      const pts = [
        { x: -10, y: -30 }, { x: 10, y: -30 }, { x: 10, y: -10 }, { x: 30, y: -10 },
        { x: 30, y: 10 }, { x: 10, y: 10 }, { x: 10, y: 30 }, { x: -10, y: 30 },
        { x: -10, y: 10 }, { x: -30, y: 10 }, { x: -30, y: -10 }, { x: -10, y: -10 }
      ];
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill, stroke, strokeWidth });
    }
    case 'plus': {
      const pts = [
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
        shadow: 'rgba(0, 0, 0, 0.1) 0 2px 8px'
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
      });
    }
    default:
      return null;
  }
};

// Preset complex shapes/icons used in LeftSidebar, centralized here
export const createPresetShape = (shapeType, options = {}, fabricNs = fabric) => {
  const left = options.left ?? 100;
  const top = options.top ?? 100;

  switch (shapeType) {
    // Arrows & directions
    case 'arrowUp': {
      const pts = [ { x: 0, y: 30 }, { x: -20, y: 10 }, { x: -10, y: 10 }, { x: -10, y: -30 }, { x: 10, y: -30 }, { x: 10, y: 10 }, { x: 20, y: 10 } ];
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill: '#22c55e' });
    }
    case 'arrowDown': {
      const pts = [ { x: 0, y: -30 }, { x: -20, y: -10 }, { x: -10, y: -10 }, { x: -10, y: 30 }, { x: 10, y: 30 }, { x: 10, y: -10 }, { x: 20, y: -10 } ];
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill: '#22c55e' });
    }
    case 'arrowLeft': {
      const pts = [ { x: 30, y: 0 }, { x: 10, y: -20 }, { x: 10, y: -10 }, { x: -30, y: -10 }, { x: -30, y: 10 }, { x: 10, y: 10 }, { x: 10, y: 20 } ];
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill: '#22c55e' });
    }
    case 'arrowRight': {
      const pts = [ { x: -30, y: 0 }, { x: -10, y: -20 }, { x: -10, y: -10 }, { x: 30, y: -10 }, { x: 30, y: 10 }, { x: -10, y: 10 }, { x: -10, y: 20 } ];
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill: '#22c55e' });
    }
    case 'doubleArrow': {
      const leftA = new fabricNs.Polygon([ { x: -30, y: 0 }, { x: -10, y: -15 }, { x: -10, y: -5 }, { x: 10, y: -5 }, { x: 10, y: 5 }, { x: -10, y: 5 }, { x: -10, y: 15 } ], { fill: '#3b82f6' });
      const rightA = new fabricNs.Polygon([ { x: 30, y: 0 }, { x: 10, y: -15 }, { x: 10, y: -5 }, { x: -10, y: -5 }, { x: -10, y: 5 }, { x: 10, y: 5 }, { x: 10, y: 15 } ], { fill: '#3b82f6' });
      return new fabricNs.Group([leftA, rightA], { left, top });
    }
    case 'curvedArrow': {
      const path = 'M20,50 Q50,20 80,50 Q50,80 20,50 M70,40 L80,50 L70,60';
      return new fabricNs.Path(path, { ...defaultShapeProperties, left, top, fill: 'transparent', stroke: '#8b5cf6', strokeWidth: 4, scaleX: 0.8, scaleY: 0.8 });
    }
    case 'bentArrow': {
      const path = 'M20,50 L60,50 L60,30 L80,50 L60,70 L60,50';
      return new fabricNs.Path(path, { ...defaultShapeProperties, left, top, fill: 'transparent', stroke: '#f59e0b', strokeWidth: 4, scaleX: 0.8, scaleY: 0.8 });
    }
    case 'circularArrow': {
      const path = 'M50,10 A40,40 0 1,1 50,90 M70,70 L80,80 L70,90';
      return new fabricNs.Path(path, { ...defaultShapeProperties, left, top, fill: 'transparent', stroke: '#ec4899', strokeWidth: 4, scaleX: 0.8, scaleY: 0.8 });
    }
    case 'returnArrow': {
      const path = 'M20,50 L60,50 L60,30 L80,50 L60,70 L60,50 M20,50 L20,30 L40,30 L40,50';
      return new fabricNs.Path(path, { ...defaultShapeProperties, left, top, fill: 'transparent', stroke: '#10b981', strokeWidth: 4, scaleX: 0.8, scaleY: 0.8 });
    }
    // Symbol icons
    case 'checkIcon':
      return new fabricNs.Path('M20,50 L35,65 L70,30', { ...defaultShapeProperties, left, top, fill: 'transparent', stroke: '#22c55e', strokeWidth: 4, scaleX: 0.8, scaleY: 0.8 });
    case 'closeIcon': {
      const a = new fabricNs.Line([30, 30, 60, 60], { stroke: '#ef4444', strokeWidth: 4 });
      const b = new fabricNs.Line([60, 30, 30, 60], { stroke: '#ef4444', strokeWidth: 4 });
      return new fabricNs.Group([a, b], { left, top, scaleX: 0.8, scaleY: 0.8 });
    }
    case 'plusIcon': {
      const v = new fabricNs.Line([40, 30, 40, 60], { stroke: '#22c55e', strokeWidth: 4 });
      const h = new fabricNs.Line([30, 50, 60, 50], { stroke: '#22c55e', strokeWidth: 4 });
      return new fabricNs.Group([v, h], { left, top, scaleX: 0.8, scaleY: 0.8 });
    }
    case 'minusIcon':
      return new fabricNs.Line([30, 50, 60, 50], { left, top, stroke: '#ef4444', strokeWidth: 4, scaleX: 0.8, scaleY: 0.8 });
    case 'questionIcon': {
      const c = new fabricNs.Circle({ radius: 20, fill: 'transparent', stroke: '#6b7280', strokeWidth: 3 });
      const dot = new fabricNs.Circle({ radius: 3, fill: '#6b7280', left: 47, top: 35 });
      const p = new fabricNs.Path('M40,50 Q40,45 45,45 Q50,45 50,50 Q50,55 45,55', { fill: 'transparent', stroke: '#6b7280', strokeWidth: 2 });
      return new fabricNs.Group([c, dot, p], { left, top, scaleX: 0.8, scaleY: 0.8 });
    }
    case 'exclamationIcon': {
      const l = new fabricNs.Line([50, 20, 50, 50], { stroke: '#f59e0b', strokeWidth: 4 });
      const d = new fabricNs.Circle({ radius: 3, fill: '#f59e0b', left: 47, top: 55 });
      return new fabricNs.Group([l, d], { left, top, scaleX: 0.8, scaleY: 0.8 });
    }
    case 'infoIcon': {
      const c = new fabricNs.Circle({ radius: 20, fill: 'transparent', stroke: '#3b82f6', strokeWidth: 3 });
      const dot = new fabricNs.Circle({ radius: 3, fill: '#3b82f6', left: 47, top: 35 });
      const l = new fabricNs.Line([50, 45, 50, 55], { stroke: '#3b82f6', strokeWidth: 2 });
      return new fabricNs.Group([c, dot, l], { left, top, scaleX: 0.8, scaleY: 0.8 });
    }
    case 'warningIcon': {
      const tri = new fabricNs.Polygon([
        { x: 50, y: 10 }, { x: 80, y: 70 }, { x: 20, y: 70 }
      ], { fill: '#f59e0b' });
      const excl = new fabricNs.Line([50, 30, 50, 55], { stroke: '#ffffff', strokeWidth: 4 });
      const dot = new fabricNs.Circle({ radius: 3, fill: '#ffffff', left: 47, top: 58 });
      return new fabricNs.Group([tri, excl, dot], { left, top, scaleX: 0.8, scaleY: 0.8 });
    }
    case 'errorIcon': {
      const circle = new fabricNs.Circle({ radius: 25, fill: '#ef4444' });
      const a = new fabricNs.Line([35, 35, 65, 65], { stroke: 'white', strokeWidth: 4 });
      const b = new fabricNs.Line([65, 35, 35, 65], { stroke: 'white', strokeWidth: 4 });
      return new fabricNs.Group([circle, a, b], { left, top, scaleX: 0.8, scaleY: 0.8 });
    }
    case 'successIcon': {
      const circle = new fabricNs.Circle({ radius: 25, fill: '#22c55e' });
      const tick = new fabricNs.Path('M35,50 L45,60 L65,40', { fill: 'transparent', stroke: 'white', strokeWidth: 4 });
      return new fabricNs.Group([circle, tick], { left, top, scaleX: 0.8, scaleY: 0.8 });
    }
    case 'loadingIcon': {
      return new fabricNs.Circle({ left, top, radius: 20, fill: 'transparent', stroke: '#3b82f6', strokeWidth: 3, strokeDashArray: [5, 5] });
    }
    // Nature / Weather
    case 'cloud':
      return new fabricNs.Path('M25,60 C10,60 5,45 15,35 C5,25 15,15 25,20 C30,10 45,15 45,25 C55,20 65,30 55,40 C65,45 60,60 45,60 Z', { ...defaultShapeProperties, left, top, fill: '#0ea5e9', scaleX: 1.5, scaleY: 1.5 });
    case 'lightning': {
      const pts = [ { x: -15, y: -30 }, { x: 5, y: -30 }, { x: -5, y: -5 }, { x: 15, y: -5 }, { x: -10, y: 30 }, { x: -5, y: 5 }, { x: -20, y: 5 } ];
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill: '#fbbf24' });
    }
    case 'moon':
      return new fabricNs.Path('M50,10 A40,40 0 1,0 50,90 A30,30 0 1,1 50,10 Z', { ...defaultShapeProperties, left, top, fill: '#fde047', scaleX: 0.8, scaleY: 0.8 });
    case 'sun': {
      const pts = [];
      for (let i = 0; i < 16; i++) { const a = (i * Math.PI) / 8; const r = i % 2 === 0 ? 35 : 20; pts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r }); }
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill: '#f59e0b' });
    }
    case 'flower': {
      const pts = []; for (let i = 0; i < 8; i++) { const a=(i*Math.PI)/4; const r=40; pts.push({x:Math.cos(a)*r,y:Math.sin(a)*r}); const m=a+Math.PI/8; pts.push({x:Math.cos(m)*15,y:Math.sin(m)*15}); }
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill: '#ec4899' });
    }
    case 'leaf':
      return new fabricNs.Path('M50,100 Q25,75 25,50 Q25,25 50,0 Q75,25 75,50 Q75,75 50,100 Z', { ...defaultShapeProperties, left, top, fill: '#22c55e', scaleX: 0.8, scaleY: 0.8 });
    case 'butterfly':
      return new fabricNs.Path('M50,50 Q30,30 20,40 Q10,50 20,60 Q30,70 50,50 Q70,30 80,40 Q90,50 80,60 Q70,70 50,50 M50,30 Q45,20 50,10 Q55,20 50,30 M50,70 Q45,80 50,90 Q55,80 50,70', { ...defaultShapeProperties, left, top, fill: '#a855f7', scaleX: 0.8, scaleY: 0.8 });
    case 'wave':
      return new fabricNs.Path('M0,50 Q25,25 50,50 T100,50 L100,75 Q75,100 50,75 T0,75 Z', { ...defaultShapeProperties, left, top, fill: '#06b6d4', scaleX: 1.2, scaleY: 0.8 });
    // Decorative
    case 'speech':
      return new fabricNs.Polygon([ { x: -40, y: -25 }, { x: 40, y: -25 }, { x: 40, y: 10 }, { x: 5, y: 10 }, { x: -10, y: 25 }, { x: -5, y: 10 }, { x: -40, y: 10 } ], { ...defaultShapeProperties, left, top, fill: '#6366f1' });
    case 'badge': {
      const pts=[]; for (let i=0;i<12;i++){ const a=(i*Math.PI)/6; const r=i%2===0?45:35; pts.push({x:Math.cos(a)*r,y:Math.sin(a)*r}); }
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill: '#dc2626' });
    }
    case 'ribbon':
      return new fabricNs.Polygon([ { x: -50, y: -20 }, { x: 50, y: -20 }, { x: 50, y: 20 }, { x: 30, y: 20 }, { x: 40, y: 35 }, { x: 20, y: 25 }, { x: 0, y: 35 }, { x: -20, y: 25 }, { x: -40, y: 35 }, { x: -30, y: 20 }, { x: -50, y: 20 } ], { ...defaultShapeProperties, left, top, fill: '#7c3aed' });
    case 'banner':
      return new fabricNs.Polygon([ { x: -60, y: -25 }, { x: 40, y: -25 }, { x: 60, y: 0 }, { x: 40, y: 25 }, { x: -60, y: 25 } ], { ...defaultShapeProperties, left, top, fill: '#059669' });
    case 'frame':
      return new fabricNs.Rect({ ...defaultShapeProperties, left, top, width: 120, height: 120, fill: 'transparent', stroke: '#374151', strokeWidth: 8, rx: 15, ry: 15 });
    case 'burst': {
      const pts=[]; for (let i=0;i<24;i++){ const a=(i*Math.PI)/12; const r=i%2===0?50:25; pts.push({x:Math.cos(a)*r,y:Math.sin(a)*r});}
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill: '#f59e0b' });
    }
    case 'shield':
      return new fabricNs.Polygon([ { x: 0, y: -50 }, { x: 30, y: -40 }, { x: 40, y: -10 }, { x: 40, y: 20 }, { x: 30, y: 40 }, { x: 0, y: 50 }, { x: -30, y: 40 }, { x: -40, y: 20 }, { x: -40, y: -10 }, { x: -30, y: -40 } ], { ...defaultShapeProperties, left, top, fill: '#1d4ed8' });
    case 'crown':
      return new fabricNs.Polygon([ { x: -40, y: 20 }, { x: -30, y: -10 }, { x: -15, y: 10 }, { x: 0, y: -20 }, { x: 15, y: 10 }, { x: 30, y: -10 }, { x: 40, y: 20 }, { x: 35, y: 30 }, { x: -35, y: 30 } ], { ...defaultShapeProperties, left, top, fill: '#fbbf24' });
    case 'gear': {
      const pts=[]; for (let i=0;i<16;i++){ const a=(i*Math.PI)/8; const r=i%2===0?45:30; pts.push({x:Math.cos(a)*r,y:Math.sin(a)*r}); }
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill: '#6b7280' });
    }
    case 'infinity':
      return new fabricNs.Path('M25,50 Q0,25 25,25 Q50,25 50,50 Q50,75 25,75 Q0,75 25,50 Q50,25 75,25 Q100,25 75,50 Q50,75 75,75 Q100,75 75,50', { ...defaultShapeProperties, left, top, fill: '#8b5cf6', scaleX: 0.8, scaleY: 0.6 });
    case 'spiral':
      return new fabricNs.Path('M50,50 Q50,20 80,20 Q110,20 110,50 Q110,80 80,80 Q50,80 50,50 Q50,35 65,35 Q80,35 80,50 Q80,65 65,65 Q50,65 50,50', { ...defaultShapeProperties, left, top, fill: '#f59e0b', scaleX: 0.8, scaleY: 0.8 });
    case 'sparkle': {
      const pts=[]; for(let i=0;i<12;i++){ const a=(i*Math.PI)/6; const r=i%2===0?40:15; pts.push({x:Math.cos(a)*r,y:Math.sin(a)*r}); }
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill: '#fbbf24' });
    }
    case 'crescent':
      return new fabricNs.Path('M50,10 A40,40 0 1,0 50,90 A30,30 0 1,1 50,10 Z', { ...defaultShapeProperties, left, top, fill: '#fde047', scaleX: 0.8, scaleY: 0.8 });
    case 'teardrop':
      return new fabricNs.Path('M50,10 Q30,30 30,60 Q30,80 50,80 Q70,80 70,60 Q70,30 50,10 Z', { ...defaultShapeProperties, left, top, fill: '#06b6d4', scaleX: 0.8, scaleY: 0.8 });
    case 'lens':
      return new fabricNs.Path('M50,10 Q30,30 30,50 Q30,70 50,90 Q70,70 70,50 Q70,30 50,10 Z', { ...defaultShapeProperties, left, top, fill: '#8b5cf6', scaleX: 0.8, scaleY: 0.8 });
    case 'bracket':
      return new fabricNs.Path('M20,20 L20,80 L40,80 L40,60 L60,60 L60,40 L40,40 L40,20 Z', { ...defaultShapeProperties, left, top, fill: '#6b7280', scaleX: 1.2, scaleY: 1.2 });
    case 'chevron': {
      const pts=[ { x: -40, y: 0 }, { x: -20, y: -20 }, { x: 0, y: 0 }, { x: 20, y: -20 }, { x: 40, y: 0 }, { x: 20, y: 20 }, { x: 0, y: 0 }, { x: -20, y: 20 } ];
      return new fabricNs.Polygon(pts, { ...defaultShapeProperties, left, top, fill: '#3b82f6' });
    }
    case 'zigzag':
      return new fabricNs.Path('M10,50 L30,20 L50,50 L70,20 L90,50 L110,20 L130,50', { ...defaultShapeProperties, left, top, fill: 'transparent', stroke: '#ef4444', strokeWidth: 4, scaleX: 0.8, scaleY: 0.8 });
    case 'squiggle':
      return new fabricNs.Path('M10,50 Q30,20 50,50 T90,50 T130,50', { ...defaultShapeProperties, left, top, fill: 'transparent', stroke: '#10b981', strokeWidth: 4, scaleX: 0.8, scaleY: 0.8 });
    case 'callout':
      return new fabricNs.Polygon([ { x: -40, y: -25 }, { x: 40, y: -25 }, { x: 40, y: 10 }, { x: 20, y: 10 }, { x: 10, y: 25 }, { x: 0, y: 10 }, { x: -40, y: 10 } ], { ...defaultShapeProperties, left, top, fill: '#fbbf24' });
    default:
      return null;
  }
};

// Helper function to apply shape style preset
export const applyShapeStyle = (shapeObject, styleName) => {
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
export const applyBorderPreset = (shapeObject, presetName) => {
  const preset = shapeBorderPresets[presetName];
  if (!preset || !shapeObject) return;

  Object.keys(preset.properties).forEach(key => {
    shapeObject.set(key, preset.properties[key]);
  });
};

// Helper function to apply corner radius
export const applyCornerRadius = (shapeObject, presetName) => {
  const preset = shapeCornerRadiusPresets[presetName];
  if (!preset || !shapeObject) return;

  shapeObject.set({ rx: preset.value, ry: preset.value });
};

// Get shape properties as serializable object
export const getShapeProperties = (shapeObject) => {
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
  };
};

// Apply gradient to shape
export const applyGradientToShape = (shapeObject, gradientType = 'linear', colors = ['#667eea', '#764ba2']) => {
  if (!shapeObject) return;

  let coords;
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
export const createShadow = (color = 'rgba(0,0,0,0.3)', blur = 10, offsetX = 5, offsetY = 5) => {
  return {
    color,
    blur,
    offsetX,
    offsetY
  };
};

// Apply shadow to shape
export const applyShadowToShape = (shapeObject, shadowConfig = createShadow()) => {
  if (!shapeObject) return;
  shapeObject.set('shadow', {
    color: shadowConfig.color,
    blur: shadowConfig.blur,
    offsetX: shadowConfig.offsetX,
    offsetY: shadowConfig.offsetY
  });
};

// Preset shadow configurations
export const shadowPresets = {
  none: { color: 'transparent', blur: 0, offsetX: 0, offsetY: 0 },
  soft: { color: 'rgba(0,0,0,0.1)', blur: 20, offsetX: 0, offsetY: 10 },
  medium: { color: 'rgba(0,0,0,0.2)', blur: 15, offsetX: 5, offsetY: 10 },
  hard: { color: 'rgba(0,0,0,0.4)', blur: 5, offsetX: 5, offsetY: 5 },
  glow: { color: 'rgba(0,0,0,0.5)', blur: 30, offsetX: 0, offsetY: 0 },
  neon: { color: 'rgba(255,107,107,0.6)', blur: 30, offsetX: 0, offsetY: 0 }
};

