import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, Sparkles, Star, Gift, 
  Circle, Square, Triangle, Heart, Hexagon, 
  ArrowRight, ArrowUp, ArrowDown, ArrowLeft, 
  BarChart3, Upload, ChevronRight 
} from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { addShapeToCanvas, addStickerToCanvas } from "@/features/editor/canvas/shapes/fabric-shapes";

// --- Category & Quick Access definitions (counts will be calculated dynamically) ---

const QUICK_ACCESS = [
  { id: "trending", name: "Trending Now", icon: TrendingUp, gradient: "from-orange-500 to-red-500" },
  { id: "new", name: "New & Noteworthy", icon: Sparkles, gradient: "from-purple-500 to-pink-500" },
  { id: "featured", name: "Featured Collection", icon: Star, gradient: "from-blue-500 to-cyan-500" },
  { id: "seasonal", name: "Seasonal", icon: Gift, gradient: "from-green-500 to-teal-500" }
];

const SHAPES_LIBRARY = {
  basic: [
    { id: "circle", name: "Circle", icon: Circle, color: "#3B82F6" },
    { id: "square", name: "Square", icon: Square, color: "#EF4444" },
    { id: "triangle", name: "Triangle", icon: Triangle, color: "#10B981" },
    { id: "heart", name: "Heart", icon: Heart, color: "#EC4899" },
    { id: "hexagon", name: "Hexagon", icon: Hexagon, color: "#8B5CF6" }
  ],
  arrows: [
    { id: "arrow-right", name: "Right Arrow", icon: ArrowRight, color: "#06B6D4" },
    { id: "arrow-left", name: "Left Arrow", icon: ArrowLeft, color: "#06B6D4" },
    { id: "arrow-up", name: "Up Arrow", icon: ArrowUp, color: "#06B6D4" },
    { id: "arrow-down", name: "Down Arrow", icon: ArrowDown, color: "#06B6D4" }
  ]
};

// --- Stickers ---
const STICKER_COLLECTIONS = [
  {
    category: "Emoji & Reactions",
    items: [
      { id: "happy", preview: "😊", name: "Happy" },
      { id: "love", preview: "❤️", name: "Love" },
      { id: "thumbs-up", preview: "👍", name: "Like" },
      { id: "fire", preview: "🔥", name: "Fire" },
      { id: "star-eyes", preview: "🤩", name: "Amazed" },
      { id: "party", preview: "🎉", name: "Party" }
    ]
  }
];

// --- Calculate actual counts ---
const getTotalShapes = () => {
  return Object.values(SHAPES_LIBRARY).reduce((total, category) => total + category.length, 0);
};

const getTotalStickers = () => {
  return STICKER_COLLECTIONS.reduce((total, collection) => total + collection.items.length, 0);
};

