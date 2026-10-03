# CARD-006: Case study page, K+ crypto trading platform (Phase 2, fourth page)

**Date:** 2026-10-03
**Status:** DONE. Codex round 2 PASS WITH CONDITIONS; the one condition is applied. The operator approved the facts list ("Approve as it's") before writing and the built page in preview ("All good with preview").
**Build authorization:** operator, 2026-10-03: one page; it trades real money; no profit or loss figures and no sensitive data; show the capability of building with AI, not trading results.
**Review depth:** post-build Codex audit, privacy first (a live real-money system; `AGENTS.md` §2). At most 2 rounds.

## 1. Goal

A full page at `/work/kplus-trading-platform/` in the `CARD-003` template, with an "On this page" menu, and
four corrections to the K+ block on the home page.

## 2. What changed

| File | Change |
|---|---|
| `src/content/work/kplus-trading-platform.md` | Case study text, `caseTech`, and four corrected home-page lines (below) |
| `AGENTS.md` | §3 item 4 says "profit or loss" instead of the abbreviation, so the tripwire below does not flag the rule itself |
| `.private-denylist` (git-ignored) and the `PRIVATE_DENYLIST` secret | Six trading tripwire words added, so any performance wording fails the build |

**Home-page corrections (from the research):** "Five of six" → "Five of seven feeds"; older data "kept out
of future decisions" → "kept out of any recalibration"; "a stop-loss must be confirmed within 5 seconds"
→ the actual mechanism (stop sent straight after entry; rejected stop → close at market); "tests proving
nothing changed" → "parity tests checking that its decisions stayed identical".

## 3. Sources for every claim

Repositories (all private, read-only): `kpaggregator` (AGG, head `1ba0054`), `kplus-trend-staging` (STG,
`f72f6fb`), `kp-execution-bot` (EX), `kplus-audit-context` (AC). Nothing is taken from memory or from the
skill files, which served as maps only.

