---
title: 'K+ crypto trading platform'
order: 1
status: 'Live, real money'
period: 'Mar–Sep 2026'
numbers: '480 commits · ~111k lines · ~4,000 tests'
summary: 'Three services that stream live order data from four crypto exchanges (Binance, Bybit, OKX, Hyperliquid), score it with a rule engine, and place real trades on Bybit. A demo copy runs the same code, so every change is tested on demo before it goes live.'
highlights:
  - lead: 'Data collector'
    text: 'for 7 live exchange feeds and 6 coins, updated every 5 seconds and served over a signed private API.'
  - lead: 'Signal engine'
    text: 'that checks every trade idea against a chain of rules. Restructured from one 3,858-line file into six modules, with tests proving nothing changed.'
  - lead: 'Trade executor'
    text: 'with safety first: a stop-loss must be confirmed within 5 seconds or the position is closed, plus a kill switch and constant checks against the exchange.'
  - lead: 'A/B test harness'
    text: 'that pairs demo and live trades and compares them with a proper statistical test.'
hardest: 'The data collectors were silently dropping trades. Five of six kept only the last trade in each batch from the exchange. I had counters added first to measure it: **65–81% of trading volume** on two exchanges was being lost. After the fix, all older data was marked unreliable and kept out of future decisions.'
tech: ['Python (asyncio)', 'WebSockets', 'FastAPI', 'SQLite', 'pandas', 'Bybit API', 'PM2', 'cron', 'Telegram alerts']
---
