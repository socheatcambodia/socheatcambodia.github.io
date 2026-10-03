// Tests for scripts/check-site.mjs. Each test builds a tiny fake site in a temp folder, plants one
// problem, and checks that the checker reports it. Run: npm test
//
// Two kinds of tests:
// - check(...) calls the checker's function directly, for each kind of problem.
// - cli(...) runs the real command (`node scripts/check-site.mjs`) the way CI does, to test what only the
//   command does: reading astro.config.mjs and .private-denylist, the CI=true rule, and the exit code.
//
// Planted values are assembled at run time with j(...), so this file never contains a real-looking
// phone number, IP address, path or password itself. The checker scans this file too, with no exemption.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { findProblems } from './check-site.mjs';

const SITE = 'https://example.github.io';
const CHECKER = fileURLToPath(new URL('./check-site.mjs', import.meta.url));
const j = (...parts) => parts.join('');
const PHONE = j('012', ' 345 678');

function page({ body = '', head = '', lang = ' lang="en"' } = {}) {
  return `<!doctype html><html${lang}><head><title>T</title>
<meta name="description" content="D">
<meta property="og:image" content="${SITE}/og.png">${head}</head>
<body><main id="main"><section id="work">x</section>${body}</main></body></html>`;
}

/** Builds a fake site. `files` maps a path to its content (string or Buffer); null leaves a default out. */
function makeSite(files) {
  const root = mkdtempSync(join(tmpdir(), 'check-site-'));
  const all = {
    'dist/index.html': page(),
    'dist/og.png': 'png',
    'dist/about.html': page(),
    'astro.config.mjs': `export default { site: '${SITE}' };\n`,
    ...files,
  };
  for (const [path, content] of Object.entries(all)) {
    if (content === null) continue;
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

/** Runs the checker's function on a fake site and returns the problem messages. */
function check(files = {}, options = {}) {
  const root = makeSite(files);
  try {
    return findProblems({ root, site: SITE, denylist: [], requireDenylist: false, ...options }).problems;
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

/** Runs the real command on a fake site. `ci` sets CI=true like GitHub Actions does. */
function cli(files = {}, { ci = false } = {}) {
  const root = makeSite(files);
  try {
    const r = spawnSync(process.execPath, [CHECKER], { cwd: root, encoding: 'utf8', env: { ...process.env, CI: ci ? 'true' : '' } });
    return { code: r.status, out: r.stdout + r.stderr };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const withBody = (body) => ({ 'dist/index.html': page({ body }) });
const hasProblem = (problems, text) => problems.some((p) => p.includes(text));
const hasProblemIn = (problems, file, text) => problems.some((p) => p.startsWith(`${file}:`) && p.includes(text));

// ---- clean sites and false alarms ------------------------------------------------------------

test('a clean site has no problems', () => {
  assert.deepEqual(check(), []);
});

test('normal numbers and dates are not mistaken for private data', () => {
  const body = '<p>1,000+ commits. 0 of 121 passed. 6,500+ tests. A 3,858-line file. 65–81% of volume.</p>'
    + '<p>2026-10-03, Mar–Sep 2026, v24.21.0, 0.65, 480 commits · ~111k lines · ~4,000 tests</p>';
  const css = '@font-face{unicode-range:U+0000-00FF,U+0300-0301,U+2000-206F,U+0102-0103}';
  assert.deepEqual(check({ ...withBody(body), 'dist/a.css': css }), []);
});

test('workflow secret references and short config values are not mistaken for passwords', () => {
  const yml = 'permissions:\n  id-token: write\nenv:\n  PRIVATE_DENYLIST: ${{ secrets.PRIVATE_DENYLIST }}\n';
  assert.deepEqual(check({ '.github/workflows/x.yml': yml, 'a.js': 'const token = process.env.API_TOKEN_VALUE;' }), []);
});

// ---- privacy patterns ------------------------------------------------------------------------

for (const phone of [
  j('0', '12345678'),
  j('012', '.345', '.678'),
  j('(012', ') 345', ' 678'),
  j('097', ' 111', ' 2222'),
  j('(+8', '55) 12 345 678'),
  j('+8', '55 12345678'),
  j('+4', '4 20 7946 0958'),
  j('85', '5 12 345 678'),
  j('Call 012 345', ' 678.'),
]) {
  test(`phone number is caught: ${phone}`, () => {
    assert.ok(hasProblem(check(withBody(`<p>${phone}</p>`)), 'phone number'));
  });
}

test('IP address is caught', () => {
  assert.ok(hasProblem(check(withBody(`<p>${j('10.', '20.30.40')}</p>`)), 'IP address'));
});

for (const path of [
  j('/ho', 'me/someone/x'),
  j('/Us', 'ers/someone/x'),
  j('C:', '\\Users\\someone'),
  j('/mnt/c/', 'Users/someone'),
  j('~', '/projects/x'),
]) {
  test(`home-folder path is caught: ${path}`, () => {
    assert.ok(hasProblem(check({ 'README.md': `see ${path}` }), 'home-folder path'));
  });
}

test('a path built from a variable is not a home-folder path', () => {
  assert.deepEqual(check({ 'scripts/x.sh': j('DIR="/mnt/c/', 'Users/$(whoami)/x"') }), []);
});

for (const [name, text] of [
  ['quoted assignment', j('pass', 'word = "', 'abcdefgh1', '"')],
  ['environment variable', j('API', '_KEY=', 'sk', '_live_abc12345')],
  ['JSON', j('{"api', '_key": "', 'abcd1234efgh', '"}')],
  ['YAML', j('pass', 'word: ', 'hunter2hunter2')],
]) {
  test(`password or key is caught: ${name}`, () => {
    assert.ok(hasProblem(check({ 'config.txt': text }), 'password, key or token'));
  });
}

test('tokens and private keys are caught', () => {
  assert.ok(hasProblem(check({ 'a.js': j('const t = "123456789', ':', 'A'.repeat(35), '"') }), 'Telegram bot token'));
  assert.ok(hasProblem(check({ 'a.txt': j('-----BEGIN ', 'RSA PRIVATE KEY-----') }), 'private key'));
});

// ---- which files are scanned -----------------------------------------------------------------

test('no committed file is exempt, including the lock file and the checker itself', () => {
  assert.ok(hasProblemIn(check({ 'package-lock.json': `{"x":"${PHONE}"}` }), 'package-lock.json', 'phone number'));
  assert.ok(hasProblemIn(check({ 'scripts/check-site.mjs': `// ${PHONE}` }), 'scripts/check-site.mjs', 'phone number'));
});

test('files without a known extension are scanned (CNAME, LICENSE)', () => {
  assert.ok(hasProblemIn(check({ 'public/CNAME': PHONE }), 'public/CNAME', 'phone number'));
  assert.ok(hasProblemIn(check({ 'LICENSE': j('/ho', 'me/someone') }), 'LICENSE', 'home-folder path'));
});

test('only the real private word list is skipped, not other files with a similar name', () => {
  assert.ok(hasProblemIn(check({ 'notes.private-denylist': PHONE }), 'notes.private-denylist', 'phone number'));
  assert.ok(hasProblemIn(check({ 'docs/.private-denylist': PHONE }), 'docs/.private-denylist', 'phone number'));
  assert.deepEqual(check({ '.private-denylist': 'zebrafruit\n' }, { denylist: ['zebrafruit'] }), []);
});

test('UTF-16 text files are scanned', () => {
  const le = Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(`call ${PHONE}`, 'utf16le')]);
  const be = Buffer.concat([Buffer.from([0xfe, 0xff]), Buffer.from(`call ${PHONE}`, 'utf16le').swap16()]);
  assert.ok(hasProblemIn(check({ 'notes-le.txt': le }), 'notes-le.txt', 'phone number'));
  assert.ok(hasProblemIn(check({ 'notes-be.txt': be }), 'notes-be.txt', 'phone number'));
});

test('binary files are not scanned (the PDF CV is the agreed place for the phone number)', () => {
  assert.deepEqual(check({ 'dist/cv.pdf': `%PDF-1.7\n${PHONE}` }), []);
});

// ---- private words and redaction -------------------------------------------------------------

test('private words are caught with file and line', () => {
  const problems = check({ 'README.md': 'line one\nThanks to Zebrafruit Salon' }, { denylist: ['zebrafruit'] });
  assert.ok(problems.some((p) => p.startsWith('README.md:2:') && p.includes('private word')));
});

test('no message ever repeats a private word or a matched value', () => {
  const ip = j('10.', '20.30.40');
  const body = `<a href="/zebrafruit-page">x</a><a href="/files/${ip}/x">x</a><img src="/x-${PHONE.replaceAll(' ', '')}.png">`;
  const problems = check({ ...withBody(body), 'README.md': `Zebrafruit ${PHONE} ${ip}` }, { denylist: ['zebrafruit'] });
  assert.ok(problems.length >= 6, problems.join('\n'));
  const all = problems.join('\n');
  assert.ok(!all.toLowerCase().includes('zebrafruit'), all);
  assert.ok(!all.includes(ip), all);
  assert.ok(!all.includes(PHONE) && !all.includes(PHONE.replaceAll(' ', '')), all);
});

test('CI fails when no private words are loaded', () => {
  assert.ok(hasProblem(check({}, { requireDenylist: true }), 'PRIVATE_DENYLIST'));
  assert.deepEqual(check({}, { requireDenylist: true, denylist: ['zebrafruit'] }), []);
});

// ---- links and pages -------------------------------------------------------------------------

for (const link of [
  'href="/missing"',
  "href='/missing'",
  'href=/missing',
  'href = "/missing"',
  `href="${SITE}/missing"`,
  'href="//example.github.io/missing"',
  'href="HTTPS://Example.GitHub.io/missing"',
  'src="/missing.png"',
]) {
  test(`broken link is caught: ${link}`, () => {
    assert.ok(hasProblem(check(withBody(`<a ${link}>x</a>`)), 'broken link'));
  });
}

for (const link of [
  'href="/#nowhere"',
  "href='#nowhere'",
  'href=#nowhere',
  `href="${SITE}/#nowhere"`,
  `href="${SITE}?x=1#nowhere"`,
  'href="/about#nowhere"',
]) {
  test(`missing anchor is caught: ${link}`, () => {
    assert.ok(hasProblem(check(withBody(`<a ${link}>x</a>`)), 'missing #nowhere'));
  });
}

test('a broken same-site address in a meta tag is caught', () => {
  const head = `<link rel="canonical" href="${SITE}/old-page"><meta property="og:url" content="${SITE}/old-page">`;
  assert.equal(check({ 'dist/index.html': page({ head }) }).filter((p) => p.includes('broken link')).length, 2);
});

test('working links pass', () => {
  const body = [
    '/#work', '#main', `${SITE}/#work`, `${SITE}/`, `${SITE}?x=1`, '//example.github.io/about', 'HTTPS://EXAMPLE.GITHUB.IO/about#work',
    '/about', '/about.html#work', 'mailto:a@example.com', 'https://other.example/x',
  ].map((href) => `<a href="${href}">x</a>`).join('') + '<a href=/about#work id=extra>x</a>';
  assert.deepEqual(check(withBody(body)), []);
});

test('a site without a home page fails', () => {
  assert.ok(hasProblem(check({ 'dist/index.html': null, 'dist/about.html': null }), 'home page is missing'));
});

test('page basics are required', () => {
  assert.ok(hasProblem(check({ 'dist/index.html': page({ lang: '' }) }), 'missing <html lang>'));
  assert.ok(hasProblem(check({ 'dist/index.html': page().replace('<title>T</title>', '') }), 'missing <title>'));
  assert.ok(hasProblem(check({ 'dist/index.html': page().replace(/<meta name="description"[^>]*>/, '') }), 'missing meta description'));
  assert.ok(hasProblem(check({ 'dist/index.html': page().replace(/<meta property="og:image"[^>]*>/, '') }), 'missing absolute og:image'));
  assert.ok(hasProblem(check(withBody('<img src="/og.png">')), 'image without alt text'));
});

// ---- the real command, as CI runs it -------------------------------------------------------------

test('command: a clean site exits 0 and warns when there is no private word list', () => {
  const r = cli();
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /check-site: OK/);
  assert.match(r.out, /WARNING: no \.private-denylist/);
});

test('command: in CI, a missing or comment-only private word list fails with exit 1', () => {
  for (const denylist of [null, '', '# only a comment\n']) {
    const r = cli({ '.private-denylist': denylist }, { ci: true });
    assert.equal(r.code, 1, r.out);
    assert.match(r.out, /PRIVATE_DENYLIST/);
  }
});

test('command: reads .private-denylist, catches the word, exits 1 and never prints it', () => {
  const r = cli({ '.private-denylist': '# private\nzebrafruit\n', 'README.md': 'Zebrafruit Salon' }, { ci: true });
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /README\.md:1: private word/);
  assert.ok(!r.out.toLowerCase().includes('zebrafruit'), r.out);
});

test('command: with a private word list in CI and no problems, exits 0', () => {
  const r = cli({ '.private-denylist': 'zebrafruit\n' }, { ci: true });
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /incl\. 1 private words/);
});

test('command: reads this site\'s address from astro.config.mjs', () => {
  const body = `<a href="${SITE}/missing">x</a>`;
  const own = cli(withBody(body));
  assert.equal(own.code, 1, own.out);
  assert.match(own.out, /broken link/);
  const other = cli({ ...withBody(body), 'astro.config.mjs': "export default { site: 'https://other.github.io' };\n" });
  assert.equal(other.code, 0, other.out);
});
