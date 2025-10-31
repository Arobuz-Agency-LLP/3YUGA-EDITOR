import { IImage, IText, ITrackItem } from "@designcombo/types";

export const calculateCropStyles = (
  details: IImage["details"],
  crop: IImage["details"]["crop"]
) => ({
  width: details.width || "100%",
  height: details.height || "auto",
  top: -crop.y || 0,
  left: -crop.x || 0,
  position: "absolute",
  borderRadius: `${Math.min(crop.width, crop.height) * ((details.borderRadius || 0) / 100)}px`
});

export const calculateMediaStyles = (
  details: ITrackItem["details"],
  crop: ITrackItem["details"]["crop"]
) => {
  const filterString = `saturate(${(details as any).saturation ?? 100}%) 
    hue-rotate(${((details as any).hue ?? 0) + ((details as any).temperature ?? 0) * 0.5}deg) 
    brightness(${details.brightness ?? 100}%) 
    contrast(${(details as any).contrast ?? 100}%) 
    blur(${(details as any).blur ?? 0}px)`;
  
  return {
    pointerEvents: "none",
    boxShadow: [
      `0 0 0 ${details.borderWidth}px ${details.borderColor}`,
      details.boxShadow
        ? `${details.boxShadow.x}px ${details.boxShadow.y}px ${details.boxShadow.blur}px ${details.boxShadow.color}`
        : ""
    ]
      .filter(Boolean)
      .join(", "),
    filter: filterString,
    ...calculateCropStyles(details, crop),
    overflow: "hidden"
  } as React.CSSProperties;
};

export const calculateTextStyles = (
  details: IText["details"]
): React.CSSProperties => {
  const filterString = `saturate(${(details as any).saturation ?? 100}%) 
    hue-rotate(${((details as any).hue ?? 0) + ((details as any).temperature ?? 0) * 0.5}deg) 
    brightness(${(details as any).brightness ?? 100}%) 
    contrast(${(details as any).contrast ?? 100}%) 
    blur(${(details as any).blur ?? 0}px)`;
  
  return {
    position: "relative",
    textDecoration: details.textDecoration || "none",
    WebkitTextStroke: `${details.borderWidth}px ${details.borderColor}`, // Outline/stroke color and thickness
    paintOrder: "stroke fill", // Order of painting
    textShadow: details.boxShadow
      ? `${details.boxShadow.x}px ${details.boxShadow.y}px ${details.boxShadow.blur}px ${details.boxShadow.color}`
      : "",
    fontFamily: details.fontFamily || "Arial",
    fontWeight: details.fontWeight || "normal",
    lineHeight: details.lineHeight || "normal",
    letterSpacing: details.letterSpacing || "normal",
    wordSpacing: details.wordSpacing || "normal",
    wordWrap: details.wordWrap || "",
    wordBreak: details.wordBreak || "normal",
    textTransform: details.textTransform || "none",
    fontSize: details.fontSize || "16px",
    textAlign: details.textAlign || "left",
    color: details.color || "#000000",
    backgroundColor: details.backgroundColor || "transparent",
    borderRadius: `${Math.min(details.width, details.height) * ((details.borderRadius || 0) / 100)}px`,
    filter: filterString
  };
};

export const calculateContainerStyles = (
  details: ITrackItem["details"],
  crop: ITrackItem["details"]["crop"] = {},
  overrides: React.CSSProperties = {},
  type?: string
): React.CSSProperties => {
  const filterString = `saturate(${(details as any).saturation ?? 100}%) 
    hue-rotate(${((details as any).hue ?? 0) + ((details as any).temperature ?? 0) * 0.5}deg) 
    brightness(${details.brightness ?? 100}%) 
    contrast(${(details as any).contrast ?? 100}%) 
    blur(${(details as any).blur ?? 0}px)`;
  
  return {
    pointerEvents: "auto",
    top: details.top || 0,
    left: details.left || 0,
    width: crop.width || details.width || "100%",
    height:
      type === "text" || type === "caption"
        ? "max-content"
        : crop.height || details.height || "max-content",
    transform: details.transform || "none",
    opacity: details.opacity !== undefined ? details.opacity / 100 : 1,
    transformOrigin: details.transformOrigin || "center center",
    filter: filterString,
    rotate: details.rotate || "0deg",
    zIndex: details.zIndex || 1,
    ...overrides
  } as React.CSSProperties;
};
