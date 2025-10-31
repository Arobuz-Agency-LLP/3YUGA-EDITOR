import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div className="w-full h-full border-4 border-slate-200 dark:border-slate-700 border-t-indigo-500 rounded-full" />
    </motion.div>
  );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4"
      >
        <LoadingSpinner size="lg" />
        <p className="text-slate-700 dark:text-slate-300 font-medium">{message}</p>
      </motion.div>
    </motion.div>
  );
};

export const TemplateLoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
          <div className="w-full h-40 bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};