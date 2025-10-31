import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, Lock, Unlock, Eye, EyeOff, Group, Ungroup, RotateCw, FlipHorizontal, FlipVertical, Layers, Palette, Type, Image as ImageIcon, Crop } from 'lucide-react';

const ContextMenu = ({ isVisible, position, onClose, activeObject, onAction }) => {
  if (!isVisible) return null;

  const menuItems = [
    { id: 'duplicate', label: 'Duplicate', icon: Copy, shortcut: 'Ctrl+D' },
    { id: 'delete', label: 'Delete', icon: Trash2, shortcut: 'Del', danger: true },
    { type: 'separator' },
    { id: 'lock', label: activeObject?.selectable === false ? 'Unlock' : 'Lock', icon: activeObject?.selectable === false ? Unlock : Lock },
    { id: 'visibility', label: activeObject?.visible === false ? 'Show' : 'Hide', icon: activeObject?.visible === false ? Eye : EyeOff },
    { type: 'separator' },
    { id: 'bringToFront', label: 'Bring to Front', icon: Layers },
    { id: 'sendToBack', label: 'Send to Back', icon: Layers },
    { type: 'separator' },
    { id: 'flipHorizontal', label: 'Flip Horizontal', icon: FlipHorizontal },
    { id: 'flipVertical', label: 'Flip Vertical', icon: FlipVertical },
    { id: 'rotate90', label: 'Rotate 90°', icon: RotateCw },
  ];

  // Add image-specific options
  if (activeObject?.type === 'image') {
    menuItems.splice(-3, 0, 
      { id: 'crop', label: 'Crop Image', icon: Crop },
      { id: 'fillWithImage', label: 'Fill Shape', icon: ImageIcon },
      { id: 'setBackground', label: 'Set as Background', icon: ImageIcon },
      { type: 'separator' }
    );
  }

  // Add text-specific options
  if (activeObject?.type === 'textbox') {
    menuItems.splice(-3, 0,
      { id: 'editText', label: 'Edit Text', icon: Type },
      { id: 'textColor', label: 'Change Color', icon: Palette },
      { type: 'separator' }
    );
  }

  const handleItemClick = (itemId) => {
    onAction(itemId);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        className="fixed z-50 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 min-w-48 max-h-80 overflow-y-auto"
        style={{
          left: position.x,
          top: position.y,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {menuItems.map((item, index) => {
          if (item.type === 'separator') {
            return <div key={index} className="h-px bg-slate-200 dark:bg-slate-700 my-1 mx-2" />;
          }

          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                item.danger ? 'text-red-600 hover:text-red-700' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.shortcut && (
                <span className="text-xs text-slate-400 dark:text-slate-500">{item.shortcut}</span>
              )}
            </button>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};

export default ContextMenu;