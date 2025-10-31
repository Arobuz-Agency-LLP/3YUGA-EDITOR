import { IImage, IVideo } from "@designcombo/types";

// Extend the design combo types with our custom properties
declare global {
  namespace DesignCombo {
    interface IImageDetails extends IImage["details"] {
      saturation?: number;
      hue?: number;
      sharpen?: number;
      vibrance?: number;
      vignette?: number;
    }
    
    interface IVideoDetails extends IVideo["details"] {
      saturation?: number;
      hue?: number;
      sharpen?: number;
      vibrance?: number;
      vignette?: number;
    }
  }
}

export {};
