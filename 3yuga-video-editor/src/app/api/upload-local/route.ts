import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }
    
    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });
    
    const uploadedFiles = [];
    
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique filename
      const ext = path.extname(file.name);
      const filename = `${nanoid()}-${Date.now()}${ext}`;
      const filepath = path.join(UPLOAD_DIR, filename);
      
      // Save file
      await writeFile(filepath, buffer);
      
      uploadedFiles.push({
        filename,
        originalName: file.name,
        url: `/uploads/${filename}`,
        size: file.size,
        type: file.type
      });
    }
    
    return NextResponse.json({
      success: true,
      files: uploadedFiles
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}

// Configure max file size
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb"
    }
  }
};
