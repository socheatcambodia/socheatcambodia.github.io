// Checks the built site (dist/) and the repo before anything is published.
// Run after `astro build`:  node scripts/check-site.mjs
// Tests that plant each kind of problem on purpose: scripts/check-site.test.mjs
//
// 1. Pages: the home page exists; every page has a language, title, description and preview image; every
//    <img> has alt text.
// 2. Links: every internal link points to a real file, and every #anchor exists on its page. Links that
//    use this site's own address (https://<site>/..., //<site>/..., any letter case) count as internal.
// 3. Privacy: no phone numbers, IP addresses, home-folder paths, bot tokens, passwords or private keys in
//    any file that is published (dist/) or committed (the repo). No text file is exempt. Binary files
//    (images, fonts, the PDF CV) are not scanned.
//    Private words (for example a client's business name) go in `.private-denylist`, one per line. That
//    file is git-ignored. In CI it is written from the PRIVATE_DENYLIST repository secret, and the check
//    fails if no private words were loaded.
//
// Messages never repeat private data: privacy hits give the file and line only, and private words and
// pattern matches are blanked out of every other message. CI logs of a public repo are public.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

// Every file is scanned unless it is binary. The PDF CV is the one agreed place for the phone number.
const BINARY = new Set(['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.otf']);
const SKIP_DIRS = new Set(['node_modules', '.git', '.astro', 'dist']);
const DENYLIST_FILE = '.private-denylist';

export const PRIVACY_PATTERNS = [
  ['phone number (Cambodia)', /(?:\+|\(\+)?855[\s\-.()]*\d{2}[\s\-.]?\d{3}/],
  // Any grouping: a + and country code, then 7–12 more digits with spaces, dots, dashes or brackets between.
  // Not after a letter, so font character ranges like U+0300-0301 are not mistaken for phones.
  ['phone number (international)', /(?<!\w)\+\d{1,3}(?:[\s\-.()]*\d){7,12}(?!\d)/],
  // Any grouping: a leading 0, then 7–11 more digits. Not when glued to letters, digits, a decimal point or U+.
  ['phone number (local format)', /(?<![\w.,+])\(?0\d{1,3}\)?(?:[\s\-.]?\d){6,8}(?!\d)/],
  ['IP address', /\b(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}\b/],
  ['home-folder path (Linux)', /\/home\/(?!\$)[a-z_][a-z0-9_-]*/],
  ['home-folder path (macOS)', /(?<![\w.])\/Users\/(?!\$|Shared\b)[A-Za-z0-9._-]+/],
  ['home-folder path (Windows)', /(?:[A-Za-z]:\\+Users\\+|\/mnt\/[a-z]\/Users\/)(?!\$)[A-Za-z0-9._-]+/],
  ['home-folder path (~/)', /(?<![\w~])~\/[A-Za-z0-9._-]+/],
  ['Telegram bot token', /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/],
  // KEY=value, KEY: value, "key": "value", key = 'value'. The value is 8+ plain characters, so
  // ${{ secrets.X }} and process.env.X references are not flagged.
  ['password, key or token value', /(?:api[_-]?key|access[_-]?key|secret[_-]?key|client[_-]?secret|auth[_-]?token|secret|password|passwd|pwd|token)["']?\s*[:=]\s*["']?(?!process\.env|import\.meta)[A-Za-z0-9_\-+/=.]{8,}/i],
  ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
];

function walk(dir, skip = new Set()) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (!skip.has(name)) out.push(...walk(path, skip));
    } else {
      out.push(path);
    }
  }
  return out;
}

/** Returns the file's text, or null for binary files. UTF-16 text (with a byte-order mark) is decoded. */
function readText(file) {
  if (BINARY.has(extname(file).toLowerCase())) return null;
  const buf = readFileSync(file);
  if (buf[0] === 0xff && buf[1] === 0xfe) return buf.subarray(2).toString('utf16le');
  if (buf[0] === 0xfe && buf[1] === 0xff) {
    const le = Buffer.from(buf.subarray(2, 2 + ((buf.length - 2) & ~1)));
    return le.swap16().toString('utf16le');
  }
  if (buf.subarray(0, 8000).includes(0)) return null;
  return buf.toString('utf8');
}

/** Reads `site: '...'` from astro.config.mjs, so links to this site's own address are checked too. */
export function readSite(root) {
  const config = readFileSync(join(root, 'astro.config.mjs'), 'utf8');
  const m = config.match(/site:\s*['"]([^'"]+)['"]/);
  if (!m) throw new Error('astro.config.mjs has no `site`');
  return new URL(m[1]).origin;
}

/** Reads `.private-denylist`: one word per line, `#` starts a comment. Missing file = no words. */
export function readDenylist(root) {
  const file = join(root, DENYLIST_FILE);
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
}

/** Blanks out private words and anything a privacy pattern matches, so a message is safe to print. */
export function redact(message, denylist) {
  let out = message;
  for (const [label, re] of PRIVACY_PATTERNS) out = out.replace(new RegExp(re.source, `${re.flags.replace('g', '')}g`), `[${label}]`);
  for (const word of denylist) {
    out = out.replace(new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '[private word]');
  }
  return out;
}

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

