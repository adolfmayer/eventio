import { ImageResponse } from "next/og";

export const alt = "Eventio social preview card with tagline about creating and joining events";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #0B1220 0%, #1E293B 50%, #312E81 100%)",
          color: "#F8FAFC",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: "32px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "9999px",
              background: "#22D3EE",
              display: "flex",
            }}
          />
          Eventio
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "960px" }}>
          <div style={{ display: "flex", fontSize: "96px", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1 }}>
            Eventio
          </div>
          <div style={{ display: "flex", fontSize: "42px", fontWeight: 500, color: "#CBD5E1" }}>
            Create and join unforgettable events
          </div>
          <div style={{ display: "flex", gap: "14px", marginTop: "10px" }}>
            {["Discover", "Create", "Join"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 18px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(148, 163, 184, 0.45)",
                  background: "rgba(15, 23, 42, 0.35)",
                  color: "#E2E8F0",
                  fontSize: "24px",
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
