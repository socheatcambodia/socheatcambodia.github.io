---
title: 'Salon loyalty bot'
order: 4
status: 'Live with customers'
period: 'Aug–Sep 2026'
periodNote: 'live within six weeks'
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
caseTech: ['Python', 'aiogram (Telegram)', 'PostgreSQL (two database accounts, triggers)', 'SQLAlchemy', 'Alembic (migrations written by hand)', 'segno (QR codes)', 'pytest and planted-bug drills', 'GitHub Actions', 'PM2']
---

## Why I built it

A salon in Cambodia wanted returning customers to be recognised for coming back. Paper stamp cards get lost, are easy to forge, and tell the salon nothing. Nearly every customer already uses Telegram, so the program lives there: no app to install and no card to carry.

**Who decides what.** The salon owner owns every business rule, from how points are earned to what each reward is, and writes or approves every word of Khmer. I own the server, the data, the backups and every step that cannot be undone. Commit, push, deployment and switching points on are four separate decisions, and I make each one. Claude Code builds one approved card at a time. Codex reviews independently and can only return PASS, PASS WITH CONDITIONS or FAIL.

## How it works

<ol class="flow">
<li><span class="flow-who">Customer</span><div class="flow-body"><p><b>Join.</b> The customer sends /start in Telegram and picks Khmer or English. Their Telegram account is their membership, so joining twice cannot create a second member.</p></div></li>
<li><span class="flow-who">Customer</span><div class="flow-body"><p><b>Show the code.</b> My Points shows the balance, the progress to the next reward, and a personal QR code.</p></div></li>
<li><span class="flow-who">Staff</span><div class="flow-body"><p><b>Scan.</b> Staff point an ordinary phone camera at the code, and Telegram opens the bot with that customer already chosen. Before this, staff typed ten digits read aloud by the customer.</p></div></li>
<li><span class="flow-who">Staff</span><div class="flow-body"><p><b>Enter and preview.</b> Staff enter the eligible amount in US dollars, even when the customer paid in riel, and see the points and the new balance before any points are awarded.</p></div></li>
<li><span class="flow-who">Database</span><div class="flow-body"><p><b>Record.</b> Confirming adds one entry to the points record. Only staff on a list checked by the server can do this, and the entry can never be changed or deleted.</p></div></li>
<li><span class="flow-who">Customer</span><div class="flow-body"><p><b>Notified.</b> The customer gets a message about the points. If that message fails, the points still stand.</p></div></li>
</ol>

Redemptions and corrections start from the same scan and use the same preview and confirm steps.

## A points record that cannot be edited

Points are worth something to the customer, so the record works like an accounting ledger.

- **Two layers of protection in the database.** The bot's own database account can add entries and read them, but it cannot change, delete or empty the table, and it does not own the table. A database trigger also refuses any change or deletion, from any account, including the more powerful one used for upgrades. In the design's words: “privilege stops the application role; the trigger stops the privileged role.”
- **Mistakes are fixed with a new entry.** A correction is added as its own entry, like in accounting, and the original stays.
- **The balance is always calculated from the record.** There is no stored balance that could drift out of step.
- **No floating-point numbers.** Points are counted in whole tenths and always rounded down.
- **Tested on the real thing.** These rules are proven on a real PostgreSQL database with two separate accounts, and every database upgrade script is written by hand, because a generated one would silently drop the trigger.

## Khmer first

- The salon owner writes or approves every Khmer string the customers see.
- If a Khmer string is not approved, the bot refuses to show it, instead of quietly falling back to English.
- A change that needs new Khmer cannot be built until its Khmer has been supplied.
- An early version could leave a customer who had just switched language without a way back. Now the menu after a switch always offers Change Language, so nobody gets trapped in a language.

## What went wrong, and what changed

### Two taps, two awards

A review before building found a path where one award could be written twice. An award in progress lived only in the bot's memory, so a restart, or a second staff member acting at the same moment, could repeat it.

Now every award attempt is saved to the database before the points entry is written, with only one attempt allowed per transaction. A restart or a second tap finds the saved attempt and cannot write the points again.

### The QR code that could vanish

After the QR code was built, Codex's review planted deliberate bugs in disposable copies of the new code. One of them removed every customer's QR code and showed text only. Another made the scan quietly change the customer's join date. Both passed the complete suite of 2,533 tests.

Tests were added that catch both. Over the next rounds I learned to close a whole family of bugs, not just the one that was named: the surviving bugs lived because every test used a zero balance, or always looked at another customer. The tests now cover both cases each time.

Every change now goes through a planted-bug drill before it is accepted. The last two caught 77 of 77 and 34 of 34.

### A review loop that never ended

In the first week, one card went through four rounds of review. Every problem found was in how the evidence was written up, never in the product. So I changed the rules. A review before building is now required only for risky work: the points record, staff access, privacy, database changes and releases. After building, there is at most one fix and one re-check, and then an open disagreement comes to me to decide.

## Where it stands

- Confirmed live with customers by 23 September 2026, less than six weeks after the first commit on 16 August.
- Since launch: messages from the salon to its members, with a way to stop promotions; a simple sales record for staff, kept separate from points; and a clearer My Points screen. The owner asked for that layout and approved the mockup, and not one word changed in either language.
- 4,124 automated tests pass, here and on GitHub.
- A nightly backup is copied off the server, and a restore rehearsal matched production row for row.

## What I would improve next

- A visit identifier, so one visit can earn points only once, even if two staff members record it. This needs a database change and the owner's decision.
- Repeat the restore rehearsal on the newest version of the database.
