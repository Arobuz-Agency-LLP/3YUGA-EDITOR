import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "media", "audio");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("audio") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No audio provided" },
        { status: 400 }
      );
    }

    // Validate audio file
    const validAudioTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/aac"];
    const validExtensions = [".mp3", ".wav", ".ogg", ".m4a", ".aac"];
    const ext = path.extname(file.name).toLowerCase();

    if (!validExtensions.includes(ext) || !validAudioTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${ext}. Only MP3, WAV, OGG, M4A, and AAC files are allowed.` },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const filename = `${nanoid()}-${Date.now()}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Save file
    await writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      file: {
        filename,
        originalName: file.name,
        url: `/media/audio/${filename}`,
        size: file.size,
        type: file.type
      }
    });
  } catch (error) {
    console.error("Audio upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload audio" },
      { status: 500 }
    );
  }
}

// Configure max file size
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb"
    }
  }
};
