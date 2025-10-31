import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Check } from "lucide-react";
import { VideoLayer } from "./types/video-template.types";

interface VideoReplacerProps {
  videoLayer: VideoLayer;
  userVideos: Array<{ id: string; url: string; name: string; duration?: number }>;
  onReplace: (newVideoUrl: string, videoLayerId: string) => void;
  onCancel: () => void;
}

export const VideoReplacer = ({
  videoLayer,
  userVideos,
  onReplace,
  onCancel
}: VideoReplacerProps) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you'd upload to a server
    // For now, create a local URL
    const videoUrl = URL.createObjectURL(file);
    setSelectedVideo(videoUrl);
  };

  const handleReplace = () => {
    if (selectedVideo) {
      onReplace(selectedVideo, videoLayer.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[9997] flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg shadow-2xl max-w-2xl w-full max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-border">
          <h2 className="text-sm font-semibold">Replace Video Layer</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Current Video Info */}
            <div className="bg-muted/50 rounded-lg p-3">
              <Label className="text-xs font-semibold mb-2 block">Current Video</Label>
              <p className="text-xs text-muted-foreground truncate">{videoLayer.assetUrl}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">{videoLayer.type}</Badge>
                <Badge variant="outline" className="text-xs">
                  {videoLayer.end - videoLayer.start}s
                </Badge>
              </div>
            </div>

            {/* Upload Section */}
            {!showUpload ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowUpload(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Your Video
              </Button>
            ) : (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Select Video File</Label>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="text-sm"
                />
              </div>
            )}

            {/* User Videos List */}
            {userVideos.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Your Videos</Label>
                <div className="space-y-2">
                  {userVideos.map((video) => (
                    <button
                      key={video.id}
                      onClick={() => setSelectedVideo(video.url)}
                      className={`w-full text-left px-3 py-2 rounded-md border transition-colors ${
                        selectedVideo === video.url
                          ? "bg-primary/20 border-primary/50"
                          : "bg-muted/50 border-border hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{video.name}</p>
                          {video.duration && (
                            <p className="text-xs text-muted-foreground">{video.duration}s</p>
                          )}
                        </div>
                        {selectedVideo === video.url && (
                          <Check className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Video Preview */}
            {selectedVideo && (
              <div className="bg-muted/50 rounded-lg p-3">
                <Label className="text-xs font-semibold mb-2 block">Selected Video</Label>
                <video
                  src={selectedVideo}
                  controls
                  className="w-full h-32 rounded bg-black"
                />
                <p className="text-xs text-muted-foreground mt-2 truncate">{selectedVideo}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between h-12 px-4 border-t border-border bg-muted/30 gap-2">
          <Button variant="outline" onClick={onCancel} size="sm" className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleReplace}
            size="sm"
            className="flex-1 bg-primary"
            disabled={!selectedVideo}
          >
            Replace Video
          </Button>
        </div>
      </div>
    </div>
  );
};
