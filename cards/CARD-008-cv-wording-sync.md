# CARD-008: CV PDF matches the site

**Date:** 2026-10-07
**Status:** BUILT AND CHECKED
**Build authorization:** operator, 2026-10-07 ("Yes fix it")
**Review depth:** none (`AGENTS.md` §2: every new sentence is copied word for word from site text that
already passed a Codex audit in CARD-004, CARD-005 or CARD-006; no new claims)

## 1. Goal

The CV PDF still had wording that the case-study audits corrected on the site. Make the CV say what the
site says.

## 2. What changed in `public/Socheat-Chea-CV.pdf`

| Project | Before (CV) | After (same as the site) | Corrected in |
|---|---|---|---|
| K+ | Six modules, "with tests proving nothing changed" | Six packages, "with parity tests checking that its decisions stayed identical" | CARD-006 |
| K+ | "a stop-loss must be confirmed within 5 seconds or the position is closed", "constant checks" | Stop-loss straight after each entry, market close as the planned response if it is rejected, checks every 30 seconds | CARD-006 |
| K+ | "Five of six" | "Five of seven feeds" | CARD-006 |
| K+ | "marked unreliable and kept out of future decisions" | "marked as pre-fix and kept out of any recalibration" | CARD-006 |
| Salon | "launched in 5 weeks" | "live within six weeks" | CARD-004 |
| Ball Khmer | Live alerts "with no duplicates" | "sent when a score changes" | CARD-005 |
| Ball Khmer | "saves each one before kickoff and the result after" | "saves them before kickoff and records results after" | CARD-005 |
| Ball Khmer | "sent that wrong news to every user" | The 8 AM preview "could reach every user without its predictions" | CARD-005 |

Nothing else changed. The PDF is still 6 pages.

## 3. Evidence

| Check | Result |
|---|---|
| Every project text on the site (63 strings) found word for word in the CV source | 63 of 63 |
| Every text in `src/data/resume.ts` (98 strings) found in the CV source | 98 of 98 |
| Old phrases in the CV source ("5 weeks", "no duplicates", "wrong news", "within 5 seconds", "Five of six", "future decisions") | none left |
| New phrases in the rendered PDF text | present |
| `npm run verify` | passes |
