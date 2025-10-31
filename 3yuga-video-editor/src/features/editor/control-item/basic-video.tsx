import { ScrollArea } from "@/components/ui/scroll-area";
import { IBoxShadow, ITrackItem, IVideo } from "@designcombo/types";
import Outline from "./common/outline";
import Shadow from "./common/shadow";
import Opacity from "./common/opacity";
import Rounded from "./common/radius";
import AspectRatio from "./common/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Crop, Eye } from "lucide-react";
import Volume from "./common/volume";
import React, { useEffect, useState } from "react";
import { dispatch } from "@designcombo/events";
import { EDIT_OBJECT } from "@designcombo/state";
import Speed from "./common/speed";
import useLayoutStore from "../store/use-layout-store";
import { Label } from "@/components/ui/label";
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
import BeforeAfterComparison from "./common/before-after";

const BasicVideo = ({
  trackItem,
  type
}: {
  trackItem: ITrackItem & IVideo;
  type?: string;
}) => {
  const showAll = !type;
  const [properties, setProperties] = useState(trackItem);
  const [showComparison, setShowComparison] = useState(false);
  const { setCropTarget } = useLayoutStore();
  const handleChangeVolume = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            volume: v
          }
        }
      }
    });

    setProperties((prev) => {
      return {
        ...prev,
        details: {
          ...prev.details,
          volume: v
        }
      };
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
  useEffect(() => {
    setProperties(trackItem);
  }, [trackItem]);

  const handleChangeSpeed = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          playbackRate: v
        }
      }
    });

    setProperties((prev) => {
      return {
        ...prev,
        playbackRate: v
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
            <Label className="font-sans text-xs font-semibold text-primary">
              Basic
            </Label>
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
              beforeVideoUrl={properties.details.src}
              afterVideoUrl={properties.details.src}
              title="Video Effect Preview"
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
          <Volume
            onChange={(v: number) => handleChangeVolume(v)}
            value={properties.details.volume ?? 100}
          />
          <Opacity
            onChange={(v: number) => handleChangeOpacity(v)}
            value={properties.details.opacity ?? 100}
          />
          <Speed
            value={properties.playbackRate ?? 1}
            onChange={handleChangeSpeed}
          />
          <Rounded
            onChange={(v: number) => onChangeBorderRadius(v)}
            value={properties.details.borderRadius as number}
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
          onChageBorderWidth={(v: number) => onChangeBorderWidth(v)}
          onChangeBorderColor={(v: string) => onChangeBorderColor(v)}
          valueBorderWidth={properties.details.borderWidth as number}
          valueBorderColor={properties.details.borderColor as string}
          label="Outline"
        />
      )
    },
    {
      key: "shadow",
      component: (
        <Shadow
          onChange={(v: IBoxShadow) => onChangeBoxShadow(v)}
          value={
            properties.details.boxShadow ?? {
              color: "transparent",
              x: 0,
              y: 0,
              blur: 0
            }
          }
          label="Shadow"
        />
      )
    }
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Video
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

export default BasicVideo;
