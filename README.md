# Staxhe

Personal site for Staxhe: portfolio, current work and links. Plain HTML, CSS and a little vanilla JavaScript. No build step, no frameworks, no tracking.

## Files

```
public/                      everything that gets deployed
  index.html                 page structure + <head> meta tags
  content.js                 ALL editable content (edit this one)
  assets/styles.css          design tokens (colors, fonts, type scale) + layout
  assets/main.js             renders content.js, theme toggle, nav
  assets/icons.js            SVG icons (brand marks from Simple Icons)
  assets/fonts/              Instrument Sans, self-hosted (SIL OFL 1.1)
  assets/favicon.svg
wrangler.jsonc               Cloudflare Workers config (serves public/ on staxhe.com)
package.json                 `npm run dev` (local server only, not part of the site)
scripts/dev-server.js        zero-dependency dev server with auto-reload
```

## Editing content

Everything the page says comes from `window.SITE` in `public/content.js`: name, tagline, about, projects, the "Now" list and links.

- **Placeholder copy.** Sections with `placeholder: true` show a dashed "placeholder" tag next to their heading. Delete that line once the copy is real.
- **Project buttons.** A button with `url: ""` shows as a dashed, non-clickable button with a "Soon" tag. Add the URL and it becomes a real link. Set `options.showUnavailableButtons: false` to hide them instead.
- **Project status.** One of `concept`, `development`, `release-prep`, `beta`, `live`, `paused`. The badge's three-step track fills from development to live. Only use `live` once the app is actually out.
- **Project art.** Set `image: "assets/img/dopagate.webp"` and `imageAlt: "..."` to replace the neutral placeholder block. A 16:10 image around 1200×750 works best.
- **Search and social previews.** `<title>` and the `<meta>` description/Open Graph tags in `public/index.html` are static because crawlers don't run JavaScript. Update them by hand if the name or tagline changes.

### Adding a link

Add one line to `links` in `public/content.js`:

```js
{ label: "Twitch", url: "https://www.twitch.tv/yourname", icon: "twitch" },
```

The grey line under the label is generated from the URL (`twitch.tv/yourname`). Use `note: "..."` to write your own.

Built-in icon names: `youtube`, `github`, `x`, `instagram`, `discord`, `email`, `googleplay`, `appstore`, `tiktok`, `twitch`, `bluesky`, `threads`, `mastodon`, `reddit`, `telegram`, `kofi`, `patreon`, `itchdotio`, `steam`, `link`. For anything else, copy the path data from the icon's SVG on [simpleicons.org](https://simpleicons.org) and paste it as the `icon` value, or add it to `public/assets/icons.js`. Unknown names fall back to a generic link icon.

Profile links get `rel="me"`, which lets Mastodon and similar services verify that the site is yours.

## Design notes

### Font pairing

- **Instrument Sans** (one self-hosted variable font, ~55 KB, Latin subset) for everything readable. It has a weight axis (400–700) and a width axis (75–100%). Body text uses the normal width. The wordmark and headings use a narrower width (`font-stretch: 80%` and `88%`) with tight letter-spacing, so the name carries the identity without a logo.
- **System monospace** (`ui-monospace`, SF Mono, Cascadia Mono, Menlo, Consolas) for small labels: status badges, tags, the "Now" labels, link URLs and the footer. It costs nothing to load and reads as "developer" without a second webfont.

To change the sans font, replace `public/assets/fonts/instrument-sans-variable.woff2`, update the `@font-face` block at the top of `public/assets/styles.css`, and change the first name in `--font-sans`. If the new font has no width axis, remove the `font-stretch` lines (or leave them; they are ignored).

### Accent color

One accent: **honey amber**, `#F2B544`. It nods to XP bars and progress loops, stays warm and calm, and avoids the usual blue and purple developer palette. The neutrals are tinted slightly warm to match.

| Token | Dark (default) | Light | Used for |
| --- | --- | --- | --- |
| `--accent` | `#F2B544` | `#F2B544` | button fill, text selection |
| `--accent-ink` | `#F2B544` | `#8A5800` | accent as text or thin lines: status track, "Now" labels, focus ring |
| `--on-accent` | `#17130A` | `#17130A` | text on amber buttons |

Contrast checks (WCAG AA needs 4.5:1 for text): amber on the dark background is 10.5:1, dark text on amber buttons is 10.1:1, and the darker light-theme amber is 5.6:1 on the light background. Muted grey text is at least 6.5:1 in both themes.

To change the accent, edit `--accent` and `--accent-ink` in both theme blocks at the top of `public/assets/styles.css`. In the light theme, keep `--accent-ink` dark enough for 4.5:1 against `--bg` (`#F7F6F3`).

### Themes, motion and materials

Interaction details follow Apple's interface guidelines (WWDC *Designing Fluid Interfaces* and *The Details of UI Typography*), adapted for a static page:

- **One spring for all motion.** A critically damped spring (no overshoot) is sampled into a CSS `linear()` curve as `--spring`. Durations are its settle times: `--dur-ui` (hovers, release) and `--dur-enter` (hero on load). Older browsers fall back to a cubic-bezier.
- **Instant press feedback.** Buttons, link cards and the theme toggle scale down on pointer-down (`--press`, `--press-lg`) and spring back on release. Taps have no double-tap delay.
- **Translucent nav.** The sticky bar is a blurred material that content scrolls under. Instead of a hard border, a soft fade appears under it only once content is behind it.
- **Size-specific tracking.** Letter-spacing tokens (`--track-display` to `--track-label`) tighten large type and open up small labels.
- **Theme switch.** Dark is the default. The toggle remembers the choice in `localStorage`, and colors ease over in 0.3s instead of flashing.
- **Accessibility settings.** `prefers-reduced-motion` swaps movement for plain fades and turns off press scaling. `prefers-reduced-transparency` makes the bar solid. `prefers-contrast: more` makes the bar solid with a visible edge and strengthens borders and grey text.

## Run locally

Needs Node 18 or newer. There are no dependencies, so there's nothing to install.

```sh
npm run dev                 # http://localhost:3000, reloads the page when you save a file
npm run dev -- --host       # also open it on your phone (same Wi-Fi), using the Network URL it prints
PORT=8080 npm run dev       # use a different port
```

If port 3000 is busy, it tries the next one. Any other static server works too, e.g. `python3 -m http.server`.

## Deploy

The site is served by Cloudflare Workers from `public/` (see `wrangler.jsonc`) on staxhe.com and www.staxhe.com. If the Cloudflare project is connected to this repo, pushing to `main` deploys it. Otherwise deploy by hand with `npx wrangler deploy`.

## Credits

- Instrument Sans by the Instrument Sans Project Authors, SIL Open Font License 1.1 (`public/assets/fonts/OFL.txt`).
- Brand icons from [Simple Icons](https://simpleicons.org), CC0 1.0. Brand marks remain trademarks of their owners.
- When DopaGate is live on Google Play, consider using Google's official "Get it on Google Play" badge; Google's brand guidelines prefer it over custom buttons.
