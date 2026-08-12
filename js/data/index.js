// Zentrale Datenregistrierung – alle Deck-/Quiz-/Lektionsdateien rufen diese Helfer auf.
window.APP_DATA = {
  decks: [],
  quizzes: [],
  lessons: [],
  // Eingebaute Erweiterungspakete – in den Einstellungen freischaltbar.
  PAKETE: [
    { id: 'alltag', titel: 'Alltag & Zuhause', emoji: '🏡',
      beschreibung: 'Familie, Haushalt, Tagesablauf, Gefühle und Meinungen' },
    { id: 'arbeit', titel: 'Arbeit & Business', emoji: '💼',
      beschreibung: 'Büro, E-Mails, Telefonate, Meetings, Job-Smalltalk' },
    { id: 'essen', titel: 'Essen & Kochen', emoji: '🍳',
      beschreibung: 'Lebensmittel, Zubereitung, Rezepte, Einkauf' },
    { id: 'technik', titel: 'Technik & Internet', emoji: '💻',
      beschreibung: 'Geräte, Apps, Internet – digitaler Alltag' },
    { id: 'grammatik2', titel: 'Grammatik-Erweiterung', emoji: '📐',
      beschreibung: 'if-Sätze, Passiv, Steigerung, Relativsätze' }
  ],
  aktivePakete: function () {
    var s = (window.Store && Store.load()) || {};
    return (s.pakete && s.pakete.aktiv) || [];
  },
  paketModus: function () {
    var s = (window.Store && Store.load()) || {};
    return (s.pakete && s.pakete.modus) || 'ergaenzen';
  },
  istSichtbar: function (obj) {
    var p = obj.paket || 'reise';
    return p === 'reise' || this.aktivePakete().indexOf(p) >= 0;
  },
  istBasis: function (obj) { return (obj.paket || 'reise') === 'reise'; },
  sichtbareDecks: function () {
    var self = this;
    return this.decks.filter(function (d) { return self.istSichtbar(d); });
  },
  sichtbareLessons: function () {
    var self = this;
    return this.lessons.filter(function (l) { return self.istSichtbar(l); });
  },
  sichtbareQuizzes: function () {
    var self = this;
    return this.quizzes.filter(function (q) { return self.istSichtbar(q); });
  },
  registerDeck: function (deck) { this.decks.push(deck); },
  registerQuiz: function (quiz) { this.quizzes.push(quiz); },
  registerLesson: function (lesson) {
    this.lessons.push(lesson);
    this.lessons.sort(function (a, b) { return a.reihenfolge - b.reihenfolge; });
  },
  alleKarten: function () {
    var out = [];
    this.decks.forEach(function (d) {
      d.karten.forEach(function (k) { out.push({ deck: d.id, karte: k }); });
    });
    return out;
  },
  findeKarte: function (id) {
    for (var i = 0; i < this.decks.length; i++) {
      var d = this.decks[i];
      for (var j = 0; j < d.karten.length; j++) {
        if (d.karten[j].id === id) return { deck: d, karte: d.karten[j] };
      }
    }
    return null;
  }
};
