import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Group, Rect, Circle, Text, FabricImage, Path, Canvas as FabricCanvas, FabricObject } from 'fabric';
import * as fabric from 'fabric';

const EditorContext = createContext<any>(null);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
};
export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [activeObject, setActiveObject] = useState<FabricObject | null>(null);
  const [zoom, setZoom] = useState<number>(100);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 1080, height: 1080 });
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [history, setHistory] = useState<any[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);
  const [layers, setLayers] = useState<any[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [clipboardObject, setClipboardObject] = useState<FabricObject | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<{ brightness: number; contrast: number; saturation: number; blur: number}>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0
  });
  const [activeFilterPreset, setActiveFilterPreset] = useState<any>(null);
  const [templateContrast, setTemplateContrast] = useState<number>(0);
  const [backgroundOpacity, setBackgroundOpacity] = useState<number>(100);
  const [boards, setBoards] = useState<Array<{ id: number; name: string; data: any }>>([{ id: 1, name: 'Board 1', data: null }]);
  const [activeBoard, setActiveBoard] = useState<number>(1);
  const [canvasRotation, setCanvasRotation] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boardDataRef = useRef<Record<number, any>>({});
  const isInitialized = useRef<boolean>(false);
  const [isDrawingCustom, setIsDrawingCustom] = useState<boolean>(false);
  const [customPath, setCustomPath] = useState<any[]>([]);
  // Initialize history when canvas is first set
  useEffect(() => {
    if (canvas && !isInitialized.current) {
      // Save initial empty canvas state
      const initialState = canvas.toJSON();
      setHistory([initialState]);
      setHistoryStep(0);
      isInitialized.current = true;
    }
  }, [canvas]);

  const updateLayers = useCallback(() => {
    if (canvas) {
      const objects = canvas.getObjects();
      const layerList: any[] = [];
      
      const processObject = (obj: any, index: number, parentId: string | null = null) => {
        const layerId = `layer-${objects.length - 1 - index}`;
        const layer: any = {
          id: layerId,
          name:
            obj?.name ||
            (obj?.type === 'textbox'
              ? (obj?.text ? obj.text.substring(0, 20) + '...' : 'textbox')
              : obj?.type) || 'Layer',
          type: obj?.type || 'object',
          visible: obj?.visible !== false,
          locked: obj?.selectable === false,
          index: objects.length - 1 - index,
          parentId: parentId,
          isGroup: obj?.type === 'group',
          children: []
        };
        
        if (obj?.type === 'group' && typeof obj.getObjects === 'function') {
          // Process children of the group
          const groupObjects = obj.getObjects();
          groupObjects.forEach((childObj: any) => {
            const childLayer = processObject(childObj, index, layerId);
            layer.children.push(childLayer);
          });
        }
        
        return layer;
      };
      
      objects.forEach((obj, index) => {
        const layer = processObject(obj, index);
        layerList.push(layer);
      });
      
      setLayers(layerList.reverse());
    }
  }, [canvas]);

  const saveToHistory = useCallback(() => {
    if (canvas) {
      const json = canvas.toJSON();
      setHistory(prev => {
        const newHistory = prev.slice(0, historyStep + 1);
        const updatedHistory = [...newHistory, json];
        // Limit history to prevent memory issues
        return updatedHistory.slice(-50);
      });
      setHistoryStep(prev => prev + 1);
      
      // Auto-save to localStorage
      try {
        localStorage.setItem('editor-autosave', JSON.stringify({
          canvas: json,
          backgroundColor,
          canvasSize,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.warn('Failed to auto-save to localStorage:', e);
      }
    }
  }, [canvas, historyStep, backgroundColor, canvasSize]);
  
  const undo = useCallback(() => {
    if (historyStep > 0 && canvas && history[historyStep - 1]) {
      const prevState = history[historyStep - 1];
      canvas.loadFromJSON(prevState, () => {
        canvas.renderAll();
        canvas.requestRenderAll();
        setHistoryStep(prev => prev - 1);
        updateLayers();
        // Update active object after undo
        const activeObj = canvas.getActiveObject();
        setActiveObject(activeObj as any);
      });
    }
  }, [canvas, history, historyStep, updateLayers]);

  const redo = useCallback(() => {
    if (historyStep < history.length - 1 && canvas) {
      const nextStep = historyStep + 1;
      const nextState = history[nextStep];
      if (nextState) {
        canvas.loadFromJSON(nextState, () => {
          canvas.renderAll();
          canvas.requestRenderAll();
          setHistoryStep(nextStep);
          updateLayers();
          // Update active object after redo
          const activeObj = canvas.getActiveObject();
          setActiveObject(activeObj as any);
        });
      }
    }
  }, [canvas, history, historyStep, updateLayers]);

  const copyObject = useCallback(() => {
    if (activeObject) {
      setClipboardObject(activeObject);
    }
  }, [activeObject]);

  const pasteObject = useCallback(() => {
    if (clipboardObject && canvas) {
      try {
        const objectData = (clipboardObject as any).toObject();
        const callback = (objects: FabricObject[]) => {
          const cloned: any = objects[0];
          cloned.set({
            left: (cloned.left || 0) + 20,
            top: (cloned.top || 0) + 20,
          });
          canvas.add(cloned);
          canvas.setActiveObject(cloned);
          canvas.renderAll();
          saveToHistory();
        };
        (fabric.util.enlivenObjects as any)([objectData], callback);
      } catch (error) {
        console.error('Paste failed:', error);
        toast.error('Failed to paste object');
      }
    }
  }, [clipboardObject, canvas, saveToHistory]);

  const deleteObject = useCallback(() => {
    if (activeObject && canvas) {
      canvas.remove(activeObject);
      canvas.renderAll();
      saveToHistory();
    }
  }, [activeObject, canvas, saveToHistory]);
  
  const exportCanvas = useCallback((format: string = 'png', quality: number = 1): string | undefined => {
    if (canvas) {
      setIsLoading(true);
      try {
        const dataURL = canvas.toDataURL({
          format: format as any,
          quality: quality,
          multiplier: 2 // Higher resolution export
        });
        
        // Create download link
        const link = document.createElement('a');
        link.download = `design.${format}`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return dataURL;
      } finally {
        setIsLoading(false);
      }
    }
  }, [canvas]);

  const removeBackground = useCallback(async () => {
    if (!canvas) {
      toast.error('Canvas is not initialized');
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if an image object is selected
      const selectedObject = canvas.getActiveObject() as any;
      const isImageSelected = selectedObject && selectedObject.type === 'image';
      
      let dataURL: string;
      let originalCanvasWidth: number;
      let originalCanvasHeight: number;
      let imageBounds: any = null;
      
      if (isImageSelected) {
        // Export only the selected image object
        const imgElement = selectedObject.getElement();
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) throw new Error('Failed to create canvas context');
        
        // Get actual image dimensions (accounting for scale)
        const imgWidth = selectedObject.width || imgElement.width;
        const imgHeight = selectedObject.height || imgElement.height;
        const scaleX = selectedObject.scaleX || 1;
        const scaleY = selectedObject.scaleY || 1;
        const actualWidth = imgWidth * scaleX;
        const actualHeight = imgHeight * scaleY;
        
        tempCanvas.width = actualWidth;
        tempCanvas.height = actualHeight;
        
        // Draw the image at full size
        ctx.drawImage(imgElement, 0, 0, actualWidth, actualHeight);
        
        dataURL = tempCanvas.toDataURL('image/png', 1.0);
        originalCanvasWidth = canvas.getWidth();
        originalCanvasHeight = canvas.getHeight();
        imageBounds = {
          left: selectedObject.left,
          top: selectedObject.top,
          width: actualWidth,
          height: actualHeight
        };
        
        console.log('Removing background from selected image:', {
          dimensions: { width: actualWidth, height: actualHeight },
          position: { left: selectedObject.left, top: selectedObject.top }
        });
      } else {
        // Export entire canvas
        originalCanvasWidth = canvas.getWidth();
        originalCanvasHeight = canvas.getHeight();
        
        // Use higher multiplier for better quality (2x for retina/HD displays)
        dataURL = canvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 2 // Higher resolution for better quality
        });
        
        console.log('Removing background from entire canvas:', {
          dimensions: { width: originalCanvasWidth, height: originalCanvasHeight }
        });
      }

      // Convert dataURL to blob
      const dataURLToBlob = (dataURL: string): Blob => {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      };
      
      const blob = dataURLToBlob(dataURL);
      console.log('Sending image blob size:', blob.size, 'bytes');

      // Create FormData and append the image
      const formData = new FormData();
      formData.append('image', blob, 'canvas.png');
      
      // Enable alpha matting for better edge precision (smoother edges)
      formData.append('alpha_matting', 'true');
      formData.append('alpha_matting_foreground_threshold', '240');
      formData.append('alpha_matting_background_threshold', '10');
      formData.append('alpha_matting_erode_size', '10');
      
      // Use auto model detection (will choose best model based on image)
      formData.append('model', 'auto');

      // Import API config
      const { API_ENDPOINTS } = await import('../config/apiConfig');
      
      // Send to backend API
      const apiResponse = await fetch(API_ENDPOINTS.REMOVE_BACKGROUND, {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status} ${apiResponse.statusText}`);
      }

      // Get the processed image blob
      const processedBlob = await apiResponse.blob();
      console.log('Received processed image blob size:', processedBlob.size, 'bytes');
      const imageUrl = URL.createObjectURL(processedBlob);

      // Load the new PNG image onto the canvas
      try {
        const img = await FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' });
        
        console.log('Processed image dimensions:', { 
          width: img.width, 
          height: img.height,
          originalCanvasWidth,
          originalCanvasHeight
        });

        if (isImageSelected && imageBounds) {
          // Replace the selected image object with the processed one
          const scaleX = imageBounds.width / img.width;
          const scaleY = imageBounds.height / img.height;
          
          img.set({
            left: imageBounds.left,
            top: imageBounds.top,
            scaleX: scaleX,
            scaleY: scaleY,
            selectable: true,
            evented: true,
          });
          
          // Remove the old image and add the new one
          canvas.remove(selectedObject);
          canvas.add(img);
          canvas.setActiveObject(img);
        } else {
          // Replace entire canvas with processed image
          const canvasWidth = originalCanvasWidth;
          const canvasHeight = originalCanvasHeight;
          
          // Calculate scale to fit canvas while preserving aspect ratio
          const scaleX = canvasWidth / img.width;
          const scaleY = canvasHeight / img.height;
          const scale = Math.min(scaleX, scaleY);
          
          // Center the image
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          const left = (canvasWidth - scaledWidth) / 2;
          const top = (canvasHeight - scaledHeight) / 2;

          // Clear the canvas first
          canvas.clear();

          img.set({
            left: left,
            top: top,
            scaleX: scale,
            scaleY: scale,
            selectable: true,
            evented: true,
          });
          
          canvas.add(img);
        }
        
        canvas.renderAll();
        
        // Update layers and save to history
        updateLayers();
        saveToHistory();

        // Clean up the object URL
        URL.revokeObjectURL(imageUrl);

        toast.success('Background removed successfully!');
      } catch (loadError) {
        // Clean up the object URL if it was created
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
        throw new Error('Failed to load processed image');
      }
    } catch (error: any) {
      console.error('Background removal failed:', error);
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        toast.error('Cannot connect to the backend API. Please ensure the Flask server is running on http://localhost:5000');
      } else if (error.message?.includes('API error')) {
        toast.error(`Backend API error: ${error.message}`);
      } else {
        toast.error('Failed to remove background. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [canvas, updateLayers, saveToHistory]);
  
  const duplicateObject = useCallback(() => {
    if (activeObject && canvas) {
      try {
        (activeObject as any).clone().then((cloned: any) => {
          cloned.set({
            left: ((activeObject as any).left || 0) + 20,
            top: ((activeObject as any).top || 0) + 20,
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
  }, [activeObject, canvas, updateLayers, saveToHistory]);
  
  const centerObject = useCallback(() => {
    if (activeObject && canvas) {
      (activeObject as any).center();
      canvas.renderAll();
      saveToHistory();
    }
  }, [activeObject, canvas, saveToHistory]);
  
  const resetCanvas = useCallback(() => {
    if (canvas) {
      canvas.clear();
      (canvas as any).backgroundColor = '#ffffff';
      setBackgroundColor('#ffffff');
      canvas.renderAll();
      saveToHistory();
    }
  }, [canvas, saveToHistory]);

  const switchBoard = useCallback((boardId: number) => {
    if (canvas && activeBoard !== boardId) {
      // Save current board data
      boardDataRef.current[activeBoard] = {
        json: canvas.toJSON(),
        backgroundColor,
        canvasSize,
        history,
        historyStep
      };
      
      // Switch to new board
      setActiveBoard(boardId);
      
      // Load new board data
      const boardData = boardDataRef.current[boardId];
      if (boardData && boardData.json) {
        canvas.loadFromJSON(boardData.json, () => {
          canvas.renderAll();
          setBackgroundColor(boardData.backgroundColor || '#ffffff');
          setCanvasSize(boardData.canvasSize || { width: 1080, height: 1080 });
          setHistory(boardData.history || []);
          setHistoryStep(boardData.historyStep || 0);
          updateLayers();
        });
      } else {
        // New board - clear canvas
        canvas.clear();
        (canvas as any).backgroundColor = '#ffffff';
        setBackgroundColor('#ffffff');
        setCanvasSize({ width: 1080, height: 1080 });
        canvas.setDimensions({ width: 1080, height: 1080 } as any);
        setHistory([]);
        setHistoryStep(0);
        canvas.renderAll();
        updateLayers();
      }
    }
  }, [canvas, activeBoard, backgroundColor, canvasSize, history, historyStep, updateLayers]);

  const createBoard = useCallback(() => {
    const newId = Math.max(...boards.map(b => b.id)) + 1;
    const newBoard = { id: newId, name: `Board ${newId}`, data: null };
    setBoards(prev => [...prev, newBoard]);
    switchBoard(newId);
  }, [boards, switchBoard]);

  const closeBoard = useCallback((boardId: number) => {
    if (boards.length > 1) {
      setBoards(prev => prev.filter(b => b.id !== boardId));
      delete boardDataRef.current[boardId];
      
      if (activeBoard === boardId) {
        const remainingBoards = boards.filter(b => b.id !== boardId);
        switchBoard(remainingBoards[0].id);
      }
    }
  }, [boards, activeBoard, switchBoard]);

  const duplicateBoard = useCallback((boardId: number) => {
    const boardToDuplicate = boards.find(b => b.id === boardId);
    if (boardToDuplicate && canvas) {
      const newId = Math.max(...boards.map(b => b.id)) + 1;
      const newBoard = { id: newId, name: `${boardToDuplicate.name} Copy`, data: null };
      
      // If duplicating the currently active board, use current canvas state
      if (boardId === activeBoard) {
        boardDataRef.current[newId] = {
          json: canvas.toJSON(),
          backgroundColor,
          canvasSize: { ...canvasSize },
          history: [...history],
          historyStep
        };
      } else {
        // Copy from stored board data
        const sourceBoardData = boardDataRef.current[boardId];
        if (sourceBoardData) {
          boardDataRef.current[newId] = {
            json: JSON.parse(JSON.stringify(sourceBoardData.json)),
            backgroundColor: sourceBoardData.backgroundColor,
            canvasSize: { ...sourceBoardData.canvasSize },
            history: (sourceBoardData.history || []).map((h: any) => JSON.parse(JSON.stringify(h))),
            historyStep: sourceBoardData.historyStep
          };
        }
      }
      
      setBoards(prev => [...prev, newBoard]);
      switchBoard(newId);
    }
  }, [boards, canvas, backgroundColor, canvasSize, history, historyStep, activeBoard, switchBoard]);

  const bringForward = useCallback(() => {
    if (activeObject && canvas) {
      (canvas as any).bringForward(activeObject);
      canvas.renderAll();
      updateLayers();
      saveToHistory();
    }
  }, [activeObject, canvas, updateLayers, saveToHistory]);

  const sendBackward = useCallback(() => {
    if (activeObject && canvas) {
      (canvas as any).sendBackwards(activeObject);
      canvas.renderAll();
      updateLayers();
      saveToHistory();
    }
  }, [activeObject, canvas, updateLayers, saveToHistory]);
  const resizeCanvas = useCallback((newWidth: number, newHeight: number) => {
    if (!canvas) return;
    
    const scaleX = newWidth / canvasSize.width;
    const scaleY = newHeight / canvasSize.height;
    
    // Scale all objects to fit new canvas dimensions
    canvas.getObjects().forEach((obj: any) => {
      obj.set({
        left: (obj.left || 0) * scaleX,
        top: (obj.top || 0) * scaleY,
        scaleX: (obj.scaleX || 1) * scaleX,
        scaleY: (obj.scaleY || 1) * scaleY
      });
      obj.setCoords();
    });
    
    const newSize = { width: newWidth, height: newHeight };
    setCanvasSize(newSize);
    canvas.setDimensions(newSize as any);
    canvas.renderAll();
    updateLayers();
    saveToHistory();
  }, [canvas, canvasSize, updateLayers, saveToHistory]);

  const rotateCanvas = useCallback((direction: 'left' | 'right') => {
    if (!canvas) return;
    
    const rotation = direction === 'left' ? -90 : 90;
    const newRotation = (canvasRotation + rotation) % 360;
    
    // Swap canvas dimensions for 90/270 degree rotations
    if (Math.abs(newRotation) === 90 || Math.abs(newRotation) === 270) {
      resizeCanvas(canvasSize.height, canvasSize.width);
    }
    
    setCanvasRotation(newRotation);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, canvasRotation, canvasSize, saveToHistory, resizeCanvas]);
 



  const selectLayer = useCallback((layerId: string) => {
    setSelectedLayers(prev => {
      if (prev.includes(layerId)) {
        return prev.filter(id => id !== layerId);
      } else {
        return [...prev, layerId];
      }
    });
  }, []);

  const selectAllLayers = useCallback(() => {
    setSelectedLayers(layers.map(layer => layer.id));
  }, [layers]);

  const clearLayerSelection = useCallback(() => {
    setSelectedLayers([]);
  }, []);

  const toggleGroupExpansion = useCallback((groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  }, []);

  const groupSelectedLayers = useCallback(() => {
    if (!canvas || selectedLayers.length < 2) return;
    
    const objects = canvas.getObjects();
    const objectsToGroup = selectedLayers.map(layerId => {
      const layerIndex = layers.findIndex(layer => layer.id === layerId);
      return objects[objects.length - 1 - layerIndex];
    }).filter(obj => obj);

    if ((objectsToGroup as any[]).length >= 2) {
      // Remove original objects
      (objectsToGroup as any[]).forEach((obj: any) => canvas.remove(obj));
      
      const group = new Group(objectsToGroup as any, {
        subTargetCheck: true,
        interactive: true
      } as any);
      
      canvas.add(group as any);
      canvas.setActiveObject(group as any);
      canvas.requestRenderAll();
      updateLayers();
      saveToHistory();
      clearLayerSelection();
    }
  }, [canvas, selectedLayers, layers, updateLayers, saveToHistory, clearLayerSelection]);

  const ungroupObjects = useCallback(() => {
    if (!canvas) return;
    const activeObj: any = canvas.getActiveObject();
    if (activeObj && activeObj.type === 'group') {
      const objects = (activeObj as any).getObjects();
      canvas.remove(activeObj);
      (objects as any[]).forEach((obj: FabricObject) => canvas.add(obj));
      canvas.requestRenderAll();
      updateLayers();
      saveToHistory();
    }
  }, [canvas, updateLayers, saveToHistory]);

  const ungroupLayer = useCallback((layerId: string) => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const layerIndex = layers.findIndex(layer => layer.id === layerId);
    const obj: any = objects[objects.length - 1 - layerIndex];
    
    if (obj && obj.type === 'group') {
      const groupObjects = (obj as any).getObjects();
      canvas.remove(obj);
      (groupObjects as any[]).forEach((groupObj: FabricObject) => canvas.add(groupObj));
      canvas.requestRenderAll();
      updateLayers();
      saveToHistory();
      clearLayerSelection();
    }
  }, [canvas, layers, updateLayers, saveToHistory, clearLayerSelection]);
  const moveLayerUp = useCallback((layerId: string) => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const layerIndex = layers.findIndex(layer => layer.id === layerId);
    const objectIndex = objects.length - 1 - layerIndex;
    const obj: any = objects[objectIndex];
    
    if (obj && objectIndex < objects.length - 1) {
      (canvas as any).bringForward(obj);
      canvas.requestRenderAll();
      updateLayers();
      saveToHistory();
    }
  }, [canvas, layers, updateLayers, saveToHistory]);

  const moveLayerDown = useCallback((layerId: string) => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const layerIndex = layers.findIndex(layer => layer.id === layerId);
    const objectIndex = objects.length - 1 - layerIndex;
    const obj: any = objects[objectIndex];
    
    if (obj && objectIndex > 0) {
      (canvas as any).sendBackwards(obj);
      canvas.requestRenderAll();
      updateLayers();
      saveToHistory();
    }
  }, [canvas, layers, updateLayers, saveToHistory]);

  const moveLayerToTop = useCallback((layerId: string) => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const layerIndex = layers.findIndex(layer => layer.id === layerId);
    const obj: any = objects[objects.length - 1 - layerIndex];
    
    if (obj) {
      (canvas as any).bringToFront(obj);
      canvas.requestRenderAll();
      updateLayers();
      saveToHistory();
    }
  }, [canvas, layers, updateLayers, saveToHistory]);

  const moveLayerToBottom = useCallback((layerId: string) => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const layerIndex = layers.findIndex(layer => layer.id === layerId);
    const obj: any = objects[objects.length - 1 - layerIndex];
    
    if (obj) {
      (canvas as any).sendToBack(obj);
      canvas.requestRenderAll();
      updateLayers();
      saveToHistory();
    }
  }, [canvas, layers, updateLayers, saveToHistory]);

  const groupObjects = useCallback(() => {
    if (!canvas) return;
    const activeSelection: any = canvas.getActiveObject();
    if (activeSelection && activeSelection.type === 'activeSelection') {
      const group = (activeSelection as any).toGroup();
      canvas.requestRenderAll();
      updateLayers();
      saveToHistory();
    }
  }, [canvas, updateLayers, saveToHistory]);

  const cropImage = useCallback(() => {
    if (!canvas || !activeObject || (activeObject as any).type !== 'image') return;
    
    const cropRect = new Rect({
      left: (activeObject as any).left,
      top: (activeObject as any).top,
      width: ((activeObject as any).width || 0) * ((activeObject as any).scaleX || 1),
      height: ((activeObject as any).height || 0) * ((activeObject as any).scaleY || 1),
      fill: 'transparent',
      stroke: '#ff0000',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: true
    } as any);
    
    canvas.add(cropRect as any);
    canvas.setActiveObject(cropRect as any);
    canvas.requestRenderAll();
  }, [canvas, activeObject]);

  const applyCrop = useCallback(() => {
    if (!canvas) return;
    const cropRect: any = canvas.getActiveObject();
    const image: any = canvas.getObjects().find(obj => (obj as any).type === 'image');
    
    if (cropRect && image && cropRect.stroke === '#ff0000') {
      image.set({
        cropX: ((cropRect.left || 0) - (image.left || 0)) / (image.scaleX || 1),
        cropY: ((cropRect.top || 0) - (image.top || 0)) / (image.scaleY || 1),
        width: (cropRect.width || 0) / (image.scaleX || 1),
        height: (cropRect.height || 0) / (image.scaleY || 1)
      } as any);
      
      canvas.remove(cropRect);
      canvas.setActiveObject(image);
      canvas.requestRenderAll();
      updateLayers();
      saveToHistory();
    }
  }, [canvas, updateLayers, saveToHistory]);

  const maskWithShape = useCallback((shape: string) => {
    if (!canvas || !activeObject || (activeObject as any).type !== 'image') return;
    
    const imgElement = (activeObject as any).getElement();
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;
    
    const size = Math.min(
      ((activeObject as any).width || 0) * ((activeObject as any).scaleX || 1), 
      ((activeObject as any).height || 0) * ((activeObject as any).scaleY || 1)
    );
    const getStrokeWidth = (size: number) => Math.max(1, Math.min(8, size / 25));
    const strokeWidth = getStrokeWidth(size);
    
    tempCanvas.width = size;
    tempCanvas.height = size;
    
    if (shape === 'circle') {
      ctx.save();
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(imgElement, 0, 0, size, size);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2 - strokeWidth/2, 0, Math.PI * 2);
      ctx.strokeStyle = '#0891b2';
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    } else if (shape === 'rectangle') {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, size, size);
      ctx.clip();
      ctx.drawImage(imgElement, 0, 0, size, size);
      ctx.restore();
      ctx.beginPath();
      ctx.rect(strokeWidth/2, strokeWidth/2, size - strokeWidth, size - strokeWidth);
      ctx.strokeStyle = '#3730a3';
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
    
    const dataURL = tempCanvas.toDataURL();
    const img = new Image();
    img.onload = () => {
      const fabricImg = new FabricImage(img) as any;
      fabricImg.set({
        left: (activeObject as any).left,
        top: (activeObject as any).top,
        scaleX: 1,
        scaleY: 1
      });
      
      canvas.remove(activeObject as any);
      canvas.add(fabricImg as any);
      canvas.setActiveObject(fabricImg as any);
      canvas.requestRenderAll();
      updateLayers();
      saveToHistory();
    };
    img.src = dataURL;
  }, [canvas, activeObject, updateLayers, saveToHistory]);

  const maskImageWithCustomShape = useCallback(() => {
    if (!canvas || !activeObject || (activeObject as any).type !== 'image') {
      toast.error('Please select an image to mask');
      return;
    }

    const objects = canvas.getObjects();
    let shapeToUse: any | null = null;
    
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj: any = objects[i];
      
      if (obj === activeObject || 
          obj.id === 'grid-line' || 
          obj.name === 'customShapePoint' || 
          obj.name === 'customShapeLine') {
        continue;
      }
      
      const validTypes = ['path', 'rect', 'circle', 'ellipse', 'triangle', 'polygon'];
      
      if (validTypes.includes(obj.type || '') || obj.selectable) {
        shapeToUse = obj;
        break;
      }
    }

    if (!shapeToUse) {
      toast.error('Please create a shape first');
      return;
    }

    try {
      let clipShape: any;
      
      if (shapeToUse.type === 'rect') {
        clipShape = new Rect({
          left: 0,
          top: 0,
          width: (shapeToUse.width || 0) * (shapeToUse.scaleX || 1),
          height: (shapeToUse.height || 0) * (shapeToUse.scaleY || 1),
          originX: 'left',
          originY: 'top'
        } as any);
      } else if (shapeToUse.type === 'circle') {
        clipShape = new Circle({
          left: 0,
          top: 0,
          radius: (shapeToUse as any).radius,
          scaleX: shapeToUse.scaleX,
          scaleY: shapeToUse.scaleY,
          originX: 'left',
          originY: 'top'
        } as any);
      } else {
        clipShape = new Rect({
          left: 0,
          top: 0,
          width: ((shapeToUse.width || 100) * (shapeToUse.scaleX || 1)),
          height: ((shapeToUse.height || 100) * (shapeToUse.scaleY || 1)),
          originX: 'left',
          originY: 'top'
        } as any);
      }
      
      // Position clip path absolutely so the mask stays fixed while moving the image
      const imgLeft = (activeObject as any).left || 0;
      const imgTop = (activeObject as any).top || 0;
      const imgAngle = (activeObject as any).angle || 0;

      (clipShape as any).absolutePositioned = true;
      (clipShape as any).left = imgLeft;
      (clipShape as any).top = imgTop;
      (clipShape as any).angle = imgAngle;

      canvas.remove(shapeToUse as any);
      (activeObject as any).clipPath = clipShape;
      (activeObject as any).dirty = true;
      
      canvas.renderAll();
      updateLayers();
      saveToHistory();
      toast.success(`Image masked with ${shapeToUse.type} shape!`);
      
    } catch (error) {
      console.error('Masking error:', error);
      toast.error('Failed to apply mask. Please try again.');
    }
  }, [canvas, activeObject, updateLayers, saveToHistory]);

  const maskWithText = useCallback((text: string) => {
    if (!canvas || !activeObject || !text || (activeObject as any).type !== 'image') return;
    
    const imgElement = (activeObject as any).getElement();
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;
    
    const width = ((activeObject as any).width || 0) * ((activeObject as any).scaleX || 1);
    const height = ((activeObject as any).height || 0) * ((activeObject as any).scaleY || 1);
    tempCanvas.width = width;
    tempCanvas.height = height;
    
    ctx.font = `bold ${Math.min(width, height) / 3}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillText(text, width/2, height/2);
    
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(imgElement, 0, 0, width, height);
    
    const dataURL = tempCanvas.toDataURL();
    const img = new Image();
    img.onload = () => {
      const fabricImg = new FabricImage(img) as any;
      fabricImg.set({
        left: (activeObject as any).left,
        top: (activeObject as any).top,
        scaleX: 1,
        scaleY: 1
      });
      
      canvas.remove(activeObject as any);
      canvas.add(fabricImg as any);
      canvas.setActiveObject(fabricImg as any);
      canvas.requestRenderAll();
      updateLayers();
      saveToHistory();
    };
    img.src = dataURL;
  }, [canvas, activeObject, updateLayers, saveToHistory]);

  const removeMask = useCallback(() => {
    if (!canvas || !activeObject || !(activeObject as any).clipPath) return;
    
    (activeObject as any).clipPath = null;
    canvas.requestRenderAll();
    updateLayers();
    saveToHistory();
  }, [canvas, activeObject, updateLayers, saveToHistory]);

  const fillShapeWithImage = useCallback(() => {
    if (!canvas || !activeObject || (activeObject as any).type !== 'image') {
      toast.error('Please select an image first');
      return;
    }

    // Prevent filling if the active object is already a background image
    if ((activeObject as any).isBackgroundImage) {
      toast.error('Cannot fill shapes with background images');
      return;
    }

    const img = activeObject as any;
    const objects = canvas.getObjects();
    
    // Define valid shape types
    const validShapeTypes = ['rect', 'circle', 'triangle', 'ellipse', 'polygon', 'path', 'text', 'textbox'];
    
    // First, collect all potential shapes (excluding template elements and backgrounds)
    const potentialShapes: any[] = [];
    
    for (const obj of objects) {
      const objAny = obj as any;
      
      // Skip the active image
      if (objAny === img) continue;
      
      // Skip helper objects
      if (objAny.id === 'grid-line' || 
          objAny.name === 'customShapePoint' || 
          objAny.name === 'customShapeLine') continue;
      
      // Skip if not a valid shape type
      if (!validShapeTypes.includes(objAny.type)) continue;
      
      // Skip template elements
      if (objAny.isTemplateImage || objAny.isTemplateText) continue;
      
      // Skip background images
      if (objAny.isBackgroundImage) continue;
      
      // Skip other images
      if (objAny.type === 'image') continue;
      
      // For rectangles: check if it's a template background
      if (objAny.type === 'rect') {
        const canvasWidth = canvas.width || 1080;
        const canvasHeight = canvas.height || 1080;
        const objWidth = (objAny.width || 0) * (objAny.scaleX || 1);
        const objHeight = (objAny.height || 0) * (objAny.scaleY || 1);
        const objLeft = objAny.left || 0;
        const objTop = objAny.top || 0;
        const objName = (objAny.name || '').toLowerCase();
        
        // Skip if it's clearly a background rectangle
        const isBackground = (
          (objLeft === 0 && objTop === 0 && 
           (objWidth >= canvasWidth * 0.85 || objHeight >= canvasHeight * 0.85)) ||
          objName.includes('background') ||
          objName.includes('bg')
        );
        
        if (isBackground) continue;
      }
      
      // This is a valid shape!
      potentialShapes.push(objAny);
    }
    
    if (potentialShapes.length === 0) {
      toast.error('Please add a shape first. Template elements are excluded.');
      return;
    }
    
    // Find the best shape to fill
    let shapeToFill: any | null = null;
    
    if (potentialShapes.length === 1) {
      shapeToFill = potentialShapes[0];
    } else {
      // Prioritize: selectable shapes first, then closest to image
      potentialShapes.sort((a, b) => {
        const aSelectable = a.selectable !== false ? 1 : 0;
        const bSelectable = b.selectable !== false ? 1 : 0;
        if (aSelectable !== bSelectable) return bSelectable - aSelectable;
        return 0; // Keep original order if same selectability
      });
      
      const imageBounds = img.getBoundingRect();
      let maxOverlap = 0;
      let closestDistance = Infinity;
      
      for (const shape of potentialShapes) {
        const shapeBounds = shape.getBoundingRect();
        
        const overlapLeft = Math.max(imageBounds.left, shapeBounds.left);
        const overlapTop = Math.max(imageBounds.top, shapeBounds.top);
        const overlapRight = Math.min(imageBounds.left + imageBounds.width, shapeBounds.left + shapeBounds.width);
        const overlapBottom = Math.min(imageBounds.top + imageBounds.height, shapeBounds.top + shapeBounds.height);
        
        const overlapArea = Math.max(0, overlapRight - overlapLeft) * Math.max(0, overlapBottom - overlapTop);
        
        const imageCenterX = imageBounds.left + imageBounds.width / 2;
        const imageCenterY = imageBounds.top + imageBounds.height / 2;
        const shapeCenterX = shapeBounds.left + shapeBounds.width / 2;
        const shapeCenterY = shapeBounds.top + shapeBounds.height / 2;
        const distance = Math.sqrt(Math.pow(imageCenterX - shapeCenterX, 2) + Math.pow(imageCenterY - shapeCenterY, 2));
        
        if (overlapArea > maxOverlap || (overlapArea === maxOverlap && distance < closestDistance)) {
          maxOverlap = overlapArea;
          closestDistance = distance;
          shapeToFill = shape;
        }
      }
    }
    
    if (!shapeToFill) {
      toast.error('No suitable shape found to fill');
      return;
    }
    
    try {
      const imgElement = img.getElement();
      if (!imgElement) {
        toast.error('Could not access image element');
        return;
      }
      
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) {
        toast.error('Could not create canvas context');
        return;
      }
      
      let shapeWidth: number, shapeHeight: number;
      
      if (shapeToFill.type === 'circle') {
        const radius = (shapeToFill.radius || 0) * (shapeToFill.scaleX || 1);
        shapeWidth = shapeHeight = radius * 2;
      } else if (shapeToFill.type === 'text' || shapeToFill.type === 'textbox') {
        const bounds = shapeToFill.getBoundingRect();
        const padding = Math.max(20, ((shapeToFill.fontSize || 20) * 0.2));
        shapeWidth = bounds.width + padding * 2;
        shapeHeight = bounds.height + padding * 2;
      } else {
        shapeWidth = ((shapeToFill.width || 100) * (shapeToFill.scaleX || 1));
        shapeHeight = ((shapeToFill.height || 100) * (shapeToFill.scaleY || 1));
      }
      
      tempCanvas.width = shapeWidth;
      tempCanvas.height = shapeHeight;
      
      ctx.drawImage(imgElement, 0, 0, shapeWidth, shapeHeight);
      
      const pattern = new (fabric as any).Pattern({
        source: tempCanvas,
        repeat: 'no-repeat'
      });
      
      shapeToFill.set('fill', pattern);
      canvas.remove(img);
      canvas.setActiveObject(shapeToFill);
      
      canvas.renderAll();
      updateLayers();
      saveToHistory();
      toast.success('Shape filled with image!');
      
    } catch (error) {
      console.error('[Fill Shape] Error:', error);
      toast.error('Failed to fill shape with image: ' + (error.message || 'Unknown error'));
    }
  }, [canvas, activeObject, updateLayers, saveToHistory]);

  const applyFilterPreset = useCallback((preset: any) => {
    if (!canvas || !activeObject || (activeObject as any).type !== 'image') {
      toast.error('Please select an image to apply filters');
      return;
    }

    try {
      (activeObject as any).filters = [];
      
      preset.filters.forEach((filterConfig: any) => {
        let filter: any = null;
        
        switch (filterConfig.type) {
          case 'Sepia':
            filter = new (fabric as any).filters.Sepia();
            break;
          case 'BlackWhite':
            filter = new (fabric as any).filters.BlackWhite();
            break;
          case 'Contrast':
            filter = new (fabric as any).filters.Contrast({ 
              contrast: filterConfig.value ? filterConfig.value / 100 : 0 
            });
            break;
          case 'Brightness':
            filter = new (fabric as any).filters.Brightness({ 
              brightness: filterConfig.value ? filterConfig.value / 100 : 0 
            });
            break;
          case 'Saturation':
            filter = new (fabric as any).filters.Saturation({ 
              saturation: filterConfig.value ? filterConfig.value / 100 : 0 
            });
            break;
          case 'Blur':
            filter = new (fabric as any).filters.Blur({ 
              blur: filterConfig.value ? filterConfig.value / 100 : 0 
            });
            break;
        }
        
        if (filter) {
          (activeObject as any).filters.push(filter);
        }
      });
      
      (activeObject as any).applyFilters();
      canvas.renderAll();
      setActiveFilterPreset(preset);
      saveToHistory();
      toast.success(`Applied ${preset.name} filter`);
    } catch (error) {
      console.error('Filter application error:', error);
      toast.error('Failed to apply filter');
    }
  }, [canvas, activeObject, saveToHistory]);

  const removeFilters = useCallback(() => {
    if (!canvas || !activeObject || (activeObject as any).type !== 'image') {
      return;
    }

    (activeObject as any).filters = [];
    (activeObject as any).applyFilters();
    canvas.renderAll();
    setActiveFilterPreset(null);
    saveToHistory();
    toast.success('Filters removed');
  }, [canvas, activeObject, saveToHistory]);

  const applyTemplateContrast = useCallback((contrastValue: number) => {
    if (!canvas) return;
    
    setTemplateContrast(contrastValue);
    
    const objects = canvas.getObjects();
    let hasTemplateElements = false;
    
    objects.forEach((obj: any) => {
      if (obj.isTemplateImage || obj.isTemplateText) {
        hasTemplateElements = true;
        
        if (!obj.filters) {
          obj.filters = [];
        }
        
        obj.filters = (obj.filters as any[]).filter((f: any) => !(f instanceof (fabric as any).filters.Contrast));
        
        if (contrastValue !== 0) {
          const contrastFilter = new (fabric as any).filters.Contrast({ 
            contrast: contrastValue / 100 
          });
          obj.filters.push(contrastFilter);
          (obj as any).applyFilters();
        }
      }
    });
    
    if (hasTemplateElements) {
      canvas.renderAll();
      saveToHistory();
    }
  }, [canvas, saveToHistory]);

  const applyBackgroundOpacity = useCallback((opacityValue: number) => {
    if (!canvas) return;
    
    setBackgroundOpacity(opacityValue);
    
    const objects = canvas.getObjects();
    let hasBackground = false;
    
    objects.forEach((obj: any) => {
      if (obj.isBackgroundImage) {
        hasBackground = true;
        obj.set('opacity', opacityValue / 100);
      }
    });
    
    if (hasBackground) {
      canvas.renderAll();
      saveToHistory();
    }
  }, [canvas, saveToHistory]);

  // Add keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          redo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const value: any = {
    canvas,
    setCanvas,
    canvasRef,
    activeObject,
    setActiveObject,
    zoom,
    setZoom,
    canvasSize,
    setCanvasSize,
    backgroundColor,
    setBackgroundColor,
    history,
    historyStep,
    saveToHistory,
    undo,
    redo,
    layers,
    updateLayers,
    selectedTemplate,
    setSelectedTemplate,
    isDarkMode,
    setIsDarkMode,
    showGrid,
    setShowGrid,
    copyObject,
    pasteObject,
    deleteObject,
    bringForward,
    sendBackward,
    clipboardObject,
    isLoading,
    setIsLoading,
    filters,
    setFilters,
    exportCanvas,
    duplicateObject,
    centerObject,
    resetCanvas,
    boards,
    activeBoard,
    createBoard,
    switchBoard,
    closeBoard,
    duplicateBoard,
    rotateCanvas,
    canvasRotation,
    groupObjects,
    ungroupObjects,
    selectedLayers,
    selectLayer,
    selectAllLayers,
    clearLayerSelection,
    groupSelectedLayers,
    expandedGroups,
    toggleGroupExpansion,
    ungroupLayer,
    cropImage,
    applyCrop,
    maskWithShape,
    maskWithText,
    removeMask,
    maskImageWithCustomShape,
    fillShapeWithImage,
    resizeCanvas,
    moveLayerUp,
    moveLayerDown,
    moveLayerToTop,
    moveLayerToBottom,
    isDrawingCustom,
    setIsDrawingCustom,
    customPath,
    setCustomPath,
    applyFilterPreset,
    removeFilters,
    activeFilterPreset,
    setActiveFilterPreset,
    templateContrast,
    setTemplateContrast,
    backgroundOpacity,
    setBackgroundOpacity,
    applyTemplateContrast,
    applyBackgroundOpacity,
    removeBackground
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};

export default EditorProvider;
