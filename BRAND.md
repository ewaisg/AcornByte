# AcornByte identity

## Logo: One Bit

The mark is a true acorn whose stem is a single square pixel, the smallest unit of anything digital. Pixel, cap and nut are separated by one identical gap. The wordmark is lowercase Manrope ExtraBold, custom kerned. All color lives in the mark; the name is always one color. All SVGs are outlined (no fonts or strokes).

| File | Use |
| --- | --- |
| `assets/brand/acornbyte-wordmark-on-dark.svg` | Primary logo on navy or dark backgrounds (off-white nut and letters, gold cap and pixel). Used in the header, footer, hero card and About panel. |
| `assets/brand/acornbyte-wordmark-on-light.svg` | Primary logo on cream, white or light backgrounds (navy nut and letters, deeper gold). |
| `assets/brand/acornbyte-stacked-*.svg` | Stacked logo, mark above the name. |
| `assets/brand/acornbyte-logo-navy.svg`, `-black.svg`, `-white.svg` | One-color logos for print, engraving and photos. |
| `assets/brand/acornbyte-acorn-on-dark.svg`, `-on-light.svg`, `-navy.svg`, `-white.svg` | Mark alone. |
| `assets/favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | Mark on the navy tile; the favicon uses a slightly larger mark so the pixel survives at 16 px. |
| `assets/social-preview.png` | 1200 x 630 link preview. |

Logo colors: gold `#E0A12F` and off-white `#E6E1D5` on dark; gold `#B8790F` and navy `#131C2D` on light. The complete export set (PNGs up to 4000 px, app icons, usage guide) is kept outside the repository as the One Bit logo package.

Minimum size: horizontal logo 120 px wide on screen (30 mm in print); mark alone 16 px. Clear space: at least the cap height. Keep the gaps equal and never let pixel, cap and nut touch. Do not stretch, add effects, recolor the wordmark, or change the typeface.

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

Fonts: Manrope and Instrument Serif italic, self-hosted in `assets/fonts/`. The logo is outlined SVG and needs no font.

Earlier logo files (`acornbyte-logo-on-dark.png` and the other `acornbyte-logo-*.png` files, `acornbyte-wordmark-green/light/black.svg`, `acornbyte-icon.svg`) are no longer referenced by the site and are kept for reference only.
