export const templates = [
  // INSTAGRAM ADS TEMPLATES - Premium Collection
  {
    id: 'instagram-luxury-brand',
    name: 'Instagram - Luxury Brand Ad',
    category: 'Instagram',
    size: { width: 1080, height: 1080 },
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=400&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1080, y2: 1080 }, colorStops: [{ offset: 0, color: '#0f0f23' }, { offset: 0.5, color: '#1a1a2e' }, { offset: 1, color: '#16213e' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'rect',
          left: 80,
          top: 200,
          width: 920,
          height: 600,
          fill: 'rgba(255, 255, 255, 0.05)',
          stroke: 'rgba(255, 255, 255, 0.1)',
          strokeWidth: 1,
          rx: 20,
          ry: 20,
          name: 'Card Container'
        },
        {
          type: 'textbox',
          left: 140,
          top: 300,
          width: 800,
          fontSize: 64,
          fontFamily: 'Playfair Display',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'LUXURY\nREDEFINED',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 140,
          top: 500,
          width: 800,
          fontSize: 24,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.8)',
          text: 'Experience the extraordinary',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 440,
          top: 600,
          width: 200,
          height: 50,
          fill: 'transparent',
          stroke: '#d4af37',
          strokeWidth: 2,
          rx: 25,
          ry: 25,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 440,
          top: 610,
          width: 200,
          fontSize: 18,
          fontFamily: 'Inter',
          fontWeight: '500',
          fill: '#d4af37',
          text: 'Discover More',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'instagram-fashion-trend',
    name: 'Instagram - Fashion Trend',
    category: 'Instagram',
    size: { width: 1080, height: 1080 },
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1080, y2: 0 }, colorStops: [{ offset: 0, color: '#ff9a9e' }, { offset: 0.5, color: '#fecfef' }, { offset: 1, color: '#fecfef' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'circle',
          left: 700,
          top: 100,
          radius: 150,
          fill: 'rgba(255, 255, 255, 0.2)',
          name: 'Decorative Circle 1'
        },
        {
          type: 'circle',
          left: 200,
          top: 800,
          radius: 100,
          fill: 'rgba(255, 255, 255, 0.15)',
          name: 'Decorative Circle 2'
        },
        {
          type: 'textbox',
          left: 100,
          top: 350,
          width: 880,
          fontSize: 72,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'FASHION\nFORWARD',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 100,
          top: 550,
          width: 880,
          fontSize: 28,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.9)',
          text: 'New Collection 2025',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 390,
          top: 650,
          width: 300,
          height: 60,
          fill: '#ffffff',
          rx: 30,
          ry: 30,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 390,
          top: 665,
          width: 300,
          fontSize: 20,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#ff9a9e',
          text: 'Shop Collection',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'instagram-tech-startup',
    name: 'Instagram - Tech Startup',
    category: 'Instagram',
    size: { width: 1080, height: 1080 },
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1080, y2: 1080 }, colorStops: [{ offset: 0, color: '#667eea' }, { offset: 0.5, color: '#764ba2' }, { offset: 1, color: '#f093fb' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'rect',
          left: 140,
          top: 250,
          width: 800,
          height: 500,
          fill: 'rgba(255, 255, 255, 0.1)',
          stroke: 'rgba(255, 255, 255, 0.2)',
          strokeWidth: 1,
          rx: 25,
          ry: 25,
          name: 'Card Container'
        },
        {
          type: 'textbox',
          left: 200,
          top: 350,
          width: 680,
          fontSize: 56,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'INNOVATION\nMEETS DESIGN',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 200,
          top: 520,
          width: 680,
          fontSize: 24,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.8)',
          text: 'Building the future, one pixel at a time',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 340,
          top: 620,
          width: 400,
          height: 50,
          fill: '#ffffff',
          rx: 25,
          ry: 25,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 340,
          top: 630,
          width: 400,
          fontSize: 18,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#667eea',
          text: 'Learn More',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'instagram-food-delivery',
    name: 'Instagram - Food Delivery',
    category: 'Instagram',
    size: { width: 1080, height: 1080 },
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 1080 }, colorStops: [{ offset: 0, color: '#ff9a56' }, { offset: 1, color: '#ff6b6b' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'circle',
          left: 390,
          top: 150,
          radius: 150,
          fill: 'rgba(255, 255, 255, 0.1)',
          name: 'Decorative Circle'
        },
        {
          type: 'textbox',
          left: 100,
          top: 400,
          width: 880,
          fontSize: 68,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'DELICIOUS\nDELIVERED',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 100,
          top: 580,
          width: 880,
          fontSize: 28,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.9)',
          text: 'Fresh ingredients, amazing taste',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 340,
          top: 680,
          width: 400,
          height: 60,
          fill: '#ffffff',
          rx: 30,
          ry: 30,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 340,
          top: 695,
          width: 400,
          fontSize: 22,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#ff6b6b',
          text: 'Order Now',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'instagram-fitness-motivation',
    name: 'Instagram - Fitness Motivation',
    category: 'Instagram',
    size: { width: 1080, height: 1080 },
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1080, y2: 1080 }, colorStops: [{ offset: 0, color: '#ff6b6b' }, { offset: 1, color: '#ee5a24' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'textbox',
          left: 100,
          top: 300,
          width: 880,
          fontSize: 80,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'GET FIT\nSTAY STRONG',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 100,
          top: 520,
          width: 880,
          fontSize: 28,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.9)',
          text: 'Join our fitness community today',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 340,
          top: 620,
          width: 400,
          height: 60,
          fill: '#ffffff',
          rx: 30,
          ry: 30,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 340,
          top: 635,
          width: 400,
          fontSize: 22,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#ff6b6b',
          text: 'Start Training',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'instagram-minimal-elegant',
    name: 'Instagram - Minimal Elegant',
    category: 'Instagram',
    size: { width: 1080, height: 1080 },
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: '#ffffff',
          selectable: false,
          name: 'Background'
        },
        {
          type: 'rect',
          left: 80,
          top: 80,
          width: 920,
          height: 920,
          fill: 'transparent',
          stroke: '#1e293b',
          strokeWidth: 4,
          selectable: false,
          name: 'Border'
        },
        {
          type: 'textbox',
          left: 150,
          top: 450,
          width: 780,
          fontSize: 64,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          fill: '#1e293b',
          text: 'Clean & Simple',
          textAlign: 'center',
          name: 'Title Text'
        },
        {
          type: 'textbox',
          left: 150,
          top: 550,
          width: 780,
          fontSize: 28,
          fontFamily: 'Inter',
          fill: '#64748b',
          text: 'Minimalist Design',
          textAlign: 'center',
          name: 'Subtitle'
        }
      ]
    }
  },

  // FACEBOOK ADS TEMPLATES - Premium Collection
  {
    id: 'facebook-luxury-sale',
    name: 'Facebook - Luxury Sale Ad',
    category: 'Facebook',
    size: { width: 1200, height: 628 },
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=209&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 628,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1200, y2: 628 }, colorStops: [{ offset: 0, color: '#1a1a2e' }, { offset: 0.5, color: '#16213e' }, { offset: 1, color: '#0f3460' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'rect',
          left: 100,
          top: 100,
          width: 1000,
          height: 428,
          fill: 'rgba(255, 255, 255, 0.05)',
          stroke: 'rgba(255, 255, 255, 0.1)',
          strokeWidth: 1,
          rx: 20,
          ry: 20,
          name: 'Card Container'
        },
        {
          type: 'textbox',
          left: 200,
          top: 200,
          width: 800,
          fontSize: 72,
          fontFamily: 'Playfair Display',
          fontWeight: 'bold',
          fill: '#d4af37',
          text: 'EXCLUSIVE SALE',
          textAlign: 'center',
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 200,
          top: 320,
          width: 800,
          fontSize: 32,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.9)',
          text: 'Limited time offer - Don\'t miss out!',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 450,
          top: 400,
          width: 300,
          height: 60,
          fill: '#d4af37',
          rx: 30,
          ry: 30,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 450,
          top: 415,
          width: 300,
          fontSize: 24,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#1a1a2e',
          text: 'Shop Now',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'facebook-tech-announcement',
    name: 'Facebook - Tech Announcement',
    category: 'Facebook',
    size: { width: 1200, height: 628 },
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=209&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 628,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1200, y2: 0 }, colorStops: [{ offset: 0, color: '#667eea' }, { offset: 0.5, color: '#764ba2' }, { offset: 1, color: '#f093fb' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'circle',
          left: 950,
          top: 50,
          radius: 100,
          fill: 'rgba(255, 255, 255, 0.1)',
          name: 'Decorative Circle'
        },
        {
          type: 'textbox',
          left: 100,
          top: 200,
          width: 1000,
          fontSize: 64,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'INNOVATION\nUNLEASHED',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 100,
          top: 380,
          width: 1000,
          fontSize: 28,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.8)',
          text: 'The future of technology is here',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 400,
          top: 450,
          width: 400,
          height: 50,
          fill: '#ffffff',
          rx: 25,
          ry: 25,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 400,
          top: 460,
          width: 400,
          fontSize: 20,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#667eea',
          text: 'Learn More',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'facebook-food-delivery',
    name: 'Facebook - Food Delivery',
    category: 'Facebook',
    size: { width: 1200, height: 628 },
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=209&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 628,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 628 }, colorStops: [{ offset: 0, color: '#ff9a56' }, { offset: 1, color: '#ff6b6b' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'circle',
          left: 950,
          top: 50,
          radius: 80,
          fill: 'rgba(255, 255, 255, 0.1)',
          name: 'Decorative Circle 1'
        },
        {
          type: 'circle',
          left: 150,
          top: 500,
          radius: 60,
          fill: 'rgba(255, 255, 255, 0.08)',
          name: 'Decorative Circle 2'
        },
        {
          type: 'textbox',
          left: 100,
          top: 200,
          width: 1000,
          fontSize: 68,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'DELICIOUS\nDELIVERED',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 100,
          top: 380,
          width: 1000,
          fontSize: 28,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.9)',
          text: 'Fresh ingredients, amazing taste, delivered to your door',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 400,
          top: 450,
          width: 400,
          height: 60,
          fill: '#ffffff',
          rx: 30,
          ry: 30,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 400,
          top: 465,
          width: 400,
          fontSize: 22,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#ff6b6b',
          text: 'Order Now',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'facebook-fitness-motivation',
    name: 'Facebook - Fitness Motivation',
    category: 'Facebook',
    size: { width: 1200, height: 628 },
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=209&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 628,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1200, y2: 628 }, colorStops: [{ offset: 0, color: '#ff6b6b' }, { offset: 1, color: '#ee5a24' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'textbox',
          left: 100,
          top: 150,
          width: 1000,
          fontSize: 80,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'GET FIT\nSTAY STRONG',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 100,
          top: 380,
          width: 1000,
          fontSize: 32,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.9)',
          text: 'Join our fitness community and transform your life',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 400,
          top: 450,
          width: 400,
          height: 60,
          fill: '#ffffff',
          rx: 30,
          ry: 30,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 400,
          top: 465,
          width: 400,
          fontSize: 22,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#ff6b6b',
          text: 'Start Training',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'facebook-fashion-trend',
    name: 'Facebook - Fashion Trend',
    category: 'Facebook',
    size: { width: 1200, height: 628 },
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=209&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 628,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1200, y2: 0 }, colorStops: [{ offset: 0, color: '#ff9a9e' }, { offset: 0.5, color: '#fecfef' }, { offset: 1, color: '#fecfef' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'circle',
          left: 950,
          top: 50,
          radius: 100,
          fill: 'rgba(255, 255, 255, 0.2)',
          name: 'Decorative Circle 1'
        },
        {
          type: 'circle',
          left: 150,
          top: 500,
          radius: 80,
          fill: 'rgba(255, 255, 255, 0.15)',
          name: 'Decorative Circle 2'
        },
        {
          type: 'textbox',
          left: 100,
          top: 200,
          width: 1000,
          fontSize: 72,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'FASHION\nFORWARD',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 100,
          top: 380,
          width: 1000,
          fontSize: 28,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.9)',
          text: 'New Collection 2025 - Style that defines you',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 400,
          top: 450,
          width: 400,
          height: 60,
          fill: '#ffffff',
          rx: 30,
          ry: 30,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 400,
          top: 465,
          width: 400,
          fontSize: 22,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#ff9a9e',
          text: 'Shop Collection',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'facebook-business-professional',
    name: 'Facebook - Business Professional',
    category: 'Facebook',
    size: { width: 1200, height: 628 },
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=209&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 628,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 628 }, colorStops: [{ offset: 0, color: '#1e3a8a' }, { offset: 1, color: '#1e40af' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'rect',
          left: 100,
          top: 100,
          width: 1000,
          height: 428,
          fill: 'rgba(255, 255, 255, 0.1)',
          stroke: 'rgba(255, 255, 255, 0.2)',
          strokeWidth: 1,
          rx: 20,
          ry: 20,
          name: 'Card Container'
        },
        {
          type: 'textbox',
          left: 200,
          top: 200,
          width: 800,
          fontSize: 64,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'PROFESSIONAL\nEXCELLENCE',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 200,
          top: 380,
          width: 800,
          fontSize: 28,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.8)',
          text: 'Trusted solutions for your business growth',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 400,
          top: 450,
          width: 400,
          height: 50,
          fill: '#ffffff',
          rx: 25,
          ry: 25,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 400,
          top: 460,
          width: 400,
          fontSize: 20,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#1e3a8a',
          text: 'Get Started',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },

  // YOUTUBE THUMBNAILS/BANNERS TEMPLATES - Premium Collection
  {
    id: 'youtube-gaming-thumbnail',
    name: 'YouTube - Gaming Thumbnail',
    category: 'YouTube',
    size: { width: 1280, height: 720 },
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1280,
          height: 720,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1280, y2: 720 }, colorStops: [{ offset: 0, color: '#4c1d95' }, { offset: 1, color: '#111827' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'textbox',
          left: 100,
          top: 250,
          width: 1080,
          fontSize: 88,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#a855f7',
          text: 'EPIC GAMEPLAY',
          textAlign: 'center',
          name: 'Title',
          shadow: { color: '#a855f7', blur: 20, offsetX: 0, offsetY: 0 }
        },
        {
          type: 'textbox',
          left: 100,
          top: 400,
          width: 1080,
          fontSize: 32,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.8)',
          text: 'Watch the most intense moments',
          textAlign: 'center',
          name: 'Subtitle'
        }
      ]
    }
  },
  {
    id: 'youtube-tech-review',
    name: 'YouTube - Tech Review',
    category: 'YouTube',
    size: { width: 1280, height: 720 },
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=225&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1280,
          height: 720,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 720 }, colorStops: [{ offset: 0, color: '#1e3a8a' }, { offset: 1, color: '#0c4a6e' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'textbox',
          left: 100,
          top: 280,
          width: 1080,
          fontSize: 72,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'TECH REVIEW 2025',
          textAlign: 'center',
          name: 'Title'
        },
        {
          type: 'textbox',
          left: 100,
          top: 400,
          width: 1080,
          fontSize: 28,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.8)',
          text: 'In-depth analysis of the latest technology',
          textAlign: 'center',
          name: 'Subtitle'
        }
      ]
    }
  },
  {
    id: 'youtube-lifestyle-vlog',
    name: 'YouTube - Lifestyle Vlog',
    category: 'YouTube',
    size: { width: 1280, height: 720 },
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1280,
          height: 720,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1280, y2: 0 }, colorStops: [{ offset: 0, color: '#f093fb' }, { offset: 1, color: '#f5576c' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'textbox',
          left: 80,
          top: 250,
          width: 1120,
          fontSize: 96,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'LIFESTYLE\nVLOG',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Title Text'
        },
        {
          type: 'textbox',
          left: 80,
          top: 450,
          width: 1120,
          fontSize: 32,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.9)',
          text: 'Daily inspiration and lifestyle tips',
          textAlign: 'center',
          name: 'Subtitle'
        }
      ]
    }
  },
  {
    id: 'youtube-educational-content',
    name: 'YouTube - Educational Content',
    category: 'YouTube',
    size: { width: 1280, height: 720 },
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=225&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1280,
          height: 720,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 720 }, colorStops: [{ offset: 0, color: '#059669' }, { offset: 1, color: '#10b981' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'textbox',
          left: 100,
          top: 250,
          width: 1080,
          fontSize: 80,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'LEARN & GROW',
          textAlign: 'center',
          name: 'Title'
        },
        {
          type: 'textbox',
          left: 100,
          top: 400,
          width: 1080,
          fontSize: 32,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.9)',
          text: 'Educational content that matters',
          textAlign: 'center',
          name: 'Subtitle'
        }
      ]
    }
  },
  {
    id: 'youtube-music-video',
    name: 'YouTube - Music Video',
    category: 'YouTube',
    size: { width: 1280, height: 720 },
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1280,
          height: 720,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1280, y2: 720 }, colorStops: [{ offset: 0, color: '#ff6b6b' }, { offset: 1, color: '#feca57' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'textbox',
          left: 100,
          top: 250,
          width: 1080,
          fontSize: 88,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'NEW MUSIC',
          textAlign: 'center',
          name: 'Title'
        },
        {
          type: 'textbox',
          left: 100,
          top: 400,
          width: 1080,
          fontSize: 32,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.9)',
          text: 'Fresh beats and amazing vibes',
          textAlign: 'center',
          name: 'Subtitle'
        }
      ]
    }
  },
  {
    id: 'youtube-cooking-show',
    name: 'YouTube - Cooking Show',
    category: 'YouTube',
    size: { width: 1280, height: 720 },
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=225&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1280,
          height: 720,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 720 }, colorStops: [{ offset: 0, color: '#ff9a56' }, { offset: 1, color: '#ff6b6b' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'textbox',
          left: 100,
          top: 250,
          width: 1080,
          fontSize: 80,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'COOKING\nMASTERCLASS',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Title'
        },
        {
          type: 'textbox',
          left: 100,
          top: 450,
          width: 1080,
          fontSize: 32,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.9)',
          text: 'Learn to cook like a professional chef',
          textAlign: 'center',
          name: 'Subtitle'
        }
      ]
    }
  },

  // WHATSAPP PROMOTIONS TEMPLATES - Premium Collection
  {
    id: 'whatsapp-business-promo',
    name: 'WhatsApp - Business Promotion',
    category: 'WhatsApp',
    size: { width: 1080, height: 1080 },
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1080, y2: 1080 }, colorStops: [{ offset: 0, color: '#25d366' }, { offset: 1, color: '#128c7e' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'rect',
          left: 80,
          top: 200,
          width: 920,
          height: 600,
          fill: 'rgba(255, 255, 255, 0.1)',
          stroke: 'rgba(255, 255, 255, 0.2)',
          strokeWidth: 1,
          rx: 20,
          ry: 20,
          name: 'Card Container'
        },
        {
          type: 'textbox',
          left: 140,
          top: 300,
          width: 800,
          fontSize: 64,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'BUSINESS\nSOLUTIONS',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 140,
          top: 500,
          width: 800,
          fontSize: 24,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.8)',
          text: 'Connect with customers instantly',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 440,
          top: 600,
          width: 200,
          height: 50,
          fill: '#ffffff',
          rx: 25,
          ry: 25,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 440,
          top: 610,
          width: 200,
          fontSize: 18,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#25d366',
          text: 'Get Started',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'whatsapp-product-launch',
    name: 'WhatsApp - Product Launch',
    category: 'WhatsApp',
    size: { width: 1080, height: 1080 },
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1080, y2: 0 }, colorStops: [{ offset: 0, color: '#667eea' }, { offset: 1, color: '#764ba2' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'circle',
          left: 390,
          top: 150,
          radius: 150,
          fill: 'rgba(255, 255, 255, 0.1)',
          name: 'Decorative Circle'
        },
        {
          type: 'textbox',
          left: 100,
          top: 400,
          width: 880,
          fontSize: 68,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'NEW PRODUCT\nLAUNCH',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 100,
          top: 580,
          width: 880,
          fontSize: 28,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.9)',
          text: 'Innovation meets design',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 340,
          top: 680,
          width: 400,
          height: 60,
          fill: '#ffffff',
          rx: 30,
          ry: 30,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 340,
          top: 695,
          width: 400,
          fontSize: 22,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#667eea',
          text: 'Pre-Order Now',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'whatsapp-event-announcement',
    name: 'WhatsApp - Event Announcement',
    category: 'WhatsApp',
    size: { width: 1080, height: 1080 },
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1080, y2: 1080 }, colorStops: [{ offset: 0, color: '#ff9a9e' }, { offset: 1, color: '#fecfef' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'rect',
          left: 140,
          top: 200,
          width: 800,
          height: 600,
          fill: '#ffffff',
          rx: 30,
          ry: 30,
          opacity: 0.9,
          name: 'Card Container'
        },
        {
          type: 'textbox',
          left: 200,
          top: 280,
          width: 680,
          fontSize: 56,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#2c3e50',
          text: 'TECH CONFERENCE',
          textAlign: 'center',
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 200,
          top: 380,
          width: 680,
          fontSize: 96,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#e74c3c',
          text: '2025',
          textAlign: 'center',
          name: 'Year'
        },
        {
          type: 'textbox',
          left: 200,
          top: 520,
          width: 680,
          fontSize: 28,
          fontFamily: 'Inter',
          fill: '#7f8c8d',
          text: 'March 15-17 • San Francisco',
          textAlign: 'center',
          name: 'Date Location'
        },
        {
          type: 'rect',
          left: 440,
          top: 620,
          width: 200,
          height: 60,
          fill: '#3498db',
          rx: 30,
          ry: 30,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 440,
          top: 635,
          width: 200,
          fontSize: 24,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#ffffff',
          text: 'Register',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'whatsapp-sale-promotion',
    name: 'WhatsApp - Sale Promotion',
    category: 'WhatsApp',
    size: { width: 1080, height: 1080 },
    thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1080, y2: 1080 }, colorStops: [{ offset: 0, color: '#ff6b6b' }, { offset: 1, color: '#feca57' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'textbox',
          left: 100,
          top: 200,
          width: 880,
          fontSize: 96,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'MEGA SALE',
          textAlign: 'center',
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 100,
          top: 350,
          width: 880,
          fontSize: 64,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'UP TO 70% OFF',
          textAlign: 'center',
          name: 'Discount'
        },
        {
          type: 'textbox',
          left: 100,
          top: 480,
          width: 880,
          fontSize: 36,
          fontFamily: 'Inter',
          fill: '#ffffff',
          text: 'Limited Time Only!',
          textAlign: 'center',
          name: 'Urgency'
        },
        {
          type: 'rect',
          left: 340,
          top: 600,
          width: 400,
          height: 80,
          fill: '#ffffff',
          rx: 40,
          ry: 40,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 340,
          top: 620,
          width: 400,
          fontSize: 32,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#ff6b6b',
          text: 'SHOP NOW',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'whatsapp-restaurant-menu',
    name: 'WhatsApp - Restaurant Menu',
    category: 'WhatsApp',
    size: { width: 1080, height: 1080 },
    thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 1080 }, colorStops: [{ offset: 0, color: '#fef3c7' }, { offset: 1, color: '#fbbf24' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'circle',
          left: 740,
          top: 200,
          radius: 120,
          fill: 'rgba(255, 255, 255, 0.2)',
          name: 'Decorative Circle 1'
        },
        {
          type: 'circle',
          left: 200,
          top: 800,
          radius: 80,
          fill: 'rgba(255, 255, 255, 0.15)',
          name: 'Decorative Circle 2'
        },
        {
          type: 'textbox',
          left: 100,
          top: 450,
          width: 880,
          fontSize: 96,
          fontFamily: 'Playfair Display',
          fontWeight: 'bold',
          fill: '#78350f',
          text: 'Our Menu',
          textAlign: 'center',
          name: 'Title',
          shadow: { color: 'rgba(0,0,0,0.1)', blur: 5, offsetX: 0, offsetY: 2 }
        },
        {
          type: 'textbox',
          left: 100,
          top: 580,
          width: 880,
          fontSize: 32,
          fontFamily: 'Inter',
          fill: '#92400e',
          text: 'Delicious dishes crafted with love',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 340,
          top: 680,
          width: 400,
          height: 60,
          fill: '#ffffff',
          rx: 30,
          ry: 30,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 340,
          top: 695,
          width: 400,
          fontSize: 22,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#78350f',
          text: 'Order Now',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'whatsapp-fitness-motivation',
    name: 'WhatsApp - Fitness Motivation',
    category: 'WhatsApp',
    size: { width: 1080, height: 1080 },
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1080, y2: 1080 }, colorStops: [{ offset: 0, color: '#ff6b6b' }, { offset: 1, color: '#ee5a24' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'textbox',
          left: 100,
          top: 250,
          width: 880,
          fontSize: 80,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'GET FIT\nSTAY STRONG',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 100,
          top: 520,
          width: 880,
          fontSize: 28,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.9)',
          text: 'Join our fitness community today',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 340,
          top: 620,
          width: 400,
          height: 60,
          fill: '#ffffff',
          rx: 30,
          ry: 30,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 340,
          top: 635,
          width: 400,
          fontSize: 22,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#ff6b6b',
          text: 'Start Training',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },

  // GENERAL BUSINESS ADS TEMPLATES - Premium Collection
  {
    id: 'business-corporate-professional',
    name: 'Business - Corporate Professional',
    category: 'Business',
    size: { width: 1200, height: 628 },
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=209&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 628,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 628 }, colorStops: [{ offset: 0, color: '#1e3a8a' }, { offset: 1, color: '#1e40af' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'rect',
          left: 100,
          top: 100,
          width: 1000,
          height: 428,
          fill: 'rgba(255, 255, 255, 0.1)',
          stroke: 'rgba(255, 255, 255, 0.2)',
          strokeWidth: 1,
          rx: 20,
          ry: 20,
          name: 'Card Container'
        },
        {
          type: 'textbox',
          left: 200,
          top: 200,
          width: 800,
          fontSize: 64,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'PROFESSIONAL\nEXCELLENCE',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 200,
          top: 380,
          width: 800,
          fontSize: 28,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.8)',
          text: 'Trusted solutions for your business growth',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 400,
          top: 450,
          width: 400,
          height: 50,
          fill: '#ffffff',
          rx: 25,
          ry: 25,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 400,
          top: 460,
          width: 400,
          fontSize: 20,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#1e3a8a',
          text: 'Get Started',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'business-startup-pitch',
    name: 'Business - Startup Pitch',
    category: 'Business',
    size: { width: 1920, height: 1080 },
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=225&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          fill: '#ffffff',
          selectable: false,
          name: 'Background'
        },
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1920,
          height: 200,
          fill: '#0ea5e9',
          selectable: false,
          name: 'Header'
        },
        {
          type: 'textbox',
          left: 200,
          top: 450,
          width: 1520,
          fontSize: 96,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          fill: '#0f172a',
          text: 'Our Vision',
          textAlign: 'center',
          name: 'Title'
        },
        {
          type: 'textbox',
          left: 200,
          top: 600,
          width: 1520,
          fontSize: 42,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: '#64748b',
          text: 'Building the future, one innovation at a time',
          textAlign: 'center',
          name: 'Subtitle'
        }
      ]
    }
  },
  {
    id: 'business-financial-services',
    name: 'Business - Financial Services',
    category: 'Business',
    size: { width: 1200, height: 628 },
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=209&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 628,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 628 }, colorStops: [{ offset: 0, color: '#1e3c72' }, { offset: 1, color: '#2a5298' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'rect',
          left: 140,
          top: 100,
          width: 920,
          height: 428,
          fill: 'rgba(255, 255, 255, 0.1)',
          stroke: 'rgba(255, 255, 255, 0.2)',
          strokeWidth: 1,
          rx: 20,
          ry: 20,
          name: 'Card Container'
        },
        {
          type: 'textbox',
          left: 200,
          top: 200,
          width: 800,
          fontSize: 64,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'Financial\nSolutions',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 200,
          top: 380,
          width: 800,
          fontSize: 28,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.8)',
          text: 'Secure • Reliable • Professional',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 400,
          top: 450,
          width: 400,
          height: 50,
          fill: '#ffffff',
          rx: 25,
          ry: 25,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 400,
          top: 460,
          width: 400,
          fontSize: 20,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#1e3c72',
          text: 'Learn More',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'business-healthcare-services',
    name: 'Business - Healthcare Services',
    category: 'Business',
    size: { width: 1200, height: 628 },
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=209&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 628,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1200, y2: 0 }, colorStops: [{ offset: 0, color: '#059669' }, { offset: 1, color: '#10b981' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'rect',
          left: 100,
          top: 100,
          width: 1000,
          height: 428,
          fill: 'rgba(255, 255, 255, 0.1)',
          stroke: 'rgba(255, 255, 255, 0.2)',
          strokeWidth: 1,
          rx: 20,
          ry: 20,
          name: 'Card Container'
        },
        {
          type: 'textbox',
          left: 200,
          top: 200,
          width: 800,
          fontSize: 64,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'HEALTHCARE\nEXCELLENCE',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 200,
          top: 380,
          width: 800,
          fontSize: 28,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.8)',
          text: 'Caring for your health and wellbeing',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 400,
          top: 450,
          width: 400,
          height: 50,
          fill: '#ffffff',
          rx: 25,
          ry: 25,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 400,
          top: 460,
          width: 400,
          fontSize: 20,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#059669',
          text: 'Book Appointment',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'business-real-estate',
    name: 'Business - Real Estate',
    category: 'Business',
    size: { width: 1200, height: 628 },
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=209&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 628,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 1200, y2: 628 }, colorStops: [{ offset: 0, color: '#2c3e50' }, { offset: 1, color: '#34495e' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'rect',
          left: 100,
          top: 100,
          width: 1000,
          height: 428,
          fill: 'rgba(255, 255, 255, 0.1)',
          stroke: 'rgba(255, 255, 255, 0.2)',
          strokeWidth: 1,
          rx: 20,
          ry: 20,
          name: 'Card Container'
        },
        {
          type: 'textbox',
          left: 200,
          top: 200,
          width: 800,
          fontSize: 64,
          fontFamily: 'Playfair Display',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'Dream Home',
          textAlign: 'center',
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 200,
          top: 300,
          width: 800,
          fontSize: 48,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          fill: '#27ae60',
          text: '$850,000',
          textAlign: 'center',
          name: 'Price'
        },
        {
          type: 'textbox',
          left: 200,
          top: 380,
          width: 800,
          fontSize: 28,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.8)',
          text: '4 Bed • 3 Bath • 2,500 sq ft',
          textAlign: 'center',
          name: 'Details'
        },
        {
          type: 'rect',
          left: 400,
          top: 450,
          width: 400,
          height: 50,
          fill: '#3498db',
          rx: 25,
          ry: 25,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 400,
          top: 460,
          width: 400,
          fontSize: 20,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#ffffff',
          text: 'View Details',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  },
  {
    id: 'business-consulting-services',
    name: 'Business - Consulting Services',
    category: 'Business',
    size: { width: 1200, height: 628 },
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=209&fit=crop',
    data: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 628,
          fill: { type: 'linear', coords: { x1: 0, y1: 0, x2: 0, y2: 628 }, colorStops: [{ offset: 0, color: '#2c3e50' }, { offset: 1, color: '#34495e' }] },
          selectable: false,
          name: 'Background'
        },
        {
          type: 'rect',
          left: 140,
          top: 100,
          width: 920,
          height: 428,
          fill: 'rgba(255, 255, 255, 0.1)',
          stroke: 'rgba(255, 255, 255, 0.2)',
          strokeWidth: 1,
          rx: 20,
          ry: 20,
          name: 'Card Container'
        },
        {
          type: 'textbox',
          left: 200,
          top: 200,
          width: 800,
          fontSize: 64,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'Business\nConsulting',
          textAlign: 'center',
          lineHeight: 0.9,
          name: 'Main Headline'
        },
        {
          type: 'textbox',
          left: 200,
          top: 380,
          width: 800,
          fontSize: 28,
          fontFamily: 'Inter',
          fontWeight: '300',
          fill: 'rgba(255, 255, 255, 0.8)',
          text: 'Strategic solutions for growth',
          textAlign: 'center',
          name: 'Subtitle'
        },
        {
          type: 'rect',
          left: 400,
          top: 450,
          width: 400,
          height: 50,
          fill: '#3498db',
          rx: 25,
          ry: 25,
          name: 'CTA Button'
        },
        {
          type: 'textbox',
          left: 400,
          top: 460,
          width: 400,
          fontSize: 20,
          fontFamily: 'Inter',
          fontWeight: '600',
          fill: '#ffffff',
          text: 'Get Quote',
          textAlign: 'center',
          name: 'CTA Text'
        }
      ]
    }
  }
];