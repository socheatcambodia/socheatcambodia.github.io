# CARD-009: Case study page, search memory for AI coding agents (RAG)

**Date:** 2026-10-11
**Status:** DONE; committed and pushed with the operator's OK. Codex round 1: PASS, no findings. The operator approved
the preview
**Build authorization:** operator, 2026-10-11 ("Can you put case study in my cv portfolio. Go")
**Review depth:** post-build Codex audit (a new page and new claims, `AGENTS.md` §2). The facts come from a case
study the operator approved on 2026-10-11, which Codex fact-checked in two rounds in the private `rag-memory`
repository (its CARD-007).

## 1. Goal

Add the RAG search memory to the portfolio: an entry on the home page, a case-study page at
`/work/rag-search-memory/`, and the same entry in the CV PDF.

## 2. What changed

| File | Change |
|---|---|
| `src/content/work/rag-search-memory.md` | New. The home-page entry, and the case-study page. The page text is the approved case study word for word, without its title, byline, sources list, project card and CV line. Only the typography changed: curly quotes and apostrophes, and the results table in the site's table markup (one card per row on phones) |
| The other five files in `src/content/work/` | `order` moved down by one: the new entry comes first |
| `src/pages/index.astro` | Heading "Five systems, all running today" → "Six systems, five of them live". The new entry works and is measured, but is not live yet |
| `public/Socheat-Chea-CV.pdf` | The same entry first, under the same new heading. Printed from the approved CV source with the same headless Edge as before. 7 pages (was 6) |

Unchanged, because each is still true: "five systems into production" in the introduction, "5 systems live in
production" in the numbers, and the site description.

## 3. Sources for every claim

The approved case study is `docs/CASE_STUDY.md` in `rag-memory` (private). Its own sources list maps each number
to a record, and Codex checked each one.

| Claim (home entry and CV) | Source in the case study |
|---|---|
| Status "Working, measured"; period Oct 2026 | Results; "One week: 2 to 9 October 2026"; "What comes next": the agent tool and daily use are still to come |
| 720 documents, 55 test questions, 458 tests | Summary; "How I measured it" item 1; "What the audits found" example 4 |
| The summary sentence | The project card |
| Measured on held-out questions: 7 of 9 in the top 5 section groups, target 8 | The project card |
| Five search methods; the router; the reranker chosen by a rule written before the first run | "What I built"; "How I measured it" item 3 |
| Local and private; pattern-based rules that can miss things | "What I built": Ingest, Store |
| Codex: 13 rounds over the six build cards, 11 FAIL, 2 PASS; each FAIL ended in a fix or a decision | "What the audits found" |
| Hardest problem: 79.3% to 86.2% with more text in each result; 77.8% on held-out questions, close to the untuned run but on different questions; one short of the target; "Without the sealed set, I would have reported 86.2%" | Results: the table and "The lesson" |
| Tech: Python 3.12, pytest | `rag-memory` `pyproject.toml` |
| Tech: PostgreSQL 16 + pgvector, bge-m3 on the CPU, BM25, weighted reciprocal rank fusion, bge-reranker-v2-m3 | "What I built" |

## 4. Privacy

- No phone number, IP address, home path, token, password, business name, bot username, member count or trading
  figure. "Position size" appears only as the name of a gap in the scrub rules, with no value.
- No link to the private repository.

## 5. Evidence

| Check | Result |
|---|---|
| `npm run verify` | `check-site: OK. 7 pages, links and anchors fine, 51 text files clean (incl. 11 private words).` (`astro check`: 0 errors) |
| The page text against the approved case study | 1,266 of 1,266 words identical, after undoing the curly quotes and the table markup |
| By eye at 390px, light and dark | The home entry, the case-study page and the results table: checked in headless Edge, inside a frame exactly 390px wide |
| CV PDF | Re-printing the old CV source gives the old PDF's exact text and size, so the method matches. The new PDF has the new entry and heading, and the old heading is gone. 7 pages |

## 6. For the operator's preview

1. The heading "Six systems, five of them live".
2. The new entry first, above K+.
3. The CV grows from 6 to 7 pages.

## 7. History

- Operator, 2026-10-11: "Can you put case study in my cv portfolio. Go".
- Codex post-build round 1, 2026-10-11: **PASS**, implementation accepted, safe for commit, no findings. It
  compared the page with the approved case study, the CV entry with the site entry, and the rest of the CV with the
  committed one (only the heading and the new entry changed; the research table's header now prints once, because
  the table no longer splits across pages). It scanned the PDF text for private words, and rendered both pages at
  390px in light and dark mode.
- Operator, 2026-10-11, after the preview: "codex sent and I have read and approved."
- Operator, 2026-10-11: "Commit and push now (Recommended)".
