#!/usr/bin/env python3
"""
Narration for the per-project product films (composition Film-<slug>).

Reads the `vo` lines of public/films/<slug>/script.json, synthesises each line
with Kokoro (local, free), loudness-normalises and measures it, and writes

  public/films/<slug>/vo/<id>.mp3
  public/films/<slug>/timing.json   {voice, lines: {id: frames}, hashes: {id: sha1}}

Only lines whose text (or voice) changed are re-synthesised. The Kokoro model
loads once for the whole batch.

Usage:
  python3 scripts/film_vo.py                 # every film with a script.json
  python3 scripts/film_vo.py influnet slate  # just these
  python3 scripts/film_vo.py --voice am_michael --force influnet
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from amretri_vo import FPS, duration, kokoro, normalise  # noqa: E402  (shared Kokoro plumbing)

import subprocess  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
FILMS = ROOT / "public" / "films"


def sha(text: str, voice: str, speed: float) -> str:
    return hashlib.sha1(f"{voice}|{speed}|{text}".encode()).hexdigest()[:12]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("slugs", nargs="*")
    ap.add_argument("--voice", default="af_heart")
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    slugs = args.slugs or sorted(p.parent.name for p in FILMS.glob("*/script.json"))
    jobs: list[tuple[str, str, str]] = []  # (slug, id, text)
    timings: dict[str, dict] = {}
    for slug in slugs:
        script = json.loads((FILMS / slug / "script.json").read_text())
        tpath = FILMS / slug / "timing.json"
        t = json.loads(tpath.read_text()) if tpath.exists() else {"lines": {}, "hashes": {}}
        t.setdefault("hashes", {})
        ids = []
        for scene in script["scenes"]:
            for line in scene["vo"]:
                ids.append(line["id"])
                h = sha(line["text"], args.voice, args.speed)
                mp3 = FILMS / slug / "vo" / f"{line['id']}.mp3"
                if args.force or t["hashes"].get(line["id"]) != h or not mp3.exists():
                    jobs.append((slug, line["id"], line["text"]))
                    t["hashes"][line["id"]] = h
        # Drop lines that no longer exist.
        t["lines"] = {k: v for k, v in t["lines"].items() if k in ids}
        t["hashes"] = {k: v for k, v in t["hashes"].items() if k in ids}
        t["voice"] = args.voice
        timings[slug] = t

    if jobs:
        with tempfile.TemporaryDirectory() as tmp:
            tmpd = Path(tmp)
            kokoro([{"text": text, "voice": args.voice, "speed": args.speed, "out": str(tmpd / f"{slug}__{i}.wav")} for slug, i, text in jobs])
            for slug, i, _ in jobs:
                vo_dir = FILMS / slug / "vo"
                vo_dir.mkdir(parents=True, exist_ok=True)
                wav = tmpd / f"{slug}__{i}.norm.wav"
                normalise(tmpd / f"{slug}__{i}.wav", wav)
                timings[slug]["lines"][i] = int(round(duration(wav) * FPS))
                subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-b:a", "160k", str(vo_dir / f"{i}.mp3")], check=True)

    for slug, t in timings.items():
        (FILMS / slug / "timing.json").write_text(json.dumps(t, indent=2) + "\n")
        secs = sum(t["lines"].values()) / FPS
        print(f"{slug:28s} {len(t['lines']):3d} lines  {secs:5.1f}s speech")
    print(f"synthesised {len(jobs)} line(s)")


if __name__ == "__main__":
    main()
