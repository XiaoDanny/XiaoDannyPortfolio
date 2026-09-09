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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#121212",
          padding: "80px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 88,
            height: 88,
            borderRadius: 20,
            background: "#1c1c1c",
            border: "2px solid #C9A227",
            color: "#C9A227",
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 48,
          }}
        >
          DC
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, color: "#ffffff" }}>Daniel Coyle</div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 34, color: "#C9A227" }}>Software Engineer</div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 24, color: "#9ca3af" }}>UC Irvine · Computer Science</div>
      </div>
    ),
    { ...size }
  );
}
