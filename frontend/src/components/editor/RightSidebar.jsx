import React, { useEffect, useState } from 'react';
import { useEditor } from '../../contexts/EditorContext.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Settings, Layers, AlignLeft, AlignCenter, AlignRight, Trash2, Copy, Lock, Unlock, Eye, EyeOff, Wand2, GripVertical, Group, Ungroup, CheckSquare, Square, ChevronDown, ChevronRight, Image as ImageIcon, Paintbrush, Sparkles, X } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { toast } from 'sonner';
import * as fabric from 'fabric';
import { allGoogleFonts, loadGoogleFont, searchFonts } from '../../utils/googleFonts';
import { filterPresets } from '../../config/filters';
import { textEffectPresets, applyTextEffect } from '../../config/textProperties';
import { shapeStylePresets, shapeBorderPresets, applyShapeStyle, applyBorderPreset, shadowPresets, applyShadowToShape } from '../../config/shapeProperties';

const LayerItem = ({ layer, index, selectedLayers, selectLayer, toggleLayerVisibility, toggleLayerLock, expandedGroups, toggleGroupExpansion, reorderLayers, ungroupLayer }) => {
  const isExpanded = expandedGroups.has(layer.id);
  const isSelected = selectedLayers.includes(layer.id);

  return (
    <Reorder.Item key={layer.id} value={layer}>
      <div
        className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
          isSelected
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-800'
        }`}
      >
        <Button
          onClick={(e) => {
            e.stopPropagation();
            selectLayer(layer.id);
          }}
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
        >
          {isSelected ? (
            <CheckSquare className="w-4 h-4 text-indigo-600" />
          ) : (
            <Square className="w-4 h-4 text-slate-400" />
          )}
        </Button>
        
        {layer.isGroup && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggleGroupExpansion(layer.id);
            }}
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </Button>
        )}
        
        <GripVertical className="w-4 h-4 text-slate-400 cursor-grab active:cursor-grabbing" />
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {layer.name}
            {layer.isGroup && ` (${layer.children.length})`}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{layer.type}</p>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            toggleLayerVisibility(index);
          }}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            toggleLayerLock(index);
          }}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </Button>
        {layer.isGroup && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              ungroupLayer(layer.id);
            }}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Ungroup"
          >
            <Ungroup className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {layer.isGroup && isExpanded && layer.children.length > 0 && (
        <div className="ml-4 mt-2 space-y-2">
          {layer.children.map((childLayer, childIndex) => (
            <LayerItem
              key={childLayer.id}
              layer={childLayer}
              index={index}
              selectedLayers={selectedLayers}
              selectLayer={selectLayer}
              toggleLayerVisibility={toggleLayerVisibility}
              toggleLayerLock={toggleLayerLock}
              expandedGroups={expandedGroups}
              toggleGroupExpansion={toggleGroupExpansion}
              reorderLayers={reorderLayers}
              ungroupLayer={ungroupLayer}
            />
          ))}
        </div>
      )}
    </Reorder.Item>
  );
};

const RightSidebar = () => {
  const { 
    canvas, 
    activeObject, 
    layers, 
    saveToHistory, 
    updateLayers, 
    // groupObjects, 
    // ungroupObjects,
    selectedLayers,
    selectLayer,
    selectAllLayers,
    clearLayerSelection,
    groupSelectedLayers,
    expandedGroups,
    toggleGroupExpansion,
    ungroupLayer,
    applyFilterPreset,
    removeFilters,
    activeFilterPreset,
    setActiveFilterPreset
  } = useEditor();
  const [fontSearch, setFontSearch] = useState('');
  const [filteredFonts, setFilteredFonts] = useState(allGoogleFonts.slice(0, 100));
  const [maskText, setMaskText] = useState('TEXT');
  const [recentColors, setRecentColors] = useState(['#000000']);
  const [properties, setProperties] = useState({
    fill: '#000000',
    stroke: '#000000',
    strokeWidth: 0,
    opacity: 100,
    fontSize: 32,
    fontFamily: 'Inter',
    fontWeight: 'normal',
    textAlign: 'left',
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0
  });

  useEffect(() => {
    if (activeObject) {
      const newProperties = {
        fill: activeObject.fill || '#000000',
        stroke: activeObject.stroke || '#000000',
        strokeWidth: activeObject.strokeWidth || 0,
        opacity: (activeObject.opacity || 1) * 100,
        fontSize: activeObject.fontSize || 32,
        fontFamily: activeObject.fontFamily || 'Inter',
        fontWeight: activeObject.fontWeight || 'normal',
        textAlign: activeObject.textAlign || 'left',
        brightness: activeObject.brightness || 0,
        contrast: activeObject.contrast || 0,
        saturation: activeObject.saturation || 0,
        blur: activeObject.blur || 0
      };
      setProperties(newProperties);
      
      // If it's a text object, set the font search to the current font
      if (activeObject.type === 'textbox' && activeObject.fontFamily) {
        setFontSearch(activeObject.fontFamily);
      } else {
        setFontSearch('');
      }
      
      // Check if filters are applied
      if (activeObject.type === 'image' && activeObject.filters && activeObject.filters.length > 0) {
        // Don't reset activeFilterPreset if there are existing filters
        // It means a preset was applied
      } else {
        setActiveFilterPreset(null);
      }
    } else {
      setFontSearch('');
      setActiveFilterPreset(null);
    }
  }, [activeObject, setActiveFilterPreset]);

  useEffect(() => {
    let filtered;
    if (fontSearch) {
      filtered = searchFonts(fontSearch, allGoogleFonts).slice(0, 100);
      // If the search matches the current font exactly, put it at the top
      if (activeObject && activeObject.type === 'textbox' && activeObject.fontFamily) {
        const currentFont = activeObject.fontFamily;
        if (currentFont.toLowerCase().includes(fontSearch.toLowerCase())) {
          filtered = [currentFont, ...filtered.filter(font => font !== currentFont)];
        }
      }
    } else {
      filtered = allGoogleFonts.slice(0, 100);
    }
    setFilteredFonts(filtered);
  }, [fontSearch, activeObject]);

  const updateProperty = async (key, value) => {
    if (activeObject && canvas) {
      if (key === 'fontFamily') {
        await loadGoogleFont(value);
        activeObject.set(key, value);
        activeObject.set('dirty', true);
        canvas.requestRenderAll();
      } else if (key === 'opacity') {
        activeObject.set(key, value / 100);
      } else if (['brightness', 'contrast', 'saturation', 'blur'].includes(key)) {
        activeObject.set(key, value);
        applyFilters();
      } else {
        activeObject.set(key, value);
      }
      
      // Update recent colors when fill or stroke color is changed
      if ((key === 'fill' || key === 'stroke') && typeof value === 'string' && value.startsWith('#')) {
        setRecentColors([value]);
      }
      
      canvas.renderAll();
      setProperties(prev => ({ ...prev, [key]: value }));
      saveToHistory();
    }
  };

  const applyFilters = () => {
    if (activeObject && activeObject.type === 'image') {
      const filterArray = [];
      
      if (properties.brightness !== 0) {
        filterArray.push(new fabric.filters.Brightness({ brightness: properties.brightness / 100 }));
      }
      
      if (properties.contrast !== 0) {
        filterArray.push(new fabric.filters.Contrast({ contrast: properties.contrast / 100 }));
      }
      
      if (properties.saturation !== 0) {
        filterArray.push(new fabric.filters.Saturation({ saturation: properties.saturation / 100 }));
      }
      
      if (properties.blur > 0) {
        filterArray.push(new fabric.filters.Blur({ blur: properties.blur / 100 }));
      }
      
      activeObject.filters = filterArray;
      activeObject.applyFilters();
      canvas.renderAll();
    }
  };

  const deleteObject = () => {
    if (activeObject && canvas) {
      canvas.remove(activeObject);
      canvas.renderAll();
      updateLayers();
      saveToHistory();

    }
  };

  const duplicateObject = () => {
    if (activeObject && canvas) {
      try {
        // Create a simplified copy using toObject and fromObject
        const objectData = activeObject.toObject();
        
        // Create new object from the data
        fabric.util.enlivenObjects([objectData], (objects) => {
          const cloned = objects[0];
          cloned.set({
            left: cloned.left + 20,
            top: cloned.top + 20,
          });
          canvas.add(cloned);
          canvas.setActiveObject(cloned);
          canvas.renderAll();
          updateLayers();
          saveToHistory();
        });
      } catch (error) {
        console.error('Duplicate failed:', error);
        toast.error('Failed to duplicate object');
      }
    }
  };

  const setAlignment = (align) => {
    updateProperty('textAlign', align);
  };



  const toggleLayerVisibility = (index) => {
    if (canvas) {
      const objects = canvas.getObjects();
      const obj = objects[objects.length - 1 - index];
      obj.set('visible', !obj.visible);
      canvas.renderAll();
      updateLayers();
    }
  };

  const toggleLayerLock = (index) => {
    if (canvas) {
      const objects = canvas.getObjects();
      const obj = objects[objects.length - 1 - index];
      obj.set('selectable', !obj.selectable);
      obj.set('evented', !obj.evented);
      canvas.renderAll();
      updateLayers();
    }
  };

  const reorderLayers = (newLayers) => {
    if (canvas) {
      const objects = canvas.getObjects();
      
      // Create mapping from current objects to their layer info
      const objectMap = new Map();
      objects.forEach((obj, index) => {
        const layerId = `layer-${objects.length - 1 - index}`; // Match the layer ID generation in updateLayers
        objectMap.set(layerId, obj);
      });
      
      // Map new layer order to objects (layers are top-to-bottom, canvas is bottom-to-top)
      const reorderedObjects = [];
      for (let i = newLayers.length - 1; i >= 0; i--) {
        const obj = objectMap.get(newLayers[i].id);
        if (obj) {
          reorderedObjects.push(obj);
        }
      }
      
      // Clear and re-add in new order
      canvas.clear();
      reorderedObjects.forEach(obj => canvas.add(obj));
      canvas.renderAll();
      updateLayers();
      saveToHistory();
    }
  };

const setAsBackground = () => {
    if (activeObject && activeObject.type === 'image' && canvas) {
      const imgElement = activeObject.getElement();
      
      fabric.FabricImage.fromURL(imgElement.src, { crossOrigin: 'anonymous' }).then((img) => {
        const canvasWidth = canvas.width || 1080;
        const canvasHeight = canvas.height || 1080;
        
        const actualCanvasWidth = canvasWidth / (canvas.getZoom() || 1);
        const actualCanvasHeight = canvasHeight / (canvas.getZoom() || 1);
        
        const imgWidth = img.width;
        const imgHeight = img.height;
        
        const scaleX = actualCanvasWidth / imgWidth;
        const scaleY = actualCanvasHeight / imgHeight;
        const scale = Math.max(scaleX, scaleY);
        
        // Calculate position to center the image
        const left = (actualCanvasWidth - (imgWidth * scale)) / 2;
        const top = (actualCanvasHeight - (imgHeight * scale)) / 2;
        
        // Set image properties for background
        img.set({
          left: left,
          top: top,
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
          isBackgroundImage: true,
          objectCaching: false
        });
        
        // Remove existing background if any
        const existingBg = canvas.getObjects().find(obj => obj.isBackgroundImage);
        if (existingBg) {
          canvas.remove(existingBg);
        }
        
        // Remove the original active object
        canvas.remove(activeObject);
        
      
        canvas.add(img);
        canvas.sendObjectToBack(img);
        
        canvas.discardActiveObject();
        canvas.renderAll();
        updateLayers();
        saveToHistory();
      });
    }
  };

  const makeBackgroundEditable = () => {
    if (canvas) {
      const backgroundImg = canvas.getObjects().find(obj => obj.isBackgroundImage);
      if (backgroundImg) {
        backgroundImg.set({
          selectable: true,
          evented: true,
          isBackgroundImage: false
        });
        canvas.setActiveObject(backgroundImg);
        canvas.renderAll();
        updateLayers();
        saveToHistory();
      }
    }
  };
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 h-screen border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col"
    >
      <Tabs defaultValue="properties" className="flex-1 flex flex-col h-full">
        <TabsList className="grid grid-cols-2 m-4 h-auto p-1 bg-slate-100 dark:bg-slate-800 flex-shrink-0">
          <TabsTrigger value="properties" className="flex gap-2 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Properties</span>
          </TabsTrigger>
          <TabsTrigger value="layers" className="flex gap-2 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <Layers className="w-4 h-4" />
            <span className="text-sm">Layers</span>
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 px-4 pb-6 overflow-y-auto">
          <TabsContent value="properties" className="mt-0 space-y-6">
            {canvas && canvas.getObjects().find(obj => obj.isBackgroundImage) && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Button 
                  onClick={() => makeBackgroundEditable()}
                  variant="outline" 
                  className="w-full gap-2"
                >
                  Make Background Editable
                </Button>
              </div>
            )}
            {activeObject ? (
              <>
                <div className="flex gap-2">
                  <Button onClick={deleteObject} variant="outline" size="sm" className="flex-1 gap-2 text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>



                {activeObject.type === 'textbox' && (
                  <>
                    <div className="space-y-2">
                      <Label>Font Family</Label>
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Search fonts..."
                            value={fontSearch}
                            onChange={(e) => setFontSearch(e.target.value)}
                            className="text-sm"
                          />
                          {fontSearch && (
                            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {filteredFonts.slice(0, 10).map((font) => (
                                <button
                                  key={font}
                                  onClick={() => {
                                    updateProperty('fontFamily', font);
                                    setFontSearch('');
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                                  style={{ fontFamily: font }}
                                >
                                  {font}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <Select value={properties.fontFamily} onValueChange={(val) => updateProperty('fontFamily', val)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-80 overflow-y-auto">
                            {allGoogleFonts.slice(0, 50).map((font) => (
                              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                                {font}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <div className="flex gap-2">
                        <Slider
                          value={[properties.fontSize]}
                          onValueChange={(val) => updateProperty('fontSize', val[0])}
                          min={8}
                          max={200}
                          step={1}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={properties.fontSize}
                          onChange={(e) => updateProperty('fontSize', parseInt(e.target.value))}
                          className="w-16"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Font Weight</Label>
                      <Select value={properties.fontWeight} onValueChange={(val) => updateProperty('fontWeight', val)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="600">Semi Bold</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Text Alignment</Label>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setAlignment('left')}
                          variant={properties.textAlign === 'left' ? 'default' : 'outline'}
                          size="icon"
                          className="flex-1"
                        >
                          <AlignLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => setAlignment('center')}
                          variant={properties.textAlign === 'center' ? 'default' : 'outline'}
                          size="icon"
                          className="flex-1"
                        >
                          <AlignCenter className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => setAlignment('right')}
                          variant={properties.textAlign === 'right' ? 'default' : 'outline'}
                          size="icon"
                          className="flex-1"
                        >
                          <AlignRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Text Effects</Label>
                      <Select onValueChange={(effect) => {
                        applyTextEffect(activeObject, effect);
                        canvas.renderAll();
                        saveToHistory();
                        toast.success(`${textEffectPresets[effect].name} applied!`);
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose effect" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(textEffectPresets).map(([key, preset]) => (
                            <SelectItem key={key} value={key}>
                              {preset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {activeObject.type !== 'textbox' && (
                  <div className="space-y-2">
                    <Label>Shape Style</Label>
                    <Select onValueChange={(style) => {
                      applyShapeStyle(activeObject, style);
                      canvas.renderAll();
                      saveToHistory();
                      toast.success(`${shapeStylePresets[style].name} applied!`);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose style" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(shapeStylePresets).map(([key, preset]) => (
                          <SelectItem key={key} value={key}>
                            {preset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Fill Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={typeof properties.fill === 'string' ? properties.fill : '#000000'}
                      onChange={(e) => updateProperty('fill', e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={typeof properties.fill === 'string' ? properties.fill : '#000000'}
                      onChange={(e) => updateProperty('fill', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-slate-500">Recent Color</div>
                    <div className="grid grid-cols-1 gap-1 w-8">
                      {recentColors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => updateProperty('fill', color)}
                          className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                            properties.fill === color ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {activeObject.type !== 'textbox' && (
                  <div className="space-y-2">
                    <Label>Stroke Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={properties.stroke}
                        onChange={(e) => updateProperty('stroke', e.target.value)}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={properties.stroke}
                        onChange={(e) => updateProperty('stroke', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-slate-500">Recent Color</div>
                      <div className="grid grid-cols-1 gap-1 w-8">
                        {recentColors.map((color, index) => (
                          <button
                            key={index}
                            onClick={() => updateProperty('stroke', color)}
                            className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                              properties.stroke === color ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-300'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeObject.type !== 'textbox' && (
                  <div className="space-y-2">
                    <Label>Stroke Width</Label>
                    <div className="flex gap-2">
                      <Slider
                        value={[properties.strokeWidth]}
                        onValueChange={(val) => updateProperty('strokeWidth', val[0])}
                        min={0}
                        max={20}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={properties.strokeWidth}
                        onChange={(e) => updateProperty('strokeWidth', parseInt(e.target.value))}
                        className="w-16"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Opacity</Label>
                  <div className="flex gap-2">
                    <Slider
                      value={[properties.opacity]}
                      onValueChange={(val) => updateProperty('opacity', val[0])}
                      min={0}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={Math.round(properties.opacity)}
                      onChange={(e) => updateProperty('opacity', parseInt(e.target.value))}
                      className="w-16"
                    />
                  </div>
                </div>

                {activeObject.type !== 'textbox' && (
                  <div className="space-y-2">
                    <Label>Shadow Effects</Label>
                    <Select onValueChange={(shadowType) => {
                      if (shadowType === 'none') {
                        activeObject.set('shadow', null);
                      } else {
                        applyShadowToShape(activeObject, shadowPresets[shadowType]);
                      }
                      canvas.renderAll();
                      saveToHistory();
                      toast.success('Shadow applied!');
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose shadow" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(shadowPresets).map(([key, preset]) => (
                          <SelectItem key={key} value={key}>
                            {preset.name || key.charAt(0).toUpperCase() + key.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {activeObject.type === 'image' && (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Image Actions</Label>
                        <div className="space-y-2">
                          {activeObject.isTemplateImage && (
                            <div className="space-y-2">
                              <label htmlFor="replace-template-image" className="block">
                                <Button 
                                  variant="outline" 
                                  className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 border-0"
                                  asChild
                                >
                                  <div className="cursor-pointer">
                                    <ImageIcon className="w-4 h-4" />
                                    Replace Template Image
                                  </div>
                                </Button>
                                <input
                                  id="replace-template-image"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file && canvas && activeObject) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        fabric.FabricImage.fromURL(event.target.result, { crossOrigin: 'anonymous' }).then((img) => {
                                          // Calculate the current template image's display dimensions
                                          const templateWidth = activeObject.width * activeObject.scaleX;
                                          const templateHeight = activeObject.height * activeObject.scaleY;
                                          
                                          // Calculate scale to fit new image within template bounds
                                          const scaleX = templateWidth / img.width;
                                          const scaleY = templateHeight / img.height;
                                          const scale = Math.min(scaleX, scaleY); // Use min to ensure it fits within bounds
                                          
                                          // Set the new image properties to match template position and fit within bounds
                                          img.set({
                                            left: activeObject.left,
                                            top: activeObject.top,
                                            scaleX: scale,
                                            scaleY: scale,
                                            angle: activeObject.angle,
                                            opacity: activeObject.opacity,
                                            name: activeObject.name,
                                            isTemplateImage: true
                                          });
                                          
                                          // Replace the old image
                                          canvas.remove(activeObject);
                                          canvas.add(img);
                                          canvas.setActiveObject(img);
                                          canvas.renderAll();
                                          updateLayers();
                                          saveToHistory();
                                          toast.success('Template image replaced successfully!');
                                        });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          )}
                          <Button 
                            onClick={() => setAsBackground()}
                            variant="outline" 
                            className="w-full gap-2"
                          >
                            Set as Background
                          </Button>

                          {canvas && canvas.getObjects().find(obj => obj.isBackgroundImage) && (
  <Button 
    onClick={() => makeBackgroundEditable()}
    variant="outline" 
    className="w-full gap-2"
  >
    Make Background Editable
  </Button>
)}


                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Wand2 className="w-4 h-4" />
                        <Label className="font-semibold">Image Filters</Label>
                      </div>

                      <div className="space-y-2">
                        <Label>Brightness</Label>
                        <div className="flex gap-2">
                          <Slider
                            value={[properties.brightness]}
                            onValueChange={(val) => updateProperty('brightness', val[0])}
                            min={-100}
                            max={100}
                            step={1}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={properties.brightness}
                            onChange={(e) => updateProperty('brightness', parseInt(e.target.value))}
                            className="w-16"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Contrast</Label>
                        <div className="flex gap-2">
                          <Slider
                            value={[properties.contrast]}
                            onValueChange={(val) => updateProperty('contrast', val[0])}
                            min={-100}
                            max={100}
                            step={1}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={properties.contrast}
                            onChange={(e) => updateProperty('contrast', parseInt(e.target.value))}
                            className="w-16"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Saturation</Label>
                        <div className="flex gap-2">
                          <Slider
                            value={[properties.saturation]}
                            onValueChange={(val) => updateProperty('saturation', val[0])}
                            min={-100}
                            max={100}
                            step={1}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={properties.saturation}
                            onChange={(e) => updateProperty('saturation', parseInt(e.target.value))}
                            className="w-16"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Blur</Label>
                        <div className="flex gap-2">
                          <Slider
                            value={[properties.blur]}
                            onValueChange={(val) => updateProperty('blur', val[0])}
                            min={0}
                            max={100}
                            step={1}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={properties.blur}
                            onChange={(e) => updateProperty('blur', parseInt(e.target.value))}
                            className="w-16"
                          />
                        </div>
                      </div>

                      {/* Filter Presets */}
                      <div className="space-y-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <Label className="font-semibold">Filter Presets</Label>
                          </div>
                          {activeFilterPreset && (
                            <Button
                              onClick={removeFilters}
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs gap-1"
                            >
                              <X className="w-3 h-3" />
                              Reset
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                          {filterPresets.map((preset) => (
                            <motion.button
                              key={preset.name}
                              onClick={() => applyFilterPreset(preset)}
                              className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                                activeFilterPreset?.name === preset.name
                                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              title={preset.name}
                            >
                              <span className="text-2xl">{preset.icon}</span>
                              <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 text-center leading-tight">
                                {preset.name}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Select an object to edit properties</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="layers" className="mt-0 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Layers</h3>
              <div className="flex gap-1">
                <Button
                  onClick={selectAllLayers}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                >
                  Select All
                </Button>
                <Button
                  onClick={clearLayerSelection}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>
            
            {selectedLayers.length >= 2 && (
              <div className="flex gap-2 mb-3 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <Button
                  onClick={groupSelectedLayers}
                  size="sm"
                  className="flex-1 gap-2 h-8 text-xs"
                >
                  <Group className="w-3 h-3" />
                  Group Selected ({selectedLayers.length})
                </Button>
              </div>
            )}

            {layers.length > 0 ? (
              <Reorder.Group axis="y" values={layers} onReorder={reorderLayers} className="space-y-2">
                {layers.map((layer, index) => (
                  <LayerItem
                    key={layer.id}
                    layer={layer}
                    index={index}
                    selectedLayers={selectedLayers}
                    selectLayer={selectLayer}
                    toggleLayerVisibility={toggleLayerVisibility}
                    toggleLayerLock={toggleLayerLock}
                    expandedGroups={expandedGroups}
                    toggleGroupExpansion={toggleGroupExpansion}
                    reorderLayers={reorderLayers}
                    ungroupLayer={ungroupLayer}
                  />
                ))}
              </Reorder.Group>
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No layers yet</p>
              </div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </motion.div>
  );
};

export default RightSidebar;