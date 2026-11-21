# Aether Software — quantum AI startup site

Single-page site in the style of the reference wallpaper: a warm-white field of
halftone dots (denser toward the bottom-left) with a custom dot-matrix display
font rendered as dots on canvas.

## Run

Any static server works:

    python3 -m http.server 8000

then open http://localhost:8000

Or publish directly from this repository via GitHub Pages (Settings → Pages →
Deploy from a branch → select this branch, root).

## Files

- `index.html` — page markup
- `styles.css` — layout and theme
- `dotfont.js` — custom 5×7 dot-matrix font engine (glyph data + canvas renderer + animator)
- `app.js` — halftone background, hero animation, marquee, scroll reveals
- `favicon.svg` — dot-matrix "A"

No dependencies, no build step, works offline. Respects `prefers-reduced-motion`.
