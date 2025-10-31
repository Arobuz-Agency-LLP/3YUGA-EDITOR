import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADD_TEXT } from "@designcombo/state";
import { dispatch } from "@designcombo/events";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";
import Draggable from "@/components/shared/draggable";
import { TEXT_ADD_PAYLOAD } from "../constants/payload";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import { 
  Type, 
  Heading1, 
  Heading2, 
  AlignLeft, 
  Sparkles, 
  Search,
  Crown,
  Palette,
  Wand2,
  Plus,
  ChevronRight,
  Clock,
  TrendingUp,
  Star,
  Zap,
  Heart
} from "lucide-react";
import { useState, useMemo } from "react";
import { TextPreset } from "./types/text-preset.types";
import textPresetsData from "./data/text-presets.json";
import fontOptionsData from "./data/font-options.json";
import { DEFAULT_FONT } from "../constants/font";

// Load text presets and fonts
const TEXT_PRESETS: TextPreset[] = textPresetsData.textPresets as TextPreset[];
const FONT_OPTIONS = fontOptionsData.fonts;

export const Texts = () => {
  const isDraggingOverTimeline = useIsDraggingOverTimeline();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSection, setActiveSection] = useState<"default" | "combinations" | "effects">("default");

  // Filter presets by category and search
  const filteredPresets = useMemo(() => {
    let presets = TEXT_PRESETS;

    // Category filter
    if (selectedCategory !== "all") {
      presets = presets.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      presets = presets.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.previewText.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return presets;
  }, [selectedCategory, searchQuery]);

  const handleAddBasicText = (textType?: "heading" | "subheading" | "body") => {
    let textPayload = { ...TEXT_ADD_PAYLOAD, id: nanoid() };
    
    // Customize based on text type
    if (textType === "heading") {
      textPayload = {
        ...textPayload,
        details: {
          ...textPayload.details,
          text: "Add a heading",
          fontSize: 90,
          color: "#FFFFFF",
          textAlign: "center",
          width: 700
        }
      };
    } else if (textType === "subheading") {
      textPayload = {
        ...textPayload,
        details: {
          ...textPayload.details,
          text: "Add a subheading",
          fontSize: 56,
          color: "#B0B0B0",
          textAlign: "center",
          width: 650
        }
      };
    } else if (textType === "body") {
      textPayload = {
        ...textPayload,
        details: {
          ...textPayload.details,
          text: "Add a little bit of body text",
          fontSize: 36,
          color: "#909090",
          textAlign: "left",
          width: 550
        }
      };
    }
    
    dispatch(ADD_TEXT, {
      payload: textPayload,
      options: {}
    });
  };

  const handleAddPresetText = (preset: TextPreset) => {
    const payload = {
      id: nanoid(),
      display: {
        from: 0,
        to: 5000
      },
      type: "text",
      details: {
        text: preset.previewText,
        fontSize: preset.style.fontSize,
        width: preset.width || 600,
        fontUrl: DEFAULT_FONT.url,
        fontFamily: preset.style.fontFamily,
        color: preset.style.color,
        wordWrap: preset.wordWrap || "break-word",
        textAlign: preset.style.textAlign || "center",
        fontWeight: preset.style.fontWeight || "normal",
        letterSpacing: preset.style.letterSpacing || 0,
        lineHeight: preset.style.lineHeight || 1.2,
        textTransform: preset.style.textTransform || "none",
        fontStyle: preset.style.fontStyle || "normal",
        borderWidth: preset.effect?.borderWidth || 0,
        borderColor: preset.effect?.borderColor || "#000000",
        boxShadow: {
          color: preset.effect?.color || "#000000",
          x: preset.effect?.distance || 0,
          y: preset.effect?.distance || 0,
          blur: preset.effect?.blur || 0
        }
      }
    };

    dispatch(ADD_TEXT, {
      payload,
      options: {}
    });
  };
  
  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Main Add Text Button - Canva Style */}
      <div className="p-3 border-b border-border/50">
        <Draggable
          data={TEXT_ADD_PAYLOAD}
          renderCustomPreview={
            <Button className="w-60">
              <Type className="h-4 w-4 mr-2" />
              Add text
            </Button>
          }
          shouldDisplayPreview={!isDraggingOverTimeline}
        >
          <Button
            onClick={handleAddBasicText}
            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add a text box
          </Button>
        </Draggable>
      </div>

      {/* Search Bar */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search fonts and combinations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-secondary/30 border-0 focus:bg-background"
          />
        </div>
      </div>

      {/* Default Text Styles Section */}
      <div className="px-3">
        <div className="text-xs font-semibold text-muted-foreground mb-2">
          Default text styles
        </div>
        
        <div className="space-y-1">
          {/* Add a heading */}
          <button
            onClick={() => handleAddBasicText("heading")}
            className="w-full text-left px-3 py-2.5 rounded hover:bg-secondary/50 transition-colors group"
          >
            <div className="text-2xl font-bold mb-0.5">Add a heading</div>
          </button>

          {/* Add a subheading */}
          <button
            onClick={() => handleAddBasicText("subheading")}
            className="w-full text-left px-3 py-2.5 rounded hover:bg-secondary/50 transition-colors group"
          >
            <div className="text-lg font-semibold text-muted-foreground">Add a subheading</div>
          </button>

          {/* Add body text */}
          <button
            onClick={() => handleAddBasicText("body")}
            className="w-full text-left px-3 py-2.5 rounded hover:bg-secondary/50 transition-colors group"
          >
            <div className="text-sm text-muted-foreground">Add a little bit of body text</div>
          </button>
        </div>
      </div>

      {/* Dynamic Text Section */}
      <div className="mt-4 px-3">
        <div className="text-xs font-semibold text-muted-foreground mb-2">
          Dynamic text
        </div>
        
        <div className="grid grid-cols-2 gap-1.5">
          {/* Captions Card */}
          <button
            className="relative rounded-lg overflow-hidden group hover:ring-2 hover:ring-primary/50 transition-all"
            onClick={() => handleAddBasicText()}
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <div className="bg-background/90 px-2 py-1 rounded text-[10px] font-medium">
                Hello
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <div className="text-white text-xs font-medium">Captions</div>
            </div>
          </button>

          {/* More dynamic options */}
          <button
            className="relative rounded-lg overflow-hidden group hover:ring-2 hover:ring-primary/50 transition-all"
            onClick={() => handleAddBasicText()}
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary/60" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <div className="text-white text-xs font-medium">Timer</div>
            </div>
          </button>
        </div>
      </div>

      {/* Font Combinations - Scrollable */}
      <ScrollArea className="flex-1 mt-4">
        <div className="px-3 pb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-muted-foreground">
              Font combinations
            </div>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              See all
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {/* Trending Badge */}
            <div className="col-span-2 mb-1">
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  <TrendingUp className="h-2.5 w-2.5 mr-1" />
                  Trending
                </Badge>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  <Star className="h-2.5 w-2.5 mr-1" />
                  Popular
                </Badge>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  <Clock className="h-2.5 w-2.5 mr-1" />
                  Recent
                </Badge>
              </div>
            </div>

            {/* Text Style Cards - Canva Style */}
            {filteredPresets.slice(0, 12).map((preset) => (
              <TextStyleCard
                key={preset.id}
                preset={preset}
                onSelect={() => handleAddPresetText(preset)}
              />
            ))}
          </div>

          {/* Effects Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-muted-foreground">
                Text effects
              </div>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                See all
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "shadow", name: "Shadow", gradient: "from-gray-600 to-gray-800" },
                { id: "outline", name: "Outline", gradient: "from-blue-500 to-blue-700" },
                { id: "glow", name: "Glow", gradient: "from-purple-500 to-pink-500" },
                { id: "neon", name: "Neon", gradient: "from-green-400 to-cyan-400", premium: true },
                { id: "3d", name: "3D", gradient: "from-orange-500 to-red-500", premium: true },
                { id: "gradient", name: "Gradient", gradient: "from-violet-500 to-purple-600", premium: true }
              ].map((effect) => (
                <button
                  key={effect.id}
                  className="relative aspect-square rounded-lg overflow-hidden group hover:ring-2 hover:ring-primary/50 transition-all"
                  onClick={() => handleAddBasicText()}
                >
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-80",
                    effect.gradient
                  )} />
                  <div className="relative h-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm drop-shadow-lg">Aa</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-1.5 py-0.5">
                    <div className="text-white text-[9px] font-medium flex items-center justify-between">
                      <span>{effect.name}</span>
                      {effect.premium && <Crown className="h-2.5 w-2.5 text-yellow-400" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

// Canva-style Text Card Component
const TextStyleCard = ({
  preset,
  onSelect
}: {
  preset: TextPreset;
  onSelect: () => void;
}) => {
  return (
    <button
      onClick={onSelect}
      className="relative aspect-[4/3] rounded-lg overflow-hidden bg-secondary/30 hover:bg-secondary/50 transition-all group hover:ring-2 hover:ring-primary/50"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-secondary/20" />
      
      {/* Text Preview */}
      <div className="relative h-full flex flex-col items-center justify-center p-2">
        <div
          className="text-center w-full"
          style={{
            fontSize: `${Math.min(preset.style.fontSize / 5, 14)}px`,
            fontFamily: preset.style.fontFamily,
            fontWeight: preset.style.fontWeight || "normal",
            color: preset.style.color,
            lineHeight: 1.2,
            textTransform: preset.style.textTransform || "none",
            letterSpacing: preset.style.letterSpacing ? `${preset.style.letterSpacing / 10}px` : "normal",
          }}
        >
          {preset.previewText.split(' ').slice(0, 3).join(' ')}
        </div>
      </div>

      {/* Premium Badge */}
      {preset.isPremium && (
        <div className="absolute top-1 right-1">
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-0.5">
            <Crown className="h-2.5 w-2.5 text-yellow-400" />
          </div>
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
    </button>
  );
};