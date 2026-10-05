import React from "react";
import { AmretriStage, BuzinessStage, InflunetStage, JaiSathyaStage, MithraStage, TccStage } from "./stages/shots";
import { CasaStage, EmailFinderStage, WassupStage } from "./stages/platforms";
import { ArdorStage, BlackHoleStage, ReframeStage, SlateStage, StreakDoctorStage } from "./stages/apps";

// Mirrors the catalogue entries in data/projects.json (slug, title, accent,
// kind). Order here is the showreel order.
export type ReelProject = {
  slug: string;
  title: string;
  kind: string;
  status: string;
  tagline: string;
  accent: string;
  Stage: React.FC;
};

export const PROJECTS: ReelProject[] = [
  { slug: "influnet", title: "Influnet", kind: "Platforms & SaaS", status: "Live", tagline: "Creator collabs, run like a business.", accent: "#E5197D", Stage: InflunetStage },
  { slug: "buziness-os", title: "Buziness OS", kind: "AI & agents", status: "Live", tagline: "One AI command centre for the whole business.", accent: "#0F766E", Stage: BuzinessStage },
  { slug: "mithra-whole-foods", title: "Mithra Whole Foods", kind: "Commerce & brands", status: "Client build", tagline: "Traditional foods, headless commerce.", accent: "#2E7D32", Stage: MithraStage },
  { slug: "tecstellar-command-center", title: "Tecstellar Command Center", kind: "Platforms & SaaS", status: "Internal tool", tagline: "One console for every app.", accent: "#2B8CC4", Stage: TccStage },
  { slug: "amretri-healthcare", title: "Amretri Healthcare", kind: "Commerce & brands", status: "Live", tagline: "Hospital pharmacy ops, with an AI assistant.", accent: "#0D9488", Stage: AmretriStage },
  { slug: "wassupos", title: "WassupOS", kind: "AI & agents", status: "Client build", tagline: "A CRM that lives inside WhatsApp.", accent: "#2563EB", Stage: WassupStage },
  { slug: "casa-harmony", title: "Casa Harmony", kind: "Platforms & SaaS", status: "Client build", tagline: "Enterprise accounting for HOAs.", accent: "#9F1239", Stage: CasaStage },
  { slug: "jaisathya", title: "JaiSathya Inc.", kind: "Commerce & brands", status: "Live", tagline: "Edit the live site, right on the page.", accent: "#D97706", Stage: JaiSathyaStage },
  { slug: "email-finder", title: "Email Finder", kind: "AI & agents", status: "Internal tool", tagline: "Evidence first. Never a guess.", accent: "#4F46E5", Stage: EmailFinderStage },
  { slug: "reframe", title: "Reframe", kind: "AI & agents", status: "Prototype", tagline: "Read anything, beautifully.", accent: "#B45309", Stage: ReframeStage },
  { slug: "black-hole", title: "Black Hole", kind: "Apps & dev tools", status: "Open source", tagline: "Mac to phone. No server in between.", accent: "#E8590C", Stage: BlackHoleStage },
  { slug: "streak-doctor", title: "Streak Doctor", kind: "Apps & dev tools", status: "Open source", tagline: "Why didn’t that commit count?", accent: "#216E39", Stage: StreakDoctorStage },
  { slug: "slate", title: "Slate", kind: "Apps & dev tools", status: "Prototype", tagline: "Say what you did. It files itself.", accent: "#475569", Stage: SlateStage },
  { slug: "ardor", title: "Ardor", kind: "Apps & dev tools", status: "In development", tagline: "Follows up until it’s done.", accent: "#9333EA", Stage: ArdorStage },
];

export const STAGE_W = 1280;
export const STAGE_H = 800;
export const CLIP_FRAMES = 150;
export const COVER_FRAME = 140;
