# CARD-007: Title "AI Builder"

**Date:** 2026-10-07
**Status:** BUILT AND CHECKED
**Build authorization:** operator, 2026-10-07 ("Let's make change for me also in my Pin post description")
**Review depth:** none (`AGENTS.md` §2: the change removes a claim and adds none, no new pages, nothing private)

## 1. Goal

Change the title under the name from "AI Engineer · AI Training & Business Automation" to **AI Builder**.

The site's own first paragraph says Claude Code writes the code. "AI Engineer" makes a reader expect hand-written
code and AI-powered products, which most of the five systems are not. "AI Builder" matches what the page shows.
The contact section still says "open to AI Engineer roles", so the job keyword stays on the page.

## 2. What changed

| Where | Before | After |
|---|---|---|
| Title under the name (`src/data/site.ts`) | AI Engineer · AI Training & Business Automation | AI Builder |
| Page description (`src/data/site.ts`) | …AI Engineer. Five production systems built by directing Claude Code and Codex in a builder–auditor review loop, plus… | …AI Builder. Five production systems shipped with AI coding agents: one AI builds, another audits, and I stay in charge. Plus… |
| Browser tab title, search-engine `jobTitle` (`src/layouts/Base.astro`) | AI Engineer | AI Builder |
| Link-preview image (`scripts/og/og.html` → `public/og.png`) | AI Engineer · AI Training & Business Automation; "…in a builder–auditor review loop." | AI Builder; "I ship production software by directing AI coding agents: Claude Code builds, Codex audits." |
| CV PDF (`public/Socheat-Chea-CV.pdf`) | Same title as the site | AI Builder. Only the title and the file's description changed |
| `README.md` | an AI Engineer | an AI Builder |

Sentences that had both "AI Builder" and "builder–auditor" were reworded, so "builder" does not mean two
things in one sentence.

## 3. Evidence

| Check | Result |
|---|---|
| `npm run verify` | 0 type errors, tests pass, build OK, `check-site: OK. 6 pages … 46 text files clean (incl. 11 private words)` |
| Built home page | `<title>Socheat Chea · AI Builder</title>`, role `AI Builder`, `jobTitle` `AI Builder` |
| 390px, light and dark | Title fits on one line under the name |
| `public/og.png` | Re-rendered; checked by eye |
| CV PDF | Same 6 pages; page 1 text reads "AI Builder"; the rest of the text is unchanged |
| Leftover "AI Engineer" | Only the contact line "open to AI Engineer roles" (kept on purpose) and past cards |

## 4. Outside this repository

The GitHub bio, the description of this repository (shown on the pinned card) and the profile README
(`socheatcambodia/socheatcambodia`) were changed to "AI Builder" at the same time. LinkedIn is updated by
the operator.
