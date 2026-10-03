---
title: 'Salon loyalty bot'
order: 3
status: 'Live with customers'
period: 'Aug–Sep 2026'
periodNote: 'launched in 5 weeks'
numbers: '303 commits · 4,124 tests'
khmer: true
summary: 'A Telegram loyalty program that replaced paper stamp cards for a salon in Cambodia. Staff give points at the counter. Customers check their points, rewards and a personal QR code in Khmer or English.'
highlights:
  - lead: 'A points record that can’t be edited.'
    text: 'The database itself blocks changes and deletions, and corrections are added as new entries, like accounting.'
  - lead: 'A simple staff flow:'
    text: 'enter the amount, preview, confirm.'
  - lead: 'Khmer first.'
    text: 'All Khmer text is written and approved by the owner.'
  - lead: 'Tested hard.'
    text: 'Deliberate bugs are planted after each change to prove the tests catch them. The last two changes caught 77 of 77 and 34 of 34.'
tech: ['Python', 'aiogram', 'PostgreSQL', 'SQLAlchemy', 'Alembic', 'pytest', 'GitHub Actions']
---
