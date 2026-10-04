import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, staticFile } from "remotion";
import type { DiagramBox, DiagramSpec, FilmScript } from "./types";
import { FF, Icon, INK, INK_SOFT, rgba } from "./kit";

// Generic system diagram (1600×900 still) for a case study, from the
// `diagram` block of public/films/<slug>/script.json. Columns of boxes, an
// optional dashed boundary (e.g. "runs in the browser"), and edges drawn
// between box edges with labels.

export const DW = 1600;
export const DH = 900;
const TOP = 176;
const X0 = 50;
const X1 = 1550;

type Props = { slug: string; spec?: DiagramSpec; accent?: string };

export const calcDiagram: CalculateMetadataFunction<Props> = async ({ props }) => {
  const script: FilmScript = await fetch(staticFile(`films/${props.slug}/script.json`)).then((r) => r.json());
  return { props: { ...props, spec: script.diagram, accent: script.accent } };
};

const boxHeight = (b: DiagramBox, w: number) => {
  const charsPerLine = Math.max(18, Math.floor((w - 100) / 8.6));
  const subLines = b.sub ? Math.ceil(b.sub.length / charsPerLine) : 0;
  const lineRows = (b.lines ?? []).reduce((n, l) => n + Math.ceil(l.length / Math.floor((w - 44) / 8.4)), 0);
  return 30 + 30 + subLines * 21 + (lineRows ? 14 + lineRows * 25 : 0) + 22;
};

