#!/usr/bin/env python3
"""
Narration for the AmretriPromo composition.

Synthesises every line separately with Kokoro (local, free), loudness-normalises
it, measures it with ffprobe, and writes:

  public/amretri/vo/<id>.mp3      one clip per line
  src/amretri/voiceover.json      {voice, lines: {id: durFrames}}

The composition reads voiceover.json and times each scene's visuals to its
lines, so the video always fits the voice — change a line, re-run, re-render.

Kokoro runs in the clean venv from Instagram-post-creation/reels (its deps
segfault under this Mac's Anaconda python; see that project's README).
Override with KOKORO_PYTHON / KOKORO_BATCH if it moves.

Usage:
  python3 scripts/amretri_vo.py                    # full narration, af_heart
  python3 scripts/amretri_vo.py --voice am_michael
  python3 scripts/amretri_vo.py --samples          # one line in several voices → out/voice-samples/
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REELS = ROOT.parent.parent / "Instagram-post-creation" / "reels"
KOKORO_PYTHON = Path(os.environ.get("KOKORO_PYTHON", REELS / ".venv-tts" / "bin" / "python3"))
KOKORO_BATCH = Path(os.environ.get("KOKORO_BATCH", REELS / "script" / "kokoro_batch.py"))
FPS = 30

# id → text. Scene grouping and timing live in src/amretri/AmretriPromo.tsx.
LINES: dict[str, str] = {
    "hook1": "Most website chatbots need a backend server, a database, and paid A.I. keys.",
    "hook2": "Amri runs on a browser tab, and a Google Sheet.",
    "tour1": "Meet Amri, the assistant built into Amretri Healthcare's website.",
    "tour2": "It's a full, multi-page site. Services, careers, a blog, and contact.",
    "tour3": "And Amri is right there, one tap away.",
    "chat1": "Before the chat starts, Amri asks for a name and email, and that lead lands in Google Sheets, instantly.",
    "chat2": "Ask it anything. It answers from fifty-two curated questions, right in the browser.",
    "chat3": "Type something like, take over my pharmacy, and it spots the intent, and runs a guided intake, checking every answer.",
    "chat4": "At the end, the full brief is ready for the team on WhatsApp. One tap.",
    "arch1": "Under the hood, there's no A.I. server.",
    "arch2": "Every message hits a rule engine first, so known questions are answered instantly.",
    "arch3": "Everything else goes to a small language model, running on the visitor's own device, with Web L.L.M. and Web G.P.U.",
    "arch4": "Zero inference servers. Zero A.P.I. keys. Zero cost per conversation.",
    "sheets1": "And there's no database either. Just Google Sheets, and Apps Script.",
    "sheets2": "Every form on the site posts to one Apps Script web app.",
    "sheets3": "It finds the right tab, creates it if it's missing, adds any new columns, and appends the row.",
    "sheets4": "One script. That's the entire backend.",
    "blog1": "And the blog? That's a Sheet too.",
    "blog2": "The blog page reads the Blogs tab as [JSON](/ʤˈAsᵊn/), so adding a row publishes a post.",
    "blog3": "No C.M.S. No redeploy.",
    "outro1": "Zero A.I. servers. Zero database bills.",
    "outro2": "Just React, in-browser A.I., Google Sheets, and Vercel.",
    "outro3": "Read the full case study, and see how it was built.",
}

SAMPLE_VOICES = ["af_heart", "af_bella", "af_nicole", "bf_emma", "am_michael", "am_adam"]
SAMPLE_TEXT = LINES["chat1"] + " " + LINES["arch1"]


def espeak_lib() -> str:
    lib = next(Path("/opt/homebrew/Cellar/espeak-ng").glob("*/lib/libespeak-ng.dylib"), None)
    if lib is None:
        sys.exit("espeak-ng not found. Run: brew install espeak-ng")
    return str(lib)


def kokoro(manifest: list[dict]) -> None:
    if not KOKORO_PYTHON.exists():
        sys.exit(f"Kokoro python not found at {KOKORO_PYTHON} (set KOKORO_PYTHON).")
    proc = subprocess.run(
        [str(KOKORO_PYTHON), str(KOKORO_BATCH)],
        input=json.dumps(manifest),
        text=True,
        capture_output=True,
        env={**os.environ, "PHONEMIZER_ESPEAK_LIBRARY": espeak_lib()},
    )
    if proc.returncode != 0:
        sys.exit(f"kokoro_batch failed:\n{proc.stderr[-2000:]}")


def normalise(raw: Path, out: Path) -> None:
    # Trim leading/trailing silence, then broadcast-ish loudness.
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw),
         "-af", "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-16:TP=-1.5:LRA=11",
         "-ar", "48000", "-ac", "1", str(out)],
        check=True,
    )


def duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default="af_heart")
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--samples", action="store_true")
    args = ap.parse_args()

    with tempfile.TemporaryDirectory() as tmp:
        tmpd = Path(tmp)
        if args.samples:
            outdir = ROOT / "out" / "voice-samples"
            outdir.mkdir(parents=True, exist_ok=True)
            kokoro([{"text": SAMPLE_TEXT, "voice": v, "speed": args.speed, "out": str(tmpd / f"{v}.wav")} for v in SAMPLE_VOICES])
            for v in SAMPLE_VOICES:
                wav = tmpd / f"{v}.norm.wav"
                normalise(tmpd / f"{v}.wav", wav)
                subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-b:a", "160k", str(outdir / f"{v}.mp3")], check=True)
            print("samples →", outdir)
            return

        vo_dir = ROOT / "public" / "amretri" / "vo"
        vo_dir.mkdir(parents=True, exist_ok=True)
        kokoro([{"text": t, "voice": args.voice, "speed": args.speed, "out": str(tmpd / f"{i}.wav")} for i, t in LINES.items()])
        frames: dict[str, int] = {}
        for i in LINES:
            wav = tmpd / f"{i}.norm.wav"
            normalise(tmpd / f"{i}.wav", wav)
            frames[i] = int(round(duration(wav) * FPS))
            out = vo_dir / f"{i}.mp3"
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-b:a", "160k", str(out)], check=True)
            (vo_dir / f"{i}.wav").unlink(missing_ok=True)
        meta = {"voice": args.voice, "speed": args.speed, "fps": FPS, "lines": frames}
        (ROOT / "src" / "amretri" / "voiceover.json").write_text(json.dumps(meta, indent=2) + "\n")
        print(f"{len(frames)} lines, {sum(frames.values()) / FPS:.1f}s of speech, voice {args.voice}")


if __name__ == "__main__":
    main()
