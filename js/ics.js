// Gemeinsame Kalender-Helfer: ICS-Dateien bauen und herunterladen.
// Termine sind Einzeltermine (keine Wiederholung) – so bleibt der Kalender aufgeräumt.
(function () {
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function datumStempel(d) {
    return String(d.getFullYear()) + pad(d.getMonth() + 1) + pad(d.getDate());
  }

  // termine: [{ uid, datum:'YYYYMMDD', zeit:'HHMM', titel, beschreibung, url }]
  // cancel=true erzeugt eine Storno-Datei mit denselben Termin-IDs (UIDs) –
  // der Kalender erkennt die Termine daran und entfernt sie.
  function erzeuge(termine, cancel) {
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Englisch lernen//DE',
      'CALSCALE:GREGORIAN', 'METHOD:' + (cancel ? 'CANCEL' : 'PUBLISH')];
    var stamp = datumStempel(new Date());
    termine.forEach(function (t) {
      ics.push('BEGIN:VEVENT',
        'UID:' + t.uid,
        'DTSTAMP:' + stamp + 'T000000Z',
        'DTSTART:' + t.datum + 'T' + t.zeit + '00',
        'DURATION:PT5M',
        'SEQUENCE:' + (cancel ? '2' : '0'),
        'SUMMARY:' + t.titel,
        'DESCRIPTION:' + t.beschreibung,
        'URL:' + t.url);
      if (cancel) ics.push('STATUS:CANCELLED');
      else ics.push('BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Englisch lernen!',
        'TRIGGER:PT0S', 'END:VALARM');
      ics.push('END:VEVENT');
    });
    ics.push('END:VCALENDAR');
    return ics.join('\r\n');
  }

  function lade(inhalt, name) {
    var blob = new Blob([inhalt], { type: 'text/calendar' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 2000);
  }

  window.Ics = { erzeuge: erzeuge, lade: lade, datumStempel: datumStempel, pad: pad };
})();
