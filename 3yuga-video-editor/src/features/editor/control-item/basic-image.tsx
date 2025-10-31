import { ScrollArea } from "@/components/ui/scroll-area";
import { IBoxShadow, IImage, ITrackItem } from "@designcombo/types";
import Outline from "./common/outline";
import Shadow from "./common/shadow";
import Opacity from "./common/opacity";
import Rounded from "./common/radius";
import AspectRatio from "./common/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Crop, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import { dispatch } from "@designcombo/events";
import { EDIT_OBJECT } from "@designcombo/state";
import Blur from "./common/blur";
import Brightness from "./common/brightness";
import useLayoutStore from "../store/use-layout-store";
import { Label } from "@/components/ui/label";
import { Animations } from "./common/animations";
import Contrast from "./common/contrast";
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
import BeforeAfterComparison from "./common/before-after";

const BasicImage = ({
  trackItem,
  type
}: {
  trackItem: ITrackItem & IImage;
  type?: string;
}) => {
  const showAll = !type;
  const [properties, setProperties] = useState(trackItem);
  const [showComparison, setShowComparison] = useState(false);
  const { setCropTarget } = useLayoutStore();
  useEffect(() => {
    setProperties(trackItem);
  }, [trackItem]);

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
        details: {
          ...prev.details,
          borderWidth: v
        }
      };
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
        details: {
          ...prev.details,
          borderColor: v
        }
      };
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
        details: {
          ...prev.details,
          opacity: v
        }
      };
    });
  };

  const onChangeBlur = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            blur: v
          }
        }
      }
    });
    setProperties((prev) => {
      return {
        ...prev,
        details: {
          ...prev.details,
          blur: v
        }
      };
    });
  };
  const onChangeBrightness = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            brightness: v
          }
        }
      }
    });
    setProperties((prev) => {
      return {
        ...prev,
        details: {
          ...prev.details,
          brightness: v
        }
      };
    });
  };

  const onChangeContrast = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            contrast: v
          }
        }
      }
    });
    setProperties((prev) => {
      return {
        ...prev,
        details: {
          ...prev.details,
          contrast: v
        }
      };
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
    setProperties((prev) => ({
      ...prev,
      details: { ...prev.details, saturation: v }
    }));
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
    setProperties((prev) => ({
      ...prev,
      details: { ...prev.details, hue: v }
    }));
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
    setProperties((prev) => ({
      ...prev,
      details: { ...prev.details, sharpen: v }
    }));
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
    setProperties((prev) => ({
      ...prev,
      details: { ...prev.details, vibrance: v }
    }));
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
    setProperties((prev) => ({
      ...prev,
      details: { ...prev.details, vignette: v }
    }));
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
    setProperties((prev) => ({
      ...prev,
      details: { ...prev.details, temperature: v }
    }));
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
    setProperties((prev) => ({
      ...prev,
      details: { ...prev.details, highlights: v }
    }));
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
    setProperties((prev) => ({
      ...prev,
      details: { ...prev.details, shadows: v }
    }));
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
    setProperties((prev) => ({
      ...prev,
      details: { ...prev.details, clarity: v }
    }));
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
    setProperties((prev) => ({
      ...prev,
      details: { ...prev.details, motionBlur: v }
    }));
  };

  const onChangeBorderRadius = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            borderRadius: v
          }
        }
      }
    });
    setProperties((prev) => {
      return {
        ...prev,
        details: {
          ...prev.details,
          borderRadius: v
        }
      };
    });
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
        details: {
          ...prev.details,
          boxShadow
        }
      };
    });
  };

  const components = [
    {
      key: "crop",
      component: (
        <div className="mb-4">
          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={() => {
              setCropTarget(trackItem);
            }}
          >
            <Crop size={18} />
          </Button>
        </div>
      )
    },
    {
      key: "basic",
      component: (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="font-sans text-xs font-semibold">Basic</Label>
            <Button
              size="sm"
              variant={showComparison ? "default" : "outline"}
              onClick={() => setShowComparison(!showComparison)}
              className="h-7 text-xs gap-1"
            >
              <Eye className="w-3 h-3" />
              Compare
            </Button>
          </div>

          {showComparison && (
            <BeforeAfterComparison
              beforeImageUrl={trackItem.details.src}
              afterImageUrl={trackItem.details.src}
              title="Effect Preview"
              filters={{
                saturation: (properties.details as any)?.saturation ?? 100,
                hue: (properties.details as any)?.hue ?? 0,
                brightness: (properties.details as any)?.brightness ?? 100,
                contrast: (properties.details as any)?.contrast ?? 100,
                blur: (properties.details as any)?.blur ?? 0,
                temperature: (properties.details as any)?.temperature ?? 0,
                highlights: (properties.details as any)?.highlights ?? 0,
                shadows: (properties.details as any)?.shadows ?? 0,
                clarity: (properties.details as any)?.clarity ?? 0,
                motionBlur: (properties.details as any)?.motionBlur ?? 0,
                vibrance: (properties.details as any)?.vibrance ?? 0,
                sharpen: (properties.details as any)?.sharpen ?? 0,
                vignette: (properties.details as any)?.vignette ?? 0
              }}
            />
          )}

          <AspectRatio />
          <Rounded
            onChange={(v: number) => onChangeBorderRadius(v)}
            value={properties.details.borderRadius as number}
          />
          <Opacity
            onChange={(v: number) => handleChangeOpacity(v)}
            value={properties.details.opacity ?? 100}
          />

          <Blur
            onChange={(v: number) => onChangeBlur(v)}
            value={properties.details.blur ?? 0}
          />
          <Brightness
            onChange={(v: number) => onChangeBrightness(v)}
            value={properties.details.brightness ?? 100}
          />
          <Contrast
            onChange={(v: number) => onChangeContrast(v)}
            value={properties.details.contrast ?? 100}
          />
          <Saturation
            onChange={(v: number) => onChangeSaturation(v)}
            value={(properties.details as any)?.saturation ?? 100}
          />
          <Hue
            onChange={(v: number) => onChangeHue(v)}
            value={(properties.details as any)?.hue ?? 0}
          />
          <Vibrance
            onChange={(v: number) => onChangeVibrance(v)}
            value={(properties.details as any)?.vibrance ?? 0}
          />
          <Sharpen
            onChange={(v: number) => onChangeSharpen(v)}
            value={(properties.details as any)?.sharpen ?? 0}
          />
          <Vignette
            onChange={(v: number) => onChangeVignette(v)}
            value={(properties.details as any)?.vignette ?? 0}
          />
          <Temperature
            onChange={(v: number) => onChangeTemperature(v)}
            value={(properties.details as any)?.temperature ?? 0}
          />
          <Highlights
            onChange={(v: number) => onChangeHighlights(v)}
            value={(properties.details as any)?.highlights ?? 0}
          />
          <Shadows
            onChange={(v: number) => onChangeShadows(v)}
            value={(properties.details as any)?.shadows ?? 0}
          />
          <Clarity
            onChange={(v: number) => onChangeClarity(v)}
            value={(properties.details as any)?.clarity ?? 0}
          />
          <MotionBlur
            onChange={(v: number) => onChangeMotionBlur(v)}
            value={(properties.details as any)?.motionBlur ?? 0}
          />
        </div>
      )
    },
    {
      key: "animations",
      component: <Animations trackItem={trackItem} properties={properties} />
    },

    {
      key: "outline",
      component: (
        <Outline
          label="Outline"
          onChageBorderWidth={(v: number) => onChangeBorderWidth(v)}
          onChangeBorderColor={(v: string) => onChangeBorderColor(v)}
          valueBorderWidth={properties.details.borderWidth as number}
          valueBorderColor={properties.details.borderColor as string}
        />
      )
    },
    {
      key: "shadow",
      component: (
        <Shadow
          label="Shadow"
          onChange={(v: IBoxShadow) => onChangeBoxShadow(v)}
          value={
            properties.details.boxShadow ?? {
              color: "transparent",
              x: 0,
              y: 0,
              blur: 0
            }
          }
        />
      )
    }
  ];
  return (
    <div className="flex flex-1 flex-col">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Image
      </div>
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-2 px-4 py-4">
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

export default BasicImage;
