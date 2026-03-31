import { ImageResponse } from "next/og";

function LogoMark({ color = "#F8FAFC" }: { color?: string }) {
  return (
    <svg
      width="29"
      height="28"
      viewBox="0 0 29 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 26.942V0H16.872V4.94H5.244V11.096H15.77V15.77H5.244V22.002H16.872V26.942H0ZM21.47 23.75C21.47 22.7873 21.8057 21.9703 22.477 21.299C23.1483 20.6277 23.9653 20.292 24.928 20.292C25.4093 20.292 25.8653 20.3807 26.296 20.558C26.7267 20.7353 27.1003 20.9823 27.417 21.299C27.7337 21.6157 27.9807 21.983 28.158 22.401C28.3353 22.819 28.424 23.2687 28.424 23.75C28.424 24.2313 28.3353 24.681 28.158 25.099C27.9807 25.517 27.7337 25.8843 27.417 26.201C27.1003 26.5177 26.7267 26.7647 26.296 26.942C25.8653 27.1193 25.4093 27.208 24.928 27.208C23.9653 27.208 23.1483 26.8723 22.477 26.201C21.8057 25.5297 21.47 24.7127 21.47 23.75Z"
        fill={color}
      />
    </svg>
  );
}

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
          background: "linear-gradient(135deg, #323C46 0%, #1E293B 50%, #949EA8 100%)",
          color: "#F8FAFC",
          fontFamily: "Hind, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <LogoMark />
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