// --- Main Component ---
export const Elements = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Calculate dynamic counts
  const shapesCount = getTotalShapes(); // 9 shapes (5 basic + 4 arrows)
  const stickersCount = getTotalStickers(); // 6 stickers
  const totalCount = shapesCount + stickersCount; // 15 total
  
  // Create categories with actual counts
  const ELEMENT_CATEGORIES = [
    { id: "all", name: "All Elements", count: totalCount },
    { id: "shapes", name: "Shapes", count: shapesCount },
    { id: "stickers", name: "Stickers", count: stickersCount },
  ];

  const handleAddShape = (shape: any) => {
    // Use SVG conversion helper - adds shape as image track item
    addShapeToCanvas(null, shape.id, {
      id: shape.id,
      name: shape.name,
      color: shape.color,
      width: 200,
      height: 200
    });
  };

  const handleAddSticker = (sticker: any) => {
    // Use SVG conversion helper - adds sticker as image track item
    addStickerToCanvas(null, {
      id: sticker.id,
      name: sticker.name,
      preview: sticker.preview,
      size: 150
    });
  };

  return (
    <div className="relative flex flex-col h-full w-[280px] bg-background border-r border-border z-[50] overflow-y-auto overflow-x-hidden">
      {/* Search */}
      <div className="p-3 border-b border-border/50 sticky top-0 bg-background z-[60]">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search elements"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-secondary/30 border-0 focus:bg-background"
          />
        </div>
      </div>

      {/* Quick Access */}
      <div className="px-3 py-2 border-b border-border/50">
        <div className="grid grid-cols-2 gap-1.5">
          {QUICK_ACCESS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className="relative rounded-lg overflow-hidden group hover:ring-2 hover:ring-primary/50 transition-all h-16"
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", item.gradient)} />
                <div className="relative h-full flex items-center px-3 gap-2">
                  <Icon className="h-5 w-5 text-white" />
                  <div className="text-left">
                    <div className="text-white text-xs font-semibold leading-tight">
                      {item.name}
                    </div>
                    <div className="text-white/80 text-[10px]">Explore collection</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div className="px-3 py-2 border-b border-border/50">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {ELEMENT_CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              size="sm"
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
              className="h-7 px-2.5 text-[11px] whitespace-nowrap shrink-0"
            >
              {cat.name}
              <Badge variant="secondary" className="ml-1.5 text-[9px] px-1 py-0 h-3.5">
                {cat.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 px-3 pb-6">
        {/* Show all categories or filtered view */}
        {(selectedCategory === "all" || selectedCategory === "shapes") && (
          <ElementSection 
            title="Shapes" 
            actionText={selectedCategory === "all" ? "See all" : undefined}
            onAction={() => setSelectedCategory("shapes")}
          >
            <div className="grid grid-cols-3 gap-1.5">
              {/* Show only basic shapes in "all" view, show all in "shapes" view */}
              {(selectedCategory === "shapes" 
                ? [...SHAPES_LIBRARY.basic, ...SHAPES_LIBRARY.arrows]
                : SHAPES_LIBRARY.basic
              ).map((shape) => {
                const Icon = shape.icon;
                return (
                  <button
                    key={shape.id}
                    onClick={() => handleAddShape(shape)}
                    className="aspect-square rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all group hover:ring-2 hover:ring-primary/50 flex items-center justify-center"
                  >
                    <Icon className="h-6 w-6" style={{ color: shape.color }} />
                  </button>
                );
              })}
            </div>
          </ElementSection>
        )}

        {(selectedCategory === "all" || selectedCategory === "stickers") && (
          <ElementSection 
            title="Stickers & Emojis" 
            actionText={selectedCategory === "all" ? "View all" : undefined}
            onAction={() => setSelectedCategory("stickers")}
          >
            {STICKER_COLLECTIONS.map((collection) => (
              <div key={collection.category} className="space-y-1.5">
                <div className="text-[10px] font-medium text-muted-foreground">{collection.category}</div>
                <div className="grid grid-cols-6 gap-1">
                  {collection.items.map((sticker) => (
                    <button
                      key={sticker.id}
                      onClick={() => handleAddSticker(sticker)}
                      className="aspect-square rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all group hover:ring-2 hover:ring-primary/50 flex items-center justify-center text-2xl"
                    >
                      <span className="transition-transform group-hover:scale-125">{sticker.preview}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </ElementSection>
        )}

        {/* Upload - only show in "all" view */}
        {selectedCategory === "all" && (
          <div className="mt-6 p-4 bg-secondary/30 rounded-lg text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <h4 className="text-sm font-medium mb-1">Upload Your Own</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Add custom graphics, icons, and illustrations
            </p>
            <Button size="sm" variant="outline">
              <Upload className="h-3 w-3 mr-1.5" />
              Browse Files
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

// --- Section Component ---
interface ElementSectionProps {
  title: string;
  badge?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  children: React.ReactNode;
}

const ElementSection: React.FC<ElementSectionProps> = ({
  title,
  badge,
  actionText,
  onAction,
  children
}) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1.5">
        <h3 className="text-xs font-semibold text-foreground">{title}</h3>
        {badge}
      </div>
      {actionText && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onAction}
          className="h-5 px-2 text-[10px] text-muted-foreground hover:text-foreground"
        >
          {actionText}
          <ChevronRight className="h-2.5 w-2.5 ml-0.5" />
        </Button>
      )}
    </div>
    {children}
  </div>
);
