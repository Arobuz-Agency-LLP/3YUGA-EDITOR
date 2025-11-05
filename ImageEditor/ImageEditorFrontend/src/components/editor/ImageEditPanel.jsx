import React, { useState, useEffect } from 'react';
import { useEditor } from '../../contexts/EditorContext.tsx';
import { ScrollArea } from '../ui/scroll-area';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Type, Image as ImageIcon, Edit3, Trash2, Eye, EyeOff, Plus, Copy, Move } from 'lucide-react';
import { toast } from 'sonner';
import { Textbox } from 'fabric';

const ImageEditPanel = () => {
  const { canvas, extractedElements, setExtractedElements, saveToHistory, updateLayers } = useEditor();
  const [editingText, setEditingText] = useState(null);

  // Sync text changes when edited directly on canvas
  useEffect(() => {
    if (!canvas) return;

    const handleTextChanged = (e) => {
      const changedObject = e.target;
      if (changedObject.isEditableText) {
        const element = extractedElements.texts.find(t => t.object === changedObject);
        if (element) {
          element.text = changedObject.text;
          setExtractedElements(prev => ({
            ...prev,
            texts: prev.texts.map(t => 
              t.object === changedObject ? { ...t, text: changedObject.text } : t
            )
          }));
        }
      }
    };

    const handleObjectRemoved = (e) => {
      const removedObject = e.target;
      if (removedObject.isEditableText) {
        setExtractedElements(prev => ({
          ...prev,
          texts: prev.texts.filter(t => t.object !== removedObject)
        }));
      }
    };

    canvas.on('text:changed', handleTextChanged);
    canvas.on('object:modified', handleTextChanged);
    canvas.on('before:path:created', handleTextChanged);
    canvas.on('object:removed', handleObjectRemoved);

    return () => {
      canvas.off('text:changed', handleTextChanged);
      canvas.off('object:modified', handleTextChanged);
      canvas.off('before:path:created', handleTextChanged);
      canvas.off('object:removed', handleObjectRemoved);
    };
  }, [canvas, extractedElements.texts, setExtractedElements]);

  const updateTextContent = (elementId, newText) => {
    const element = extractedElements.texts.find(t => t.id === elementId);
    if (element && element.object && canvas) {
      element.object.set('text', newText);
      element.text = newText;
      canvas.renderAll();
      saveToHistory();
      
      setExtractedElements(prev => ({
        ...prev,
        texts: prev.texts.map(t => t.id === elementId ? { ...t, text: newText } : t)
      }));
    }
  };

  const deleteElement = (elementId) => {
    const element = extractedElements.texts.find(t => t.id === elementId);
    
    if (element && element.object && canvas) {
      canvas.remove(element.object);
      canvas.renderAll();
      updateLayers();
      saveToHistory();
      
      setExtractedElements(prev => ({
        ...prev,
        texts: prev.texts.filter(t => t.id !== elementId)
      }));
      
      toast.success('Text element deleted');
    }
  };

  const duplicateElement = (elementId) => {
    const element = extractedElements.texts.find(t => t.id === elementId);
    
    if (element && element.object && canvas) {
      element.object.clone().then((cloned) => {
        cloned.set({
          left: (cloned.left || 0) + 20,
          top: (cloned.top || 0) + 20,
          isEditableText: true
        });
        
        canvas.add(cloned);
        canvas.bringObjectToFront(cloned);
        canvas.setActiveObject(cloned);
        
        const newElement = {
          id: `text-${Date.now()}-${Math.random()}`,
          object: cloned,
          text: element.text,
          bbox: { ...element.bbox, x: element.bbox.x + 20, y: element.bbox.y + 20 }
        };
        
        setExtractedElements(prev => ({
          ...prev,
          texts: [...prev.texts, newElement]
        }));
        
        canvas.renderAll();
        updateLayers();
        saveToHistory();
        toast.success('Text element duplicated');
      });
    }
  };

  const toggleVisibility = (elementId) => {
    const element = extractedElements.texts.find(t => t.id === elementId);
    
    if (element && element.object && canvas) {
      const newVisibility = !element.object.visible;
      element.object.set('visible', newVisibility);
      canvas.renderAll();
      saveToHistory();
      
      toast.success(`Text ${newVisibility ? 'shown' : 'hidden'}`);
    }
  };

  const selectElement = (element) => {
    if (element.object && canvas) {
      canvas.setActiveObject(element.object);
      canvas.renderAll();
    }
  };

  const enableDirectEditing = (element) => {
    if (element.object && canvas) {
      canvas.setActiveObject(element.object);
      setTimeout(() => {
        element.object.enterEditing();
        element.object.selectAll();
      }, 100);
      canvas.renderAll();
    }
  };

  const moveToFront = (elementId) => {
    const element = extractedElements.texts.find(t => t.id === elementId);
    if (element && element.object && canvas) {
      canvas.bringObjectToFront(element.object);
      canvas.renderAll();
      updateLayers();
      saveToHistory();
      toast.success('Text moved to front');
    }
  };

  const addNewTextOverlay = () => {
    if (!canvas) return;
    
    let left = 100, top = 100;
    
    if (extractedElements.sourceImage) {
      const imgBounds = extractedElements.sourceImage.getBoundingRect();
      left = imgBounds.left + 50;
      top = imgBounds.top + 50;
    }
    
    const textbox = new Textbox('New Text', {
      left,
      top,
      width: 150,
      fontSize: 24,
      fill: '#000000',
      fontFamily: 'Arial',
      editable: true,
      selectable: true,
      evented: true,
      hasControls: true,
      hasBorders: true,
      cornerStyle: 'circle',
      cornerSize: 16,
      cornerColor: '#4f46e5',
      borderColor: '#4f46e5',
      transparentCorners: false,
      name: 'Text: New Text',
      isEditableText: true
    });
    
    canvas.add(textbox);
    canvas.bringObjectToFront(textbox);
    canvas.setActiveObject(textbox);
    
    const newTextElement = {
      id: `text-${Date.now()}-${Math.random()}`,
      object: textbox,
      text: 'New Text',
      bbox: { x: 50, y: 50, width: 150, height: 24 }
    };
    
    setExtractedElements(prev => ({
      ...prev,
      texts: [...prev.texts, newTextElement]
    }));
    
    canvas.renderAll();
    updateLayers();
    saveToHistory();
    
    // Auto-enter editing mode
    setTimeout(() => {
      textbox.enterEditing();
      textbox.selectAll();
    }, 100);
    
    toast.success('New text overlay added!');
  };

  const clearAllOverlays = () => {
    extractedElements.texts.forEach(element => {
      if (element.object && canvas) {
        canvas.remove(element.object);
      }
    });
    
    if (extractedElements.sourceImage) {
      extractedElements.sourceImage.set('selectable', true);
      extractedElements.sourceImage.set('evented', true);
    }
    
    setExtractedElements({ texts: [], objects: [], sourceImage: null });
    
    canvas?.renderAll();
    updateLayers();
    saveToHistory();
    toast.success('All text overlays cleared');
  };

  if (!extractedElements.texts.length && !extractedElements.sourceImage) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Click "Edit Image" on an image to extract editable text</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Edit3 className="w-4 h-4 text-indigo-600" />
          <h3 className="font-semibold text-sm">Image Text Editor</h3>
        </div>

        {/* Add New Text Button */}
        <Button
          onClick={addNewTextOverlay}
          className="w-full gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Add Text Overlay
        </Button>

        {/* Text Elements */}
        {extractedElements.texts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              <Label className="text-sm font-medium">Text Overlays ({extractedElements.texts.length})</Label>
            </div>
            
            {extractedElements.texts.map((textElement, index) => (
              <div key={textElement.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">Text {index + 1}</span>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => toggleVisibility(textElement.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      title="Toggle visibility"
                    >
                      {textElement.object?.visible !== false ? 
                        <Eye className="w-3 h-3" /> : 
                        <EyeOff className="w-3 h-3" />
                      }
                    </Button>
                    <Button
                      onClick={() => duplicateElement(textElement.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => moveToFront(textElement.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      title="Bring to front"
                    >
                      <Move className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => deleteElement(textElement.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                {editingText === textElement.id ? (
                  <div className="space-y-2">
                    <Input
                      value={textElement.text}
                      onChange={(e) => updateTextContent(textElement.id, e.target.value)}
                      className="text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setEditingText(null);
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingText(null)}
                        size="sm"
                        className="h-7 text-xs"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-slate-700 dark:text-slate-300 break-words">
                      "{textElement.text}"
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      <Button
                        onClick={() => setEditingText(textElement.id)}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit Here
                      </Button>
                      <Button
                        onClick={() => enableDirectEditing(textElement)}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        Edit on Canvas
                      </Button>
                      <Button
                        onClick={() => selectElement(textElement)}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs col-span-2"
                      >
                        Select & Style
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Clear All Button */}
        {extractedElements.texts.length > 0 && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              onClick={clearAllOverlays}
              variant="outline"
              size="sm"
              className="w-full text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              Clear All Overlays
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ImageEditPanel;