# CARD-004: Case study page, salon loyalty bot (Phase 2, second page)

**Date:** 2026-10-03
**Status:** APPROVED FOR LAUNCH. Codex round 1: FAIL (4 findings, fixed in §4b). Codex round 2: PASS, no remaining findings. Operator decisions 2026-10-03: wording approved as is; keep the visit-identifier line; publish once the audit is done
**Build authorization:** operator, 2026-10-03 ("move to Salon Loyalty Bot case study")
**Review depth:** post-build Codex audit (new page, new claims, a client's live system; `AGENTS.md` §2).
At most 2 rounds.

## 1. Goal

A full page at `/work/salon-loyalty-bot/` in the same template as `CARD-003`. This project runs a real
client's live system, so privacy matters more here than on any other page.

## 2. What changed

Only `src/content/work/salon-loyalty-bot.md`: the case study text below the frontmatter, plus
`caseTech`. The frontmatter summary is unchanged. No template or style change.

## 3. Sources for every claim

All sources are files or commits in the private `salon-loyalty-bot` repository at `e2fc6ae`
(28 Sep 2026). Nothing is taken from memory.

| Claim on the page | Source |
|---|---|
| Wanted returning customers recognised; paper cards get lost, are easy to forge, tell the salon nothing; customers already on Telegram | `docs/PRODUCT_BRIEF.md` §1 |
| Owner owns business rules and Khmer; operator owns secrets, data, backups, deployment, live-points activation; Claude builds one approved card; Codex returns one of three verdicts | `README.md` "Who decides what" |
| Commit, push, deployment and live points are four separate human decisions | `README.md` "How a change happens" |
| /start, Khmer or English; Telegram ID is the identity; no second member | `README.md` "Phase one in one page" |
| My Points shows balance, progress and a QR code | `coordination/SESSION_HANDOFF.md` 2026-09-28 (layout); `CARD-050` |
| Staff scan with an ordinary camera; Telegram opens the bot with the member chosen; replaced ten digits read aloud | `cards/CARD-050*.md` lines 1, 33, 43–45, 68–70 |
| Eligible amount in USD even when paid in KHR; preview before any points are awarded; preview shows the new balance | `README.md` "Phase one"; `docs/PRODUCT_BRIEF.md` §2 (admin) |
| Only staff on a server-checked list can award | commit "CARD-022: numeric-ID admin allowlist, checked server-side" |
| Customer notified; a failed notification does not undo the award | `docs/USER_FLOWS.md` lines 220, 238 |
| Redemption and correction start from the same scan | `cards/CARD-055*.md` title and status |
| App account: INSERT and SELECT only, not owner; trigger refuses UPDATE/DELETE for any role; TRUNCATE trigger; the quoted sentence | `docs/decisions/ADR-002-persistence-and-migrations.md` §2 |
| Corrections are new entries | `README.md` ("compensating corrections"); `CARD-035` |
| Balance derived, no cached balance | ADR-002 §5 |
| Integer tenths, always rounded down, never a float | commit `71b3fe2` (`OD-40`) |
| Proven on real PostgreSQL with two roles | commit "CARD-015: PostgreSQL test harness built — two-role privilege proof on real PG" |
| Migrations hand-written because autogenerate drops triggers | ADR-002 §6 |
| Owner writes or approves every Khmer string | `README.md` (owner owns Khmer wording); `OD-42` onwards |
| Unapproved Khmer is refused, not replaced by English | `README.md` build order item 2 (`CARD-009`) |
| A change that needs Khmer cannot be built without it | commits "OD-48: a card that needs Khmer ships its Khmer" and "OD-49 + OD-50: … the bundle becomes a build gate" |
| A customer could lose the way back after switching language; Change Language now in the menu after a switch | commit `113235a` (`CARD-033`) |
| Double award: pre-build review found a live path; attempt lived in memory; restart or second admin; durable attempt row written before the ledger write; one attempt per transaction reference | commit "CARD-036 remediated: … including a live double-award path"; `cards/CARD-038*.md` title, §1, `R1`, `uq_award_attempt_transaction_reference` |
| Codex's review planted bugs in disposable copies; M01 removed every QR, M07 made the scan change the join date; both passed 2,533 tests | `cards/CARD-050*.md` lines 1007–1016; commit `6bba76b` |
| Close the family: zero balance and self target | commit `c6651e4` |
| Drills 77 of 77 and 34 of 34 | `coordination/SESSION_HANDOFF.md` 2026-09-25 and 2026-09-28 |
| One card, four review rounds, defects only in evidence formatting; review rules changed | commit `71b3fe2` (`OD-39`), referring to `CARD-010` |
| Pre-build review only for ledger, authorization, privacy, migration, release; one fix and one re-check, then the operator | commit `71b3fe2`; `README.md` "How a change happens" |
| Confirmed live by 23 Sep (the start date is recorded as unknown); first commit 16 Aug; so live within six weeks | `OD-119` (`coordination/OPERATOR_DECISIONS.md`, dated 2026-09-23, "The start date was not stated. It is recorded as `UNKNOWN`"); `git log` |
| Messages with a promotions opt-out; staff sales record separate from points; My Points layout asked for and approved by the owner, no word changed | `SESSION_HANDOFF.md` 2026-09-24 (`CARD-060`, `promotions_opt_out_at`), 2026-09-25 (`CARD-061`, "A sale never touches points"), 2026-09-28 (`CARD-062`, `OD-136`) |
| 4,124 tests pass; also on GitHub | `SESSION_HANDOFF.md` 2026-09-28; `.github/workflows/suite.yml` |
| Nightly backup copied off the server; restore rehearsal matched production row for row | commit "CARD-059: the nightly backup and the off-box copy"; `SESSION_HANDOFF.md` 2026-09-24 intro |
| Next: visit identifier needs schema and the owner's decision; rehearsal on the newest schema | `SESSION_HANDOFF.md` 2026-09-24 §5 item 1; 2026-09-28 §2 item 2 |

**Left out on purpose:** the salon's name, the bot's username, the server address and user, process
names, file paths, member counts, ledger totals, the earning rate, the reward catalogue and prices, the
number of staff accounts, the owner's name, operational issues from the handoffs, and names of scratch
databases.

**Operator approval (2026-10-03):** the "visit identifier" line describes a known gap in a client's live
system, in general terms. The operator chose to keep it.

## 4. Evidence

| Check | Result |
|---|---|
| `npm run verify` | 0 type errors, 55 tests pass, build OK, `check-site: OK. 4 pages` (salon name and bot username are on the private word list) |

## 4b. Codex round 1: FAIL (4 findings), all fixed

Each finding was checked against its source before fixing.

| # | Finding | Verdict | Fix |
|---|---|---|---|
| 1 | The launch date is recorded as unknown; "since 23 September" and "about five weeks" are unsupported | Real (`OD-119`) | "Confirmed live with customers by 23 September 2026, less than six weeks after the first commit"; metadata "live within six weeks" |
| 2 | The planted bugs ran in disposable copies, not on real customers | Real (`CARD-050` post-build round 1) | "in disposable copies of the new code"; "made the scan quietly change the customer's join date" |
| 3 | The award attempt is saved before the preview, so "before anything is written" is wrong | Real (`award_attempt.open_attempt`) | "before any points are awarded" |
| 4 | This public card named an operational issue it had left out of the page | Real | The "left out" list now names categories only |

The visit-identifier condition is met by the operator's decision recorded in the status line.

## 5. Audit request (Codex), round 2

Read-only. Return PASS, PASS WITH CONDITIONS, or FAIL with file and line for each finding.

1. Confirm each fix in §4b closes its finding, against the same sources.
2. Confirm nothing else on the page or the card changed since round 1, and that the card itself discloses
   nothing operational about the client's system.

## 5a. Round 1 audit request (kept for the record)

Read-only. Return PASS, PASS WITH CONDITIONS, or FAIL with file and line for each finding.

1. **Claims:** check every sentence of the case study against the sources in §3 (the
   `salon-loyalty-bot` repository, read-only). Report anything overstated, wrong, or not supported,
   including dates, counts and who did what.
2. **Privacy:** nothing from §3's "left out" list, and nothing else that identifies the client or its
   customers. `AGENTS.md` §3 still holds.
3. **Page:** links and anchors work; nothing else on the site changed.
