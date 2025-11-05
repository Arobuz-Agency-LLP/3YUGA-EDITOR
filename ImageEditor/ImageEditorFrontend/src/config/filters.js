// Image filter presets configuration
export interface FilterConfig {
  type: string;
  value?: number;
  warmth?: number;
  coolness?: number;
}

export interface FilterPreset {
  name: string;
  icon: string;
  filters: FilterConfig[];
}

export const filterPresets: FilterPreset[] = [
  {
    name: 'Original',
    icon: '◉',
    filters: []
  },
  {
    name: 'Vintage',
    icon: '📷',
    filters: [
      { type: 'Sepia' },
      { type: 'Contrast', value: -20 },
      { type: 'Brightness', value: -10 }
    ]
  },
  {
    name: 'Black & White',
    icon: '⚫',
    filters: [
      { type: 'BlackWhite' },
      { type: 'Contrast', value: 10 }
    ]
  },
  {
    name: 'Sepia',
    icon: '🟤',
    filters: [
      { type: 'Sepia' }
    ]
  },
  {
    name: 'Vivid',
    icon: '✨',
    filters: [
      { type: 'Saturation', value: 50 },
      { type: 'Contrast', value: 30 },
      { type: 'Brightness', value: 10 }
    ]
  },
  {
    name: 'Warm',
    icon: '🔥',
    filters: [
      { type: 'Vintage', warmth: 30 },
      { type: 'Brightness', value: 15 },
      { type: 'Saturation', value: 20 }
    ]
  },
  {
    name: 'Cool',
    icon: '❄️',
    filters: [
      { type: 'Cool', coolness: 30 },
      { type: 'Brightness', value: 5 },
      { type: 'Contrast', value: 15 }
    ]
  },
  {
    name: 'Dramatic',
    icon: '🎭',
    filters: [
      { type: 'Contrast', value: 40 },
      { type: 'Brightness', value: -20 },
      { type: 'Saturation', value: -30 }
    ]
  },
  {
    name: 'Soft',
    icon: '🌸',
    filters: [
      { type: 'Brightness', value: 30 },
      { type: 'Saturation', value: -20 },
      { type: 'Blur', value: 1 }
    ]
  },
  {
    name: 'Crisp',
    icon: '💎',
    filters: [
      { type: 'Sharpen' },
      { type: 'Contrast', value: 25 },
      { type: 'Brightness', value: 10 }
    ]
  },
  {
    name: 'High Contrast',
    icon: '⚡',
    filters: [
      { type: 'Contrast', value: 60 },
      { type: 'Saturation', value: 40 }
    ]
  },
  {
    name: 'Bright',
    icon: '☀️',
    filters: [
      { type: 'Brightness', value: 40 },
      { type: 'Saturation', value: 30 }
    ]
  },
  {
    name: 'Dark',
    icon: '🌙',
    filters: [
      { type: 'Brightness', value: -40 },
      { type: 'Contrast', value: 30 }
    ]
  },
  {
    name: 'Moody',
    icon: '🌧️',
    filters: [
      { type: 'Brightness', value: -30 },
      { type: 'Saturation', value: -40 },
      { type: 'Contrast', value: 25 }
    ]
  },
  {
    name: 'Pop',
    icon: '🌈',
    filters: [
      { type: 'Vibrance', value: 70 },
      { type: 'Saturation', value: 40 },
      { type: 'Brightness', value: 15 }
    ]
  },
  {
    name: 'Matte',
    icon: '📄',
    filters: [
      { type: 'Saturation', value: -30 },
      { type: 'Contrast', value: -10 },
      { type: 'Brightness', value: 15 }
    ]
  },
  {
    name: 'Noir',
    icon: '🎬',
    filters: [
      { type: 'BlackWhite' },
      { type: 'Contrast', value: 40 },
      { type: 'Brightness', value: -15 }
    ]
  }
];

// Helper function to apply filter preset
export const applyFilterPreset = (image: any, preset: FilterPreset, fabricFilters: any): void => {
  if (!image || !preset) return;
  
  // Clear existing filters
  image.filters = [];
  
  preset.filters.forEach(filterConfig => {
    let filter = null;
    
    switch (filterConfig.type) {
      case 'Sepia':
        filter = new fabricFilters.Sepia();
        break;
        
      case 'BlackWhite':
        filter = new fabricFilters.BlackWhite();
        break;
        
      case 'Contrast':
        filter = new fabricFilters.Contrast({ 
          contrast: filterConfig.value || 0 
        });
        break;
        
      case 'Brightness':
        filter = new fabricFilters.Brightness({ 
          brightness: filterConfig.value || 0 
        });
        break;
        
      case 'Saturation':
        filter = new fabricFilters.Saturation({ 
          saturation: filterConfig.value || 0 
        });
        break;
        
      case 'Blur':
        filter = new fabricFilters.Blur({ 
          blur: filterConfig.value || 0 
        });
        break;
        
      case 'Sharpen':
        // Fabric.js doesn't have built-in sharpen, use convolution
        filter = new fabricFilters.Convolute({
          matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0]
        });
        break;
        
      case 'Vibrance':
        // Use a combination of saturation and brightness
        filter = new fabricFilters.Saturation({ 
          saturation: filterConfig.value || 0 
        });
        break;
        
      case 'Vintage':
        filter = new fabricFilters.Sepia();
        image.filters.push(filter);
        image.applyFilters();
        
        filter = new fabricFilters.Brightness({ 
          brightness: filterConfig.value || 20 
        });
        break;
        
      case 'Cool':
        // Use RemoveColor filter with complementary settings
        filter = new fabricFilters.RemoveColor({
          distance: filterConfig.coolness || 30,
          color: '#ff0000' // Remove warm colors
        });
        break;
        
      default:
        break;
    }
    
    if (filter) {
      image.filters.push(filter);
    }
  });
  
  image.applyFilters();
};

// Get filter preview thumbnail (for future enhancement)
export const getFilterPreviewUrl = (imageElement: HTMLImageElement, preset: FilterPreset): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  
  // Apply basic filters for preview
  ctx.drawImage(imageElement, 0, 0);
  
  // Apply preset-specific transformations
  if (preset.name === 'Sepia' || preset.name === 'Vintage') {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
      data[i] = Math.min(255, gray + 40);
      data[i + 1] = Math.min(255, gray + 20);
      data[i + 2] = Math.min(255, gray);
    }
    
    ctx.putImageData(imageData, 0, 0);
  } else if (preset.name === 'Black & White' || preset.name === 'Noir') {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
  
  return canvas.toDataURL();
};

