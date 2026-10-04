import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Sequence, staticFile } from "remotion";
import { NIGHT, SceneFade } from "./kit";
import { SCENES } from "./scenes";
import type { FilmScript, Scene, Timing } from "./types";

// A narrated product film driven entirely by public/films/<slug>/script.json
// and the measured voice in timing.json. Scenes are laid end to end with a
// short cross-dissolve; each scene lasts as long as its lines need (or its
// visual minimum), and its visuals key off the frame each line starts.

const FPS = 30;
const XF = 15;
const LEAD = 10;
const GAP = 9;
const MIN: Record<Scene["kind"], number> = { hook: 120, intro: 140, feature: 165, flow: 240, outro: 300 };
const TAIL: Record<Scene["kind"], number> = { hook: 22, intro: 26, feature: 26, flow: 30, outro: 100 };

export type PlannedScene = { start: number; dur: number; beats: number[]; lines: { id: string; start: number; dur: number; voiced: boolean }[] };
export type FilmPlan = { total: number; scenes: PlannedScene[] };
export type FilmProps = { slug: string; script?: FilmScript; plan?: FilmPlan };

// Before the voice exists, estimate ~14 characters a second.
const estimate = (text: string) => Math.round((text.length / 14) * FPS);

export const planFilm = (script: FilmScript, timing: Timing["lines"]): FilmPlan => {
  const scenes: PlannedScene[] = [];
  let start = 0;
  for (const scene of script.scenes) {
    const beats: number[] = [];
    const lines: PlannedScene["lines"] = [];
    let t = LEAD;
    scene.vo.forEach((l, i) => {
      // The outro's last line is the call to action — give the recap room first.
      if (scene.kind === "outro" && i === scene.vo.length - 1 && i > 0) t = Math.max(t, 120);
      const d = timing[l.id] ?? estimate(l.text);
      beats.push(t);
      lines.push({ id: l.id, start: t, dur: d, voiced: l.id in timing });
      t += d + GAP + Math.round((l.pause ?? 0) * FPS);
    });
    const dur = Math.max(MIN[scene.kind], t - GAP + TAIL[scene.kind]);
    scenes.push({ start, dur, beats, lines });
    start += dur - XF;
  }
  const last = scenes[scenes.length - 1];
  return { total: last.start + last.dur, scenes };
};

export const calcFilm: CalculateMetadataFunction<FilmProps> = async ({ props }) => {
  const script: FilmScript = await fetch(staticFile(`films/${props.slug}/script.json`)).then((r) => r.json());
  const timing: Timing = await fetch(staticFile(`films/${props.slug}/timing.json`))
    .then((r) => (r.ok ? r.json() : { lines: {} }))
    .catch(() => ({ lines: {} }));
  const plan = planFilm(script, timing.lines || {});
  return { durationInFrames: plan.total, props: { ...props, script, plan } };
};

export const Film: React.FC<FilmProps> = ({ slug, script, plan }) => {
  if (!script || !plan) return null;
  const n = script.scenes.length;
  return (
    <AbsoluteFill style={{ background: NIGHT }}>
      {script.scenes.map((scene, i) => {
        const p = plan.scenes[i];
        const C = SCENES[scene.kind] as React.FC<{ scene: Scene; script: FilmScript; beats: number[]; dur: number }>;
        return (
          <Sequence key={i} name={`${i + 1} ${scene.kind}`} from={p.start} durationInFrames={p.dur}>
            <SceneFade dur={p.dur} fadeIn={i === 0 ? 0 : XF} fadeOut={i === n - 1 ? 36 : XF}>
              <C scene={scene} script={script} beats={p.beats} dur={p.dur} />
            </SceneFade>
            {p.lines.filter((l) => l.voiced).map((l) => (
              <Sequence key={l.id} name={`VO ${l.id}`} from={l.start} durationInFrames={l.dur + 6}>
                <Audio src={staticFile(`films/${slug}/vo/${l.id}.mp3`)} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
