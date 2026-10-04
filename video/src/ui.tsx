import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { alpha, C, ease, F, lerp } from "./theme";

// Graph-paper ground tinted with the project's accent, plus a soft glow —
// the shared backdrop for every stage.
export const StageBg: React.FC<{ accent: string; dark?: boolean }> = ({ accent, dark }) => {
  const frame = useCurrentFrame();
  const drift = lerp(ease(frame, 0, 150), 0, 40);
  const base = dark ? "#0b0a12" : C.paper;
  const grid = dark ? "rgba(255,255,255,0.05)" : C.grid;
  return (
    <AbsoluteFill style={{ background: base }}>
      <AbsoluteFill style={{ background: alpha(accent, dark ? 0.1 : 0.1) }} />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          backgroundPosition: `${drift}px ${drift}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 70% at 85% 95%, ${alpha(accent, dark ? 0.55 : 0.32)} 0%, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Entrance used by every product frame: rise + fade, then a slow push-in.
export const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const t = ease(frame, delay, delay + 26);
  const push = lerp(ease(frame, delay, 150), 1, 1.035);
  return { opacity: t, translate: `0px ${lerp(t, 70, 0)}px`, scale: String(push) };
};

export const BrowserWindow: React.FC<{
  url?: string;
  width: number;
  height: number;
  dark?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ url, width, height, dark, style, children }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 18,
      overflow: "hidden",
      background: dark ? "#16151d" : C.white,
      boxShadow: "0 40px 90px rgba(12,12,12,0.22), 0 0 0 1px rgba(12,12,12,0.08)",
      display: "flex",
      flexDirection: "column",
      ...style,
    }}
  >
    <div
      style={{
        height: 44,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 18px",
        borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : C.line}`,
        background: dark ? "#1d1c26" : "#fafaf8",
      }}
    >
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <span key={c} style={{ width: 12, height: 12, borderRadius: 99, background: c }} />
      ))}
      {url && (
        <div
          style={{
            marginLeft: 18,
            padding: "5px 16px",
            borderRadius: 8,
            background: dark ? "rgba(255,255,255,0.06)" : "rgba(12,12,12,0.05)",
            fontFamily: F.mono,
            fontSize: 14,
            color: dark ? "rgba(255,255,255,0.6)" : C.inkSoft,
          }}
        >
          {url}
        </div>
      )}
    </div>
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
  </div>
);

export const PhoneFrame: React.FC<{
  width: number;
  style?: React.CSSProperties;
  screen?: string;
  children?: React.ReactNode;
}> = ({ width, style, screen = C.white, children }) => {
  const height = width * 2.08;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * 0.16,
        padding: width * 0.035,
        background: "#111",
        boxShadow: "0 40px 90px rgba(12,12,12,0.3), 0 0 0 1.5px rgba(255,255,255,0.14)",
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: width * 0.13,
          overflow: "hidden",
          background: screen,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: width * 0.03,
            left: "50%",
            translate: "-50% 0",
            width: width * 0.3,
            height: width * 0.085,
            borderRadius: 99,
            background: "#111",
            zIndex: 5,
          }}
        />
        {children}
      </div>
    </div>
  );
};

// A screenshot filling its parent, slowly drifting upward to feel alive.
export const Shot: React.FC<{ src: string; pan?: number; from?: number }> = ({ src, pan = 0, from = 0 }) => {
  const frame = useCurrentFrame();
  const y = lerp(ease(frame, from + 20, 150), 0, -pan);
  return (
    <Img
      src={staticFile(src)}
      style={
        pan
          ? { width: "100%", display: "block", translate: `0px ${y}px` }
          : { width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }
      }
    />
  );
};

export const Chip: React.FC<{ children: React.ReactNode; bg?: string; color?: string; style?: React.CSSProperties }> = ({
  children,
  bg = "rgba(12,12,12,0.06)",
  color = C.ink,
  style,
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 14px",
      borderRadius: 99,
      background: bg,
      color,
      fontFamily: F.body,
      fontWeight: 600,
      fontSize: 17,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);
