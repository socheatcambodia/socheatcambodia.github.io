---
title: 'K+ crypto trading platform'
order: 2
status: 'Live, real money'
period: 'Mar–Sep 2026'
numbers: '480 commits · ~111k lines · ~4,000 tests'
summary: 'Three services that stream live order data from four crypto exchanges (Binance, Bybit, OKX, Hyperliquid), score it with a rule engine, and place real trades on Bybit. A demo copy runs the same code, so every change is tested on demo before it goes live.'
highlights:
  - lead: 'Data collector'
    text: 'for 7 live exchange feeds and 6 coins, updated every 5 seconds and served over a signed private API.'
  - lead: 'Signal engine'
    text: 'that checks every trade idea against a chain of rules. Restructured from one 3,858-line file into six packages, with parity tests checking that its decisions stayed identical.'
  - lead: 'Trade executor'
    text: 'with safety first: every entry is followed straight away by its stop-loss, with a market close as the planned response if the stop is rejected, plus a kill switch and checks against the exchange every 30 seconds.'
  - lead: 'A/B test harness'
    text: 'that pairs demo and live trades and compares them with a proper statistical test.'
hardest: 'The data collectors were silently dropping trades. Five of seven feeds kept only the last trade in each batch from the exchange. I had counters added first to measure it: **65–81% of trading volume** on two exchanges was being lost. After the fix, all older data was marked as pre-fix and kept out of any recalibration.'
tech: ['Python (asyncio)', 'WebSockets', 'FastAPI', 'SQLite', 'pandas', 'Bybit API', 'PM2', 'cron', 'Telegram alerts']
caseTech: ['Python (asyncio)', 'WebSockets', 'FastAPI', 'SQLite', 'pandas', 'Bybit API', 'HMAC-SHA256 request signing', 'AES-256 key encryption', 'pytest, golden files and mutation testing', 'PM2', 'cron', 'Telegram alerts']
---

