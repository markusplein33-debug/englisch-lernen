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
ok(registered.decks.length === 12, `12 Decks vorhanden (${registered.decks.length})`);
ok(cards >= 560, `>=560 Karten (${cards})`);
ok(dupes === 0, `Karten-IDs eindeutig (${dupes} Duplikate)`);
ok(badMc === 0, `Kartenfelder vollständig (${badMc} defekt)`);
let mcBad = 0, exIds = new Set(), exDupes = 0;
for (const l of registered.lessons) for (const u of l.uebungen) {
  if (exIds.has(u.id)) exDupes++; else exIds.add(u.id);
  if (u.typ === 'mc' && (u.optionen.length !== 4 || u.richtig < 0 || u.richtig > 3)) mcBad++;
  if (u.typ === 'luecke' && (!Array.isArray(u.antwort) || !u.antwort.length)) mcBad++;
}
ok(registered.lessons.length === 14, `14 Lektionen (${registered.lessons.length})`);
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

// ---------- 1b. Grading-Unit-Checks (im Browser-Kontext später, hier via Node) ----------
console.log('1b) Grading');
global.window = global;
global.Store = { load: () => ({ einstellungen: { tempo: 0.9 } }) };
await import(url.pathToFileURL(path.join(ROOT, 'js', 'grading.js')).href);
const G = global.Grading;
const cases = [
  ['I have a reservation.', 'I have a reservation.', 'richtig'],
  ['i have a reservation', 'I have a reservation.', 'richtig'],
  ['I hav a reservaton', 'I have a reservation.', 'schreib'],
  ['Could I get the check, please?', 'Can I have the bill, please?', 'sinn'],
  ['Where is the toilet?', 'Where is the restroom?', 'richtig-oder-sinn'],
  ['key card', 'key card', 'richtig'],
  ['keycard', 'key card', 'schreib'],
  ['banana', 'key card', 'falsch'],
  ['recieve', 'receive', 'schreib'],
  ['I would like a coffee', "I'd like a coffee, please.", 'richtig-oder-sinn'],
  ['The weather is nice', 'Where is the station?', 'falsch'],
];
for (const [inp, ziel, erwartet] of cases) {
  const r = G.bewerte(inp, ziel);
  const passt = erwartet === 'richtig-oder-sinn' ? (r === 'richtig' || r === 'sinn' || r === 'schreib') : r === erwartet;
  ok(passt, `Grading: "${inp}" vs "${ziel}" -> ${r} (erwartet ${erwartet})`);
}
// Grammatik-Checker
const P = global.Grading.pruefe;
const gcases = [
  ['he go to the hotel', 'He goes to the hotel.', 'grammatik', '-s'],
  ['a apple', 'an apple', 'grammatik', 'Vokal'],
  ['Where you live?', 'Where do you live?', 'grammatik', 'do'],
  ['I goed to London', 'I went to London.', 'grammatik', 'went'],
  ['like I coffee would', 'I would like coffee', 'grammatik', 'Satzstellung'],
];
for (const [inp, ziel, stufe, stichwort] of gcases) {
  const r = P(inp, ziel);
  ok(r.stufe === stufe && r.hinweise.join(' ').includes(stichwort),
     `Grammatik: "${inp}" -> ${r.stufe} (${r.hinweise.join(' / ').slice(0, 60)})`);
}
delete global.window;

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
// Eintipp-Modus: Antwortfeld vorhanden, teilweise-Bewertung funktioniert
ok(await page.locator('#antwort').count() === 1, 'Session: Eingabefeld (Tipp-Modus) da');
const zielDe = await page.locator('.flashcard .word').textContent();
await page.fill('#antwort', 'xyz komplett falsch');
await page.click('#check');
await page.waitForSelector('#feedback .explain', { timeout: 5000 });
ok((await page.locator('#feedback .explain').first().textContent()).includes('Lösung'), 'Session: Falsch-Feedback mit Lösung');

// Erweiterungspakete: aktivieren (ergaenzen) -> Deck sichtbar; einzeln -> Sektion + Basis-Pool
ok(await page.evaluate(() => APP_DATA.sichtbareDecks().length) === 8, 'Standard: 8 sichtbare Decks');
await page.evaluate(() => {
  const s = Store.load();
  s.pakete.aktiv = ['essen', 'grammatik2'];
  s.pakete.modus = 'ergaenzen';
  Store.save();
});
await page.waitForTimeout(250);
ok(await page.evaluate(() => APP_DATA.sichtbareDecks().length) === 9, 'Paket aktiv: 9 sichtbare Decks');
ok(await page.evaluate(() => APP_DATA.sichtbareLessons().length) === 14, 'Grammatik-Paket aktiv: 14 Lektionen');
ok(await page.evaluate(() => Pensum.aktiveDecks().includes('essen')), 'ergaenzen: Erweiterung im Einheiten-Pool');
await page.evaluate(() => { const s = Store.load(); s.pakete.modus = 'einzeln'; Store.save(); });
await page.waitForTimeout(250);
ok(await page.evaluate(() => !Pensum.aktiveDecks().includes('essen')), 'einzeln: Pool bleibt Basis');
await page.click('#tabbar .tab:nth-child(2)');
await page.waitForSelector('.rowcard', { timeout: 5000 });
ok((await page.locator('#view .sect').count()) >= 1, 'einzeln: Erweiterungs-Sektion in Kartenliste');
ok(await page.locator('.rowcard').count() === 9, 'Kartenliste zeigt 9 Decks (8 Basis + 1 Erweiterung)');
await page.evaluate(() => { const s = Store.load(); s.pakete.aktiv = []; s.pakete.modus = 'ergaenzen'; Store.save(); });

