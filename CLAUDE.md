# CLAUDE.md

Static multi-page site (no build step). Purpose of this file: avoid re-discovering the traps below every session.

## CSS
- `assets/css/fede.css` — primary site-specific CSS.
- `assets/css/responsive.css` — responsive rules.
- `assets/css/config.css` — site variables.
- `assets/css/work.css` — project (work page) specific styles.
- `assets/vendor/theme.css` — ThemeForest boilerplate/vendor CSS. Avoid searching or editing unless explicitly required.
- `assets/vendor/helper.css` — Bootstrap-style utility/vendor CSS. Avoid searching or editing unless explicitly required.

## Retina / Ultra-wide
- `assets/css/retina-80.css` is **NOT** the authoritative source, despite its name/comments.
- Active Retina/UW rules are currently maintained in the inline `<style>` block inside `index.html` (loads later, wins via source order + `!important`).
- Do not edit `retina-80.css` for normal Retina/UW changes unless explicitly instructed.

## JavaScript
- `assets/js/theme.js` — core scroll/interaction init: smooth-scrollbar setup, nav scroll-to, ScrollTrigger wiring.
- `assets/js/home-load-animations.js` — home page load-triggered/scroll-triggered GSAP reveal animations.
- `assets/js/home-mobile-interactions.js` — mobile-only interaction bootstrap (IntersectionObservers, menu guards).
- Experimental inline `<script>` blocks inside `index.html` ("Ink Shift" hover prototypes) — do not inspect unless the task specifically relates to them.

## Scroll
`theme.js`, `menu.js`, and `ui-scale.js` interact with the scrolling system. Do not refactor these casually — small changes can break smooth-scroll globally.

## Work pages
`work/*/index.html` pages are independent project pages. For a home-only change, do NOT inspect all `work/*` pages.

## General workflow
1. Search the most likely site-specific file first.
2. Avoid vendor files (`assets/vendor/theme.css`, `assets/vendor/helper.css`) unless the requested selector/function is actually defined there.
3. Avoid repository-wide searches for generic terms when a feature-specific location is known.
4. Inspect the smallest relevant context necessary before editing.
5. Make the smallest possible change.
6. Do not refactor unrelated code.
7. Do not inspect all `work/*` pages for home-only changes.
