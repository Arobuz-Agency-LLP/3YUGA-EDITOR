import { ADD_AUDIO, ADD_IMAGE, ADD_VIDEO } from "@designcombo/state";
import { dispatch } from "@designcombo/events";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  Music,
  Image as ImageIcon,
  Video as VideoIcon,
  Loader2,
  UploadIcon,
  Play,
  X
} from "lucide-react";
import { generateId } from "@designcombo/timeline";
import { Button } from "@/components/ui/button";
import useUploadStore from "../store/use-upload-store";
import ModalUpload from "@/components/modal-upload";

export const Uploads = () => {
  const { setShowUploadModal, uploads, pendingUploads, activeUploads, removeUploadFromList } =
    useUploadStore();

  // Group completed uploads by type
  const videos = uploads.filter(
    (upload) => upload.type?.startsWith("video/") || upload.type === "video"
  );
  const images = uploads.filter(
    (upload) => upload.type?.startsWith("image/") || upload.type === "image"
  );
  const audios = uploads.filter(
    (upload) => upload.type?.startsWith("audio/") || upload.type === "audio"
  );

  const handleAddVideo = (video: any) => {
    const srcVideo = video.metadata?.uploadedUrl || video.filePath || video.url;

    dispatch(ADD_VIDEO, {
      payload: {
        id: generateId(),
        details: {
          src: srcVideo
        },
        metadata: {
          previewUrl: srcVideo
        }
      },
      options: {
        resourceId: "main",
        scaleMode: "fit"
      }
    });
  };

  const handleAddImage = (image: any) => {
    const srcImage = image.metadata?.uploadedUrl || image.filePath || image.url;

    dispatch(ADD_IMAGE, {
      payload: {
        id: generateId(),
        type: "image",
        display: {
          from: 0,
          to: 5000
        },
        details: {
          src: srcImage
        },
        metadata: {}
      },
      options: {}
    });
  };

  const handleAddAudio = (audio: any) => {
    const srcAudio = audio.metadata?.uploadedUrl || audio.filePath || audio.url;
    dispatch(ADD_AUDIO, {
      payload: {
        id: generateId(),
        type: "audio",
        details: {
          src: srcAudio
        },
        metadata: {}
      },
      options: {}
    });
  };

  const handleDeleteUpload = async (upload: any) => {
    try {
      console.log("Deleting upload:", upload.id, upload.fileName, upload.filePath);
      
      // Delete file from server
      const response = await fetch("/api/delete-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          filePath: upload.filePath || upload.url
        })
      });

      console.log("Delete response:", response.status, response.ok);

      if (!response.ok) {
        console.error("Failed to delete file from server");
      }

      // Remove from store with ID
      console.log("Current uploads before delete:", uploads.map((u: any) => ({ id: u.id, fileName: u.fileName })));
      removeUploadFromList(upload.id);
      console.log("Removed upload with ID:", upload.id);
    } catch (error) {
      console.error("Delete error:", error);
      // Still remove from store even if delete fails
      removeUploadFromList(upload.id);
    }
  };

  const UploadPrompt = () => (
    <div className="flex items-center justify-center px-4">
      <Button
        className="w-full cursor-pointer"
        onClick={() => setShowUploadModal(true)}
      >
        <UploadIcon className="w-4 h-4" />
        <span className="ml-2">Upload</span>
      </Button>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Your uploads
      </div>
      <ModalUpload />
      <UploadPrompt />

      {/* Uploads in Progress Section */}
      {(pendingUploads.length > 0 || activeUploads.length > 0) && (
        <div className="p-4">
          <div className="font-medium text-sm mb-2 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            Uploads in Progress
          </div>
          <div className="flex flex-col gap-2">
            {pendingUploads.map((upload) => (
              <div key={upload.id} className="flex items-center gap-2">
                <span className="truncate text-xs flex-1">
                  {upload.file?.name || upload.url || "Unknown"}
                </span>
                <span className="text-xs text-muted-foreground">Pending</span>
              </div>
            ))}
            {activeUploads.map((upload) => (
              <div key={upload.id} className="flex items-center gap-2">
                <span className="truncate text-xs flex-1">
                  {upload.file?.name || upload.url || "Unknown"}
                </span>
                <div className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  <span className="text-xs">{upload.progress ?? 0}%</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {upload.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8 p-4 overflow-y-auto">
        {/* Videos Section */}
        {videos.length > 0 && (
          <div className="flex flex-col gap-2 border border-border rounded-lg p-3 bg-background">
            <div className="flex items-center gap-2">
              <VideoIcon className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm">Videos</span>
              <span className="text-xs text-muted-foreground ml-auto">{videos.length} items</span>
            </div>
            <ScrollArea className="h-40 w-full border border-border/50 rounded">
              <div className="grid grid-cols-3 gap-2 p-2">
                {videos.map((video, idx) => (
                  <div
                    className="flex items-center gap-2 flex-col w-full"
                    key={video.id || idx}
                  >
                    <div className="relative">
                      <Card
                        className="w-16 h-16 flex items-center justify-center overflow-hidden relative cursor-pointer group bg-muted"
                        onClick={() => handleAddVideo(video)}
                      >
                        {video.filePath || video.url ? (
                          <>
                            <video
                              src={video.filePath || video.url}
                              className="w-full h-full object-cover"
                              crossOrigin="anonymous"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Play className="w-6 h-6 fill-white text-white" />
                            </div>
                          </>
                        ) : (
                          <VideoIcon className="w-8 h-8 text-muted-foreground" />
                        )}
                      </Card>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-4 w-4 rounded-md bg-destructive/80 hover:bg-destructive text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-110 p-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUpload(video);
                        }}
                        title="Delete video"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground truncate w-full text-center">
                      {video.fileName || "Video"}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Images Section */}
        {images.length > 0 && (
          <div className="flex flex-col gap-2 border border-border rounded-lg p-3 bg-background">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm">Images</span>
              <span className="text-xs text-muted-foreground ml-auto">{images.length} items</span>
            </div>
            <ScrollArea className="h-40 w-full border border-border/50 rounded">
              <div className="grid grid-cols-3 gap-2 p-2">
                {images.map((image, idx) => (
                  <div
                    className="flex items-center gap-2 flex-col w-full"
                    key={image.id || idx}
                  >
                    <div className="relative">
                      <Card
                        className="w-16 h-16 flex items-center justify-center overflow-hidden relative cursor-pointer bg-muted"
                        onClick={() => handleAddImage(image)}
                      >
                        {image.filePath || image.url ? (
                          <img
                            src={image.filePath || image.url}
                            alt={image.fileName || "Image"}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        )}
                      </Card>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-4 w-4 rounded-md bg-destructive/80 hover:bg-destructive text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-110 p-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUpload(image);
                        }}
                        title="Delete image"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground truncate w-full text-center">
                      {image.fileName || "Image"}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Audios Section */}
        {audios.length > 0 && (
          <div className="flex flex-col gap-2 border border-border rounded-lg p-3 bg-background">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm">Audios</span>
              <span className="text-xs text-muted-foreground ml-auto">{audios.length} items</span>
            </div>
            <ScrollArea className="h-40 w-full border border-border/50 rounded">
              <div className="grid grid-cols-3 gap-2 p-2">
                {audios.map((audio, idx) => (
                  <div
                    className="flex items-center gap-2 flex-col w-full"
                    key={audio.id || idx}
                  >
                    <div className="relative">
                      <Card
                        className="w-16 h-16 flex items-center justify-center overflow-hidden relative cursor-pointer bg-gradient-to-br from-purple-500/20 to-blue-500/20"
                        onClick={() => handleAddAudio(audio)}
                      >
                        <Music className="w-8 h-8 text-muted-foreground" />
                      </Card>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-4 w-4 rounded-md bg-destructive/80 hover:bg-destructive text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-110 p-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUpload(audio);
                        }}
                        title="Delete audio"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground truncate w-full text-center">
                      {audio.fileName || "Audio"}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};