| Claim | Source |
|---|---|
| Trades crypto and teaches through The Knowledge Plus | approved PDF "Experience" |
| Reviewer session drafts cards; builder session builds; Codex audits; operator deploys/restarts/flags | AC `.claude/skills/kplus/SKILL.md` lines 34–42, 57–70; `AI_WORKFLOW.md` 3–42; `contract/KP_IMPLEMENTATION_CONTRACT_V3_1.md` 8 |
| Three verdicts; sandbox makes repositories read-only; refused test write; "the no-edit wall is technical, not procedural" | AC `coordination/CODEX_REVIEW_RULES.md` 243–265, 497–521 |
| Builder settings deny push, ssh/scp/rsync, process manager, curl/wget, sudo, `.env` reads | `.claude/settings.json` in AGG, STG, EX (commits of 2026-06-29 and 2026-07-01) |
| Since September: Codex read-only server access; reviewer may push when delegated; deploy/restart/flags stay with operator | AC `CODEX_REVIEW_RULES.md` 381–433; `SKILL.md` 130–142 |
| "Agreement between AIs validates nothing"; only forward data validates behaviour | AC contract line 8; `AI_WORKFLOW.md` 46–49 |
| 4 exchanges, 7 feeds, 6 coins; WebSockets; OI and funding polled | AGG `collectors/registry.py` 15–23; `config.py` 58, 61–150 |
| Recalculated every 5 s; candles 1m–4h | AGG `config.py` 160; commit `aa7cf41` |
| Read-only API, private network; data requests signed with HMAC-SHA256, per-consumer keys, old timestamps rejected; only health and metadata routes open; in-memory answers | AGG `api/server.py` 1–12, 671–710 |
| Chain of yes/no rules, any failure blocks; no signal on missing/stale data | AC `onboarding/KPLUS_EXTERNAL_AI_BRIEF_V1.md` 48; AGG `AGG_RECLAIM_SAFESYNC_BLUEPRINT_V1.md` 89–94 |
| Live and demo copies run the same code | AC brief 58, 71; EX `ab_harness/comparator.py` 12–20 |
| Stop sent straight after entry, no DB writes between; planned response to a rejected stop is a market close (not guaranteed: logging runs before the close call); failed close → record, kill, critical alert; "No naked positions. Ever." | EX `kp_executor.py` 37–38, 1586–1696 |
| Kill blocks new trades first and writes the flag so it can survive a restart (the write is best-effort); close, cancel, re-sync | EX `kp_executor.py` 300–313, 3317–3420 |
| Startup and every 30 s comparison with exchange; an untracked position without a stop normally closed at market (one deferral case); a position recorded as unprotected gets a stop attempt, and a market close only if that attempt fails (success returns it to normal management) | EX `kp_executor.py` 5009–5012; `position_manager.py` 197–343 (reconcile), 345–496 (30 s check), 498–556 (recovery) |
| Demo by default; mainnet confirmation flag; bad config stops start | EX `exec_config.py` 48–50, 900–923 |
| Keys AES-256 + HMAC at rest, never logged; withdrawal/transfer keys refused | EX `exec_crypto.py` 29–41, 419; `exec_admin.py` 39, 199–213 |
| Alerts never raise; blocking capped at about 27 s; pattern-based secret scrubbing; send anyway if dedup is down | AGG `ops/tg_alert.py` 7–12, 96–123, 381, 480 |
| Journal: 104 fields per closed trade, 11-section report; weekly sender refuses non-admin destinations; monthly reviews | EX `kp_journal.py` 66–156; `kp_journal_report.py`; `kp_journal_weekly.py` 20, 130; `kp_journal_monthly.py` |
| Ship dark, then a separate demo-only switch; mainnet only after code read and demo test | STG commits `221faaa`→`17dc98a`, `e223219`→`e817416`; EX `KP_DEMO_AB_REGISTRATIONS_V1.md` 24–29 |
| Pre-registration rules; SHA-256 pinned, append-only, new registration for a changed plan | EX `KP_DEMO_AB_REGISTRATIONS_V1.md` 4, 11–18; AC `reports/P2_PREREGISTRATION_COHORT_B_2026-09-10.md` 3–8, 52 |
| Replays in-sample, forward demo decides; a slice of history left unread | AC `cards/CARD_STRUCTURE_SIDE_V2_FLOW_CAPTURE.md` 54; EX ledger 54 |
| Paired comparator, exact McNemar on discordant pairs, exchange-confirmed outcomes; reads trading DBs read-only, writes its own output DB | EX `ab_harness/comparator.py` 5–24, 46–48, 336–415, 503–512 |
| Five of seven feeds kept the last trade; the quoted comment; 65–81% on two exchanges | `git show 41ab3bf^:collectors/bybit.py` 93–95; AC `reports/A3_PARSER_BASELINE_2026-07-22.md` 252–282 (line 281) |
| Counters first, 45-hour baseline; fix switched off, golden files byte-identical; snapshots stamped; no recalibration on older data | AC A3 baseline 221–250; AGG commit `9c251f1`; `config.py` 722–747; `aggregator.py` 902–908 |
| Fail-open exposure limit; "Although all 69 tests pass"; restart and DB failure never combined; reviewer had passed it; fixed to block; round 2 PASS | AC `coordination/CODEX_VERDICT_VOL_EXTREME_PERMIT_DIFF_R1_2026-08-25.md` 27–42, 81–89; `…_R2_2026-08-25.md` 23–27; `cards/CARD_VOL_EXTREME_PERMIT.md` 143–160 |
| Mocked helper; false "no secrets file read" claim (file access shown, display of a secret not established; agreed test rule broken); earlier pass overturned; real inputs, failing-without-fix proof, clean room, report corrected; PASS same day | AC `coordination/CODEX_VERDICT_EQ_WIRING_DIFF_R1_2026-08-25.md` 7–28; `cards/CARD_EQ_WIRING.md` 260–290; `…_R2_…` 23 |
| Module loaded twice; bridge orders failed; pytest one copy; "two dual-AI review cycles missed it"; bridge tied to the running copy + regression test (`adf7635`); separate never-triggered kill-flag risk found in follow-up (`2f5f816`); shared state module closed the class (`0a95966`) | AC `cards/CARD_BRIDGE_EXEC_BINDING.md` 3–20, 103, 267; `CARD_RETIME_KILLFLAG_BINDING.md` 3–25; EX commits `adf7635`, `2f5f816`, `0a95966` |
| Hourly reclaim starved locks, off ~3.5 h later | AGG commits `6969d63`, `e6b40c3` (2026-06-26) |
| Live-DB backup saturated disk; never backup/dump/vacuum live | AGG `AGG_RECLAIM_SAFESYNC_BLUEPRINT_V1.md` 20–36; `CLAUDE.md` 12–14, 32 |
| Nightly sliced reclaim, lock, staleness breaker | AGG commits `69c3d2a`, `fdda4a0`, `b496277` |
| Nightly copy in one read transaction, size + SHA-256 manifest, verified before swap, failed pull leaves old copy | AGG commit `4b1efb9` |
| 3,858-line file; five steps May–June; six packages; pure moves then parity tests vs a frozen copy | `git show 821aa73^:kp_signal_brain.py` (3,858 lines); STG commits `821aa73`…`e72367b`; `tests/phase_a_parity_test.py` 1–5, 20–25; `tests/reference.py` 1–11 |
| Dropped variable, debug-level log, 5 days, fed only the monitoring record; restored; warning level | STG commit `79e0d97`; `kp_signal_brain.py` 1227, 2849 |
| Golden outputs plus deliberate-breakage controls; Codex overturned a byte-identical extraction with 25/25 goldens green | STG `tests/generate_legacy_geometry_goldens.py` 1–30; AC `cards/CARD_LEGACY_GEOMETRY_EXTRACT.md` 227–253; commit `7e2a793` |
| 1,466 commits 20 Jul–3 Oct; 59 cards; 129 Codex verdicts; append-only | AC `git log`; `cards/`; `coordination/` + `reports/` `CODEX_VERDICT_*`; `CODEX_REVIEW_RULES.md` 346–359 |
| 33 of 53 first-round FAIL (62%), 5 clean passes, late Aug–early Oct | AC first-round verdict files 2026-08-22…2026-10-03 (counted by file, verdict line read) |
| Deploy blocked; the quoted sentence | AC `coordination/CODEX_VERDICT_STRUCTURE_SIDE_CONSUME_PART_B_S7_R1_2026-09-20.md` 3; `cards/CARD_STRUCTURE_SIDE_CONSUME.md` 423–471 |
| Parity checker reported 100% on mismatched input | AC `coordination/CODEX_VERDICT_STRUCTURE_SIDE_SYMMETRY_PHASE2B_POSTIMPL_S7_R1_2026-09-16.md` 68–80 |
| Battery of 312: 302 caught, 10 declared | AC `cards/CARD_STRUCTURE_SIDE_SYMMETRY.md` line 498 |
| Trading real money with the demo copy beside it | operator, 2026-10-03 |
| 480 commits (142 + 237 + 101); 111,054 lines of product code, ~127,000 of tests; ~4,000 test functions | `git rev-list --count` per repo; `git ls-files '*.py'` line counts split by test paths; `def test_` counts (1,249 + 2,506 + 205) |
| Suite compared against a tracked known-failure list by test name | AC `cards/CARD_STRUCTURE_SIDE_SYMMETRY.md` 498; `reports/CODEX_VERDICT_AB_MEASURE_V8_DIFF_REVIEW_PASS_2026-08-19.md` 38 |
| Next: clear known failures; fix the parity checker's known limit | same two sources; AC phase-2b verdict 68–80 ("known limit 4") |

