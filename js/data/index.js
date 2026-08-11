// Zentrale Datenregistrierung – alle Deck-/Quiz-/Lektionsdateien rufen diese Helfer auf.
window.APP_DATA = {
  decks: [],
  quizzes: [],
  lessons: [],
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
