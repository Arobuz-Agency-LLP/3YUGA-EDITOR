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

    const raw = await response.json();
    console.log('OCR Response:', raw); // Debug log
    const normalized = normalizeOcrPayload(raw);
    
    // Set image as background
    const imageUrl = URL.createObjectURL(file);
    const backgroundImg = await loadImageAsBackground(imageUrl, canvas);
    
    // Create editable text overlays
    if (normalized.text && normalized.text.words && normalized.text.words.length) {
      createTextOverlays(normalized.text.words, backgroundImg, canvas);
    }
    
    // Create object overlays
    if (normalized.objects && normalized.objects.length) {
      createObjectOverlays(normalized.objects, backgroundImg, canvas);
    }

    canvas.renderAll();
    updateLayers();
    saveToHistory();
    
    URL.revokeObjectURL(imageUrl);
    toast.success(`Image processed! Found ${normalized.text?.words?.length || 0} text regions`);

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
    // Ensure bbox exists and has x,y,width,height (attempt to derive if not)
    if (!word.bbox) {
      const b = word.box || word.bounds || word.rect || word.region || null;
      if (b && (Array.isArray(b) || (b.x != null && b.y != null))) {
        if (Array.isArray(b)) {
          // [x, y, w, h] or [x1, y1, x2, y2]
          if (b.length >= 4) {
            const x = b[0], y = b[1], a = b[2], d = b[3];
            const w = (a > 0 && d > 0) ? a : Math.max(1, (a - x));
            const h = (a > 0 && d > 0) ? d : Math.max(1, (d - y));
            word.bbox = { x, y, width: Math.abs(w), height: Math.abs(h) };
          }
        } else {
          const x = b.left ?? b.x ?? 0;
          const y = b.top ?? b.y ?? 0;
          const w = b.width ?? Math.max(1, (b.right ?? (x + 1)) - x);
          const h = b.height ?? Math.max(1, (b.bottom ?? (y + 1)) - y);
          word.bbox = { x, y, width: Math.abs(w), height: Math.abs(h) };
        }
      }
    }
    if (!word.bbox) return;
    
    const scaledX = offsetX + (word.bbox.x * scaleX);
    const scaledY = offsetY + (word.bbox.y * scaleY);
    const scaledWidth = Math.max(word.bbox.width * scaleX, 50);
    const scaledHeight = word.bbox.height * scaleY;
    
    // Calculate font size to match original text exactly
    // OCR bbox height typically includes descenders/ascenders, so use 85-90% for body text
    // This ensures text size matches the original detected text
    const fontSize = Math.max(10, Math.round(scaledHeight * 0.85));
    
    // Get text color - prioritize backend-estimated color which samples actual image pixels
    // Backend uses estimate_text_color_near_bbox which analyzes the original text region
    let textColor = '#000000'; // Default fallback
    
    // Try to get color from multiple sources (backend may add it to word or in _raw data)
    if (word.color) {
      textColor = word.color;
    } else if (word.fill) {
      textColor = word.fill;
    } else if (word.textColor || word.text_color) {
      textColor = word.textColor || word.text_color;
    } else if (word.foregroundColor) {
      textColor = word.foregroundColor;
    } else if (word.ocrData && word.ocrData.color) {
      textColor = word.ocrData.color;
    }
    
    // If we have the raw OCR payload, check if color was estimated
    // Backend's build_fabric_text_objects_from_lines adds fill color from estimate_text_color_near_bbox
    
    const textbox = new fabric.Textbox(word.text, {
      left: scaledX,
      top: scaledY,
      width: scaledWidth,
      fontSize: fontSize,
      fill: textColor,
      fontFamily: word.fontFamily || word.font || 'Arial',
      fontWeight: word.fontWeight || word.weight || 'normal',
      // No background - text should appear directly on the image
      backgroundColor: 'transparent',
      padding: 0,
      // No text decoration that might make it look like an overlay
      underline: false,
      linethrough: false,
      overline: false,
      // Ensure text renders crisp and natural
      textDecoration: '',
      // Hide borders and controls by default
      borderColor: 'transparent',
      cornerColor: 'transparent',
      cornerSize: 0,
      transparentCorners: true,
      hasControls: false,
      hasBorders: false,
      // No border by default
      stroke: null,
      strokeWidth: 0,
      // Allow movement and editing
      lockMovementX: false,
      lockMovementY: false,
      lockRotation: true,
      lockScalingX: false,
      lockScalingY: false,
      name: `ocr-text-${index}`,
      isOCRText: true,
      ocrData: word,
      // Ensure it's selectable and editable
      selectable: true,
      evented: true,
      editable: true,
      // No shadow - text should blend with image
      shadow: null,
      // Make text align naturally
      originX: 'left',
      originY: 'top',
      // Better text rendering
      objectCaching: false, // Disable caching for dynamic text updates
      statefullCache: false,
      // Hide textbox outline when not editing
      excludeFromExport: false,
      // Per-pixel detection for better accuracy
      perPixelTargetFind: true,
      targetFindTolerance: 5
    });
    
    // Show VERY subtle indicator only when actively selected/editing
    // Use minimal visual indicators to maintain seamless integration
    textbox.on('selected', function() {
      this.set({
        hasBorders: true,
        hasControls: true,
        borderColor: 'rgba(74, 144, 226, 0.4)', // Very subtle
        cornerColor: '#4A90E2',
        cornerSize: 5,
        stroke: 'rgba(74, 144, 226, 0.2)', // Very light stroke
        strokeWidth: 1,
        transparentCorners: false
      });
      canvas.renderAll();
    });
    
    textbox.on('deselected', function() {
      this.set({
        hasBorders: false,
        hasControls: false,
        borderColor: 'transparent',
        cornerColor: 'transparent',
        cornerSize: 0,
        stroke: null,
        strokeWidth: 0,
        transparentCorners: true
      });
      canvas.renderAll();
    });
    
    // Show indicator only when actively editing
    textbox.on('editing:entered', function() {
      this.set({
        hasBorders: true,
        hasControls: true,
        borderColor: 'rgba(74, 144, 226, 0.6)', // Slightly more visible when editing
        cornerColor: '#4A90E2',
        cornerSize: 6,
        stroke: 'rgba(74, 144, 226, 0.3)',
        strokeWidth: 1.5,
        transparentCorners: false
      });
      canvas.renderAll();
    });
    
    // Hide indicator when exiting edit mode - back to invisible
    textbox.on('editing:exited', function() {
      // Only hide if not selected
      if (!this.isSelected) {
        this.set({
          hasBorders: false,
          hasControls: false,
          borderColor: 'transparent',
          cornerColor: 'transparent',
          cornerSize: 0,
          stroke: null,
          strokeWidth: 0,
          transparentCorners: true
        });
      } else {
        // If still selected, restore selection appearance
        this.set({
          hasBorders: true,
          hasControls: true,
          borderColor: 'rgba(74, 144, 226, 0.4)',
          cornerColor: '#4A90E2',
          cornerSize: 5,
          stroke: 'rgba(74, 144, 226, 0.2)',
          strokeWidth: 1,
          transparentCorners: false
        });
      }
      canvas.renderAll();
    });
    
    // Add double-click to edit handler
    textbox.on('mousedown', function(options) {
      if (options.e.detail === 2) { // Double click
        textbox.enterEditing();
        textbox.selectAll();
      }
    });
    
    // NO hover effect - text should be completely invisible until selected
    // This makes edited text appear seamlessly integrated into the image
    // User can still click to select, but no visual indication on hover
    
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

