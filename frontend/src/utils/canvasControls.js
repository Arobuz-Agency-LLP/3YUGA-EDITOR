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

// Helper function to convert dataURL to Blob
function dataURLToBlob(dataURL) {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// Helper function to export a Fabric image object to blob
function exportImageObjectToBlob(imageObject) {
  return new Promise((resolve, reject) => {
    try {
      // Get the image element
      const imgElement = imageObject.getElement();
      if (!imgElement) {
        reject(new Error('Image element not found'));
        return;
      }

      // Create a temporary canvas to export the image
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      
      // Set canvas size to match image dimensions (account for scale)
      const actualWidth = (imageObject.width || imgElement.width || 0) * (imageObject.scaleX || 1);
      const actualHeight = (imageObject.height || imgElement.height || 0) * (imageObject.scaleY || 1);
      
      if (actualWidth === 0 || actualHeight === 0) {
        // Fallback: use natural dimensions
        tempCanvas.width = imgElement.naturalWidth || imgElement.width || 800;
        tempCanvas.height = imgElement.naturalHeight || imgElement.height || 600;
      } else {
        tempCanvas.width = actualWidth;
        tempCanvas.height = actualHeight;
      }

      // Draw image on canvas
      ctx.drawImage(imgElement, 0, 0, tempCanvas.width, tempCanvas.height);
      
      // Convert to blob
      tempCanvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      }, 'image/png');
    } catch (error) {
      reject(error);
    }
  });
}

export const processImageForEditing = async (imageObject, canvas, updateLayers, saveToHistory) => {
  if (!imageObject || imageObject.type !== 'image' || !canvas) {
    toast.error('Please select an image to process');
    return;
  }

  // Check if already processed
  if (imageObject.isBackgroundImage) {
    toast.error('Cannot process background images');
    return;
  }

  try {
    // Store original image properties
    const originalLeft = imageObject.left;
    const originalTop = imageObject.top;
    const originalScaleX = imageObject.scaleX || 1;
    const originalScaleY = imageObject.scaleY || 1;
    const originalAngle = imageObject.angle || 0;
    const originalOpacity = imageObject.opacity || 1;
    const originalName = imageObject.name;

    // Export image to blob
    const blob = await exportImageObjectToBlob(imageObject);
    
    // Create FormData and send to backend
    const formData = new FormData();
    formData.append('image', blob, 'image.png');
    formData.append('text_clean_method', 'fill'); // or 'blur'

    const response = await fetch(`${BACKEND_URL}/make-editable`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to process image');
    }

    const data = await response.json();
    console.log('OCR Response:', data);

    // Load cleaned base image
    const cleanedImg = await fabric.FabricImage.fromURL(data.baseImage, { 
      crossOrigin: 'anonymous' 
    });
    
    // Match the current image position and scale
    cleanedImg.set({
      left: originalLeft,
      top: originalTop,
      scaleX: originalScaleX,
      scaleY: originalScaleY,
      angle: originalAngle,
      opacity: originalOpacity,
      name: originalName,
      // Store OCR payload for later use
      _ocrPayload: {
        baseImage: data.baseImage,
        text: data.text,
        objects: data.objects,
        imageSize: data.imageSize,
        _raw: data
      },
      _ocrProcessed: true
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
  } catch (error) {
    console.error('Error processing image for editing:', error);
    toast.error('Failed to process image: ' + (error.message || 'Unknown error'));
  }
};