import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { readFileSync } from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    // For now, return a placeholder image
    const placeholderPath = join(process.cwd(), "public", "placeholder.jpg");
    const imageBuffer = readFileSync(placeholderPath);
    
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return NextResponse.json(
      { error: "Failed to serve image" },
      { status: 500 }
    );
  }
}
