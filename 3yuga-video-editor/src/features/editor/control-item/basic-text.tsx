import { ScrollArea } from "@/components/ui/scroll-area";
import useDataState from "../store/use-data-state";
import { loadFonts } from "../utils/fonts";
import { dispatch } from "@designcombo/events";
import { EDIT_OBJECT } from "@designcombo/state";
import React, { useEffect, useState } from "react";
import { IBoxShadow, IText, ITrackItem } from "@designcombo/types";
import Outline from "./common/outline";
import Shadow from "./common/shadow";
import { TextControls } from "./common/text";
import { ICompactFont, IFont } from "../interfaces/editor";
import { DEFAULT_FONT } from "../constants/font";
import { PresetText } from "./common/preset-text";
import { Animations } from "./common/animations";
import Saturation from "./common/saturation";
import Hue from "./common/hue";
import Sharpen from "./common/sharpen";
import Vibrance from "./common/vibrance";
import Vignette from "./common/vignette";
import Temperature from "./common/temperature";
import Highlights from "./common/highlights";
import Shadows from "./common/shadows";
import Clarity from "./common/clarity";
import MotionBlur from "./common/motion-blur";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import BeforeAfterComparison from "./common/before-after";

interface ITextControlProps {
  color: string;
  colorDisplay: string;
  backgroundColor: string;
  fontSize: number;
  fontSizeDisplay: string;
  fontFamily: string;
  fontFamilyDisplay: string;
  opacityDisplay: string;
  textAlign: string;
  textDecoration: string;
  borderWidth: number;
  borderColor: string;
  opacity: number;
  boxShadow: IBoxShadow;
}

const getStyleNameFromFontName = (fontName: string) => {
  const fontFamilyEnd = fontName.lastIndexOf("-");
  const styleName = fontName
    .substring(fontFamilyEnd + 1)
    .replace("Italic", " Italic");
  return styleName;
};

