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

    // Add overlays directly to canvas relative to the image position/scale
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