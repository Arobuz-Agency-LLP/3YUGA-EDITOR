import { toast } from 'sonner';
import * as fabric from 'fabric';

const BACKEND_URL = 'http://localhost:5000';

export const handleImageUpload = async (file, canvas, updateLayers, saveToHistory) => {
  if (!file || !canvas) return;

  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${BACKEND_URL}/make-editable`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to process image');
    }

    const data = await response.json();
    console.log('OCR Response:', data); // Debug log
    
    // Set image as background
    const imageUrl = URL.createObjectURL(file);
    const backgroundImg = await loadImageAsBackground(imageUrl, canvas);
    
    // Create editable text overlays
    if (data.text && data.text.words) {
      createTextOverlays(data.text.words, backgroundImg, canvas);
    }
    
    // Create object overlays
    if (data.objects) {
      createObjectOverlays(data.objects, backgroundImg, canvas);
    }

    canvas.renderAll();
    updateLayers();
    saveToHistory();
    
    URL.revokeObjectURL(imageUrl);
    toast.success(`Image processed! Found ${data.text?.words?.length || 0} text regions`);

  } catch (error) {
    console.error('Image processing error:', error);
    toast.error('Failed to process image', {
      description: error.message
    });
  }
};

async function loadImageAsBackground(imageUrl, canvas) {
  return new Promise((resolve, reject) => {
    fabric.FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' })
      .then((img) => {
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        
        const scaleX = canvasWidth / img.width;
        const scaleY = canvasHeight / img.height;
        const scale = Math.min(scaleX, scaleY);
        
        const left = (canvasWidth - (img.width * scale)) / 2;
        const top = (canvasHeight - (img.height * scale)) / 2;
        
        img.set({
          left: left,
          top: top,
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
          isBackgroundImage: true,
          name: 'background-image'
        });
        
        const existingBg = canvas.getObjects().find(obj => obj.isBackgroundImage);
        if (existingBg) {
          canvas.remove(existingBg);
        }
        
        canvas.add(img);
        canvas.sendObjectToBack(img);
        canvas.renderAll();
        
        resolve(img);
      })
      .catch(reject);
  });
}

function createTextOverlays(words, backgroundImg, canvas) {
  console.log('Creating text overlays for', words.length, 'words'); // Debug log
  
  const scaleX = backgroundImg.scaleX;
  const scaleY = backgroundImg.scaleY;
  const offsetX = backgroundImg.left;
  const offsetY = backgroundImg.top;
  
  words.forEach((word, index) => {
    console.log('Creating textbox for:', word.text, word.bbox); // Debug log
    
    const scaledX = offsetX + (word.bbox.x * scaleX);
    const scaledY = offsetY + (word.bbox.y * scaleY);
    const scaledWidth = Math.max(word.bbox.width * scaleX, 50);
    const scaledHeight = word.bbox.height * scaleY;
    
    const textbox = new fabric.Textbox(word.text, {
      left: scaledX,
      top: scaledY,
      width: scaledWidth,
      fontSize: Math.max(14, scaledHeight * 0.7),
      fill: '#000000',
      fontFamily: 'Arial',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: 4,
      borderColor: '#4A90E2',
      cornerColor: '#4A90E2',
      cornerSize: 8,
      transparentCorners: false,
      name: `ocr-text-${index}`,
      isOCRText: true,
      ocrData: word,
      // Ensure it's selectable and editable
      selectable: true,
      evented: true,
      editable: true,
      // Make it stand out
      shadow: 'rgba(0,0,0,0.3) 2px 2px 4px'
    });
    
    // Add double-click to edit handler
    textbox.on('mousedown', function(options) {
      if (options.e.detail === 2) { // Double click
        textbox.enterEditing();
        textbox.selectAll();
      }
    });
    
    canvas.add(textbox);
    console.log('Added textbox:', textbox); // Debug log
  });
}

function createObjectOverlays(objects, backgroundImg, canvas) {
  console.log('Creating object overlays for', objects.length, 'objects'); // Debug log
  
  const scaleX = backgroundImg.scaleX;
  const scaleY = backgroundImg.scaleY;
  const offsetX = backgroundImg.left;
  const offsetY = backgroundImg.top;
  
  objects.forEach((obj, index) => {
    const scaledX = offsetX + (obj.bbox.x * scaleX);
    const scaledY = offsetY + (obj.bbox.y * scaleY);
    const scaledWidth = obj.bbox.width * scaleX;
    const scaledHeight = obj.bbox.height * scaleY;
    
    const overlay = new fabric.Rect({
      left: scaledX,
      top: scaledY,
      width: scaledWidth,
      height: scaledHeight,
      fill: 'rgba(74, 144, 226, 0.2)',
      stroke: '#4A90E2',
      strokeWidth: 2,
      strokeDashArray: [8, 4],
      name: `object-${index}`,
      isDetectedObject: true,
      objectData: obj,
      selectable: true,
      evented: true
    });
    
    canvas.add(overlay);
  });
}

export const replaceImageRegion = async (file, activeObject, canvas, updateLayers, saveToHistory) => {
  if (!file || !activeObject || !activeObject.isDetectedObject) {
    toast.error('Please select a detected object region first');
    return;
  }

  try {
    const imageUrl = URL.createObjectURL(file);
    const img = await fabric.FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' });
    
    img.set({
      left: activeObject.left,
      top: activeObject.top,
      scaleX: activeObject.width / img.width,
      scaleY: activeObject.height / img.height,
      name: 'replaced-image'
    });
    
    canvas.remove(activeObject);
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();
    updateLayers();
    saveToHistory();
    
    URL.revokeObjectURL(imageUrl);
    toast.success('Image region replaced successfully');
  } catch (error) {
    toast.error('Failed to replace image region');
  }
};

export const setupSnapToGrid = (canvas, gridSize) => {
  const snapObject = (obj) => {
    const snappedLeft = Math.round(obj.left / gridSize) * gridSize;
    const snappedTop = Math.round(obj.top / gridSize) * gridSize;
    obj.set({ left: snappedLeft, top: snappedTop });
  };

  const handleObjectMoving = (e) => {
    snapObject(e.target);
    canvas.renderAll();
  };

  canvas.on('object:moving', handleObjectMoving);
  return () => canvas.off('object:moving', handleObjectMoving);
};

export const exportCanvas = (canvas) => {
  if (!canvas) return;
  
  try {
    const json = canvas.toJSON(['name', 'isBackgroundImage', 'isOCRText', 'isDetectedObject', 'ocrData', 'objectData']);
    const jsonBlob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `canvas-${Date.now()}.json`;
    jsonLink.click();
    
    const pngLink = document.createElement('a');
    pngLink.href = dataURL;
    pngLink.download = `canvas-${Date.now()}.png`;
    pngLink.click();
    
    URL.revokeObjectURL(jsonUrl);
    toast.success('Canvas exported successfully');
  } catch (error) {
    toast.error('Failed to export canvas');
  }
};

export const updateOCRTextProperty = (activeObject, property, value, canvas, saveToHistory) => {
  if (activeObject && activeObject.isOCRText) {
    activeObject.set(property, value);
    canvas.renderAll();
    saveToHistory();
  }
};

export const processImageForEditing = async (imageObject, canvas, updateLayers, saveToHistory) => {
  try {
    if (!imageObject || imageObject.isBackgroundImage) return;

    // Export the image to a blob
    const imgElement = imageObject.getElement();
    if (!imgElement) {
      toast.error('Could not get image element');
      return;
    }

    // Create a temporary canvas to export the image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imgElement.width || imageObject.width;
    tempCanvas.height = imgElement.height || imageObject.height;
    const ctx = tempCanvas.getContext('2d');
    
    if (!ctx) {
      toast.error('Could not create canvas context');
      return;
    }

    ctx.drawImage(imgElement, 0, 0);
    
    // Convert to blob
    const blob = await new Promise((resolve) => {
      tempCanvas.toBlob((blob) => resolve(blob), 'image/png');
    });

    if (!blob) {
      toast.error('Could not export image');
      return;
    }

    // Send to backend
    const formData = new FormData();
    formData.append('image', blob);

    const response = await fetch(`${BACKEND_URL}/make-editable`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to process image');
    }

    const data = await response.json();
    console.log('OCR Response:', data);

    // Store OCR payload in the image object
    imageObject.set('_ocrPayload', data);
    imageObject.set('_ocrProcessed', true);

    // Load the cleaned base image
    if (data.baseImage) {
      const cleanedImg = await fabric.FabricImage.fromURL(data.baseImage, { 
        crossOrigin: 'anonymous' 
      });
      
      // Match the current image position and scale
      cleanedImg.set({
        left: imageObject.left,
        top: imageObject.top,
        scaleX: imageObject.scaleX,
        scaleY: imageObject.scaleY,
        angle: imageObject.angle,
        opacity: imageObject.opacity,
        name: imageObject.name,
        _ocrPayload: data,
        _ocrProcessed: true
      });
      
      // Replace the old image with cleaned one
      canvas.remove(imageObject);
      canvas.add(cleanedImg);
      canvas.setActiveObject(cleanedImg);
      
      // Add editable text overlays
      if (data.text && data.text.words && data.text.words.length) {
        createTextOverlays(data.text.words, cleanedImg, canvas);
      }
      
      // Add object overlays
      if (data.objects && data.objects.length) {
        createObjectOverlays(data.objects, cleanedImg, canvas);
      }
    } else {
      // Fallback: Add overlays directly to canvas
      if (data.text && data.text.words && data.text.words.length) {
        createTextOverlays(data.text.words, imageObject, canvas);
      }
      if (data.objects && data.objects.length) {
        createObjectOverlays(data.objects, imageObject, canvas);
      }
    }

    canvas.renderAll();
    updateLayers();
    saveToHistory();
    
    toast.success(`Image processed! Found ${data.text?.words?.length || 0} text regions`);
  } catch (error) {
    console.error('Image processing error:', error);
    toast.error('Failed to process image', {
      description: error.message
    });
  }
};

export const integrateTextToImage = async (imageObject, canvas, updateLayers, saveToHistory) => {
  if (!imageObject || !canvas || imageObject.type !== 'image') {
    throw new Error('Invalid image object');
  }

  try {
    // Get all OCR text objects on the canvas
    const textObjects = canvas.getObjects().filter(obj => obj.isOCRText && obj.ocrData);
    
    if (textObjects.length === 0) {
      toast.warning('No text overlays found to integrate');
      return;
    }

    // Prepare text edits from canvas textboxes
    const textEdits = textObjects.map((textObj) => {
      const ocrData = textObj.ocrData || {};
      return {
        text: textObj.text || ocrData.text || '',
        bbox: {
          x: ocrData.bbox?.x || 0,
          y: ocrData.bbox?.y || 0,
          width: ocrData.bbox?.width || 0,
          height: ocrData.bbox?.height || 0
        }
      };
    });

    // Export the base image to a blob
    const imgElement = imageObject.getElement();
    if (!imgElement) {
      throw new Error('Could not get image element');
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imgElement.width || imageObject.width;
    tempCanvas.height = imgElement.height || imageObject.height;
    const ctx = tempCanvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }

    ctx.drawImage(imgElement, 0, 0);
    
    const blob = await new Promise((resolve) => {
      tempCanvas.toBlob((blob) => resolve(blob), 'image/png');
    });

    if (!blob) {
      throw new Error('Could not export image');
    }

    // Send to backend
    const formData = new FormData();
    formData.append('image', blob);
    formData.append('text_edits', JSON.stringify(textEdits));

    const response = await fetch(`${BACKEND_URL}/integrate-text`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to integrate text');
    }

    const data = await response.json();
    
    if (!data.integratedImage) {
      throw new Error('No integrated image returned');
    }
    
    // Load the integrated image
    const integratedImg = await fabric.FabricImage.fromURL(data.integratedImage, { 
      crossOrigin: 'anonymous' 
    });
    
    // Preserve image properties
    integratedImg.set({
      left: imageObject.left,
      top: imageObject.top,
      scaleX: imageObject.scaleX,
      scaleY: imageObject.scaleY,
      angle: imageObject.angle,
      opacity: imageObject.opacity,
      name: imageObject.name || 'integrated-image',
      // Preserve OCR payload
      _ocrPayload: imageObject._ocrPayload,
      _ocrProcessed: imageObject._ocrProcessed
    });
    
    // Remove old image
    canvas.remove(imageObject);
    
    // Remove all OCR text overlays for this image
    const objects = canvas.getObjects();
    objects.forEach((obj) => {
      if (obj.isOCRText) {
        canvas.remove(obj);
      }
    });
    
    // Add integrated image
    canvas.add(integratedImg);
    canvas.setActiveObject(integratedImg);
    canvas.renderAll();
    
    updateLayers();
    saveToHistory();
    
    toast.success(`Successfully integrated ${textEdits.length} text element(s)`);
    
    return integratedImg;
  } catch (error) {
    console.error('Text integration error:', error);
    toast.error('Failed to integrate text', {
      description: error.message
    });
    throw error;
  }
};