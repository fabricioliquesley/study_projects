import type { JSX } from "react";

interface RoastOgImageProps {
  score: number;
  language: string;
  roastSummary: string;
  criticalCount: number;
  warningCount: number;
  goodCount: number;
}

export function RoastOgImage({
  score,
  language,
  roastSummary,
  criticalCount,
  warningCount,
  goodCount,
}: RoastOgImageProps): JSX.Element {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f0f0f",
        padding: 64,
        gap: 28,
      }}
    >
      {/* Logo row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#22c55e", fontSize: 24, fontWeight: 700 }}>
          &gt;
        </span>
        <span style={{ color: "#ededed", fontSize: 20, fontWeight: 500 }}>
          devroast
        </span>
      </div>

      {/* Score row */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span
          style={{
            color: "#f59e0b",
            fontSize: 160,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {score.toFixed(1)}
        </span>
        <span
          style={{
            color: "#71717a",
            fontSize: 56,
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          /10
        </span>
      </div>

      {/* Badges row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#ef4444",
            }}
          />
          <span style={{ color: "#ef4444", fontSize: 20 }}>
            {criticalCount} Critical
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#f59e0b",
            }}
          />
          <span style={{ color: "#f59e0b", fontSize: 20 }}>
            {warningCount} Warning
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#22c55e",
            }}
          />
          <span style={{ color: "#22c55e", fontSize: 20 }}>
            {goodCount} Good
          </span>
        </div>
      </div>

      {/* Language */}
      <span style={{ color: "#71717a", fontSize: 16 }}>lang: {language}</span>

      {/* Quote */}
      <span
        style={{
          color: "#ededed",
          fontSize: 22,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        "{roastSummary}"
      </span>
    </div>
  );
}
