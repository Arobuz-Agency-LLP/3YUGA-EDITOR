// Text Properties Configuration
import * as fabric from 'fabric';

export const textSpacingPresets = [
  { name: 'Ultra Tight', value: -150, label: 'Ultra Tight' },
  { name: 'Condensed', value: -100, label: 'Condensed' },
  { name: 'Tight', value: -50, label: 'Tight Spacing' },
  { name: 'Normal', value: 0, label: 'Normal Spacing' },
  { name: 'Wide', value: 100, label: 'Wide Spacing' },
  { name: 'Extra Wide', value: 200, label: 'Extra Wide' },
  { name: 'Ultra Wide', value: 300, label: 'Ultra Wide' },
  { name: 'Mega Wide', value: 400, label: 'Mega Wide' }
];

export const textEffectPresets = {
  none: {
    name: 'None',
    properties: {
      shadow: null,
      stroke: 'transparent',
      strokeWidth: 0,
      backgroundColor: '',
      fill: '#000000'
    }
  },
  shadow: {
    name: 'Shadow',
    properties: {
      shadow: {
        color: 'rgba(0,0,0,0.35)',
        blur: 12,
        offsetX: 4,
        offsetY: 6
      },
      fill: '#1e293b'
    }
  },
  gradient: {
    name: 'Gradient',
    properties: {
      fill: {
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 200, y2: 0 },
        colorStops: [
          { offset: 0, color: '#9333ea' },
          { offset: 1, color: '#ec4899' }
        ]
      }
    }
  },
  holographic: {
    name: 'Holographic',
    properties: {
      fill: {
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 200, y2: 0 },
        colorStops: [
          { offset: 0, color: '#ec4899' },
          { offset: 0.5, color: '#9333ea' },
          { offset: 1, color: '#06b6d4' }
        ]
      }
    }
  },
  neon: {
    name: 'Neon',
    properties: {
      fill: '#ff0080',
      shadow: {
        color: '#ff0080',
        blur: 20,
        offsetX: 0,
        offsetY: 0
      }
    }
  },
  cyberpunk: {
    name: 'Cyberpunk',
    properties: {
      fill: '#00ffff',
      shadow: {
        color: '#00ffff',
        blur: 20,
        offsetX: 0,
        offsetY: 0
      }
    }
  },
  chrome: {
    name: 'Chrome',
    properties: {
      fill: {
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 200, y2: 200 },
        colorStops: [
          { offset: 0, color: '#f3f4f6' },
          { offset: 0.5, color: '#d1d5db' },
          { offset: 1, color: '#9ca3af' }
        ]
      }
    }
  },
  fire: {
    name: 'Fire',
    properties: {
      fill: {
        type: 'linear',
        coords: { x1: 0, y1: 200, x2: 0, y2: 0 },
        colorStops: [
          { offset: 0, color: '#dc2626' },
          { offset: 0.5, color: '#f97316' },
          { offset: 1, color: '#eab308' }
        ]
      }
    }
  },
  ice: {
    name: 'Ice',
    properties: {
      fill: {
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 0, y2: 200 },
        colorStops: [
          { offset: 0, color: '#bfdbfe' },
          { offset: 0.5, color: '#60a5fa' },
          { offset: 1, color: '#2563eb' }
        ]
      }
    }
  },
  gold: {
    name: 'Gold',
    properties: {
      fill: {
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 0, y2: 200 },
        colorStops: [
          { offset: 0, color: '#fef08a' },
          { offset: 0.5, color: '#facc15' },
          { offset: 1, color: '#eab308' }
        ]
      }
    }
  },
  outline: {
    name: 'Outline',
    properties: {
      fill: 'transparent',
      stroke: '#333333',
      strokeWidth: 2
    }
  },
  '3d': {
    name: '3D',
    properties: {
      fill: '#1e293b',
      shadow: {
        color: 'rgba(0,0,0,0.8)',
        blur: 0,
        offsetX: 4,
        offsetY: 4
      }
    }
  },
  glassmorphism: {
    name: 'Glassmorphism',
    properties: {
      fill: '#ffffff',
      backgroundColor: 'rgba(255,255,255,0.1)',
      stroke: 'rgba(255,255,255,0.2)',
      strokeWidth: 1,
      shadow: {
        color: 'rgba(0,0,0,0.1)',
        blur: 10,
        offsetX: 0,
        offsetY: 2
      }
    }
  }
};

export const defaultTextProperties = {
  fill: '#000000',
  stroke: 'transparent',
  strokeWidth: 0,
  opacity: 1,
  fontSize: 32,
  fontFamily: 'Inter',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textAlign: 'left',
  charSpacing: 0,
  lineHeight: 1.2,
  shadow: null,
  backgroundColor: '',
  padding: 0,
  rx: 0,
  ry: 0,
  angle: 0,
  skewX: 0,
  skewY: 0,
  scaleX: 1,
  scaleY: 1
};

