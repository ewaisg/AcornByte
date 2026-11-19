# AcornByte identity

## Wordmark

The wordmark is the owner's AcornByte lettering at Regular weight (stroke matched to Manrope Regular), with an acorn in place of the "o". The acorn's body is the lower half of the "o"; the cap is an open gold arc with a short stem, kept below the height of the "b" and "t". The gold diagonals on the "A" and "y" are part of the lettering. All SVGs are outlined (no fonts or strokes).

| File | Use |
| --- | --- |
| `assets/brand/acornbyte-wordmark-on-dark.svg` | Navy or dark backgrounds. Off-white letters, gold gradient accents. |
| `assets/brand/acornbyte-wordmark-on-light.svg` | Cream, white or light backgrounds. Navy letters, solid gold accents (the bright gradient end fades on light backgrounds). |
| `assets/brand/acornbyte-logo-navy.svg`, `-black.svg`, `-white.svg` | One-color versions for print, stamps and photos. |
| `assets/brand/acornbyte-acorn-on-dark.svg`, `-on-light.svg`, `-navy.svg`, `-white.svg` | Acorn mark alone, for avatars and compact placements. |
| `assets/favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | Acorn on the navy tile. |
| `assets/social-preview.png` | 1200 x 630 link preview. |

The complete export set (PNGs up to 4000 px, app icons, usage guide) is kept outside the repository as the AcornByte logo package.

Minimum width 150 px on screen, 35 mm in print; below that use the acorn mark. Clear space: at least the height of the "n". Do not stretch, add shadows, or recolor individual letters.

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

Earlier logo files (`acornbyte-logo-on-dark.png` and the other `acornbyte-logo-*.png` files, `acornbyte-wordmark-green/light/black.svg`, `acornbyte-icon.svg`) are no longer referenced by the site and are kept for reference only.
