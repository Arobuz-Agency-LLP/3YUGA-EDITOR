import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { tmpdir } from "os";

const execAsync = promisify(exec);

/**
 * LOCAL TRANSCRIPTION using OpenAI Whisper
 * 
 * SETUP REQUIRED:
 * 1. Install Whisper: pip install openai-whisper
 * 2. Or use whisper.cpp for faster performance
 * 
 * Alternative: Use @xenova/transformers (JavaScript-based Whisper)
 */

export async function POST(request: Request) {
  try {
    const { audioUrl } = await request.json();
    
    // Download audio file
    const response = await fetch(audioUrl);
    const buffer = await response.arrayBuffer();
    
    const tempAudioPath = path.join(tmpdir(), `audio-${Date.now()}.mp3`);
    const fs = require("fs");
    fs.writeFileSync(tempAudioPath, Buffer.from(buffer));
    
    // Run Whisper locally
    // Option 1: Using Python Whisper
    const { stdout } = await execAsync(
      `whisper "${tempAudioPath}" --model base --output_format json`
    );
    
    // Option 2: Using whisper.cpp (faster)
    // const { stdout } = await execAsync(
    //   `./whisper.cpp/main -m models/ggml-base.bin -f "${tempAudioPath}" -oj`
    // );
    
    const transcription = JSON.parse(stdout);
    
    // Clean up temp file
    fs.unlinkSync(tempAudioPath);
    
    return NextResponse.json({
      text: transcription.text,
      segments: transcription.segments,
      language: transcription.language
    });
    
  } catch (error) {
    console.error("Local transcription error:", error);
    return NextResponse.json(
      { message: "Failed to transcribe locally" },
      { status: 500 }
    );
  }
}
