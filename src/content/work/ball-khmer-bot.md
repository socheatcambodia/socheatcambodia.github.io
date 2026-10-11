---
title: 'Ball Khmer football bot'
order: 5
status: 'Live'
period: 'Feb–Aug 2026'
numbers: '201 commits · 845 tests'
khmer: true
summary: 'A Telegram bot for Cambodian football fans with live scores, fixtures, a prediction game, match alerts and a paid VIP tier, in Khmer and English.'
highlights:
  - lead: 'Prediction game'
    text: 'with points, streaks, badges, a monthly leaderboard and referral codes.'
  - lead: 'Live alerts'
    text: 'checked every 60 seconds during matches and sent when a score changes, and a morning preview in each user’s language.'
  - lead: 'Prediction tracking.'
    text: 'Match predictions come from an outside ML service. The bot saves them before kickoff and records results after, so accuracy can be measured honestly over time.'
hardest: 'When the data provider failed, the bot kept the empty answer, so a busy day could show “No matches today” and the 8 AM preview could reach every user without its predictions. Now it says the data is unavailable instead of guessing, and the audit caught two more timing bugs before release.'
tech: ['Python', 'python-telegram-bot', 'SQLAlchemy', 'SQLite', 'Redis', 'APScheduler']
caseTech: ['Python (tested on 3.12 and 3.14)', 'python-telegram-bot', 'SQLAlchemy', 'SQLite', 'Redis (cache)', 'APScheduler', 'pytest', 'PM2', 'Three football data APIs, one with an outside ML prediction model']
---

## Why I built it

Cambodian football fans follow the big European leagues, often late at night. I wanted them to have fixtures, live scores, match predictions and a prediction game in their own language, so this Telegram bot is Khmer first, with English as an option. You can try it in Telegram at [@Ball_khmerbot](https://t.me/Ball_khmerbot).

It is also the project where I shipped fast first and added discipline later:

- **February and March:** the bot was built and released in 31 commits, with no automated tests at all.
- **3 to 17 August:** 170 commits under the builder–auditor loop. Claude Code built each card, Codex reviewed it, and I deployed.

## How it works

<ol class="flow">
<li><span class="flow-who">Data</span><div class="flow-body"><p><b>Three sources.</b> A free sports API supplies fixtures, live scores and match predictions from an outside machine-learning model. A second free source adds team form and league tables. A premium source has a small daily call budget, 100 by default, so its main client keeps 5 calls in reserve, and a built-in list of team IDs cuts down the calls spent on searches.</p></div></li>
<li><span class="flow-who">Cache</span><div class="flow-body"><p><b>Keep answers, not failures.</b> Answers are cached for seconds to days, depending on how fast they change. Since August, results from the main source are cached only when the fetch can prove it is complete.</p></div></li>
<li><span class="flow-who">Fan</span><div class="flow-body"><p><b>Pick and browse.</b> The fan picks Khmer or English, favourite leagues and teams, then browses today’s matches, live scores, league tables and match analysis.</p></div></li>
<li><span class="flow-who">Fan</span><div class="flow-body"><p><b>Play.</b> Fans predict scores: 3 points for the exact score, 1 for the right result. Streaks, badges, a monthly leaderboard and referral codes are there to bring them back.</p></div></li>
<li><span class="flow-who">Bot</span><div class="flow-body"><p><b>Alert.</b> During matches, the bot checks followed teams every 60 seconds and sends an alert when a score changes, using the cache to filter out repeats. At 8 AM it sends each fan a match preview in their language, on days when the full fixture list loads.</p></div></li>
<li class="flow-me"><span class="flow-who">Me</span><div class="flow-body"><p><b>Approve VIP.</b> A paid VIP tier unlocks deeper analysis. Fans pay with a KHQR bank QR code, and I approve each payment by hand.</p></div></li>
</ol>

## What went wrong, and what changed

### Zero tests

When the review loop started on 3 August, Codex found that the project had “no test infrastructure of any kind”: no test file, and no test runner installed. Every “proven by a test” line in the first cards pointed at something that did not exist.

So the first card built the test harness and nothing else. Two weeks later, 845 tests passed on two Python versions: 3.12, which the server runs, and 3.14, used for development.

### “No matches today” on a day full of matches

The data provider failed often. One count of the logs found 1,629 errors: rate limits and server errors. The bot read each failure as the normal end of a list and cached whatever it had. A single error could make a busy day show “No matches today” for ten minutes. The same pattern in the predictions feed meant one error at the 8 AM run could send every fan a preview with no predictions: correct Khmer, wrong fact.

A second bug hid inside the first. The provider ignored the page number the bot sent, so the bot fetched the same 50 matches five times and never saw the rest. On the day this was measured, 106 matches existed.

Now a fetch from the main source must prove it is complete before it is cached. If it cannot, the bot says the data is unavailable and waits before asking again, instead of guessing. Codex’s reviews of that fix caught two more timing bugs in it, both about overlapping requests, before it shipped.

### A payment screen pointing at a dead link

The VIP payment QR code was loaded from a web address that had stopped working: it returned a 404 error. The fix serves the QR code from a file inside the bot.

Testing on both Python versions then caught one more bug. When the file could not be read, Python 3.12 crashed, while 3.14 only reported the file as missing. The bug was invisible on one version, and the server runs the one where it crashed.

### Following one club, getting another

Some entries in the team picker had the wrong ID: one “Manchester City” was really Liverpool. Seven saved follows pointed at the wrong club. The fix corrected the list and repaired the 7 records in production, after the repair was rehearsed on a copy first.

## Predictions: data before a model

I asked for our own prediction model. The investigation found it could not be built yet: the bot had never stored a single match result. Results were only held in temporary caches, for minutes to days, and then dropped. The columns meant for real scores had never been written, and the predictions table held fans’ guesses, not model output.

So the first step was data, not a model. The bot now keeps a growing record of match results, and saves the outside model’s predictions before kickoff when they are available. Only predictions saved before kickoff can be used in a fair test of the model, so every day without this was fair test data lost for good. Older predictions imported after the fact are stored too, but marked and kept out of any fair test of the model. Over time, this measures the outside model honestly and becomes the training data for our own.

## The review record

The first card of the sprint failed its review with 15 corrections, all upheld, and was split into smaller cards, starting with the test harness. Over the two weeks, Codex’s written verdicts fill 33 files, each kept word for word in the repository.

## Where it stands

- At the last recorded check, on 17 August, the bot was online with no unstable restarts, after streaming live scores every 60 seconds through the previous evening’s matches.
- 845 tests pass on both Python versions.
- Match results and model predictions have been recorded since 5 August.

## What I would improve next

- Retry with a growing delay when the data provider fails. Today the bot waits out a pause instead.
- Measure the outside model on the recorded results, and build our own only if it can do better.
