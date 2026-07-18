#!/usr/bin/env python3
# Kickoff Cards — split the 6x8 team-card sheet into 48 individual card PNGs.
#
# The source sheet is a 1024x1536 grid, 6 columns x 8 rows, row-major in the
# same order as the app's TEAMS list. Each cell is cropped, then its black
# gutter is trimmed away so every card sits flush in its own file.
#
# Output: public/cards/teams/<slug>.png  (slug matches cards.js teamSlug()).
#
# Usage:
#   python3 scripts/split-team-cards.py "/path/to/Teams KickOff cards.png"

import sys
import unicodedata
from pathlib import Path
from PIL import Image, ImageChops

COLS, ROWS = 6, 8

# Row-major order, matching the sheet and the TEAMS keys in worldcup2026.js.
NAMES = [
    "Mexico", "South Africa", "South Korea", "Czechia", "Canada", "Bosnia",
    "Qatar", "Switzerland", "Brazil", "Morocco", "Haiti", "Scotland",
    "USA", "Paraguay", "Australia", "Turkey", "Germany", "Curaçao",
    "Ivory Coast", "Ecuador", "Netherlands", "Japan", "Sweden", "Tunisia",
    "Belgium", "Egypt", "Iran", "New Zealand", "Spain", "Cabo Verde",
    "Saudi", "Uruguay", "France", "Senegal", "Iraq", "Norway",
    "Argentina", "Algeria", "Austria", "Jordan", "Portugal", "DR Congo",
    "Uzbekistan", "Colombia", "England", "Croatia", "Ghana", "Panama",
]


def slug(name):
    n = unicodedata.normalize("NFD", name).encode("ascii", "ignore").decode()
    n = n.lower()
    out = []
    for ch in n:
        out.append(ch if ch.isalnum() else "-")
    s = "".join(out)
    while "--" in s:
        s = s.replace("--", "-")
    return s.strip("-")


def trim_black(im, threshold=10):
    """Crop away the near-black outer border around the whole sheet so the
    leftmost/rightmost card columns don't inherit the sheet's black frame."""
    rgb = im.convert("RGB")
    bg = Image.new("RGB", rgb.size, (0, 0, 0))
    diff = ImageChops.difference(rgb, bg).convert("L")
    mask = diff.point(lambda p: 255 if p > threshold else 0)
    bbox = mask.getbbox()
    return im.crop(bbox) if bbox else im


def card_trim(cell, frac=0.20):
    """Trim a single cell down to its card by requiring a row/column's MEAN
    brightness to clear a fraction of the cell's own brightest row/column. Using
    the mean (not any single pixel) ignores stray colored specks left in the
    black gutter, so every card sits flush with no black side bars."""
    l = cell.convert("L")
    w, h = l.size
    cols = list(l.resize((w, 1), Image.BOX).getdata())
    rows = list(l.resize((1, h), Image.BOX).getdata())
    ct = max(cols) * frac
    rt = max(rows) * frac
    xs = [i for i, v in enumerate(cols) if v > ct]
    ys = [i for i, v in enumerate(rows) if v > rt]
    if not xs or not ys:
        return cell
    return cell.crop((xs[0], ys[0], xs[-1] + 1, ys[-1] + 1))


def normalize(card, out=(600, 900)):
    """Resize each trimmed card to fill the app's 2:3 card frame at a uniform
    resolution. The sheet vertically compresses the lower rows, so a direct
    resize both makes every file identical AND un-squishes those rows back to the
    same full-frame proportions as the top cards — no black padding, no clipped
    names."""
    return card.convert("RGBA").resize(out, Image.LANCZOS)


def content_bands(profile, thr):
    """Bright runs (cards) in a 1-D brightness profile; runs at/below `thr`
    are treated as gutters."""
    segs = []
    start = None
    for i, v in enumerate(profile):
        if v > thr and start is None:
            start = i
        elif v <= thr and start is not None:
            segs.append((start, i))
            start = None
    if start is not None:
        segs.append((start, len(profile)))
    return segs


def cell_edges(profile, size, want):
    """Return `want`+1 cut positions. Bands are found for a range of
    thresholds until exactly `want` are detected, then boundaries are placed at
    the gutter midpoints so a card's darker frame top is never clipped."""
    bands = None
    for thr in (10, 12, 8, 15, 6, 18, 22, 25):
        b = content_bands(profile, thr)
        if len(b) == want:
            bands = b
            break
    if bands is None:  # fall back to an even split
        step = size / want
        return [round(k * step) for k in range(want + 1)]
    edges = [0]
    for k in range(1, want):
        edges.append((bands[k - 1][1] + bands[k][0]) // 2)
    edges.append(size)
    return edges


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/split-team-cards.py <sheet.png>")
        sys.exit(1)

    src = Path(sys.argv[1])
    if not src.exists():
        print(f"Source not found: {src}")
        sys.exit(1)

    out_dir = Path(__file__).resolve().parent.parent / "public" / "cards" / "teams"
    out_dir.mkdir(parents=True, exist_ok=True)

    # Trim the whole sheet's outer black frame first, otherwise the leftmost and
    # rightmost card columns inherit that border as a black side bar.
    sheet = trim_black(Image.open(src).convert("RGBA"))
    W, H = sheet.size
    gray = sheet.convert("L")

    # Cards span the full width/height of their cell, so the brightness profile
    # along each axis has clear bright bands (cards) separated by black gutters.
    # The sheet's rows are vertically foreshortened toward the bottom, so an even
    # split merges the last rows — detect real gutters on BOTH axes instead.
    col_profile = list(gray.resize((W, 1), Image.BOX).getdata())
    row_profile = list(gray.resize((1, H), Image.BOX).getdata())
    xe = cell_edges(col_profile, W, COLS)
    ye = cell_edges(row_profile, H, ROWS)
    print(f"Sheet {W}x{H}\n x-edges {xe}\n y-edges {ye}\n")

    for i, name in enumerate(NAMES):
        r, c = divmod(i, COLS)
        box = (xe[c], ye[r], xe[c + 1], ye[r + 1])
        cell = sheet.crop(box)
        # Trim each cell to its card (drops leftover black gutter on the sides),
        # then resize to the uniform 2:3 frame so all 48 share the same framed
        # look and size with no black side bars.
        card = normalize(card_trim(cell))
        dst = out_dir / f"{slug(name)}.png"
        card.save(dst)
        print(f"ok  {name:14s} {card.size[0]}x{card.size[1]} -> {dst.name}")

    print(f"\nDone. {len(NAMES)} cards written.")


if __name__ == "__main__":
    main()
