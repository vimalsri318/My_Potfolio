import React from "react";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease, F } from "../theme";
import ICONS from "./icon-data.json";

const jakarta = loadJakarta("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });

export const FF = { head: `${jakarta.fontFamily}, sans-serif`, body: F.body, mono: F.mono };

export const INK = "#101014";
export const INK_SOFT = "#5a5a66";
export const PAPER = "#f5f5f2";
export const NIGHT = "#0c0c11";

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

// A lighter tint of the accent for text on dark grounds.
export const lift = (hex: string, t = 0.45) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.round(c + (255 - c) * t));
  return `rgb(${ch.join(",")})`;
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

export const fadeUp = (frame: number, at: number, dist = 24, len = 20) => {
  const p = ease(frame, at, at + len);
  return { opacity: p, translate: `0px ${lerp(p, dist, 0)}px` };
};

type IconNode = [string, Record<string, string>][];

export const Icon: React.FC<{ name: string; size?: number; color?: string; stroke?: number; style?: React.CSSProperties }> = ({
  name,
  size = 24,
  color = "currentColor",
  stroke = 2,
  style,
}) => {
  const all = ICONS as unknown as Record<string, IconNode>;
  const node = all[name] || all["sparkles"];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {node.map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs }))}
    </svg>
  );
};

export const LightBg: React.FC<{ accent: string }> = ({ accent }) => (
  <AbsoluteFill style={{ background: PAPER }}>
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${rgba(accent, 0.13)} 0%, ${PAPER} 50%, ${rgba(accent, 0.08)} 100%)` }} />
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(rgba(16,16,20,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(16,16,20,0.045) 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(85% 85% at 50% 40%, black 30%, transparent 90%)",
      }}
    />
  </AbsoluteFill>
);

export const DarkBg: React.FC<{ accent: string }> = ({ accent }) => (
  <AbsoluteFill style={{ background: NIGHT }}>
    <AbsoluteFill style={{ background: `radial-gradient(55% 60% at 50% 115%, ${rgba(accent, 0.5)} 0%, transparent 70%)` }} />
    <AbsoluteFill style={{ background: `radial-gradient(40% 45% at 0% 0%, ${rgba(accent, 0.22)} 0%, transparent 70%)` }} />
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
      }}
    />
  </AbsoluteFill>
);

export const Kicker: React.FC<{ children: React.ReactNode; color: string; at?: number; style?: React.CSSProperties }> = ({ children, color, at = 0, style }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 22, letterSpacing: "0.22em", textTransform: "uppercase", color, ...fadeUp(frame, at, 14, 18), ...style }}>
      {children}
    </div>
  );
};

// Word-by-word rise. [bracketed words] take the accent colour.
export const Rise: React.FC<{
  text: string;
  at?: number;
  size?: number;
  color?: string;
  accent: string;
  stagger?: number;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({ text, at = 0, size = 72, color = INK, accent, stagger = 2.5, align = "left", style }) => {
  const frame = useCurrentFrame();
  const words: { w: string; hi: boolean }[] = [];
  let hi = false;
  for (const raw of text.split(" ")) {
    let w = raw;
    if (w.startsWith("[")) {
      hi = true;
      w = w.slice(1);
    }
    const close = /\][.,;:?!]*$/.test(w);
    w = w.replace(/\](?=[.,;:?!]*$)/, "");
    words.push({ w, hi });
    if (close) hi = false;
  }
  return (
    <div style={{ fontFamily: FF.head, fontWeight: 800, fontSize: size, lineHeight: 1.08, letterSpacing: "-0.025em", color, textAlign: align, ...style }}>
      {words.map((t, i) => {
        const p = ease(frame, at + i * stagger, at + i * stagger + 20);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.1em" }}>
            <span style={{ display: "inline-block", translate: `0px ${(1 - p) * 105}%`, opacity: p, color: t.hi ? accent : undefined }}>
              {t.w}
              {i < words.length - 1 ? " " : ""}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export const typed = (text: string, frame: number, from: number, to: number) =>
  text.slice(0, Math.round(interpolate(frame, [from, to], [0, text.length], clamp)));

export const SceneFade: React.FC<{ dur: number; fadeIn: number; fadeOut: number; children: React.ReactNode }> = ({ dur, fadeIn, fadeOut, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, Math.max(1, fadeIn), dur - fadeOut, dur], [fadeIn ? 0 : 1, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const BrowserChrome: React.FC<{ url?: string; width: number; height: number; dark?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({
  url,
  width,
  height,
  dark,
  children,
  style,
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 16,
      overflow: "hidden",
      background: dark ? "#16161d" : "#fff",
      boxShadow: "0 50px 120px rgba(16,16,20,0.28), 0 0 0 1px rgba(16,16,20,0.08)",
      display: "flex",
      flexDirection: "column",
      ...style,
    }}
  >
    <div style={{ height: 42, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", background: dark ? "#1e1e27" : "#f6f6f4", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(16,16,20,0.08)"}` }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <span key={c} style={{ width: 11, height: 11, borderRadius: 99, background: c }} />
      ))}
      {url && (
        <div style={{ marginLeft: 14, display: "flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 8, background: dark ? "rgba(255,255,255,0.06)" : "rgba(16,16,20,0.05)", fontFamily: FF.mono, fontSize: 14, color: dark ? "rgba(255,255,255,0.6)" : INK_SOFT, whiteSpace: "nowrap", overflow: "hidden", maxWidth: width - 140 }}>
          <Icon name="lock" size={12} color={dark ? "rgba(255,255,255,0.6)" : INK_SOFT} />
          {url}
        </div>
      )}
    </div>
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
  </div>
);

export const PhoneShell: React.FC<{ width: number; children: React.ReactNode; screen?: string; style?: React.CSSProperties }> = ({ width, children, screen = "#fff", style }) => {
  const height = width * 2.08;
  return (
    <div style={{ width, height, borderRadius: width * 0.16, padding: width * 0.035, background: "#111", boxShadow: "0 40px 90px rgba(16,16,20,0.32), 0 0 0 1.5px rgba(255,255,255,0.14)", boxSizing: "border-box", ...style }}>
      <div style={{ width: "100%", height: "100%", borderRadius: width * 0.13, overflow: "hidden", background: screen, position: "relative" }}>
        <div style={{ position: "absolute", top: width * 0.03, left: "50%", translate: "-50% 0", width: width * 0.3, height: width * 0.085, borderRadius: 99, background: "#111", zIndex: 5 }} />
        {children}
      </div>
    </div>
  );
};