// Normalize backend OCR payload into { text: { words: [{ text, bbox:{x,y,width,height}}] }, objects: [...] , _raw }
function normalizeOcrPayload(raw) {
  const wordsIn = (raw?.text?.words || raw?.words || raw?.ocr?.words || raw?.texts || []);
  let words = Array.isArray(wordsIn) ? wordsIn.slice() : [];
  if (Array.isArray(raw?.lines) && words.length === 0) {
    try { words = raw.lines.flatMap(l => l.words || []).filter(Boolean); } catch (_) {}
  }
  // Coerce each word into { text, bbox:{x,y,width,height} }
  words = words.map((w) => {
    const text = (w.text ?? w.value ?? w.string ?? w.content ?? '');
    let bbox = w.bbox || w.box || w.bounds || w.rect || w.region || null;
    if (!bbox && Array.isArray(w)) bbox = w; // sometimes raw array
    let outBox = null;
    if (bbox) {
      if (Array.isArray(bbox) && bbox.length >= 4) {
        const x = bbox[0], y = bbox[1], a = bbox[2], d = bbox[3];
        const wv = (a > 0 && d > 0) ? a : Math.max(1, (a - x));
        const hv = (a > 0 && d > 0) ? d : Math.max(1, (d - y));
        outBox = { x, y, width: Math.abs(wv), height: Math.abs(hv) };
      } else if (typeof bbox === 'object') {
        const x = bbox.left ?? bbox.x ?? 0;
        const y = bbox.top ?? bbox.y ?? 0;
        const width = bbox.width ?? Math.max(1, (bbox.right ?? (x + 1)) - x);
        const height = bbox.height ?? Math.max(1, (bbox.bottom ?? (y + 1)) - y);
        outBox = { x, y, width: Math.abs(width), height: Math.abs(height) };
      }
    }
    return { text, bbox: outBox };
  }).filter(w => w && w.text != null && w.bbox);

  const objects = (raw?.objects || raw?.detections || raw?.labels || []).map((o) => {
    let bbox = o.bbox || o.box || o.bounds || o.rect || null;
    if (bbox) {
      if (Array.isArray(bbox) && bbox.length >= 4) {
        const x = bbox[0], y = bbox[1], a = bbox[2], d = bbox[3];
        const wv = (a > 0 && d > 0) ? a : Math.max(1, (a - x));
        const hv = (a > 0 && d > 0) ? d : Math.max(1, (d - y));
        bbox = { x, y, width: Math.abs(wv), height: Math.abs(hv) };
      } else if (typeof bbox === 'object') {
        const x = bbox.left ?? bbox.x ?? 0;
        const y = bbox.top ?? bbox.y ?? 0;
        const width = bbox.width ?? Math.max(1, (bbox.right ?? (x + 1)) - x);
        const height = bbox.height ?? Math.max(1, (bbox.bottom ?? (y + 1)) - y);
        bbox = { x, y, width: Math.abs(width), height: Math.abs(height) };
      }
    }
    return { ...o, bbox };
  }).filter(o => o && o.bbox);

  // Preserve all fields from raw response including baseImage, imageSize, etc.
  return { 
    text: { words }, 
    objects, 
    _raw: raw,
    // Preserve important fields from raw response
    baseImage: raw?.baseImage,
    imageSize: raw?.imageSize,
    homographyApplied: raw?.homographyApplied
  };
}

