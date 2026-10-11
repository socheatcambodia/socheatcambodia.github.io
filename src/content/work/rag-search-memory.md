---
title: 'Search memory for AI coding agents (RAG)'
order: 1
status: 'Working, measured'
period: 'Oct 2026'
numbers: '720 documents · 55 test questions · 458 tests'
summary: 'A private search engine over 720 of my own documents, so Claude Code and Codex find past decisions before they build. Five search methods, measured on 55 questions frozen before the engine’s search code.'
highlights:
  - lead: 'Measured on held-out questions.'
    text: 'On 9 English in-scope questions held out from tuning, the chosen method matched the answer key in its top 5 section groups for 7 of them (77.8%). The target was 8.'
  - lead: 'Five search methods'
    text: 'compared: meaning search, keyword search (BM25), the two merged by rank, a router that uses the merged list when a question names an ID, and a cross-encoder reranker, chosen by a rule written before the first run.'
  - lead: 'Local and private.'
    text: 'PostgreSQL with pgvector on my own PC; no cloud database and no outside embedding API. Before storage, pattern-based rules leave out files that look like credentials or customer records and blank out recognised secrets; they can miss things.'
  - lead: 'Audited at every step.'
    text: 'Codex audited each of the six build cards: 13 rounds, 11 FAIL and 2 PASS. Each FAIL ended in a fix or a decision I recorded.'
hardest: 'Tuning on the questions I report on made search look better than it is. Improving search raised the top-5 score on the 29 open questions from 79.3% to 86.2%, with more text in each result. On 9 questions held out from tuning it scored 77.8%: close to the untuned run, but on different questions, and one short of my target. Without the sealed set, I would have reported 86.2%.'
tech: ['Python', 'PostgreSQL + pgvector', 'bge-m3', 'BM25', 'bge-reranker-v2-m3', 'pytest']
caseTech: ['Python 3.12', 'PostgreSQL 16 + pgvector', 'bge-m3 embeddings on the CPU', 'BM25 keyword search', 'weighted reciprocal rank fusion', 'bge-reranker-v2-m3 cross-encoder', 'pytest and deliberate breaks', 'Claude Code (builder)', 'Codex (auditor)']
---

**Summary.** My AI coding agents start every session with no memory of earlier work. I built a private search
engine, a RAG memory, over 720 of our own documents, so they can find past decisions before they build. On 9
English questions held out during tuning, the chosen method returned a passage matching the answer key within its
top 5 results (sections of documents) for 7 of them (77.8%). My target was 8. An independent AI auditor re-ran the search evaluations and
reproduced the recorded results.

## The problem

I run five systems with AI coding agents. Our history lives in 720 documents in 12 local source folders, nine of
them Git repositories. They hold plans, decisions, audit verdicts and handoff notes. Each new agent session starts
without that history. Re-reading whole files is slow, and agents miss things. I wanted them to search our own record
first.

The scope is narrow: English, internal use, nothing customer-facing.

## What I built

- **Ingest.** Before anything is stored, files that look like credentials or customer records are left out.
  Recognised secret values, server addresses, account names, home paths and trading amounts are blanked out. The
  rules match patterns, so they can miss things. I accepted one known gap: a position size written as a plain
  number, with no label. The documents are then cut into 23,734 passages.
- **Store.** PostgreSQL 16 with pgvector, on my own PC. No cloud database and no outside embedding API.
- **Five search methods:**
  - *dense*: meaning search with bge-m3 vectors, computed on the CPU;
  - *keyword*: BM25 word scores, plus exact matches of document IDs;
  - *fusion*: the two lists merged by rank (weighted reciprocal rank fusion);
  - *id-route*: fusion when the question names an ID, dense otherwise;
  - *rerank*: a cross-encoder (bge-reranker-v2-m3) scores fusion’s top 20 again against the question.
- **Two finishing steps**, added after the first measurement. Passages found in the same section of a document are
  shown together as one result, a *section group*. When a question names an ID and no top result defines it, the
  section that defines it moves up, if search already found it.

## How I measured it

1. **Questions first.** Before the engine’s search code existed, we wrote 55 test questions. For each question the
   memory can answer (in scope), the answer key lists documents and quoted text that answer it. Questions it cannot
   answer (out of scope) have no listed answer. Claude wrote 50 and I wrote 5. Codex reviewed the key before it was
   frozen in Git. There are 40 open questions (30 in scope, 10 out of scope) and 15 sealed ones.
