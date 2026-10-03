import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { PROJECTS, ReelProject, STAGE_H, STAGE_W } from "./projects";
import { alpha, C, ease, F, lerp } from "./theme";

export const INTRO = 75;
export const SEG = 84; // how long each project holds the screen
export const OVERLAP = 16; // next segment slides up over the previous one
export const OUTRO = 120;
export const showreelFrames = INTRO + PROJECTS.length * SEG + OUTRO;

const Paper: React.FC<{ tint?: string }> = ({ tint }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    {tint && <AbsoluteFill style={{ background: alpha(tint, 0.08) }} />}
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
      }}
    />
  </AbsoluteFill>
);

const Intro: React.FC<{ vertical: boolean }> = ({ vertical }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const name = "VIMAL SRINIVASAN — ";
  const line = ease(frame, 18, 42);
  const sub = ease(frame, 30, 54);
  return (
    <AbsoluteFill>
      <Paper />
      <AbsoluteFill style={{ justifyContent: "center", overflow: "hidden" }}>
        <div
          style={{
            whiteSpace: "nowrap",
            fontFamily: F.display,
            fontSize: vertical ? 300 : 340,
            lineHeight: 1,
            color: C.ink,
            translate: `${lerp(frame / 90, 0, -width * 0.55)}px ${vertical ? -380 : -40}px`,
          }}
        >
          {name.repeat(3)}
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: vertical ? "0 80px 260px" : "0 120px 110px",
          gap: 18,
        }}
      >
        <div style={{ opacity: line, translate: `0px ${lerp(line, 30, 0)}px`, fontFamily: F.body, fontWeight: 800, fontSize: vertical ? 80 : 84, lineHeight: 1.02, color: C.ink, letterSpacing: -2 }}>
          {PROJECTS.length} products, shipped.
          <br />
          <span style={{ color: C.brand }}>Yours could be next.</span>
        </div>
        <div style={{ opacity: sub, fontFamily: F.mono, fontSize: vertical ? 34 : 30, letterSpacing: 2, color: C.inkSoft }}>
          AI · PLATFORMS · COMMERCE · APPS
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Segment: React.FC<{ p: ReelProject; index: number; vertical: boolean }> = ({ p, index, vertical }) => {
  const frame = useCurrentFrame();
  const enter = ease(frame, 0, OVERLAP);
  const title = ease(frame, 8, 30);
  const tag = ease(frame, 16, 38);
  const stageScale = vertical ? 0.74 : 0.78;
  const Stage = p.Stage;
  const text = (
    <div style={{ display: "flex", flexDirection: "column", gap: vertical ? 22 : 26, width: vertical ? 920 : 600, flexShrink: 0 }}>
      <div style={{ opacity: title, fontFamily: F.mono, fontSize: vertical ? 30 : 26, letterSpacing: 2, color: p.accent, fontWeight: 700 }}>
        {p.kind.toUpperCase()} · {p.status.toUpperCase()}
      </div>
      <div
        style={{
          opacity: title,
          translate: `0px ${lerp(title, 40, 0)}px`,
          fontFamily: F.display,
          fontSize: p.title.length > 16 ? (vertical ? 104 : 96) : vertical ? 140 : 128,
          lineHeight: 0.98,
          color: C.ink,
        }}
      >
        {p.title}
      </div>
      <div style={{ opacity: tag, translate: `0px ${lerp(tag, 24, 0)}px`, fontFamily: F.body, fontWeight: 600, fontSize: vertical ? 50 : 44, lineHeight: 1.2, color: C.inkSoft }}>
        {p.tagline}
      </div>
    </div>
  );
  const stage = (
    <div
      style={{
        width: STAGE_W * stageScale,
        height: STAGE_H * stageScale,
        borderRadius: 28,
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: "0 30px 80px rgba(12,12,12,0.14)",
      }}
    >
      <div style={{ width: STAGE_W, height: STAGE_H, scale: String(stageScale), transformOrigin: "0 0" }}>
        {/* start the stage mid-way so the motion is already underway */}
        <Sequence from={-24} layout="none">
          <Stage />
        </Sequence>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ translate: `0px ${lerp(enter, 100, 0)}%` }}>
      <Paper tint={p.accent} />
      <AbsoluteFill
        style={{
          flexDirection: vertical ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: vertical ? 64 : 64,
          padding: vertical ? "0 80px" : "0 90px",
        }}
      >
        {vertical ? (
          <>
            {stage}
            {text}
          </>
        ) : (
          <>
            {text}
            {stage}
          </>
        )}
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: vertical ? 80 : 100,
          bottom: vertical ? 120 : 64,
          fontFamily: F.mono,
          fontSize: 24,
          letterSpacing: 2,
          color: C.inkSoft,
        }}
      >
        {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC<{ vertical: boolean }> = ({ vertical }) => {
  const frame = useCurrentFrame();
  const enter = ease(frame, 0, OVERLAP);
  const a = ease(frame, 10, 34);
  const b = ease(frame, 26, 50);
  const u = ease(frame, 40, 70);
  return (
    <AbsoluteFill style={{ background: C.ink, translate: `0px ${lerp(enter, 100, 0)}%`, justifyContent: "center", padding: vertical ? "0 80px" : "0 140px", gap: 40 }}>
      <div style={{ opacity: a, translate: `0px ${lerp(a, 40, 0)}px`, fontFamily: F.display, fontSize: vertical ? 150 : 170, lineHeight: 0.95, color: C.paper }}>
        Got something
        <br />
        to build?
      </div>
      <div style={{ opacity: b, fontFamily: F.body, fontWeight: 600, fontSize: vertical ? 50 : 52, color: "rgba(241,241,238,0.75)" }}>
        AI products · SaaS platforms · stores · apps
      </div>
      <div style={{ opacity: b, alignSelf: "flex-start", fontFamily: F.mono, fontSize: vertical ? 40 : 44, color: C.paper, paddingBottom: 12, backgroundImage: `linear-gradient(${C.brand}, ${C.brand})`, backgroundSize: `${u * 100}% 6px`, backgroundPosition: "0 100%", backgroundRepeat: "no-repeat" }}>
        vimalsrinivasan.vercel.app ↗
      </div>
    </AbsoluteFill>
  );
};

export const Showreel: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Sequence name="Intro" durationInFrames={INTRO + OVERLAP}>
      <Intro vertical={vertical} />
    </Sequence>
    {PROJECTS.map((p, i) => (
      <Sequence key={p.slug} name={p.title} from={INTRO + i * SEG} durationInFrames={SEG + OVERLAP}>
        <Segment p={p} index={i} vertical={vertical} />
      </Sequence>
    ))}
    <Sequence name="Outro" from={INTRO + PROJECTS.length * SEG}>
      <Outro vertical={vertical} />
    </Sequence>
  </AbsoluteFill>
);
