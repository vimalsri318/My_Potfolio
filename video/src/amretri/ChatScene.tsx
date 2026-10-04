import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ease, lerp } from "../theme";
import { A, AF, Caret, Icon, Kicker, typed } from "./brand";

// A frame-driven rebuild of Amretri-Health-Revamp/src/components/site/ChatBot.tsx:
// same markup sizes (Tailwind values resolved to px), same copy, same flow.
// The conversation below follows the real logic — "dead stock" hits the FAQ
// matcher, "take over" trips detectFlowTrigger → "pharmacy takeover".

type Msg = { at: number; role: "bot" | "user"; text: string; options?: string[]; wa?: boolean; typing?: boolean };

const USER = "Dr. Priya Nair";
const EMAIL = "priya@sunrisehospital.in";
const PRIMARY = ["I want Amretri to manage my hospital pharmacy", "I need pharmacists or pharmacy staff", "I want better medicine purchase rates", "More options..."];
const AFTER = ["Back to main menu", "Talk to a human"];

// Timeline (frames, local to this scene)
const T = {
  open: 6,
  name: [26, 52] as const,
  email: [60, 92] as const,
  click: 104,
  done: 110,
};

const COMPOSE: { text: string; from: number; send: number }[] = [
  { text: "My pharmacy has too much dead stock", from: 168, send: 214 },
  { text: "Can you take over my hospital pharmacy?", from: 292, send: 338 },
  { text: "Sunrise Multispeciality Hospital", from: 396, send: 432 },
  { text: "Pune, Maharashtra", from: 470, send: 494 },
];

const MESSAGES: Msg[] = [
  { at: 0, role: "bot", text: "👋 Welcome! I am **AMRI**, your Amretri Healthcare Assistant. Please enter your details below to get started." },
  {
    at: T.done + 8,
    role: "bot",
    text: `Wonderful, **${USER}**! You're all set. I'm here to help with anything related to hospital pharmacy operations. What can I assist you with today?`,
    options: PRIMARY,
  },
  { at: 214, role: "user", text: COMPOSE[0].text },
  {
    at: 240,
    role: "bot",
    typing: true,
    text: "Yes. Dead stock blocks money and reduces pharmacy profitability.\nAmretri can help identify slow-moving and non-moving items, review purchase history, suggest correction plans and improve future stock planning.",
    options: AFTER,
  },
  { at: 338, role: "user", text: COMPOSE[1].text },
  {
    at: 364,
    role: "bot",
    typing: true,
    text: "Sure! I will guide you through setting up your request for **pharmacy takeover**.\n\nCould you please share your **Hospital / Organization name**?",
  },
  { at: 432, role: "user", text: COMPOSE[2].text },
  { at: 456, role: "bot", typing: true, text: "Which **City and State** is this located in?" },
  { at: 494, role: "user", text: COMPOSE[3].text },
  { at: 518, role: "bot", typing: true, text: "What is the total **Number of beds** in your hospital?" },
  {
    at: 584,
    role: "bot",
    typing: true,
    text: `**${USER}**, Thank you. I have captured your pharmacy takeover requirement. The Amretri team will review your details and contact you for a detailed discussion.\n\n**Captured Details:**\n• Hospital name: Sunrise Multispeciality Hospital\n• City: Pune, Maharashtra\n• Number of beds: 120\n• Monthly pharmacy sales: ₹45 lakh\n• Current pharmacy model: Self-managed\n• Main problem: Dead stock & expiry\n• Name and contact number: ${USER}, +91 90000 00000`,
    options: AFTER,
    wa: true,
  },
];

// The fast-forward between "beds" and the summary (4 more validated steps).
const SKIP = [536, 580] as const;

const STEPS = [
  { at: 0, title: "Knows who it's talking to", body: "Name + email up front — saved straight to Google Sheets the moment they tap Start Chat." },
  { at: 150, title: "Answers instantly", body: "52 curated Q&As across 11 service areas, matched right in the browser. No round-trip." },
  { at: 280, title: "Turns intent into a qualified lead", body: "Free text like “take over my pharmacy” starts a guided intake. Every answer is validated." },
  { at: 560, title: "Hands off to WhatsApp", body: "The full brief, pre-filled for the Amretri team — one tap to send." },
];

const renderText = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i}>{p.slice(2, -2)}</strong>
    ) : (
      <span key={i} style={{ whiteSpace: "pre-wrap" }}>
        {p}
      </span>
    ),
  );

