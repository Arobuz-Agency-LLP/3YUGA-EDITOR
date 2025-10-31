import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json();

    if (!filePath) {
      return NextResponse.json(
        { error: "filePath is required" },
        { status: 400 }
      );
    }

    // Construct the full file path
    // filePath could be: /uploads/filename.mp4, /media/videos/filename.mp4, /media/images/filename.jpg
    const fullPath = path.join(process.cwd(), "public", filePath);

    // Security check: ensure the path is within public directory
    const publicDir = path.join(process.cwd(), "public");
    const resolvedPath = path.resolve(fullPath);
    
    if (!resolvedPath.startsWith(publicDir)) {
      return NextResponse.json(
        { error: "Invalid file path" },
        { status: 403 }
      );
    }

    // Delete the file
    await unlink(resolvedPath);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully"
    });
  } catch (error: any) {
    console.error("Delete error:", error);
    
    // If file doesn't exist, still return success (idempotent)
    if (error.code === "ENOENT") {
      return NextResponse.json({
        success: true,
        message: "File already deleted or doesn't exist"
      });
    }

    return NextResponse.json(
      { error: "Failed to delete file: " + error.message },
      { status: 500 }
    );
  }
}