**On this page:** [How I build it](#how-i-build-it-three-ai-roles) · [How it works](#how-it-works) · [Safety](#safety-built-into-the-executor) · [Testing changes](#how-changes-are-released-and-tested) · [What went wrong](#what-went-wrong-and-what-changed) · [Review record](#the-review-record) · [Where it stands](#where-it-stands)

## Why I built it

I trade crypto and teach it through The Knowledge Plus. I wanted a system that reads real order data from the big exchanges, applies written rules, and places trades by itself, built by AI and controlled by me. It trades real money, so every change runs on a demo account first.

This page is about how it is built and kept safe. It shows no trading results, settings or strategy.

## How I build it: three AI roles

- **A Claude reviewer session** writes each change as a card and reviews it first.
- **A second Claude session builds it**, adds tests, and hands back an uncommitted diff with a report.
- **Codex audits** the card before the build and the diff after it. It can only answer PASS, PASS WITH CONDITIONS or FAIL, and its sandbox makes every repository read-only: a test write was refused. In the rules' own words, “the no-edit wall is technical, not procedural.”
- **I approve**, and I alone deploy, restart services and switch features on. The builder's settings block git push, server logins, process commands, downloads, sudo and reading secret files.
- Since September, Codex may also read the servers, read-only, and the reviewer session may push code when I delegate it. Deploys, restarts and switching features on stay with me.

The project's first rule: **“Agreement between AIs validates nothing.”** A code review shows the logic was built as intended. Only forward data from the demo account can show that a change actually works.

## How it works

<ol class="flow">
<li><span class="flow-who">Exchanges</span><div class="flow-body"><p><b>Collect.</b> Seven live feeds from four exchanges (Binance, Bybit, OKX, Hyperliquid), for six coins. Trades stream in over WebSockets, and open interest and funding rates are polled.</p></div></li>
<li><span class="flow-who">Collector</span><div class="flow-body"><p><b>Aggregate.</b> The combined picture is recalculated every 5 seconds and rolled into candles from 1 minute to 4 hours.</p></div></li>
<li><span class="flow-who">Private API</span><div class="flow-body"><p><b>Serve.</b> A read-only API on a private network only. Data requests must be signed with HMAC-SHA256, each consumer has its own key, and old requests are rejected. Only a health check and a metadata route are open. Answers come from memory, with no database read per request.</p></div></li>
<li><span class="flow-who">Signal engine</span><div class="flow-body"><p><b>Decide.</b> Every trade idea is scored and checked against a chain of yes/no rules, and failing any one rule blocks it. If the market data is missing or stale, the engine produces no signal rather than use old data.</p></div></li>
<li><span class="flow-who">Executor</span><div class="flow-body"><p><b>Trade.</b> Orders go to Bybit. A live copy and a demo copy run the same code, side by side.</p></div></li>
<li class="flow-me"><span class="flow-who">Me</span><div class="flow-body"><p><b>Watch.</b> Alerts reach me in Telegram, and a trade journal sends me weekly and monthly reports.</p></div></li>
</ol>

## Safety, built into the executor

- **Stop-loss first.** Every entry is followed straight away by its stop-loss, with no database writes in between. If the exchange rejects the stop, the code's planned response is to close the position at market. If that close also fails, the executor records it, stops itself and sends a critical alert. The design rule in the code: “No naked positions. Ever.”
- **Kill switch.** It first blocks new trades and writes the kill flag to the database, so that the stop can survive a restart. Then positions are closed, orders cancelled and the database re-synced.
- **Checks against the exchange.** At startup and every 30 seconds, the executor compares the exchange's open positions with its own records. A position it is not tracking that has no stop on the exchange is normally closed at market. A position recorded as unprotected gets another stop attempt first, and is closed at market if that fails too.
- **A double lock on real money.** The executor starts in demo mode by default. Real-money mode needs an explicit confirmation flag, and a bad configuration stops it from starting at all.
- **API keys.** Subscribers' exchange keys are encrypted at rest with AES-256 and an HMAC check, and never logged. Keys that allow withdrawals or transfers are refused.
- **Alerts that cannot crash the system.** The alert code never raises an error into the code that calls it, limits how long it can hold that code up (about 27 seconds at worst), scrubs known secret patterns from messages, and sends anyway if its duplicate filter is down: better a repeat than silence.
- **A trade journal.** Every closed trade becomes one row of 104 fields and an 11-section report. Weekly and monthly reviews follow, and the weekly sender refuses any destination except a private admin chat.

## How changes are released and tested

- **Two-step releases.** New behaviour first ships switched off, with defaults unchanged. A separate change switches it on, for the demo account only. Real money comes only after both a code review and a demo test.
- **Written down before the data is seen.** Nothing is tested without a row in a register: the decision rule and the success, kill and park criteria are frozen first. A “no” ends the idea: no re-fitting, no searching for better settings. Later registers are fingerprinted with SHA-256 and append-only, and a changed plan is a new registration, never a silent edit.
- **Past and future kept apart.** Replays of past data count as in-sample and carry no weight. The forward demo record is what decides, and one slice of history was deliberately left unread to keep a forward test clean.
- **A proper statistical comparison.** A comparator pairs live and demo trades by signal, labels each pair, and runs an exact McNemar test on the pairs that disagree. It reads outcomes only from trades the exchange confirmed. It opens the trading databases read-only and writes its results to a separate database of its own.

## What went wrong, and what changed

### Hardest problem: trades that silently disappeared

Five of the seven feeds kept only the last trade in each batch the exchange sent. A comment in the original code said why: “For simplicity in Phase 2, we process the last trade.” On two exchanges, 65–81% of trading volume never reached the system.

I had counters added first, logging only, and read 45 hours of them before changing anything. The fix shipped switched off, and golden files proved that with the switch off, the output stayed byte-identical to the old parser. Every data snapshot is now stamped with its parser version, and nothing is ever recalibrated against the older data.

### A safety limit that failed open, with 69 green tests

A limit on open exposure counted positions from memory. After a fresh restart with the database unreadable, the memory was empty, so the count read zero and the limit let trades through. “Although all 69 tests pass,” Codex wrote: the tests covered a restart and a database failure, but never both at once. Claude's own reviewer had passed it.

Now an unreadable count blocks instead, and fresh-start tests cover it. Codex passed the fix in round 2.

### Tests that tested a mock

The tests for invalid input replaced a helper's answer with a fake one, so the real crash on bad input never ran. Claude's report also claimed the test runs had not read the local secrets file. That was false: importing the configuration loads it. Codex noted that this did not show any secret had been displayed, but it did break the agreed test rule.

Codex overturned the earlier pass. The fix used real bad inputs with no fakes, proved the new tests fail without the fix, ran the tests in a clean room without the secrets file, and corrected the report on the record. Codex passed it the same day.

### The bug both AIs missed

In production, the executor starts as the main program, and a late import loaded a second copy of the same module with a client that was never connected. Every demo order through a new bridge failed. Under the test runner only one copy exists, so the tests passed. The record says two dual-AI review cycles missed it.

The fix tied the bridge to the running copy, with a regression test that reproduces the production launch. A follow-up check found a related risk that had never triggered: two kill-switch writes could land in the second copy, which the running loop never read. A shared state module then closed that whole class of bug.

### Protecting the live database

- An hourly job that reclaimed disk space starved the database of locks while live writes ran. It was switched off 3.5 hours after it went on.
- A backup run against the live database saturated the disk. The standing rule since: never run a backup, dump or vacuum on the live database.
- Now a separate nightly job reclaims space in small slices, with a lock so two jobs cannot overlap, and a breaker that stops it if live data starts going stale.
- A nightly copy is taken inside one read transaction and published with its exact size and SHA-256. The machine that pulls it checks both before swapping, and a failed pull leaves the old copy untouched.

### The big refactor

The signal engine started as one file of 3,858 lines. In five steps in May and June it was split into six packages. The first steps were pure moves of unchanged code. Later ones were checked by parity tests that run the same inputs through a frozen copy of the old code and require identical output.

The one loop the parity tests did not cover broke: a dropped variable made every write of a monitoring record fail, logged only at debug level, for 5 days. That variable fed only the monitoring record. It was restored, and that error now logs as a warning.

Later extractions use golden outputs frozen from the unchanged code, plus checks that the tests fail when the code is deliberately broken. Even so, Codex overturned one “byte-identical” extraction while all 25 golden checks were green: a settings lookup now ran early and could crash, and an error path had stopped logging.

## The review record

- 1,466 commits of review history between 20 July and 3 October, 59 cards, and 129 written Codex verdicts, all append-only.
- From late August to early October, 33 of 53 first-round reviews came back FAIL: 62%. Only 5 passed clean the first time.
- Codex blocked a deploy when a saved record that contradicted itself could reload and pass every check: “Passing suites and mutation results do not discharge the missing stop-consistency check.”
- It also caught a parity checker that reported 100% even on input built to fail.
- Mutation testing is routine. In one change, a battery of 312 deliberate bugs ran against the tests: 302 were caught, and the other 10 were declared.

## Where it stands

- Trading real money on Bybit, with the demo copy beside it for every change.
- 480 commits across three product repositories: about 111,000 lines of product code and 127,000 lines of tests, with about 4,000 test functions.
- The signal engine's suite is compared against a tracked list of known failures by test name, so a new failure cannot hide among them.

## What I would improve next

- Clear the list of known test failures, so the whole suite runs green.
- Fix the parity checker's known limit before it is used again.
