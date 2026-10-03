# CARD-005: Case study page, Ball Khmer football bot (Phase 2, third page)

**Date:** 2026-10-03
**Status:** APPROVED FOR LAUNCH by Claude's verdict (§4c). Codex round 1: FAIL (5, fixed in §4b). Codex round 2: FAIL (2, fixed in §4c). Operator rule: at most 2 Codex rounds; after a round-2 FAIL, Claude reviews, records a verdict and fixes. Operator approved the wording, including the corrected `hardest` line, on 2026-10-03 ("the text good")
**Build authorization:** operator, 2026-10-03 ("let's start with Ball Khmer Case Study")
**Review depth:** post-build Codex audit (new page and new claims; `AGENTS.md` §2). At most 2 rounds.

## 1. Goal

A full page at `/work/ball-khmer-bot/` in the same template as `CARD-003`, and a corrected one-line
"Hardest problem" on the home page.

## 2. What changed

| File | Change |
|---|---|
| `src/content/work/ball-khmer-bot.md` | Case study text below the frontmatter, plus `caseTech`. The `hardest` line is corrected (see below). After round 1, two home-page highlights were also corrected (see §4b) |

**The `hardest` correction.** The approved PDF line said the bot "remembered 'no matches today' and
sent that wrong news to every user in the morning". The sources show two separate cases: a fixtures
failure showed "No matches today" on screen for ten minutes, and a predictions failure at the 8 AM run
could send every user a preview without predictions. The new line states both. "Two more timing bugs"
is kept: it is supported (`CODEX_VERDICT_CACHE_1_POSTIMPL` finding 1 and `…POSTIMPL2` finding 1).

## 3. Sources for every claim

All sources are files or commits in the private `ball_khmer` repository at `d9d90a7` (17 Aug 2026).
Nothing is taken from memory.

| Claim on the page | Source |
|---|---|
| Khmer-first football bot in Telegram, English optional | repository description; `locales/km.json`, `locales/en.json` |
| 31 commits in Feb–Mar with no tests; 170 commits 3–17 Aug | `git log` by month (26 Feb, 5 Mar, 170 Aug); `cards/CARD_TEST_0.md` "no test infrastructure of any kind" |
| Three data sources: free API with fixtures, live scores and outside ML predictions; free source for form and tables; premium source with a configurable daily budget (100 by default), a 5-call reserve in its main client, and a built-in team-ID list that cuts down searches | `bot/services/bzzoiro.py`; `bot/services/football_data.py` (`KNOWN_AF_IDS`); `bot/services/api_football.py` lines 4, 18–29 |
| Main source's results cached only when the fetch proves complete | `cards/CARD_PAGE_1.md`, `CARD_FIXT_1.md`, `CARD_CACHE_1.md` (table of `cache.set` sites, all guarded after `CACHE_1`) |
| Language, leagues, teams; matches, live scores, tables, analysis | `bot/handlers/` (`start.py`, `matches.py`, `live.py`, `standings.py`, `analysis.py`) |
| 3 points exact, 1 point result; streaks, badges, monthly leaderboard, referral codes | `bot/handlers/predictions.py`, `achievements.py`, `start.py` |
| Followed teams checked every 60 s, alert sent on a score change, repeats filtered through the cache; 8 AM preview in each user's language on days when the full fixture list loads | `bot/handlers/myteams.py` `send_live_score_alerts`; `bot/services/scheduler.py` (`live_score_alerts`, `daily_preview_push`, incomplete-fixtures guard); `CARD_PUSH_1` |
| VIP paid by KHQR, approved by hand | `bot/handlers/settings.py` (payment-pending, `/grant` line 497); `bot/handlers/admin.py` `/grant` |
| "no test infrastructure of any kind"; asserted-by-test lines named a missing harness; first card built the harness | `cards/CARD_TEST_0.md` "Why this card exists"; commit `c2c5496` (3 Aug) |
| 845 tests on Python 3.12 (server) and 3.14 (development) on 17 Aug | `reports/IMPL_J2_2026-08-17.md` lines 49, 126–127 |
| 1,629 upstream errors (429/500/502) read as end of list; "No matches today" for ten minutes | `coordination/ROADMAP.md` lines 1240–1249; `cards/CARD_FIXT_1.md` lines 96–104 |
| 8 AM preview could render every match without predictions: "correct Khmer, wrong fact" | `cards/CARD_CACHE_1.md` "Reachability" |
| Provider ignored `page`; same 50 matches five times; 106 existed on the measured day | `cards/CARD_FIXT_1.md` "The evidence" |
| Says unavailable and waits (cooldown) instead of guessing | `CARD_FIXT_1`, `CARD_CACHE_1`; `reports/SESSION_HANDOFF_2026-08-17_*.md` ("suppressed by cooldown") |
| Codex caught two timing bugs in the fix, both about overlapping requests | `coordination/CODEX_VERDICT_CACHE_1_POSTIMPL_2026-08-16.md` finding 1; `…POSTIMPL2_2026-08-16.md` finding 1 |
| Payment QR loaded from a dead URL (404); now served from a file in the bot | `cards/CARD_KHQR_1.md` "Card text" and "The evidence" |
| On an unreadable file, 3.12 raised and 3.14 reported missing; server runs 3.12 | `reports/IMPL_KHQR_1_2026-08-11.md` line 423 and §7.1 |
| "Manchester City" entry carried Liverpool's ID; 7 wrong rows repaired in production after a rehearsal | `cards/CARD_ALERT_1A.md` title and lines 22–42; `reports/REHEARSAL_ALERT_1A_MIGRATION_2026-08-09.md`; commit "CARD_ALERT_1A DEPLOYED AND MIGRATED — 7 rows repaired in production" |
| In-house model not buildable: results only held in temporary caches (minutes to days), real-score columns never written, predictions table holds user guesses | `cards/CARD_PRED_1.md` "Why this card exists instead of the model" |
| A growing record of results; model predictions saved before kickoff when available; only pre-kickoff predictions count in a fair test; retrospective imports marked and excluded | `cards/CARD_PRED_1.md` "Urgency", item 1 and the model-prediction item; `bot/services/persistence.py` (forward capture vs `retrospective_backfill`) |
| Recorded since 5 Aug | commit "CARD_PRED_1 DEPLOYED" (5 Aug) |
| First card failed with 15 corrections, all upheld, split into smaller cards starting with the harness | `cards/CARD_ALERT_1A.md` "Provenance" |
| 33 Codex verdict files, kept verbatim | `coordination/CODEX_VERDICT_*.md` (33 files); verdict headers ("Verbatim") |
| 17 Aug: online, unstable 0, live scores every 60 s through the previous evening | `reports/SESSION_HANDOFF_2026-08-17_*.md` "The §A8 check" |
| Next: no retry with backoff yet | `coordination/ROADMAP.md` line 1279 |

