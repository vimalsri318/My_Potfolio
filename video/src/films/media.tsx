import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../theme";
import { PROJECTS } from "../projects";
import type { Media } from "./types";
import { BrowserChrome, clamp, FF, Icon, INK, INK_SOFT, lerp, PhoneShell, rgba, typed } from "./kit";

// Every media type fits inside a w×h box and animates from its own frame 0
// (Film wraps each one in a Sequence starting when it appears).

type Props = { media: Media; w: number; h: number; accent: string; dur: number };

export const MediaView: React.FC<Props> = (p) => {
  switch (p.media.type) {
    case "image":
      return <ImageMedia {...p} media={p.media} />;
    case "stage":
      return <StageMedia {...p} media={p.media} />;
    case "terminal":
      return <TerminalMedia {...p} media={p.media} />;
    case "chat":
      return <ChatMedia {...p} media={p.media} />;
    case "cards":
      return <CardsMedia {...p} media={p.media} />;
    case "phones":
      return <PhonesMedia {...p} media={p.media} />;
  }
};

const Centered: React.FC<{ w: number; h: number; children: React.ReactNode }> = ({ w, h, children }) => (
  <div style={{ width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
);

const ImageMedia: React.FC<Props & { media: Extract<Media, { type: "image" }> }> = ({ media, w, h, dur }) => {
  const frame = useCurrentFrame();
  const frameKind = media.frame ?? "browser";
  const srcW = media.srcWidth ?? 1440;
  if (frameKind === "phone") {
    const pw = Math.min(h / 2.08, 330);
    const k = (pw * 0.93) / (media.srcWidth ?? 390);
    const y = media.scroll ? interpolate(frame, [20, Math.max(40, dur - 20)], [0, -media.scroll * k], { ...clamp, easing: (t) => t * t * (3 - 2 * t) }) : 0;
    return (
      <Centered w={w} h={h}>
        <PhoneShell width={pw} screen={media.bg ?? "#fff"}>
          <Img src={staticFile(media.src)} style={media.scroll ? { width: "100%", display: "block", translate: `0px ${y}px` } : { width: "100%", height: "100%", objectFit: media.fit ?? "cover", objectPosition: "top" }} />
        </PhoneShell>
      </Centered>
    );
  }
  if (frameKind === "plain") {
    const z = interpolate(frame, [0, dur], [1, 1.05], clamp);
    return (
      <Centered w={w} h={h}>
        <div style={{ width: w, height: h, borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 100px rgba(16,16,20,0.25)", background: media.bg ?? "#0d0d12", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile(media.src)} style={{ width: "100%", height: "100%", objectFit: media.fit ?? "cover", scale: String(z) }} />
        </div>
      </Centered>
    );
  }
  // browser
  const bw = Math.min(w, (h - 42) * 1.6);
  const bh = Math.min(h, bw / 1.6 + 42);
  const k = bw / srcW;
  const y = media.scroll ? interpolate(frame, [24, Math.max(48, dur - 16)], [0, -media.scroll * k], { ...clamp, easing: (t) => t * t * (3 - 2 * t) }) : 0;
  return (
    <Centered w={w} h={h}>
      <BrowserChrome url={media.url} width={bw} height={bh}>
        <Img
          src={staticFile(media.src)}
          style={media.scroll ? { position: "absolute", left: 0, top: 0, width: bw, translate: `0px ${y}px` } : { width: "100%", height: "100%", objectFit: media.fit ?? "cover", objectPosition: "top", background: media.bg }}
        />
      </BrowserChrome>
    </Centered>
  );
};

// The animated 1280×800 catalogue stage for a project, scaled to fit.
const StageMedia: React.FC<Props & { media: Extract<Media, { type: "stage" }> }> = ({ media, w, h }) => {
  const project = PROJECTS.find((x) => x.slug === media.slug);
  if (!project) return null;
  const s = Math.min(w / 1280, h / 800);
  return (
    <Centered w={w} h={h}>
      <div style={{ width: 1280 * s, height: 800 * s, borderRadius: 22, overflow: "hidden", boxShadow: "0 40px 100px rgba(16,16,20,0.25)", position: "relative" }}>
        <div style={{ width: 1280, height: 800, scale: String(s), transformOrigin: "top left", position: "absolute", left: 0, top: 0 }}>
          <project.Stage />
        </div>
      </div>
    </Centered>
  );
};

const TERM_COLORS: Record<string, string> = { cmd: "#e6edf3", out: "#c9d1d9", ok: "#3fb950", err: "#f85149", dim: "#7d8590", accent: "#58a6ff" };

const TerminalMedia: React.FC<Props & { media: Extract<Media, { type: "terminal" }> }> = ({ media, w, h, dur }) => {
  const frame = useCurrentFrame();
  // Commands type out; output lines pop in. Spread across the visible time.
  const per = Math.max(8, Math.min(26, (dur - 40) / Math.max(1, media.lines.length)));
  let t = 12;
  const starts = media.lines.map((l) => {
    const s = t;
    t += l.kind === "cmd" ? Math.max(per, l.text.length * 0.9) : per * 0.55;
    return s;
  });
  const tw = Math.min(w, 1060);
  return (
    <Centered w={w} h={h}>
      <div style={{ width: tw, maxHeight: h, borderRadius: 16, overflow: "hidden", background: "#0d1117", boxShadow: "0 40px 100px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)" }}>
        <div style={{ height: 40, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", background: "#161b22", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: 11, height: 11, borderRadius: 99, background: c }} />
          ))}
          <span style={{ marginLeft: 12, fontFamily: FF.mono, fontSize: 14, color: "#7d8590" }}>{media.title ?? "zsh"}</span>
        </div>
        <div style={{ padding: "22px 26px", fontFamily: FF.mono, fontSize: media.size ?? 21, lineHeight: 1.6, minHeight: 300 }}>
          {media.lines.map((l, i) => {
            if (frame < starts[i]) return null;
            const isCmd = l.kind === "cmd";
            const text = isCmd ? typed(l.text, frame, starts[i], starts[i] + Math.max(10, l.text.length * 0.8)) : l.text;
            return (
              <div key={i} style={{ color: TERM_COLORS[l.kind ?? "out"], whiteSpace: "pre-wrap" }}>
                {isCmd && <span style={{ color: "#3fb950" }}>$ </span>}
                {text}
              </div>
            );
          })}
        </div>
      </div>
    </Centered>
  );
};

const ChatMedia: React.FC<Props & { media: Extract<Media, { type: "chat" }> }> = ({ media, w, h, accent, dur }) => {
  const frame = useCurrentFrame();
  const per = Math.max(14, Math.min(40, (dur - 30) / Math.max(1, media.messages.length)));
  const pw = Math.min(h / 2.08, 360);
  return (
    <Centered w={w} h={h}>
      <PhoneShell width={pw} screen="#f2f2f5">
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ paddingTop: pw * 0.16, paddingBottom: 12, paddingInline: 16, background: accent, color: "#fff", fontFamily: FF.body }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{media.title ?? "Chat"}</div>
            {media.sub && <div style={{ fontSize: 12, opacity: 0.85 }}>{media.sub}</div>}
          </div>
          <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 8, overflow: "hidden" }}>
            {media.messages.map((m, i) => {
              const at = 10 + i * per;
              if (frame < at) return null;
              const p = ease(frame, at, at + 12);
              const me = m.from === "me";
              return (
                <div key={i} style={{ alignSelf: me ? "flex-end" : "flex-start", maxWidth: "82%", opacity: p, translate: `0px ${lerp(p, 10, 0)}px` }}>
                  {m.tag && <div style={{ fontFamily: FF.mono, fontSize: 10, color: INK_SOFT, marginBottom: 3, textAlign: me ? "right" : "left" }}>{m.tag}</div>}
                  <div style={{ padding: "9px 12px", borderRadius: 16, borderBottomRightRadius: me ? 4 : 16, borderBottomLeftRadius: me ? 16 : 4, background: me ? accent : "#fff", color: me ? "#fff" : INK, fontFamily: FF.body, fontSize: 14, lineHeight: 1.4, boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}>
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PhoneShell>
    </Centered>
  );
};

const CardsMedia: React.FC<Props & { media: Extract<Media, { type: "cards" }> }> = ({ media, w, h, accent, dur }) => {
  const frame = useCurrentFrame();
  const n = media.items.length;
  const per = Math.max(8, Math.min(30, (dur - 30) / Math.max(1, n)));
  const cw = Math.min(w, 760);
  const rowH = Math.min(118, (h - (media.title ? 60 : 0)) / n - 14);
  return (
    <Centered w={w} h={h}>
      <div style={{ width: cw }}>
        {media.title && <div style={{ fontFamily: FF.mono, fontSize: 18, color: INK_SOFT, marginBottom: 16 }}>{media.title}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {media.items.map((it, i) => {
            const at = 8 + i * per;
            const p = ease(frame, at, at + 16);
            return (
              <div
                key={i}
                style={{
                  height: rowH,
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "0 26px",
                  borderRadius: 20,
                  background: "#fff",
                  border: `1px solid rgba(16,16,20,0.08)`,
                  boxShadow: "0 14px 34px rgba(16,16,20,0.08)",
                  opacity: p,
                  translate: `${lerp(p, 30, 0)}px 0px`,
                }}
              >
                {it.icon && (
                  <span style={{ display: "grid", placeItems: "center", width: 54, height: 54, borderRadius: 14, background: rgba(accent, 0.12), flexShrink: 0 }}>
                    <Icon name={it.icon} size={28} color={accent} />
                  </span>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FF.head, fontWeight: 700, fontSize: 26, color: INK }}>{it.title}</div>
                  {it.sub && <div style={{ fontFamily: FF.body, fontSize: 19, color: INK_SOFT, marginTop: 3 }}>{it.sub}</div>}
                </div>
                {it.tag && <span style={{ fontFamily: FF.mono, fontSize: 15, padding: "6px 12px", borderRadius: 999, background: rgba(accent, 0.12), color: accent, whiteSpace: "nowrap" }}>{it.tag}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </Centered>
  );
};

const PhonesMedia: React.FC<Props & { media: Extract<Media, { type: "phones" }> }> = ({ media, w, h }) => {
  const frame = useCurrentFrame();
  const n = media.srcs.length;
  const pw = Math.min(h / 2.08, (w - (n - 1) * 30) / n, 320);
  return (
    <Centered w={w} h={h}>
      <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
        {media.srcs.map((src, i) => {
          const p = ease(frame, 6 + i * 8, 30 + i * 8);
          return (
            <div key={src} style={{ opacity: p, translate: `0px ${lerp(p, 60, i === 1 ? -20 : 0)}px` }}>
              <PhoneShell width={pw}>
                <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              </PhoneShell>
            </div>
          );
        })}
      </div>
    </Centered>
  );
};
