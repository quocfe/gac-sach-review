# Local Vietnamese typography

- **Source Sans 3** variable (200–900): body, navigation and controls.
- **Source Serif 4** variable (200–900, optical size 8–60): editorial headings, book titles and real italics.
- WOFF2 assets are imported through `src/app/fonts.css` in the root layout. Next.js bundles them under same-origin, hashed static asset URLs. Neither builds nor visitors fetch Google Fonts.
- Existing typography tokens, sizes, colors and layout remain unchanged.

## Why checked-in fonts rather than @fontsource

The tested Fontsource subsets covered precomposed Vietnamese but omitted the combining circumflex (U+0302), breve (U+0306) and horn (U+031B). Chromium actually rendered decomposed Vietnamese with Liberation Serif fallback. These local subsets retain all combining marks available in the upstream fonts as well as Latin, Vietnamese, punctuation, currency and arrows. They pass actual rendered-font checks for both NFC and NFD text.

## Sources and licenses

Source files come from the `google/fonts` repository, `ofl/sourcesans3` and `ofl/sourceserif4`, authored by Adobe and distributed under SIL OFL 1.1. Both licenses are included here. Exact upstream Git blob IDs are pinned in `scripts/bundle-fonts.py`; the script refuses changed upstream data. WOFF2 conversion/subsetting preserves font names, variable axes and layout tables.

Regenerate explicitly (not a build prerequisite):

```sh
uv run --with fonttools --with brotli python scripts/bundle-fonts.py
```

Browser regression:

```sh
E2E_PORT=3329 npm run test:e2e -- e2e/fonts.spec.ts --workers=1
```

The test checks same-origin font delivery, loaded faces, actual Chromium glyph fonts (not just configured CSS), regular/bold/serif italic, all Vietnamese vowel/tone combinations, uppercase and decomposed text, and heading/page overflow at 320, 390 and 1440px on home, catalog, detail and review-composer routes.
