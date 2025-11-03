import React, { useState, useEffect } from 'react';
import { useEditor } from '../../contexts/EditorContext.tsx';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { Edit3, Save, X, Image as ImageIcon, Type, Package, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import * as fabric from 'fabric';
import { processImageForEditing } from '../../utils/canvasControls';

const EditableApiResponse = () => {
  const { canvas, activeObject, updateLayers, saveToHistory } = useEditor();
  const [editingWordIndex, setEditingWordIndex] = useState(null);
  const [editedWords, setEditedWords] = useState([]);
  const [busy, setBusy] = useState(false);

  // Get the API response from active object
  const apiResponse = activeObject && activeObject.type === 'image' && activeObject._ocrPayload 
    ? activeObject._ocrPayload 
    : null;

  // Initialize edited words from API response
  useEffect(() => {
    if (apiResponse && apiResponse.text && apiResponse.text.words) {
      setEditedWords([...apiResponse.text.words]);
    } else {
      setEditedWords([]);
    }
    setEditingWordIndex(null);
  }, [apiResponse, activeObject]);

  if (!apiResponse) {
    // Check if there's an image selected that can be processed
    if (activeObject && activeObject.type === 'image' && !activeObject.isBackgroundImage) {
      const runDetect = async () => {
        if (!canvas) return;
        try {
          setBusy(true);
          await processImageForEditing(activeObject, canvas, updateLayers, saveToHistory);
          // Force re-render by updating state
          setBusy(false);
        } catch (error) {
          setBusy(false);
        }
      };
      
      return (
        <div className="text-center py-8">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
            This image hasn't been processed yet.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Process the image to make it editable and view the API response.
          </p>
          <Button
            onClick={runDetect}
            disabled={busy}
            className="gap-2"
          >
            <Wand2 className="w-4 h-4" />
            {busy ? 'Processing...' : 'Process Image'}
          </Button>
        </div>
      );
    }
    
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        <p className="text-sm">Select an image with API response to edit</p>
        <p className="text-xs mt-2">Process an image first to view and edit the API response</p>
      </div>
    );
  }

  const words = apiResponse.text?.words || [];
  const objects = apiResponse.objects || [];
  const baseImage = apiResponse.baseImage || apiResponse._raw?.baseImage;
  const imageSize = apiResponse.imageSize || apiResponse._raw?.imageSize || {};

  const handleWordEdit = (index, field, value) => {
    const updated = [...editedWords];
    if (field === 'text') {
      updated[index] = { ...updated[index], text: value };
    } else if (field.startsWith('bbox.')) {
      const bboxField = field.split('.')[1]; // e.g., 'x', 'y', 'width', 'height'
      updated[index] = { 
        ...updated[index], 
        bbox: { 
          ...updated[index].bbox, 
          [bboxField]: parseFloat(value) || 0 
        }
      };
    }
    setEditedWords(updated);
  };

  const saveWordEdit = (index) => {
    if (!canvas || !activeObject) return;

    const editedWord = editedWords[index];
    const originalWord = words[index];
    
    // Find the corresponding textbox on canvas
    const textbox = canvas.getObjects().find(obj => 
      obj.isOCRText && 
      obj.ocrData && 
      obj.ocrData.text === originalWord.text &&
      Math.abs(obj.left - (activeObject.left + originalWord.bbox.x * activeObject.scaleX)) < 5 &&
      Math.abs(obj.top - (activeObject.top + originalWord.bbox.y * activeObject.scaleY)) < 5
    );

    if (textbox) {
      // Update textbox text
      if (editedWord.text !== originalWord.text) {
        textbox.set('text', editedWord.text);
      }

      // Update position if bbox changed
      if (editedWord.bbox && originalWord.bbox) {
        const scaleX = activeObject.scaleX || 1;
        const scaleY = activeObject.scaleY || 1;
        const newX = activeObject.left + (editedWord.bbox.x * scaleX);
        const newY = activeObject.top + (editedWord.bbox.y * scaleY);
        const newWidth = Math.max(editedWord.bbox.width * scaleX, 50);
        const newHeight = editedWord.bbox.height * scaleY;

        textbox.set({
          left: newX,
          top: newY,
          width: newWidth,
          fontSize: Math.max(14, newHeight * 0.7)
        });
      }

      // Update ocrData
      textbox.ocrData = editedWord;

      canvas.renderAll();
      updateLayers();
      saveToHistory();

      // Update the stored payload
      activeObject._ocrPayload.text.words[index] = editedWord;
      
      setEditingWordIndex(null);
      toast.success('Word updated successfully');
    } else {
      toast.error('Could not find corresponding textbox on canvas');
    }
  };

  const cancelEdit = () => {
    setEditedWords([...words]);
    setEditingWordIndex(null);
  };

  const applyBaseImage = () => {
    if (!canvas || !activeObject || !baseImage) return;

    fabric.FabricImage.fromURL(baseImage, { crossOrigin: 'anonymous' })
      .then((img) => {
        // Match the current image position and scale
        img.set({
          left: activeObject.left,
          top: activeObject.top,
          scaleX: activeObject.scaleX,
          scaleY: activeObject.scaleY,
          angle: activeObject.angle,
          opacity: activeObject.opacity,
          name: activeObject.name,
          _ocrPayload: activeObject._ocrPayload,
          _ocrProcessed: activeObject._ocrProcessed
        });

        canvas.remove(activeObject);
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        updateLayers();
        saveToHistory();
        toast.success('Base image (cleaned) applied successfully');
      })
      .catch((error) => {
        console.error('Failed to load base image:', error);
        toast.error('Failed to apply base image');
      });
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4">
        {/* Image Info Section */}
        <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <Label className="font-semibold">Image Information</Label>
          </div>
          {imageSize.width && imageSize.height && (
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Size: {imageSize.width} × {imageSize.height}px
            </div>
          )}
          {baseImage && (
            <Button
              onClick={applyBaseImage}
              variant="outline"
              size="sm"
              className="w-full gap-2 mt-2"
            >
              <ImageIcon className="w-3 h-3" />
              Apply Base Image (Cleaned)
            </Button>
          )}
        </div>

        {/* Text Words Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-indigo-600" />
              <Label className="font-semibold">Detected Text ({words.length})</Label>
            </div>
          </div>

          {editedWords.length > 0 ? (
            <div className="space-y-2">
              {editedWords.map((word, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2"
                >
                  {editingWordIndex === index ? (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs">Text</Label>
                        <Input
                          value={word.text || ''}
                          onChange={(e) => handleWordEdit(index, 'text', e.target.value)}
                          placeholder="Enter text"
                        />
                      </div>
                      {word.bbox && (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">X</Label>
                            <Input
                              type="number"
                              value={word.bbox.x || 0}
                              onChange={(e) => handleWordEdit(index, 'bbox.x', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Y</Label>
                            <Input
                              type="number"
                              value={word.bbox.y || 0}
                              onChange={(e) => handleWordEdit(index, 'bbox.y', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Width</Label>
                            <Input
                              type="number"
                              value={word.bbox.width || 0}
                              onChange={(e) => handleWordEdit(index, 'bbox.width', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Height</Label>
                            <Input
                              type="number"
                              value={word.bbox.height || 0}
                              onChange={(e) => handleWordEdit(index, 'bbox.height', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => saveWordEdit(index)}
                          size="sm"
                          className="flex-1 gap-1"
                        >
                          <Save className="w-3 h-3" />
                          Save
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1"
                        >
                          <X className="w-3 h-3" />
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                            {word.text || '(empty)'}
                          </div>
                          {word.bbox && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Position: ({Math.round(word.bbox.x)}, {Math.round(word.bbox.y)}) • 
                              Size: {Math.round(word.bbox.width)}×{Math.round(word.bbox.height)}
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => setEditingWordIndex(index)}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
              No text words found
            </div>
          )}
        </div>

        {/* Objects Section */}
        {objects.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-600" />
              <Label className="font-semibold">Detected Objects ({objects.length})</Label>
            </div>
            <div className="space-y-2">
              {objects.map((obj, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {obj.label || obj.type || `Object ${index + 1}`}
                  </div>
                  {obj.bbox && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Position: ({Math.round(obj.bbox.x)}, {Math.round(obj.bbox.y)}) • 
                      Size: {Math.round(obj.bbox.width)}×{Math.round(obj.bbox.height)}
                    </div>
                  )}
                  {obj.confidence && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Confidence: {(obj.confidence * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw API Response Section */}
        <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <Label className="font-semibold text-xs">Raw API Response</Label>
          <Textarea
            value={JSON.stringify(apiResponse._raw || apiResponse, null, 2)}
            readOnly
            className="text-xs font-mono h-32 resize-none"
          />
        </div>
      </div>
    </ScrollArea>
  );
};

export default EditableApiResponse;

