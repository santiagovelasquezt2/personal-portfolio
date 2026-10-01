#!/usr/bin/env python3
"""Rebuild the seven mobile demos using Python 3 and an installed FFmpeg.

Run from any directory: python3 scripts/optimize-videos.py
Only assets/video/mobile/*.mp4 are replaced; desktop and portrait originals
are never modified. The demos use CRF 30 / slow at 640px / 30fps, except the
larger racing demo, which uses visually checked CRF 32 / veryslow settings.
The H.264 encoder is lossy; rerun from the originals, never from a derivative.
"""

import json
import os
from pathlib import Path
import shutil
import struct
import subprocess
import tempfile
from fractions import Fraction


ROOT = Path(__file__).resolve().parents[1]
VIDEO_DIR = ROOT / "assets" / "video"
NAMES = ("theonboard", "tnkr", "java", "dentist", "lamoureux",
         "premierstriping", "buddy")
CRF = 30
PRESET = "slow"
ENCODING_OVERRIDES = {"theonboard": (32, "veryslow")}


def probe(path):
    return json.loads(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_streams", "-show_format",
        "-of", "json", str(path),
    ]))


def atom_positions(path):
    """Read top-level MP4 boxes without loading media into memory."""
    positions = {}
    end = path.stat().st_size
    with path.open("rb") as stream:
        while stream.tell() < end:
            start = stream.tell()
            header = stream.read(8)
            if len(header) != 8:
                raise RuntimeError(f"Truncated MP4 box in {path}")
            size, kind = struct.unpack(">I4s", header)
            header_size = 8
            if size == 1:
                size = struct.unpack(">Q", stream.read(8))[0]
                header_size = 16
            elif size == 0:
                size = end - start
            if size < header_size or start + size > end:
                raise RuntimeError(f"Invalid MP4 box in {path}")
            positions.setdefault(kind, start)
            stream.seek(start + size)
    return positions


def validate(source, output):
    original = probe(source)
    result = probe(output)
    streams = result["streams"]
    if len(streams) != 1 or streams[0]["codec_type"] != "video":
        raise RuntimeError(f"Expected one video stream only: {output}")
    video = streams[0]
    if (video["codec_name"] != "h264" or video["pix_fmt"] != "yuv420p"
            or video["width"] != 640
            or Fraction(video["avg_frame_rate"]) != 30):
        raise RuntimeError(f"Unexpected mobile encoding: {output}")
    original_video = next(s for s in original["streams"]
                          if s["codec_type"] == "video")
    # These screen recordings have square pixels; scaling retains their DAR.
    expected_aspect = Fraction(original_video["width"], original_video["height"])
    sar = Fraction(video["sample_aspect_ratio"].replace(":", "/"))
    actual_aspect = Fraction(video["width"], video["height"]) * sar
    if actual_aspect != expected_aspect:
        raise RuntimeError(f"Display aspect ratio changed: {output}")
    duration_delta = abs(float(result["format"]["duration"])
                         - float(original["format"]["duration"]))
    if duration_delta > 1 / 30 + 0.01:
        raise RuntimeError(f"Duration changed by {duration_delta}s: {output}")
    boxes = atom_positions(output)
    if b"moov" not in boxes or b"mdat" not in boxes or boxes[b"moov"] > boxes[b"mdat"]:
        raise RuntimeError(f"MP4 is missing fast-start metadata: {output}")
    if output.stat().st_size >= source.stat().st_size:
        raise RuntimeError(f"Mobile video is not smaller than its source: {output}")
    subprocess.run([
        "ffmpeg", "-v", "error", "-xerror", "-nostdin", "-i", str(output),
        "-f", "null", "-",
    ], check=True)


def encode(source, output):
    """Encode from an original using its reproducible mobile settings."""
    crf, preset = ENCODING_OVERRIDES.get(source.stem, (CRF, PRESET))
    subprocess.run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
        "-i", str(source), "-map", "0:v:0",
        "-vf", "fps=30,setsar=1,scale=640:-2:flags=lanczos",
        "-c:v", "libx264", "-preset", preset, "-crf", str(crf),
        "-threads", "2", "-pix_fmt", "yuv420p", "-an", "-sn", "-dn",
        "-map_metadata", "-1", "-map_chapters", "-1",
        "-movflags", "+faststart", str(output),
    ], check=True)


def main():
    for command in ("ffmpeg", "ffprobe"):
        if not shutil.which(command):
            raise SystemExit(f"Install {command} from the official FFmpeg distribution first.")
    missing = [str(VIDEO_DIR / f"{name}.mp4") for name in NAMES
               if not (VIDEO_DIR / f"{name}.mp4").is_file()]
    if missing:
        raise SystemExit("Missing source videos: " + ", ".join(missing))
    destination = VIDEO_DIR / "mobile"
    destination.mkdir(exist_ok=True)
    original_total = mobile_total = 0
    for name in NAMES:
        source = VIDEO_DIR / f"{name}.mp4"
        output = destination / source.name
        fd, filename = tempfile.mkstemp(prefix=f".{name}-", suffix=".mp4", dir=destination)
        os.close(fd)
        temporary = Path(filename)
        try:
            encode(source, temporary)
            validate(source, temporary)
            temporary.chmod(0o644)
            temporary.replace(output)
        finally:
            temporary.unlink(missing_ok=True)
        before, after = source.stat().st_size, output.stat().st_size
        original_total += before
        mobile_total += after
        print(f"{name}: {before:,} -> {after:,} bytes ({1 - after / before:.1%} smaller)", flush=True)
    print(f"TOTAL: {original_total:,} -> {mobile_total:,} bytes "
          f"({1 - mobile_total / original_total:.1%} smaller)")


if __name__ == "__main__":
    main()
