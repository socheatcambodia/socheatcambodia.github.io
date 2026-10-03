# CARD-001: Launch the portfolio website (Phase 1)

**Date:** 2026-10-03
**Status:** APPROVED FOR LAUNCH by Claude's verdict (§6c). Codex round 1: FAIL (6, fixed). Codex round 2: FAIL (7, fixed). Operator rule: at most 2 Codex rounds; after a round-2 FAIL, Claude reviews, records a verdict and fixes
**Build authorization:** operator, 2026-10-03 ("go with your defaults")
**Starting commit:** none (new repository)
**Review depth:** post-build Codex audit (public content and privacy, `AGENTS.md` §2)

## 1. Goal

One public link that employers and business leaders can open, read on a phone, and use to contact me:
**https://socheatcambodia.github.io**. It goes on the GitHub profile (website field) and on LinkedIn
(Contact info and Featured).

## 2. Operator decisions (2026-10-03)

| Question | Decision |
|---|---|
| Hosting | GitHub Pages, free, from this public repository |
| Address | `socheatcambodia.github.io` now. A custom domain can be added later without other changes |
| Build tool | Astro (one markdown file per project) |
| Phone number | **Not** on the website. It stays only in the downloadable PDF |
| Contact | Email link + LinkedIn. No contact form |

## 3. Scope

In: a home page with the same text as the approved PDF portfolio (October 2026), the PDF as a download,
a link-preview image, a home-screen icon, a 404 page, light and dark mode, phone layout, automatic checks,
automatic deploy.

Out (later cards): one page per project (Phase 2), notes or write-ups (Phase 3), visitor analytics,
custom domain.

## 4. Must not change

- Wording, numbers and claims must match the approved PDF. Website-only text is limited to: the menu,
  buttons, the contact section, the 404 page, one sentence in "About the code" saying this repo is
  public, and the footer (name, "Updated October 2026", and a "Source code" link to this repo).
- Privacy rules in `AGENTS.md` §3.

## 5. Acceptance checks

1. `npm run verify` passes: 0 type errors, all checker tests pass, build succeeds, `check-site: OK`.
   The pre-push hook (`.githooks/pre-push`) runs it before every push.
2. `npm test` plants every kind of problem the checker looks for and each one is caught. Breaking any
   part of the checker makes at least one test fail.
3. The page reads correctly at 1280px and 390px, in light and dark mode, with no sideways scrolling.
4. The preview image is 1200×630 and shows the name, role and the four headline numbers.

## 6. Build report (Claude, 2026-10-03)

| Check | Result |
|---|---|
| `npm run verify` | 0 errors, 0 warnings. 2 pages built. `check-site: OK. 2 pages, links and anchors fine, 31 text files clean (incl. 5 private words).` |
| Negative test | A planted Cambodian phone number, a private-range IP address, a link to a missing `#anchor` and a denylist word gave **4 of 4** problems and exit code 1. Removing them gave exit 0 |
| Visual check | Edge headless at 1280px (light and dark) and inside a 390px frame (light and dark). Three issues found and fixed: the menu was stacked vertically, a full stop wrapped onto its own line, and the research table hid the Result column on phones (now one card per row) |
| PDF | `public/Socheat-Chea-CV.pdf` is byte-identical to the approved PDF (`cmp`) |
| Site size | 1.1 MB including the PDF (480 KB) and self-hosted fonts |

Text was moved from the approved PDF's HTML source into `src/data/resume.ts` and `src/content/work/*.md`.
The phone number was removed from the header and footer.

## 6b. Round 2: fixes for Codex round 1 (FAIL, 6 findings)

| # | Finding | Fix |
|---|---|---|
| 1 | Common phone formats passed (a local number with no spaces, with dots, or with the prefix in brackets) | Phone patterns now count digits in any grouping: a leading 0 plus 7–11 digits, or `+` and country code plus 7–12 digits. Digits after `U+` (font character ranges) are ignored |
| 2 | Single-quoted links ignored; full same-site URLs skipped | Both quote styles are read. Any `href`, `src` or `content` value that starts with the `site` from `astro.config.mjs` is checked as an internal link, including `canonical`, `og:url` and `og:image`. `/page` also resolves to `page.html` |
| 3 | `package-lock.json` and the checker itself were exempt | No exemptions. Every file is scanned unless it is binary (images, fonts, the PDF), so files without an extension such as `CNAME` or `LICENSE` are scanned too |
| 4 | CI never checked private words | The words live in the `PRIVATE_DENYLIST` repository secret. The workflow writes it to `.private-denylist` before the check, and the check **fails in CI** (`CI=true`) if no words were loaded |
| 5 | Home-folder paths in this card | Removed. New patterns catch Linux, Windows and `~/` home-folder paths, which also caught one in `CLAUDE.md` (fixed) |
| 6 | Footer credit outside §4 | Credit removed. The footer is now name, date and a "Source code" link, and §4 lists it |

The stronger link check also found a real bug: the 404 page's `og:url` pointed to `/404/`, which does not
exist. `og:url` is now left out on pages marked `noindex`.

**New evidence (2026-10-03):**

