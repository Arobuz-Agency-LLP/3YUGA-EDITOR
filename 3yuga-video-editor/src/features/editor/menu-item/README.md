# 🎬 Video Template System

A comprehensive, production-ready video template system for web-based video editors, similar to Canva or CapCut.

---

## 📚 Documentation Index

### 🚀 Getting Started
1. **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)** - Get up and running in 5 minutes
2. **[VIDEO_TEMPLATE_SYSTEM_SUMMARY.md](../../../VIDEO_TEMPLATE_SYSTEM_SUMMARY.md)** - Complete system overview

### 📖 Detailed Documentation
3. **[VIDEO_TEMPLATE_SYSTEM.md](./VIDEO_TEMPLATE_SYSTEM.md)** - Full technical documentation
4. **[TEMPLATE_STRUCTURE_DIAGRAM.md](./TEMPLATE_STRUCTURE_DIAGRAM.md)** - Visual diagrams and examples

---

## 📁 Project Structure

```
src/features/editor/menu-item/
├── 📄 README.md                          ← You are here
├── 📄 QUICK_START_GUIDE.md               ← Start here!
├── 📄 VIDEO_TEMPLATE_SYSTEM.md           ← Full docs
├── 📄 TEMPLATE_STRUCTURE_DIAGRAM.md      ← Visual guide
│
├── types/
│   └── video-template.types.ts           ← TypeScript interfaces
│
├── data/
│   └── sample-templates.json             ← 4 sample templates
│
├── utils/
│   └── template-utils.ts                 ← Utility functions
│
├── templates.tsx                         ← Original component
└── templates-enhanced.tsx                ← Enhanced component ⭐
```

---

## ⚡ Quick Start

### 1. Import and Use

```typescript
import { TemplatesEnhanced } from './features/editor/menu-item/templates-enhanced';

// In your app
<TemplatesEnhanced />
```

### 2. Load Sample Templates

```typescript
import { VideoTemplate } from './types/video-template.types';
import sampleTemplates from './data/sample-templates.json';

const templates: VideoTemplate[] = sampleTemplates.templates;
```

### 3. Use Utility Functions

```typescript
import { filterTemplates, searchTemplates } from './utils/template-utils';

// Filter by category
const businessTemplates = filterTemplates(templates, { category: "business" });

// Search templates
const results = searchTemplates(templates, "promo");
```

---

## 🎯 What's Included

### ✅ Core Features
- **Full Video Templates**: Complete compositions with multiple layers
- **Add-on Templates**: Intro/outro overlays
- **7 Animation Types**: fadeIn, slideUp, slideDown, typewriter, bounce, zoom, none
- **5 Transition Types**: fade, dissolve, wipe, slide, zoom
- **Music Tracks**: Background audio with fade in/out
- **Flexible Positioning**: Percentage-based positioning system
- **Blend Modes**: normal, multiply, screen, overlay

### ✅ Sample Templates (4 Included)
1. **Business Product Promo** (15s) - Full template with 2 videos, 3 text layers, music
2. **Animated Logo Intro** (5s) - Add-on with logo reveal and typewriter text
3. **Instagram Story** (10s) - Vertical format (9:16) for social media
4. **Event Outro with CTA** (6s) - Add-on with call-to-action

### ✅ UI Component Features
- 🔍 **Real-time Search** - Search by name, description, tags
- 🎨 **Category Filtering** - Filter by business, social, event, intro, outro
- 📊 **Type Filtering** - Full templates vs add-ons
- 🔄 **Sorting** - By name, duration, category
- 🎬 **Video Preview** - Hover to play preview
- 🏷️ **Badge System** - Resolution, aspect ratio, usage indicators
- 📏 **Layer Count** - Shows number of layers
- ⏱️ **Duration Display** - Formatted duration (MM:SS)
- 🏷️ **Tag System** - Visual tags for easy discovery

### ✅ Utility Functions
- `filterTemplates()` - Filter by category, type, aspect ratio, usage
- `sortTemplates()` - Sort by name, duration, category
- `searchTemplates()` - Search by name, description, tags
- `validateTemplate()` - Validate template structure
- `formatDuration()` - Format seconds to MM:SS
- `cloneTemplate()` - Clone template with new ID
- `getTemplateById()` - Get template by ID
- `getUniqueCategories()` - Get all categories
- `getUniqueTags()` - Get all tags

