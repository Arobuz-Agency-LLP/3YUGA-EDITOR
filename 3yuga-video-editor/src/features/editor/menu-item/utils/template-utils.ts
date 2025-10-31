import { VideoTemplate, TemplateFilters } from "../types/video-template.types";

/**
 * Filter templates based on provided criteria
 */
export const filterTemplates = (
  templates: VideoTemplate[],
  filters: TemplateFilters
): VideoTemplate[] => {
  return templates.filter((template) => {
    // Category filter
    if (filters.category && filters.category !== "all" && template.category !== filters.category) {
      return false;
    }

    // Add-on filter
    if (filters.isAddOn !== undefined && template.isAddOn !== filters.isAddOn) {
      return false;
    }

    // Aspect ratio filter
    if (filters.aspectRatio && template.aspectRatio !== filters.aspectRatio) {
      return false;
    }

    // Usage filter (free/premium)
    if (filters.usage && template.usage !== filters.usage) {
      return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) =>
        template.tags?.includes(tag)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Sort templates by various criteria
 */
export const sortTemplates = (
  templates: VideoTemplate[],
  sortBy: "name" | "duration" | "category" | "createdAt" = "name"
): VideoTemplate[] => {
  return [...templates].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "duration":
        return a.duration - b.duration;
      case "category":
        return a.category.localeCompare(b.category);
      case "createdAt":
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      default:
        return 0;
    }
  });
};

/**
 * Get unique categories from templates
 */
export const getUniqueCategories = (templates: VideoTemplate[]): string[] => {
  const categories = templates.map((t) => t.category);
  return Array.from(new Set(categories));
};

/**
 * Get unique tags from templates
 */
export const getUniqueTags = (templates: VideoTemplate[]): string[] => {
  const allTags = templates.flatMap((t) => t.tags || []);
  return Array.from(new Set(allTags));
};

/**
 * Calculate total duration of all layers in a template
 */
export const calculateTemplateDuration = (template: VideoTemplate): number => {
  const videoLayerEnd = Math.max(
    ...template.videoLayers.map((layer) => layer.end),
    0
  );
  const textLayerEnd = Math.max(
    ...template.textLayers.map((layer) => layer.end),
    0
  );
  const musicEnd = template.musicTrack?.end || 0;

  return Math.max(videoLayerEnd, textLayerEnd, musicEnd);
};

/**
 * Validate template structure
 */
export const validateTemplate = (template: VideoTemplate): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Check required fields
  if (!template.id) errors.push("Template ID is required");
  if (!template.name) errors.push("Template name is required");
  if (!template.category) errors.push("Template category is required");
  if (template.duration <= 0) errors.push("Template duration must be positive");

  // Check layers
  if (template.videoLayers.length === 0 && template.textLayers.length === 0) {
    errors.push("Template must have at least one video or text layer");
  }

  // Validate video layers
  template.videoLayers.forEach((layer, index) => {
    if (!layer.id) errors.push(`Video layer ${index} missing ID`);
    if (!layer.assetUrl) errors.push(`Video layer ${index} missing asset URL`);
    if (layer.start < 0) errors.push(`Video layer ${index} has negative start time`);
    if (layer.end <= layer.start) {
      errors.push(`Video layer ${index} end time must be after start time`);
    }
  });

  // Validate text layers
  template.textLayers.forEach((layer, index) => {
    if (!layer.id) errors.push(`Text layer ${index} missing ID`);
    if (!layer.text) errors.push(`Text layer ${index} missing text content`);
    if (layer.start < 0) errors.push(`Text layer ${index} has negative start time`);
    if (layer.end <= layer.start) {
      errors.push(`Text layer ${index} end time must be after start time`);
    }
  });

  // Validate transitions
  template.transitions?.forEach((transition, index) => {
    if (transition.duration <= 0) {
      errors.push(`Transition ${index} duration must be positive`);
    }
    if (transition.position < 0 || transition.position > template.duration) {
      errors.push(`Transition ${index} position is out of bounds`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Clone a template with a new ID
 */
export const cloneTemplate = (
  template: VideoTemplate,
  newId: string
): VideoTemplate => {
  return {
    ...template,
    id: newId,
    name: `${template.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Format duration for display (e.g., "1:30" for 90 seconds)
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Get template by ID
 */
export const getTemplateById = (
  templates: VideoTemplate[],
  id: string
): VideoTemplate | undefined => {
  return templates.find((t) => t.id === id);
};

/**
 * Search templates by name or description
 */
export const searchTemplates = (
  templates: VideoTemplate[],
  query: string
): VideoTemplate[] => {
  const lowerQuery = query.toLowerCase();
  return templates.filter(
    (template) =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};