| Check | Result |
|---|---|
| `npm test` (`scripts/check-site.test.mjs`) | **35 of 35 pass.** Covers: 9 phone formats, IP, 4 home-folder path styles, token, password, private key, lock file and checker not exempt, `CNAME`/`LICENSE` scanned, PDF not scanned, private word caught without being printed, CI fails without the secret, 4 broken-link forms, 4 missing-anchor forms, broken same-site meta URLs, working links pass, page basics, and no false alarms on normal numbers, dates and font ranges |
| Mutation test (each part of the checker broken on purpose, one at a time) | **19 of 19 broken versions caught** by the tests. The first run caught 17 of 19, which led to the `855 …` test and the scan-every-non-binary-file change |
| `npm run verify` | 0 type errors, 35 tests pass, build succeeds, `check-site: OK` |

Planted test values are assembled at run time, so the test file contains no real-looking phone number,
IP address or path, and it is scanned like every other file.

## 6c. Round 2: Codex FAIL (7 findings) and Claude's verdict

Codex round 2 confirmed again: all 196 portfolio strings match the approved source, no private content is
in any file, `.private-denylist` is git-ignored, PRs cannot deploy, and checks run before upload. All 7
findings are gaps in the checker, not private data in the site.

| # | Finding | Verdict | Fix |
|---|---|---|---|
| 1 | Broken-link and image messages could print a private word into the public CI log | **Real.** CI logs of a public repo are public | Every message goes through `redact()`, which blanks private words and anything a privacy pattern matches. Privacy hits report `file:line` and the pattern name only |
| 2 | Tests called the function, never the real command; 4 command-line breakages went unnoticed | **Real** | 5 tests now run `node scripts/check-site.mjs` in a fake site: exit codes, `CI=true` with missing, empty and comment-only word lists, reading `.private-denylist`, never printing the word, and reading `site` from `astro.config.mjs` |
| 3 | Unquoted, JSON and YAML credentials passed | **Real** | One pattern now covers `KEY=value`, `key: value`, `"key": "value"` and quoted values. `${{ secrets.X }}` and `process.env.X` are not flagged (tested) |
| 4 | Unquoted attributes, spaces around `=`, `//host/` links, upper-case host and `site?x` passed | **Real but low risk** (Astro always writes quoted, lower-case links). Fixed anyway | Attributes are read in all three quoting styles with optional spaces. Same-site detection parses the URL, so scheme, letter case and `//host` forms all count |
| 5 | Any file ending in `.private-denylist` was skipped; UTF-16 text was treated as binary | **Real** | Only the one real word-list file at the repo root is skipped. UTF-16 text with a byte-order mark is decoded and scanned |
| 6 | macOS home paths passed | **Real** | New `/Users/<name>` pattern |
| 7 | A site with no pages passed | **Real** | The check fails if `dist/index.html` is missing |

**Root cause behind #1:** GitHub runs the checks after a push, when the commit is already public. The
local gate is now `.githooks/pre-push`, which runs `npm run verify` and stops the push on any failure.

**Evidence (2026-10-03):**

| Check | Result |
|---|---|
| `npm test` | **55 of 55 pass** (was 35) |
| Mutation test | **32 of 33 broken versions caught**, including all 4 of Codex's command-line breakages. The one survivor adds the matched text to privacy messages, and `redact()` still blanks it, so the output stays safe: two layers, one test-visible |
| `npm run verify` and `CI=true` simulation | 0 type errors, 55 tests pass, build OK, `check-site: OK` (35 text files, 5 private words), exit 0. No false alarms on the real repo from the wider patterns |

**Verdict: safe to launch.** Nothing private is in the files (confirmed by both Codex rounds and the
checker), and every round-2 gap is closed and tested. No round 3.

## 7. Audit request (Codex), round 2

Read-only. Return PASS, PASS WITH CONDITIONS, or FAIL with file and line for each finding.

1. **Round 1 findings:** confirm each fix in §6b closes its finding. Try to get past the checker again,
   for example by planting values in a copy of the repo outside it.
2. **Tests:** read `scripts/check-site.test.mjs`. Is any check in `scripts/check-site.mjs` untested, or
   could a test pass while the check is broken?
3. **Text match:** only §4's website-only text changed since round 1 (the footer). Confirm the footer and
   that no other text changed.
4. **Deploy workflow:** the new test step and private-word step. Can the secret's value be printed to the
   log, or can a missing secret still pass?

## 8. Operator launch steps (after the audit passes)

Git is initialised (branch `main`) with nothing committed. From the repository root. Pages and the
private-word secret must be set up before the first push, or the first run fails.

```bash
git add -A && git commit -m "Launch portfolio website (CARD-001)"
gh repo create socheatcambodia/socheatcambodia.github.io --public --source . --remote origin
gh secret set PRIVATE_DENYLIST < .private-denylist
gh api -X POST repos/socheatcambodia/socheatcambodia.github.io/pages -f build_type=workflow
git push -u origin main
gh run watch
```

If the `gh api` line fails, set **Settings → Pages → Source** to **GitHub Actions** instead.
