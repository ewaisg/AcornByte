# AcornByte identity

## Wordmark

The wordmark is the owner's thin geometric lettering with an acorn in place of the "o". The acorn body is the lower half of the original "o" (same curve, width and stroke weight), with a gold monoline cap and stem that stay within the letter widths and below the ascender height of "b" and "t". The gold diagonals on the "A" and "y" are part of the lettering.

| File | Use |
| --- | --- |
| `assets/brand/acornbyte-wordmark-on-dark.svg` | Navy or other dark backgrounds. Off-white letters, gold gradient accents. |
| `assets/brand/acornbyte-wordmark-on-light.svg` | Cream, white or other light backgrounds. Navy letters, solid gold accents (the bright gradient end is too pale on light backgrounds). |
| `assets/brand/acornbyte-acorn-on-dark.svg` / `-on-light.svg` | Acorn mark alone, for avatars and compact placements. |
| `assets/favicon.svg`, `assets/apple-touch-icon.png` | Acorn on the navy tile. Strokes are slightly heavier so it holds up at 16-32 px. |

SVG is the master format. Minimum wordmark width 180 px on screen. Keep clear space of at least half the letter height. Do not stretch, add shadows, or recolor individual letters.

## Colors

| Token | Hex | Notes |
| --- | --- | --- |
| Navy | `#131C2D` | Dark background, light-theme text |
| Off-white | `#D8D4C8` | Dark-theme text, wordmark letters on dark |
| Cream | `#F3EFE6` | Light background |
| Gold | `#BC7C14` | Buttons, fills, accents |
| Logo gold | `#D1902A` to `#FFD740` | Wordmark gradient on dark |
| Gold text (light theme) | `#80550D`, large headline words `#9A6510` | Darker so gold text passes contrast on cream |

## Themes

Dark is the default; visitors can switch to light. The workbench, contact, About panel and hero card are navy bands in both themes and always use the dark token set; the light cards inside them (workbench window, contact form, hero window) switch back to light tokens in the light theme. See the top of `theme.css`.

Fonts: Manrope and Instrument Serif italic, self-hosted in `assets/fonts/`. The wordmark is outlined SVG and needs no font.

Earlier logo files (`acornbyte-logo-*.png`, `acornbyte-wordmark-green/light/black.svg`, `acornbyte-icon.svg`) are no longer referenced by the site and are kept for reference only.
