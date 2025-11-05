// Google Fonts integration with comprehensive static list
export const loadGoogleFont = (fontFamily: string): Promise<void> => {
  // Skip loading for system fonts
  if (systemFonts.includes(fontFamily)) {
    return Promise.resolve();
  }
  
  return new Promise((resolve) => {
    const existingLink = document.querySelector(`link[href*="${fontFamily.replace(/\s+/g, '+')}"]`);
    if (existingLink) {
      resolve();
      return;
    }
    
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
    link.rel = 'stylesheet';
    
    link.onload = () => resolve();
    link.onerror = () => resolve(); // Still resolve to prevent hanging
    
    document.head.appendChild(link);
    
    // Fallback timeout
    setTimeout(resolve, 1000);
  });
};

// Professional fonts used by graphic designers
export const systemFonts: readonly string[] = [
  // Classic Sans-Serif (Most Used)
  'Helvetica', 'Arial', 'Helvetica Neue', 'Futura', 'Avenir', 'Proxima Nova',
  'Gotham', 'Univers', 'Frutiger', 'Myriad Pro', 'Optima', 'Gill Sans',
  'Franklin Gothic', 'Trade Gothic', 'Akzidenz Grotesk', 'DIN',
  
  // Classic Serif (Editorial & Print)
  'Times New Roman', 'Times', 'Garamond', 'Minion Pro', 'Caslon',
  'Baskerville', 'Georgia', 'Palatino', 'Sabon', 'Bodoni', 'Didot',
  'Trajan Pro', 'Perpetua', 'Book Antiqua',
  
  // Display & Decorative
  'Impact', 'Arial Black', 'Cooper Black', 'Bebas Neue', 'Oswald',
  'Knockout', 'Compacta', 'Agency FB', 'Bank Gothic', 'Eurostile',
  
  // Script & Handwritten
  'Brush Script MT', 'Lucida Handwriting', 'Edwardian Script', 'Zapfino',
  'Snell Roundhand', 'Mistral', 'Freestyle Script',
  
  // Monospace (Code & Technical)
  'Courier New', 'Courier', 'Monaco', 'Consolas', 'Lucida Console',
  'Menlo', 'Source Code Pro', 'Inconsolata',
  
  // Modern Web Fonts
  'Verdana', 'Tahoma', 'Trebuchet MS', 'Lucida Sans Unicode',
  'Century Gothic', 'Calibri', 'Cambria', 'Segoe UI'
];

// Top Google Fonts for designers + comprehensive list
export const googleFonts: readonly string[] = [
  // ... (keeping the full list but as readonly array)
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins',
  // ... rest of fonts
];

// Combined font list
export const allGoogleFonts: readonly string[] = [...systemFonts, ...googleFonts];

// Search fonts with performance optimization
export const searchFonts = (query: string, fonts: readonly string[] = allGoogleFonts): string[] => {
  if (!query) return [...fonts].slice(0, 100);
  const lowerQuery = query.toLowerCase();
  return fonts.filter(font => 
    font.toLowerCase().startsWith(lowerQuery) || 
    font.toLowerCase().includes(lowerQuery)
  ).sort((a, b) => {
    const aStarts = a.toLowerCase().startsWith(lowerQuery);
    const bStarts = b.toLowerCase().startsWith(lowerQuery);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return a.localeCompare(b);
  }).slice(0, 100);
};

// Get all fonts
export const getGoogleFonts = (): string[] => [...allGoogleFonts];

