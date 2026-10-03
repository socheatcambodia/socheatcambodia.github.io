---
title: 'Ball Khmer football bot'
order: 4
status: 'Live'
period: 'Feb–Aug 2026'
numbers: '201 commits · 845 tests'
khmer: true
summary: 'A Telegram bot for Cambodian football fans with live scores, fixtures, a prediction game, match alerts and a paid VIP tier, in Khmer and English.'
highlights:
  - lead: 'Prediction game'
    text: 'with points, streaks, badges, a monthly leaderboard and referral codes.'
  - lead: 'Live alerts'
    text: 'every 60 seconds during matches, with no duplicates, and morning previews in each user’s language.'
  - lead: 'Prediction tracking.'
    text: 'Match predictions come from an outside ML service. The bot saves each one before kickoff and the result after, so accuracy can be measured honestly over time.'
hardest: 'When a data provider failed, the bot remembered “no matches today” and sent that wrong news to every user in the morning. Now it says the data is unavailable instead of guessing, and the audit caught two more timing bugs before release.'
tech: ['Python', 'python-telegram-bot', 'SQLAlchemy', 'SQLite', 'Redis', 'APScheduler']
---
