# Santiago V. — Portfolio

Static portfolio: `index.html`, with inline CSS and no build step. One tiny inline script plays demo videos only while on screen. Images and videos live in `assets/`.

Preview: `python3 -m http.server 4011` → <http://localhost:4011>

Deploy: serve the repository root as static files.

## First-load performance

- Styles live in the `<style>` block in `index.html`, avoiding a separate render-blocking CSS request.
- Project videos use native `<source media>` selection: original 960px files above 600px viewport width, smaller 640px/30fps MP4s on mobile. The existing on-screen playback and `preload="none"` behavior are unchanged.
- Book covers and shared photos use WebP `srcset` variants. The browser picks an appropriate size; original JPEGs are retained for regeneration. All keep lazy loading and explicit dimensions.
- No posters, preview images, click-to-play gate, framework, or deployment build is added.

## Updating media

After changing original JPEGs, run `python3 scripts/optimize-images.py` with Pillow installed. After changing a project video, run `python3 scripts/optimize-videos.py` with FFmpeg installed. Commit the generated assets along with the originals. These tools are for local maintenance only; the deployed site has no runtime dependencies.

Run the static checks with `python3 -m unittest discover -s tests -v` (requires Pillow). When adding an image, keep its `srcset` width descriptors accurate and its `sizes` value aligned with the layout. After publishing, verify mobile selects `/assets/video/mobile/` while desktop selects the original video, and that images select appropriately sized WebP files.
