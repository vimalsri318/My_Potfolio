#!/usr/bin/env python3
"""Cut film media out of 2× captures (public/films/_captures) at 1× CSS size.

  python3 scripts/crop.py <slug> <capture> <name> <y_css> [h_css]
  python3 scripts/crop.py <slug> --batch "capture name y h; capture name y h; ..."

Writes public/films/<slug>/media/<name>.jpg. With no h_css, takes everything
from y to the bottom (for scrolling shots).
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "public" / "films"


def crop(slug, cap, name, y, h=None):
    src = Image.open(ROOT / "_captures" / f"{cap}.jpg").convert("RGB")
    k = 2
    im = src.crop((0, y * k, src.width, min(src.height, (y + h) * k) if h else src.height))
    im = im.resize((im.width // k, im.height // k), Image.LANCZOS)
    out = ROOT / slug / "media" / f"{name}.jpg"
    out.parent.mkdir(parents=True, exist_ok=True)
    im.save(out, quality=84, optimize=True)
    print(out.relative_to(ROOT.parent), im.size)


if "--batch" in sys.argv:
    slug = sys.argv[1]
    for job in sys.argv[sys.argv.index("--batch") + 1].split(";"):
        parts = job.split()
        if parts:
            crop(slug, parts[0], parts[1], int(parts[2]), int(parts[3]) if len(parts) > 3 else None)
else:
    a = sys.argv[1:]
    crop(a[0], a[1], a[2], int(a[3]), int(a[4]) if len(a) > 4 else None)
