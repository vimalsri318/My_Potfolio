import React from "react";
import { AbsoluteFill, Audio, Freeze, Sequence, staticFile, useCurrentFrame } from "remotion";
import { A, SceneFade } from "./brand";

const A_NIGHT = A.night; // the final fade lands on dark, like the opening
import { CHAT_FRAMES, ChatScene } from "./ChatScene";
import { ArchitectureScene, BlogScene, HookScene, OUTRO_FRAMES, OutroScene, SheetsScene, TourScene } from "./scenes";
import vo from "./voiceover.json";

// Amretri Healthcare product film — AMRI, the in-browser chatbot, and the
// Google Sheets + Apps Script backend, narrated.
//
// Each scene is cut into visual beats (`v` = the scene's own frame where the
// beat starts). A beat with a `line` starts when that narration line does; a
// beat with `afterEnd` starts relative to the end of the previous line. The
// visuals play at 1× inside a beat and hold on its last frame until the next
// beat is due, so the picture always waits for the voice — re-run
// scripts/amretri_vo.py with new lines or another voice and timing follows.

type Beat = { v: number; line?: keyof typeof vo.lines; delay?: number; afterEnd?: number };
type SceneDef = { name: string; C: React.FC; vis: number; beats: Beat[]; tail: number };

const XF = 15; // cross-dissolve between scenes
const GAP = 8; // minimum breath between lines

const SCENES: SceneDef[] = [
  { name: "Hook", C: HookScene, vis: 150, tail: 18, beats: [{ v: 0, line: "hook1", delay: 6 }, { v: 56, afterEnd: -16 }, { v: 86, line: "hook2" }] },
  {
    name: "Website tour",
    C: TourScene,
    vis: 420,
    tail: 20,
    beats: [{ v: 0, line: "tour1", delay: 10 }, { v: 74, afterEnd: -6 }, { v: 118, line: "tour2", delay: 40 }, { v: 352, line: "tour3", delay: 14 }],
  },
  {
    name: "Chatbot demo",
    C: ChatScene,
    vis: CHAT_FRAMES,
    tail: 40,
    beats: [{ v: 0, line: "chat1", delay: 10 }, { v: 150, line: "chat2", delay: 12 }, { v: 280, line: "chat3", delay: 8 }, { v: 556, line: "chat4", delay: 30 }],
  },
  {
    name: "Architecture",
    C: ArchitectureScene,
    vis: 390,
    tail: 30,
    beats: [{ v: 0, line: "arch1", delay: 8 }, { v: 40, line: "arch2", delay: 4 }, { v: 140, line: "arch3", delay: 8 }, { v: 276, line: "arch4", delay: 6 }],
  },
  {
    name: "Sheets backend",
    C: SheetsScene,
    vis: 420,
    tail: 30,
    beats: [{ v: 0, line: "sheets1", delay: 8 }, { v: 60, line: "sheets2", delay: 4 }, { v: 116, line: "sheets3", delay: 4 }, { v: 258, line: "sheets4", delay: 6 }],
  },
  { name: "Blog", C: BlogScene, vis: 330, tail: 40, beats: [{ v: 0, line: "blog1", delay: 8 }, { v: 76, line: "blog2", delay: 4 }, { v: 206, line: "blog3", delay: 6 }] },
  { name: "Outro", C: OutroScene, vis: OUTRO_FRAMES, tail: 90, beats: [{ v: 0, line: "outro1", delay: 8 }, { v: 30, line: "outro2", delay: 6 }, { v: 148, line: "outro3", delay: 30 }] },
];

const layout = (def: SceneDef) => {
  const ats: number[] = [];
  const lines: { id: string; start: number }[] = [];
  let lineEnd = -Infinity;
  def.beats.forEach((b, i) => {
    // A beat can't start before the previous beat's visuals have played out.
    let at = i === 0 ? 0 : ats[i - 1] + (b.v - def.beats[i - 1].v);
    if (b.line) at = Math.max(at, lineEnd + GAP - (b.delay ?? 0));
    if (b.afterEnd !== undefined) at = Math.max(at, lineEnd + b.afterEnd);
    ats.push(at);
    if (b.line) {
      const start = at + (b.delay ?? 0);
      lines.push({ id: b.line, start });
      lineEnd = start + vo.lines[b.line];
    }
  });
  const last = def.beats.length - 1;
  const dur = Math.max(ats[last] + (def.vis - def.beats[last].v), lineEnd + def.tail);
  return { ats, lines, dur };
};

const PLAN = SCENES.map((s) => ({ ...s, ...layout(s) }));
const STARTS = PLAN.reduce<number[]>((acc, s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + PLAN[i - 1].dur - XF], []);
export const AMRETRI_FRAMES = STARTS[STARTS.length - 1] + PLAN[PLAN.length - 1].dur;

// Map real scene time onto the scene's own timeline: play each beat at 1×,
// hold on the frame where the next beat begins until that beat is due.
const Timed: React.FC<{ beats: Beat[]; ats: number[]; children: React.ReactNode }> = ({ beats, ats, children }) => {
  const f = useCurrentFrame();
  let i = 0;
  for (let k = 0; k < ats.length; k++) if (ats[k] <= f) i = k;
  const cap = i + 1 < beats.length ? beats[i + 1].v : Infinity;
  return <Freeze frame={Math.min(beats[i].v + (f - ats[i]), cap)}>{children}</Freeze>;
};

export const AmretriPromo: React.FC = () => (
  <AbsoluteFill style={{ background: A_NIGHT }}>
    {PLAN.map((s, i) => (
      <Sequence key={s.name} name={s.name} from={STARTS[i]} durationInFrames={s.dur}>
        <SceneFade dur={s.dur} fade={i === 0 ? 1 : XF} fadeOut={i === PLAN.length - 1 ? 36 : XF}>
          <Timed beats={s.beats} ats={s.ats}>
            <s.C />
          </Timed>
        </SceneFade>
        {s.lines.map((l) => (
          <Sequence key={l.id} name={`VO ${l.id}`} from={l.start} durationInFrames={vo.lines[l.id as keyof typeof vo.lines] + 6}>
            <Audio src={staticFile(`amretri/vo/${l.id}.mp3`)} />
          </Sequence>
        ))}
      </Sequence>
    ))}
  </AbsoluteFill>
);
