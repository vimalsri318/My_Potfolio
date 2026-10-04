import React from "react";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease, F } from "../theme";

// Amretri's own tokens (Amretri-Health-Revamp/src/styles.css), so the product
// film reads as the site, not as the portfolio.
export const A = {
  brand: "#16B4BF",
  brandDeep: "#119CA5",
  brandSoft: "#EAF9FA",
  ink: "#0F2F3A",
  inkSoft: "#5D6A73",
  orange: "#FF7A1A",
  footer: "#0E6F77",
  border: "#E8F3F4",
  input: "#DCEEEF",
  secondary: "#F6FBFC",
  placeholder: "#8A9AA3",
  night: "#0A222B",
  sheetGreen: "#188038",
};

const jakarta = loadJakarta("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });

export const AF = {
  head: `${jakarta.fontFamily}, sans-serif`,
  body: F.body,
  mono: F.mono,
};

export const W = 1920;
export const H = 1080;

// Lucide paths, copied from the lucide-react build the site ships with.
const ICONS: Record<string, React.ReactNode> = {
  stethoscope: (
    <>
      <path d="M11 2v2" />
      <path d="M5 2v2" />
      <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
      <path d="M8 15a6 6 0 0 0 12 0v-3" />
      <circle cx="20" cy="10" r="2" />
    </>
  ),
  send: (
    <>
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      <path d="m21.854 2.147-10.94 10.939" />
    </>
  ),
  x: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  sparkles: (
    <>
      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
      <path d="M20 2v4" />
      <path d="M22 4h-4" />
      <circle cx="4" cy="20" r="2" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </>
  ),
  server: (
    <>
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </>
  ),
  lock: (
    <>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  cpu: (
    <>
      <path d="M12 20v2" /><path d="M12 2v2" /><path d="M17 20v2" /><path d="M17 2v2" />
      <path d="M2 12h2" /><path d="M2 17h2" /><path d="M2 7h2" /><path d="M20 12h2" />
      <path d="M20 17h2" /><path d="M20 7h2" /><path d="M7 20v2" /><path d="M7 2v2" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
    </>
  ),
  zap: (
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  ),
  message: (
    <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
  ),
  shield: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  sheet: (
    <>
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <path d="M8 13h2" /><path d="M14 13h2" /><path d="M8 17h2" /><path d="M14 17h2" />
    </>
  ),
  code: (
    <>
      <path d="m18 16 4-4-4-4" />
      <path d="m6 8-4 4 4 4" />
      <path d="m14.5 4-5 16" />
    </>
  ),
  news: (
    <>
      <path d="M15 18h-5" />
      <path d="M18 14h-8" />
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2" />
      <rect width="8" height="4" x="10" y="6" rx="1" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </>
  ),
};

export const Icon: React.FC<{ name: keyof typeof ICONS | string; size?: number; color?: string; stroke?: number; style?: React.CSSProperties }> = ({
  name,
  size = 24,
  color = "currentColor",
  stroke = 2,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {ICONS[name]}
  </svg>
);

// Fade a whole scene in and out so overlapping Sequences cross-dissolve.
export const SceneFade: React.FC<{ dur: number; children: React.ReactNode; fade?: number; fadeOut?: number }> = ({ dur, children, fade = 14, fadeOut = fade }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, fade, dur - fadeOut, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// The site's hero wash: teal → white → orange.
export const LightBg: React.FC = () => (
  <AbsoluteFill style={{ background: "#ffffff" }}>
    <AbsoluteFill style={{ background: `linear-gradient(135deg, rgba(22,180,191,0.16) 0%, #ffffff 48%, rgba(255,122,26,0.16) 100%)` }} />
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(rgba(15,47,58,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(15,47,58,0.045) 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(80% 80% at 50% 40%, black 30%, transparent 85%)",
      }}
    />
  </AbsoluteFill>
);

export const DarkBg: React.FC<{ glow?: string }> = ({ glow = A.brand }) => (
  <AbsoluteFill style={{ background: A.night }}>
    <AbsoluteFill style={{ background: `radial-gradient(55% 60% at 50% 110%, ${glow}55 0%, transparent 70%)` }} />
    <AbsoluteFill style={{ background: `radial-gradient(40% 40% at 0% 0%, ${A.footer}66 0%, transparent 70%)` }} />
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
      }}
    />
  </AbsoluteFill>
);

// Small orange uppercase label — the site's section "kicker".
export const Kicker: React.FC<{ children: React.ReactNode; color?: string; delay?: number; style?: React.CSSProperties }> = ({ children, color = A.orange, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const t = ease(frame, delay, delay + 18);
  return (
    <div style={{ fontFamily: AF.body, fontWeight: 700, fontSize: 22, letterSpacing: "0.22em", textTransform: "uppercase", color, opacity: t, translate: `0px ${(1 - t) * 14}px`, ...style }}>
      {children}
    </div>
  );
};

// Headline that rises in word by word. Wrap a phrase in [brackets] to tint it.
export const Rise: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  accent?: string;
  stagger?: number;
  style?: React.CSSProperties;
  align?: "left" | "center";
}> = ({ text, delay = 0, size = 72, color = A.ink, accent = A.brand, stagger = 3, style, align = "left" }) => {
  const frame = useCurrentFrame();
  const tokens: { w: string; hi: boolean }[] = [];
  let hi = false;
  for (const raw of text.split(" ")) {
    let w = raw;
    const open = w.startsWith("[");
    if (open) {
      hi = true;
      w = w.slice(1);
    }
    const close = w.endsWith("]");
    if (close) w = w.slice(0, -1);
    tokens.push({ w, hi });
    if (close) hi = false;
  }
  return (
    <div
      style={{
        fontFamily: AF.head,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: "-0.025em",
        color,
        textAlign: align,
        ...style,
      }}
    >
      {tokens.map((t, i) => {
        const p = ease(frame, delay + i * stagger, delay + i * stagger + 20);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.08em" }}>
            <span style={{ display: "inline-block", translate: `0px ${(1 - p) * 105}%`, opacity: p, color: t.hi ? accent : undefined }}>
              {t.w}
              {i < tokens.length - 1 ? " " : ""}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// Text typed out over [from, to].
export const typed = (text: string, frame: number, from: number, to: number) => {
  const n = Math.round(interpolate(frame, [from, to], [0, text.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return text.slice(0, n);
};

// Blinking caret, frame-driven.
export const Caret: React.FC<{ color?: string; h?: number }> = ({ color = A.ink, h = 18 }) => {
  const frame = useCurrentFrame();
  return <span style={{ display: "inline-block", width: 2, height: h, background: color, marginLeft: 1, verticalAlign: "middle", opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0 }} />;
};

export const Browser: React.FC<{ url: string; width: number; height: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ url, width, height, children, style }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 18,
      overflow: "hidden",
      background: "#fff",
      boxShadow: "0 50px 120px rgba(15,47,58,0.28), 0 0 0 1px rgba(15,47,58,0.08)",
      display: "flex",
      flexDirection: "column",
      ...style,
    }}
  >
    <div style={{ height: 46, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 18px", background: "#f7fafb", borderBottom: `1px solid ${A.border}` }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <span key={c} style={{ width: 12, height: 12, borderRadius: 99, background: c }} />
      ))}
      <div style={{ marginLeft: 16, display: "flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 8, background: "rgba(15,47,58,0.05)", fontFamily: AF.mono, fontSize: 15, color: A.inkSoft }}>
        <Icon name="lock" size={13} color={A.inkSoft} />
        {url}
      </div>
    </div>
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
  </div>
);
