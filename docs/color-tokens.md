# Color Tokens

This project uses a small set of design tokens (CSS variables) to manage the color system.

## Tokens
- `--primary`: #03346E — Dark Blue / Navy (used for accents, borders, and subtle overlays)
- `--accent`: #4A4F55 — Graphite (used for surfaces like header, buttons, badges when global text is graphite)
- `--bg`: #F5F6F7 — Page background (very light graphite)
- `--text`: #181C14 — Global text color (graphite / near-black). All text across the site is set to this value.
- `--muted`: #6B6F73 — Muted text / secondary content
- `--card`: #FFFFFF — Card / surface background
- `--focus`: 3px solid rgba(3,52,110,0.12) — Focus ring using the navy tint

## Usage Guidelines
- Use `var(--text)` for all typographic content to keep a consistent baseline.
- Use `var(--primary)` for brand accents (icons, borders, subtle hover overlays).
- Use `var(--accent)` for dark surfaces where `var(--text)` should remain readable (header, primary buttons when text is graphite).
- For elements that sit on `var(--primary)` (the navy), avoid using `var(--text)` directly because contrast may be low. Use `var(--accent)` as the background or apply lighter tints of `--primary`.

## Example
```css
.btn.primary {
  background: var(--accent); /* graphite background */
  color: var(--text);
}

.header {
  background: var(--accent);
  color: var(--text);
}

.icon { fill: var(--primary); }
```

## Accessibility
- Keep an eye on contrast ratios when using `--text` on colored backgrounds. If a background is dark (navy), either switch to white text or use a lighter background surface.

If you'd like, I can add a small script that runs the color contrast checks and reports any low-contrast occurrences across your CSS files.