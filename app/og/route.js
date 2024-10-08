import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request) {
  try {
    const fontSize = 64;
    const width = 1200;
    const height = 630;

    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(to bottom right, #FF6B6B, #4ECDC4)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize,
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Weird Web October
          </div>
          <div
            style={{
              fontSize: fontSize / 2,
              color: "white",
              marginTop: 20,
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            v0 Edition
          </div>
          {/* Cute background elements */}
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              fontSize: 100,
            }}
          >
            🌈
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              fontSize: 100,
            }}
          >
            🦄
          </div>
        </div>
      ),
      {
        width,
        height,
      }
    );
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
