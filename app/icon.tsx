import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0c0f10",
        color: "#e6ebe8",
        fontSize: 40,
        fontWeight: 800,
        borderRadius: 14,
      }}
    >
      R<span style={{ color: "#3ddc97" }}>_</span>
    </div>,
    size,
  );
}
