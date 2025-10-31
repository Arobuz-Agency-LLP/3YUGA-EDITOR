import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { tmpdir } from "os";

const execAsync = promisify(exec);

/**
 * LOCAL TEXT-TO-SPEECH
 * 
 * OPTIONS:
 * 1. Use Web Speech API (browser-based, free)
 * 2. Use Coqui TTS (open-source, high quality)
 * 3. Use eSpeak (lightweight, many languages)
 * 4. Use piper (fast, good quality)
 */

export async function POST(request: Request) {
  try {
    const { text, voice = "en", speed = 1.0 } = await request.json();
    
    const outputPath = path.join(tmpdir(), `tts-${Date.now()}.wav`);
    
    // Option 1: Using eSpeak (install: apt-get install espeak)
    await execAsync(
      `espeak -v ${voice} -s ${Math.round(speed * 175)} -w "${outputPath}" "${text}"`
    );
    
    // Option 2: Using Coqui TTS (better quality)
    // await execAsync(
    //   `tts --text "${text}" --model_name tts_models/en/ljspeech/tacotron2-DDC --out_path "${outputPath}"`
    // );
    
    // Option 3: Using Piper (fast and good quality)
    // await execAsync(
    //   `echo "${text}" | piper --model en_US-lessac-medium --output_file "${outputPath}"`
    // );
    
    // Read the generated audio file
    const fs = require("fs");
    const audioBuffer = fs.readFileSync(outputPath);
    
    // Clean up
    fs.unlinkSync(outputPath);
    
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Disposition": "attachment; filename=speech.wav"
      }
    });
    
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}

// Alternative: Browser-based TTS (no server needed)
export async function GET() {
  return NextResponse.json({
    message: "Use Web Speech API in browser",
    example: `
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voices[0];
      speechSynthesis.speak(utterance);
    `
  });
}
