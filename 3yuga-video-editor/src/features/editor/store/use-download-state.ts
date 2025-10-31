import { IDesign } from "@designcombo/types";
import { create } from "zustand";
interface Output {
  url: string;
  type: string;
}

interface DownloadState {
  projectId: string;
  exporting: boolean;
  exportType: "json" | "mp4" | "png";
  progress: number;
  output?: Output;
  payload?: IDesign;
  displayProgressModal: boolean;
  playerRef?: any;
  actions: {
    setProjectId: (projectId: string) => void;
    setExporting: (exporting: boolean) => void;
    setExportType: (exportType: "json" | "mp4" | "png") => void;
    setProgress: (progress: number) => void;
    setState: (state: Partial<DownloadState>) => void;
    setOutput: (output: Output) => void;
    startExport: () => void;
    setDisplayProgressModal: (displayProgressModal: boolean) => void;
    setPlayerRef: (playerRef: any) => void;
  };
}

//const baseUrl = "https://api.combo.sh/v1";

export const useDownloadState = create<DownloadState>((set, get) => ({
  projectId: "",
  exporting: false,
  exportType: "mp4",
  progress: 0,
  displayProgressModal: false,
  actions: {
    setProjectId: (projectId) => set({ projectId }),
    setExporting: (exporting) => set({ exporting }),
    setExportType: (exportType) => set({ exportType }),
    setProgress: (progress) => set({ progress }),
    setState: (state) => set({ ...state }),
    setOutput: (output) => set({ output }),
    setDisplayProgressModal: (displayProgressModal) =>
      set({ displayProgressModal }),
    setPlayerRef: (playerRef) => set({ playerRef }),
    startExport: async () => {
      try {
        const { payload, exportType } = get();

        if (!payload) throw new Error("Payload is not defined");

        // Handle local export based on type
        if (exportType === "json") {
          // Export as JSON - direct download
          const jsonString = JSON.stringify(payload, null, 2);
          const blob = new Blob([jsonString], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement("a");
          link.href = url;
          link.download = `design-${payload.id || Date.now()}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          set({ 
            exporting: false, 
            output: { url, type: "json" },
            displayProgressModal: false 
          });
        } else if (exportType === "png") {
          // Export current frame as PNG image
          set({ exporting: true, displayProgressModal: true, progress: 50 });

          // Find the Remotion player canvas
          const canvas = document.querySelector('canvas') as HTMLCanvasElement;
          
          if (!canvas) {
            throw new Error("Canvas not found. Please make sure the player is loaded.");
          }

          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (!blob) {
              set({ exporting: false, displayProgressModal: false });
              throw new Error("Failed to create image");
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `frame-${payload.id || Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            set({ 
              exporting: false, 
              output: { url, type: "png" },
              progress: 100,
              displayProgressModal: false 
            });
          }, 'image/png');
        } else if (exportType === "mp4") {
          // Client-side video export using canvas recording
          set({ exporting: true, displayProgressModal: true, progress: 0 });

          const canvas = document.querySelector('canvas') as HTMLCanvasElement;
          
          if (!canvas) {
            throw new Error("Canvas not found. Please make sure the player is loaded.");
          }

          // Check if MediaRecorder is supported
          if (!window.MediaRecorder) {
            alert("Video recording is not supported in your browser. Please use Chrome, Firefox, or Edge.");
            set({ exporting: false, displayProgressModal: false });
            return;
          }

          try {
            const { playerRef } = get();
            
            if (!playerRef?.current) {
              throw new Error("Player not found. Please try again.");
            }

            // Get canvas stream
            const stream = canvas.captureStream(30); // 30 fps
            const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9') 
              ? 'video/webm; codecs=vp9'
              : 'video/webm';
            
            const mediaRecorder = new MediaRecorder(stream, {
              mimeType,
              videoBitsPerSecond: 5000000 // 5 Mbps
            });

            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                chunks.push(event.data);
              }
            };

            mediaRecorder.onstop = () => {
              const blob = new Blob(chunks, { type: mimeType });
              const url = URL.createObjectURL(blob);
              
              const link = document.createElement("a");
              link.href = url;
              link.download = `video-${payload.id || Date.now()}.webm`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);

              set({ 
                exporting: false, 
                output: { url, type: "mp4" },
                progress: 100,
                displayProgressModal: false 
              });
            };

            mediaRecorder.onerror = (error) => {
              console.error("MediaRecorder error:", error);
              throw new Error("Failed to record video");
            };

            // Get video duration from payload (in milliseconds)
            const duration = payload.duration || 5000;
            
            // Start recording and play the video
            mediaRecorder.start();
            playerRef.current.seekTo(0); // Start from beginning
            playerRef.current.play(); // Play the video
            set({ progress: 10 });
            
            // Update progress based on playback
            const progressInterval = setInterval(() => {
              const currentFrame = playerRef.current?.getCurrentFrame() || 0;
              const totalFrames = playerRef.current?.getFrameCount() || 1;
              const progressPercent = Math.min(90, (currentFrame / totalFrames) * 90);
              set({ progress: progressPercent });
            }, 100);

            // Stop recording after duration
            setTimeout(() => {
              clearInterval(progressInterval);
              playerRef.current.pause();
              set({ progress: 95 });
              mediaRecorder.stop();
            }, duration);

          } catch (error) {
            console.error("Recording error:", error);
            throw new Error("Failed to start video recording");
          }
        }
      } catch (error) {
        console.error("Export error:", error);
        alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        set({ exporting: false, displayProgressModal: false });
      }
    }
  }
}));