const BasicText = ({
  trackItem,
  type
}: {
  trackItem: ITrackItem & IText;
  type?: string;
}) => {
  const showAll = !type;
  const [properties, setProperties] = useState<ITextControlProps>({
    color: "#000000",
    colorDisplay: "#000000",
    backgroundColor: "transparent",
    fontSize: 12,
    fontSizeDisplay: "12px",
    fontFamily: "Open Sans",
    fontFamilyDisplay: "Open Sans",
    opacity: 1,
    opacityDisplay: "100%",
    textAlign: "left",
    textDecoration: "none",
    borderWidth: 0,
    borderColor: "#000000",
    boxShadow: {
      color: "#000000",
      x: 0,
      y: 0,
      blur: 0
    }
  });

  const [selectedFont, setSelectedFont] = useState<ICompactFont>({
    family: "Open Sans",
    styles: [],
    default: DEFAULT_FONT,
    name: "Regular"
  });
  const [showComparison, setShowComparison] = useState(false);
  const { compactFonts, fonts } = useDataState();

  useEffect(() => {
    const fontFamily =
      trackItem.details.fontFamily || DEFAULT_FONT.postScriptName;
    const currentFont = fonts.find(
      (font) => font.postScriptName === fontFamily
    );

    if (!currentFont) return;

    const selectedFont = compactFonts.find(
      (font) => font.family === currentFont?.family
    );

    if (!selectedFont) return;

    setSelectedFont({
      ...selectedFont,
      name: getStyleNameFromFontName(currentFont.postScriptName)
    });

    setProperties({
      color: trackItem.details.color || "#ffffff",
      colorDisplay: trackItem.details.color || "#ffffff",
      backgroundColor: trackItem.details.backgroundColor || "transparent",
      fontSize: trackItem.details.fontSize || 62,
      fontSizeDisplay: `${trackItem.details.fontSize || 62}px`,
      fontFamily: selectedFont?.family || "Open Sans",
      fontFamilyDisplay: selectedFont?.family || "Open Sans",
      opacity: trackItem.details.opacity || 1,
      opacityDisplay: `${trackItem.details.opacity.toString() || "100"}%`,
      textAlign: trackItem.details.textAlign || "left",
      textDecoration: trackItem.details.textDecoration || "none",
      borderWidth: trackItem.details.borderWidth || 0,
      borderColor: trackItem.details.borderColor || "#000000",
      boxShadow: trackItem.details.boxShadow || {
        color: "#000000",
        x: 0,
        y: 0,
        blur: 0
      }
    });
  }, [trackItem.id]);

  const handleChangeFontStyle = async (font: IFont) => {
    const fontName = font.postScriptName;
    const fontUrl = font.url;
    const styleName = getStyleNameFromFontName(fontName);
    await loadFonts([
      {
        name: fontName,
        url: fontUrl
      }
    ]);
    setSelectedFont({ ...selectedFont, name: styleName });
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            fontFamily: fontName,
            fontUrl: fontUrl
          }
        }
      }
    });
  };

  const onChangeBorderWidth = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            borderWidth: v
          }
        }
      }
    });
    setProperties((prev) => {
      return {
        ...prev,
        borderWidth: v
      } as ITextControlProps;
    });
  };

  const onChangeBorderColor = (v: string) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            borderColor: v
          }
        }
      }
    });
    setProperties((prev) => {
      return {
        ...prev,
        borderColor: v
      } as ITextControlProps;
    });
  };

  const handleChangeOpacity = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            opacity: v
          }
        }
      }
    });
    setProperties((prev) => {
      return {
        ...prev,
        opacity: v
      } as ITextControlProps;
    }); // Update local state
  };

  const onChangeBoxShadow = (boxShadow: IBoxShadow) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            boxShadow: boxShadow
          }
        }
      }
    });

    setProperties((prev) => {
      return {
        ...prev,
        boxShadow
      } as ITextControlProps;
    });
  };

  const onChangeFontSize = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            fontSize: v
          }
        }
      }
    });
    setProperties((prev) => {
      return {
        ...prev,
        fontSize: v
      } as ITextControlProps;
    });
  };

  const onChangeFontFamily = async (font: ICompactFont) => {
    const fontName = font.default.postScriptName;
    const fontUrl = font.default.url;

    await loadFonts([
      {
        name: fontName,
        url: fontUrl
      }
    ]);
    setSelectedFont({ ...font, name: getStyleNameFromFontName(fontName) });
    setProperties({
      ...properties,
      fontFamily: font.default.family,
      fontFamilyDisplay: font.default.family
    });

    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            fontFamily: fontName,
            fontUrl: fontUrl
          }
        }
      }
    });
  };

  const handleColorChange = (color: string) => {
    setProperties((prev) => {
      return {
        ...prev,
        color: color
      } as ITextControlProps;
    });

    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            color: color
          }
        }
      }
    });
  };

  const handleBackgroundChange = (color: string) => {
    setProperties((prev) => {
      return {
        ...prev,
        backgroundColor: color
      } as ITextControlProps;
    });

    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            backgroundColor: color
          }
        }
      }
    });
  };

  const onChangeSaturation = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            saturation: v
          }
        }
      }
    });
  };

  const onChangeHue = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            hue: v
          }
        }
      }
    });
  };

  const onChangeSharpen = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            sharpen: v
          }
        }
      }
    });
  };

  const onChangeVibrance = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            vibrance: v
          }
        }
      }
    });
  };

  const onChangeVignette = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            vignette: v
          }
        }
      }
    });
  };

  const onChangeTemperature = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            temperature: v
          }
        }
      }
    });
  };

  const onChangeHighlights = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            highlights: v
          }
        }
      }
    });
  };

  const onChangeShadows = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            shadows: v
          }
        }
      }
    });
  };

  const onChangeClarity = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            clarity: v
          }
        }
      }
    });
  };

  const onChangeMotionBlur = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            motionBlur: v
          }
        }
      }
    });
  };

  const onChangeTextAlign = (v: string) => {
    setProperties((prev) => {
      return {
        ...prev,
        textAlign: v
      } as ITextControlProps;
    });
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            textAlign: v
          }
        }
      }
    });
  };

  const onChangeTextDecoration = (v: string) => {
    setProperties({
      ...properties,
      textDecoration: v
    });

    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            textDecoration: v
          }
        }
      }
    });
  };

  const components = [
    {
      key: "textPreset",
      component: <PresetText trackItem={trackItem} properties={properties} />
    },
    {
      key: "textControls",
      component: (
        <TextControls
          trackItem={trackItem}
          properties={properties}
          selectedFont={selectedFont}
          onChangeFontFamily={onChangeFontFamily}
          handleChangeFontStyle={handleChangeFontStyle}
          onChangeFontSize={onChangeFontSize}
          handleColorChange={handleColorChange}
          handleBackgroundChange={handleBackgroundChange}
          onChangeTextAlign={onChangeTextAlign}
          onChangeTextDecoration={onChangeTextDecoration}
          handleChangeOpacity={handleChangeOpacity}
        />
      )
    },
    {
      key: "animations",
      component: <Animations trackItem={trackItem} properties={properties} />
    },
    {
      key: "fontStroke",
      component: (
        <Outline
          label="Font stroke"
          onChageBorderWidth={(v: number) => onChangeBorderWidth(v)}
          onChangeBorderColor={(v: string) => onChangeBorderColor(v)}
          valueBorderWidth={properties.borderWidth as number}
          valueBorderColor={properties.borderColor as string}
        />
      )
    },
    {
      key: "fontShadow",
      component: (
        <Shadow
          label="Font shadow"
          onChange={(v: IBoxShadow) => onChangeBoxShadow(v)}
          value={
            properties.boxShadow ?? {
              color: "#000000",
              x: 0,
              y: 0,
              blur: 0
            }
          }
        />
      )
    },
    {
      key: "saturation",
      component: (
        <Saturation
          onChange={(v: number) => onChangeSaturation(v)}
          value={(trackItem.details as any)?.saturation ?? 100}
        />
      )
    },
    {
      key: "hue",
      component: (
        <Hue
          onChange={(v: number) => onChangeHue(v)}
          value={(trackItem.details as any)?.hue ?? 0}
        />
      )
    },
    {
      key: "vibrance",
      component: (
        <Vibrance
          onChange={(v: number) => onChangeVibrance(v)}
          value={(trackItem.details as any)?.vibrance ?? 0}
        />
      )
    },
    {
      key: "sharpen",
      component: (
        <Sharpen
          onChange={(v: number) => onChangeSharpen(v)}
          value={(trackItem.details as any)?.sharpen ?? 0}
        />
      )
    },
    {
      key: "vignette",
      component: (
        <Vignette
          onChange={(v: number) => onChangeVignette(v)}
          value={(trackItem.details as any)?.vignette ?? 0}
        />
      )
    },
    {
      key: "temperature",
      component: (
        <Temperature
          onChange={(v: number) => onChangeTemperature(v)}
          value={(trackItem.details as any)?.temperature ?? 0}
        />
      )
    },
    {
      key: "highlights",
      component: (
        <Highlights
          onChange={(v: number) => onChangeHighlights(v)}
          value={(trackItem.details as any)?.highlights ?? 0}
        />
      )
    },
    {
      key: "shadows",
      component: (
        <Shadows
          onChange={(v: number) => onChangeShadows(v)}
          value={(trackItem.details as any)?.shadows ?? 0}
        />
      )
    },
    {
      key: "clarity",
      component: (
        <Clarity
          onChange={(v: number) => onChangeClarity(v)}
          value={(trackItem.details as any)?.clarity ?? 0}
        />
      )
    },
    {
      key: "motionBlur",
      component: (
        <MotionBlur
          onChange={(v: number) => onChangeMotionBlur(v)}
          value={(trackItem.details as any)?.motionBlur ?? 0}
        />
      )
    }
  ];

  return (
    <div className="flex lg:h-[calc(100vh-58px)] flex-1 flex-col overflow-hidden min-h-[340px]">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-2 px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold">Text Editor</h3>
            <Button
              size="sm"
              variant="outline"
              disabled
              className="h-7 text-xs gap-1"
              title="Comparison available for images and videos only"
            >
              <Eye className="w-3 h-3" />
              Compare
            </Button>
          </div>

          {components
            .filter((comp) => showAll || comp.key === type)
            .map((comp) => (
              <React.Fragment key={comp.key}>{comp.component}</React.Fragment>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BasicText;
