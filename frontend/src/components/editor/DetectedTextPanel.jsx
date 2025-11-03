import React, { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext.tsx';
import { processImageForEditing } from '../../utils/canvasControls';

const DetectedTextPanel = () => {
  const { canvas, activeObject, updateLayers, saveToHistory } = useEditor();
  const [busy, setBusy] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  let group = null;
  if (activeObject) {
    if (activeObject.type === 'group' && activeObject.name === 'editable-image-group') {
      group = activeObject;
    } else if (activeObject.isOCRText && activeObject.group && activeObject.group.name === 'editable-image-group') {
      group = activeObject.group;
    }
  }
  // Fallback: find first editable image group on canvas
  if (!group && canvas) {
    group = canvas.getObjects().find(o => o.type === 'group' && o.name === 'editable-image-group');
  }

  // Determine payload source: group or active image
  const sourceObj = group || ((activeObject && activeObject.type === 'image') ? activeObject : null);
  let words = sourceObj && sourceObj._ocrPayload && sourceObj._ocrPayload.text && Array.isArray(sourceObj._ocrPayload.text.words)
    ? sourceObj._ocrPayload.text.words
    : [];
  if (words.length === 0 && sourceObj && sourceObj._ocrPayload && sourceObj._ocrPayload._raw) {
    const raw = sourceObj._ocrPayload._raw;
    words = raw?.words || raw?.texts || raw?.ocr?.words || [];
    if (Array.isArray(raw?.lines) && words.length === 0) {
      try { words = raw.lines.flatMap(l => l.words || []).filter(Boolean); } catch (_) {}
    }
  }

  const focusWord = (word) => {
    if (!canvas || !group) return;
    const target = canvas.getObjects().find(o => {
      if (!(o && o.isOCRText && o.ocrData && o.ocrData.text === word.text)) return false;
      // If we have a group, prefer overlays that belong to the same group
      if (group) return o.group === group;
      return true;
    });
    if (target) {
      canvas.setActiveObject(target);
      canvas.requestRenderAll();
    }
  };

  if (!group) {
    // If an image is selected but not yet processed, offer detection
    if (activeObject && activeObject.type === 'image' && !activeObject.isBackgroundImage) {
      const runDetect = async () => {
        if (!canvas) return;
        try {
          setBusy(true);
          await processImageForEditing(activeObject, canvas, updateLayers, saveToHistory);
          setRefreshKey((k) => k + 1);
        } finally {
          setBusy(false);
        }
      };
      return (
        <div className="text-center py-8">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">No detected text yet for this image.</p>
          <button
            onClick={runDetect}
            disabled={busy}
            className={`px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 ${busy ? 'opacity-60 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-800'} text-slate-700 dark:text-slate-200`}
          >
            {busy ? 'Detecting…' : 'Detect Text Now'}
          </button>
        </div>
      );
    }
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        <p className="text-sm">Select an editable image group to view detected text</p>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        <p className="text-sm">No detected text for this image</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-500 dark:text-slate-400">{words.length} items</div>
      <div className="space-y-2">
        {words.map((w, idx) => (
          <button
            key={`${w.text}-${idx}`}
            onClick={() => focusWord(w)}
            className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            title={`x:${w.bbox?.x}, y:${w.bbox?.y}, w:${w.bbox?.width}, h:${w.bbox?.height}`}
          >
            <div className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{w.text || '(empty)'}</div>
            {w.bbox && (
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{Math.round(w.bbox.x)}, {Math.round(w.bbox.y)} • {Math.round(w.bbox.width)}×{Math.round(w.bbox.height)}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DetectedTextPanel;