export const Diagram: React.FC<Props> = ({ spec, accent = "#4F46E5" }) => {
  if (!spec) return null;
  const n = spec.columns.length;
  const gap = n > 3 ? 92 : 120;
  const colW = (X1 - X0 - gap * (n - 1)) / n;
  const bottom = spec.footer ? 770 : 860;
  const inGroup = (c: number) => spec.group?.columns.includes(c);
  // Lay out every box: stacked and vertically centred in its column.
  const rects: Record<string, { x: number; y: number; w: number; h: number; col: number }> = {};
  spec.columns.forEach((col, c) => {
    const x = X0 + c * (colW + gap);
    const pad = inGroup(c) ? 22 : 0;
    const hs = col.boxes.map((b) => boxHeight(b, colW - pad * 2));
    const sum = hs.reduce((a, b) => a + b, 0) + 18 * (hs.length - 1);
    const top = TOP + (inGroup(c) ? 56 : 30) + (col.label ? 34 : 0);
    let y = top + Math.max(0, (bottom - top - sum) / 2);
    col.boxes.forEach((b, i) => {
      rects[b.id] = { x: x + pad, y, w: colW - pad * 2, h: hs[i], col: c };
      y += hs[i] + 18;
    });
  });
  const g = spec.group;
  const gx0 = g ? X0 + Math.min(...g.columns) * (colW + gap) - 6 : 0;
  const gx1 = g ? X0 + Math.max(...g.columns) * (colW + gap) + colW + 6 : 0;

  // Edges that skip a column route above (or below) the boxes in between.
  const route = (a: (typeof rects)[string], b: (typeof rects)[string]) => {
    const lo = Math.min(a.col, b.col) + 1;
    const hi = Math.max(a.col, b.col) - 1;
    if (hi < lo) return null;
    const mids = Object.values(rects).filter((r) => r.col >= lo && r.col <= hi);
    const top = Math.min(...mids.map((r) => r.y));
    const bot = Math.max(...mids.map((r) => r.y + r.h));
    const y1 = a.y + a.h / 2;
    const up = top - 26 > TOP + 40 && (y1 < (top + bot) / 2 || bot + 26 > bottom);
    return { y: up ? top - 26 : bot + 26, up };
  };
  // Parallel skip edges share a lane — give each its own, 34px apart.
  const lanes: Record<number, number> = {};
  const used: Record<string, number> = {};
  spec.edges.forEach((e, i) => {
    const a = rects[e.from];
    const b = rects[e.to];
    if (!a || !b) return;
    const r = route(a, b);
    if (r === null) return;
    const key = String(r.y);
    const k = used[key] ?? 0;
    used[key] = k + 1;
    lanes[i] = r.y + (r.up ? -34 : 34) * k;
  });

  const words = spec.headline.split(" ");
  let hi = false;

  return (
    <AbsoluteFill style={{ background: "#fbfbfa", fontFamily: FF.body }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(16,16,20,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,16,20,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div style={{ position: "absolute", left: X0, top: 40 }}>
        <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.2em", textTransform: "uppercase", color: accent }}>{spec.kicker}</div>
        <div style={{ marginTop: 8, fontFamily: FF.head, fontWeight: 800, fontSize: 40, letterSpacing: "-0.02em", color: INK }}>
          {words.map((raw, i) => {
            let w = raw;
            if (w.startsWith("[")) {
              hi = true;
              w = w.slice(1);
            }
            const close = /\][.,;:?!]*$/.test(w);
            w = w.replace(/\](?=[.,;:?!]*$)/, "");
            const span = (
              <span key={i} style={{ color: hi ? accent : undefined }}>
                {w}{" "}
              </span>
            );
            if (close) hi = false;
            return span;
          })}
        </div>
      </div>

      {g && (
        <div style={{ position: "absolute", left: gx0, top: TOP, width: gx1 - gx0, height: bottom - TOP + 10, borderRadius: 26, border: `2px dashed ${rgba(accent, 0.5)}`, background: rgba(accent, 0.04) }}>
          <div style={{ padding: "14px 22px", fontFamily: FF.mono, fontSize: 15, color: INK_SOFT }}>{g.label}</div>
        </div>
      )}
      {spec.columns.map((col, c) =>
        col.label ? (
          <div key={c} style={{ position: "absolute", left: X0 + c * (colW + gap), top: TOP + (inGroup(c) ? 46 : 6), width: colW, textAlign: "center", fontFamily: FF.mono, fontSize: 15, color: INK_SOFT }}>
            {col.label}
          </div>
        ) : null,
      )}

      <svg width={DW} height={DH} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={INK} />
          </marker>
        </defs>
        {spec.edges.map((e, i) => {
          const a = rects[e.from];
          const b = rects[e.to];
          if (!a || !b) return null;
          let d: string;
          const ry = lanes[i] ?? null;
          if (ry !== null) {
            const fwd = b.col > a.col;
            const x1 = fwd ? a.x + a.w : a.x;
            const x2 = fwd ? b.x - 4 : b.x + b.w + 4;
            const y1 = a.y + a.h / 2;
            const y2 = b.y + b.h / 2;
            const s1 = fwd ? 1 : -1;
            d = `M${x1} ${y1} C ${x1 + 40 * s1} ${y1}, ${x1 + 40 * s1} ${ry}, ${x1 + 80 * s1} ${ry} L ${x2 - 80 * s1} ${ry} C ${x2 - 40 * s1} ${ry}, ${x2 - 40 * s1} ${y2}, ${x2} ${y2}`;
          } else if (b.col > a.col) {
            const y1 = a.y + a.h / 2;
            const y2 = b.y + b.h / 2;
            const x1 = a.x + a.w;
            const x2 = b.x - 4;
            const mx = (x1 + x2) / 2;
            d = `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
          } else if (b.col < a.col) {
            const y1 = a.y + a.h / 2;
            const y2 = b.y + b.h / 2;
            const x1 = a.x;
            const x2 = b.x + b.w + 4;
            const mx = (x1 + x2) / 2;
            d = `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
          } else {
            const down = b.y > a.y;
            const x = a.x + a.w / 2;
            d = down ? `M${x} ${a.y + a.h} L${x} ${b.y - 4}` : `M${x} ${a.y} L${x} ${b.y + b.h + 4}`;
          }
          return <path key={i} d={d} fill="none" stroke={e.dashed ? accent : INK} strokeWidth={2.2} strokeDasharray={e.dashed ? "7 6" : undefined} markerEnd="url(#ar)" />;
        })}
      </svg>
      {Object.entries(rects).map(([id, r]) => {
        const b = spec.columns[r.col].boxes.find((x) => x.id === id)!;
        const tone = b.tone ?? "plain";
        const dark = tone === "dark";
        const ghost = tone === "ghost";
        return (
          <div
            key={id}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: r.w,
              minHeight: r.h,
              boxSizing: "border-box",
              padding: "18px 20px",
              borderRadius: 18,
              background: dark ? "#14141b" : ghost ? "transparent" : "#fff",
              border: ghost ? `1.5px dashed ${rgba("#101014", 0.3)}` : tone === "accent" ? `1.5px solid ${accent}` : `1px solid rgba(16,16,20,0.1)`,
              boxShadow: ghost ? "none" : "0 10px 30px rgba(16,16,20,0.07)",
              color: dark ? "#fff" : INK,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: 11, background: dark ? "rgba(255,255,255,0.1)" : rgba(ghost ? "#101014" : accent, 0.12), flexShrink: 0 }}>
                <Icon name={b.icon} size={20} color={dark ? "#fff" : ghost ? INK_SOFT : accent} />
              </span>
              <div style={{ fontFamily: FF.head, fontWeight: 700, fontSize: 20, lineHeight: 1.15 }}>{b.title}</div>
            </div>
            {b.sub && <div style={{ marginTop: 8, fontSize: 15, lineHeight: 1.4, color: dark ? "rgba(255,255,255,0.65)" : INK_SOFT }}>{b.sub}</div>}
            {b.lines && (
              <div style={{ marginTop: 12, fontFamily: FF.mono, fontSize: 14, lineHeight: 1.75, color: dark ? "rgba(255,255,255,0.85)" : INK }}>
                {b.lines.map((l, i) => (
                  <div key={i}>· {l}</div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {spec.edges.map((e, i) => {
        const a = rects[e.from];
        const b = rects[e.to];
        if (!a || !b || !e.label) return null;
        const same = a.col === b.col;
        const ry = lanes[i] ?? null;
        if (ry !== null) {
          const mx = ((b.col > a.col ? a.x + a.w : a.x) + (b.col > a.col ? b.x : b.x + b.w)) / 2;
          return (
            <div key={i} style={{ position: "absolute", left: mx, top: ry - 24, translate: "-50% 0", padding: "3px 8px", borderRadius: 6, background: "#fbfbfa", fontFamily: FF.mono, fontSize: 13.5, color: e.dashed ? accent : INK_SOFT, whiteSpace: "nowrap" }}>
              {e.label}
            </div>
          );
        }
        const x = same ? a.x + a.w / 2 + 12 : ((b.col > a.col ? a.x + a.w : a.x) + (b.col > a.col ? b.x : b.x + b.w)) / 2;
        const y = same ? (Math.min(a.y + a.h, b.y + b.h) + Math.max(a.y, b.y)) / 2 - 10 : (a.y + a.h / 2 + b.y + b.h / 2) / 2 - 30;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, translate: same ? "0 0" : "-50% 0", padding: "3px 8px", borderRadius: 6, background: "#fbfbfa", fontFamily: FF.mono, fontSize: 13.5, lineHeight: 1.3, color: e.dashed ? accent : INK_SOFT, textAlign: "center", maxWidth: same ? 220 : gap + 40 }}>
            {e.label}
          </div>
        );
      })}

      {spec.footer && (
        <div style={{ position: "absolute", left: X0, top: 806, width: X1 - X0, display: "flex", gap: 14 }}>
          {spec.footer.map((f, i) => (
            <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderRadius: 16, background: "#14141b", color: "#fff", fontSize: 16.5, fontWeight: 600 }}>
              <Icon name={f.icon} size={20} color={rgba(accent, 1)} />
              {f.text}
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};
