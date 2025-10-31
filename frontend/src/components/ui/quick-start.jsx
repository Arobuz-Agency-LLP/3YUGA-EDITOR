import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MousePointer, Type, Shapes, Download } from 'lucide-react';
import { Button } from './button';

export const QuickStartGuide = () => {
  const [isVisible, setIsVisible] = useState(!localStorage.getItem('hideQuickStart'));

  const steps = [
    {
      icon: <MousePointer className="w-6 h-6" />,
      title: "Choose a Template",
      description: "Start with a professional template from the left sidebar"
    },
    {
      icon: <Type className="w-6 h-6" />,
      title: "Add Text & Elements",
      description: "Customize with text, shapes, and icons to match your style"
    },
    {
      icon: <Shapes className="w-6 h-6" />,
      title: "Design & Edit",
      description: "Drag, resize, and style elements to create your perfect design"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export & Share",
      description: "Download your creation in high quality PNG format"
    }
  ];

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hideQuickStart', 'true');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Welcome to Vansh Editor!
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Get started with these simple steps
                </p>
              </div>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="icon"
              className="hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={handleClose}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Let's Get Started!
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};