---

## 📊 Template Structure

```typescript
interface VideoTemplate {
  // Basic Info
  id: string;
  name: string;
  description: string;
  category: "business" | "social" | "event" | "education" | "marketing" | "intro" | "outro" | "abstract";
  duration: number; // seconds
  thumbnail: string;
  isAddOn: boolean;
  
  // Display Settings
  aspectRatio?: "16:9" | "9:16" | "1:1" | "4:5";
  resolution?: "HD" | "Full HD" | "4K" | "UHD 4K";
  
  // Content Layers
  videoLayers: VideoLayer[];
  textLayers: TextLayer[];
  
  // Optional Features
  musicTrack?: MusicTrack;
  transitions?: Transition[];
  
  // Metadata
  tags?: string[];
  usage: "free" | "premium";
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 🎨 Animation Types

| Animation | Description | Duration | Best For |
|-----------|-------------|----------|----------|
| `fadeIn` | Gradual opacity increase | 0.5-1s | Subtle entrances |
| `slideUp` | Slides from bottom | 0.5-1s | Headlines, CTAs |
| `slideDown` | Slides from top | 0.5-1s | Announcements |
| `typewriter` | Character-by-character | 1-3s | Dramatic text |
| `bounce` | Bouncing entrance | 0.5-1s | Playful content |
| `zoom` | Scale from small to large | 0.5-1s | Emphasis |
| `none` | No animation | 0s | Static text |

---

## 📐 Aspect Ratios

| Ratio | Use Case | Dimensions | Platform |
|-------|----------|------------|----------|
| 16:9 | Landscape | 1920x1080 | YouTube, TV, Desktop |
| 9:16 | Portrait | 1080x1920 | Instagram Stories, TikTok |
| 1:1 | Square | 1080x1080 | Instagram Feed |
| 4:5 | Portrait | 1080x1350 | Instagram Portrait |

---

## 🔧 Usage Examples

### Example 1: Filter Business Templates

```typescript
import { filterTemplates } from './utils/template-utils';
import sampleTemplates from './data/sample-templates.json';

const templates = sampleTemplates.templates;
const businessTemplates = filterTemplates(templates, {
  category: "business",
  isAddOn: false,
  usage: "free"
});
```

### Example 2: Search Templates

```typescript
import { searchTemplates } from './utils/template-utils';

const results = searchTemplates(templates, "intro");
// Returns templates matching "intro" in name, description, or tags
```

### Example 3: Validate Template

```typescript
import { validateTemplate } from './utils/template-utils';

