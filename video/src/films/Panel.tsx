import React, { useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, CalculateMetadataFunction, continueRender, delayRender, staticFile } from "remotion";
import { MediaView } from "./media";
import type { FilmScript, Media } from "./types";

// One film media item on its own, full frame — the case-study gallery's view
// of a designed screen (terminal, chat, cards, a project's stage). Real
// screenshots skip this and go into the gallery as they are.

export const PW = 1600;
export const PH = 1000;
const BOX_W = 1440;
const BOX_H = 880;

export type PanelProps = { slug: string; scene: number; item: number; media?: Media; accent?: string };

export const calcPanel: CalculateMetadataFunction<PanelProps> = async ({ props }) => {
  const script: FilmScript = await fetch(staticFile(`films/${props.slug}/script.json`)).then((r) => r.json());
  const scene = script.scenes[props.scene] as { media?: Media | Media[] };
  const list = Array.isArray(scene.media) ? scene.media : scene.media ? [scene.media] : [];
  return { props: { ...props, media: list[props.item], accent: script.accent } };
};

export const Panel: React.FC<PanelProps> = ({ media, accent = "#7C3AED" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("measure panel"));
  const [fit, setFit] = useState({ k: 1, x: 0, y: 0 });

  // Terminals, card lists and chat phones are drawn small inside the media
  // box; measure what was actually drawn and scale it to fill the frame.
  useLayoutEffect(() => {
    const box = ref.current;
    if (!box) return continueRender(handle);
    const b = box.getBoundingClientRect();
    let l = Infinity, t = Infinity, r = -Infinity, btm = -Infinity;
    box.querySelectorAll("*").forEach((el) => {
      const e = el.getBoundingClientRect();
      if (!e.width || !e.height || (e.width >= b.width - 2 && e.height >= b.height - 2)) return;
      l = Math.min(l, e.left); t = Math.min(t, e.top); r = Math.max(r, e.right); btm = Math.max(btm, e.bottom);
    });
    if (r > l && btm > t) {
      const k = Math.min((BOX_W * 0.94) / (r - l), (BOX_H * 0.92) / (btm - t), 2.4);
      const cx = (l + r) / 2 - (b.left + b.width / 2);
      const cy = (t + btm) / 2 - (b.top + b.height / 2);
      setFit({ k, x: -cx * k, y: -cy * k });
    }
    continueRender(handle);
  }, [handle]);

  if (!media) return null;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(80% 90% at 50% 40%, ${accent}14 0%, transparent 70%), #f4f3f0`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div ref={ref} style={{ width: BOX_W, height: BOX_H, transform: `translate(${fit.x}px, ${fit.y}px) scale(${fit.k})` }}>
        {/* dur long enough that every entrance has settled by the still's frame */}
        <MediaView media={media} w={BOX_W} h={BOX_H} accent={accent} dur={240} />
      </div>
    </AbsoluteFill>
  );
};