2. **A sealed set.** A random seed I chose split off the 15 sealed questions. They were kept outside the
   repository, with a second copy on another drive, and held out from all tuning. They were used once, after the
   method was chosen; the auditor’s later re-run reproduced that result. Claude wrote most of them before the
   split, so the seal is a rule about tuning, not a secret.
3. **A rule written before the run.** The default method is the one with the most top-5 hits. Rerank is slow, so
   it must lead by two.
4. **A strict hit.** A hit needs a document and quote listed in the frozen answer key, inside one of the top 5
   results. In the first run a result was one passage. In the tuned and sealed runs a result is a section group,
   which can hold several passages. The headline scores count English in-scope questions, with no project filter.
5. **A reader check.** Each list of results went to a fresh model with no tools. It had to answer from the
   passages or say “not found”.

## Results

<div class="table-wrap">
<table>
<thead><tr><th scope="col">The chosen method, rerank</th><th scope="col">Top-5 hits</th></tr></thead>
<tbody>
<tr><td data-label="The chosen method, rerank">First open run, before any tuning; one passage per result</td><td data-label="Top-5 hits">23 of 29 (79.3%)</td></tr>
<tr><td data-label="The chosen method, rerank">Open run after I improved search on those same questions (tuned); section groups</td><td data-label="Top-5 hits">25 of 29 (86.2%)</td></tr>
<tr><td data-label="The chosen method, rerank"><b>Sealed run: questions held out from tuning (honest); section groups</b></td><td data-label="Top-5 hits"><b>7 of 9 (77.8%); the target was 8 of 9</b></td></tr>
</tbody>
</table>
</div>

**The lesson.** The changes added two hits on the same 29 open questions (6.9 percentage points). But each result
became a section group, so the tuned results hold more text: a median of 2,182 tokens per open question against
1,965. The comparison does not hold the amount of text constant. The
sealed score, 7 of 9 (77.8%), is close to the first open run’s 23 of 29 (79.3%), but on different questions. On the
sealed questions, rerank scored 7 with the finishing steps and 7 without. Without the sealed set, I would have
reported the tuned 86.2%.

**Not found.** The reader said “not found” on all 10 open and all 4 sealed out-of-scope questions. It never said it
on a question where search had found a key answer: 0 of 25 open, 0 of 7 sealed.

**Speed.** In the recorded runs, the median time per question on my CPU was about 17 to 20 seconds for rerank and
under one second for each other method. Single questions took longer: up to 28 seconds for rerank. For agents that
look things up before they build, accuracy matters more.

**What it misses.** Three of my five questions, written broadly in my own words, got no top-5 result matching the
frozen answer key, for any method. The key may miss other correct passages, so these are misses under the scoring
rule. That is why the agents’ search tool will tell them to search with specific words, more than once.

## What the audits found

Codex, a second AI coding agent from another company, audited every work card, read-only. In 13 audit rounds over
six cards, 11 came back FAIL and 2 PASS. Each FAIL ended in a fix, or, once the review’s budget of one fix and one
re-check was used, in a decision that I recorded. Four examples:

1. **Private data.** Codex fed the scrubber made-up private details. It showed that the scrubber kept pieces of
   passwords, customer IDs, money amounts and addresses. Every blocking finding known at the time was fixed before
   the full index ran.
2. **Mixed models.** After an interrupted re-index with another model, search could compare a question with vectors
   from a different model, with no error. Now searches that use vectors refuse until one full index run with one
   model has finished.
3. **Writes into other repositories.** In made-up tests, result files could be led into a source repository: first
   through a symbolic link, then through a hard link (a second name for the same file), then through the record
   files. Each was closed in turn; the last one needed its own small card.
4. **Tests that prove nothing.** Codex changes the code on purpose and checks that a test fails. In one round, 13
   such breaks in search went unnoticed; all are caught now. Codex’s last implementation audit reproduced 453 tests
   and 114 caught breaks. After further test changes, Claude reported 458 tests and 118 caught breaks.

## How it was built

- **Roles.** Claude Code wrote the plans (“cards”), built the code and added the tests. Codex audited. I set the
  goal, authorized the cards and made the recorded decisions. Our rules require my approval for each push.
- **One week:** 2 to 9 October 2026.
- **Also:** predictions were written before each run, and every number is labelled tuned or honest.

## What comes next

Next is an MCP tool, `search_memory`, so that Claude Code and Codex can query the memory while they work: read-only,
and on my PC. Then a week of daily use. A later measurement needs a new sealed set; this one is spent.
