// Everything on the home page except the projects (those live in src/content/work/).
// Text is copied from the approved PDF portfolio (October 2026). **bold** is allowed.

export const summary = [
  'I build production software with AI coding agents, and I run it myself. Claude Code writes the code, Codex audits it independently, and I write the specs, set the guardrails, make the decisions and do every deploy. In 2026 this process put **five systems into production**, from a real-time crypto trading platform to a loyalty program used by a salon’s customers.',
  'Before this I spent eight years in business roles: B2B sales for a corporate e-learning company, market research for clients around the world, digital marketing, and hotel online sales. I hold an MBA in International Business. That is why my AI work starts from a real business problem and ends with something people can use every day.',
];

export const stats = [
  { value: '5', label: 'systems live in production' },
  { value: '1,000+', label: 'commits across 7 product repos' },
  { value: '6,500+', label: 'automated test functions' },
  { value: '200+', label: 'independent AI audit verdicts' },
];

export type Who = 'Me' | 'Codex' | 'Claude Code';

export const steps: { title: string; who: Who; text: string; verdicts?: boolean }[] = [
  { title: 'Write the card.', who: 'Me', text: 'Scope, what must not change, and the bar it has to pass. Written before any code.' },
  { title: 'Pre-build audit.', who: 'Codex', text: 'Reads the real code and the card, then returns', verdicts: true },
  { title: 'Build.', who: 'Claude Code', text: 'Implements the change switched off by default, adds tests, and hands back a diff with a report.' },
  { title: 'Post-build audit.', who: 'Codex', text: 'Checks the diff and every claim in the report. A FAIL sends it back to step 3.' },
  { title: 'Deploy and watch.', who: 'Me', text: 'I deploy and switch features on by hand, then check the live data.' },
];

export const rails = [
  { title: 'The auditor can’t edit code.', text: 'Codex can only write to a folder outside every repository. It’s a sandbox setting, not a request.' },
  { title: 'The builder can’t touch production.', text: 'Claude Code is blocked from pushing code, logging into servers, restarting services or reading secret files.' },
  { title: 'Agreement isn’t proof.', text: 'Two AIs agreeing is two opinions. Changes to live behaviour are proven with real forward data.' },
];

export const ledger = [
  { what: 'Claude’s tests mocked out the code under test', why: 'So a real crash never ran during testing. Its report also made a false claim. Fixed and passed in round 2.' },
  { what: 'A safety limit failed open after a restart', why: 'During a database outage the limit stopped working, even though all 69 tests were green. Fixed before release.' },
  { what: 'A payment QR code broke on one Python version', why: 'Caught because the tests run on two Python versions. Production used the one that broke.' },
];

export const ledgerNote =
  'More than half of first-round audits come back FAIL. That is the process working. Used on 3 projects with 130+ planned changes in total.';

export const research = [
  { question: 'Can smarter profit targets fix exits?', method: '121 rules tested on separate past and future data', result: '0 of 121 passed' },
  { question: 'Is stop-loss placement the problem?', method: 'Studied every winning and losing trade, replayed 7 rules', result: 'Stops were fine' },
  { question: 'Does the one rule that survived hold up live?', method: 'Ran it on demo with an automatic kill switch, then A/B against live', result: 'Retired' },
  { question: 'Do entries come too late after a market shift?', method: 'Statistical timing test on 162 signals', result: 'No effect' },
];

export const jobs = [
  { when: 'Jan 2022 – now', title: 'Founder', org: 'The Knowledge Plus · Cambodia', text: 'Crypto market education: daily videos, chart explanations and training. Since 2026, I’ve also built and run the K+ trading platform and the bots above.' },
  { when: 'Jan 2023 – now', title: 'Digital Specialist', org: 'Ti-Phsar · Cambodia', text: 'Websites, social media, paid ads and hotel yield management for clients.' },
  { when: 'Jan 2020 – Apr 2025', title: 'Freelance Market Researcher', org: 'Ravenry · Cambodia', text: 'Competitor research, data gathering, marketing analysis and content writing for clients around the world.' },
  { when: 'Nov 2019 – Nov 2020', title: 'Business Development Representative', org: 'Speexx · Thailand', text: 'B2B sales for a corporate e-learning company. Found decision-makers, set up meetings with company leaders, and handled negotiation using HubSpot, SalesLoft and LinkedIn Sales Navigator.' },
  { when: 'Jan 2018 – Sep 2019', title: 'Market Research Analyst (part-time and internship)', org: 'Canvassco · Thailand', text: 'Desk research, competitor and trend reports in English, and data analysis in Excel and PowerPoint.' },
  { when: 'Jun 2017 – Nov 2018', title: 'Social Media and Online Marketing Assistant Manager', org: 'Chan Angkor Boutique · Siem Reap', text: 'Online and seasonal promotions, and hotel booking channels (Expedia, Booking.com, Agoda, Airbnb).' },
];

export const education = [
  { title: 'MBA, International Business', where: 'Panyapiwat Institute of Management, Thailand · 2020–2022' },
  { title: 'BBA, International Business', where: 'Dhurakij Pundit University, Thailand · 2016–2019' },
  { title: 'Information Technology training', where: 'University of South-East Asia · 2015–2016' },
  { title: 'English for General Education', where: 'Australian Centre for Education · 2014–2016' },
];

export const languages = [
  { name: 'English', level: 'Full professional' },
  { name: 'Khmer', native: 'ខ្មែរ', level: 'Native' },
  { name: 'Thai', level: 'Elementary' },
];

export const skills = [
  { area: 'AI coding agents', items: 'Claude Code, Codex CLI, project instructions (CLAUDE.md, AGENTS.md), custom skills, sandbox and permission setup, builder–auditor review loops' },
  { area: 'LLM applications', items: 'Structured JSON output, automatic validation and retry, human approval steps, prompt caching, running models safely' },
  { area: 'Backend', items: 'Python, FastAPI, Telegram bots (aiogram, python-telegram-bot), PostgreSQL, SQLite, Redis, SQLAlchemy, REST and WebSocket APIs' },
  { area: 'Operations', items: 'Linux servers, PM2, systemd, cron, GitHub Actions, backups, monitoring and alerts' },
  { area: 'Testing and data', items: 'pytest, mutation testing, A/B testing, statistics, pandas, Excel, market research' },
  { area: 'Business', items: 'B2B sales and negotiation, digital marketing, customer relationships, staff training' },
];
