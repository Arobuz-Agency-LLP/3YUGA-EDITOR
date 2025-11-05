import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid3X3, Loader2, Download, Star, Sparkles } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { useEditor } from '../../contexts/EditorContext.tsx';
import { FabricImage } from 'fabric';
import { toast } from 'sonner';
import stickerService from '../../services/sticker-service';

const StickersPanel = ({ isOpen, onClose }) => {
  const { canvas, saveToHistory, updateLayers } = useEditor();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories] = useState(stickerService.getCategories());
  const searchTimeoutRef = useRef(null);
  const observerRef = useRef(null);

  // Debounced search
  const debouncedSearch = useCallback((query, category) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await stickerService.searchStickers(query, category, 'all', 40);
        setStickers(results);
      } catch (error) {
        console.error('Search failed:', error);
        toast.error('Failed to load stickers');
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  // Load initial stickers
  useEffect(() => {
    debouncedSearch('', '');
  }, [debouncedSearch]);

  // Handle search and category changes
  useEffect(() => {
    debouncedSearch(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory, debouncedSearch]);

  // Add sticker to canvas
  const addStickerToCanvas = async (sticker) => {
    if (!canvas) return;

    try {
      let imageUrl;
      
      if (sticker.source === 'local') {
        // For local SVG stickers, use the data URL
        imageUrl = sticker.thumbnail;
      } else {
        // For external stickers, use the thumbnail or svg URL
        imageUrl = sticker.thumbnail || sticker.svg;
      }

      const img = await FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' });
      
      // Scale to reasonable size
      const maxSize = 150;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      
      img.set({
        left: canvas.width / 2 - (img.width * scale) / 2,
        top: canvas.height / 2 - (img.height * scale) / 2,
        scaleX: scale,
        scaleY: scale,
        cornerStyle: 'circle',
        cornerSize: 12,
        transparentCorners: false,
        cornerColor: '#4f46e5',
        borderColor: '#4f46e5'
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      updateLayers();
      saveToHistory();
      
      toast.success(`${sticker.name} added to canvas!`);
    } catch (error) {
      console.error('Failed to add sticker:', error);
      toast.error('Failed to add sticker');
    }
  };

  // Lazy loading intersection observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              observerRef.current.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -300 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-xl z-50"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Elements
              </h2>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-slate-700"
            >
              ✕
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search stickers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedCategory('')}
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs gap-1"
              >
                <span>{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Stickers Grid */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                <span className="ml-2 text-sm text-slate-500">Loading stickers...</span>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {stickers.map((sticker, index) => (
                  <motion.div
                    key={`${sticker.source}-${sticker.id}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addStickerToCanvas(sticker)}
                    className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 cursor-pointer transition-all duration-200 p-2 group"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      {sticker.source === 'local' ? (
                        <div
                          className="w-full h-full"
                          dangerouslySetInnerHTML={{ __html: sticker.svg }}
                        />
                      ) : (
                        <img
                          data-src={sticker.thumbnail}
                          alt={sticker.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          ref={(el) => {
                            if (el && observerRef.current) {
                              observerRef.current.observe(el);
                            }
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {sticker.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && stickers.length === 0 && (
              <div className="text-center py-12">
                <Grid3X3 className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 text-sm">No stickers found</p>
                <p className="text-slate-400 text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{stickers.length} elements</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>Premium quality</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StickersPanel;