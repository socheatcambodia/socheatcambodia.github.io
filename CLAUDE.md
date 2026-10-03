# CLAUDE.md: builder notes

Claude is the builder. Read `AGENTS.md` first; every rule there applies. This file adds only what is
specific to building.

## Session start

1. `git pull`, then record the branch, the starting commit and whether the working tree is clean.
2. Read the open card in `cards/`. Build only from an authorized card.
3. If the working tree is dirty in a way you did not create, stop and report.

## Where things live

| To change | Edit |
|---|---|
| A project on the home page | `src/content/work/<project>.md` (one file per project, sorted by `order`) |
| Any other home-page text | `src/data/resume.ts` |
| Name, email, links, CV file name | `src/data/site.ts` |
| Look and layout | `src/styles/global.css`, `src/layouts/Base.astro`, `src/pages/index.astro` |
| Link-preview card or home-screen icon | `scripts/og/og.html`, `scripts/og/icon.html`, then `bash scripts/og/render.sh` (needs Edge on Windows) |
| The PDF CV | Replace `public/Socheat-Chea-CV.pdf` with the operator's approved PDF |

Text fields may use `**bold**`. Nothing else is converted.

## Before pushing

Every push runs `.githooks/pre-push`, which runs `npm run verify` and stops the push if anything fails.
GitHub runs the same checks, but only after the push, when the commit is already public. On a fresh
clone, turn the hook on once: `git config core.hooksPath .githooks`.

## Before reporting

Run `npm run verify` (type check, build, then `scripts/check-site.mjs`). Report its last line. A change
that adds text must also be checked by eye in light and dark mode at phone width (390px).

## Environment (checked 2026-10-03)

| Item | State |
|---|---|
| Node | 24 LTS via nvm. In a non-login shell, first run `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"`. `.nvmrc` pins the major version |
| Astro | 7.x, static output, fonts self-hosted with Fontsource |
| Preview | `npx astro build && npx astro preview` serves `dist/` on http://localhost:4321 |

## Writing for the operator

Socheat is a native Khmer speaker who reads English as a second language. Use plain words, short
sentences, and explain any technical term the first time it appears.
