import { ISize } from "@designcombo/types";
import { useCallback, useEffect, useRef, useState } from "react";

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

function useZoom(containerRef: React.RefObject<HTMLDivElement>, size: ISize) {
  const [zoom, setZoom] = useState(0.01);
  const currentZoomRef = useRef(0.01);
  const [fitZoom, setFitZoom] = useState(0.01);

  const calculateZoom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const PADDING = 30;
    const containerHeight = container.clientHeight - PADDING;
    const containerWidth = container.clientWidth - PADDING;
    const { width, height } = size;

    const desiredZoom = Math.min(
      containerWidth / width,
      containerHeight / height
    );
    currentZoomRef.current = desiredZoom;
    setZoom(desiredZoom);
    setFitZoom(desiredZoom);
  }, [containerRef, size]);

  useEffect(() => {
    calculateZoom();
  }, [calculateZoom]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(() => {
      calculateZoom();
    });

    resizeObserver.observe(container);

    // Also listen for window resize events
    const handleWindowResize = () => {
      calculateZoom();
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [calculateZoom]);

  const handlePinch = useCallback((e: any) => {
    const deltaY = (e as any).inputEvent.deltaY;
    const changer = deltaY > 0 ? 0.0085 : -0.0085;
    const currentZoom = currentZoomRef.current;
    const newZoom = currentZoom + changer;
    if (newZoom >= MIN_ZOOM && newZoom <= MAX_ZOOM) {
      currentZoomRef.current = newZoom;
      setZoom(newZoom);
    }
  }, []);

  const zoomIn = useCallback(() => {
    const newZoom = Math.min(currentZoomRef.current + ZOOM_STEP, MAX_ZOOM);
    currentZoomRef.current = newZoom;
    setZoom(newZoom);
  }, []);

  const zoomOut = useCallback(() => {
    const newZoom = Math.max(currentZoomRef.current - ZOOM_STEP, MIN_ZOOM);
    currentZoomRef.current = newZoom;
    setZoom(newZoom);
  }, []);

  const zoomToFit = useCallback(() => {
    currentZoomRef.current = fitZoom;
    setZoom(fitZoom);
  }, [fitZoom]);

  const setZoomLevel = useCallback((level: number) => {
    const clampedZoom = Math.max(MIN_ZOOM, Math.min(level, MAX_ZOOM));
    currentZoomRef.current = clampedZoom;
    setZoom(clampedZoom);
  }, []);

  return { 
    zoom, 
    handlePinch, 
    recalculateZoom: calculateZoom,
    zoomIn,
    zoomOut,
    zoomToFit,
    setZoomLevel,
    canZoomIn: zoom < MAX_ZOOM,
    canZoomOut: zoom > MIN_ZOOM
  };
}

export default useZoom;
