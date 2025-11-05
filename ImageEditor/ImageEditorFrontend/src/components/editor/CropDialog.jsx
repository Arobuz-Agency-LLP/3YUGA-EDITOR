import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useEditor } from '../../contexts/EditorContext.tsx';
import { Rect, FabricImage } from 'fabric';

const CropDialog = ({ isOpen, onClose, imageObject }) => {
  const { canvas, saveToHistory, updateLayers } = useEditor();
  const [cropRect, setCropRect] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen && imageObject && canvas) {
      // Hide all other objects
      canvas.getObjects().forEach(obj => {
        if (obj !== imageObject) {
          obj.set({ visible: false });
        }
      });

      // Create crop overlay
      const imgBounds = imageObject.getBoundingRect();
      const margin = 30;
      
      const rect = new Rect({
        left: imgBounds.left + margin,
        top: imgBounds.top + margin,
        width: imgBounds.width - margin * 2,
        height: imgBounds.height - margin * 2,
        fill: 'transparent',
        stroke: '#ffffff',
        strokeWidth: 2,
        strokeDashArray: [8, 4],
        selectable: true,
        hasControls: true,
        hasBorders: true,
        cornerColor: '#ffffff',
        cornerSize: 12,
        cornerStyle: 'rect',
        borderColor: '#ffffff',
        transparentCorners: false,
        lockRotation: true,
        lockUniScaling: false,
        setControlsVisibility: {
          mt: true, // middle top
          mb: true, // middle bottom
          ml: true, // middle left
          mr: true, // middle right
          tl: true, // top left
          tr: true, // top right
          bl: true, // bottom left
          br: true, // bottom right
          mtr: false // rotation control
        }
      });

      setCropRect(rect);
      canvas.add(rect);
      canvas.setActiveObject(rect);
      canvas.renderAll();
    }

    return () => {
      if (cropRect && canvas) {
        canvas.remove(cropRect);
        // Show all objects again
        canvas.getObjects().forEach(obj => {
          obj.set({ visible: true });
        });
        canvas.renderAll();
      }
    };
  }, [isOpen, imageObject, canvas]);

  const applyCrop = async () => {
    if (!imageObject || !canvas || !cropRect) return;

    try {
      const imgBounds = imageObject.getBoundingRect();
      const cropBounds = cropRect.getBoundingRect();
      
      // Calculate crop coordinates
      const scaleX = imageObject.scaleX || 1;
      const scaleY = imageObject.scaleY || 1;
      
      const cropX = Math.max(0, (cropBounds.left - imgBounds.left) / scaleX);
      const cropY = Math.max(0, (cropBounds.top - imgBounds.top) / scaleY);
      const cropWidth = Math.min(imageObject.width, cropBounds.width / scaleX);
      const cropHeight = Math.min(imageObject.height, cropBounds.height / scaleY);

      // Create temporary canvas for cropping
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      const img = imageObject.getElement();

      tempCanvas.width = cropWidth;
      tempCanvas.height = cropHeight;

      // Draw cropped portion
      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );

      // Create new fabric image
      const dataURL = tempCanvas.toDataURL();

      
      FabricImage.fromURL(dataURL, { crossOrigin: 'anonymous' }).then((newImg) => {
        newImg.set({
          left: cropBounds.left,
          top: cropBounds.top,
          scaleX: scaleX,
          scaleY: scaleY
        });

        // Remove original image and crop rect
        canvas.remove(imageObject);
        canvas.remove(cropRect);
        
        // Add new cropped image
        canvas.add(newImg);
        canvas.setActiveObject(newImg);
        
        // Show all objects
        canvas.getObjects().forEach(obj => {
          obj.set({ visible: true });
        });
        
        canvas.renderAll();
        updateLayers();
        saveToHistory();
        onClose();
      });
      
    } catch (error) {
      console.error('Crop failed:', error);
      handleCancel();
    }
  };

  const handleCancel = () => {
    if (cropRect && canvas) {
      canvas.remove(cropRect);
      canvas.getObjects().forEach(obj => {
        obj.set({ visible: true });
      });
      canvas.renderAll();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-40 bg-black/80 p-4"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-white font-medium text-lg">Crop Image</h3>
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              onClick={handleCancel}
              className="text-white hover:bg-gray-800"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={applyCrop}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Apply
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CropDialog;