// Home: Stand-Fußzeile + Refresh-Button
await page.click('#tabbar .tab:nth-child(1)');
await page.waitForSelector('#refresh', { timeout: 5000 });
ok((await page.locator('#view').textContent()).includes('Letzte Aktualisierung'), 'Home: Stand-Anzeige da');
ok(await page.locator('#refresh').count() === 1, 'Home: Refresh-Button da');
// Letzte Lern-Einheit: erst Platzhalter bzw. Zeitstempel nach Session
ok((await page.locator('#view').textContent()).includes('Lern-Einheit'), 'Home: Letzte-Einheit-Zeile da');
await page.evaluate(() => { const s = Store.load(); s.letzteLektion = Date.now(); Store.save(); });
await page.click('#tabbar .tab:nth-child(2)');
await page.click('#tabbar .tab:nth-child(1)');
await page.waitForSelector('#refresh', { timeout: 5000 });
ok((await page.locator('#view').textContent()).includes('Letzte Lern-Einheit: heute'), 'Home: Letzte Einheit heute angezeigt');

// Einstellungen: Erinnerungs-Assistent
await page.click('#btn-settings');
await page.waitForSelector('#ics-btn', { timeout: 5000 });
ok(await page.locator('#ics-btn').count() === 1, 'Settings: Kalender-Button da');
ok(await page.locator('#shortcut-btn').count() === 1, 'Settings: Kurzbefehl-Button da');
ok(((await page.locator('#zeiten-vorschau2').textContent()) || '').includes(':00'), 'Settings: Zeiten-Vorschau berechnet');
// Ics-Helfer: Einzeltermin ohne Wiederholung
const einzel = await page.evaluate(() => Ics.erzeuge([{uid:'t@x',datum:'20260812',zeit:'1400',titel:'T',beschreibung:'B',url:'u'}], false));
ok(einzel.includes('DTSTART:20260812T140000') && !einzel.includes('RRULE'), 'Ics: Einzeltermin ohne RRULE');
ok(await page.locator('#ics-del-btn').count() === 1, 'Settings: Entfernen-Button da');
// Ohne vorheriges Anlegen: Hinweis statt Datei
await page.click('#ics-del-btn');
ok((await page.locator('#ics-status').textContent()).includes('noch keine'), 'Entfernen ohne Anlegen: Hinweis');
// Anlegen merkt sich Termine, Entfernen erzeugt Storno-Datei (Download abfangen)
const stunde = await page.evaluate(() => new Date().getHours());
if (stunde < 19) {
  const dl1p = page.waitForEvent('download');
  await page.click('#ics-btn');
  const dl1 = await dl1p;
  const createIcs = fs.readFileSync(await dl1.path(), 'utf8');
  const heuteStempel = await page.evaluate(() => Ics.datumStempel(new Date()));
  ok(createIcs.includes('DTSTART:' + heuteStempel) && !createIcs.includes('RRULE'),
     'Erinnerungs-ICS: nur heute, keine Wiederholung');
  ok(await page.evaluate(() => !!Store.load().pensum.kalender), 'Kalender-Anlage gemerkt');
  const dl2p = page.waitForEvent('download');
  await page.click('#ics-del-btn');
  const dl2 = await dl2p;
  const cancelIcs = fs.readFileSync(await dl2.path(), 'utf8');
  ok(cancelIcs.includes('METHOD:CANCEL') && cancelIcs.includes('STATUS:CANCELLED') &&
     cancelIcs.includes('englisch-lernen-slot-0@') && !cancelIcs.includes('RRULE'),
     'Storno-ICS korrekt (CANCEL + UIDs, keine Wiederholung)');
} else {
  await page.click('#ics-btn');
  ok((await page.locator('#ics-status').textContent()).includes('vorbei'),
     'Kalender-Button: Hinweis wenn heute keine Zeiten mehr');
}

// Statistik zeigt Balken
await page.click('#tabbar .tab:nth-child(5)');
await page.waitForSelector('.statcard', { timeout: 5000 });
ok(await page.locator('.progressbar').count() > 10, 'Statistik: Fortschrittsbalken gerendert');

// Backup: Export als Datei, Import aus Datei stellt Zustand wieder her
const dlBackupP = page.waitForEvent('download');
await page.click('#export');
const dlBackup = await dlBackupP;
const backupPath = await dlBackup.path();
const backupJson = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
ok(backupJson.version === 1 && backupJson.srs, 'Backup-Export: gültige JSON-Datei');
ok((dlBackup.suggestedFilename() || '').startsWith('englisch-backup-'), 'Backup-Export: Dateiname');
const srsVorher = await page.evaluate(() => Object.keys(Store.load().srs).length);
await page.evaluate(() => { const s = Store.load(); s.srs = {}; Store.save(); });
await page.locator('#import-file').setInputFiles(backupPath);
await page.waitForTimeout(400);
const srsNachher = await page.evaluate(() => Object.keys(Store.load().srs).length);
ok(srsNachher === srsVorher && srsVorher >= 1, 'Backup-Import: Lernstand wiederhergestellt');

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
