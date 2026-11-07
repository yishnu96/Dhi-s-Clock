"""Build web-ready client media derivatives and a source-complete manifest.

Run from the project root: python tools/prepare-client-media.py
Requires ffmpeg and ffprobe on PATH. Source files are never modified.
"""
from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "clients-images"
DEST = ROOT / "assets" / "client"
MANIFEST = DEST / "manifest.json"


def run(*args: str) -> None:
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def dimensions(path: Path) -> tuple[int, int]:
    data = subprocess.check_output([
        "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
        "stream=width,height", "-of", "json", str(path),
    ])
    stream = json.loads(data)["streams"][0]
    return int(stream["width"]), int(stream["height"])


def duration(path: Path) -> float:
    value = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of",
        "default=noprint_wrappers=1:nokey=1", str(path),
    ], text=True)
    return float(value.strip())


def classify(source: Path, rel: Path) -> tuple[str, str, str, str]:
    name, folder = source.name, rel.parts[0]
    if name == "WhatsApp Image 2026-11-06 at 2.45.29 PM.jpeg":
        return "product-clock", "product", "Beige circular DHI’S CLOCK with a digital display", "A beige circular digital clock with prompts for daily, monthly, and yearly guidance."
    if "Video" in name and "2.50.55" in name:
        return "campaign-film", "campaign", "Lifestyle film showing the clock in a home", "A woman stands beside the DHI’S CLOCK in a home interior."
    if folder == "book_launch_event" or (folder == "mendatory_images" and "Video" in name):
        group = "launch"
        if "Video" in name:
            caption = "Author speaking at the DHI’S CLOCK book launch." if "2.52.00" in name else "Book launch footage featuring the author and guests."
            alt = "Author speaking at the DHI’S CLOCK book launch." if "2.52.00" in name else "Guests and author at the book launch."
        elif "2.52.01" in name:
            caption = "A woman in a black suit at the Meet the Author Clever Fox booth."
            alt = "A woman in a black suit at the Meet the Author booth."
        elif "2s.51.57" in name:
            caption = "The author speaks beside the book launch poster."
            alt = "Author speaking beside a DHI’S CLOCK book launch poster."
        elif "dat 2.51.57" in name:
            caption = "A DHI’S CLOCK book launch gift bag on display."
            alt = "Gift bag featuring DHI’S CLOCK at the book launch."
        elif "20d26" in name:
            caption = "Saudamini Mishra holds a copy of DHI’S CLOCK at the launch."
            alt = "Saudamini Mishra holds the DHI’S CLOCK book."
        else:
            caption = "DHI’S CLOCK book launch event."
            alt = "DHI’S CLOCK at the book launch."
        return "", group, alt, caption
    if "2.44.52" in name:
        return "recognition-clock-rank", "recognition", "Physical clock ranking screenshot", "Retail screenshot showing the physical clock at #226 in Wall Clocks."
    if folder == "mendatory_images" and "2.52.00" in name:
        return "recognition-book-rank", "recognition", "Book category ranking screenshot", "Retail screenshot showing the book at #47 in its category."
    if folder == "mendatory_images" and "2.52.041" in name:
        return "launch-story-05", "launch", "New Delhi World Book Fair story for the Clever Fox booth", "An Instagram story showing the Clever Fox booth at the New Delhi World Book Fair."
    if "2.50.57" in name:
        return "campaign-kitchen", "campaign", "DHI’S CLOCK in a kitchen", "A woman points to DHI’S CLOCK in a bright kitchen."
    if folder == "mendatory_images" and "2.52.01" in name:
        return "launch-promo-story", "launch", "New Delhi World Book Fair Meet the Author announcement", "Announcement for Saudamini Mishra’s Meet the Author session at the 2026 New Delhi World Book Fair."
    if "Video" in name:
        return "launch-film", "launch", "DHI’S CLOCK book launch", "Video highlights from the DHI’S CLOCK book launch."
    if "at- 2.50.56" in name:
        return "campaign-market-workday", "campaign", "DHI’S CLOCK in a market research office", "A man looks at market screens with DHI’S CLOCK on the wall behind him."
    if "2.50.56" in name:
        return "campaign-party-routine", "campaign", "Checking DHI’S CLOCK before going out", "A woman checks DHI’S CLOCK before leaving for a party."
    if "2.50.55" in name and "Video" not in name:
        return "campaign-study-routine", "campaign", "DHI’S CLOCK beside a study desk", "A student checks a phone beside a study desk, with DHI’S CLOCK on the wall."
    if "2.50.5-6" in name or "2.45.05" in name:
        return "campaign-office-routine", "campaign", "DHI’S CLOCK in a workday routine", "A person uses a phone beside DHI’S CLOCK in a home office."
    # Remaining images in if_needed show the clock used in home and work routines.
    return "campaign-scene", "campaign", "DHI’S CLOCK in everyday life", "A lifestyle scene showing DHI’S CLOCK in use."


