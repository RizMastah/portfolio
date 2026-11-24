import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}: Software Engineering student, Data, AI/ML & Backend`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const bars = [0.35, 0.6, 0.45, 0.8, 0.55, 0.9, 0.4, 0.7, 0.5, 0.85, 0.65, 0.3, 0.75, 0.5];
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0c0f10",
        color: "#e6ebe8",
        padding: 64,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 64,
          bottom: 0,
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
        }}
      >
        {bars.map((b, i) => (
          <div key={i} style={{ width: 22, height: 360 * b, background: "#1c2522" }} />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24 }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: "#3ddc97" }} />
        <span style={{ letterSpacing: 2 }}>{profile.status.toUpperCase()}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 116, fontWeight: 800, lineHeight: 0.95, letterSpacing: -3 }}>
          RAIHAN ADITITO
        </div>
        <div
          style={{
            fontSize: 116,
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: -3,
            color: "#3ddc97",
          }}
        >
          BAGASTAMA
        </div>
        <div style={{ marginTop: 28, fontSize: 32, color: "#8b9792" }}>
          Software Engineering student · Data, AI/ML & Backend
        </div>
      </div>
      <div style={{ display: "flex", gap: 28, fontSize: 24, color: "#8b9792" }}>
        <span>Nanjing / Tangerang</span>
        <span>github.com/RizMastah</span>
      </div>
    </div>,
    size,
  );
}
