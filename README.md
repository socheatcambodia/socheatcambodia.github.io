# socheatcambodia.github.io

The source code of my portfolio website: **https://socheatcambodia.github.io**

I'm Socheat Chea, an AI Engineer in Siem Reap, Cambodia. I build production software by directing AI
coding agents: Claude Code builds, Codex audits independently, and I write the specs, make the decisions
and do every deploy. My other repositories are private because they hold live trading systems and client
data. This one is public, so you can see the process for yourself.

## How this site is built

- **[Astro](https://astro.build)** static site. No server, no database, no tracking, no cookies.
- **Content separate from layout.** Each project is one markdown file in `src/content/work/`. All other
  text is in `src/data/resume.ts`.
- **Checked before every publish.** GitHub Actions runs a type check, the build, and
  `scripts/check-site.mjs`, which fails the deploy if a page is missing its title or preview image, if any
  internal link or `#anchor` is broken, or if a phone number, IP address, home-folder path, token,
  password or private word appears in any published or committed file. The private words come from an
  encrypted repository secret, so they are never written in the code.
- **The checker is tested too.** `scripts/check-site.test.mjs` plants each kind of problem on purpose and
  confirms it is caught.
- **Same rules as my private projects.** `AGENTS.md` sets the rules for every AI agent, `CLAUDE.md` adds
  builder notes, and `cards/` holds the written plan for each change.

## Run it locally

```bash
npm ci
npm run dev      # http://localhost:4321
npm run verify   # type check + build + site checks
```

## Contact

Email [socheatsac7@gmail.com](mailto:socheatsac7@gmail.com) or find me on
[LinkedIn](https://www.linkedin.com/in/socheat-chea-6582a176/).
