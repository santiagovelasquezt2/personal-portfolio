#!/usr/bin/env python3
"""Regenerate responsive WebP assets from the retained original JPEGs.

Requires Pillow with WebP support; generated images are committed, so deployment
does not need Python, Pillow, or a build step.
"""

from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]


def main():
    original_bytes = full_size_bytes = 0
    for folder, widths in (("books", (200, 400)), ("share", (320, 640))):
        for source in sorted((ROOT / "assets" / "img" / folder).glob("*.jpg")):
            with Image.open(source) as original:
                image = ImageOps.exif_transpose(original).convert("RGB")
                # Keep display color profiles, while baking camera orientation
                # into pixels instead of copying EXIF metadata.
                profile = original.info.get("icc_profile", b"")
                target = source.with_suffix(".webp")
                image.save(target, "WEBP", quality=82, method=6, icc_profile=profile)
                original_bytes += source.stat().st_size
                full_size_bytes += target.stat().st_size
                for width in widths:
                    if width >= image.width:
                        continue
                    height = round(image.height * width / image.width)
                    resized = image.resize((width, height), Image.Resampling.LANCZOS)
                    resized.save(source.with_name(f"{source.stem}-{width}.webp"),
                                 "WEBP", quality=82, method=6, icc_profile=profile)
    print(f"Original JPEGs: {original_bytes:,} bytes; full-size WebPs: {full_size_bytes:,} bytes")


if __name__ == "__main__":
    main()
