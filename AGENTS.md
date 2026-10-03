# AGENTS.md: rules for every AI agent in this repository

Applies to Codex (auditor), Claude (builder) and any other agent. `CLAUDE.md` adds builder-only notes.

## 1. What this repository is

Socheat Chea's public portfolio website, published at **https://socheatcambodia.github.io** with GitHub
Pages. It is an Astro static site: no server, no database, no forms, no tracking.

**This repository is public, and so is its whole Git history.** Anything committed is published,
even if it is deleted later.

## 2. Roles

| Who | Does |
|---|---|
| **Socheat (operator)** | Approves cards and wording, commits, pushes, changes repository settings |
| **Codex (auditor)** | Read-only. Reviews cards before build and changes after. Returns PASS, PASS WITH CONDITIONS, or FAIL |
| **Claude (builder)** | Builds only what an authorized card says, runs `npm run verify`, reports with evidence |

Loop: card → operator authorizes → Claude builds → Codex audits → operator commits and pushes →
GitHub Actions builds, checks and publishes.
Review depth matches risk. New claims, new pages and anything about privacy get a post-build audit.
Typo fixes do not.

## 3. Privacy (hard rules)

The site and the repo must never contain:

1. A phone number. The phone number appears only inside the downloadable PDF CV (`public/Socheat-Chea-CV.pdf`).
2. Server IP addresses, server usernames, home paths, hostnames, API keys, tokens or passwords.
3. The salon's business name, bot usernames (except the public `@Ball_khmerbot`), user or member
   counts, customer data.
4. Trading P&L, position sizes, account balances or trading thresholds.

`npm run check` scans for these patterns. Private words go in `.private-denylist` (git-ignored, one per
line), so the scan can look for them without publishing them.

## 4. Claims

- Every number and claim must match the approved PDF portfolio or a source the operator has approved.
- Do not claim ML models, profitability, prediction accuracy or results that were not measured.
- Code repositories other than this one are private. Never link to them.

## 5. Git

- Committing and pushing need the operator's authorization each time.
- Never force-push, rewrite history, or delete branches or tags.
