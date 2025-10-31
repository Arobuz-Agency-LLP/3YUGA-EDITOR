import { Player } from "../player";
import { useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import useStore from "../store/use-store";
import StateManager from "@designcombo/state";
import SceneEmpty from "./empty";
import Board from "./board";
import useZoom from "../hooks/use-zoom";
import { SceneInteractions } from "./interactions";
import { SceneRef } from "./scene.types";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

const Scene = forwardRef<
  SceneRef,
  {
    stateManager: StateManager;
  }
>(({ stateManager }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { size, trackItemIds } = useStore();
  const { 
    zoom, 
    handlePinch, 
    recalculateZoom,
    zoomIn,
    zoomOut,
    zoomToFit,
    canZoomIn,
    canZoomOut
  } = useZoom(
    containerRef as React.RefObject<HTMLDivElement>,
    size
  );

  // Expose the recalculateZoom function to parent
  useImperativeHandle(ref, () => ({
    recalculateZoom
  }));

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '=') {
        e.preventDefault();
        zoomIn();
      } else if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault();
        zoomOut();
      } else if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        zoomToFit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, zoomToFit]);

  const zoomPercentage = Math.round(zoom * 100);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        flex: 1,
        overflow: "hidden",
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
      ref={containerRef}
    >
      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 z-50 flex items-center gap-2">
        <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md rounded-lg p-1 border border-white/10 shadow-2xl">
          <Button
            size="sm"
            variant="ghost"
            onClick={zoomOut}
            disabled={!canZoomOut}
            className="h-8 w-8 p-0 hover:bg-white/10 disabled:opacity-30 transition-all"
            title="Zoom Out (Cmd/Ctrl + -)" 
          >
            <ZoomOut className="h-4 w-4 text-white" />
          </Button>
          
          <div className="px-3 min-w-[60px] text-center">
            <span className="text-sm font-medium text-white">{zoomPercentage}%</span>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={zoomIn}
            disabled={!canZoomIn}
            className="h-8 w-8 p-0 hover:bg-white/10 disabled:opacity-30 transition-all"
            title="Zoom In (Cmd/Ctrl + +)"
          >
            <ZoomIn className="h-4 w-4 text-white" />
          </Button>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={zoomToFit}
          className="h-8 w-8 p-0 bg-black/80 backdrop-blur-md hover:bg-white/10 border border-white/10 shadow-2xl transition-all"
          title="Fit to Screen (Cmd/Ctrl + 0)"
        >
          <Maximize2 className="h-4 w-4 text-white" />
        </Button>
      </div>

      {trackItemIds.length === 0 && <SceneEmpty />}
      <div
        style={{
          width: size.width,
          height: size.height,
          background: "#000000",
          transform: `scale(${zoom})`,
          position: "absolute",
          transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)"
        }}
        className="player-container bg-sidebar"
      >
        <div
          style={{
            position: "absolute",
            zIndex: 100,
            pointerEvents: "none",
            width: size.width,
            height: size.height,
            background: "transparent",
            boxShadow: "0 0 0 5000px rgba(17, 17, 17, 0.95)"
          }}
        />
        <Board size={size}>
          <Player />
          <SceneInteractions
            stateManager={stateManager}
            containerRef={containerRef as React.RefObject<HTMLDivElement>}
            zoom={zoom}
            size={size}
          />
        </Board>
      </div>
    </div>
  );
});

Scene.displayName = "Scene";

export default Scene;
