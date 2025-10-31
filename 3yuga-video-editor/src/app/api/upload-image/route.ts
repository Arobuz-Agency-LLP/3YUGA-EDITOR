import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "media", "images");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Validate image file
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const ext = path.extname(file.name).toLowerCase();

    if (!validExtensions.includes(ext) || !validImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${ext}. Only JPG, PNG, GIF, and WebP files are allowed.` },
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
        url: `/media/images/${filename}`,
        size: file.size,
        type: file.type
      }
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
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
