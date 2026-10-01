# Santiago V. — Portfolio

A small static portfolio with inline CSS and a tiny script for on-screen video playback. It has no framework, build step, or package manager.

## Preview locally

From the project directory, run:

```sh
python3 -m http.server 4011
```

Then open <http://localhost:4011>.

## Deploy

Deploy the repository root as a static site. There is no build command or server process; `index.html` and the image/video files are served directly. For a static host that asks for an output directory, use the repository root (`.`).

The portfolio uses native document links, semantic HTML, responsive CSS, and local assets. To edit page content or appearance, change `index.html` (styles are in its `<style>` block). See `README.md` for responsive-media regeneration and test commands.
