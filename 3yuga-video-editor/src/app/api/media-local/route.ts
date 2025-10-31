import { NextRequest, NextResponse } from "next/server";
import { readdir, stat, writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

// Store your local media in public/media folder
const MEDIA_DIR = path.join(process.cwd(), "public", "media");
const VIDEOS_DIR = path.join(MEDIA_DIR, "videos");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all"; // image, video, audio, or all
    const query = searchParams.get("query") || "";
    
    // Read media directory
    const files = await readdir(MEDIA_DIR, { recursive: true });
    
    // Filter and transform files
    const mediaFiles = [];
    
    for (const file of files) {
      // Handle both string and Dirent objects
      const fileName = typeof file === 'string' ? file : (file as any).name || String(file);
      const filePath = path.join(MEDIA_DIR, fileName);
      
      let stats;
      try {
        stats = await stat(filePath);
      } catch (err) {
        continue; // Skip if file doesn't exist or can't be accessed
      }
      
      if (!stats.isFile()) continue;
      
      const ext = path.extname(fileName).toLowerCase();
      const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
      const isVideo = [".mp4", ".webm", ".mov"].includes(ext);
      const isAudio = [".mp3", ".wav", ".ogg", ".m4a", ".aac"].includes(ext);
      
      // Filter by type
      if (type === "image" && !isImage) continue;
      if (type === "video" && !isVideo) continue;
      if (type === "audio" && !isAudio) continue;
      
      // Filter by search query
      if (query && !fileName.toLowerCase().includes(query.toLowerCase())) continue;
      
      // Normalize path for URL (replace backslashes with forward slashes)
      const normalizedPath = fileName.replace(/\\/g, '/');
      
      mediaFiles.push({
        id: `local_${fileName}`,
        name: path.basename(fileName),
        type: isImage ? "image" : isVideo ? "video" : isAudio ? "audio" : "unknown",
        url: `/media/${normalizedPath}`,
        preview: `/media/${normalizedPath}`,
        size: stats.size,
        details: {
          src: `/media/${normalizedPath}`,
          width: 1920, // You can use sharp/ffprobe to get actual dimensions
          height: 1080,
          duration: isVideo ? 15 : isAudio ? 30 : undefined // Default duration for videos and audio
        }
      });
    }
    
    // Return format matching Pexels API structure
    if (type === "video") {
      return NextResponse.json({
        videos: mediaFiles,
        total_results: mediaFiles.length,
        page: 1,
        per_page: mediaFiles.length
      });
    } else if (type === "audio") {
      return NextResponse.json({
        audios: mediaFiles,
        total_results: mediaFiles.length,
        page: 1,
        per_page: mediaFiles.length
      });
    } else {
      return NextResponse.json({
        photos: mediaFiles,
        total_results: mediaFiles.length,
        page: 1,
        per_page: mediaFiles.length
      });
    }
    
  } catch (error) {
    console.error("Local media error:", error);
    return NextResponse.json(
      { error: "Failed to load local media" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const thumbnails = formData.getAll("thumbnail") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }
    
    // Ensure videos directory exists
    await mkdir(VIDEOS_DIR, { recursive: true });
    
    const uploadedFiles = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const thumbnail = thumbnails[i];
      
      // Validate video file
      const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];
      const validExtensions = [".mp4", ".webm", ".mov"];
      const ext = path.extname(file.name).toLowerCase();
      
      if (!validExtensions.includes(ext)) {
        return NextResponse.json(
          { error: `Invalid file type: ${ext}. Only MP4, WebM, and MOV files are allowed.` },
          { status: 400 }
        );
      }
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique filename
      const filename = `${nanoid()}-${Date.now()}${ext}`;
      const filepath = path.join(VIDEOS_DIR, filename);
      
      // Save video file
      await writeFile(filepath, buffer);
      
      let thumbnailUrl = null;
      
      // Save thumbnail if provided
      if (thumbnail) {
        try {
          const thumbBytes = await thumbnail.arrayBuffer();
          const thumbBuffer = Buffer.from(thumbBytes);
          
          const thumbFilename = `${nanoid()}-${Date.now()}-thumb.jpg`;
          const thumbFilepath = path.join(VIDEOS_DIR, thumbFilename);
          
          await writeFile(thumbFilepath, thumbBuffer);
          thumbnailUrl = `/media/videos/${thumbFilename}`;
        } catch (thumbError) {
          console.error("Failed to save thumbnail:", thumbError);
          // Continue without thumbnail
        }
      }
      
      uploadedFiles.push({
        filename,
        originalName: file.name,
        url: `/media/videos/${filename}`,
        size: file.size,
        type: file.type,
        preview: `/media/videos/${filename}`,
        thumbnail: thumbnailUrl
      });
    }
    
    return NextResponse.json({
      success: true,
      files: uploadedFiles
    });
    
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}
