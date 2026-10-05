import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { alpha, C, ease, F, lerp } from "../theme";
import { BrowserWindow, fit, StageBg, useEnter } from "../ui";

// Designed stages for products without a public screen to capture. Each one
// animates the single idea the product is built around. Canvas: 1280×800.

const Frame: React.FC<{ accent: string; url?: string; dark?: boolean; children: React.ReactNode }> = ({
  accent,
  url,
  dark,
  children,
}) => {
  const win = useEnter(0);
  return (
    <AbsoluteFill>
      <StageBg accent={accent} dark={dark} />
      <div style={{ ...fit(1088, 760), ...win }}>
        <BrowserWindow url={url} width={1088} height={760} dark={dark}>
          {children}
        </BrowserWindow>
      </div>
    </AbsoluteFill>
  );
};

// ── WassupOS: a WhatsApp chat qualifies a lead on the CRM board ──────
const WASSUP = "#2563EB";
const chat: { from: "them" | "ai"; text: string; at: number }[] = [
  { from: "them", text: "Hi! Do you deliver to Coimbatore?", at: 12 },
  { from: "ai", text: "Yes — 2-day delivery. Shall I book a quick demo call for you?", at: 42 },
  { from: "them", text: "Tomorrow 11am works 👍", at: 72 },
  { from: "ai", text: "Booked for 11:00 tomorrow. See you then!", at: 98 },
];
const COLS = ["New", "Qualified", "Demo booked"];

