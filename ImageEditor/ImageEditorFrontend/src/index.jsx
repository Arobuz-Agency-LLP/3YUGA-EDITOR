import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// Suppress ResizeObserver loop errors - these are harmless browser warnings
// that occur when ResizeObserver callbacks cause size changes during render cycles
// Must be set up BEFORE React initializes
(function suppressResizeObserverErrors() {
  const resizeObserverLoopErrRe = /ResizeObserver.*loop.*completed.*undelivered/i;
  
  // Helper to check if any argument contains ResizeObserver error
  const isResizeObserverError = (...args) => {
    return args.some(arg => {
      if (typeof arg === 'string') {
        return resizeObserverLoopErrRe.test(arg);
      }
      if (arg && typeof arg === 'object') {
        const message = arg.message || arg.toString?.() || '';
        const stack = arg.stack || '';
        return resizeObserverLoopErrRe.test(message) || resizeObserverLoopErrRe.test(stack);
      }
      return false;
    });
  };
  
  // Override ALL console methods that could log errors
  const consoleMethods = ['error', 'warn', 'log'];
  consoleMethods.forEach(method => {
    const original = console[method];
    console[method] = function (...args) {
      if (isResizeObserverError(...args)) {
        return; // Suppress ResizeObserver loop errors
      }
      original.apply(console, args);
    };
  });

  // Suppress window error events (capture phase - fires first)
  window.addEventListener('error', function handleError(e) {
    const message = e.message || e.toString() || '';
    const filename = e.filename || '';
    if (resizeObserverLoopErrRe.test(message) || resizeObserverLoopErrRe.test(filename)) {
      e.stopImmediatePropagation();
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  // Suppress unhandled promise rejections
  window.addEventListener('unhandledrejection', function handleRejection(e) {
    const message = e.reason?.message || e.reason?.toString() || '';
    if (resizeObserverLoopErrRe.test(message)) {
      e.preventDefault();
      return false;
    }
  }, true);

  // Intercept Error constructor
  const OriginalError = window.Error;
  window.Error = function Error(...args) {
    if (args[0] && typeof args[0] === 'string' && resizeObserverLoopErrRe.test(args[0])) {
      const err = new OriginalError();
      err.message = args[0];
      err.stack = '';
      err.name = 'Error';
      // Return a silent error
      return err;
    }
    return OriginalError.apply(this, args);
  };
  
  // Keep Error.prototype methods
  Object.setPrototypeOf(window.Error, OriginalError);
  window.Error.prototype = OriginalError.prototype;
})();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