// Export key types and helper functions
export const applyTextEffect = (textObject, effectName) => {
  const effect = textEffectPresets[effectName];
  if (!effect || !textObject) {
    console.warn('[Text Effect] Missing effect or textObject:', { effectName, effect, textObject });
    return;
  }

  console.log('[Text Effect] Applying effect:', effectName, 'to text:', textObject);

  // Check if current fill is a gradient (preserve it)
  const currentFill = textObject.get('fill');
  const isCurrentFillGradient = currentFill && typeof currentFill === 'object' && currentFill.type && (currentFill.type === 'linear' || currentFill.type === 'radial');

  Object.keys(effect.properties).forEach(key => {
    const value = effect.properties[key];
    
    console.log('[Text Effect] Applying property:', key, '=', value);

    if (key === 'shadow') {
      if (value) {
        textObject.set('shadow', new fabric.Shadow({
          color: value.color,
          blur: value.blur,
          offsetX: value.offsetX,
          offsetY: value.offsetY
        }));
      } else {
        textObject.set('shadow', null);
      }
    } else if (key === 'fill') {
      // Only apply fill if:
      // 1. The effect provides a gradient (object with type)
      // 2. OR the current fill is NOT a gradient (so we can safely replace it)
      if (value && typeof value === 'object' && value.type) {
        // Effect provides a gradient - always apply it
        // Ensure dimensions are initialized before creating gradient
        if (typeof textObject.initDimensions === 'function') {
          textObject.initDimensions();
        }
        
        // Get actual text dimensions (account for scale)
        const width = Math.max(1, Math.floor((textObject.width || 200) * (textObject.scaleX || 1)));
        const height = Math.max(1, Math.floor((textObject.height || 100) * (textObject.scaleY || 1)));
        
        // Use provided coords or calculate default based on text dimensions
        let coords = value.coords;
        if (!coords) {
          // Default to horizontal gradient if no coords provided
          coords = { x1: 0, y1: 0, x2: width, y2: 0 };
        } else {
          // Scale coords to match text dimensions if they're relative
          coords = {
            x1: coords.x1 === 0 ? 0 : (coords.x1 / 200) * width,
            y1: coords.y1 === 0 ? 0 : (coords.y1 / 200) * height,
            x2: coords.x2 === 200 ? width : (coords.x2 / 200) * width,
            y2: coords.y2 === 0 ? 0 : (coords.y2 / 200) * height,
            r1: coords.r1,
            r2: coords.r2 ? (coords.r2 / 200) * Math.max(width, height) : coords.r2
          };
        }

        const gradient = new fabric.Gradient({
          type: value.type,
          coords: {
            x1: coords.x1,
            y1: coords.y1,
            x2: coords.x2,
            y2: coords.y2,
            r1: coords.r1,
            r2: coords.r2
          },
          colorStops: (value.colorStops || []).map((s) => ({ offset: s.offset, color: s.color }))
        });
        textObject.set('fill', gradient);
        console.log('[Text Effect] Applied gradient fill');
      } else if (!isCurrentFillGradient && value) {
        // Effect provides a solid color and current fill is not a gradient - apply it
        textObject.set(key, value);
        console.log('[Text Effect] Applied solid color fill:', value);
      } else {
        console.log('[Text Effect] Skipped fill (preserving existing gradient)');
      }
      // If current fill IS a gradient and effect provides a solid color, skip it (preserve gradient)
    } else {
      // For all other properties (stroke, strokeWidth, backgroundColor, etc.), always apply
      if (value !== undefined && value !== null) {
        textObject.set(key, value);
        console.log('[Text Effect] Applied property:', key, '=', value);
      }
    }
  });

  textObject.set('dirty', true);
  console.log('[Text Effect] Effect applied successfully');
};

export const textHeadingPresets = {
  heading: {
    name: 'Heading',
    properties: {
      fontSize: 64,
      fontFamily: 'Playfair Display',
      fontWeight: 'bold',
      fill: '#1e293b',
      splitByGrapheme: true
    }
  },
  subheading: {
    name: 'Subheading',
    properties: {
      fontSize: 36,
      fontFamily: 'Montserrat',
      fontWeight: '600',
      fill: '#475569',
      splitByGrapheme: true
    }
  },
  body: {
    name: 'Body',
    properties: {
      fontSize: 32,
      fontFamily: 'Inter',
      fontWeight: 'normal',
      fill: '#1e293b',
      splitByGrapheme: true
    }
  }
};

export const textCurvePresets = {
  arc: {
    name: 'Arc',
    properties: {
      angle: -12,
      skewX: 8,
      scaleY: 0.95,
      shadow: { color: 'rgba(0,0,0,0.1)', blur: 2, offsetX: 1, offsetY: 2 }
    }
  },
  wave: {
    name: 'Wave',
    properties: {
      skewY: 15,
      scaleY: 0.7,
      scaleX: 1.1,
      angle: 3,
      shadow: { color: 'rgba(59,130,246,0.2)', blur: 6, offsetX: 2, offsetY: 1 }
    }
  }
};

export const applyCurvePreset = (textObject, curveName) => {
  const preset = textCurvePresets[curveName];
  if (!preset || !textObject) return;

  Object.keys(preset.properties).forEach(key => {
    const value = preset.properties[key];
    if (key === 'shadow' && value) {
      textObject.set('shadow', new fabric.Shadow({
        color: value.color,
        blur: value.blur,
        offsetX: value.offsetX,
        offsetY: value.offsetY
      }));
    } else {
      textObject.set(key, value);
    }
  });
};

export const applySpacingPreset = (textObject, presetName) => {
  const preset = textSpacingPresets.find(p => p.name === presetName);
  if (preset && textObject) {
    textObject.set('charSpacing', preset.value);
  }
};

export const createCurvedTextGroup = (textString, curveName, options = {}) => {
  return null; // Placeholder implementation
};
