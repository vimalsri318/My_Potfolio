import React from "react";
import { Composition, Folder, Still } from "remotion";
import { CLIP_FRAMES, PROJECTS, STAGE_H, STAGE_W } from "./projects";
import { Showreel, showreelFrames } from "./Showreel";
import { AmretriPromo, AMRETRI_FRAMES } from "./amretri/AmretriPromo";
import { ArchitectureDiagram } from "./amretri/ArchitectureDiagram";
import { calcFilm, Film } from "./films/Film";
import { calcDiagram, Diagram, DH, DW } from "./films/Diagram";
import { FILM_SLUGS } from "./films/list";

const Clip: React.FC<{ slug: string }> = ({ slug }) => {
  const p = PROJECTS.find((x) => x.slug === slug)!;
  return <p.Stage />;
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Showreel" component={Showreel} durationInFrames={showreelFrames} fps={30} width={1920} height={1080} defaultProps={{ vertical: false }} />
    <Composition id="ShowreelVertical" component={Showreel} durationInFrames={showreelFrames} fps={30} width={1080} height={1920} defaultProps={{ vertical: true }} />
    <Still id="AmretriArchitecture" component={ArchitectureDiagram} width={1600} height={900} />
    <Composition id="AmretriPromo" component={AmretriPromo} durationInFrames={AMRETRI_FRAMES} fps={30} width={1920} height={1080} />
    <Folder name="Films">
      {FILM_SLUGS.map((slug) => (
        <Composition key={slug} id={`Film-${slug}`} component={Film} calculateMetadata={calcFilm} durationInFrames={300} fps={30} width={1920} height={1080} defaultProps={{ slug }} />
      ))}
    </Folder>
    <Folder name="Diagrams">
      {FILM_SLUGS.map((slug) => (
        <Composition key={slug} id={`Diagram-${slug}`} component={Diagram} calculateMetadata={calcDiagram} durationInFrames={1} fps={30} width={DW} height={DH} defaultProps={{ slug }} />
      ))}
    </Folder>
    <Folder name="Clips">
      {PROJECTS.map((p) => (
        <Composition key={p.slug} id={`Clip-${p.slug}`} component={Clip} durationInFrames={CLIP_FRAMES} fps={30} width={STAGE_W} height={STAGE_H} defaultProps={{ slug: p.slug }} />
      ))}
    </Folder>
  </>
);
