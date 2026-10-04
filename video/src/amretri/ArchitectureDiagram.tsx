import React from "react";
import { AbsoluteFill } from "remotion";
import { A, AF, Icon } from "./brand";

// Static system diagram for the Amretri case study (1600×1000 still).
// Every box maps to real code: ChatBot.tsx, chatbot-data.json, lib/sheets.ts,
// the Apps Script in docs/GOOGLE_SHEETS_SETUP.md, routes/blog.tsx.

const card: React.CSSProperties = {
  position: "absolute",
  boxSizing: "border-box",
  borderRadius: 18,
  background: "#fff",
  border: `1px solid ${A.input}`,
  boxShadow: "0 10px 30px rgba(15,47,58,0.07)",
  fontFamily: AF.body,
  color: A.ink,
};

const Title: React.FC<{ icon: string; color?: string; children: React.ReactNode; sub?: string }> = ({ icon, color = A.brand, children, sub }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
    <span style={{ display: "grid", placeItems: "center", width: 42, height: 42, borderRadius: 12, background: `${color}1f`, flexShrink: 0 }}>
      <Icon name={icon} size={22} color={color} />
    </span>
    <div>
      <div style={{ fontFamily: AF.head, fontWeight: 700, fontSize: 22, lineHeight: 1.15 }}>{children}</div>
      {sub && <div style={{ fontSize: 15, color: A.inkSoft, marginTop: 3 }}>{sub}</div>}
    </div>
  </div>
);

const Row: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "baseline", padding: "10px 0", borderTop: `1px solid ${A.border}` }}>
    <span style={{ width: 118, flexShrink: 0, fontWeight: 700, fontSize: 16, color: A.brandDeep }}>{k}</span>
    <span style={{ fontSize: 16, lineHeight: 1.4, color: A.ink }}>{v}</span>
  </div>
);

const Label: React.FC<{ x: number; y: number; children: React.ReactNode; color?: string; align?: "left" | "center" }> = ({ x, y, children, color = A.inkSoft, align = "center" }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: align === "center" ? "-50% 0" : undefined, fontFamily: AF.mono, fontSize: 14, lineHeight: 1.35, color, textAlign: align, whiteSpace: "nowrap" }}>{children}</div>
);