**Left out on purpose:** the server address, user and paths, process names, machine names, user and
subscriber counts, the VIP price, bank account details, data-provider account details and the quota
numbers used in production.

## 4. Evidence

| Check | Result |
|---|---|
| `npm run verify` | 0 type errors, 55 tests pass, build OK, `check-site: OK. 5 pages` |

## 4b. Codex round 1: FAIL (5 findings), all fixed

Privacy, links and the corrected `hardest` line passed in round 1. Each finding was checked against the
cited code before fixing.

| # | Finding | Verdict | Fix |
|---|---|---|---|
| 1 | The 100-call budget is configurable; the 5-call reserve is in one client; `football_data._af_get` bypasses it and still searches | Real (`api_football.py:29`, `football_data.py:158`, `:271`) | "a small daily call budget, 100 by default, so its main client keeps 5 calls in reserve, and a built-in list of team IDs cuts down the calls spent on searches" |
| 2 | Alerts are checked every 60 s and sent on a score change; repeat filtering depends on Redis; the 8 AM preview is skipped on an incomplete fixture set | Real (`myteams.py` `send_live_score_alerts`; `scheduler.py` daily preview) | Step rewritten: checks every 60 s, alert on a score change, cache filters repeats, preview "on days when the full fixture list loads" |
| 3 | Capture is not exhaustive; retrospective imports exist and are excluded from forward evaluation | Real (`persistence.py` docstring) | "a growing record … when they are available"; imported-after-the-fact predictions are "marked and kept out of any fair test" |
| 4 | Results were cached for minutes to days, not "minutes" | Real (`CARD_PRED_1.md` line 22) | "only held in temporary caches, for minutes to days, and then dropped" |
| 5 | "Most football apps do not speak Khmer" and "bring them back" are unsupported | Real | Rewritten as motivation ("I wanted them to have…") and design goal ("are there to bring them back") |

**Applied for consistency (not flagged):** the home-page highlights repeated findings 2 and 3 ("with no
duplicates", "saves each one before kickoff"). They now read "checked every 60 seconds during matches and
sent when a score changes" and "saves them before kickoff and records results after".

## 4c. Codex round 2: FAIL (2 findings) and Claude's verdict

Round 2 confirmed every §4b page fix and both home-page highlights, and that nothing else changed.

| # | Finding | Verdict | Fix |
|---|---|---|---|
| 1 | "A prediction cannot be captured after a match starts" is too broad: retrospective imports exist; the rule binds forward evaluation | **Real** (`persistence.py` docstring) | "Only predictions saved before kickoff can be used in a fair test of the model, so every day without this was fair test data lost for good." |
| 2 | This card's §3 rows still stated the round-1 claims | **Real.** The card is public too | The four affected rows now match the corrected page |

**Verdict: safe to launch.** Both findings are wording on the page and in this card. No privacy issue was
found in either round, and the checker passes. No round 3.

## 5. Audit request (Codex), round 2

Read-only. Return PASS, PASS WITH CONDITIONS, or FAIL with file and line for each finding.

1. Confirm each fix in §4b closes its finding, against the same sources, including the two home-page
   highlight changes.
2. Confirm nothing else on the page changed since round 1.

## 5a. Round 1 audit request (kept for the record)

Read-only. Return PASS, PASS WITH CONDITIONS, or FAIL with file and line for each finding.

1. **Claims:** check every sentence of the case study, and the corrected `hardest` line, against the
   sources in §3 (the `ball_khmer` repository, read-only). Report anything overstated, wrong or not
   supported, including dates, counts and who did what.
2. **Privacy:** nothing from §3's "left out" list. `AGENTS.md` §3 still holds. The public bot handle
   `@Ball_khmerbot` is allowed.
3. **Page:** links and anchors work; nothing else on the site changed.
