import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadLocal } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

// Same tokens as the site (styles/globals.css) so the video, covers and
// pages read as one system.
export const C = {
  paper: "#f1f1ee",
  ink: "#0c0c0c",
  inkSoft: "#55554f",
  line: "rgba(12, 12, 12, 0.12)",
  grid: "rgba(12, 12, 12, 0.055)",
  white: "#ffffff",
  brand: "#7C3AED",
};

const inter = loadInter("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });
loadLocal({ family: "Batangas", url: staticFile("fonts/Batangas.otf"), weight: "700" });

export const F = {
  display: "Batangas, sans-serif",
  body: `${inter.fontFamily}, sans-serif`,
  mono: `${mono.fontFamily}, monospace`,
};

const snap = Easing.bezier(0.16, 1, 0.3, 1);

// 0 → 1 between frames a and b with the site's "snap" ease.
export const ease = (frame: number, a: number, b: number, easing = snap) =>
  interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const lerp = (t: number, from: number, to: number) => from + (to - from) * t;

// Hex "#rrggbb" + alpha → rgba()
export const alpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
