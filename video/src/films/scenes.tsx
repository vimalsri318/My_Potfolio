import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../theme";
import { MediaView } from "./media";
import { PROJECTS } from "../projects";

const hasStage = (slug: string) => PROJECTS.some((p) => p.slug === slug);
import type { FilmScript, Media, Scene } from "./types";
import { BrowserChrome, clamp, DarkBg, fadeUp, FF, Icon, INK, INK_SOFT, Kicker, lerp, LightBg, lift, NIGHT, rgba, Rise } from "./kit";

export type SceneProps<S extends Scene = Scene> = { scene: S; script: FilmScript; beats: number[]; dur: number };

const W = 1920;

/* ── Hook: the problem, in big type ── */
export const HookScene: React.FC<SceneProps<Extract<Scene, { kind: "hook" }>>> = ({ scene, script, beats, dur }) => {
  const frame = useCurrentFrame();
  const a = script.accent;
  const punchAt = beats[1] ?? Math.round(dur * 0.5);
  const strikeAt = punchAt - 22;
  const hasStrike = !!scene.strike?.length;
  return (
    <AbsoluteFill>
      <DarkBg accent={a} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 160px", gap: hasStrike ? 64 : 56 }}>
        <Rise text={scene.headline} at={6} size={74} color="#fff" accent={lift(a)} align="center" style={{ maxWidth: 1500 }} />
        {hasStrike && (
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
            {scene.strike!.map((s, i) => {
              const st = ease(frame, strikeAt + i * 5, strikeAt + 14 + i * 5);
              return (
                <div
                  key={s}
                  style={{
                    position: "relative",
                    padding: "18px 30px",
                    borderRadius: 18,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    fontFamily: FF.body,
                    fontSize: 28,
                    fontWeight: 600,
                    color: "#fff",
                    ...fadeUp(frame, 20 + i * 7),
                    opacity: ease(frame, 20 + i * 7, 40 + i * 7) * lerp(st, 1, 0.4),
                  }}
                >
                  {s}
                  <span style={{ position: "absolute", left: 18, right: 18, top: "50%", height: 4, borderRadius: 4, background: a, transformOrigin: "left", scale: `${st} 1` }} />
                </div>
              );
            })}
          </div>
        )}
        {scene.punch && <Rise text={scene.punch} at={punchAt} size={80} color="#fff" accent={lift(a)} align="center" style={{ maxWidth: 1500 }} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ── Intro: name, promise, the product ── */
export const IntroScene: React.FC<SceneProps<Extract<Scene, { kind: "intro" }>>> = ({ scene, script, dur }) => {
  const frame = useCurrentFrame();
  const a = script.accent;
  const m = ease(frame, 24, 60);
  return (
    <AbsoluteFill>
      <LightBg accent={a} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: scene.media ? 70 : 330 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, ...fadeUp(frame, 0, 14) }}>
          {scene.logo && <Img src={staticFile(scene.logo)} style={{ height: 64, borderRadius: 14 }} />}
          {scene.badge && (
            <span style={{ padding: "8px 16px", borderRadius: 999, background: rgba(a, 0.12), color: a, fontFamily: FF.mono, fontSize: 18, fontWeight: 700 }}>{scene.badge}</span>
          )}
        </div>
        <Rise text={scene.title} at={4} size={92} accent={a} align="center" style={{ marginTop: 18 }} />
        <div style={{ marginTop: 14, maxWidth: 1300, textAlign: "center", fontFamily: FF.body, fontSize: 32, lineHeight: 1.35, color: INK_SOFT, ...fadeUp(frame, 16) }}>{scene.tagline}</div>
      </AbsoluteFill>
      {scene.media && (
        <div style={{ position: "absolute", left: (W - 1480) / 2, top: 370, opacity: m, translate: `0px ${lerp(m, 140, 0)}px` }}>
          <Sequence from={24} layout="none">
            <MediaView media={scene.media} w={1480} h={690} accent={a} dur={dur - 24} />
          </Sequence>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ── Feature: headline + bullets beside the product ── */
export const FeatureScene: React.FC<SceneProps<Extract<Scene, { kind: "feature" }>>> = ({ scene, script, beats, dur }) => {
  const frame = useCurrentFrame();
  const a = script.accent;
  const media: Media[] = Array.isArray(scene.media) ? scene.media : [scene.media];
  const bullets = scene.bullets ?? [];
  const bulletAt = (i: number) =>
    bullets.length <= beats.length && beats.length > 1 ? beats[i] + 8 : (beats[0] ?? 10) + 26 + i * Math.max(14, (dur - 90) / Math.max(1, bullets.length));
  const mediaAt = (k: number) => (k === 0 ? 8 : beats[k] ?? Math.round((dur * k) / media.length));
  const textX = scene.flip ? 1180 : 110;
  const mediaX = scene.flip ? 70 : 760;
  const mw = 1080;
  const mh = 820;
  return (
    <AbsoluteFill>
      <LightBg accent={a} />
      <div style={{ position: "absolute", left: textX, top: 170, width: 620 }}>
        <Kicker color={a} at={2}>{scene.kicker}</Kicker>
        <Rise text={scene.headline} at={6} size={58} accent={a} style={{ marginTop: 18 }} />
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 20 }}>
          {bullets.map((b, i) => {
            const at = bulletAt(i);
            return (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", ...fadeUp(frame, at, 18, 16) }}>
                <span style={{ flexShrink: 0, marginTop: 4, display: "grid", placeItems: "center", width: 32, height: 32, borderRadius: 99, background: a }}>
                  <Icon name="check" size={18} color="#fff" stroke={3} />
                </span>
                <span style={{ fontFamily: FF.body, fontSize: 27, lineHeight: 1.4, color: INK }}>{b}</span>
              </div>
            );
          })}
        </div>
      </div>
      {media.map((md, k) => {
        const at = mediaAt(k);
        const next = k + 1 < media.length ? mediaAt(k + 1) : Infinity;
        const pin = ease(frame, at, at + 22);
        const pout = next === Infinity ? 0 : ease(frame, next, next + 16);
        if (frame < at - 1 || pout >= 1) return null;
        return (
          <div key={k} style={{ position: "absolute", left: mediaX, top: 130, opacity: pin * (1 - pout), translate: `${lerp(pin, scene.flip ? -60 : 60, 0)}px 0px`, scale: String(lerp(pout, 1, 0.97)) }}>
            <Sequence from={at} layout="none">
              <MediaView media={md} w={mw} h={mh} accent={a} dur={(next === Infinity ? dur : next) - at} />
            </Sequence>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ── Flow: how it works, as a pipeline ── */
export const FlowScene: React.FC<SceneProps<Extract<Scene, { kind: "flow" }>>> = ({ scene, script, beats, dur }) => {
  const frame = useCurrentFrame();
  const a = script.accent;
  const n = scene.nodes.length;
  const gap = 56;
  const nw = Math.min(360, (1680 - gap * (n - 1)) / n);
  const total = nw * n + gap * (n - 1);
  const x0 = (W - total) / 2;
  const ny = 400;
  const nh = 230;
  const runFrom = beats[1] ?? 70;
  const statsAt = beats[beats.length - 1] ?? dur - 90;
  const runTo = Math.max(runFrom + 30, Math.min(statsAt - 10, runFrom + n * 32));
  const px = interpolate(frame, [runFrom, runTo], [0, n - 1], clamp);
  const at = frame >= runFrom - 4 ? Math.round(px) : -1;
  return (
    <AbsoluteFill>
      <DarkBg accent={a} />
      <div style={{ position: "absolute", left: 120, top: 100 }}>
        <Kicker color={lift(a)} at={2}>{scene.kicker}</Kicker>
        <Rise text={scene.headline} at={6} size={60} color="#fff" accent={lift(a)} style={{ marginTop: 16, maxWidth: 1600 }} />
      </div>
      <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
        {scene.nodes.slice(0, -1).map((_, i) => {
          const x1 = x0 + i * (nw + gap) + nw + 8;
          const x2 = x1 + gap - 16;
          const p = ease(frame, 40 + i * 10, 60 + i * 10);
          const y = ny + nh / 2;
          return (
            <g key={i} opacity={p}>
              <line x1={x1} y1={y} x2={lerp(p, x1, x2)} y2={y} stroke="rgba(255,255,255,0.4)" strokeWidth={3} strokeDasharray="7 7" />
              <path d={`M${x2 - 10} ${y - 8} L${x2} ${y} L${x2 - 10} ${y + 8}`} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={3} strokeLinecap="round" />
            </g>
          );
        })}
      </svg>
      {scene.nodes.map((nd, i) => {
        const p = ease(frame, 18 + i * 9, 42 + i * 9);
        const hot = at === i;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x0 + i * (nw + gap),
              top: ny,
              width: nw,
              height: nh,
              boxSizing: "border-box",
              padding: 24,
              borderRadius: 24,
              background: hot ? `linear-gradient(160deg, ${rgba(a, 0.35)}, ${rgba(a, 0.12)})` : "rgba(255,255,255,0.06)",
              border: `1.5px solid ${hot ? lift(a, 0.2) : "rgba(255,255,255,0.12)"}`,
              boxShadow: hot ? `0 0 60px ${rgba(a, 0.35)}` : "none",
              opacity: p,
              translate: `0px ${lerp(p, 26, 0)}px`,
            }}
          >
            <span style={{ display: "grid", placeItems: "center", width: 52, height: 52, borderRadius: 14, background: hot ? a : rgba(a, 0.22) }}>
              <Icon name={nd.icon} size={28} color="#fff" />
            </span>
            <div style={{ marginTop: 18, fontFamily: FF.head, fontSize: 29, fontWeight: 700, color: "#fff", lineHeight: 1.15 }}>{nd.title}</div>
            <div style={{ marginTop: 8, fontFamily: FF.body, fontSize: 19, lineHeight: 1.38, color: "rgba(255,255,255,0.66)" }}>{nd.sub}</div>
          </div>
        );
      })}
      {scene.packet && (
        <div
          style={{
            position: "absolute",
            left: x0 + px * (nw + gap) + nw / 2,
            top: ny - 66,
            translate: "-50% 0",
            opacity: interpolate(frame, [runFrom - 8, runFrom, runTo + 20, runTo + 34], [0, 1, 1, 0], clamp),
          }}
        >
          <span style={{ display: "inline-flex", padding: "10px 18px", borderRadius: 999, background: a, color: "#fff", fontFamily: FF.body, fontWeight: 700, fontSize: 20, whiteSpace: "nowrap", boxShadow: `0 10px 30px ${rgba(a, 0.5)}` }}>{scene.packet}</span>
        </div>
      )}
      {scene.stats && (
        <div style={{ position: "absolute", left: 120, top: 820, width: 1680, display: "flex", gap: 24 }}>
          {scene.stats.map((s, i) => (
            <div key={i} style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 18, padding: "22px 28px", borderRadius: 22, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", ...fadeUp(frame, statsAt + i * 10) }}>
              <span style={{ fontFamily: FF.head, fontWeight: 800, fontSize: 60, color: lift(a, 0.25), lineHeight: 1 }}>{s.big}</span>
              <span style={{ fontFamily: FF.body, fontSize: 24, color: "rgba(255,255,255,0.8)" }}>{s.small}</span>
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ── Outro: the stack, then the case study ── */
export const OutroScene: React.FC<SceneProps<Extract<Scene, { kind: "outro" }>>> = ({ scene, script, beats, dur }) => {
  const frame = useCurrentFrame();
  const a = script.accent;
  const ctaAt = beats[beats.length - 1] ?? dur - 150;
  const out = ease(frame, ctaAt - 6, ctaAt + 22);
  const page = ease(frame, ctaAt + 4, ctaAt + 44);
  const cta = ease(frame, ctaAt + 14, ctaAt + 36);
  const url = script.caseUrl ?? `vimalsrinivasan.vercel.app/projects/${script.slug}`;
  // No outro shot and no stage: reuse the intro's image so the hand-off isn't empty.
  const introMedia = (script.scenes.find((x) => x.kind === "intro") as Extract<Scene, { kind: "intro" }> | undefined)?.media;
  const shot = scene.shot ?? (!hasStage(script.slug) && introMedia?.type === "image" ? introMedia.src : undefined);
  const bw = 1180;
  const sw = Math.round((bw * 0.625 - 42) * 1.6);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(135deg, ${NIGHT} 0%, ${rgba(a, 0.55)} 140%)`, backgroundColor: NIGHT }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 240, opacity: 1 - out, translate: `0px ${-out * 80}px` }}>
        <Rise text={scene.headline} at={4} size={78} color="#fff" accent={lift(a)} align="center" style={{ maxWidth: 1600 }} />
        <div style={{ display: "flex", gap: 22, marginTop: 84 }}>
          {scene.stack.map((s, i) => (
            <div key={i} style={{ width: 360, padding: "26px 28px", borderRadius: 24, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", ...fadeUp(frame, 28 + i * 9) }}>
              <Icon name={s.icon} size={34} color={lift(a, 0.35)} />
              <div style={{ marginTop: 16, fontFamily: FF.head, fontWeight: 700, fontSize: 29, color: "#fff" }}>{s.title}</div>
              <div style={{ marginTop: 6, fontFamily: FF.body, fontSize: 20, color: "rgba(255,255,255,0.7)" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      {frame >= ctaAt - 6 && (
        <>
          <AbsoluteFill style={{ alignItems: "center", paddingTop: 70, opacity: cta, translate: `0px ${lerp(cta, 24, 0)}px` }}>
            <div style={{ fontFamily: FF.head, fontWeight: 800, fontSize: 64, letterSpacing: "-0.025em", color: "#fff" }}>
              Read the full <span style={{ color: lift(a) }}>case study</span>
            </div>
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", borderRadius: 999, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", fontFamily: FF.mono, fontSize: 24, color: "#fff" }}>
              <Icon name="globe" size={22} color={lift(a)} />
              {url}
            </div>
          </AbsoluteFill>
          {!shot && hasStage(script.slug) && (
            <div style={{ position: "absolute", left: (W - bw) / 2, top: lerp(page, 1080, 300), opacity: page }}>
              <Sequence from={ctaAt} layout="none">
                <MediaView media={{ type: "stage", slug: script.slug }} w={bw} h={bw * 0.625} accent={a} dur={dur - ctaAt} />
              </Sequence>
            </div>
          )}
          {shot && (
            // Same footprint as the stage above, with a 16:10 content area so
            // the whole screen shows: no zoom, nothing past the bottom edge.
            <div style={{ position: "absolute", left: (W - sw) / 2, top: lerp(page, 1080, 300), opacity: page }}>
              <BrowserChrome url={url} width={sw} height={42 + sw / 1.6}>
                <Img src={staticFile(shot)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              </BrowserChrome>
            </div>
          )}
        </>
      )}
    </AbsoluteFill>
  );
};

export const SCENES = { hook: HookScene, intro: IntroScene, feature: FeatureScene, flow: FlowScene, outro: OutroScene } as const;

