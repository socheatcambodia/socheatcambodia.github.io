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
---
