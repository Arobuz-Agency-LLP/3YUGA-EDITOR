import React, { useState, useMemo } from "react";
import { VideoTemplate } from "./types/video-template.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Layers, Type, Music, Clock, Copy, Trash2, Plus, ChevronRight, Maximize2, Minimize2, Upload, X } from "lucide-react";
import useStore from "../store/use-store";
import { generateId } from "@designcombo/timeline";
import { dispatch } from "@designcombo/events";
import { ADD_ITEMS } from "@designcombo/state";
import { ITrackItem } from "@designcombo/types";
import { DEFAULT_FONT } from "../constants/font";
import { VideoReplacer } from "./template-video-replacer";

interface TemplateEditorProps {
  template: VideoTemplate;
  onBack: () => void;
  onSave: (template: VideoTemplate) => void;
  userVideos?: Array<{ id: string; url: string; name: string; duration?: number }>;
}

export const TemplateEditor = ({ template, onBack, onSave, userVideos = [] }: TemplateEditorProps) => {
  const [editingTemplate, setEditingTemplate] = useState<VideoTemplate>(template);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    template.videoLayers[0]?.id || template.textLayers[0]?.id || null
  );
  const [activeTab, setActiveTab] = useState<"layers" | "properties">("layers");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showVideoReplacer, setShowVideoReplacer] = useState(false);
  const [selectedVideoLayer, setSelectedVideoLayer] = useState<string | null>(null);

  const selectedLayer = useMemo(() => {
    if (!selectedLayerId) return null;
    const videoLayer = editingTemplate.videoLayers.find(l => l.id === selectedLayerId);
    if (videoLayer) return { type: "video", layer: videoLayer };
    const textLayer = editingTemplate.textLayers.find(l => l.id === selectedLayerId);
    if (textLayer) return { type: "text", layer: textLayer };
    if (editingTemplate.musicTrack && selectedLayerId === "music-track") {
      return { type: "music", layer: editingTemplate.musicTrack };
    }
    return null;
  }, [selectedLayerId, editingTemplate]);

  const handleVideoReplace = (newVideoUrl: string, videoLayerId: string) => {
    const updatedTemplate = {
      ...editingTemplate,
      videoLayers: editingTemplate.videoLayers.map((layer) =>
        layer.id === videoLayerId
          ? { ...layer, assetUrl: newVideoUrl }
          : layer
      )
    } as VideoTemplate;
    setEditingTemplate(updatedTemplate);
    setShowVideoReplacer(false);
    setSelectedVideoLayer(null);
  };

  const handleApplyTemplate = () => {
    const newTrackItems: ITrackItem[] = [];

    editingTemplate.videoLayers.forEach((layer, index) => {
      // Use template duration or calculate from layers
      const templateDuration = editingTemplate.duration || Math.max(
        ...editingTemplate.videoLayers.map(l => l.end),
        ...editingTemplate.textLayers.map(l => l.end),
        editingTemplate.musicTrack?.end || 0
      );
      
      // Extend last video layer to fill template duration if needed
      const endTime = index === editingTemplate.videoLayers.length - 1 && layer.end < templateDuration 
        ? templateDuration 
        : layer.end;
      
      const trackItem: any = {
        id: generateId(),
        type: layer.type as "video" | "image",
        display: {
          from: layer.start * 1000,
          to: endTime * 1000
        },
        details: {
          src: layer.assetUrl,
          left: layer.position?.x || 0,
          top: layer.position?.y || 0,
          width: 1000,
          height: 1000,
          opacity: layer.opacity
        },
        metadata: {
          name: `${editingTemplate.name} - Video ${index + 1}`,
          templateId: editingTemplate.id,
          layerId: layer.id,
          blendMode: layer.blendMode
        }
      };
      newTrackItems.push(trackItem);
    });

    editingTemplate.textLayers.forEach((layer, index) => {
      const trackItem: any = {
        id: generateId(),
        type: "text",
        name: `${editingTemplate.name} - Text ${index + 1}`,
        display: {
          from: layer.start * 1000,
          to: layer.end * 1000
        },
        details: {
          text: layer.text,
          fontSize: layer.style?.fontSize || 60,
          color: layer.style?.color || "#ffffff",
          textAlign: layer.style?.textAlign || "center",
          left: layer.position?.x || 0,
          top: layer.position?.y || 0
        },
        metadata: {
          name: `${editingTemplate.name} - Text ${index + 1}`,
          templateId: editingTemplate.id,
          layerId: layer.id,
          animation: layer.animation
        },
        animations: layer.animation ? {
          in: { name: layer.animation, composition: [] },
          out: { name: "none", composition: [] },
          loop: { name: "none", composition: [] },
          timed: { name: "none", composition: [] }
        } : undefined
      };
      newTrackItems.push(trackItem);
    });

    if (editingTemplate.musicTrack) {
      const music = editingTemplate.musicTrack;
      const trackItem: any = {
        id: generateId(),
        type: "audio",
        name: music.name,
        display: {
          from: music.start * 1000,
          to: music.end * 1000
        },
        details: {
          src: music.url,
          volume: (music.volume || 1) * 100
        },
        trim: {
          from: music.start * 1000,
          to: music.end * 1000
        },
        playbackRate: 1,
        metadata: {
          author: "Template Music",
          fadeIn: music.fadeIn,
          fadeOut: music.fadeOut,
          templateId: editingTemplate.id,
          layerId: "music-track"
        }
      };
      newTrackItems.push(trackItem);
    }

    // Dispatch ADD_ITEMS to update StateManager (this is what the timeline reads from)
    console.log("Dispatching ADD_ITEMS with", newTrackItems.length, "items");
    dispatch(ADD_ITEMS, {
      payload: {
        trackItems: newTrackItems
      }
    });
    
    // Force timeline to recalculate layout after items are added
    setTimeout(() => {
      const { timeline } = useStore.getState();
      if (timeline && typeof timeline.renderAll === 'function') {
        try {
          timeline.renderAll();
        } catch (e) {
          console.error("Error rendering timeline:", e);
        }
      }
    }, 50);
    
    alert(`✅ Template "${editingTemplate.name}" applied successfully!`);
    onBack();
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-primary text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
          title="Open template editor"
        >
          <Maximize2 className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Overlay backdrop - only show when modal is expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm pointer-events-none"
        />
      )}

      {/* Template Editor Modal - Slide from right */}
      <div 
        className={`fixed top-0 right-0 h-screen bg-background border-l border-border shadow-2xl z-[9999] transition-all duration-300 ease-in-out flex flex-col ${
          isExpanded ? "w-96" : "w-0"
        } overflow-hidden max-w-full`}
      >
        {/* Header with expand/collapse toggle */}
        <div className="text-text-primary flex h-14 flex-none items-center justify-between px-4 border-b border-border bg-background">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8 flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold truncate">{editingTemplate.name}</h2>
              <p className="text-xs text-muted-foreground truncate">{editingTemplate.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant={editingTemplate.usage === "free" ? "default" : "secondary"} className="text-xs whitespace-nowrap">
              {editingTemplate.usage === "free" ? "FREE" : "PREMIUM"}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8"
            >
              {isExpanded ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Layers */}
          <div className="w-full flex flex-col overflow-hidden">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="w-full rounded-none border-b border-border flex-shrink-0">
                <TabsTrigger value="layers" className="flex-1 text-xs md:text-sm">
                  <Layers className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Layers</span>
                  <span className="sm:hidden">L</span>
                </TabsTrigger>
                <TabsTrigger value="properties" className="flex-1 text-xs md:text-sm">
                  <span className="hidden sm:inline">Details</span>
                  <span className="sm:hidden">D</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="layers" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-3 space-y-2">
                    {editingTemplate.videoLayers.length > 0 && (
                      <div>
                        <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
                          VIDEO
                        </Label>
                        <div className="space-y-1">
                          {editingTemplate.videoLayers.map((layer) => (
                            <LayerItem
                              key={layer.id}
                              layer={layer}
                              isSelected={selectedLayerId === layer.id}
                              onClick={() => setSelectedLayerId(layer.id)}
                              type="video"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {editingTemplate.textLayers.length > 0 && (
                      <div>
                        <Label className="text-xs font-semibold text-muted-foreground mb-2 block mt-3">
                          TEXT
                        </Label>
                        <div className="space-y-1">
                          {editingTemplate.textLayers.map((layer) => (
                            <LayerItem
                              key={layer.id}
                              layer={layer}
                              isSelected={selectedLayerId === layer.id}
                              onClick={() => setSelectedLayerId(layer.id)}
                              type="text"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {editingTemplate.musicTrack && (
                      <div>
                        <Label className="text-xs font-semibold text-muted-foreground mb-2 block mt-3">
                          MUSIC
                        </Label>
                        <LayerItem
                          layer={editingTemplate.musicTrack}
                          isSelected={selectedLayerId === "music-track"}
                          onClick={() => setSelectedLayerId("music-track")}
                          type="music"
                        />
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="properties" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <TemplateInfo template={editingTemplate} />
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between h-12 px-3 border-t border-border bg-muted/30 flex-shrink-0 gap-2">
          <Button variant="outline" onClick={onBack} size="sm" className="flex-1 text-xs">
            Cancel
          </Button>
          <Button 
            onClick={handleApplyTemplate} 
            size="sm" 
            className="flex-1 bg-primary hover:bg-primary/90 text-xs"
          >
            Apply
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(true)}
            className="h-8 w-8 flex-shrink-0"
            title="Minimize editor"
          >
            <Minimize2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Floating Editor Panel for editing properties */}
      {selectedLayer && isExpanded && (
        <div className="fixed bottom-20 right-6 z-[9998] w-72 bg-background border border-border rounded-lg shadow-xl max-h-96 overflow-y-auto">
          <div className="p-3">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              {selectedLayer.type === "text" && <Type className="h-4 w-4" />}
              {selectedLayer.type === "video" && <span>🎬</span>}
              {selectedLayer.type === "music" && <Music className="h-4 w-4" />}
              Edit {selectedLayer.type === "text" ? "Text" : selectedLayer.type === "video" ? "Video" : "Music"}
            </h3>
            <LayerEditor
              selectedLayer={selectedLayer}
              template={editingTemplate}
              setTemplate={setEditingTemplate}
              onVideoReplaceClick={() => {
                if (selectedLayer.type === "video") {
                  setShowVideoReplacer(true);
                  setSelectedVideoLayer((selectedLayer.layer as any).id);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Video Replacer Modal */}
      {showVideoReplacer && selectedVideoLayer && (
        <VideoReplacer
          videoLayer={editingTemplate.videoLayers.find((l) => l.id === selectedVideoLayer) || editingTemplate.videoLayers[0]!}
          userVideos={userVideos}
          onReplace={handleVideoReplace}
          onCancel={() => {
            setShowVideoReplacer(false);
            setSelectedVideoLayer(null);
          }}
        />
      )}
    </>
  );
};

// Layer Item Component
const LayerItem = ({
  layer,
  isSelected,
  onClick,
  type
}: {
  layer: any;
  isSelected: boolean;
  onClick: () => void;
  type: "video" | "text" | "music";
}) => {
  const getLabel = () => {
    if (type === "video") return layer.type === "image" ? "Image" : "Video";
    if (type === "text") return layer.text?.substring(0, 20) || "Text";
    if (type === "music") return layer.name || "Music";
    return "Layer";
  };

  const getIcon = () => {
    if (type === "video") return "🎬";
    if (type === "text") return <Type className="h-3 w-3" />;
    if (type === "music") return <Music className="h-3 w-3" />;
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
        isSelected
          ? "bg-primary/20 border border-primary/50 text-primary"
          : "bg-secondary/50 hover:bg-secondary text-foreground"
      }`}
    >
      <div className="flex items-center gap-2">
        <span>{getIcon()}</span>
        <span className="truncate flex-1">{getLabel()}</span>
      </div>
    </button>
  );
};

// Template Info Component
const TemplateInfo = ({ template }: { template: VideoTemplate }) => {
  return (
    <div className="p-4 space-y-4">
      <div>
        <Label className="text-xs font-semibold">Duration</Label>
        <div className="flex items-center gap-2 mt-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{template.duration}s</span>
        </div>
      </div>

      <div>
        <Label className="text-xs font-semibold">Aspect Ratio</Label>
        <Badge variant="outline" className="mt-1">{template.aspectRatio || "16:9"}</Badge>
      </div>

      <div>
        <Label className="text-xs font-semibold">Resolution</Label>
        <Badge variant="outline" className="mt-1">{template.resolution || "Full HD"}</Badge>
      </div>

      <div>
        <Label className="text-xs font-semibold">Layers</Label>
        <div className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Video Layers:</span>
            <Badge variant="secondary">{template.videoLayers.length}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Text Layers:</span>
            <Badge variant="secondary">{template.textLayers.length}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Music:</span>
            <Badge variant="secondary">{template.musicTrack ? "Yes" : "No"}</Badge>
          </div>
        </div>
      </div>

      {template.tags && template.tags.length > 0 && (
        <div>
          <Label className="text-xs font-semibold mb-2 block">Tags</Label>
          <div className="flex flex-wrap gap-1">
            {template.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Layer Editor Component
const LayerEditor = ({
  selectedLayer,
  template,
  setTemplate,
  onVideoReplaceClick
}: {
  selectedLayer: any;
  template: VideoTemplate;
  setTemplate: (template: VideoTemplate) => void;
  onVideoReplaceClick?: () => void;
}) => {
  if (selectedLayer.type === "text") {
    return <TextLayerEditor layer={selectedLayer.layer} template={template} setTemplate={setTemplate} />;
  } else if (selectedLayer.type === "video") {
    return <VideoLayerEditor layer={selectedLayer.layer} template={template} setTemplate={setTemplate} onReplaceClick={onVideoReplaceClick} />;
  } else if (selectedLayer.type === "music") {
    return <MusicLayerEditor layer={selectedLayer.layer} template={template} setTemplate={setTemplate} />;
  }

  return null;
};

// Text Layer Editor
const TextLayerEditor = ({
  layer,
  template,
  setTemplate
}: {
  layer: any;
  template: VideoTemplate;
  setTemplate: (template: VideoTemplate) => void;
}) => {
  const handleTextChange = (text: string) => {
    const updatedTemplate = {
      ...template,
      textLayers: template.textLayers.map((l) =>
        l.id === layer.id ? { ...l, text } : l
      )
    } as VideoTemplate;
    setTemplate(updatedTemplate);
  };

  const handleColorChange = (color: string) => {
    const updatedTemplate = {
      ...template,
      textLayers: template.textLayers.map((l) =>
        l.id === layer.id
          ? {
              ...l,
              style: { ...l.style, color }
            }
          : l
      )
    } as VideoTemplate;
    setTemplate(updatedTemplate);
  };

  const handleFontSizeChange = (fontSize: number) => {
    const updatedTemplate = {
      ...template,
      textLayers: template.textLayers.map((l) =>
        l.id === layer.id
          ? {
              ...l,
              style: { ...l.style, fontSize }
            }
          : l
      )
    } as VideoTemplate;
    setTemplate(updatedTemplate);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium border-b border-border">
        <Type className="h-4 w-4 mr-2" />
        Edit Text
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Text Content */}
          <div>
            <Label htmlFor="text-content" className="text-sm font-semibold mb-2 block">
              Text Content
            </Label>
            <Input
              id="text-content"
              value={layer.text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Enter text..."
              className="text-sm"
            />
          </div>

          {/* Font Size */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Font Size: {layer.style?.fontSize || 60}px</Label>
            <input
              type="range"
              min="10"
              max="100"
              value={layer.style?.fontSize || 60}
              onChange={(e) => handleFontSizeChange(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Color */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Text Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={layer.style?.color || "#ffffff"}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <Input
                value={layer.style?.color || "#ffffff"}
                onChange={(e) => handleColorChange(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Text Align */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Alignment</Label>
            <div className="flex gap-2">
              {["left", "center", "right"].map((align) => (
                <Button
                  key={align}
                  variant={layer.style?.textAlign === align ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    const updatedTemplate = {
                      ...template,
                      textLayers: template.textLayers.map((l) =>
                        l.id === layer.id
                          ? {
                              ...l,
                              style: { ...l.style, textAlign: align as any }
                            }
                          : l
                      )
                    } as VideoTemplate;
                    setTemplate(updatedTemplate);
                  }}
                >
                  {align.charAt(0).toUpperCase() + align.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Timing */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Timing</Label>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Start: {layer.start}s</Label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="0.1"
                  value={layer.start}
                  onChange={(e) => {
                    const updatedTemplate = {
                      ...template,
                      textLayers: template.textLayers.map((l) =>
                        l.id === layer.id ? { ...l, start: Number(e.target.value) } : l
                      )
                    } as VideoTemplate;
                    setTemplate(updatedTemplate);
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-xs">End: {layer.end}s</Label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="0.1"
                  value={layer.end}
                  onChange={(e) => {
                    const updatedTemplate = {
                      ...template,
                      textLayers: template.textLayers.map((l) =>
                        l.id === layer.id ? { ...l, end: Number(e.target.value) } : l
                      )
                    } as VideoTemplate;
                    setTemplate(updatedTemplate);
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Position</Label>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">X: {layer.position.x}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={layer.position.x}
                  onChange={(e) => {
                    const updatedTemplate = {
                      ...template,
                      textLayers: template.textLayers.map((l) =>
                        l.id === layer.id
                          ? { ...l, position: { ...l.position, x: Number(e.target.value) } }
                          : l
                      )
                    } as VideoTemplate;
                    setTemplate(updatedTemplate);
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-xs">Y: {layer.position.y}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={layer.position.y}
                  onChange={(e) => {
                    const updatedTemplate = {
                      ...template,
                      textLayers: template.textLayers.map((l) =>
                        l.id === layer.id
                          ? { ...l, position: { ...l.position, y: Number(e.target.value) } }
                          : l
                      )
                    } as VideoTemplate;
                    setTemplate(updatedTemplate);
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

// Video Layer Editor
const VideoLayerEditor = ({
  layer,
  template,
  setTemplate,
  onReplaceClick
}: {
  layer: any;
  template: VideoTemplate;
  setTemplate: (template: VideoTemplate) => void;
  onReplaceClick?: () => void;
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium border-b border-border">
        🎬 Edit Video
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Video Source */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Video Source</Label>
            <p className="text-xs text-muted-foreground truncate">{layer.assetUrl}</p>
          </div>

          {/* Replace Video Button */}
          {onReplaceClick && (
            <Button
              variant="outline"
              className="w-full"
              onClick={onReplaceClick}
            >
              <Upload className="h-4 w-4 mr-2" />
              Replace with Your Video
            </Button>
          )}

          {/* Scale */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Scale: {(layer.scale * 100).toFixed(0)}%</Label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={layer.scale}
              onChange={(e) => {
                const updatedTemplate = {
                  ...template,
                  videoLayers: template.videoLayers.map((l) =>
                    l.id === layer.id ? { ...l, scale: Number(e.target.value) } : l
                  )
                } as VideoTemplate;
                setTemplate(updatedTemplate);
              }}
              className="w-full"
            />
          </div>

          {/* Opacity */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Opacity: {(layer.opacity * 100).toFixed(0)}%</Label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={layer.opacity}
              onChange={(e) => {
                const updatedTemplate = {
                  ...template,
                  videoLayers: template.videoLayers.map((l) =>
                    l.id === layer.id ? { ...l, opacity: Number(e.target.value) } : l
                  )
                };
                setTemplate(updatedTemplate);
              }}
              className="w-full"
            />
          </div>

          {/* Timing */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Timing</Label>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Start: {layer.start}s</Label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="0.1"
                  value={layer.start}
                  onChange={(e) => {
                    const updatedTemplate = {
                      ...template,
                      videoLayers: template.videoLayers.map((l) =>
                        l.id === layer.id ? { ...l, start: Number(e.target.value) } : l
                      )
                    };
                    setTemplate(updatedTemplate);
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-xs">End: {layer.end}s</Label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="0.1"
                  value={layer.end}
                  onChange={(e) => {
                    const updatedTemplate = {
                      ...template,
                      videoLayers: template.videoLayers.map((l) =>
                        l.id === layer.id ? { ...l, end: Number(e.target.value) } : l
                      )
                    };
                    setTemplate(updatedTemplate);
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Position</Label>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">X: {layer.position.x}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={layer.position.x}
                  onChange={(e) => {
                    const updatedTemplate = {
                      ...template,
                      videoLayers: template.videoLayers.map((l) =>
                        l.id === layer.id
                          ? { ...l, position: { ...l.position, x: Number(e.target.value) } }
                          : l
                      )
                    } as VideoTemplate;
                    setTemplate(updatedTemplate);
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-xs">Y: {layer.position.y}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={layer.position.y}
                  onChange={(e) => {
                    const updatedTemplate = {
                      ...template,
                      videoLayers: template.videoLayers.map((l) =>
                        l.id === layer.id
                          ? { ...l, position: { ...l.position, y: Number(e.target.value) } }
                          : l
                      )
                    } as VideoTemplate;
                    setTemplate(updatedTemplate);
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Blend Mode */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Blend Mode</Label>
            <select
              value={layer.blendMode || "normal"}
              onChange={(e) => {
                const updatedTemplate = {
                  ...template,
                  videoLayers: template.videoLayers.map((l) =>
                    l.id === layer.id ? { ...l, blendMode: e.target.value as any } : l
                  )
                };
                setTemplate(updatedTemplate);
              }}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
            >
              <option value="normal">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
            </select>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

// Music Layer Editor
const MusicLayerEditor = ({
  layer,
  template,
  setTemplate
}: {
  layer: any;
  template: VideoTemplate;
  setTemplate: (template: VideoTemplate) => void;
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium border-b border-border">
        <Music className="h-4 w-4 mr-2" />
        Edit Music
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Music Name */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Track Name</Label>
            <Input
              value={layer.name}
              onChange={(e) => {
                const updatedTemplate = {
                  ...template,
                  musicTrack: { ...layer, name: e.target.value }
                };
                setTemplate(updatedTemplate);
              }}
              placeholder="Enter track name..."
              className="text-sm"
            />
          </div>

          {/* Music Source */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Audio Source</Label>
            <p className="text-xs text-muted-foreground truncate">{layer.url}</p>
          </div>

          {/* Volume */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Volume: {(layer.volume * 100).toFixed(0)}%</Label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={layer.volume || 1}
              onChange={(e) => {
                const updatedTemplate = {
                  ...template,
                  musicTrack: { ...layer, volume: Number(e.target.value) }
                };
                setTemplate(updatedTemplate);
              }}
              className="w-full"
            />
          </div>

          {/* Timing */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Timing</Label>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Start: {layer.start}s</Label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="0.1"
                  value={layer.start}
                  onChange={(e) => {
                    const updatedTemplate = {
                      ...template,
                      musicTrack: { ...layer, start: Number(e.target.value) }
                    };
                    setTemplate(updatedTemplate);
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-xs">End: {layer.end}s</Label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="0.1"
                  value={layer.end}
                  onChange={(e) => {
                    const updatedTemplate = {
                      ...template,
                      musicTrack: { ...layer, end: Number(e.target.value) }
                    };
                    setTemplate(updatedTemplate);
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Fade Settings */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Fade</Label>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Fade In: {layer.fadeIn}s</Label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={layer.fadeIn || 0}
                  onChange={(e) => {
                    const updatedTemplate = {
                      ...template,
                      musicTrack: { ...layer, fadeIn: Number(e.target.value) }
                    };
                    setTemplate(updatedTemplate);
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-xs">Fade Out: {layer.fadeOut}s</Label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={layer.fadeOut || 0}
                  onChange={(e) => {
                    const updatedTemplate = {
                      ...template,
                      musicTrack: { ...layer, fadeOut: Number(e.target.value) }
                    };
                    setTemplate(updatedTemplate);
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
