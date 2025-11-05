import React, { useEffect, useRef, useState } from "react";
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";
import { Sparkles, Brain, Zap, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MindMapping() {
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

  const initialData = {
    elements: [
      {
        type: "ellipse",
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        id: "central-node",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        angle: 0,
        x: 450,
        y: 250,
        strokeColor: "#7c3aed",
        backgroundColor: "#a78bfa",
        width: 200,
        height: 100,
        seed: 1,
        groupIds: [],
        frameId: null,
        roundness: { type: 2 },
        boundElements: [],
        updated: 1,
        link: null,
        locked: false
      },
      {
        type: "text",
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        id: "central-text",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        angle: 0,
        x: 505,
        y: 280,
        strokeColor: "#1e1e1e",
        backgroundColor: "transparent",
        width: 90,
        height: 40,
        seed: 1,
        groupIds: [],
        frameId: null,
        roundness: null,
        boundElements: [],
        updated: 1,
        link: null,
        locked: false,
        fontSize: 28,
        fontFamily: 1,
        text: "3YUGA",
        textAlign: "center",
        verticalAlign: "middle",
        containerId: null,
        originalText: "3YUGA",
        lineHeight: 1.25
      },
      {
        type: "ellipse",
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        id: "node-1",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        angle: 0,
        x: 200,
        y: 100,
        strokeColor: "#0ea5e9",
        backgroundColor: "#38bdf8",
        width: 140,
        height: 80,
        seed: 1,
        groupIds: [],
        frameId: null,
        roundness: { type: 2 },
        boundElements: [],
        updated: 1,
        link: null,
        locked: false
      },
      {
        type: "text",
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        id: "text-1",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        angle: 0,
        x: 225,
        y: 122,
        strokeColor: "#1e1e1e",
        backgroundColor: "transparent",
        width: 90,
        height: 36,
        seed: 1,
        groupIds: [],
        frameId: null,
        roundness: null,
        boundElements: [],
        updated: 1,
        link: null,
        locked: false,
        fontSize: 20,
        fontFamily: 1,
        text: "Strategy",
        textAlign: "center",
        verticalAlign: "middle",
        containerId: null,
        originalText: "Strategy",
        lineHeight: 1.25
      },
      {
        type: "arrow",
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        id: "arrow-1",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        angle: 0,
        x: 340,
        y: 150,
        strokeColor: "#7c3aed",
        backgroundColor: "transparent",
        width: 110,
        height: 120,
        seed: 1,
        groupIds: [],
        frameId: null,
        roundness: { type: 2 },
        boundElements: [],
        updated: 1,
        link: null,
        locked: false,
        startBinding: null,
        endBinding: null,
        lastCommittedPoint: null,
        startArrowhead: null,
        endArrowhead: "arrow",
        points: [[0, 0], [110, 120]]
      },
      {
        type: "ellipse",
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        id: "node-2",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        angle: 0,
        x: 750,
        y: 100,
        strokeColor: "#f59e0b",
        backgroundColor: "#fbbf24",
        width: 140,
        height: 80,
        seed: 1,
        groupIds: [],
        frameId: null,
        roundness: { type: 2 },
        boundElements: [],
        updated: 1,
        link: null,
        locked: false
      },
      {
        type: "text",
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        id: "text-2",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        angle: 0,
        x: 770,
        y: 122,
        strokeColor: "#1e1e1e",
        backgroundColor: "transparent",
        width: 100,
        height: 36,
        seed: 1,
        groupIds: [],
        frameId: null,
        roundness: null,
        boundElements: [],
        updated: 1,
        link: null,
        locked: false,
        fontSize: 20,
        fontFamily: 1,
        text: "Innovation",
        textAlign: "center",
        verticalAlign: "middle",
        containerId: null,
        originalText: "Innovation",
        lineHeight: 1.25
      },
      {
        type: "arrow",
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        id: "arrow-2",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        angle: 0,
        x: 650,
        y: 270,
        strokeColor: "#7c3aed",
        backgroundColor: "transparent",
        width: 100,
        height: -110,
        seed: 1,
        groupIds: [],
        frameId: null,
        roundness: { type: 2 },
        boundElements: [],
        updated: 1,
        link: null,
        locked: false,
        startBinding: null,
        endBinding: null,
        lastCommittedPoint: null,
        startArrowhead: null,
        endArrowhead: "arrow",
        points: [[0, 0], [100, -110]]
      },
      {
        type: "ellipse",
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        id: "node-3",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        angle: 0,
        x: 200,
        y: 400,
        strokeColor: "#10b981",
        backgroundColor: "#34d399",
        width: 140,
        height: 80,
        seed: 1,
        groupIds: [],
        frameId: null,
        roundness: { type: 2 },
        boundElements: [],
        updated: 1,
        link: null,
        locked: false
      },
      {
        type: "text",
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        id: "text-3",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        angle: 0,
        x: 225,
        y: 422,
        strokeColor: "#1e1e1e",
        backgroundColor: "transparent",
        width: 90,
        height: 36,
        seed: 1,
        groupIds: [],
        frameId: null,
        roundness: null,
        boundElements: [],
        updated: 1,
        link: null,
        locked: false,
        fontSize: 20,
        fontFamily: 1,
        text: "Growth",
        textAlign: "center",
        verticalAlign: "middle",
        containerId: null,
        originalText: "Growth",
        lineHeight: 1.25
      },
      {
        type: "arrow",
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        id: "arrow-3",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        angle: 0,
        x: 340,
        y: 440,
        strokeColor: "#7c3aed",
        backgroundColor: "transparent",
        width: 110,
        height: -100,
        seed: 1,
        groupIds: [],
        frameId: null,
        roundness: { type: 2 },
        boundElements: [],
        updated: 1,
        link: null,
        locked: false,
        startBinding: null,
        endBinding: null,
        lastCommittedPoint: null,
        startArrowhead: null,
        endArrowhead: "arrow",
        points: [[0, 0], [110, -100]]
      },
      {
        type: "ellipse",
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        id: "node-4",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        angle: 0,
        x: 750,
        y: 400,
        strokeColor: "#ef4444",
        backgroundColor: "#f87171",
        width: 140,
        height: 80,
        seed: 1,
        groupIds: [],
        frameId: null,
        roundness: { type: 2 },
        boundElements: [],
        updated: 1,
        link: null,
        locked: false
      },
      {
        type: "text",
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        id: "text-4",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        angle: 0,
        x: 770,
        y: 422,
        strokeColor: "#1e1e1e",
        backgroundColor: "transparent",
        width: 100,
        height: 36,
        seed: 1,
        groupIds: [],
        frameId: null,
        roundness: null,
        boundElements: [],
        updated: 1,
        link: null,
        locked: false,
        fontSize: 20,
        fontFamily: 1,
        text: "Excellence",
        textAlign: "center",
        verticalAlign: "middle",
        containerId: null,
        originalText: "Excellence",
        lineHeight: 1.25
      },
      {
        type: "arrow",
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        id: "arrow-4",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        angle: 0,
        x: 650,
        y: 330,
        strokeColor: "#7c3aed",
        backgroundColor: "transparent",
        width: 100,
        height: 90,
        seed: 1,
        groupIds: [],
        frameId: null,
        roundness: { type: 2 },
        boundElements: [],
        updated: 1,
        link: null,
        locked: false,
        startBinding: null,
        endBinding: null,
        lastCommittedPoint: null,
        startArrowhead: null,
        endArrowhead: "arrow",
        points: [[0, 0], [100, 90]]
      }
    ],
    appState: {
      viewBackgroundColor: theme === "dark" ? "#0f0f0f" : "#ffffff",
      currentItemStrokeColor: "#7c3aed",
      currentItemBackgroundColor: "#a78bfa",
      currentItemFillStyle: "solid",
      currentItemStrokeWidth: 2,
      currentItemStrokeStyle: "solid",
      currentItemRoughness: 0,
      currentItemOpacity: 100,
      currentItemFontFamily: 1,
      currentItemFontSize: 20,
      currentItemTextAlign: "center",
      currentItemStrokeSharpness: "round"
    },
    scrollToContent: true
  };

  // Receive from Editor and add a node smoothly
  useEffect(() => {
    try {
      const raw = localStorage.getItem('handoff:editorToMindmap');
      if (!raw) return;
      localStorage.removeItem('handoff:editorToMindmap');
      const data = JSON.parse(raw || '{}');
      if (!excalidrawAPI) return;
      const centerX = 520;
      const centerY = 300;
      const ellipse = {
        id: `mm-${Date.now()}`,
        type: 'ellipse',
        x: centerX - 120,
        y: centerY - 60,
        width: 240,
        height: 120,
        strokeColor: '#4f46e5',
        backgroundColor: '#c7d2fe',
        fillStyle: 'solid',
        strokeWidth: 2,
        roughness: 0,
        opacity: 100,
        angle: 0,
        seed: 1,
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        groupIds: [],
        roundness: { type: 2 },
        boundElements: []
      };
      const text = {
        id: `mm-text-${Date.now()}`,
        type: 'text',
        x: centerX - 80,
        y: centerY - 18,
        width: 160,
        height: 36,
        strokeColor: '#0f172a',
        backgroundColor: 'transparent',
        fillStyle: 'solid',
        strokeWidth: 1,
        roughness: 0,
        opacity: 100,
        angle: 0,
        seed: 1,
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        groupIds: [],
        boundElements: [],
        fontSize: 24,
        fontFamily: 1,
        text: data.kind === 'text' ? (data.text || 'From Editor') : (data.label || 'From Editor'),
        textAlign: 'center',
        verticalAlign: 'middle',
        lineHeight: 1.25
      };
      excalidrawAPI.updateScene({ elements: [...excalidrawAPI.getSceneElements(), ellipse, text] });
    } catch (_) {}
  }, []);

  // Observe localStorage changes across tabs to detect deletions
  useEffect(() => {
    const keysToWatch = new Set(['excali-save', 'handoff:excalidrawSceneToEditor', 'excali-save:ts']);
    const handler = (e) => {
      try {
        if (keysToWatch.has(e.key)) {
          console.debug('[mindmap] storage change', { key: e.key, old: !!e.oldValue, new: !!e.newValue });
        }
      } catch (_) {}
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Top bar to match editor navbar styling */}
      <nav className="h-16 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> 3YUGA Mind Mapping</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              try {
                if (excalidrawAPI) {
                  const mindmapTemplate = {
                    elements: excalidrawAPI.getSceneElements(),
                    appState: excalidrawAPI.getAppState(),
                    timestamp: Date.now()
                  };
                  localStorage.setItem('mindmap-template', JSON.stringify(mindmapTemplate));
                  
                  const payload = {
                    type: 'excalidraw',
                    version: 2,
                    elements: excalidrawAPI.getSceneElements(),
                    appState: excalidrawAPI.getAppState(),
                    // Include files so image elements can be reconstructed in the editor
                    files: excalidrawAPI.getFiles ? excalidrawAPI.getFiles() : undefined
                  };
                  localStorage.setItem('handoff:excalidrawSceneToEditor', JSON.stringify(payload));
                }
              } catch (_) {}
              window.open('/editor', '_blank');
            }}
            className="px-3 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
            title="Send selection to Editor"
          >
            Send to Editor
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-3 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
            title="Toggle theme"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </nav>

      {/* Main content area similar to editor */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="h-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <div style={{ height: "100%", minHeight: "500px" }}>
            <Excalidraw
              excalidrawAPI={(api) => setExcalidrawAPI(api)}
              initialData={initialData}
              theme={theme}
              UIOptions={{
                canvasActions: {
                  changeViewBackgroundColor: true,
                  clearCanvas: true,
                  export: { saveFileToDisk: true, saveAsImage: true },
                  loadScene: true,
                  saveToActiveFile: true,
                  toggleTheme: true
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MindMapping;