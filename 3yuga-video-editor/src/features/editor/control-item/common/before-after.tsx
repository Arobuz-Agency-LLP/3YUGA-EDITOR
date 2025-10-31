import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface BeforeAfterProps {
  beforeImageUrl?: string;
  afterImageUrl?: string;
  beforeVideoUrl?: string;
  afterVideoUrl?: string;
  title?: string;
  filters?: {
    saturation?: number;
    hue?: number;
    brightness?: number;
    contrast?: number;
    blur?: number;
    temperature?: number;
    highlights?: number;
    shadows?: number;
    clarity?: number;
    motionBlur?: number;
    vibrance?: number;
    sharpen?: number;
    vignette?: number;
  };
}

export const BeforeAfterComparison: React.FC<BeforeAfterProps> = ({
  beforeImageUrl,
  afterImageUrl,
  beforeVideoUrl,
  afterVideoUrl,
  title = "Before & After",
  filters = {}
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isVideo, setIsVideo] = useState(!!beforeVideoUrl || !!afterVideoUrl);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, newPosition)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newPosition =
      ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, newPosition)));
  };

  const mediaUrl = isVideo ? beforeVideoUrl : beforeImageUrl;
  const afterMediaUrl = isVideo ? afterVideoUrl : afterImageUrl;

  // Generate filter string from properties
  const generateFilterString = () => {
    const saturation = filters.saturation ?? 100;
    const hue = (filters.hue ?? 0) + ((filters.temperature ?? 0) * 0.5);
    const brightness = filters.brightness ?? 100;
    const contrast = filters.contrast ?? 100;
    const blur = filters.blur ?? 0;

    return `saturate(${saturation}%) hue-rotate(${hue}deg) brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px)`;
  };

  if (!mediaUrl || !afterMediaUrl) {
    return (
      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          No media to compare
        </p>
      </div>
    );
  }

  const filterStyle = generateFilterString();

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVideo(!isVideo)}
          className="text-xs h-7"
        >
          {isVideo ? (
            <>
              <Eye className="w-3 h-3 mr-1" /> Image
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3 mr-1" /> Video
            </>
          )}
        </Button>
      </div>

      <div
        className="relative w-full bg-muted rounded-lg overflow-hidden cursor-col-resize group"
        style={{ aspectRatio: "16/9" }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* After Media (Background) - WITH FILTERS */}
        <div className="absolute inset-0" style={{ filter: filterStyle }}>
          {isVideo ? (
            <video
              src={afterMediaUrl}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              autoPlay
              muted
              loop
            />
          ) : (
            <img
              src={afterMediaUrl}
              alt="After"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          )}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
        </div>

        {/* Before Media (Sliding Overlay) - NO FILTERS */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          {isVideo ? (
            <video
              src={mediaUrl}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              autoPlay
              muted
              loop
              style={{ width: `${(100 / sliderPosition) * 100}%` }}
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Before"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              style={{ width: `${(100 / sliderPosition) * 100}%` }}
            />
          )}
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-75"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
              <div className="flex gap-0.5">
                <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
                <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
                <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Before
        </div>
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          After
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Drag the slider to compare effects
      </p>
    </div>
  );
};

export default BeforeAfterComparison;