**Left out on purpose (categories only):** any trading result or performance figure, rule settings and
thresholds, the strategy itself, per-coin settings, signal or trade identifiers, internal incident reviews,
server, account and process details, chat names, and subscriber numbers.

## 4. Evidence

| Check | Result |
|---|---|
| `npm run verify` | 0 type errors, 55 tests pass, build OK, `check-site: OK. 6 pages` with 11 private words (5 earlier + 6 trading tripwires) |
| "On this page" anchors | all 7 resolve (validated by `check-site`) |

### 4b. Codex rounds

| Round | Verdict | Findings and fixes |
|---|---|---|
| 1 | FAIL (9) | 1 card named a dated incident review → now "internal incident reviews" · 2 stop-loss close stated as certain → "planned response" (page and home line) · 3 missing-stop checks too broad → untracked vs recorded-unprotected paths · 4 kill-flag restart survival → "so that the stop can survive a restart" · 5 alerts "never block" → capped at about 27 s · 6 "every request" signed → data requests; health and metadata routes open · 7 comparator database reversed → reads trading DBs read-only, writes its own · 8 "no secret was shown" → not established either way · 9 kill-flag risk shown as a production event → separated as a never-triggered follow-up finding; fix attribution corrected per commit |
| 2 | PASS WITH CONDITIONS (1 minor) | The other eight fixes confirmed; only the intended page lines changed. Condition: this card's recovery row now says the market close happens only if the stop attempt fails |

## 5. Audit request (Codex)

Read-only. Return PASS, PASS WITH CONDITIONS, or FAIL with file and line for each finding.

1. **Privacy first:** nothing from §3's "left out" list anywhere on the page, in the home-page K+ block or in
   this card. No number that reveals trading performance, size, settings or strategy. `AGENTS.md` §3 holds.
2. **Claims:** check every sentence of the case study and the four corrected home-page lines against the
   sources in §3. Report anything overstated, wrong or unsupported, including dates, counts, who did what,
   and absolute words (every, never, all, only).
3. **Page:** links and anchors work; nothing else on the site changed.
