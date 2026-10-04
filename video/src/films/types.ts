// Data model for the narrated product films. One JSON per project lives in
// public/films/<slug>/script.json; scripts/film_vo.py turns its `vo` lines into
// audio + public/films/<slug>/timing.json, and Film.tsx lays the scenes out on
// the measured voice.

export type Line = { id: string; text: string; pause?: number };

export type TermLine = { text: string; kind?: "cmd" | "out" | "ok" | "err" | "dim" | "accent" };
export type ChatMsg = { from: "me" | "them"; text: string; tag?: string };
export type CardItem = { icon?: string; title: string; sub?: string; tag?: string };

export type Media =
  | {
      type: "image";
      src: string; // relative to video/public
      frame?: "browser" | "phone" | "plain";
      url?: string;
      scroll?: number; // px of the source (at `srcWidth`) to scroll through
      srcWidth?: number; // CSS width the screenshot was taken at (default 1440)
      fit?: "cover" | "contain";
      bg?: string;
    }
  | { type: "stage"; slug: string }
  | { type: "terminal"; title?: string; lines: TermLine[]; size?: number }
  | { type: "chat"; title?: string; sub?: string; messages: ChatMsg[] }
  | { type: "cards"; title?: string; items: CardItem[] }
  | { type: "phones"; srcs: string[] };

export type Scene =
  | { kind: "hook"; vo: Line[]; headline: string; strike?: string[]; punch?: string }
  | { kind: "intro"; vo: Line[]; title: string; tagline: string; logo?: string; badge?: string; media?: Media }
  | { kind: "feature"; vo: Line[]; kicker: string; headline: string; bullets?: string[]; media: Media | Media[]; flip?: boolean }
  | {
      kind: "flow";
      vo: Line[];
      kicker: string;
      headline: string;
      nodes: { icon: string; title: string; sub: string }[];
      packet?: string;
      stats?: { big: string; small: string }[];
    }
  | { kind: "outro"; vo: Line[]; headline: string; stack: { icon: string; title: string; sub: string }[]; shot?: string };

export type DiagramBox = { id: string; icon: string; title: string; sub?: string; lines?: string[]; tone?: "accent" | "dark" | "ghost" | "plain" };
export type DiagramSpec = {
  kicker: string;
  headline: string; // [bracket] = accent
  columns: { label?: string; boxes: DiagramBox[] }[];
  group?: { label: string; columns: number[] }; // dashed boundary around these columns
  edges: { from: string; to: string; label?: string; dashed?: boolean }[];
  footer?: { icon: string; text: string }[];
};

export type FilmScript = {
  slug: string;
  title: string;
  accent: string;
  light?: boolean; // feature scenes on a light ground (default) vs dark
  caseUrl?: string;
  scenes: Scene[];
  diagram?: DiagramSpec;
};

export type Timing = { lines: Record<string, number> }; // id → frames
