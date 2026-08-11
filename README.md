# 📚 Englisch lernen – Offline-App fürs iPhone

Eine kleine Web-App zum Englischlernen: **Karteikarten mit Wiederholsystem, Quiz, Grammatik-Lektionen und einstellbarem Lernpensum** – komplett offline nutzbar, Fokus auf Reise-Englisch.

**App-Adresse:** https://markusplein33-debug.github.io/englisch-lernen/

## 📱 Auf dem iPhone installieren

1. Die App-Adresse oben in **Safari** öffnen.
2. Unten das **Teilen-Symbol** (Viereck mit Pfeil) tippen.
3. **„Zum Home-Bildschirm"** wählen und bestätigen.
4. Die App einmal öffnen, solange du Internet hast (sie lädt dabei alles herunter).
5. Fertig – ab jetzt funktioniert sie **auch ohne Internet** (Flugmodus, Ausland …).

## ✨ Funktionen

- **🃏 Karteikarten** mit Leitner-System (5 Boxen): Was du kannst, kommt seltener – was schwerfällt, öfter. 8 Decks mit über 400 Vokabeln und Sätzen: Hotel, Restaurant, Flughafen, Einkaufen, Notfall & Arzt, Smalltalk, Unterwegs, Basis-Englisch.
- **❓ Quiz**: 40 Reise-Situationsfragen + automatische Vokabel-Quizze zu jedem Deck.
- **📖 Grammatik & Zeitformen**: 10 Lektionen mit deutschen Erklärungen und je 10 Übungen (Multiple Choice + Lückentext).
- **🔊 Aussprache**: Jede Vokabel lässt sich vorlesen (funktioniert offline, nutzt die iPhone-Stimmen).
- **📚 Lernpensum**: In den Einstellungen z. B. „alle 2 Stunden 10 Vokabeln + 2 Grammatikfragen" festlegen – die App zeigt dir fällige Lern-Einheiten an.
- **📊 Statistik**: Grafische Übersicht über gelernte und schwierige Decks/Lektionen, deine schwierigsten Vokabeln und dein Wochen-Streak.

## ⏰ Erinnerungen bei geschlossener App

Web-Apps dürfen auf dem iPhone ohne eigenen Server keine Push-Nachrichten senden. Die Lösung ist die vorinstallierte Apple-App **Kurzbefehle**:

1. Kurzbefehle-App öffnen → Tab **Automation** → **+**
2. **Tageszeit** wählen, Uhrzeit(en) einstellen (z. B. 9:00, 12:00, 18:00) und **Sofort ausführen** aktivieren.
3. Aktion **„App öffnen"** hinzufügen und **„Englisch"** auswählen.
4. Fertig – das iPhone öffnet die Lern-App automatisch zur eingestellten Zeit.

## 🔧 Für später: Inhalte erweitern

Neue Vokabel-Decks sind einfache Dateien unter `js/data/` (Muster: `deck-hotel.js`). Neues Deck anlegen, in `index.html` als `<script>` eintragen, in `sw.js` zur `ASSETS`-Liste hinzufügen und dort `VERSION` um 1 erhöhen – fertig.

## Technik

Statisches HTML/CSS/JavaScript ohne Abhängigkeiten, Service Worker für den Offline-Betrieb, Lernfortschritt in `localStorage` (nur auf dem Gerät; Export/Import unter „Statistik"). Veröffentlichung über GitHub Pages (`.github/workflows/pages.yml`). Sollte die Seite nach dem ersten Merge nicht erreichbar sein: Repo-Einstellungen → **Pages** → Source auf **„GitHub Actions"** stellen.
