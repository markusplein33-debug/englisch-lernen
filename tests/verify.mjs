// Headless-Verifikation: Datenintegrität + PWA-Offlinefähigkeit + Klickpfade.
// Aufruf:  node tests/verify.mjs   (erwartet laufenden Server auf http://localhost:8080)
import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import url from 'url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const BASE = 'http://localhost:8080/';
let fails = 0;
const ok = (cond, msg) => { console.log((cond ? '  ✓ ' : '  ✗ ') + msg); if (!cond) fails++; };

// ---------- 1. Statische Datenvalidierung (Node) ----------
console.log('1) Datenvalidierung');
const registered = { decks: [], quizzes: [], lessons: [] };
global.APP_DATA = {
  registerDeck: d => registered.decks.push(d),
  registerQuiz: q => registered.quizzes.push(q),
  registerLesson: l => registered.lessons.push(l),
};
const dataDir = path.join(ROOT, 'js', 'data');
for (const f of fs.readdirSync(dataDir)) {
  if (f !== 'index.js') (await import(url.pathToFileURL(path.join(dataDir, f)).href));
}
const ids = new Set();
let dupes = 0, badMc = 0, cards = 0;
for (const d of registered.decks) for (const k of d.karten) {
  cards++;
  if (ids.has(k.id)) dupes++; else ids.add(k.id);
  if (!k.en || !k.de || !['wort', 'satz'].includes(k.typ)) badMc++;
}
ok(registered.decks.length === 8, `8 Decks vorhanden (${registered.decks.length})`);
ok(cards >= 380, `>=380 Karten (${cards})`);
ok(dupes === 0, `Karten-IDs eindeutig (${dupes} Duplikate)`);
ok(badMc === 0, `Kartenfelder vollständig (${badMc} defekt)`);
let mcBad = 0, exIds = new Set(), exDupes = 0;
for (const l of registered.lessons) for (const u of l.uebungen) {
  if (exIds.has(u.id)) exDupes++; else exIds.add(u.id);
  if (u.typ === 'mc' && (u.optionen.length !== 4 || u.richtig < 0 || u.richtig > 3)) mcBad++;
  if (u.typ === 'luecke' && (!Array.isArray(u.antwort) || !u.antwort.length)) mcBad++;
}
ok(registered.lessons.length === 10, `10 Lektionen (${registered.lessons.length})`);
ok(exDupes === 0 && mcBad === 0, `Übungen valide (${exDupes} Dup., ${mcBad} defekt)`);
for (const q of registered.quizzes) {
  const bad = q.fragen.filter(f => f.optionen.length !== 4 || f.richtig < 0 || f.richtig > 3).length;
  ok(bad === 0, `Quiz ${q.id}: ${q.fragen.length} Fragen, ${bad} defekt`);
}

// SW-Precache-Liste vs. Dateibestand
const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
const assets = [...sw.matchAll(/'([^']+)'/g)].map(m => m[1])
  .filter(a => a.includes('.') && !a.startsWith('notizen-en'));
let missing = 0;
for (const a of assets) {
  if (!fs.existsSync(path.join(ROOT, a))) { console.log('    fehlt: ' + a); missing++; }
}
ok(missing === 0, `Alle ${assets.length} Precache-Dateien existieren`);

// ---------- 2. Browser-Tests ----------
console.log('2) Browser (Chromium headless)');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto(BASE, { waitUntil: 'networkidle' });
ok(errors.length === 0, `Keine Console-/Page-Errors (${errors.join(' | ').slice(0, 200)})`);
ok(await page.locator('.tile-grid .tile').count() === 4, 'Startseite: 4 Kacheln');

// Service Worker + Cache
await page.evaluate(() => navigator.serviceWorker.ready);
await page.waitForFunction(async () => {
  const keys = await caches.keys();
  return keys.some(k => k.startsWith('notizen-en-'));
});
const cached = await page.evaluate(async () => {
  const keys = await caches.keys();
  const c = await caches.open(keys.find(k => k.startsWith('notizen-en-')));
  return (await c.keys()).map(r => r.url);
});
const notCached = assets.filter(a => !cached.some(u => u.endsWith('/' + a) || (a === './' && u.endsWith('/'))));
ok(notCached.length === 0, `SW-Cache vollständig (${cached.length} Einträge${notCached.length ? ', fehlt: ' + notCached.join(',') : ''})`);

// Karteikarte lernen
await page.click('#tabbar .tab:nth-child(2)');
await page.click('.rowcard');
await page.click('#flip');
await page.click('#yes');
const srsCount = await page.evaluate(() => Object.keys(Store.load().srs).length);
ok(srsCount >= 1, `Karte bewertet, SRS gespeichert (${srsCount})`);

// Quizrunde: eine Frage beantworten
await page.click('#tabbar .tab:nth-child(3)');
await page.click('.rowcard');
await page.click('.q-option');
ok(await page.locator('#next').count() === 1, 'Quiz: Antwort ausgewertet, Weiter-Button da');

// Grammatik: Lektion öffnen, Übungen starten, eine Übung beantworten
await page.click('#tabbar .tab:nth-child(4)');
await page.click('.rowcard');
await page.click('#ueben');
if (await page.locator('.q-option').count()) await page.click('.q-option');
else { await page.fill('#gap', 'x'); await page.click('#check'); }
ok(await page.locator('#next').count() === 1, 'Grammatik: Übung ausgewertet');

// Pensum: Intervall setzen, letzteEinheit zurückdatieren -> Banner fällig
await page.click('#btn-settings');
await page.selectOption('#intervall', '60');
await page.evaluate(() => {
  const s = Store.load();
  s.pensum.intervallMin = 60;
  s.pensum.letzteEinheit = Date.now() - 3 * 3600 * 1000;
  s.pensum.ruheVon = 0; s.pensum.ruheBis = 0;
  Store.save();
});
await page.waitForTimeout(300);
await page.click('#tabbar .tab:nth-child(1)');
ok((await page.locator('.banner h2').textContent()).includes('fällig'), 'Pensum-Banner erscheint');
await page.click('#start-session');
await page.waitForSelector('.qmeta', { timeout: 5000 });
ok(await page.locator('.qmeta').count() === 1, 'Lern-Einheit startet');

// Statistik zeigt Balken
await page.click('#tabbar .tab:nth-child(5)');
await page.waitForSelector('.statcard', { timeout: 5000 });
ok(await page.locator('.progressbar').count() > 10, 'Statistik: Fortschrittsbalken gerendert');

// ---------- 3. Offline-Test ----------
console.log('3) Offline');
await ctx.setOffline(true);
await page.goto(BASE + '#/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.tile-grid .tile', { timeout: 5000 });
ok(await page.locator('.tile-grid .tile').count() === 4, 'Offline-Reload: App rendert (4 Kacheln)');
await page.click('#tabbar .tab:nth-child(2)');
await page.waitForSelector('.rowcard', { timeout: 5000 });
ok(await page.locator('.rowcard').count() === 8, 'Offline: 8 Decks sichtbar');
await ctx.setOffline(false);

await browser.close();
console.log(fails === 0 ? '\nALLE TESTS BESTANDEN ✅' : `\n${fails} TEST(S) FEHLGESCHLAGEN ❌`);
process.exit(fails === 0 ? 0 : 1);
