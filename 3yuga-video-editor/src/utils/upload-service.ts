import axios from "axios";
import { nanoid } from "nanoid";

export type UploadProgressCallback = (
  uploadId: string,
  progress: number
) => void;

export type UploadStatusCallback = (
  uploadId: string,
  status: "uploaded" | "failed",
  error?: string
) => void;

export interface UploadCallbacks {
  onProgress: UploadProgressCallback;
  onStatus: UploadStatusCallback;
}

export async function processFileUpload(
  uploadId: string,
  file: File,
  callbacks: UploadCallbacks
): Promise<any> {
  try {
    // Upload file directly to local storage
    const formData = new FormData();
    formData.append("files", file);

    const response = await axios.post("/api/upload-local", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        callbacks.onProgress(uploadId, percent);
      }
    });

    const uploadInfo = response.data.files[0];

    // Construct upload data from uploadInfo
    const uploadData = {
      id: nanoid(),
      fileName: uploadInfo.filename,
      filePath: uploadInfo.url,
      fileSize: uploadInfo.size,
      contentType: uploadInfo.type,
      metadata: { uploadedUrl: uploadInfo.url },
      folder: null,
      type: uploadInfo.type.split("/")[0],
      method: "direct",
      origin: "user",
      status: "uploaded",
      isPreview: false
    };

    callbacks.onStatus(uploadId, "uploaded");
    return uploadData;
  } catch (error) {
    callbacks.onStatus(uploadId, "failed", (error as Error).message);
    throw error;
  }
}

export async function processUrlUpload(
  uploadId: string,
  url: string,
  callbacks: UploadCallbacks
): Promise<any[]> {
  try {
    // Start with 10% progress
    callbacks.onProgress(uploadId, 10);

    // For local setup, we'll just use the URL directly
    // In production, you might want to download and store locally
    callbacks.onProgress(uploadId, 50);

    // Construct upload data with the original URL
    const uploadDataArray = [{
      id: nanoid(),
      fileName: url.split('/').pop() || 'file',
      filePath: url,
      fileSize: 0,
      contentType: "image/jpeg", // Default, could be detected
      metadata: { originalUrl: url },
      folder: null,
      type: "image",
      method: "url",
      origin: "user",
      status: "uploaded",
      isPreview: false
    }];

    // Complete
    callbacks.onProgress(uploadId, 100);
    callbacks.onStatus(uploadId, "uploaded");
    return uploadDataArray;
  } catch (error) {
    callbacks.onStatus(uploadId, "failed", (error as Error).message);
    throw error;
  }
}

export async function processUpload(
  uploadId: string,
  upload: { file?: File; url?: string },
  callbacks: UploadCallbacks
): Promise<any> {
  if (upload.file) {
    return await processFileUpload(uploadId, upload.file, callbacks);
  }
  if (upload.url) {
    return await processUrlUpload(uploadId, upload.url, callbacks);
  }
  callbacks.onStatus(uploadId, "failed", "No file or URL provided");
  throw new Error("No file or URL provided");
}