export const WassupStage = () => {
  const frame = useCurrentFrame();
  const stage = frame < 50 ? 0 : frame < 104 ? 1 : 2;
  return (
    <Frame accent={WASSUP} dark>
      <div style={{ display: "flex", height: "100%", fontFamily: F.body, background: "#0d1020" }}>
        <div style={{ width: 470, background: "#0b141a", padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#e9edef", marginBottom: 6 }}>
            <span style={{ width: 42, height: 42, borderRadius: 99, background: "#25D366", display: "grid", placeItems: "center", fontWeight: 800 }}>K</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Karthik</div>
              <div style={{ fontSize: 13, color: "#8696a0" }}>WhatsApp · via WassupOS</div>
            </div>
          </div>
          {chat.map((m) => {
            const t = ease(frame, m.at, m.at + 14);
            const mine = m.from === "ai";
            return (
              <div
                key={m.at}
                style={{
                  alignSelf: mine ? "flex-end" : "flex-start",
                  maxWidth: 330,
                  opacity: t,
                  translate: `0px ${lerp(t, 16, 0)}px`,
                  background: mine ? "#005c4b" : "#202c33",
                  color: "#e9edef",
                  padding: "12px 16px",
                  borderRadius: 14,
                  fontSize: 18,
                  lineHeight: 1.35,
                }}
              >
                {mine && (
                  <div style={{ fontFamily: F.mono, fontSize: 12, color: "#7cf0c6", marginBottom: 4 }}>AI REPLY</div>
                )}
                {m.text}
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1, padding: 26, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {COLS.map((col, ci) => (
            <div key={col} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 14 }}>
              <div style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: 1, color: "#8ea0ff", marginBottom: 12 }}>
                {col.toUpperCase()}
              </div>
              {ci === 0 && (
                <div style={{ height: 70, borderRadius: 12, background: "rgba(255,255,255,0.05)", marginBottom: 10 }} />
              )}
              {ci === stage && (
                <div
                  style={{
                    background: C.white,
                    borderRadius: 12,
                    padding: 14,
                    boxShadow: `0 0 0 2px ${WASSUP}, 0 14px 30px ${alpha(WASSUP, 0.45)}`,
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 17, color: C.ink }}>Karthik</div>
                  <div style={{ fontSize: 14, color: C.inkSoft, marginTop: 2 }}>Coimbatore · WhatsApp</div>
                  {stage === 2 && (
                    <div style={{ fontSize: 14, color: WASSUP, fontWeight: 700, marginTop: 8 }}>Tomorrow · 11:00</div>
                  )}
                </div>
              )}
              {ci === 1 && (
                <div style={{ height: 70, borderRadius: 12, background: "rgba(255,255,255,0.05)", marginTop: 10 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
};

// ── Casa Harmony: chart-of-accounts segments + a balanced journal ────
const CASA = "#9F1239";
const segments = [
  ["01", "Entity"],
  ["100", "Fund"],
  ["4000", "Account"],
  ["210", "Dept"],
  ["000", "Project"],
  ["0000", "Future"],
];

export const CasaStage = () => {
  const frame = useCurrentFrame();
  const stamp = ease(frame, 104, 120);
  const row = (label: string, acct: string, dr: string, cr: string, at: number) => {
    const t = ease(frame, at, at + 16);
    return (
      <div
        style={{
          opacity: t,
          translate: `${lerp(t, -20, 0)}px 0px`,
          display: "grid",
          gridTemplateColumns: "1fr 260px 150px 150px",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(12,12,12,0.08)",
          fontSize: 18,
        }}
      >
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: F.mono, color: C.inkSoft }}>{acct}</span>
        <span style={{ fontFamily: F.mono, textAlign: "right" }}>{dr}</span>
        <span style={{ fontFamily: F.mono, textAlign: "right" }}>{cr}</span>
      </div>
    );
  };
  return (
    <Frame accent={CASA} url="casa-harmony · Maple Ridge HOA">
      <div style={{ padding: "26px 34px", fontFamily: F.body, color: C.ink, position: "relative", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 28 }}>Chart of accounts</div>
          <span style={{ fontFamily: F.mono, fontSize: 14, padding: "7px 12px", borderRadius: 8, background: alpha(CASA, 0.08), color: CASA }}>
            RLS · tenant = maple-ridge
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, margin: "20px 0 30px" }}>
          {segments.map(([v, l], i) => {
            const t = ease(frame, 8 + i * 6, 28 + i * 6);
            return (
              <div
                key={l}
                style={{
                  opacity: t,
                  scale: String(lerp(t, 0.85, 1)),
                  flex: 1,
                  border: `1.5px solid ${i === 2 ? CASA : "rgba(12,12,12,0.14)"}`,
                  borderRadius: 12,
                  padding: "12px 14px",
                  background: i === 2 ? alpha(CASA, 0.06) : C.white,
                }}
              >
                <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24 }}>{v}</div>
                <div style={{ fontSize: 14, color: C.inkSoft, marginTop: 2 }}>{l}</div>
              </div>
            );
          })}
        </div>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 10 }}>Journal · Assessment — Unit 12B</div>
        <div style={{ border: "1px solid rgba(12,12,12,0.1)", borderRadius: 14, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 260px 150px 150px",
              padding: "12px 20px",
              background: "#f6f5f2",
              fontFamily: F.mono,
              fontSize: 13,
              letterSpacing: 1,
              color: C.inkSoft,
            }}
          >
            <span>LINE</span>
            <span>CODE COMBINATION</span>
            <span style={{ textAlign: "right" }}>DEBIT</span>
            <span style={{ textAlign: "right" }}>CREDIT</span>
          </div>
          {row("Accounts receivable", "01-100-1200-210-000-0000", "1,200.00", "", 46)}
          {row("Assessment income", "01-100-4000-210-000-0000", "", "1,200.00", 64)}
          {row("Total", "", "1,200.00", "1,200.00", 82)}
        </div>
        <div
          style={{
            position: "absolute",
            right: 50,
            bottom: 70,
            opacity: stamp,
            scale: String(lerp(stamp, 1.4, 1)),
            rotate: "-6deg",
            border: `3px solid ${CASA}`,
            color: CASA,
            borderRadius: 12,
            padding: "10px 22px",
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 2,
          }}
        >
          BALANCED ✓
        </div>
      </div>
    </Frame>
  );
};

// ── Email Finder: evidence tiers light up, then an honest result ────
const EF = "#4F46E5";
const tiers: [string, string, "hit" | "skip"][] = [
  ["Domain + MX", "free", "hit"],
  ["Site crawl · sitemap · GitHub", "free", "hit"],
  ["Linked PDFs", "free", "hit"],
  ["Internet Archive", "free", "skip"],
  ["Search", "paid", "skip"],
  ["Browser transport", "paid", "skip"],
  ["Mail-server verification", "per address", "hit"],
];

export const EmailFinderStage = () => {
  const frame = useCurrentFrame();
  const res = ease(frame, 96, 116);
  return (
    <Frame accent={EF} url="email-finder">
      <div style={{ display: "flex", height: "100%", fontFamily: F.body, color: C.ink }}>
        <div style={{ flex: 1, padding: "28px 30px" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
            {["Alex Rivera", "acme.com"].map((v) => (
              <div key={v} style={{ flex: 1, padding: "13px 16px", borderRadius: 12, border: "1px solid rgba(12,12,12,0.14)", fontSize: 19 }}>
                {v}
              </div>
            ))}
            <div style={{ padding: "13px 22px", borderRadius: 12, background: EF, color: C.white, fontWeight: 700, fontSize: 18 }}>Find</div>
          </div>
          {tiers.map(([name, cost, state], i) => {
            const at = 14 + i * 11;
            const t = ease(frame, at, at + 10);
            const on = state === "hit";
            return (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "11px 14px",
                  marginBottom: 6,
                  borderRadius: 12,
                  background: on ? alpha(EF, 0.07 * t) : "transparent",
                  opacity: lerp(t, 0.35, on ? 1 : 0.45),
                }}
              >
                <span style={{ fontFamily: F.mono, fontSize: 15, width: 28, color: C.inkSoft }}>T{i}</span>
                <span style={{ flex: 1, fontSize: 19, fontWeight: 600 }}>{name}</span>
                <span style={{ fontFamily: F.mono, fontSize: 14, color: C.inkSoft }}>{cost}</span>
                <span style={{ width: 26, textAlign: "center", fontWeight: 800, color: on ? EF : C.inkSoft, fontSize: 18 }}>
                  {t > 0.6 ? (on ? "✓" : "–") : ""}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ width: 400, background: "#f7f7fb", padding: "28px 28px", borderLeft: "1px solid rgba(12,12,12,0.08)" }}>
          <div style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: 1, color: C.inkSoft }}>PATTERN</div>
          <div style={{ fontFamily: F.mono, fontSize: 22, fontWeight: 700, margin: "6px 0 28px", opacity: ease(frame, 50, 64) }}>
            first.last@
          </div>
          <div
            style={{
              opacity: res,
              translate: `0px ${lerp(res, 20, 0)}px`,
              background: C.white,
              borderRadius: 16,
              padding: 22,
              boxShadow: `0 18px 40px ${alpha(EF, 0.18)}`,
            }}
          >
            <div style={{ fontFamily: F.mono, fontSize: 19, fontWeight: 700, wordBreak: "break-all" }}>alex.rivera@acme.com</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16, fontSize: 16 }}>
              {[
                ["Published", false],
                ["Inferred", true],
                ["Verified", true],
              ].map(([l, ok]) => (
                <div key={l as string} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{l as string}</span>
                  <span style={{ fontWeight: 800, color: ok ? EF : "#b3b3bd" }}>{ok ? "✓" : "—"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
};
