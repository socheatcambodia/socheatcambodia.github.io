# CARD-003: Case study page, LinkedIn content agent (Phase 2, first page)

**Date:** 2026-10-03
**Status:** APPROVED FOR LAUNCH. Codex round 1: FAIL (4 wording findings, fixed in §4b). Codex round 2: PASS, no remaining findings. Operator approved the wording on 2026-10-03 ("all looking good")
**Build authorization:** operator, 2026-10-03 ("Let's start with linkedin agent case study")
**Review depth:** post-build Codex audit (new page and new claims, `AGENTS.md` §2). At most 2 rounds.

## 1. Goal

A full page at `/work/linkedin-content-agent/` that tells the project's story for an AI Engineer reader:
the problem, how it works, how the AI is contained, what went wrong and what changed, the review
record, and where it stands. The home page links to it. The template works for the other four projects.

## 2. What changed

| File | Change |
|---|---|
| `src/content/work/linkedin-content-agent.md` | Case study text below the frontmatter, plus `caseTech`. The frontmatter summary is unchanged |
| `src/pages/work/[id].astro` | New: one page for each project file that has text below its frontmatter |
| `src/pages/index.astro` | "Read the case study →" under a project that has a page |
| `src/content.config.ts` | Optional `caseTech` field |
| `src/styles/global.css` | Case study, step diagram (`.flow`) and phone styles |

## 3. Sources for every claim

All sources are files or commits in the private `linkedin-agent` repository at `17ea50c` (21 Sep 2026).
Nothing is taken from memory.

| Claim on the page | Source |
|---|---|
| Helps companies train staff and set up AI; shares lessons with business leaders on LinkedIn | `HANDOFF.md` "Operator-approved writing direction" ("The operator helps companies train staff and set up AI for useful work"); `README.md` first paragraph |
| Two drafts every Sunday morning; approve, discard, change in Telegram | `docs/operations.md` "Normal workflow"; `README.md` |
| Two posts a week within Typefully's free monthly limit | commit "feat: two posts a week, within Typefully's free monthly limit" |
| Strict JSON format, fields validated | `docs/codex-subscription.md` data flow 3–4; `src/generate.py` `Draft`, `Card` (Pydantic) |
| Rules for invented scenes, promised results, selling, product names, format; card numbers must be in the post | `src/generate.py` module docstring, `INVENTED_SCENE`, `RESULT_CLAIMS`, `SELLING`, `validate_card()` ("every number on the card must also be in the post") |
| Failed draft goes back with the problems, up to three tries | `src/generate.py` `MAX_ATTEMPTS = 3` and docstring |
| Permanent ID, exact text/card/brief archived, rewrites are new versions | `README.md` Telegram section; `docs/codex-subscription.md` step 5 |
| Approval message shows who it is for and each number beside a possible source fact | `src/generate.py` docstring; commit "feat: enforce the operator's content rules, and show what each draft is for" |
| Approval queues exactly the shown text and card; receipt saved | `docs/operations.md` steps 4–5 |
| Read-only sandbox; no shell/web/plugin/multi-agent tools; keys and publishing credentials excluded; limits stop generation, no provider switch | `docs/codex-subscription.md` "Runtime" |
| Shares the server user, not a separate security boundary | `docs/codex-subscription.md` "Runtime" ("not an independent OS security boundary") |
| The invented 54-year-old admin manager, quoted, in the first cloud-generated draft (Sat 12 Sep); style guide read "unnamed" as permission; caught at approval; rule and two-way tests | commit `4188d1c` "fix: ban invented clients and scenes, and enforce it" |
| Telegram keeps a button tap ~150 seconds; three Approve taps lost on the first scheduled Sunday; two-hour listening window | commit `de6985e` "fix: the Telegram buttons never worked from the cloud" |
| Moved to one always-on server worker two days later | commit `3d0d05e` (15 Sep) "Move LinkedIn publishing workflow to the Codex server worker" |
| Duplicate reproduced in review 1; more paths in review 2; "two minutes" rule rejected in review 3; final rule by action (approve keeps a matching copy; discard/rewrite removes a queued copy; published/publishing left alone and reported; uncertain held until "checked") | `docs/codex/review.md` F7; `review-2.md` R1; `review-3.md` R3, R5; `src/cli.py` `_remote_copy`, `_reconcile`, `_checked` |
| Three reviews on 14 Sep, each "request changes" | `docs/codex/review*.md` verdict lines; commit dates |
| Review 1: 10 findings, 7 high priority (P1); the four listed | `docs/codex/review.md` findings table F1–F10 (F6, F8, F2, F4) |
| Tests 39 → 55 → 70 across the reviews; 100 by 21 Sep | `review.md` "39/39 passed"; `review-2.md` "55/55 passed"; `review-3.md` "70/70"; `HANDOFF.md` "100/100" |
| Two drafts rejected for a named place and weak business value; rewrites approved and scheduled | `HANDOFF.md` "Operator-approved writing direction" and "Latest verified state" |
| Usage ran out one Sunday; run stopped before saving or sending; manual recovery next day | `HANDOFF.md` "Recovery and changes completed" |
| Offline tests on GitHub, no model calls, no publishing secrets | `docs/operations.md` "Maintenance"; `docs/codex-subscription.md` "Checks" |
| Next: add approved posts as voice examples; receipts are not proof of publication | `HANDOFF.md` (approved v2 not yet in `config/examples.md`); `docs/codex-subscription.md` "Checks" |

