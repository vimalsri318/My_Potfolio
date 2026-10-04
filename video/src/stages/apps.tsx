import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { alpha, C, ease, F, lerp } from "../theme";
import { BrowserWindow, PhoneFrame, StageBg, useEnter } from "../ui";

// Designed stages for own products, CLIs and mobile apps. Canvas: 1280×800.

// ── Reframe: plain source → visual reading blocks ───────────────────
const RF = "#B45309";
export const ReframeStage = () => {
  const frame = useCurrentFrame();
  const win = useEnter(0);
  const block = (at: number) => {
    const t = ease(frame, at, at + 18);
    return { opacity: t, translate: `${lerp(t, 30, 0)}px 0px` };
  };
  const lines = [1, 0.92, 0.97, 0.6, 0, 1, 0.88, 0.95, 0.7, 0, 0.94, 1, 0.82, 0.5];
  return (
    <AbsoluteFill>
      <StageBg accent={RF} />
      <div style={{ position: "absolute", left: 96, top: 92, ...win }}>
        <BrowserWindow url="reframe" width={1088} height={760}>
          <div style={{ display: "flex", height: "100%", fontFamily: F.body, color: C.ink }}>
            <div style={{ width: 360, background: "#f6f5f2", padding: "30px 28px", borderRight: "1px solid rgba(12,12,12,0.08)" }}>
              <div style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: 1, color: C.inkSoft, marginBottom: 18 }}>SOURCE</div>
              {lines.map((w, i) => {
                const lit = frame > 20 + i * 6;
                return w === 0 ? (
                  <div key={i} style={{ height: 18 }} />
                ) : (
                  <div
                    key={i}
                    style={{
                      height: 11,
                      width: `${w * 100}%`,
                      borderRadius: 6,
                      marginBottom: 12,
                      background: lit ? alpha(RF, 0.45) : "rgba(12,12,12,0.12)",
                    }}
                  />
                );
              })}
            </div>
            <div style={{ flex: 1, padding: "30px 36px", display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: 1, color: RF }}>REFRAMED · NOTHING REWRITTEN</div>
              <div style={{ ...block(14), fontFamily: "Georgia, serif", fontSize: 40, fontWeight: 700, lineHeight: 1.1 }}>
                Why caches go stale
              </div>
              <div
                style={{
                  ...block(34),
                  borderLeft: `5px solid ${RF}`,
                  background: alpha(RF, 0.07),
                  borderRadius: "0 12px 12px 0",
                  padding: "16px 20px",
                  fontSize: 20,
                  lineHeight: 1.45,
                }}
              >
                <b>Key idea.</b> A cache is a copy, and every copy starts drifting the moment the source changes.
              </div>
              <div style={{ ...block(56), display: "flex", gap: 16 }}>
                <div style={{ flex: 1, border: "1px solid rgba(12,12,12,0.12)", borderRadius: 12, padding: "14px 18px" }}>
                  <div style={{ fontFamily: F.mono, fontSize: 13, color: C.inkSoft }}>DEFINITION</div>
                  <div style={{ fontSize: 19, marginTop: 6 }}>
                    <b>TTL</b> — how long a copy is trusted before it is fetched again.
                  </div>
                </div>
              </div>
              <div style={{ ...block(78), display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid rgba(12,12,12,0.12)", borderRadius: 12, overflow: "hidden", fontSize: 18 }}>
                {["Write-through", "Write-back", "Always fresh", "Faster writes", "Slower writes", "Risk of loss"].map((c, i) => (
                  <div
                    key={c}
                    style={{
                      padding: "12px 18px",
                      fontWeight: i < 2 ? 700 : 400,
                      background: i < 2 ? "#f6f5f2" : C.white,
                      borderTop: i >= 2 ? "1px solid rgba(12,12,12,0.08)" : "none",
                      borderLeft: i % 2 ? "1px solid rgba(12,12,12,0.08)" : "none",
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </BrowserWindow>
      </div>
    </AbsoluteFill>
  );
};

// ── Black Hole: copy on the Mac, it lands on the phone ──────────────
const BH = "#E8590C";
const shelf = [
  { k: "LINK", v: "figma.com/file/onboarding-v3" },
  { k: "TEXT", v: "Meet at 4:30, gate B" },
  { k: "IMAGE", v: "Screenshot 10.42.png" },
];
export const BlackHoleStage = () => {
  const frame = useCurrentFrame();
  const win = useEnter(0);
  const fly = ease(frame, 40, 76);
  const land = ease(frame, 74, 88);
  const ph = ease(frame, 10, 36);
  const secs = 1800 - Math.max(0, Math.floor((frame - 76) / 6));
  const mmss = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  // Arc from the Mac shelf (left) to the phone (right).
  const x = lerp(fly, 330, 860);
  const y = lerp(fly, 290, 330) - Math.sin(fly * Math.PI) * 170;
  const item = (s: (typeof shelf)[0], dark = true) => (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: 14,
        background: dark ? "rgba(255,255,255,0.06)" : "#1b1a24",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#f3f1ff",
      }}
    >
      <div style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: 1, color: BH }}>{s.k}</div>
      <div style={{ fontFamily: F.body, fontSize: 18, marginTop: 4 }}>{s.v}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <StageBg accent={BH} dark />
      <div style={{ position: "absolute", left: 96, top: 120, ...win }}>
        <div
          style={{
            width: 560,
            borderRadius: 20,
            background: "#14131c",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
            padding: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <Img src={staticFile("brand/blackhole-logo.png")} style={{ width: 52, height: 52, borderRadius: 12 }} />
            <div>
              <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 22, color: "#fff" }}>Black Hole</div>
              <div style={{ fontFamily: F.mono, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>MacBook · paired · local Wi-Fi</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{shelf.map((s) => <div key={s.k}>{item(s)}</div>)}</div>
        </div>
      </div>
      {/* the item in flight */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          opacity: fly > 0 && land < 1 ? 1 : 0,
          scale: String(lerp(fly, 1, 0.7)),
          padding: "10px 16px",
          borderRadius: 12,
          background: BH,
          color: "#fff",
          fontFamily: F.body,
          fontWeight: 700,
          fontSize: 17,
          boxShadow: `0 0 40px ${alpha(BH, 0.8)}`,
        }}
      >
        figma.com/file/…
      </div>
      <div style={{ position: "absolute", right: 110, top: 70, opacity: ph, translate: `${lerp(ph, 60, 0)}px 0px` }}>
        <PhoneFrame width={300} screen="#0e0d15">
          <div style={{ padding: "64px 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                opacity: land,
                translate: `0px ${lerp(land, -30, 0)}px`,
                background: "rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: "10px 14px",
                color: "#fff",
                fontFamily: F.body,
                fontSize: 14,
                marginBottom: 6,
              }}
            >
              <b>Arrived from MacBook</b>
              <div style={{ color: "rgba(255,255,255,0.7)" }}>figma.com/file/onboarding-v3</div>
            </div>
            <div style={{ opacity: land }}>
              {item(shelf[0], false)}
              <div style={{ fontFamily: F.mono, fontSize: 13, color: BH, marginTop: 6 }}>expires in {mmss}</div>
            </div>
            {item(shelf[1], false)}
          </div>
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};

// ── Streak Doctor: today's count + heatmap in the terminal ──────────
// Lines match the real CLI's output (v0.4.0); diagnosis is not shipped yet.
const SD = "#39d353";
const CMD = "npx streak-doctor vimalsri318";
const diag: [string, string, string][] = [
  ["", "#8b949e", "vimalsri318  (GitHub day 2026-10-04 UTC)"],
  ["●", "#d29922", "0 of 1 today — not there yet"],
  ["", "#8b949e", "20h 40m left — GitHub's day ends 05:30 GMT+5:30"],
];
const levels = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
export const StreakDoctorStage = () => {
  const frame = useCurrentFrame();
  const win = useEnter(0);
  const typed = CMD.slice(0, Math.max(0, Math.floor((frame - 8) / 1.2)));
  const cols = 30;
  return (
    <AbsoluteFill>
      <StageBg accent="#216E39" />
      <div style={{ position: "absolute", left: 96, top: 92, ...win }}>
        <BrowserWindow width={1088} height={760} dark url="zsh — streak-doctor">
          <div style={{ background: "#0d1117", height: "100%", padding: "28px 34px", fontFamily: F.mono, fontSize: 21, color: "#e6edf3", lineHeight: 1.6 }}>
            <div>
              <span style={{ color: SD }}>~ $</span> {typed}
              {frame < 44 && <span style={{ opacity: Math.floor(frame / 8) % 2 ? 0 : 1 }}>▌</span>}
            </div>
            {diag.map(([mark, color, text], i) => {
              const t = ease(frame, 52 + i * 8, 62 + i * 8);
              return (
                <div key={text} style={{ opacity: t }}>
                  {mark && <span style={{ color }}>{mark} </span>}
                  <span style={{ color: mark ? "#e6edf3" : color }}>{text}</span>
                </div>
              );
            })}
            <div style={{ marginTop: 22, opacity: ease(frame, 88, 96), color: "#8b949e" }}>$ streak-doctor heatmap vimalsri318</div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridAutoFlow: "column", gridTemplateRows: "repeat(7, 1fr)", gap: 5, marginTop: 12, width: 900 }}>
              {Array.from({ length: cols * 7 }).map((_, i) => {
                const col = Math.floor(i / 7);
                const lvl = (i * 7 + col * 3 + ((i * i) % 5)) % 5;
                const t = ease(frame, 96 + col * 1.3, 104 + col * 1.3);
                return <span key={i} style={{ height: 22, borderRadius: 4, background: levels[lvl], opacity: t }} />;
              })}
            </div>
          </div>
        </BrowserWindow>
      </div>
    </AbsoluteFill>
  );
};

// ── Slate: hold, talk, and the ramble files itself ──────────────────
const SL = "#475569";
const SAID = "went to the gym at 7, paid 240 for lunch, and finally sent the invoice";
const filed = [
  { icon: "🏋️", title: "Gym", meta: "Today · 7:00 AM", at: 92 },
  { icon: "₹", title: "₹240 · Lunch", meta: "Spend · Food", at: 102 },
  { icon: "✓", title: "Send invoice", meta: "Todo closed", at: 112 },
];
export const SlateStage = () => {
  const frame = useCurrentFrame();
  const ph = useEnter(0);
  const holding = frame > 18 && frame < 84;
  const said = SAID.slice(0, Math.max(0, Math.floor((frame - 22) * 1.15)));
  return (
    <AbsoluteFill>
      <StageBg accent={SL} />
      <div style={{ position: "absolute", left: 170, top: 40, ...ph }}>
        <PhoneFrame width={340} screen="#f8fafc">
          <div style={{ padding: "70px 26px 26px", height: "100%", display: "flex", flexDirection: "column", fontFamily: F.body }}>
            <div style={{ fontWeight: 800, fontSize: 30, color: C.ink }}>Slate</div>
            <div style={{ fontSize: 15, color: C.inkSoft }}>Say what you did.</div>
            <div style={{ marginTop: 24, fontSize: 19, lineHeight: 1.45, color: C.ink, minHeight: 170 }}>
              {said}
              {holding && <span style={{ color: SL }}>▌</span>}
            </div>
            <div style={{ display: "flex", gap: 5, alignItems: "center", justifyContent: "center", height: 60, opacity: holding ? 1 : 0.25 }}>
              {Array.from({ length: 22 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: 5,
                    borderRadius: 3,
                    background: SL,
                    height: holding ? 10 + Math.abs(Math.sin(frame / 3 + i * 0.9)) * 44 : 8,
                  }}
                />
              ))}
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ alignSelf: "center", display: "grid", placeItems: "center" }}>
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 99,
                  background: holding ? C.ink : SL,
                  color: C.white,
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 700,
                  fontSize: 16,
                  scale: holding ? "0.92" : "1",
                  boxShadow: holding ? `0 0 0 16px ${alpha(SL, 0.18)}` : "none",
                }}
              >
                {holding ? "Listening" : "Hold to talk"}
              </div>
            </div>
          </div>
        </PhoneFrame>
      </div>
      <div style={{ position: "absolute", left: 640, top: 210, display: "flex", flexDirection: "column", gap: 18 }}>
        {filed.map((f) => {
          const t = ease(frame, f.at, f.at + 16);
          return (
            <div
              key={f.title}
              style={{
                opacity: t,
                translate: `${lerp(t, -50, 0)}px 0px`,
                width: 470,
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "20px 24px",
                borderRadius: 18,
                background: C.white,
                boxShadow: "0 20px 44px rgba(12,12,12,0.12)",
                fontFamily: F.body,
              }}
            >
              <span style={{ width: 54, height: 54, borderRadius: 14, background: alpha(SL, 0.12), display: "grid", placeItems: "center", fontSize: 26, fontWeight: 800, color: SL }}>
                {f.icon}
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 23, color: C.ink }}>{f.title}</div>
                <div style={{ fontSize: 16, color: C.inkSoft }}>{f.meta}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Ardor: Ardy follows up until it's done ──────────────────────────
const AR = "#9333EA";
export const ArdorStage = () => {
  const frame = useCurrentFrame();
  const ph = useEnter(0);
  const done = frame >= 84;
  const pop = ease(frame, 86, 104);
  return (
    <AbsoluteFill>
      <StageBg accent={AR} />
      <div style={{ position: "absolute", left: 470, top: 40, ...ph }}>
        <PhoneFrame width={340} screen="#faf7ff">
          <div style={{ padding: "70px 24px 24px", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: F.body }}>
            <Img
              src={staticFile(done ? "brand/ardy-excited.png" : "brand/ardy-thinking.png")}
              style={{ width: 230, marginTop: 10 }}
            />
            <div
              style={{
                opacity: ease(frame, 20, 34),
                marginTop: 18,
                alignSelf: "stretch",
                background: C.white,
                borderRadius: 18,
                padding: "16px 18px",
                fontSize: 19,
                lineHeight: 1.4,
                color: C.ink,
                boxShadow: "0 10px 26px rgba(80,40,140,0.12)",
              }}
            >
              {done ? "Done! That’s 6 days in a row. 🔥" : "Did you finish the report you planned for 4 pm?"}
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", gap: 12, alignSelf: "stretch" }}>
              <div style={{ flex: 1, textAlign: "center", padding: "16px 0", borderRadius: 14, background: done ? "#1d1033" : AR, color: C.white, fontWeight: 700, fontSize: 18, scale: frame > 76 && frame < 86 ? "0.94" : "1" }}>
                {done ? "Logged ✓" : "Done ✓"}
              </div>
              <div style={{ flex: 1, textAlign: "center", padding: "16px 0", borderRadius: 14, background: alpha(AR, 0.1), color: AR, fontWeight: 700, fontSize: 18 }}>
                Not yet
              </div>
            </div>
          </div>
        </PhoneFrame>
      </div>
      <div
        style={{
          position: "absolute",
          left: 880,
          top: 170,
          opacity: pop,
          scale: String(lerp(pop, 0.6, 1)),
          padding: "18px 26px",
          borderRadius: 20,
          background: C.white,
          boxShadow: "0 20px 44px rgba(80,40,140,0.18)",
          fontFamily: F.body,
        }}
      >
        <div style={{ fontFamily: F.mono, fontSize: 14, color: AR, letterSpacing: 1 }}>STREAK</div>
        <div style={{ fontWeight: 800, fontSize: 44, color: C.ink }}>6 days</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 300,
          width: 300,
          opacity: ease(frame, 30, 48),
          fontFamily: F.body,
          fontSize: 26,
          fontWeight: 700,
          lineHeight: 1.25,
          color: C.ink,
        }}
      >
        Reminders forget.
        <br />
        <span style={{ color: AR }}>Ardy follows up.</span>
      </div>
    </AbsoluteFill>
  );
};
