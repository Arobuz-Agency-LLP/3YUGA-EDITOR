import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { dispatch } from "@designcombo/events";
import useStore from "../store/use-store";
import { TRANSITIONS } from "../data/transitions";
import { generateId } from "@designcombo/timeline";
import { ITrackItem } from "@designcombo/types";

const TransitionsControl = () => {
  const { activeIds, trackItemsMap, trackItemIds } = useStore();

  // Get the currently selected track item
  const selectedItem = useMemo(() => {
    if (activeIds.length !== 1) return null;
    const id = activeIds[0];
    return trackItemsMap[id];
  }, [activeIds, trackItemsMap]);

  // Find next item in timeline
  const nextItem = useMemo(() => {
    if (!selectedItem) return null;

    const currentIndex = trackItemIds.indexOf(selectedItem.id);
    if (currentIndex === -1 || currentIndex >= trackItemIds.length - 1) return null;

    const nextItemId = trackItemIds[currentIndex + 1];
    return trackItemsMap[nextItemId];
  }, [selectedItem, trackItemIds, trackItemsMap]);

  // Check if this is a video or image
  const isMediaItem = selectedItem && (selectedItem.type === "video" || selectedItem.type === "image");

  if (!isMediaItem || !nextItem) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Select a video or image clip to add transitions
      </div>
    );
  }

  const applyTransition = (transition: any) => {
    // Create transition object in the store
    const transitionId = generateId();
    
    // Dispatch custom event to create transition
    // Using the designcombo events system
    const event = new CustomEvent("addTransition", {
      detail: {
        id: transitionId,
        fromId: selectedItem.id,
        toId: nextItem.id,
        kind: transition.kind,
        direction: transition.direction,
        duration: (transition.duration || 0.5) * 1000 // Convert to milliseconds
      }
    });
    
    window.dispatchEvent(event);
    console.log(`✨ Transition "${transition.name || transition.kind}" applied between clips`);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-sm font-medium">
        Add Transition to Next Clip
      </div>
      
      <div className="grid gap-2 grid-cols-3 max-h-[400px] overflow-y-auto">
        {TRANSITIONS.map((transition, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 cursor-pointer rounded-lg hover:bg-muted p-2 transition-colors"
            onClick={() => applyTransition(transition)}
            title={transition.name || transition.kind}
          >
            <div
              style={{
                backgroundImage: `url(${transition.preview})`,
                backgroundSize: "cover",
                width: "100%",
                aspectRatio: "1",
                borderRadius: "4px"
              }}
              className="border border-border"
            />
            <div className="text-[11px] text-muted-foreground text-center truncate">
              {transition.name || transition.kind}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground italic">
        Click a transition to apply it between "{selectedItem.name || 'Clip'}" and the next clip
      </p>
    </div>
  );
};

export default TransitionsControl;
