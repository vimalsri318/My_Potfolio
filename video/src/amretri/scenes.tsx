import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ease, lerp } from "../theme";
import { A, AF, Browser, DarkBg, Icon, Kicker, LightBg, Rise, typed } from "./brand";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fadeUp = (frame: number, at: number, dist = 24) => {
  const p = ease(frame, at, at + 20);
  return { opacity: p, translate: `0px ${lerp(p, dist, 0)}px` };
};

/* ───────────────────────── 1 · Hook ───────────────────────── */

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const needs = [
    { icon: "server", label: "A backend server" },
    { icon: "database", label: "A database" },
    { icon: "lock", label: "Paid AI API keys" },
  ];
  return (
    <AbsoluteFill>
      <DarkBg />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 220 }}>
        <Rise text="Most website chatbots need…" size={72} color="#fff" align="center" />
        <div style={{ display: "flex", gap: 28, marginTop: 70 }}>
          {needs.map((n, i) => {
            const strike = ease(frame, 62 + i * 6, 76 + i * 6);
            return (
              <div
                key={n.label}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "22px 32px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  fontFamily: AF.body,
                  fontSize: 30,
                  fontWeight: 600,
                  color: "#fff",
                  ...fadeUp(frame, 20 + i * 8),
                  opacity: ease(frame, 20 + i * 8, 40 + i * 8) * lerp(strike, 1, 0.4),
                }}
              >
                <Icon name={n.icon} size={30} color={A.brand} />
                {n.label}
                <span style={{ position: "absolute", left: 20, right: 20, top: "50%", height: 4, borderRadius: 4, background: A.orange, transformOrigin: "left", scale: `${strike} 1` }} />
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 90 }}>
          <Rise text="AMRI runs on [a browser tab] and [a Google Sheet.]" size={76} color="#fff" delay={88} align="center" stagger={3} style={{ maxWidth: 1200 }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────────────────── 2 · Website tour ───────────────────────── */

const STOPS = [
  { y: 0, label: "Hero" },
  { y: 900, label: "Our Solutions" },
  { y: 2224, label: "Why Amretri · Outcomes" },
  { y: 3787, label: "Healthcare Partners" },
  { y: 5628, label: "Leadership Team" },
  { y: 6901, label: "FAQs" },
  { y: 7938, label: "Book a Strategy Call" },
  { y: 8779, label: "Testimonials" },
  { y: 9812, label: "Contact & Footer" },
];
const SCROLL_FROM = 140;
const SEG = 30;
const MOVE = 19;

export const TourScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Browser: big and centred under the title, then docks right for the tour.
  const dock = ease(frame, 78, 124);
  const bw = lerp(dock, 1480, 1120);
  const bx = lerp(dock, (1920 - 1480) / 2, 690);
  const by = lerp(dock, 560, 160) + lerp(ease(frame, 0, 40), 260, 0) * (1 - dock);
  const contentH = (bw * 900) / 1440;
  const k = bw / 1440;

  const local = frame - SCROLL_FROM;
  const seg = Math.max(0, Math.min(STOPS.length - 2, Math.floor(local / SEG)));
  const within = local - seg * SEG;
  const scrollY = local < 0 ? 0 : local >= SEG * (STOPS.length - 1) ? STOPS[STOPS.length - 1].y : lerp(ease(within, 0, MOVE), STOPS[seg].y, STOPS[seg + 1].y);
  const active = STOPS.reduce((acc, s, i) => (scrollY >= s.y - 200 ? i : acc), 0);

  const titleOut = ease(frame, 70, 100);
  const listIn = ease(frame, 110, 140);
  const fabPulse = frame > 360 ? 1 + 0.12 * Math.abs(Math.sin((frame - 360) / 7)) : 1;
  const callout = ease(frame, 372, 392);

  return (
    <AbsoluteFill>
      <LightBg />

      {/* Opening title */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 90, opacity: 1 - titleOut, translate: `0px ${-titleOut * 40}px` }}>
        <Img src={staticFile("amretri/logo.png")} style={{ height: 96, ...fadeUp(frame, 0, 16) }} />
        <div style={{ marginTop: 30 }}>
          <Rise text="Meet [AMRI] — the assistant inside Amretri Healthcare" size={60} align="center" delay={8} stagger={2} />
        </div>
        <div style={{ marginTop: 18, fontFamily: AF.body, fontSize: 28, color: A.inkSoft, ...fadeUp(frame, 26) }}>Hospital pharmacy operations, across India since 2009</div>
      </AbsoluteFill>

      {/* Left rail: the sections, ticking as we scroll */}
      <div style={{ position: "absolute", left: 120, top: 150, width: 500, opacity: listIn, translate: `${lerp(listIn, -30, 0)}px 0px` }}>
        <Kicker delay={110}>The website</Kicker>
        <div style={{ marginTop: 16, fontFamily: AF.head, fontWeight: 800, fontSize: 54, lineHeight: 1.06, letterSpacing: "-0.025em", color: A.ink }}>
          A full, multi-page <span style={{ color: A.brand }}>healthcare site</span>
        </div>
        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 6 }}>
          {STOPS.map((s, i) => {
            const on = i === active;
            return (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: AF.body, fontSize: 25, fontWeight: on ? 700 : 500, color: on ? A.ink : "rgba(15,47,58,0.38)", height: 42 }}>
                <span style={{ width: on ? 34 : 14, height: 4, borderRadius: 4, background: on ? A.orange : "rgba(15,47,58,0.18)" }} />
                {s.label}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 34, display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 520 }}>
          {["Home", "About", "6 service pages", "Careers", "Blog", "Contact"].map((p, i) => (
            <span key={p} style={{ padding: "8px 16px", borderRadius: 999, background: "#fff", border: `1px solid ${A.input}`, fontFamily: AF.body, fontSize: 19, fontWeight: 600, color: A.ink, ...fadeUp(frame, 150 + i * 5, 10) }}>
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* The real homepage, scrolling */}
      <div style={{ position: "absolute", left: bx, top: by }}>
        <Browser url="amretrihealthcare.com" width={bw} height={contentH + 46}>
          <Img src={staticFile("amretri/home-full.jpg")} style={{ position: "absolute", left: 0, top: 0, width: bw, translate: `0px ${-scrollY * k}px` }} />
          {/* The chatbot launcher, bottom-right on the homepage */}
          <div style={{ position: "absolute", right: 24 * k, bottom: 24 * k, width: 56 * k, height: 56 * k, scale: String(fabPulse) }}>
            <span style={{ position: "absolute", inset: -4 * k, borderRadius: 99, background: `linear-gradient(135deg, ${A.brand}, ${A.brandDeep})`, filter: "blur(4px)", opacity: 0.9 }} />
            <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", borderRadius: 99, background: `linear-gradient(135deg, ${A.brand}, ${A.brandDeep})`, boxShadow: "0 0 0 2px rgba(255,255,255,0.6)" }}>
              <Icon name="stethoscope" size={28 * k} color="#fff" />
            </span>
          </div>
        </Browser>
        {/* Callout to the launcher */}
        <div
          style={{
            position: "absolute",
            right: 110 * k + 10,
            bottom: 34 * k,
            opacity: callout,
            translate: `${lerp(callout, 20, 0)}px 0px`,
            padding: "14px 22px",
            borderRadius: 16,
            background: A.ink,
            color: "#fff",
            fontFamily: AF.head,
            fontWeight: 700,
            fontSize: 26,
            boxShadow: "0 20px 50px rgba(15,47,58,0.35)",
          }}
        >
          Meet AMRI, one tap away →
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────────────────── 4 · Architecture ───────────────────────── */

const NODES = [
  { icon: "message", title: "Chat UI", sub: "React widget, bottom-right" },
  { icon: "zap", title: "Rule engine", sub: "Intent patterns + 52-answer FAQ match" },
  { icon: "cpu", title: "On-device SLM", sub: "WebLLM on WebGPU · small quantized model" },
  { icon: "sparkles", title: "Reply", sub: "Rendered straight back into the chat" },
];
const NX = [190, 610, 1030, 1450];
const NW = 300;
const NY = 470;
const NH = 200;
// Packet dwell points (frames) per node
const PACKET = [150, 186, 222, 258];

export const ArchitectureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const box = ease(frame, 18, 40);
  // Packet x along the pipeline, pausing on each node
  const px = interpolate(frame, [PACKET[0], PACKET[0] + 14, PACKET[1], PACKET[1] + 14, PACKET[2], PACKET[2] + 14, PACKET[3]], [NX[0], NX[0], NX[1], NX[1], NX[2], NX[2], NX[3]], clamp) + NW / 2;
  const packetO = interpolate(frame, [PACKET[0] - 10, PACKET[0], PACKET[3] + 10, PACKET[3] + 24], [0, 1, 1, 0], clamp);
  const at = PACKET.reduce((acc, f, i) => (frame >= f - 4 ? i : acc), -1);

  return (
    <AbsoluteFill>
      <DarkBg />
      <div style={{ position: "absolute", left: 120, top: 96 }}>
        <Kicker color={A.brand}>Under the hood</Kicker>
        <div style={{ marginTop: 16 }}>
          <Rise text="No AI server. It all runs [in the visitor's browser.]" size={64} color="#fff" delay={4} stagger={2} />
        </div>
      </div>

      {/* The browser tab boundary */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 330,
          width: 1680,
          height: 450,
          borderRadius: 30,
          border: "2px solid rgba(22,180,191,0.45)",
          background: "rgba(22,180,191,0.05)",
          opacity: box,
          scale: String(lerp(box, 0.97, 1)),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 26px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: 12, height: 12, borderRadius: 99, background: c }} />
          ))}
          <span style={{ marginLeft: 14, fontFamily: AF.mono, fontSize: 18, color: "rgba(255,255,255,0.65)" }}>amretrihealthcare.com — the visitor's browser tab</span>
        </div>
      </div>

      {/* Arrows */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2].map((i) => {
          const x1 = NX[i] + NW + 14;
          const x2 = NX[i + 1] - 14;
          const p = ease(frame, 96 + i * 10, 120 + i * 10);
          return (
            <g key={i} opacity={p}>
              <line x1={x1} y1={NY + NH / 2} x2={lerp(p, x1, x2)} y2={NY + NH / 2} stroke="rgba(255,255,255,0.35)" strokeWidth={3} strokeDasharray="8 8" />
              <path d={`M${x2 - 12} ${NY + NH / 2 - 9} L${x2} ${NY + NH / 2} L${x2 - 12} ${NY + NH / 2 + 9}`} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={3} strokeLinecap="round" />
            </g>
          );
        })}
      </svg>

      {NODES.map((n, i) => {
        const p = ease(frame, 44 + i * 12, 70 + i * 12);
        const hot = at === i && frame < PACKET[3] + 30;
        const slm = i === 2;
        return (
          <div
            key={n.title}
            style={{
              position: "absolute",
              left: NX[i],
              top: NY,
              width: NW,
              height: NH,
              boxSizing: "border-box",
              padding: 24,
              borderRadius: 24,
              background: slm ? "linear-gradient(160deg, rgba(22,180,191,0.28), rgba(14,111,119,0.35))" : "rgba(255,255,255,0.06)",
              border: `1.5px solid ${hot ? A.brand : slm ? "rgba(22,180,191,0.6)" : "rgba(255,255,255,0.12)"}`,
              boxShadow: hot ? `0 0 0 6px rgba(22,180,191,0.18), 0 0 60px rgba(22,180,191,0.35)` : "none",
              opacity: p,
              translate: `0px ${lerp(p, 26, 0)}px`,
              fontFamily: AF.body,
            }}
          >
            <span style={{ display: "grid", placeItems: "center", width: 52, height: 52, borderRadius: 14, background: slm ? A.brand : "rgba(22,180,191,0.16)" }}>
              <Icon name={n.icon} size={28} color={slm ? "#fff" : A.brand} />
            </span>
            <div style={{ marginTop: 18, fontFamily: AF.head, fontSize: 30, fontWeight: 700, color: "#fff" }}>{n.title}</div>
            <div style={{ marginTop: 6, fontSize: 19, lineHeight: 1.35, color: "rgba(255,255,255,0.62)" }}>{n.sub}</div>
          </div>
        );
      })}

      {/* Cache note under the SLM */}
      <div style={{ position: "absolute", left: NX[2] - 40, top: NY + NH + 26, width: NW + 80, display: "flex", justifyContent: "center", ...fadeUp(frame, 128, 12) }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderRadius: 999, background: "rgba(255,255,255,0.08)", fontFamily: AF.mono, fontSize: 16, color: "rgba(255,255,255,0.75)" }}>
          <Icon name="database" size={16} color={A.brand} /> weights cached in the browser
        </span>
      </div>
      <div style={{ position: "absolute", left: NX[1] - 40, top: NY + NH + 26, width: NW + 80, display: "flex", justifyContent: "center", ...fadeUp(frame, 136, 12) }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderRadius: 999, background: "rgba(255,122,26,0.14)", fontFamily: AF.mono, fontSize: 16, color: "#FFB27A" }}>
          known intent → answered instantly
        </span>
      </div>

      {/* The question travelling through */}
      <div style={{ position: "absolute", left: px, top: NY - 64, translate: "-50% 0px", opacity: packetO }}>
        <span style={{ display: "inline-flex", padding: "10px 18px", borderRadius: 999, background: A.brand, color: "#fff", fontFamily: AF.body, fontWeight: 700, fontSize: 20, whiteSpace: "nowrap", boxShadow: "0 10px 30px rgba(22,180,191,0.5)" }}>
          {frame < PACKET[3] ? "“take over my pharmacy?”" : "✓ guided intake started"}
        </span>
      </div>

      {/* Outcomes */}
      <div style={{ position: "absolute", left: 120, top: 840, width: 1680, display: "flex", gap: 24 }}>
        {[
          { big: "0", small: "inference servers to run" },
          { big: "0", small: "API keys shipped to the browser" },
          { big: "₹0", small: "per conversation" },
        ].map((s, i) => (
          <div key={s.small} style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 18, padding: "22px 30px", borderRadius: 22, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", ...fadeUp(frame, 280 + i * 14) }}>
            <span style={{ fontFamily: AF.head, fontWeight: 800, fontSize: 64, color: A.brand, lineHeight: 1 }}>{s.big}</span>
            <span style={{ fontFamily: AF.body, fontSize: 26, color: "rgba(255,255,255,0.8)" }}>{s.small}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────────────────── Google Sheet mock ───────────────────────── */

type Col = { h: string; w: number };
const SheetMock: React.FC<{
  title: string;
  cols: Col[];
  rows: string[][];
  tabs: string[];
  activeTab: string;
  newRowAt?: number;
  highlightRow?: number;
  frame: number;
  width: number;
}> = ({ title, cols, rows, tabs, activeTab, newRowAt, highlightRow, frame, width }) => {
  const rowH = 46;
  return (
    <div style={{ width, borderRadius: 18, overflow: "hidden", background: "#fff", boxShadow: "0 40px 100px rgba(15,47,58,0.2), 0 0 0 1px rgba(15,47,58,0.08)", fontFamily: AF.body }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1px solid #e3e6e8" }}>
        <span style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: 8, background: A.sheetGreen }}>
          <Icon name="sheet" size={20} color="#fff" />
        </span>
        <div style={{ fontSize: 20, fontWeight: 600, color: "#202124" }}>{title}</div>
      </div>
      {/* Column letters */}
      <div style={{ display: "flex", background: "#f8f9fa", borderBottom: "1px solid #e3e6e8", fontSize: 13, color: "#5f6368" }}>
        <div style={{ width: 40, borderRight: "1px solid #e3e6e8" }} />
        {cols.map((c, i) => (
          <div key={c.h} style={{ width: c.w, textAlign: "center", padding: "4px 0", borderRight: "1px solid #e3e6e8" }}>
            {String.fromCharCode(65 + i)}
          </div>
        ))}
      </div>
      {[cols.map((c) => c.h), ...rows].map((r, ri) => {
        const isNew = newRowAt !== undefined && ri === rows.length;
        const nIn = isNew ? ease(frame, newRowAt!, newRowAt! + 14) : 1;
        if (isNew && frame < newRowAt!) return null;
        const flash = isNew ? interpolate(frame, [newRowAt!, newRowAt! + 10, newRowAt! + 70], [0, 1, 0.35], clamp) : highlightRow === ri ? 1 : 0;
        return (
          <div
            key={ri}
            style={{
              display: "flex",
              height: rowH * nIn,
              overflow: "hidden",
              borderBottom: "1px solid #e3e6e8",
              background: ri === 0 ? "#fff" : `rgba(52,168,83,${0.16 * flash})`,
              fontSize: 15,
              fontWeight: ri === 0 ? 700 : 400,
              color: "#202124",
            }}
          >
            <div style={{ width: 40, flexShrink: 0, display: "grid", placeItems: "center", background: "#f8f9fa", borderRight: "1px solid #e3e6e8", fontSize: 13, color: "#5f6368" }}>{ri + 1}</div>
            {r.map((cell, ci) => (
              <div key={ci} style={{ width: cols[ci].w, flexShrink: 0, boxSizing: "border-box", padding: "0 10px", lineHeight: `${rowH}px`, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", borderRight: "1px solid #e3e6e8", fontFamily: ri === 0 ? AF.mono : AF.body, fontSize: ri === 0 ? 14 : 15 }}>
                {isNew ? typed(cell, frame, newRowAt! + 4 + ci * 6, newRowAt! + 16 + ci * 6) : cell}
              </div>
            ))}
          </div>
        );
      })}
      <div style={{ height: 40, background: "#fff" }} />
      <div style={{ display: "flex", gap: 4, padding: "8px 12px", background: "#f8f9fa", borderTop: "1px solid #e3e6e8" }}>
        {tabs.map((t) => (
          <span key={t} style={{ padding: "6px 14px", borderRadius: "6px 6px 0 0", fontSize: 14, fontWeight: t === activeTab ? 700 : 500, color: t === activeTab ? A.sheetGreen : "#5f6368", background: t === activeTab ? "#e6f4ea" : "transparent" }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ───────────────────────── 5 · Sheets as the database ───────────────────────── */

const CODE = [
  { t: "function doPost(e) {", c: "kw" },
  { t: "  var data = JSON.parse(e.postData.contents);", c: "" },
  { t: "  var sheet = ss.getSheetByName(sheetName);", c: "" },
  { t: "  if (!sheet) sheet = ss.insertSheet(sheetName);", c: "" },
  { t: "  keys.forEach(function (key) {", c: "" },
  { t: "    if (headers.indexOf(key) < 0) headers.push(key);", c: "" },
  { t: "  });", c: "" },
  { t: "  sheet.appendRow(rowValues);", c: "" },
  { t: "}", c: "kw" },
  { t: "", c: "" },
  { t: "function doGet(e) {  // Blogs tab → JSON", c: "kw" },
];
const HL = [1, 2, 3, 5, 7]; // lines lit as the request runs

export const SheetsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const hl = Math.floor(interpolate(frame, [118, 188], [0, HL.length], clamp));
  // packet legs: forms → script, script → sheet
  const leg1 = ease(frame, 72, 110);
  const leg2 = ease(frame, 190, 218);
  const sources = ["Chatbot Welcome Form", "Contact Page", "Appointment booking", "Pharmacist registration", "6 service-page forms"];

  return (
    <AbsoluteFill>
      <LightBg />
      <div style={{ position: "absolute", left: 120, top: 84 }}>
        <Kicker>The backend</Kicker>
        <div style={{ marginTop: 14 }}>
          <Rise text="No database. Just [Google Sheets] + Apps Script." size={62} accent={A.sheetGreen} delay={4} stagger={2} />
        </div>
      </div>

      {/* Forms */}
      <div style={{ position: "absolute", left: 120, top: 290, width: 400, ...fadeUp(frame, 20) }}>
        <div style={{ fontFamily: AF.mono, fontSize: 18, color: A.inkSoft, marginBottom: 14 }}>amretrihealthcare.com</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sources.map((s, i) => (
            <div
              key={s}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 20px",
                borderRadius: 16,
                background: "#fff",
                border: `1.5px solid ${i === 0 ? A.brand : A.border}`,
                boxShadow: i === 0 ? "0 14px 34px rgba(22,180,191,0.2)" : "0 4px 14px rgba(15,47,58,0.05)",
                fontFamily: AF.body,
                fontSize: 22,
                fontWeight: 600,
                color: A.ink,
                ...fadeUp(frame, 26 + i * 6, 14),
              }}
            >
              <Icon name={i === 0 ? "message" : "check"} size={22} color={i === 0 ? A.brand : A.inkSoft} />
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Apps Script */}
      <div style={{ position: "absolute", left: 570, top: 290, width: 580, borderRadius: 18, overflow: "hidden", background: "#0d1f26", boxShadow: "0 40px 100px rgba(15,47,58,0.3)", ...fadeUp(frame, 40) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: "#13303a", fontFamily: AF.body, fontSize: 19, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
          <Icon name="code" size={20} color={A.brand} /> Apps Script · <span style={{ fontFamily: AF.mono, fontWeight: 400 }}>Code.gs</span>
        </div>
        <div style={{ padding: "18px 0" }}>
          {CODE.map((l, i) => {
            const lit = HL.slice(0, hl).includes(i) && frame < 230;
            return (
              <div key={i} style={{ display: "flex", fontFamily: AF.mono, fontSize: 17, lineHeight: "34px", whiteSpace: "pre", background: lit ? "rgba(22,180,191,0.18)" : "transparent", borderLeft: `3px solid ${lit ? A.brand : "transparent"}` }}>
                <span style={{ width: 46, textAlign: "right", paddingRight: 16, color: "rgba(255,255,255,0.25)" }}>{i + 1}</span>
                <span style={{ color: l.c === "kw" ? "#7fdbe2" : "rgba(255,255,255,0.86)" }}>{l.t}</span>
              </div>
            );
          })}
        </div>
        <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", fontFamily: AF.mono, fontSize: 15, color: "rgba(255,255,255,0.5)" }}>Deployed as a Web App → script.google.com/…/exec</div>
      </div>

      {/* Sheet */}
      <div style={{ position: "absolute", left: 1190, top: 290, ...fadeUp(frame, 56) }}>
        <SheetMock
          frame={frame}
          width={630}
          title="Amretri Healthcare Leads"
          cols={[
            { h: "timestamp", w: 128 },
            { h: "formSource", w: 176 },
            { h: "name", w: 132 },
            { h: "email", w: 154 },
          ]}
          rows={[
            ["02/10/2026, 4:12 pm", "Contact Page", "Rahul Mehta", "rahul@citycare.in"],
            ["02/10/2026, 6:47 pm", "Compliance & Audit Page", "Anita Rao", "anita@lifeline.org"],
            ["03/10/2026, 11:05 am", "Chatbot Welcome Form", "Dr. Priya Nair", "priya@sunrisehospital.in"],
          ]}
          newRowAt={218}
          tabs={["Inquiries", "Appointments", "Careers", "Blogs"]}
          activeTab="Inquiries"
        />
      </div>

      {/* The request travelling */}
      {frame >= 66 && frame < 120 && (
        <Packet x={lerp(leg1, 470, 760)} y={lerp(leg1, 330, 262)} o={interpolate(frame, [66, 74, 110, 120], [0, 1, 1, 0], clamp)} label={`POST { formType: "inquiry", name, email }`} />
      )}
      {frame >= 184 && frame < 228 && <Packet x={lerp(leg2, 1050, 1440)} y={lerp(leg2, 600, 520)} o={interpolate(frame, [184, 192, 218, 228], [0, 1, 1, 0], clamp)} label="appendRow()" green />}

      {/* Takeaways */}
      <div style={{ position: "absolute", left: 120, top: 900, display: "flex", gap: 22 }}>
        {["One script is the whole backend", "Every form gets its own tab — auto-created", "New fields become new columns"].map((t, i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", borderRadius: 999, background: A.ink, color: "#fff", fontFamily: AF.body, fontWeight: 600, fontSize: 23, ...fadeUp(frame, 262 + i * 16, 16) }}>
              <Icon name="check" size={22} color={A.brand} stroke={3} />
              {t}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Packet: React.FC<{ x: number; y: number; o: number; label: string; green?: boolean }> = ({ x, y, o, label, green }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, translate: "-50% -50%" }}>
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 12, background: green ? A.sheetGreen : A.orange, color: "#fff", fontFamily: AF.mono, fontSize: 17, fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 14px 34px rgba(15,47,58,0.3)" }}>{label}</span>
  </div>
);

/* ───────────────────────── 6 · Blog from a Sheet ───────────────────────── */

// Card boxes in blog.jpg, in 1440-wide CSS px.
const CARDS = [
  { x: 171, w: 339 },
  { x: 549, w: 342 },
  { x: 927, w: 345 },
];
const CARD_Y = 612;
const ROW_AT = [110, 140, 170];

export const BlogScene: React.FC = () => {
  const frame = useCurrentFrame();
  const bw = 820;
  const k = bw / 1440;
  const active = ROW_AT.reduce((acc, f, i) => (frame >= f ? i : acc), -1);
  const json = ease(frame, 80, 100);
  return (
    <AbsoluteFill>
      <LightBg />
      <div style={{ position: "absolute", left: 120, top: 84 }}>
        <Kicker>The blog</Kicker>
        <div style={{ marginTop: 14 }}>
          <Rise text="And the blog? [It's a Sheet too.]" size={62} accent={A.sheetGreen} delay={4} stagger={2} />
        </div>
      </div>

      <div style={{ position: "absolute", left: 120, top: 300, ...fadeUp(frame, 16) }}>
        <SheetMock
          frame={frame}
          width={780}
          title="Amretri Healthcare Leads"
          cols={[
            { h: "id", w: 50 },
            { h: "title", w: 300 },
            { h: "category", w: 120 },
            { h: "date", w: 130 },
            { h: "content", w: 140 },
          ]}
          rows={[
            ["1", "5 Ways to Prevent Billing Leakage in Hospital Pharmacies", "Operations", "July 12, 2026", "<p>Billing leakages…"],
            ["2", "Outsourcing vs. In-house Management", "Strategy", "July 05, 2026", "<p>As healthcare…"],
            ["3", "Managing Expiry & Dead Stock", "Inventory", "June 25, 2026", "<p>Near-expiry and…"],
          ]}
          highlightRow={active + 1}
          tabs={["Inquiries", "Appointments", "Careers", "Blogs"]}
          activeTab="Blogs"
        />
      </div>

      {/* doGet → JSON */}
      <div style={{ position: "absolute", left: 120, top: 760, opacity: json, translate: `0px ${lerp(json, 16, 0)}px`, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ padding: "12px 20px", borderRadius: 12, background: A.ink, color: "#fff", fontFamily: AF.mono, fontSize: 19 }}>
          GET /exec?action=getBlogs <span style={{ color: A.brand }}>→ JSON</span>
        </span>
        <span style={{ fontFamily: AF.body, fontSize: 22, color: A.inkSoft }}>fetched live by /blog</span>
      </div>

      <div style={{ position: "absolute", left: 980, top: 290, ...fadeUp(frame, 30) }}>
        <Browser url="amretrihealthcare.com/blog" width={bw} height={(bw * 900) / 1440 + 46}>
          <Img src={staticFile("amretri/blog.jpg")} style={{ position: "absolute", inset: 0, width: bw }} />
          {CARDS.map((c, i) => {
            const on = i === active;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: c.x * k - 4,
                  top: CARD_Y * k - 4,
                  width: c.w * k + 8,
                  height: 300 * k,
                  borderRadius: 14,
                  border: `3px solid ${A.sheetGreen}`,
                  boxShadow: on ? "0 0 0 6px rgba(52,168,83,0.18)" : "none",
                  opacity: frame >= ROW_AT[i] ? (on ? 1 : 0.35) : 0,
                }}
              />
            );
          })}
        </Browser>
      </div>

      <div style={{ position: "absolute", left: 120, top: 900, display: "flex", gap: 22 }}>
        {["Add a row → the post is live", "No CMS, no redeploy", "HTML allowed in the content cell"].map((t, i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", borderRadius: 999, background: A.ink, color: "#fff", fontFamily: AF.body, fontWeight: 600, fontSize: 23, ...fadeUp(frame, 210 + i * 16, 16) }}>
            <Icon name="check" size={22} color={A.brand} stroke={3} />
            {t}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────────────────── 7 · Outro ───────────────────────── */

export const CASE_STUDY_URL = "vimalsrinivasan.vercel.app/projects/amretri-healthcare";
export const OUTRO_FRAMES = 380;

// Recap the stack, then hand off to the written case study and fade out.
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const stack = [
    { icon: "globe", t: "React + TanStack Start", s: "multi-page site, SEO-ready" },
    { icon: "cpu", t: "In-browser AI", s: "rules first, WebLLM for the rest" },
    { icon: "sheet", t: "Google Sheets", s: "+ Apps Script as the backend" },
    { icon: "zap", t: "Vercel", s: "static hosting, near-zero cost" },
  ];
  const out = ease(frame, 150, 178);
  const page = ease(frame, 160, 204);
  const cta = ease(frame, 176, 200);
  const bw = 1240;
  const k = bw / 1440;
  // Case-study page (casestudy.jpg is 1440×3600): title → hero → metrics → film
  const scroll = interpolate(frame, [214, 360], [0, 1330], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(135deg, ${A.night} 0%, ${A.footer} 60%, ${A.brandDeep} 100%)` }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />

      {/* Recap */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 230, opacity: 1 - out, translate: `0px ${-out * 80}px` }}>
        <Rise text="Zero AI servers. [Zero database bills.]" size={84} color="#fff" accent="#8BE6EC" align="center" stagger={3} />
        <div style={{ display: "flex", gap: 22, marginTop: 90 }}>
          {stack.map((s, i) => (
            <div key={s.t} style={{ width: 360, padding: "26px 28px", borderRadius: 24, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", fontFamily: AF.body, ...fadeUp(frame, 34 + i * 10) }}>
              <Icon name={s.icon} size={34} color="#8BE6EC" />
              <div style={{ marginTop: 16, fontFamily: AF.head, fontWeight: 700, fontSize: 30, color: "#fff" }}>{s.t}</div>
              <div style={{ marginTop: 6, fontSize: 21, color: "rgba(255,255,255,0.7)" }}>{s.s}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>

      {/* Hand-off: the written case study */}
      {frame >= 150 && (
        <>
          <AbsoluteFill style={{ alignItems: "center", paddingTop: 70, opacity: cta, translate: `0px ${lerp(cta, 24, 0)}px` }}>
            <div style={{ fontFamily: AF.head, fontWeight: 800, fontSize: 64, letterSpacing: "-0.025em", color: "#fff" }}>
              Read the full <span style={{ color: "#8BE6EC" }}>case study</span>
            </div>
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", borderRadius: 999, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", fontFamily: AF.mono, fontSize: 24, color: "#fff" }}>
              <Icon name="globe" size={22} color="#8BE6EC" />
              {CASE_STUDY_URL}
            </div>
          </AbsoluteFill>
          <div style={{ position: "absolute", left: (1920 - bw) / 2, top: lerp(page, 1080, 300), opacity: page }}>
            <Browser url={CASE_STUDY_URL} width={bw} height={46 + 900 * k}>
              <Img src={staticFile("amretri/casestudy.jpg")} style={{ position: "absolute", left: 0, top: 0, width: bw, translate: `0px ${-scroll * k}px` }} />
            </Browser>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
