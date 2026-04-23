import { useState } from "react"

export default function StartPage({ onStart }: { onStart: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#000000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "fixed",
      inset: 0,
      zIndex: 999999,
    }}>
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>

      <button
        onClick={onStart}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "baseline",
          gap: 0,
          outline: "none",
        }}
      >
        <span style={{
          fontFamily: "var(--font-mono, 'Reddit Mono', monospace)",
          fontSize: "clamp(13px, 1.3vw, 25px)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: hovered ? "#ffffff" : "var(--teal-bright, #00FFE0)",
          transition: "color 0.15s ease",
          userSelect: "none",
        }}>
          Start the experience
        </span>
        <span style={{
          fontFamily: "var(--font-mono, 'Reddit Mono', monospace)",
          fontSize: "clamp(13px, 1.1vw, 18px)",
          color: hovered ? "#ffffff" : "var(--teal-bright, #00FFE0)",
          transition: "color 0.15s ease",
          animation: "blink 1s steps(1) infinite",
          userSelect: "none",
          marginLeft: "2px",
        }}>
          ▌
        </span>
      </button>
    </div>
  )
}