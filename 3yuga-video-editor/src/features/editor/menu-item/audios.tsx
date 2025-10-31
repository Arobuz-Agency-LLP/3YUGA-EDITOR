import Draggable from "@/components/shared/draggable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HorizontalScroll } from "@/components/ui/horizontal-scroll";
import { dispatch } from "@designcombo/events";
import { ADD_AUDIO, ADD_ITEMS } from "@designcombo/state";
import { IAudio } from "@designcombo/types";
import { Music, Upload, Loader2, Search } from "lucide-react";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";
import React, { useState, useRef, useEffect } from "react";
import { generateId } from "@designcombo/timeline";
import { AUDIOS } from "../data/audio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useFreesoundAudio } from "@/hooks/use-freesound-audio";
import { usePixabayAudio } from "@/hooks/use-pixabay-audio";

type AudioSource = "all" | "default" | "uploads" | "freesound" | "pixabay";

export const Audios = () => {
  const isDraggingOverTimeline = useIsDraggingOverTimeline();
  const [isUploading, setIsUploading] = useState(false);
  const [localAudios, setLocalAudios] = useState<Partial<IAudio>[]>([]);
  const [isLoadingAudios, setIsLoadingAudios] = useState(false);
  const [activeSource, setActiveSource] = useState<AudioSource>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    audios: freesoundAudios,
    loading: freesoundLoading,
    error: freesoundError,
    searchAudio: searchFreesoundAudio,
    loadPopularAudio: loadPopularFreesoundAudio,
    clearAudio: clearFreesoundAudio
  } = useFreesoundAudio();

  const {
    audios: pixabayAudios,
    loading: pixabayLoading,
    error: pixabayError,
    searchAudio: searchPixabayAudio,
    loadPopularAudio: loadPopularPixabayAudio,
    clearAudio: clearPixabayAudio
  } = usePixabayAudio();

  // Fetch uploaded audio files from media/audio directory
  const fetchLocalAudios = async () => {
    try {
      setIsLoadingAudios(true);
      const response = await fetch("/api/media-local?type=audio");
      if (response.ok) {
        const data = await response.json();
        if (data.audios && Array.isArray(data.audios)) {
          const audios = data.audios.map((audio: any) => ({
            id: audio.id,
            name: audio.name,
            details: {
              src: audio.url
            },
            type: "audio",
            metadata: {
              author: "Local Upload"
            }
          }));
          setLocalAudios(audios);
        }
      }
    } catch (error) {
      console.error("Failed to load local audios:", error);
    } finally {
      setIsLoadingAudios(false);
    }
  };

  useEffect(() => {
    fetchLocalAudios();
    loadPopularFreesoundAudio();
    loadPopularPixabayAudio();
  }, []);

  const handleAddAudio = (payload: Partial<IAudio>) => {
    payload.id = generateId();
    dispatch(ADD_AUDIO, {
      payload,
      options: {}
    });
  };

  const handleCustomAudioClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/aac"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid audio file (MP3, WAV, OGG, MP4, or AAC)");
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Audio file must be less than 50MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("audio", file);

      const response = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload audio");
      }

      const data = await response.json();
      const uploadedFile = data.file;

      handleAddAudio({
        id: generateId(),
        details: {
          src: uploadedFile.url
        },
        name: uploadedFile.originalName,
        type: "audio",
        metadata: {
          author: "Custom Upload"
        }
      } as any);

      toast.success("Audio uploaded successfully!");
      await fetchLocalAudios();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload audio"
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      clearFreesoundAudio();
      clearPixabayAudio();
      await loadPopularFreesoundAudio();
      await loadPopularPixabayAudio();
      return;
    }

    if (activeSource === "freesound" || activeSource === "all") {
      await searchFreesoundAudio(query);
    }
    if (activeSource === "pixabay" || activeSource === "all") {
      await searchPixabayAudio(query);
    }
  };

  // Get display audios based on active source
  const getDisplayAudios = (): Partial<IAudio>[] => {
    switch (activeSource) {
      case "default":
        return AUDIOS;
      case "uploads":
        return localAudios;
      case "freesound":
        return freesoundAudios;
      case "pixabay":
        return pixabayAudios;
      case "all":
      default:
        return [...AUDIOS, ...localAudios, ...freesoundAudios, ...pixabayAudios];
    }
  };

  const isLoading = isLoadingAudios || freesoundLoading || pixabayLoading;
  const hasError = freesoundError || pixabayError;
  const displayAudios = getDisplayAudios();

  return (
    <div className="flex flex-1 flex-col max-w-full h-full">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Audios
      </div>
  
      {/* Upload Button */}
      <div className="px-4 pb-2 flex-none">
        <Button
          size="sm"
          variant="default"
          className="w-full"
          onClick={handleCustomAudioClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Add Custom Audio
            </>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/aac,.mp3,.wav,.ogg,.m4a,.aac"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>
  
      {/* Search Bar */}
      <div className="px-4 pb-2 flex-none">
        <div className="relative">
          <Input
            placeholder="Search audio library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
            className="pr-10"
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
            onClick={() => handleSearch(searchQuery)}
          >
            <Search className="h-3 w-3" />
          </Button>
        </div>
      </div>
  
      {/* Source Tabs */}
      <div className="flex gap-1 px-4 py-2 overflow-x-auto border-b border-zinc-700 flex-none">
        {(["all", "default", "uploads", "freesound", "pixabay"] as const).map((source) => (
          <button
            key={source}
            onClick={() => setActiveSource(source)}
            className={`px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
              activeSource === source
                ? "bg-zinc-700 text-white border-b-2 border-blue-500"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {source.charAt(0).toUpperCase() + source.slice(1)}
          </button>
        ))}
      </div>
  
      {/* Error Message */}
      {hasError && (
        <div className="px-4 pb-2 flex-none">
          <div className="text-xs text-amber-500 bg-amber-950/30 p-2 rounded">
            {freesoundError || pixabayError}
          </div>
        </div>
      )}
  
      {/* Audio List */}
      <ScrollArea className="flex-1 max-w-full overflow-hidden">
        <div className="flex flex-col px-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
              <span className="ml-2 text-sm text-zinc-400">Loading audios...</span>
            </div>
          ) : displayAudios.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-zinc-400">No audios available</span>
            </div>
          ) : (
            displayAudios.map((audio, index) => (
              <AudioItem
                shouldDisplayPreview={!isDraggingOverTimeline}
                handleAddAudio={handleAddAudio}
                audio={audio}
                key={`${audio.id}-${index}`}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const AudioItem = ({
  handleAddAudio,
  audio,
  shouldDisplayPreview
}: {
  handleAddAudio: (payload: Partial<IAudio>) => void;
  audio: Partial<IAudio>;
  shouldDisplayPreview: boolean;
}) => {
  const style = React.useMemo(
    () => ({
      backgroundImage:
        "url(https://cdn.designcombo.dev/thumbnails/music-preview.png)",
      backgroundSize: "cover",
      width: "70px",
      height: "70px"
    }),
    []
  );

  return (
    <Draggable
      data={audio}
      renderCustomPreview={<div style={style} />}
      shouldDisplayPreview={shouldDisplayPreview}
    >
      <div
        draggable={false}
        onClick={() => handleAddAudio(audio)}
        style={{
          display: "grid",
          gridTemplateColumns: "48px 1fr"
        }}
        className="flex cursor-pointer gap-4  py-1 text-sm hover:bg-zinc-800/70"
      >
        <div className="flex h-12 items-center justify-center bg-zinc-800">
          <Music width={16} />
        </div>
        <div className="flex flex-col justify-center">
          <div>{audio.name}</div>
          <div className="text-zinc-400">{audio.metadata?.author}</div>
          {audio.metadata?.mood && (
            <div className="text-xs text-zinc-500">{audio.metadata.mood}</div>
          )}
        </div>
      </div>
    </Draggable>
  );
};
