import { STICKER_APIS, LOCAL_STICKERS, CACHE_CONFIG, PERFORMANCE_CONFIG } from '../config/stickers-config';

class StickerService {
  constructor() {
    this.cache = new Map();
  }

  setCache(key, data) {
    if (this.cache.size >= CACHE_CONFIG.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (typeof firstKey === 'string') this.cache.delete(firstKey);
    }
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > CACHE_CONFIG.ttl) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  getLocalStickers(category = null) {
    if (category && LOCAL_STICKERS[category]) {
      return LOCAL_STICKERS[category].map(sticker => ({
        ...sticker,
        thumbnail: this.generateSvgDataUrl(sticker.svg),
        source: 'local'
      }));
    }

    return Object.entries(LOCAL_STICKERS).flatMap(([cat, stickers]) =>
      (stickers || []).map(sticker => ({
        ...sticker,
        category: cat,
        thumbnail: this.generateSvgDataUrl(sticker.svg),
        source: 'local'
      }))
    );
  }

  generateSvgDataUrl(svgContent, size = PERFORMANCE_CONFIG.thumbnailSize) {
    if (!svgContent) return '';
    const svg = `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  async fetchIconifyIcons(collection = 'mdi', search = '', limit = 20) {
    const cacheKey = `iconify_${collection}_${search}_${limit}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const listUrl = `${STICKER_APIS.ICONIFY.baseUrl}/collection?id=${collection}&pretty=1`;
      const listResponse = await fetch(listUrl);
      const collectionData = await listResponse.json();

      let icons = Object.keys(collectionData.icons || {});
      if (search) {
        icons = icons.filter(icon => icon.toLowerCase().includes(search.toLowerCase()));
      }
      icons = icons.slice(0, limit);

      const iconPromises = icons.map(async (iconName) => {
        const svgUrl = `${STICKER_APIS.ICONIFY.baseUrl}/${collection}/${iconName}.svg`;
        try {
          const svgResponse = await fetch(svgUrl);
          const svgContent = await svgResponse.text();
          return {
            id: `${collection}-${iconName}`,
            name: iconName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            svg: svgContent,
            thumbnail: `${STICKER_APIS.ICONIFY.baseUrl}/${collection}/${iconName}.svg`,
            source: 'iconify',
            collection
          };
        } catch (e) {
          return null;
        }
      });

      const results = (await Promise.all(iconPromises)).filter(Boolean);
      this.setCache(cacheKey, results);
      return results;
    } catch (e) {
      return [];
    }
  }

  async searchStickers(query = '', category = '', source = 'all', limit = 20) {
    const results = [];
    const localStickers = this.getLocalStickers(category);
    if (query) {
      const filteredLocal = localStickers.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
      results.push(...filteredLocal.slice(0, Math.floor(limit / 2)));
    } else {
      results.push(...localStickers.slice(0, Math.floor(limit / 2)));
    }

    if (source === 'all' || source === 'iconify') {
      try {
        const iconifyResults = await this.fetchIconifyIcons('mdi', query, Math.floor(limit / 2));
        results.push(...iconifyResults);
      } catch {}
    }

    return results.slice(0, limit);
  }
}

export default new StickerService();


