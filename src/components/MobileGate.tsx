// src/components/MobileGate.tsx

import { useEffect, useState } from "react";

const MIN_WIDTH = 1024;
const MIN_HEIGHT = 600;

export default function MobileGate({ children }: { children: React.ReactNode }) {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const check = () => {
      setBlocked(window.innerWidth < MIN_WIDTH || window.innerHeight < MIN_HEIGHT);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!blocked) return <>{children}</>;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "var(--bg, #f5f3ef)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      fontFamily: "'Reddit Mono', monospace",
      zIndex: 99999,
      textAlign: "center",
    }}>
      <div style={{
        maxWidth: 420,
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        alignItems: "center",
      }}>

        {/* Mito pixel square */}
        <div style={{
          width: 48,
          height: 48,
          background: "var(--ink, #1e1e1e)",
          borderRadius: 8,
          flexShrink: 0,
        }} />

        <p style={{
          fontFamily: "'Reddit Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--mid, #9a9690)",
          margin: 0,
        }}>
          IDEAL Systems — Environment Check
        </p>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 22,
          fontWeight: 400,
          color: "var(--ink, #1e1e1e)",
          lineHeight: 1.4,
          margin: 0,
        }}>
          Your screen is too small to be optimized.
        </p>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          color: "var(--mid, #9a9690)",
          lineHeight: 1.6,
          margin: 0,
        }}>
          IDEAL requires a desktop environment to properly assess, infer, and improve your life. Please open this on a laptop or desktop to continue.
        </p>

        <div style={{
          width: "100%",
          borderTop: "1px solid var(--mid, #9a9690)",
          paddingTop: "1.25rem",
        }}>
          <p style={{
            fontFamily: "'Reddit Mono', monospace",
            fontSize: 11,
            color: "var(--mid, #9a9690)",
            letterSpacing: "0.08em",
            margin: 0,
          }}>
            Minimum supported: 1024 × 600
          </p>
        </div>

      </div>
    </div>
  );
}