const Bubble: React.FC<{ m: Msg; frame: number }> = ({ m, frame }) => {
  const t = frame - m.at;
  const grow = interpolate(t, [0, 12], [0, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p = ease(frame, m.at, m.at + 14);
  const user = m.role === "user";
  return (
    <div style={{ maxHeight: m.at === 0 ? undefined : grow, overflow: "hidden", flexShrink: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: user ? "flex-end" : "flex-start", paddingBottom: 12, opacity: p, translate: `${user ? 0 : lerp(p, -10, 0)}px ${lerp(p, 8, 0)}px` }}>
        <div
          style={{
            maxWidth: "85%",
            borderRadius: 20,
            borderBottomRightRadius: user ? 8 : 20,
            borderBottomLeftRadius: user ? 20 : 8,
            padding: "8px 12px",
            fontSize: 14,
            lineHeight: "20px",
            background: user ? A.brand : "#fff",
            color: user ? "#fff" : A.ink,
            boxShadow: user ? undefined : "0 1px 2px rgba(15,47,58,0.08), 0 1px 3px rgba(15,47,58,0.06)",
          }}
        >
          {renderText(m.text)}
          {m.wa && (
            <div style={{ marginTop: 12 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 999,
                  background: A.orange,
                  padding: "8px 16px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                  boxShadow: "0 4px 10px rgba(255,122,26,0.25)",
                  scale: String(1 + 0.06 * Math.max(0, Math.sin(Math.max(0, frame - m.at - 30) / 6)) * (frame > m.at + 30 ? 1 : 0)),
                }}
              >
                Send Details on WhatsApp 💬
              </span>
            </div>
          )}
          {m.options && (
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {m.options.map((o) => (
                <span key={o} style={{ borderRadius: 999, border: "1px solid rgba(22,180,191,0.35)", background: "rgba(22,180,191,0.05)", padding: "6px 12px", fontSize: 12, lineHeight: "16px", fontWeight: 700, color: A.brand }}>
                  {o}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Typing: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={{ display: "flex", justifyContent: "flex-start", paddingBottom: 12, flexShrink: 0 }}>
    <div style={{ borderRadius: 20, borderBottomLeftRadius: 8, background: "#fff", padding: "14px 16px", boxShadow: "0 1px 2px rgba(15,47,58,0.08)" }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center", height: 8 }}>
        {[0, 6, 12].map((d) => (
          <span key={d} style={{ width: 6, height: 6, borderRadius: 99, background: "rgba(15,47,58,0.6)", translate: `0px ${-Math.max(0, Math.sin(((frame - d) / 18) * Math.PI * 2)) * 4}px` }} />
        ))}
      </div>
    </div>
  </div>
);

const Field: React.FC<{ placeholder: string; value: string; focus: boolean }> = ({ placeholder, value, focus }) => (
  <div
    style={{
      width: "100%",
      borderRadius: 16,
      border: `1px solid ${focus ? A.brand : A.border}`,
      boxShadow: focus ? `0 0 0 1px rgba(22,180,191,0.2)` : undefined,
      background: "#fff",
      padding: "10px 14px",
      fontSize: 14,
      lineHeight: "20px",
      color: value ? A.ink : A.placeholder,
      boxSizing: "border-box",
      height: 42,
    }}
  >
    {value || placeholder}
    {focus && <Caret h={16} />}
  </div>
);

export const ChatWidget: React.FC = () => {
  const frame = useCurrentFrame();
  const showForm = frame < T.done;
  const name = typed(USER, frame, T.name[0], T.name[1]);
  const email = typed(EMAIL, frame, T.email[0], T.email[1]);
  const compose = COMPOSE.find((c) => frame >= c.from && frame < c.send);
  const composeText = compose ? typed(compose.text, frame, compose.from, compose.send - 6) : "";
  const typing = MESSAGES.some((m) => m.typing && frame >= m.at - 24 && frame < m.at);
  const visible = MESSAGES.filter((m) => frame >= m.at);
  const open = ease(frame, T.open, T.open + 16);
  const press = frame >= T.click && frame < T.click + 6 ? 0.96 : 1;
  const formOut = ease(frame, T.done - 4, T.done + 6);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16, fontFamily: AF.body }}>
      {/* Panel */}
      <div
        style={{
          position: "relative",
          width: 384,
          height: 560,
          borderRadius: 24,
          border: `1px solid ${A.border}`,
          background: "#fff",
          boxShadow: "0 25px 50px -12px rgba(15,47,58,0.25)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transformOrigin: "bottom right",
          scale: String(lerp(open, 0.6, 1)),
          opacity: open,
          translate: `0px ${lerp(open, 30, 0)}px`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, background: `linear-gradient(90deg, ${A.brand}, ${A.brandDeep})`, color: "#fff", flexShrink: 0 }}>
          <span style={{ display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: 99, background: "rgba(255,255,255,0.2)", boxShadow: "0 0 0 2px rgba(255,255,255,0.3)" }}>
            <Icon name="stethoscope" size={20} color="#fff" />
          </span>
          <div>
            <div style={{ fontSize: 14, lineHeight: "20px", fontWeight: 700 }}>AMRI · Healthcare Assistant</div>
            <div style={{ fontSize: 12, lineHeight: "16px", color: "rgba(255,255,255,0.85)" }}>Typically replies instantly</div>
          </div>
        </div>

        {showForm && (
          <div style={{ padding: 16, borderBottom: `1px solid ${A.border}`, background: "#fff", flexShrink: 0, opacity: 1 - formOut }}>
            <div style={{ fontSize: 12, lineHeight: "16px", fontWeight: 600, color: A.ink, marginBottom: 12 }}>👋 Welcome! Please enter your details to begin:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Field placeholder="Your Name *" value={name} focus={frame >= T.name[0] - 6 && frame < T.email[0] - 4} />
              <Field placeholder="Your Email *" value={email} focus={frame >= T.email[0] - 4 && frame < T.click} />
              <div style={{ position: "relative", borderRadius: 16, background: frame >= T.click ? A.brandDeep : A.brand, padding: "10px 0", textAlign: "center", fontSize: 14, lineHeight: "20px", fontWeight: 700, color: "#fff", scale: String(press) }}>
                Start Chat
              </div>
            </div>
          </div>
        )}

        {/* Messages — bottom-anchored once they overflow, like scrollIntoView */}
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden", background: "rgba(246,251,252,0.4)", padding: 16, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column" }}>
            {visible.map((m, i) => (
              <Bubble key={i} m={m} frame={frame} />
            ))}
            {typing && <Typing frame={frame} />}
          </div>
          <div style={{ flexGrow: 1 }} />
        </div>

        {!showForm && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, borderTop: `1px solid ${A.border}`, background: "#fff", padding: 12, flexShrink: 0 }}>
            <div
              style={{
                flex: 1,
                borderRadius: 999,
                border: `1px solid ${compose ? A.brand : A.border}`,
                padding: "10px 16px",
                fontSize: 14,
                lineHeight: "20px",
                color: composeText ? A.ink : A.placeholder,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {composeText || "Type a message…"}
              {compose && <Caret h={16} />}
            </div>
            <span style={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: 99, background: compose && frame >= compose.send - 6 ? A.brandDeep : A.brand, scale: compose && frame >= compose.send - 3 ? "0.9" : "1" }}>
              <Icon name="send" size={16} color="#fff" />
            </span>
          </div>
        )}

        {/* Cursor for the Start Chat click */}
        {frame < T.done + 4 && <Cursor frame={frame} />}

        <SheetToast frame={frame} />
      </div>

      {/* Launcher — open state (X) */}
      <span style={{ display: "grid", placeItems: "center", width: 56, height: 56, borderRadius: 99, background: frame < T.open ? `linear-gradient(135deg, ${A.brand}, ${A.brandDeep})` : A.ink, color: "#fff", boxShadow: "0 25px 50px -12px rgba(22,180,191,0.4)" }}>
        {frame < T.open ? <Icon name="stethoscope" size={28} color="#fff" /> : <Icon name="x" size={24} color="#fff" />}
      </span>

      {/* Fast-forward through the remaining intake steps */}
      <FastForward frame={frame} />
    </div>
  );
};

const Cursor: React.FC<{ frame: number }> = ({ frame }) => {
  const t = ease(frame, T.email[1], T.click - 2);
  const x = lerp(t, 330, 210);
  const y = lerp(t, 470, 262);
  const ring = interpolate(frame, [T.click, T.click + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none", opacity: ease(frame, T.email[1] - 6, T.email[1]) }}>
      {frame >= T.click && <span style={{ position: "absolute", left: -18, top: -18, width: 36, height: 36, borderRadius: 99, border: `2px solid ${A.brand}`, opacity: 1 - ring, scale: String(0.4 + ring) }} />}
      <svg width="22" height="22" viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }}>
        <path d="M4 2l16 11.5-7 1.2 4.3 7.3-2.8 1.6-4.2-7.4L5 21z" fill="#0F2F3A" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const FastForward: React.FC<{ frame: number }> = ({ frame }) => {
  const o = interpolate(frame, [SKIP[0], SKIP[0] + 8, SKIP[1] - 8, SKIP[1]], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (o === 0) return null;
  const steps = ["Monthly pharmacy sales", "Current pharmacy model", "Main problem", "Name and contact number"];
  const k = Math.min(steps.length - 1, Math.floor(interpolate(frame, [SKIP[0] + 4, SKIP[1] - 8], [0, steps.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  return (
    <div style={{ position: "absolute", left: 0, top: 438, width: 384, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 999, background: A.ink, color: "#fff", fontSize: 13, fontWeight: 600, boxShadow: "0 12px 30px rgba(15,47,58,0.35)" }}>
        <span style={{ color: A.brand, fontWeight: 800 }}>⏩ +{k + 1}/4</span>
        {steps[k]} ✓
      </div>
    </div>
  );
};

export const ChatScene: React.FC = () => {
  const frame = useCurrentFrame();
  const active = STEPS.reduce((acc, s, i) => (frame >= s.at ? i : acc), 0);
  const bgIn = ease(frame, 0, 30);
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {/* The real homepage, softened, as the stage */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={staticFile("amretri/hero.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${lerp(bgIn, 0, 9)}px)`, scale: "1.06" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.9) 42%, rgba(255,255,255,0.45) 70%, rgba(255,255,255,0.25) 100%)" }} />

      {/* Left: what you're watching */}
      <div style={{ position: "absolute", left: 120, top: 150, width: 820 }}>
        <Kicker>Live demo · AMRI chatbot</Kicker>
        <div style={{ marginTop: 22, fontFamily: AF.head, fontWeight: 800, fontSize: 64, lineHeight: 1.06, letterSpacing: "-0.025em", color: A.ink, opacity: ease(frame, 4, 24), translate: `0px ${lerp(ease(frame, 4, 24), 20, 0)}px` }}>
          From first <span style={{ color: A.brand }}>hello</span> to a <span style={{ color: A.orange }}>qualified lead.</span>
        </div>
        <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 14 }}>
          {STEPS.map((s, i) => {
            const on = i === active;
            const seen = frame >= s.at;
            const p = ease(frame, s.at, s.at + 18);
            return (
              <div
                key={s.title}
                style={{
                  display: "flex",
                  gap: 22,
                  alignItems: "flex-start",
                  padding: "18px 22px",
                  borderRadius: 22,
                  background: on ? "#fff" : "transparent",
                  boxShadow: on ? "0 20px 50px rgba(15,47,58,0.12), 0 0 0 1px rgba(22,180,191,0.25)" : "none",
                  opacity: seen ? (on ? 1 : 0.45) : 0.25,
                }}
              >
                <span style={{ flexShrink: 0, display: "grid", placeItems: "center", width: 48, height: 48, borderRadius: 99, background: on ? A.brand : "rgba(15,47,58,0.08)", color: on ? "#fff" : A.ink, fontFamily: AF.head, fontWeight: 800, fontSize: 22 }}>
                  {i + 1}
                </span>
                <div>
                  <div style={{ fontFamily: AF.head, fontWeight: 700, fontSize: 32, color: A.ink, lineHeight: 1.2 }}>{s.title}</div>
                  {on && (
                    <div style={{ marginTop: 8, fontFamily: AF.body, fontSize: 24, lineHeight: 1.45, color: A.inkSoft, opacity: p, maxWidth: 640 }}>
                      {s.body}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: the widget, scaled up so phones can read it */}
      <div style={{ position: "absolute", right: 150, bottom: 28, transformOrigin: "bottom right", scale: "1.56" }}>
        <ChatWidget />
      </div>
    </AbsoluteFill>
  );
};

// Drops in under the header when Start Chat posts the row.
const SheetToast: React.FC<{ frame: number }> = ({ frame }) => {
  const o = interpolate(frame, [T.done, T.done + 10, T.done + 80, T.done + 92], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (o === 0) return null;
  return (
    <div style={{ position: "absolute", left: 16, right: 16, top: 84, opacity: o, translate: `0px ${lerp(o, -14, 0)}px` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 14, background: "#fff", boxShadow: "0 12px 30px rgba(15,47,58,0.18), 0 0 0 1px rgba(24,128,56,0.25)" }}>
        <span style={{ display: "grid", placeItems: "center", width: 30, height: 30, borderRadius: 8, background: A.sheetGreen, flexShrink: 0 }}>
          <Icon name="sheet" size={17} color="#fff" />
        </span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: A.ink }}>Saved to Google Sheets ✓</div>
          <div style={{ fontSize: 11, color: A.inkSoft, fontFamily: AF.mono }}>Inquiries · Chatbot Welcome Form</div>
        </div>
      </div>
    </div>
  );
};

export const CHAT_FRAMES = 690;
