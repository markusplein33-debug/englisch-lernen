// Tolerante Antwortbewertung: exakt / Rechtschreibfehler / sinngemäß / falsch.
window.Grading = (function () {

  var KONTRAKTIONEN = {
    "i'm": 'i am', "you're": 'you are', "he's": 'he is', "she's": 'she is',
    "it's": 'it is', "we're": 'we are', "they're": 'they are',
    "i've": 'i have', "you've": 'you have', "we've": 'we have', "they've": 'they have',
    "i'd": 'i would', "you'd": 'you would', "he'd": 'he would', "she'd": 'she would',
    "we'd": 'we would', "they'd": 'they would',
    "i'll": 'i will', "you'll": 'you will', "he'll": 'he will', "she'll": 'she will',
    "we'll": 'we will', "they'll": 'they will',
    "don't": 'do not', "doesn't": 'does not', "didn't": 'did not',
    "can't": 'cannot', "couldn't": 'could not', "won't": 'will not',
    "wouldn't": 'would not', "shouldn't": 'should not', "mustn't": 'must not',
    "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not',
    "haven't": 'have not', "hasn't": 'has not', "hadn't": 'had not',
    "there's": 'there is', "that's": 'that is', "what's": 'what is',
    "where's": 'where is', "who's": 'who is', "how's": 'how is', "let's": 'let us'
  };

  // Kleine Synonymgruppen (BE/AE + gängige Varianten) – Token werden auf das
  // erste Gruppenmitglied normalisiert.
  var SYNONYME = [
    ['bill', 'check'],
    ['toilet', 'restroom', 'bathroom', 'washroom', 'loo', 'lavatory'],
    ['shop', 'store'],
    ['taxi', 'cab'],
    ['underground', 'subway', 'metro', 'tube'],
    ['holiday', 'vacation'],
    ['holidays', 'vacations'],
    ['autumn', 'fall'],
    ['luggage', 'baggage'],
    ['mobile', 'cellphone', 'cell'],
    ['pharmacy', 'chemist', 'drugstore'],
    ['petrol', 'gas', 'gasoline', 'fuel'],
    ['motorway', 'highway', 'freeway'],
    ['lift', 'elevator'],
    ['flat', 'apartment'],
    ['city', 'town'],
    ['begin', 'start'],
    ['buy', 'purchase'],
    ['need', 'require'],
    ['want', 'like'],
    ['have', 'get', 'receive', 'got'],
    ['can', 'could', 'may'],
    ['will', 'would', 'shall'],
    ['excuse', 'pardon', 'sorry'],
    ['hello', 'hi', 'hey'],
    ['help', 'assist'],
    ['big', 'large'],
    ['small', 'little'],
    ['ticket', 'fare'],
    ['timetable', 'schedule'],
    ['queue', 'line'],
    ['crisps', 'chips'],
    ['sweets', 'candy'],
    ['trousers', 'pants'],
    ['trainers', 'sneakers'],
    ['rucksack', 'backpack'],
    ['return', 'roundtrip'],
    ['single', 'oneway'],
    ['doctor', 'physician'],
    ['ill', 'sick'],
    ['speak', 'talk']
  ];
  var SYN = {};
  SYNONYME.forEach(function (g) { g.forEach(function (w) { SYN[w] = g[0]; }); });

  // Füllwörter, die für den Sinn kaum eine Rolle spielen
  var STOPP = { the: 1, a: 1, an: 1, please: 1, 'oh': 1, 'well': 1, 'hey': 1 };

  function normalize(s) {
    s = (s || '').toLowerCase().trim();
    s = s.replace(/’/g, "'");
    Object.keys(KONTRAKTIONEN).forEach(function (k) {
      s = s.split(k).join(KONTRAKTIONEN[k]);
    });
    s = s.replace(/[.,!?;:"()\[\]\/\-–—]/g, ' ');
    s = s.replace(/'/g, '');
    s = s.replace(/\s+/g, ' ').trim();
    return s;
  }

  function tokens(s, mitSynonymen) {
    return normalize(s).split(' ').filter(function (t) {
      return t && !STOPP[t];
    }).map(function (t) {
      return mitSynonymen ? (SYN[t] || t) : t;
    });
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    var m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    var prev = new Array(n + 1), cur = new Array(n + 1);
    for (var j = 0; j <= n; j++) prev[j] = j;
    for (var i = 1; i <= m; i++) {
      cur[0] = i;
      for (var k = 1; k <= n; k++) {
        cur[k] = Math.min(prev[k] + 1, cur[k - 1] + 1,
          prev[k - 1] + (a[i - 1] === b[k - 1] ? 0 : 1));
      }
      var t = prev; prev = cur; cur = t;
    }
    return prev[n];
  }

  // Sind zwei Wörter „fast gleich"? (Tippfehler-Toleranz je nach Wortlänge)
  function fastGleich(a, b) {
    if (a === b) return true;
    var d = levenshtein(a, b);
    if (a.length <= 3) return false;         // kurze Wörter: exakt
    if (a.length <= 5) return d <= 1;
    if (a.length <= 8) return d <= 2;
    return d <= 3;
  }

  // Vergleicht Eingabe mit einem Ziel. Ergebnis-Stufen:
  //  'richtig'  – exakt (nach Normalisierung)
  //  'schreib'  – gleiche Wörter, nur Tippfehler          -> teilweise bestanden
  //  'sinn'     – sinngemäß richtig (Wortwahl/Reihenfolge) -> teilweise bestanden
  //  'falsch'
  function vergleiche(eingabe, ziel) {
    var ne = normalize(eingabe), nz = normalize(ziel);
    if (!ne) return 'falsch';
    if (ne === nz) return 'richtig';

    // Nur Tippfehler? Gesamter String nah beieinander
    var dist = levenshtein(ne, nz);
    var rel = dist / Math.max(ne.length, nz.length);
    if (rel <= 0.18) return 'schreib';

    // Wortweise: gleiche Wortfolge, einzelne Wörter mit Tippfehlern
    var te = tokens(eingabe, false), tz = tokens(ziel, false);
    if (te.length === tz.length && te.length > 0) {
      var alleFast = true, mindEinsAnders = false;
      for (var i = 0; i < te.length; i++) {
        if (!fastGleich(te[i], tz[i])) { alleFast = false; break; }
        if (te[i] !== tz[i]) mindEinsAnders = true;
      }
      if (alleFast) return mindEinsAnders ? 'schreib' : 'richtig';
    }

    // Sinngemäß: Inhaltswörter (mit Synonymen + Tippfehler-Toleranz) überlappen stark
    var se = tokens(eingabe, true), sz = tokens(ziel, true);
    if (!sz.length) return 'falsch';
    var getroffen = 0;
    var rest = se.slice();
    sz.forEach(function (w) {
      for (var i = 0; i < rest.length; i++) {
        if (rest[i] === w || fastGleich(rest[i], w)) {
          getroffen++; rest.splice(i, 1); return;
        }
      }
    });
    var abdeckung = getroffen / sz.length;               // wie viel vom Ziel getroffen
    var praezision = se.length ? getroffen / se.length : 0; // wie viel der Eingabe passt
    if (sz.length === 1) {
      // Einzelwort-Ziel: nur Synonym/Tippfehler zählt als sinngemäß
      return abdeckung >= 1 ? 'sinn' : 'falsch';
    }
    if (abdeckung >= 0.6 && praezision >= 0.5) return 'sinn';
    return 'falsch';
  }

  // Bewertet gegen Hauptziel + optionale Alternativen; beste Stufe gewinnt.
  function bewerte(eingabe, ziel, alternativen) {
    var stufen = { richtig: 3, schreib: 2, sinn: 1, falsch: 0 };
    var beste = 'falsch';
    [ziel].concat(alternativen || []).forEach(function (z) {
      var r = vergleiche(eingabe, z);
      if (stufen[r] > stufen[beste]) beste = r;
    });
    return beste;
  }

  return { bewerte: bewerte, vergleiche: vergleiche, normalize: normalize, levenshtein: levenshtein };
})();

// ===== Grammatik-Checker: erkennt typische Fehler und erklärt sie auf Deutsch =====
window.Grading.pruefe = (function () {
  var G = window.Grading;

  var IRREGULAR = {
    go: 'went', goed: 'went', buy: 'bought', buyed: 'bought', eat: 'ate', eated: 'ate',
    drink: 'drank', drinked: 'drank', see: 'saw', seed: 'saw', seen: 'saw',
    take: 'took', taked: 'took', come: 'came', comed: 'came', get: 'got', getted: 'got',
    give: 'gave', gived: 'gave', have: 'had', haved: 'had', make: 'made', maked: 'made',
    find: 'found', finded: 'found', pay: 'paid', payed: 'paid', say: 'said', sayed: 'said',
    tell: 'told', telled: 'told', think: 'thought', thinked: 'thought',
    speak: 'spoke', speaked: 'spoke', leave: 'left', leaved: 'left',
    write: 'wrote', writed: 'wrote', read: 'read', drive: 'drove', drived: 'drove',
    fly: 'flew', flyed: 'flew', sleep: 'slept', sleeped: 'slept',
    lose: 'lost', losed: 'lost', forget: 'forgot', forgetted: 'forgot',
    do: 'did', doed: 'did', be: 'was', is: 'was', are: 'were'
  };
  var VOKALE = { a: 1, e: 1, i: 1, o: 1, u: 1 };
  var PRONOMEN3 = { he: 1, she: 1, it: 1 };

  function tok(s) { return G.normalize(s).split(' ').filter(Boolean); }

  // LCS-Alignment: liefert Paare gleicher Wörter, daraus fehlend/zuviel/ersetzt
  function diff(a, b) {
    var m = a.length, n = b.length;
    var L = [];
    for (var i = 0; i <= m; i++) { L.push(new Array(n + 1).fill(0)); }
    for (i = m - 1; i >= 0; i--) for (var j = n - 1; j >= 0; j--) {
      L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    }
    var ops = []; i = 0; var k = 0;
    while (i < m && k < n) {
      if (a[i] === b[k]) { ops.push(['=', a[i], b[k]]); i++; k++; }
      else if (L[i + 1][k] >= L[i][k + 1]) { ops.push(['-', a[i], null]); i++; }
      else { ops.push(['+', null, b[k]]); k++; }
    }
    while (i < m) { ops.push(['-', a[i++], null]); }
    while (k < n) { ops.push(['+', null, b[k++]]); }
    // benachbarte -/+ zu "ersetzt" zusammenfassen
    var out = [];
    for (i = 0; i < ops.length; i++) {
      if (ops[i][0] === '-' && i + 1 < ops.length && ops[i + 1][0] === '+') {
        out.push(['~', ops[i][1], ops[i + 1][2]]); i++;
      } else if (ops[i][0] === '+' && i + 1 < ops.length && ops[i + 1][0] === '-') {
        out.push(['~', ops[i + 1][1], ops[i][2]]); i++;
      } else out.push(ops[i]);
    }
    return out;
  }

  function grammatikHinweise(eingabe, ziel) {
    var te = tok(eingabe), tz = tok(ziel);
    var ops = diff(te, tz);
    var hinweise = [];
    var nurGrammatik = true;   // alle Abweichungen durch Regeln erklärbar?
    var abweichungen = 0;

    for (var i = 0; i < ops.length; i++) {
      var op = ops[i], typ = op[0], von = op[1], zu = op[2];
      if (typ === '=') continue;
      abweichungen++;
      var erklaert = false;

      if (typ === '~') {
        // 3.-Person-s: go -> goes, work -> works
        if ((zu === von + 's' || zu === von + 'es')) {
          var subj = null;
          for (var j = i - 1; j >= 0; j--) { if (ops[j][0] === '=') { subj = ops[j][1]; break; } }
          hinweise.push('„' + von + '“ → „' + zu + '“: Bei he/she/it bekommt das Verb ein -s' +
            (subj && PRONOMEN3[subj] ? ' (wegen „' + subj + '“)' : '') + '.');
          erklaert = true;
        }
        // unregelmäßige Vergangenheit
        else if (IRREGULAR[von] === zu) {
          hinweise.push('„' + von + '“ → „' + zu + '“: Unregelmäßiges Verb – die Vergangenheitsform heißt „' + zu + '“.');
          erklaert = true;
        }
        // a/an
        else if (von === 'a' && zu === 'an') {
          hinweise.push('„a“ → „an“: Vor Vokal (a, e, i, o, u) heißt es „an“.');
          erklaert = true;
        } else if (von === 'an' && zu === 'a') {
          hinweise.push('„an“ → „a“: Vor Konsonant heißt es „a“.');
          erklaert = true;
        }
        // Plural-s
        else if (zu === von + 's' || zu === von + 'es') {
          hinweise.push('„' + von + '“ → „' + zu + '“: Hier fehlt das Plural-s.');
          erklaert = true;
        }
        else if (von === zu + 's') {
          hinweise.push('„' + von + '“ → „' + zu + '“: Hier ist die Einzahl richtig – kein -s.');
          erklaert = true;
        }
      }
      if (typ === '+') {
        if (zu === 'do' || zu === 'does' || zu === 'did') {
          hinweise.push('Es fehlt das Hilfsverb „' + zu + '“: Fragen und Verneinungen brauchen do/does/did (z. B. „Where do you live?“).');
          erklaert = true;
        } else if (zu === 'the' || zu === 'a' || zu === 'an') {
          hinweise.push('Es fehlt der Artikel „' + zu + '“.');
          erklaert = true;
        } else if (zu === 'to') {
          hinweise.push('Es fehlt das Wörtchen „to“ (z. B. „I would like to …“).');
          erklaert = true;
        }
      }
      if (typ === '-') {
        if (von === 'the' || von === 'a' || von === 'an') {
          hinweise.push('Der Artikel „' + von + '“ ist hier zu viel.');
          erklaert = true;
        }
      }
      if (!erklaert) nurGrammatik = false;
    }

    // Gleiche Wörter, andere Reihenfolge?
    if (!hinweise.length && abweichungen > 0) {
      var se = te.slice().sort().join(' '), sz = tz.slice().sort().join(' ');
      if (se === sz) {
        hinweise.push('Alle Wörter stimmen, aber die Satzstellung nicht. Im Englischen gilt meist: Subjekt – Verb – Objekt.');
        nurGrammatik = true;
      }
    }

    return { hinweise: hinweise, nurGrammatik: nurGrammatik && hinweise.length > 0 };
  }

  // Gesamtprüfung: kombiniert Stufen-Bewertung mit Grammatik-Erklärungen.
  return function (eingabe, ziel, alternativen) {
    var stufe = G.bewerte(eingabe, ziel, alternativen);
    var gr = grammatikHinweise(eingabe, ziel);
    if (stufe === 'richtig') return { stufe: 'richtig', hinweise: [] };
    // Inhalt eigentlich falsch/sinn, aber alle Abweichungen grammatisch erklärbar -> Stufe 'grammatik'
    if (gr.nurGrammatik && (stufe === 'falsch' || stufe === 'sinn' || stufe === 'schreib')) {
      return { stufe: 'grammatik', hinweise: gr.hinweise };
    }
    return { stufe: stufe, hinweise: gr.hinweise };
  };
})();
