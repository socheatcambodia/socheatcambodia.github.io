# CARD-002: Light/dark switch

**Date:** 2026-10-03
**Status:** BUILT AND CHECKED
**Build authorization:** operator, 2026-10-03 ("can I turn it into light or dark background?")
**Review depth:** none (`AGENTS.md` §2: no new claims, no new pages, nothing private)

## 1. Goal

Visitors can switch the site between light and dark with one click.

## 2. What changed

- A sun/moon button in the menu. On phones it sits beside the name; on wider screens, after "CV (PDF)".
- First visit follows the device setting, as before. A click flips it and stores only the word `light` or
  `dark` in that browser (`localStorage`), so the choice holds on the next visit. Nothing is sent anywhere.
- A tiny script in `<head>` applies the saved choice before the page paints, so there is no flash.
- With scripts off, the button stays hidden and the site follows the device setting.
- Printing is always light, whatever the switch says.

Files: `src/layouts/Base.astro`, `src/styles/global.css`.

## 3. Evidence

| Check | Result |
|---|---|
| `npm run verify` | 0 type errors, 55 tests pass, build OK, `check-site: OK` |
| Edge, device in dark mode, nothing saved | Dark page, sun icon, label "Switch to light mode" |
| One click | Light page, `light` saved, moon icon, label "Switch to dark mode" |
| Reload with `light` saved, device still dark | Light page |
| Two clicks | Dark page, `dark` saved |
| 390px and 1280px | Menu fits; on phones the switch sits beside the name |
