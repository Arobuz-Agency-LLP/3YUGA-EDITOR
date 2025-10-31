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
  // Additional effect presets...
  // (keeping the structure but abbreviated for brevity)
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
  if (!effect || !textObject) return;

  Object.keys(effect.properties).forEach(key => {
    const value = effect.properties[key];

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
    } else if (key === 'fill' && value && typeof value === 'object' && value.type) {
      // Ensure dimensions are initialized before creating gradient
      if (typeof textObject.initDimensions === 'function') {
        textObject.initDimensions();
      }
      const width = Math.max(1, Math.floor(textObject.width || 200));
      const coords = value.coords || { x1: 0, y1: 0, x2: width, y2: 0 };

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
    } else {
      textObject.set(key, value);
    }
  });

  textObject.set('dirty', true);
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