Left out on purpose: the server address and user, file paths, process names, post IDs, recovery keys,
client briefs, Typefully account details and the operator's posting schedule.

## 4. Evidence

| Check | Result |
|---|---|
| `npm run verify` | 0 type errors, 55 tests pass, build OK, `check-site: OK. 3 pages` |
| Edge, 1280px light | Whole page read top to bottom; diagram, loop note and "Me" step render as intended |
| Edge, 390px | Diagram steps stack, label above text |
| Edge, dark | Home page shows "Read the case study →" |

## 4b. Codex round 1: FAIL (4 wording findings), all fixed

Privacy and template checks passed in round 1. Each finding was checked against its source before fixing.

| # | Finding | Verdict | Fix |
|---|---|---|---|
| 1 | Tests were 39 → 55 → 70 in the reviews; 100 came later | Real (`review-2.md` "55/55 passed") | "grew from 39 to 55 to 70 across the three reviews, and reached 100 by 21 September" |
| 2 | The invented manager was in the first cloud-generated draft (Sat 12 Sep), not a scheduled one | Real (commit `4188d1c` is dated Saturday) | "The first draft generated in the cloud" |
| 3 | Approval adopts a matching copy; discard/rewrite removes a queued one | Real (`src/cli.py` `_reconcile`) | The paragraph now describes each action, and still says uncertain outcomes are held |
| 4 | "Writing two useful posts a week takes hours" had no source | Real | Removed. The opening now uses `HANDOFF.md`'s description of the business |

## 5. Audit request (Codex), round 2

Read-only. Return PASS, PASS WITH CONDITIONS, or FAIL with file and line for each finding.

1. Confirm each fix in §4b closes its finding, against the same sources.
2. Check the one new sentence (the business description in "Why I built it") against §3.
3. Confirm nothing else on the page changed since round 1.

## 5a. Round 1 audit request (kept for the record)

Read-only. Return PASS, PASS WITH CONDITIONS, or FAIL with file and line for each finding.

1. **Claims:** check every sentence of the case study against the sources in §3 (the `linkedin-agent`
   repository, read-only). Report anything overstated, wrong, or not supported.
2. **Privacy:** nothing in §3's "left out" list, nothing private from the `linkedin-agent` repository, and
   `AGENTS.md` §3 still holds.
3. **Template:** `src/pages/work/[id].astro` and the home-page link: pages only for files with a body,
   correct links and anchors, nothing broken for the four projects without a case study yet.
