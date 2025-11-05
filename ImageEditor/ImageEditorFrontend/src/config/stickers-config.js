// Stickers API Configuration

export interface StickerAPI {
  baseUrl: string;
  categories?: string[];
  collections?: string[];
  format: string;
}

export const STICKER_APIS: Record<string, StickerAPI> = {
  // OpenMoji - Open source emoji and icon project
  OPENMOJI: {
    baseUrl: 'https://openmoji.org/data',
    categories: ['smileys-emotion', 'people-body', 'animals-nature', 'food-drink', 'activities', 'objects', 'symbols'],
    format: 'svg'
  },
  
  // SVGRepo - Free SVG vectors and icons
  SVGREPO: {
    baseUrl: 'https://www.svgrepo.com/api/v1',
    categories: ['abstract', 'animals', 'business', 'education', 'food', 'nature', 'technology', 'transport'],
    format: 'svg'
  },
  
  // unDraw - Open source illustrations
  UNDRAW: {
    baseUrl: 'https://undraw.co/api',
    categories: ['business', 'technology', 'education', 'lifestyle', 'abstract'],
    format: 'svg'
  },
  
  // Iconify - Unified icon framework
  ICONIFY: {
    baseUrl: 'https://api.iconify.design',
    collections: ['mdi', 'material-symbols', 'lucide', 'heroicons', 'tabler', 'carbon'],
    format: 'svg'
  }
};

export interface LocalSticker {
  id: string;
  name: string;
  svg: string;
}

// Local sticker collections for offline use
export const LOCAL_STICKERS: Record<string, LocalSticker[]> = {
  shapes: [
    { id: 'circle', name: 'Circle', svg: '<circle cx="50" cy="50" r="40" fill="#4F46E5"/>' },
    { id: 'square', name: 'Square', svg: '<rect x="10" y="10" width="80" height="80" rx="8" fill="#06B6D4"/>' },
    { id: 'triangle', name: 'Triangle', svg: '<polygon points="50,10 90,90 10,90" fill="#10B981"/>' },
    { id: 'star', name: 'Star', svg: '<polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="#F59E0B"/>' },
    { id: 'heart', name: 'Heart', svg: '<path d="M50,90 C50,90 10,60 10,35 C10,20 25,10 40,15 C45,5 55,5 60,15 C75,10 90,20 90,35 C90,60 50,90 50,90 Z" fill="#EF4444"/>' },
    { id: 'diamond', name: 'Diamond', svg: '<polygon points="50,10 80,50 50,90 20,50" fill="#8B5CF6"/>' }
  ],
  
  arrows: [
    { id: 'arrow-right', name: 'Arrow Right', svg: '<path d="M10 50 L70 50 M55 35 L70 50 L55 65" stroke="#374151" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' },
    { id: 'arrow-left', name: 'Arrow Left', svg: '<path d="M70 50 L10 50 M25 35 L10 50 L25 65" stroke="#374151" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' },
    { id: 'arrow-up', name: 'Arrow Up', svg: '<path d="M50 70 L50 10 M35 25 L50 10 L65 25" stroke="#374151" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' },
    { id: 'arrow-down', name: 'Arrow Down', svg: '<path d="M50 10 L50 70 M35 55 L50 70 L65 55" stroke="#374151" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' }
  ],
  
  decorative: [
    { id: 'sparkle', name: 'Sparkle', svg: '<g fill="#F59E0B"><path d="M50 10 L52 25 L67 27 L52 29 L50 44 L48 29 L33 27 L48 25 Z"/><path d="M25 25 L26 30 L31 31 L26 32 L25 37 L24 32 L19 31 L24 30 Z"/><path d="M75 65 L76 70 L81 71 L76 72 L75 77 L74 72 L69 71 L74 70 Z"/></g>' },
    { id: 'crown', name: 'Crown', svg: '<path d="M15 60 L85 60 L80 40 L65 50 L50 30 L35 50 L20 40 Z" fill="#F59E0B" stroke="#D97706" stroke-width="2"/>' },
    { id: 'ribbon', name: 'Ribbon', svg: '<path d="M20 30 Q50 10 80 30 L80 50 Q50 70 20 50 Z" fill="#EC4899"/>' }
  ]
};

// Cache configuration
export const CACHE_CONFIG = {
  maxSize: 100,
  ttl: 3600000,
  prefix: 'sticker_cache_'
};

// Performance settings
export const PERFORMANCE_CONFIG = {
  lazyLoadThreshold: 200,
  thumbnailSize: 80,
  maxConcurrentRequests: 5,
  debounceDelay: 300
};

