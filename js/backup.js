// Backup-Helfer: Lernstand als Datei sichern + erinnern, wenn die Sicherung alt ist.
window.Backup = (function () {
  var TAGE_BIS_ERINNERUNG = 7;

  function exportDatei() {
    var s = Store.load();
    // Zeitstempel VOR dem Serialisieren setzen – so steht er mit in der Datei
    // und bleibt auch nach einem späteren Import erhalten.
    s.letztesBackup = Date.now();
    Store.save();
    var text = Store.exportJson();
    var blob = new Blob([text], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'englisch-backup-' + Store.heute() + '.json';
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 2000);
  }

  function hatFortschritt() {
    var s = Store.load();
    return Object.keys(s.srs).length > 0 || Object.keys(s.streak).length > 0 ||
      Object.keys(s.grammatik).length > 0;
  }

  // Sicherung fällig? Nur wenn es Fortschritt gibt und die letzte Sicherung alt ist.
  function istFaellig() {
    var s = Store.load();
    if (!hatFortschritt()) return false;
    var alter = Date.now() - (s.letztesBackup || 0);
    return alter > TAGE_BIS_ERINNERUNG * 24 * 3600 * 1000;
  }

  function letzteText() {
    var s = Store.load();
    if (!s.letztesBackup) return 'Noch nie gesichert.';
    var tage = Math.floor((Date.now() - s.letztesBackup) / (24 * 3600 * 1000));
    if (tage === 0) return 'Letzte Sicherung: heute.';
    if (tage === 1) return 'Letzte Sicherung: gestern.';
    return 'Letzte Sicherung: vor ' + tage + ' Tagen.';
  }

  return { exportDatei: exportDatei, istFaellig: istFaellig, letzteText: letzteText };
})();