const { isValid, errors } = validateTemplate(myTemplate);
if (!isValid) {
  console.error("Template validation errors:", errors);
}
```

### Example 4: Apply Template to Timeline

```typescript
const applyTemplate = (template: VideoTemplate) => {
  // Add video layers
  template.videoLayers.forEach(layer => {
    dispatch(ADD_VIDEO, {
      payload: {
        id: generateId(),
        details: { src: layer.assetUrl },
        metadata: {
          start: layer.start,
          end: layer.end,
          position: layer.position,
          scale: layer.scale,
          opacity: layer.opacity
        }
      }
    });
  });

  // Add text layers (requires ADD_TEXT action)
  // Add music track (requires ADD_AUDIO action)
};
```

---

## 📖 Documentation Guide

### For Beginners
1. Start with **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)**
2. Review the sample templates in **[sample-templates.json](./data/sample-templates.json)**
3. Check out **[TEMPLATE_STRUCTURE_DIAGRAM.md](./TEMPLATE_STRUCTURE_DIAGRAM.md)** for visual examples

### For Developers
1. Read **[VIDEO_TEMPLATE_SYSTEM.md](./VIDEO_TEMPLATE_SYSTEM.md)** for complete technical details
2. Review **[video-template.types.ts](./types/video-template.types.ts)** for TypeScript interfaces
3. Explore **[template-utils.ts](./utils/template-utils.ts)** for utility functions
4. Study **[templates-enhanced.tsx](./templates-enhanced.tsx)** for implementation examples

### For Designers
1. Check **[TEMPLATE_STRUCTURE_DIAGRAM.md](./TEMPLATE_STRUCTURE_DIAGRAM.md)** for visual layouts
2. Review sample templates in **[sample-templates.json](./data/sample-templates.json)**
3. See animation types and timing in **[VIDEO_TEMPLATE_SYSTEM.md](./VIDEO_TEMPLATE_SYSTEM.md)**

---

## 🎯 Sample Templates Overview

### 1. Business Product Promo
- **Type**: Full Template
- **Duration**: 15 seconds
- **Layers**: 2 videos, 1 image, 3 text layers
- **Features**: Music, transitions, logo overlay
- **Use Case**: Product launches, service promotions

### 2. Animated Logo Intro
- **Type**: Add-on (Intro)
- **Duration**: 5 seconds
- **Layers**: 1 video, 1 image, 1 text layer
- **Features**: Typewriter animation, dramatic music
- **Use Case**: YouTube intros, brand videos

### 3. Instagram Story Template
- **Type**: Full Template
- **Duration**: 10 seconds
- **Aspect Ratio**: 9:16 (vertical)
- **Layers**: 1 video, 2 text layers
- **Features**: Bounce animations, trendy music
- **Use Case**: Instagram Stories, TikTok

### 4. Event Outro with CTA
- **Type**: Add-on (Outro)
- **Duration**: 6 seconds
- **Layers**: 1 video, 3 text layers
- **Features**: Call-to-action, fade transitions
- **Use Case**: Event videos, YouTube outros

---

## 🚀 Next Steps

### Immediate Actions
1. ✅ Review **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)**
2. ✅ Test the enhanced component: `templates-enhanced.tsx`
3. ✅ Explore sample templates: `data/sample-templates.json`

### Integration Tasks
1. 🔧 Connect template application to your timeline system
2. 🔧 Implement ADD_TEXT and ADD_AUDIO dispatch actions
3. 🔧 Add transition support to your video player
4. 🔧 Create thumbnail images for templates

### Future Enhancements
1. 💡 Allow users to create custom templates
2. 💡 Add template marketplace
3. 💡 Implement AI-powered template generation
4. 💡 Add collaboration features
5. 💡 Create template versioning system

---

## 🤝 Support & Resources

### Documentation Files
- **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)** - 5-minute quick start
- **[VIDEO_TEMPLATE_SYSTEM.md](./VIDEO_TEMPLATE_SYSTEM.md)** - Complete documentation
- **[TEMPLATE_STRUCTURE_DIAGRAM.md](./TEMPLATE_STRUCTURE_DIAGRAM.md)** - Visual diagrams
- **[VIDEO_TEMPLATE_SYSTEM_SUMMARY.md](../../../VIDEO_TEMPLATE_SYSTEM_SUMMARY.md)** - System overview

### Code Files
- **[video-template.types.ts](./types/video-template.types.ts)** - TypeScript interfaces
- **[template-utils.ts](./utils/template-utils.ts)** - Utility functions
- **[templates-enhanced.tsx](./templates-enhanced.tsx)** - Enhanced UI component
- **[sample-templates.json](./data/sample-templates.json)** - Sample data

### External Resources
- [Canva Templates](https://www.canva.com/templates/)
- [CapCut Templates](https://www.capcut.com/templates)
- [Mixkit Free Videos](https://mixkit.co/free-stock-video/)

---

## 💡 Key Benefits

✨ **Type-Safe**: Full TypeScript support with comprehensive interfaces  
✨ **Flexible**: Support for any template type (full, intro, outro)  
✨ **Extensible**: Easy to add new features and animations  
✨ **Production-Ready**: 4 sample templates included and tested  
✨ **Well-Documented**: Complete documentation with examples  
✨ **Modern UI**: Beautiful, responsive component with search and filters  
✨ **Performance**: Optimized filtering, sorting, and rendering  
✨ **Developer-Friendly**: Clean code structure and utility functions  

---

## 📝 License

This template system is designed for use in the 3yuga Video Editor project.  
Sample videos are from Mixkit (free license).

---

**Ready to create amazing video templates! 🎬✨**

For questions or issues, refer to the documentation files listed above.
