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
            background: "black",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <div
            style={{
              fontSize,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Weird Web October
          </div>
          <div
            style={{
              fontSize: fontSize / 2,
              marginBottom: 40,
            }}
          >
            v0 Edition
          </div>
          <div
            style={{
              fontSize: 100,
            }}
          >
            💅
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
