import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useEditor } from '../../contexts/EditorContext.tsx';
import { FabricImage, Path, Circle, Rect, Polygon, Textbox } from 'fabric';
import { toast } from 'sonner';
import { stickerLibrary, getAllStickers, stickerCategories } from '../../data/stickers';

const ElementsPanel = () => {
  const { canvas, saveToHistory, updateLayers } = useEditor();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = stickerCategories;

  // Filter stickers based on search and category
  const filteredStickers = useMemo(() => {
    let allStickers = getAllStickers();
    
    // Filter by category
    if (selectedCategory !== 'all') {
      allStickers = allStickers.filter(s => s.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      allStickers = allStickers.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return allStickers;
  }, [searchQuery, selectedCategory]);

  // ➕ Add sticker to Fabric.js canvas
  const addStickerToCanvas = async (sticker) => {
    if (!canvas) return;
    try {
      let fabricObject;

      if (sticker.type === 'emoji') {
        // Create emoji as text object
        fabricObject = new Textbox(sticker.emoji, {
          left: canvas.width / 2 - 50,
          top: canvas.height / 2 - 50,
          fontSize: 80,
          fontFamily: 'Arial, sans-serif',
          fill: '#000000',
          selectable: true,
        });
      } else if (sticker.type === 'svg' && sticker.data) {
        // Create SVG Path
        const pathOptions = {
          left: canvas.width / 2 - 50,
          top: canvas.height / 2 - 50,
          scaleX: 0.5,
          scaleY: 0.5,
        };

        // Set fill if provided
        if (sticker.fill && sticker.fill !== 'none') {
          pathOptions.fill = sticker.fill;
        }

        // Set stroke properties if provided
        if (sticker.stroke) {
          pathOptions.stroke = sticker.stroke;
          pathOptions.strokeWidth = sticker.strokeWidth || 3;
        }

        fabricObject = new Path(sticker.data, pathOptions);
      } else {
        throw new Error('Invalid sticker data');
      }

      fabricObject.set({
        cornerStyle: 'circle',
        cornerSize: 12,
        transparentCorners: false,
        cornerColor: '#4f46e5',
        borderColor: '#4f46e5',
      });

      canvas.add(fabricObject);
      canvas.setActiveObject(fabricObject);
      canvas.renderAll();
      updateLayers();
      saveToHistory();

      toast.success(`${sticker.name} added!`);
    } catch (err) {
      console.error('Add to canvas failed:', err);
      toast.error('Failed to add sticker.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Stickers & Elements
        </h3>
        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
          {filteredStickers.length} items
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search stickers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-9 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-1">
        {categories.map((c) => (
          <Button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            variant={selectedCategory === c.id ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs gap-1"
          >
            <span>{c.icon}</span>
            {c.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filteredStickers.map((sticker, i) => (
          <motion.div
            key={sticker.id || i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addStickerToCanvas(sticker)}
            className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 cursor-pointer transition-all duration-200 p-3 group relative flex items-center justify-center"
          >
            {sticker.type === 'emoji' ? (
              <div className="text-6xl flex items-center justify-center h-full">
                {sticker.emoji}
              </div>
            ) : sticker.type === 'svg' ? (
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full"
              >
                <path
                  d={sticker.data}
                  fill={sticker.fill}
                  stroke={sticker.stroke}
                  strokeWidth={sticker.strokeWidth}
                />
              </svg>
            ) : null}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-medium text-center p-1">
                {sticker.name}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredStickers.length === 0 && (
        <div className="text-center py-8 text-sm text-slate-500">
          No stickers found. Try another search.
        </div>
      )}
    </div>
  );
};

export default ElementsPanel;