/**
 * Returns { problems, pages, files }. No problems = all good. Every message is already redacted.
 * @param {{ root: string, site: string, denylist: string[], requireDenylist: boolean }} options
 */
export function findProblems({ root, site, denylist, requireDenylist }) {
  const dist = join(root, 'dist');
  const siteUrl = new URL(site);
  const problems = [];
  const fail = (where, what) => problems.push(redact(`${where}: ${what}`, denylist));

  if (!existsSync(dist)) return { problems: ['dist/ not found. Run `npm run build` first.'], pages: 0, files: 0 };
  if (requireDenylist && denylist.length === 0) {
    fail(DENYLIST_FILE, 'no private words loaded. Set the PRIVATE_DENYLIST repository secret');
  }
  if (!existsSync(join(dist, 'index.html'))) fail('dist/index.html', 'the home page is missing');

  // ---- 1 and 2: pages and links -------------------------------------------------------------
  const ATTR = /\s(href|src|content|id)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;
  const attrsOf = (html) => [...html.matchAll(ATTR)].map((m) => [m[1].toLowerCase(), (m[2] ?? m[3] ?? m[4]).replaceAll('&amp;', '&')]);

  const pages = walk(dist).filter((f) => f.endsWith('.html'));
  const idsByPage = new Map(pages.map((p) => [p, new Set(attrsOf(readFileSync(p, 'utf8')).filter(([a]) => a === 'id').map(([, v]) => v))]));

  const resolveTarget = (fromPage, urlPath) => {
    const base = urlPath.startsWith('/') ? join(dist, urlPath) : join(dirname(fromPage), urlPath);
    for (const candidate of [base, `${base}.html`, join(base, 'index.html')]) {
      if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
    }
    return null;
  };

  // A link to this site's own address (any scheme, letter case or //host form) → its path and #anchor.
  const sameSitePath = (value) => {
    if (!/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(value)) return null;
    let url;
    try { url = new URL(value, siteUrl); } catch { return null; }
    if (!/^https?:$/.test(url.protocol) || url.host !== siteUrl.host) return null;
    return url.pathname + url.hash;
  };

  for (const page of pages) {
    const html = readFileSync(page, 'utf8');
    const name = relative(root, page);

    if (!/<html[^>]*\slang\s*=\s*["']?[^"'\s>]+/i.test(html)) fail(name, 'missing <html lang>');
    if (!/<title>[^<]+<\/title>/i.test(html)) fail(name, 'missing <title>');
    if (!/<meta name=["']description["'] content=["'][^"']+["']/.test(html)) fail(name, 'missing meta description');
    if (!/<meta property=["']og:image["'] content=["']https:\/\/[^"']+["']/.test(html)) fail(name, 'missing absolute og:image');
    for (const img of html.match(/<img\b[^>]*>/gi) ?? []) {
      if (!/\salt\s*=/i.test(img)) fail(name, `image without alt text: ${img}`);
    }

    // href and src are links. content="..." is only a link when it is this site's own address
    // (canonical, og:url, og:image).
    for (const [attr, value] of attrsOf(html)) {
      if (attr === 'id') continue;
      let link = sameSitePath(value);
      if (link === null) {
        if (attr === 'content' || /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) continue; // text, another site, mailto:, tel:, data:
        link = value;
      }
      const [pathPart, hash] = link.split('#');
      const target = pathPart === '' ? page : resolveTarget(page, pathPart.split('?')[0] || '/');
      if (!target) {
        fail(name, `broken link ${value}`);
      } else if (hash && target.endsWith('.html') && !idsByPage.get(target)?.has(hash)) {
        fail(name, `link ${value} points to a missing #${hash}`);
      }
    }
  }

  // ---- 3: privacy --------------------------------------------------------------------------
  const denylistFile = join(root, DENYLIST_FILE);
  const files = [...walk(dist), ...walk(root, SKIP_DIRS).filter((f) => f !== denylistFile)];
  let scanned = 0;

  for (const file of files) {
    const text = readText(file);
    if (text === null) continue;
    scanned++;
    const name = relative(root, file);
    for (const [label, re] of PRIVACY_PATTERNS) {
      const m = re.exec(text);
      if (m) fail(`${name}:${lineOf(text, m.index)}`, label);
    }
    const lower = text.toLowerCase();
    for (const word of denylist) {
      const at = lower.indexOf(word.toLowerCase());
      if (at !== -1) fail(`${name}:${lineOf(text, at)}`, 'private word from .private-denylist');
    }
  }

  return { problems, pages: pages.length, files: scanned };
}

// ---- command line ---------------------------------------------------------------------------
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = process.cwd();
  const denylist = readDenylist(root);
  const result = findProblems({ root, site: readSite(root), denylist, requireDenylist: process.env.CI === 'true' });
  if (result.problems.length) {
    console.error(`check-site: ${result.problems.length} problem(s)\n- ${result.problems.join('\n- ')}`);
    process.exit(1);
  }
  console.log(
    `check-site: OK. ${result.pages} pages, links and anchors fine, ${result.files} text files clean` +
      (denylist.length ? ` (incl. ${denylist.length} private words).` : '. WARNING: no .private-denylist, generic patterns only.'),
  );
}
