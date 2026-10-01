import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text()
PROJECTS = ("theonboard", "tnkr", "java", "dentist", "lamoureux", "premierstriping", "buddy")


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images, self.videos, self.links, self.refs = [], [], [], []
        self.current_video = None

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == "img":
            self.images.append(attrs)
        if tag == "video":
            self.current_video = {"attributes": attrs, "sources": []}
            self.videos.append(self.current_video)
        if tag == "source" and self.current_video is not None:
            self.current_video["sources"].append(attrs)
        if tag == "link":
            self.links.append(attrs)
        for key in ("src", "href", "poster"):
            if attrs.get(key, "").startswith("/"):
                self.refs.append(attrs[key])
        for candidate in attrs.get("srcset", "").split(","):
            if candidate.strip():
                self.refs.append(candidate.strip().split()[0])

    def handle_endtag(self, tag):
        if tag == "video":
            self.current_video = None


PAGE = Page()
PAGE.feed(HTML)


class PortfolioTests(unittest.TestCase):
    def test_css_is_inline_and_not_a_render_blocking_request(self):
        self.assertEqual(HTML.count("<style>"), 1)
        self.assertFalse(any(link.get("rel") == "stylesheet" for link in PAGE.links))
        css = re.search(r"<style>(.*?)</style>", HTML, re.S).group(1)
        self.assertIn("@media (max-width: 600px)", css)
        self.assertIn(".books", css)
        self.assertNotIn("@import", css)

    def test_every_local_reference_exists(self):
        for url in PAGE.refs:
            with self.subTest(url=url):
                self.assertTrue((ROOT / url.lstrip("/")).is_file())

    def test_existing_autoplay_and_lazy_video_behavior_is_preserved(self):
        self.assertEqual(len(PAGE.videos), 9)
        for video in PAGE.videos:
            attrs = video["attributes"]
            for flag in ("muted", "loop", "playsinline"):
                self.assertIn(flag, attrs)
            self.assertEqual(attrs.get("preload"), "none")
            self.assertNotIn("poster", attrs)
            self.assertNotIn("controls", attrs)
        self.assertIn('rootMargin: "200px"', HTML)
        self.assertIn("e.target.play()", HTML)
        self.assertIn("e.target.pause()", HTML)

    def test_mobile_and_desktop_use_distinct_native_sources(self):
        for name, video in zip(PROJECTS, PAGE.videos[:7]):
            self.assertNotIn("src", video["attributes"])
            desktop, mobile = video["sources"]
            self.assertEqual(desktop, {
                "src": f"/assets/video/{name}.mp4",
                "media": "(min-width: 601px)", "type": "video/mp4",
            })
            self.assertEqual(mobile, {
                "src": f"/assets/video/mobile/{name}.mp4", "type": "video/mp4",
            })
            for viewport in (320, 390, 600, 601, 1280):
                selected = desktop if viewport >= 601 else mobile
                self.assertEqual("/mobile/" in selected["src"], viewport <= 600)

    def test_portrait_video_sources_are_unchanged(self):
        self.assertEqual([v["attributes"]["src"] for v in PAGE.videos[-2:]],
                         ["/assets/video/IMG_2521.mp4", "/assets/video/IMG_1133.mp4"])

    def test_webp_images_keep_lazy_loading_and_dimensions(self):
        images = [i for i in PAGE.images if i["src"].endswith(".webp")]
        self.assertEqual(len(images), 18)
        for image in images:
            with self.subTest(src=image["src"]):
                self.assertEqual(image["loading"], "lazy")
                self.assertEqual(image["decoding"], "async")
                self.assertGreater(int(image["width"]), 0)
                self.assertGreater(int(image["height"]), 0)
                self.assertIn("max-width: 600px", image["sizes"])
                self.assertEqual(len(image["srcset"].split(",")), 3)

    def test_srcset_widths_match_decoded_webp_files(self):
        for image in PAGE.images:
            for entry in image.get("srcset", "").split(","):
                if not entry.strip():
                    continue
                url, width = entry.strip().split()
                with self.subTest(url=url), Image.open(ROOT / url.lstrip("/")) as decoded:
                    decoded.load()
                    self.assertEqual(decoded.format, "WEBP")
                    self.assertEqual(decoded.width, int(width[:-1]))

    def test_full_size_webp_preserves_resolution_and_reduces_total_bytes(self):
        originals = list((ROOT / "assets/img").rglob("*.jpg"))
        original_bytes = webp_bytes = 0
        for source in originals:
            target = source.with_suffix(".webp")
            with Image.open(source) as original, Image.open(target) as webp:
                self.assertEqual(ImageOps.exif_transpose(original).size, webp.size)
                self.assertEqual(original.info.get("icc_profile", b""),
                                 webp.info.get("icc_profile", b""))
            original_bytes += source.stat().st_size
            webp_bytes += target.stat().st_size
        self.assertLess(webp_bytes, original_bytes * 0.5)

    def test_rotated_photo_reserves_its_actual_display_shape(self):
        image = next(i for i in PAGE.images if i["src"] == "/assets/img/share/1744.webp")
        self.assertEqual((int(image["width"]), int(image["height"])), (675, 900))

    def test_no_runtime_framework_or_new_fetch_scripts(self):
        self.assertNotIn('<script src=', HTML)
        self.assertEqual(HTML.count("<script>"), 1)
        self.assertFalse((ROOT / "package.json").exists())


if __name__ == "__main__":
    unittest.main()
