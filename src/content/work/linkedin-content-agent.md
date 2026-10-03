---
title: 'LinkedIn content agent'
order: 2
status: 'Live, weekly'
period: 'Sep 2026'
periodNote: '10 days to launch'
numbers: '44 commits · 100 tests'
summary: 'An AI agent that drafts LinkedIn posts teaching Cambodian business leaders how to use AI in real work. It writes each post and its image, checks them, and sends them to me in Telegram. Nothing is published until I approve it. My LinkedIn posts about AI at work are drafted by this agent.'
highlights:
  - lead: 'Structured output.'
    text: 'The model must return a strict JSON format, and every answer is validated before use.'
  - lead: 'Automatic quality checks.'
    text: 'Rules catch made-up stories, promised results and sales language. A failed draft goes back to the model with the exact problems, up to three tries.'
  - lead: 'Facts with sources.'
    text: 'Every number in a post is matched against a list of sourced facts and shown to me before I approve.'
  - lead: 'Contained AI.'
    text: 'The model runs locked down, with no internet tools and no access to publishing passwords.'
tech: ['Python', 'Pydantic', 'Codex CLI (first version on the Claude API)', 'Telegram Bot API', 'SQLite', 'Typefully']
caseTech: ['Python', 'Pydantic (strict JSON schema)', 'Codex CLI, non-interactive with structured output', 'Telegram Bot API', 'SQLite (post library)', 'Pillow (card images)', 'Typefully API', 'PM2', 'GitHub Actions (offline tests)', 'First version: Claude API and GitHub Actions schedules']
---

## Why I built it

I help Cambodian companies train their staff and set up AI for useful work, and I share practical lessons with business leaders on LinkedIn. An AI model can draft those posts, but AI drafts go wrong in predictable ways: invented stories, promised results, sales talk, and numbers with no source.

So the rule was set on day one: **the AI drafts, I decide, and nothing reaches LinkedIn without my approval.**

**Who did what.** I set the audience, the writing rules and the list of sourced facts, and I approve every post. Claude Code built the agent. Codex reviewed it three times, and in production Codex is also the model that writes the drafts.

## How it works

<ol class="flow">
<li><span class="flow-who">Code</span><div class="flow-body"><p><b>Plan.</b> Every Sunday morning it picks the next two topics from a planned list. Two posts a week stays inside Typefully’s free monthly limit.</p></div></li>
<li><span class="flow-who">Codex</span><div class="flow-body"><p><b>Draft.</b> The model writes the post and the text for its image card. It must answer in a strict JSON format, and every field is validated before use.</p></div></li>
<li><span class="flow-who">Code</span><div class="flow-body"><p><b>Check.</b> Rules look for the known ways a post goes wrong: invented people or scenes, promised results, sales language, product names and format. Every number on the card must also appear in the post.</p><div class="flow-loop">A failed draft goes back to the model with the exact problems listed, up to three tries.</div></div></li>
<li><span class="flow-who">Code</span><div class="flow-body"><p><b>Archive.</b> The post gets a permanent ID. Its exact text, card image and brief are saved. A rewrite becomes a new version under the same ID.</p></div></li>
<li class="flow-me"><span class="flow-who">Me</span><div class="flow-body"><p><b>Review in Telegram.</b> I see the post, the card, who it is for, and each number beside the sourced fact it may come from. I approve, discard, or reply with a change.</p></div></li>
<li><span class="flow-who">Typefully</span><div class="flow-body"><p><b>Publish.</b> Approval queues exactly the text and card I saw, and the receipt is saved.</p></div></li>
</ol>

## Keeping the AI contained

- The model runs in a read-only sandbox with no shell, web, plugin or multi-agent tools.
- API keys and publishing passwords are removed from its environment. It can write a post. It cannot publish one.
- If the model’s usage limit is reached or its login expires, generation stops with a short error. It never switches to another provider or a paid API key by itself.
- One honest limit: the model shares the server’s user account, so these are restrictions on the tool, not a separate security wall.

## What went wrong, and what changed

### The manager who never existed

The first draft generated in the cloud opened like this:

> “the best AI user in one office I worked with was a 54-year-old admin manager who types with two fingers”

That person does not exist. The model invented him and put him in my voice. My style guide already banned claims about clients I cannot name, and the model read “unnamed” as permission. None of the format checks could see the problem, because an invented story looks exactly like a real one. I caught it at the approval step.

Now the guide forbids inventing a client, a person or a scene, and says what to write instead. A rule catches the pattern (“a client I worked with”) and leaves normal phrases alone (“clients I work with regularly”). Tests pin both directions.

### Approve buttons that disappeared

The first version ran on a schedule in GitHub Actions and checked Telegram from time to time. Telegram keeps a button tap for only about two and a half minutes, so all three Approve taps on the first scheduled Sunday were lost.

The first fix kept the agent listening for two hours after sending drafts. Two days later the whole agent moved to one always-on worker on my server, which listens all day.

### Hardest problem: never publish twice

When the agent asks Typefully to schedule a post, the post can be created while the reply is lost. Retry blindly and the post goes out twice. Give up and it may never go out.

Codex found this in its first review and reproduced a duplicate post with a simulated lost reply. The second review found decisions, like a rewrite or a discard, that still slipped past the check. The third rejected the rule “two minutes without a match means it never arrived”. Not finding a post proves nothing: its title can be edited, and nothing limits how long a new post takes to appear in the list.

The final rule: before any new decision on a post, the agent looks for an earlier attempt. If I approved, a matching copy is kept, so nothing is created twice. If I discarded the post or asked for a rewrite, a matching copy still waiting in the queue is removed first, so only my latest decision counts; a copy already publishing is left alone, and the agent tells me. Anything uncertain is held: no copy yet, several copies, an error, or a copy edited in Typefully. The agent changes nothing, tells me what it found, and waits until I look and reply “checked”.

That guarantee is narrower than “no duplicates, ever”, and it is the honest one. Attempts it can see are settled. Attempts it cannot see wait for a person.

## The review record

Codex reviewed the agent three times on 14 September. Each time the verdict was “request changes”. The first review alone had 10 findings, 7 of them high priority, including:

- an approval that was not tied to my own Telegram chat,
- a text change that could publish with the old card image,
- a statistical error in the list of facts,
- and validation “presented as stronger protection” than it really was.

That last finding changed how I describe the checks. They catch known patterns. They cannot tell whether a claim is true, so a person still approves every post. The offline tests grew from 39 to 55 to 70 across the three reviews, and reached 100 by 21 September.

## Where it stands

- Two drafts arrive in Telegram every Sunday morning. I approve, rewrite or discard each one, and every version, card and receipt is kept.
- In September I rejected two drafts for naming a real place and explaining the business value weakly. Their rewrites were approved and scheduled.
- When the model’s usage ran out one Sunday, the run stopped before saving or sending anything. A manual recovery the next day produced the drafts.
- 100 offline tests run on GitHub with no model calls and no publishing secrets.

## What I would improve next

- Add the newly approved posts to the examples the model learns the voice from.
- Track what happens after scheduling. A scheduling receipt is not proof that the post appeared on LinkedIn, so I still check that by hand.
