import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const page = searchParams.get("page") || "1";

    const pixabayKey = process.env.NEXT_PUBLIC_PIXABAY_API_KEY;
    if (!pixabayKey) {
      console.error("Pixabay API key not configured");
      return NextResponse.json(
        { error: "Pixabay API key not configured" },
        { status: 400 }
      );
    }

    const pixabayUrl = `https://pixabay.com/api/sounds/?key=${pixabayKey}&per_page=20&page=${page}&order=popular${
      query ? `&q=${encodeURIComponent(query)}` : ""
    }`;

    console.log("Fetching from Pixabay:", pixabayUrl.replace(pixabayKey, "***"));

    const response = await fetch(pixabayUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Pixabay API error: ${response.status}`, errorText);
      throw new Error(`Pixabay API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Pixabay proxy error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch from Pixabay" },
      { status: 500 }
    );
  }
}