// Selection-based flow: call when a user selects an image on the canvas or presses Make Editable
export const processImageForEditing = async (imageObject, canvas, updateLayers, saveToHistory) => {
  try {
    if (!imageObject || imageObject.isBackgroundImage) return;
    if (imageObject._ocrProcessed || imageObject._ocrRequested) return;
    imageObject._ocrRequested = true;

    const src = imageObject.getElement?.().src || imageObject.src || imageObject._originalUrl;
    if (!src) {
      imageObject._ocrRequested = false;
      return;
    }

    const file = await fetchImageAsFile(src);
    if (!file) {
      imageObject._ocrRequested = false;
      return;
    }

    // Keep before image (original)
    const beforeDataURL = await toDataURLFromFile(file);

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${BACKEND_URL}/make-editable`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to process image');
    }

    const raw = await response.json();
    const data = normalizeOcrPayload(raw);

    // Attach payload to the image itself for sidebar display
    // Store both normalized data and full raw response for editing
    imageObject._ocrProcessed = true;
    imageObject._beforeDataURL = beforeDataURL;
    imageObject._ocrPayload = {
      ...data,
      _raw: raw, // Store full raw API response
      baseImage: raw.baseImage, // Store base64 cleaned image
      imageSize: raw.imageSize, // Store image dimensions
      homographyApplied: raw.homographyApplied // Store homography flag
    };

    // Enhance word data with color, font, and size information from fabric objects
    // Backend's build_fabric_text_objects_from_lines includes accurate color from estimate_text_color_near_bbox
    // This ensures text properties match the original detected text in the image
    if (raw.objects && Array.isArray(raw.objects) && data.text && data.text.words) {
      raw.objects.forEach((fabricObj) => {
        if (fabricObj.type === 'textbox' && fabricObj.fill) {
          const objLeft = fabricObj.left || 0;
          const objTop = fabricObj.top || 0;
          const objFontSize = fabricObj.fontSize || 12;
          
          // Match fabric objects to words by position and size
          data.text.words.forEach((word) => {
            if (word.bbox) {
              const wordX = word.bbox.x || 0;
              const wordY = word.bbox.y || 0;
              const wordHeight = word.bbox.height || 0;
              
              // Match if positions are close (within 15 pixels) and sizes are similar
              const positionMatch = Math.abs(wordX - objLeft) < 15 && Math.abs(wordY - objTop) < 15;
              const sizeMatch = Math.abs(wordHeight * 0.85 - objFontSize) < 10;
              
              if (positionMatch && sizeMatch) {
                // Add color from backend-estimated color (most accurate)
                if (fabricObj.fill && (!word.color && !word.fill)) {
                  word.color = fabricObj.fill;
                  word.fill = fabricObj.fill;
                }
                // Add font size if available
                if (fabricObj.fontSize && !word.fontSize) {
                  word.fontSize = fabricObj.fontSize;
                }
                // Add font family if available
                if (fabricObj.fontFamily && !word.fontFamily) {
                  word.fontFamily = fabricObj.fontFamily;
                }
              }
            }
          });
        }
      });
    }

    // Replace the original image with the cleaned base image (text removed)
    if (raw.baseImage) {
      try {
        const cleanedImg = await fabric.FabricImage.fromURL(raw.baseImage, { 
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
          _ocrPayload: imageObject._ocrPayload,
          _ocrProcessed: true,
          _beforeDataURL: imageObject._beforeDataURL
        });
        
        // Replace the old image with cleaned one
        canvas.remove(imageObject);
        canvas.add(cleanedImg);
        canvas.setActiveObject(cleanedImg);
        
        // Update reference to the cleaned image
        const updatedImageObject = cleanedImg;
        
        // Add editable text overlays on top of cleaned image
        if (data.text && data.text.words && data.text.words.length) {
          createTextOverlays(data.text.words, updatedImageObject, canvas);
        }
        if (data.objects && data.objects.length) {
          createObjectOverlays(data.objects, updatedImageObject, canvas);
        }
        
        canvas.renderAll();
        updateLayers();
        saveToHistory();
        toast.success(`Image processed! Found ${data.text?.words?.length || 0} text regions`);
        return;
      } catch (error) {
        console.error('Error loading base image:', error);
        // Fallback to original behavior if base image fails to load
      }
    }

    // Fallback: Add overlays directly to canvas relative to the image position/scale
    if (data.text && data.text.words && data.text.words.length) {
      createTextOverlays(data.text.words, imageObject, canvas);
    }
    if (data.objects && data.objects.length) {
      createObjectOverlays(data.objects, imageObject, canvas);
    }

    canvas.setActiveObject(imageObject);
    canvas.renderAll();
    updateLayers();
    saveToHistory();
    toast.success(`Image processed! Found ${data.text?.words?.length || 0} text regions`);
  } catch (error) {
    console.error('Image processing error:', error);
    toast.error('Failed to process image', { description: error.message });
  } finally {
    if (imageObject) imageObject._ocrRequested = false;
  }
};

// Helpers
async function fetchImageAsFile(src) {
  try {
    const res = await fetch(src, { mode: 'cors' });
    const blob = await res.blob();
    const ext = blob.type && blob.type.indexOf('/') > 0 ? blob.type.split('/')[1] : 'png';
    return new File([blob], `selected.${ext}`, { type: blob.type || 'image/png' });
  } catch (_) {
    return null;
  }
}

async function toDataURLFromFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

/**
 * Collect all edited text objects from canvas for a specific image
 * @param {fabric.Object} imageObject - The image object to collect text from
 * @param {fabric.Canvas} canvas - The fabric canvas
 * @returns {Array} Array of text edit objects with position and styling
 */
export const collectEditedText = (imageObject, canvas) => {
  if (!imageObject || !canvas) return [];
  
  const scaleX = imageObject.scaleX || 1;
  const scaleY = imageObject.scaleY || 1;
  const imageLeft = imageObject.left || 0;
  const imageTop = imageObject.top || 0;
  const imageWidth = (imageObject.width || 0) * scaleX;
  const imageHeight = (imageObject.height || 0) * scaleY;
  
  // Get original image dimensions from API response
  const imageSize = imageObject._ocrPayload?.imageSize || imageObject._ocrPayload?._raw?.imageSize;
  const originalWidth = imageSize?.width || imageObject.width || 1080;
  const originalHeight = imageSize?.height || imageObject.height || 1080;
  
  // Calculate scale factors to map canvas coordinates to original image coordinates
  const scaleToOriginalX = originalWidth / imageWidth;
  const scaleToOriginalY = originalHeight / imageHeight;
  
  const textEdits = [];
  const objects = canvas.getObjects();
  
  objects.forEach((obj) => {
    // Only collect OCR text objects that belong to this image
    if (obj.isOCRText && obj.ocrData) {
      // Check if this text is within the image bounds
      const textLeft = obj.left || 0;
      const textTop = obj.top || 0;
      
      // Check if text overlaps with image bounds
      const textRight = textLeft + ((obj.width || 100) * (obj.scaleX || 1));
      const textBottom = textTop + ((obj.height || 30) * (obj.scaleY || 1));
      
      // Check if text is near the image (within reasonable bounds)
      const isNearImage = (
        textRight >= imageLeft - 50 &&
        textLeft <= imageLeft + imageWidth + 50 &&
        textBottom >= imageTop - 50 &&
        textTop <= imageTop + imageHeight + 50
      );
      
      if (isNearImage) {
        // Calculate position relative to image origin
        const relativeX = textLeft - imageLeft;
        const relativeY = textTop - imageTop;
        
        // Map to original image coordinates
        const originalX = relativeX * scaleToOriginalX;
        const originalY = relativeY * scaleToOriginalY;
        
        // Get text dimensions in original coordinates
        const textWidth = ((obj.width || 100) * (obj.scaleX || 1)) * scaleToOriginalX;
        const textHeight = ((obj.height || 30) * (obj.scaleY || 1)) * scaleToOriginalY;
        
        // Get text styling
        const fill = obj.fill || '#000000';
        const fontFamily = obj.fontFamily || 'Arial';
        const fontSize = (obj.fontSize || 32) * scaleToOriginalY; // Scale font size
        const fontWeight = obj.fontWeight || 'normal';
        const opacity = (obj.opacity || 1.0);
        
        textEdits.push({
          text: obj.text || obj.ocrData.text || '',
          bbox: {
            x: Math.max(0, Math.round(originalX)),
            y: Math.max(0, Math.round(originalY)),
            width: Math.max(10, Math.round(textWidth)),
            height: Math.max(10, Math.round(textHeight))
          },
          fill: fill,
          fontFamily: fontFamily,
          fontSize: Math.max(8, Math.round(fontSize)),
          fontWeight: fontWeight,
          opacity: opacity,
          // Keep reference to original OCR data
          originalText: obj.ocrData.text
        });
      }
    }
  });
  
  return textEdits;
};

/**
 * Integrate edited text into image via backend
 * @param {fabric.Object} imageObject - The image object
 * @param {fabric.Canvas} canvas - The fabric canvas
 * @param {Function} updateLayers - Function to update layers
 * @param {Function} saveToHistory - Function to save to history
 * @returns {Promise} Promise that resolves when integration is complete
 */
export const integrateTextToImage = async (imageObject, canvas, updateLayers, saveToHistory) => {
  if (!imageObject || !canvas || imageObject.type !== 'image') {
    throw new Error('Invalid image object');
  }
  
  try {
    // Collect all edited text
    const textEdits = collectEditedText(imageObject, canvas);
    
    if (textEdits.length === 0) {
      toast.info('No text edits to integrate');
      return;
    }
    
    // Get original image source
    const src = imageObject.getElement?.().src || imageObject.src || imageObject._originalUrl;
    if (!src) {
      throw new Error('Cannot get image source');
    }
    
    // Fetch image as file
    const response = await fetch(src, { mode: 'cors' });
    const blob = await response.blob();
    
    // Create form data
    const formData = new FormData();
    formData.append('image', blob, 'image.png');
    formData.append('textEdits', JSON.stringify(textEdits));
    
    // Send to backend
    toast.info('Integrating text into image...');
    
    const integrateResponse = await fetch(`${BACKEND_URL}/integrate-text`, {
      method: 'POST',
      body: formData,
    });
    
    if (!integrateResponse.ok) {
      const errorData = await integrateResponse.json();
      throw new Error(errorData.error || 'Failed to integrate text');
    }
    
    const data = await integrateResponse.json();
    
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
      _ocrProcessed: imageObject._ocrProcessed,
      _beforeDataURL: imageObject._beforeDataURL
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