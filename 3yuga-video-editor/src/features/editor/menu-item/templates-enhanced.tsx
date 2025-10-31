import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Play, Sparkles, Search, Clock, Tag, Layers } from "lucide-react";
import React, { useState, useMemo } from "react";
import { dispatch } from "@designcombo/events";
import { ADD_VIDEO, ADD_TEXT, ADD_AUDIO } from "@designcombo/state";
import { generateId } from "@designcombo/timeline";
import { VideoTemplate } from "./types/video-template.types";
import { 
  filterTemplates, 
  sortTemplates, 
  searchTemplates,
  formatDuration,
  validateTemplate 
} from "./utils/template-utils";
import sampleTemplatesData from "./data/sample-templates.json";

// Load sample templates
const SAMPLE_TEMPLATES: VideoTemplate[] = sampleTemplatesData.templates as VideoTemplate[];

export const TemplatesEnhanced = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<"all" | "full" | "addon">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "duration" | "category">("name");

  // Categories with counts
  const categories = useMemo(() => {
    const allCategories = [
      { id: "all", label: "All Templates", count: SAMPLE_TEMPLATES.length },
      { id: "business", label: "Business", count: 0 },
      { id: "social", label: "Social Media", count: 0 },
      { id: "event", label: "Events", count: 0 },
      { id: "intro", label: "Intros", count: 0 },
      { id: "outro", label: "Outros", count: 0 },
      { id: "abstract", label: "Abstract", count: 0 }
    ];

    // Count templates per category
    SAMPLE_TEMPLATES.forEach(template => {
      const cat = allCategories.find(c => c.id === template.category);
      if (cat) cat.count++;
    });

    return allCategories.filter(c => c.count > 0);
  }, []);

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let templates = SAMPLE_TEMPLATES;

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

  const handleTemplateSelect = (template: VideoTemplate) => {
    console.log("Selected template:", template.name);
    
    // Validate template before applying
    const validation = validateTemplate(template);
    if (!validation.isValid) {
      console.error("Invalid template:", validation.errors);
      alert("This template has validation errors. Please check the console.");
      return;
    }

    // Apply template to timeline
    applyTemplateToTimeline(template);
  };

  const applyTemplateToTimeline = (template: VideoTemplate) => {
    // Add video layers
    template.videoLayers.forEach(layer => {
      dispatch(ADD_VIDEO, {
        payload: {
          id: generateId(),
          details: {
            src: layer.assetUrl
          },
          metadata: {
            name: `${template.name} - Video Layer`,
            start: layer.start,
            end: layer.end,
            position: layer.position,
            scale: layer.scale,
            opacity: layer.opacity,
            blendMode: layer.blendMode
          }
        },
        options: {
          resourceId: "main",
          scaleMode: "fit"
        }
      });
    });

    // Note: Text and audio layers would need corresponding dispatch actions
    // This is a simplified example showing the structure
    console.log("Template applied:", {
      videoLayers: template.videoLayers.length,
      textLayers: template.textLayers.length,
      musicTrack: template.musicTrack ? "Yes" : "No",
      transitions: template.transitions?.length || 0
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium border-b border-border">
        <Sparkles className="h-4 w-4 mr-2" />
        Video Templates
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

      {/* Templates Grid */}
      <ScrollArea className="flex-1 lg:max-h-[calc(100%-280px)] max-h-[500px]">
        <div className="grid grid-cols-1 gap-4 px-4 py-4">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <EnhancedTemplateCard
                key={template.id}
                template={template}
                onSelect={() => handleTemplateSelect(template)}
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
        {filteredTemplates.length > 0 && (
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

const EnhancedTemplateCard = ({
  template,
  onSelect
}: {
  template: VideoTemplate;
  onSelect: () => void;
}) => {
  const [videoError, setVideoError] = useState(false);
  
  // Get first video layer for preview
  const previewVideo = template.videoLayers[0]?.assetUrl;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card hover:border-primary/50 transition-all cursor-pointer">
      <div 
        className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden"
        onClick={onSelect}
      >
        {/* Video preview */}
        {previewVideo && !videoError ? (
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
        
        <Button
          size="sm"
          className="w-full"
          onClick={onSelect}
        >
          {template.isAddOn ? "Add Overlay" : "Use Template"}
        </Button>
      </div>
    </div>
  );
};