export const ArchitectureDiagram: React.FC = () => (
  <AbsoluteFill style={{ background: "#fbfcfc", fontFamily: AF.body }}>
    <AbsoluteFill
      style={{
        backgroundImage: "linear-gradient(rgba(15,47,58,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,47,58,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />

    {/* Heading */}
    <div style={{ position: "absolute", left: 50, top: 42 }}>
      <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.2em", textTransform: "uppercase", color: A.orange }}>AMRI · system architecture</div>
      <div style={{ marginTop: 8, fontFamily: AF.head, fontWeight: 800, fontSize: 40, letterSpacing: "-0.02em", color: A.ink }}>
        No app server. No database. <span style={{ color: A.brand }}>One browser tab and one Sheet.</span>
      </div>
    </div>

    {/* Browser boundary */}
    <div style={{ position: "absolute", left: 50, top: 160, width: 570, height: 606, borderRadius: 26, border: `2px dashed ${A.brand}88`, background: "rgba(22,180,191,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 22px" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} style={{ width: 11, height: 11, borderRadius: 99, background: c }} />
        ))}
        <span style={{ marginLeft: 10, fontFamily: AF.mono, fontSize: 15, color: A.inkSoft }}>Visitor&apos;s browser — amretrihealthcare.com</span>
      </div>
    </div>

    <div style={{ ...card, left: 76, top: 214, width: 518, padding: "18px 20px" }}>
      <Title icon="globe" sub="TanStack Start · React 19 · 14 pages · forms on every service page">Website</Title>
    </div>

    <div style={{ ...card, left: 76, top: 318, width: 518, padding: "18px 20px 8px", border: `1.5px solid ${A.brand}` }}>
      <Title icon="stethoscope" sub="ChatBot.tsx — runs entirely client-side">AMRI chat widget</Title>
      <div style={{ marginTop: 14 }}>
        <Row k="Identify" v="Name + email first; remembered in localStorage" />
        <Row k="Route" v="Intent rules start 1 of 6 guided lead flows" />
        <Row k="Answer" v="Token match over 52 Q&As in 11 sections" />
        <Row k="Qualify" v="3–7 questions, each answer validated" />
      </div>
    </div>

    <div style={{ ...card, left: 76, top: 664, width: 518, padding: "16px 20px", background: "transparent", border: `1.5px dashed ${A.inkSoft}66`, boxShadow: "none" }}>
      <Title icon="cpu" color={A.inkSoft} sub="WebLLM on WebGPU · weights cached in the browser">
        Next: on-device small language model
      </Title>
    </div>

    {/* Apps Script */}
    <div style={{ ...card, left: 740, top: 268, width: 340, padding: "20px 22px", background: "#0d1f26", border: "none", color: "#fff" }}>
      <Title icon="code" color="#7fdbe2" sub="">
        <span style={{ color: "#fff" }}>Apps Script web app</span>
      </Title>
      <div style={{ marginTop: 16, fontFamily: AF.mono, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>
        <div style={{ color: "#7fdbe2" }}>doPost(e)</div>
        <div>· formType → its own tab</div>
        <div>· creates the tab if missing</div>
        <div>· adds columns for new fields</div>
        <div>· appendRow(…)</div>
        <div style={{ color: "#7fdbe2", marginTop: 10 }}>doGet(e)</div>
        <div>· Blogs tab → JSON</div>
      </div>
    </div>

    {/* Sheet */}
    <div style={{ ...card, left: 1200, top: 214, width: 350, padding: "20px 22px" }}>
      <Title icon="sheet" color={A.sheetGreen} sub="the CRM and the CMS">Google Sheet</Title>
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          ["Inquiries", "chat · contact · service forms"],
          ["Appointments", "strategy-call bookings"],
          ["Careers", "pharmacist registrations"],
          ["Blogs", "one row per post (HTML body)"],
        ].map(([t, d]) => (
          <div key={t} style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "10px 14px", borderRadius: 12, background: t === "Blogs" ? "#e6f4ea" : A.secondary, border: `1px solid ${A.border}` }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: t === "Blogs" ? A.sheetGreen : A.ink, width: 112, flexShrink: 0 }}>{t}</span>
            <span style={{ fontSize: 14, color: A.inkSoft }}>{d}</span>
          </div>
        ))}
      </div>
    </div>

    {/* WhatsApp */}
    <div style={{ ...card, left: 1200, top: 640, width: 350, padding: "18px 22px" }}>
      <Title icon="message" color="#1FA855" sub="pre-filled brief, one tap to send">Amretri team on WhatsApp</Title>
    </div>

    {/* Arrows */}
    <svg width={1600} height={1000} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill={A.ink} />
        </marker>
        <marker id="arrG" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#1FA855" />
        </marker>
      </defs>
      {/* forms + chat → Apps Script */}
      <path d="M594 420 L736 420" stroke={A.ink} strokeWidth={2.2} fill="none" markerEnd="url(#arr)" />
      {/* Apps Script → Sheet */}
      <path d="M1080 420 L1196 420" stroke={A.ink} strokeWidth={2.2} fill="none" markerEnd="url(#arr)" />
      {/* Blogs JSON back to the website */}
      <path d="M740 300 C 680 300, 660 262, 598 262" stroke={A.sheetGreen} strokeWidth={2.2} strokeDasharray="7 6" fill="none" markerEnd="url(#arr)" />
      {/* Chat → WhatsApp */}
      <path d="M594 560 C 660 560, 650 712, 760 712 L 1196 712" stroke="#1FA855" strokeWidth={2.2} fill="none" markerEnd="url(#arrG)" />
    </svg>
    <Label x={680} y={384}>POST</Label>
    <Label x={680} y={430}>no-cors</Label>
    <Label x={1138} y={428}>append<br />row</Label>
    <Label x={668} y={232} color={A.sheetGreen}>GET → JSON</Label>
    <Label x={960} y={722} color="#178a45">wa.me deep link with the full brief</Label>

    {/* Footer */}
    <div style={{ position: "absolute", left: 50, top: 806, width: 1500, display: "flex", gap: 14 }}>
      {[
        ["zap", "Hosted on Vercel"],
        ["lock", "No API keys in the browser"],
        ["server", "No app server, no database"],
        ["sheet", "Team works in Sheets + WhatsApp"],
      ].map(([i, t]) => (
        <div key={t} style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderRadius: 16, background: A.ink, color: "#fff", fontSize: 17, fontWeight: 600 }}>
          <Icon name={i} size={20} color="#8BE6EC" />
          {t}
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
