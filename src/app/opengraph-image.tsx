import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Daniel Coyle — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#121212",
          padding: "64px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 32,
            background: "rgba(255, 255, 255, 0.025)",
            padding: "72px 84px",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 86,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            Daniel Coyle
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              color: "#9ca3af",
              fontSize: 36,
              fontWeight: 400,
              lineHeight: 1.2,
              letterSpacing: "0.01em",
            }}
          >
            Software Engineer
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