def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    sources = sorted(p for p in SOURCE.rglob("*") if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".mp4"})
    if len(sources) != 19:
        raise SystemExit(f"Expected 19 supplied files, found {len(sources)}")
    seen_ids: dict[str, int] = {}
    seen_hashes: dict[str, str] = {}
    manifest = []
    for source in sources:
        rel = source.relative_to(SOURCE)
        kind = "video" if source.suffix.lower() == ".mp4" else "image"
        base_id, group, alt, caption = classify(source, rel)
        if not base_id:
            prefix = "launch-video" if kind == "video" else "launch-image"
            base_id = f"{prefix}-{sum(1 for e in manifest if e['group'] == 'launch' and e['kind'] == kind) + 1:02d}"
        seen_ids[base_id] = seen_ids.get(base_id, 0) + 1
        item_id = base_id if seen_ids[base_id] == 1 else f"{base_id}-{seen_ids[base_id]}"
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        ext = ".webp" if kind == "image" else ".mp4"
        output_id = seen_hashes.get(digest)
        if output_id is None:
            output_id = item_id
            seen_hashes[digest] = output_id
        output = DEST / f"{output_id}{ext}"
        poster = None
        if output_id == item_id and (not output.is_file() or output.stat().st_size == 0):
            if kind == "image":
                run("ffmpeg", "-y", "-i", str(source), "-vf", "scale=1600:1600:force_original_aspect_ratio=decrease", "-frames:v", "1", "-c:v", "libwebp", "-quality", "82", str(output))
            else:
                run("ffmpeg", "-y", "-i", str(source), "-vf", "scale=720:720:force_original_aspect_ratio=decrease:force_divisible_by=2", "-c:v", "libx264", "-preset", "fast", "-crf", "26", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", str(output))
        width, height = dimensions(output)
        if kind == "video":
            poster = f"assets/client/{output_id}-poster.jpg"
            poster_path = ROOT / poster
            if not poster_path.exists():
                poster_path.unlink(missing_ok=True)
                run("ffmpeg", "-y", "-ss", f"{duration(output) * 0.35:.3f}", "-i", str(output), "-frames:v", "1", "-vf", "scale=900:900:force_original_aspect_ratio=decrease", "-q:v", "4", str(poster_path))
        item = {
            "id": item_id, "kind": kind, "src": f"assets/client/{output_id}{ext}",
            "thumbnail": poster or f"assets/client/{output_id}{ext}", "poster": poster,
            "width": width, "height": height, "group": group, "alt": alt,
            "caption": caption, "source": f"clients-images/{rel.as_posix()}",
        }
        manifest.append(item)
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    missing = [entry["src"] for entry in manifest if not (ROOT / entry["src"]).is_file()]
    missing += [entry["poster"] for entry in manifest if entry["poster"] and not (ROOT / entry["poster"]).is_file()]
    if missing:
        raise SystemExit(f"Missing derivative files: {missing}")
    represented = {ROOT / entry["source"] for entry in manifest}
    if represented != set(sources):
        raise SystemExit("Manifest source list does not match the supplied files")
    print(f"Wrote {MANIFEST.relative_to(ROOT)} with {len(manifest)} entries ({sum(e['kind']=='image' for e in manifest)} images, {sum(e['kind']=='video' for e in manifest)} videos). All derivatives exist.")


if __name__ == "__main__":
    main()
