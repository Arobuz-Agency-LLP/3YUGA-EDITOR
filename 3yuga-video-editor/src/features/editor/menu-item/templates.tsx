import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Play, Sparkles, Search, Clock, Layers, Tag, Edit } from "lucide-react";
import React, { useState, useMemo } from "react";
import { generateId } from "@designcombo/timeline";
import { dispatch } from "@designcombo/events";
import { ADD_ITEMS } from "@designcombo/state";
import { VideoTemplate } from "./types/video-template.types";
import { DEFAULT_FONT } from "../constants/font";
import {
  filterTemplates,
  sortTemplates,
  searchTemplates,
  formatDuration,
  validateTemplate
} from "./utils/template-utils";
import sampleTemplatesData from "./data/sample-templates.json";
import useStore from "../store/use-store";
import { ITrackItem } from "@designcombo/types";
import { TemplateEditor } from "./template-editor";

// Load enhanced templates from JSON
const ENHANCED_TEMPLATES: VideoTemplate[] = sampleTemplatesData.templates as VideoTemplate[];

export const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<"all" | "full" | "addon">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "duration" | "category">("name");
  const [editingTemplate, setEditingTemplate] = useState<VideoTemplate | null>(null);

  // Categories with counts for enhanced templates
  const categories = useMemo(() => {
    const allCategories = [
      { id: "all", label: "All Templates", count: ENHANCED_TEMPLATES.length },
      { id: "business", label: "Business", count: 0 },
      { id: "social", label: "Social Media", count: 0 },
      { id: "event", label: "Events", count: 0 },
      { id: "intro", label: "Intros", count: 0 },
      { id: "outro", label: "Outros", count: 0 },
      { id: "technology", label: "Technology", count: 0 },
      { id: "abstract", label: "Abstract", count: 0 },
      { id: "marketing", label: "Marketing", count: 0 }
    ];

    // Count templates per category
    ENHANCED_TEMPLATES.forEach(template => {
      const cat = allCategories.find(c => c.id === template.category);
      if (cat) cat.count++;
    });

    return allCategories.filter(c => c.count > 0);
  }, []);

  // Filter and sort enhanced templates
  const filteredEnhancedTemplates = useMemo(() => {
    let templates = ENHANCED_TEMPLATES;

    // Search filter
    if (searchQuery.trim()) {
      templates = searchTemplates(templates, searchQuery);
    }

    // Category filter
    templates = filterTemplates(templates, {
      category: selectedCategory === "all" ? undefined : selectedCategory,
      isAddOn: selectedType === "all" ? undefined : selectedType === "addon"
    });

    // Sort
    templates = sortTemplates(templates, sortBy);

    return templates;
  }, [selectedCategory, selectedType, searchQuery, sortBy]);

  const handleEnhancedTemplateSelect = (template: VideoTemplate) => {
    console.log("Selected enhanced template:", template.name);

    // Validate template before applying
    const validation = validateTemplate(template);
    if (!validation.isValid) {
      console.error("Invalid template:", validation.errors);
      alert("This template has validation errors. Please check the console.");
      return;
    }

    // Apply template to timeline
    applyEnhancedTemplateToTimeline(template);
  };

  const applyEnhancedTemplateToTimeline = (template: VideoTemplate) => {
    const newTrackItems: ITrackItem[] = [];
    
    // Use template duration or calculate from layers
    const templateDuration = template.duration || Math.max(
      ...template.videoLayers.map(l => l.end),
      ...template.textLayers.map(l => l.end),
      template.musicTrack?.end || 0
    );

    // Add video layers
    template.videoLayers.forEach((layer, index) => {
      // Extend last video layer to fill template duration if needed
      const endTime = index === template.videoLayers.length - 1 && layer.end < templateDuration 
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
          name: `${template.name} - Video ${index + 1}`,
          templateId: template.id,
          layerId: layer.id,
          blendMode: layer.blendMode
        }
      };
      newTrackItems.push(trackItem);
    });

    // Add text layers
    template.textLayers.forEach((layer, index) => {
      const trackItem: any = {
        id: generateId(),
        type: "text",
        name: `${template.name} - Text ${index + 1}`,
        display: {
          from: layer.start * 1000,
          to: layer.end * 1000
        },
        details: {
          text: layer.text,
          fontSize: layer.style?.fontSize || 60,
          color: layer.style?.color || "#ffffff",
          textAlign: layer.style?.textAlign || "center",
          fontFamily: layer.style?.fontFamily || DEFAULT_FONT,
          fontWeight: layer.style?.fontWeight || "normal",
          left: layer.position?.x || 0,
          top: layer.position?.y || 0,
          letterSpacing: layer.style?.letterSpacing,
          lineHeight: layer.style?.lineHeight,
          textTransform: layer.style?.textTransform,
          opacity: layer.style?.opacity,
          textShadow: layer.style?.textShadow,
          textStroke: layer.style?.textStroke,
          gradient: layer.style?.gradient,
          padding: layer.style?.padding,
          borderRadius: layer.style?.borderRadius,
          backgroundColor: layer.style?.backgroundColor,
          rotation: layer.style?.rotation,
          
        },
        metadata: {
          name: `${template.name} - Text ${index + 1}`,
          templateId: template.id,
          layerId: layer.id,
          animation: layer.animation,
          originalStyle: layer.style
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

    // Add music track if present
    if (template.musicTrack) {
      const music = template.musicTrack;
      const audioTrackItem: any = {
        id: generateId(),
        type: "audio",
        name: music.name,
        display: {
          from: music.start * 1000,
          to: music.end * 1000
        },
        details: {
          src: music.url,
          volume: (music.volume || 1) * 100 // Convert 0-1 to 0-100
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
          templateId: template.id,
          layerId: "music-track",
        }
      };
      newTrackItems.push(audioTrackItem);
    }

    // Dispatch ADD_ITEMS to update StateManager (this is what the timeline reads from)
    console.log("Dispatching ADD_ITEMS with", newTrackItems.length, "items");
    dispatch(ADD_ITEMS, {
      payload: {
        trackItems: newTrackItems
      }
    });

    console.log("Template applied:", {
      name: template.name,
      videoLayers: template.videoLayers.length,
      textLayers: template.textLayers.length,
      musicTrack: template.musicTrack ? "Yes" : "No",
      transitions: template.transitions?.length || 0
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

    alert(`✅ Template "${template.name}" applied successfully!\n\n` +
          `Video Layers: ${template.videoLayers.length}\n` +
          `Text Layers: ${template.textLayers.length}\n` +
          `Music: ${template.musicTrack ? "Yes" : "No"}`);
  };

  // If editing template, show the TemplateEditor
  if (editingTemplate) {
    return (
      <TemplateEditor
        template={editingTemplate}
        onBack={() => setEditingTemplate(null)}
        onSave={(template) => {
          setEditingTemplate(null);
        }}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="text-text-primary flex h-12 flex-none items-center justify-between px-4 text-sm font-medium border-b border-border">
        <div className="flex items-center">
          <Sparkles className="h-4 w-4 mr-2" />
          Video Templates
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Type Filter */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={selectedType === "all" ? "default" : "outline"}
            onClick={() => setSelectedType("all")}
            className="text-xs"
          >
            All
          </Button>
          <Button
            size="sm"
            variant={selectedType === "full" ? "default" : "outline"}
            onClick={() => setSelectedType("full")}
            className="text-xs"
          >
            Full Templates
          </Button>
          <Button
            size="sm"
            variant={selectedType === "addon" ? "default" : "outline"}
            onClick={() => setSelectedType("addon")}
            className="text-xs"
          >
            Add-ons
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="text-xs"
            >
              {category.label}
              <Badge variant="secondary" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-background border border-border rounded px-2 py-1 text-xs"
          >
            <option value="name">Name</option>
            <option value="duration">Duration</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      <ScrollArea className="flex-1 lg:max-h-[calc(100%-280px)] max-h-[500px]">
        <div className="grid grid-cols-1 gap-4 px-4 py-4">
          {filteredEnhancedTemplates.length > 0 ? (
            filteredEnhancedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={() => handleEnhancedTemplateSelect(template)}
                onEdit={() => setEditingTemplate(template)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No templates found</p>
              {searchQuery && (
                <p className="text-xs mt-2">Try a different search term</p>
              )}
            </div>
          )}
        </div>

        {/* Coming Soon Message */}
        {filteredEnhancedTemplates.length > 0 && (
          <div className="px-4 py-6 text-center">
            <div className="bg-secondary/50 rounded-lg p-4">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium mb-1">More Templates Coming Soon!</p>
              <p className="text-xs text-muted-foreground">
                We're working on adding more amazing templates for you.
              </p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

// Enhanced Template Card with multi-layer support
const TemplateCard = ({
  template,
  onSelect,
  onEdit
}: {
  template: VideoTemplate;
  onSelect: () => void;
  onEdit: () => void;
}) => {
  const [videoError, setVideoError] = useState(false);

  // Get first video layer for preview
  const previewVideo = template.videoLayers[0]?.assetUrl;
  const isTextOnlyTemplate = template.videoLayers.length === 0 && template.textLayers.length > 0;
  const firstTextLayer = template.textLayers[0];

  // Generate CSS for text effects
  const getTextStyle = (layer: typeof firstTextLayer) => {
    if (!layer?.style) return {};
    
    const style: React.CSSProperties = {
      fontSize: layer.style.fontSize || 48,
      fontFamily: layer.style.fontFamily || 'Inter',
      fontWeight: layer.style.fontWeight || 'bold',
      textAlign: layer.style.textAlign || 'center',
      textTransform: layer.style.textTransform as any || 'none',
      letterSpacing: layer.style.letterSpacing ? `${layer.style.letterSpacing}px` : 'normal',
      lineHeight: layer.style.lineHeight || 1.2,
      whiteSpace: 'pre-wrap',
      padding: '20px',
    };

    // Handle gradient or solid color
    if (layer.style.gradient) {
      const { colors, angle = 45 } = layer.style.gradient;
      const gradientStr = `linear-gradient(${angle}deg, ${colors.join(', ')})`;
      style.background = gradientStr;
      style.WebkitBackgroundClip = 'text';
      style.WebkitTextFillColor = 'transparent';
      style.backgroundClip = 'text';
    } else if (layer.style.color) {
      style.color = layer.style.color;
    }

    // Text stroke
    if (layer.style.textStroke) {
      style.WebkitTextStroke = `${layer.style.textStroke.width}px ${layer.style.textStroke.color}`;
      // For gradient text with stroke, we need to handle it differently
      if (layer.style.gradient) {
        style.paintOrder = 'stroke fill';
      }
    }

    // Text shadow
    if (layer.style.textShadow) {
      const { offsetX, offsetY, blur, color } = layer.style.textShadow;
      style.textShadow = `${offsetX}px ${offsetY}px ${blur}px ${color}`;
    }

    return style;
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card hover:border-primary/50 transition-all cursor-pointer">
      <div
        className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden"
        onClick={onSelect}
      >
        {/* Text-only template preview */}
        {isTextOnlyTemplate ? (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div 
              style={getTextStyle(firstTextLayer)}
              className="max-w-full overflow-hidden"
            >
              {firstTextLayer.text}
            </div>
          </div>
        ) : previewVideo && !videoError ? (
          /* Video preview */
          <video
            src={previewVideo}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="rounded-full bg-primary p-3">
            <Play className="h-6 w-6 text-primary-foreground fill-current" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {template.resolution && (
            <Badge variant="secondary" className="text-xs">
              {template.resolution}
            </Badge>
          )}
          {template.aspectRatio && (
            <Badge variant="outline" className="text-xs bg-black/60 text-white border-white/20">
              {template.aspectRatio}
            </Badge>
          )}
        </div>

        <div className="absolute top-2 left-2 flex gap-1">
          <Badge variant={template.usage === "free" ? "default" : "secondary"} className="text-xs">
            {template.usage === "free" ? "FREE" : "PREMIUM"}
          </Badge>
          {template.isAddOn && (
            <Badge variant="outline" className="text-xs bg-purple-600 text-white border-purple-400">
              ADD-ON
            </Badge>
          )}
          {isTextOnlyTemplate && (
            <Badge variant="outline" className="text-xs bg-gradient-to-r from-pink-500 to-orange-500 text-white border-pink-400">
              TEXT EFFECT
            </Badge>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-sm flex-1">{template.name}</h3>
          <Badge variant="outline" className="text-xs ml-2">
            {template.category}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {template.description}
        </p>

        {/* Template Info */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDuration(template.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Layers className="h-3 w-3" />
            <span>{template.videoLayers.length + template.textLayers.length} layers</span>
          </div>
          {template.musicTrack && (
            <div className="flex items-center gap-1">
              <span>🎵</span>
              <span>Music</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {template.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="h-2 w-2 mr-1" />
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-primary"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {template.isAddOn ? "Add Overlay" : "Use"}
          </Button>
        </div>
      </div>
    </div>
  );
};
