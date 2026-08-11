// grammar-lessons.js — Grammatik-Lektionen für die Englisch-Lern-App
// UI: Deutsch, Lerninhalt: Englisch. Vanilla JS, wird über APP_DATA.registerLesson() geladen.

/* ===== Lektion 1: Simple Present ===== */
APP_DATA.registerLesson({
  id: 'simple-present',
  titel: 'Simple Present',
  reihenfolge: 1,
  lektion: [
    {
      ueberschrift: 'Wann benutzt man es?',
      text: 'Das Simple Present beschreibt Gewohnheiten, regelmäßige Abläufe und allgemeine Fakten. Typische Signalwörter sind: always, often, usually, sometimes, never, every day.',
      beispiele: [
        { en: 'I drink coffee every morning.', de: 'Ich trinke jeden Morgen Kaffee.' },
        { en: 'The sun rises in the east.', de: 'Die Sonne geht im Osten auf.' }
      ]
    },
    {
      ueberschrift: 'Bildung',
      text: 'Man verwendet die Grundform des Verbs. Bei he/she/it wird ein -s angehängt (he works). Endet das Verb auf -o, -ch, -sh, -ss oder -x, hängt man -es an (goes, watches). Bei Konsonant + y wird y zu ie (study → studies).',
      beispiele: [
        { en: 'She works in a hotel.', de: 'Sie arbeitet in einem Hotel.' },
        { en: 'He watches TV in the evening.', de: 'Er sieht abends fern.' },
        { en: 'My sister studies English.', de: 'Meine Schwester lernt Englisch.' }
      ]
    },
    {
      ueberschrift: 'Besondere Verben: be und have',
      text: 'Das Verb "be" ist unregelmäßig: I am, you/we/they are, he/she/it is. Bei "have" heißt es bei he/she/it "has".',
      beispiele: [
        { en: 'I am tired.', de: 'Ich bin müde.' },
        { en: 'She has two brothers.', de: 'Sie hat zwei Brüder.' }
      ]
    },
    {
      ueberschrift: 'Merksatz',
      text: 'He, she, it – das s muss mit! Dieser Reim hilft, das -s bei der dritten Person Singular nicht zu vergessen.',
      beispiele: [
        { en: 'It rains a lot in autumn.', de: 'Im Herbst regnet es viel.' }
      ]
    }
  ],
  uebungen: [
    { id: 'sp-u01', typ: 'mc', frage: 'He ___ coffee every morning.',
      optionen: ['drink', 'drinks', 'drinking', 'drank'], richtig: 1,
      erklaerung: 'he/she/it → Verb + s.' },
    { id: 'sp-u02', typ: 'luecke', frage: 'They ___ (live) in Berlin.',
      antwort: ['live'], erklaerung: 'Bei they steht die Grundform ohne -s.' },
    { id: 'sp-u03', typ: 'mc', frage: 'My sister ___ TV every evening.',
      optionen: ['watch', 'watchs', 'watches', 'watching'], richtig: 2,
      erklaerung: 'Nach -ch wird -es angehängt: watches.' },
    { id: 'sp-u04', typ: 'luecke', frage: 'She ___ (go) to work by bus.',
      antwort: ['goes'], erklaerung: 'go endet auf -o → goes.' },
    { id: 'sp-u05', typ: 'mc', frage: 'We ___ from Germany.',
      optionen: ['is', 'am', 'be', 'are'], richtig: 3,
      erklaerung: 'we/you/they → are.' },
    { id: 'sp-u06', typ: 'luecke', frage: 'He ___ (have) a new car.',
      antwort: ['has'], erklaerung: 'have wird bei he/she/it zu has.' },
    { id: 'sp-u07', typ: 'mc', frage: 'The shop ___ at 9 o\'clock.',
      optionen: ['opens', 'open', 'opening', 'is open at'], richtig: 0,
      erklaerung: 'the shop = it → Verb + s.' },
    { id: 'sp-u08', typ: 'luecke', frage: 'My friend ___ (study) English at university.',
      antwort: ['studies'], erklaerung: 'Konsonant + y → y wird zu ie: studies.' },
    { id: 'sp-u09', typ: 'mc', frage: 'I ___ my grandparents every Sunday.',
      optionen: ['visits', 'visiting', 'visit', 'am visit'], richtig: 2,
      erklaerung: 'Bei I steht die Grundform: visit.' },
    { id: 'sp-u10', typ: 'luecke', frage: 'It often ___ (rain) in April.',
      antwort: ['rains'], erklaerung: 'it → Verb + s: rains.' }
  ]
});

/* ===== Lektion 2: Present Progressive ===== */
APP_DATA.registerLesson({
  id: 'present-progressive',
  titel: 'Present Progressive',
  reihenfolge: 2,
  lektion: [
    {
      ueberschrift: 'Wann benutzt man es?',
      text: 'Das Present Progressive beschreibt Handlungen, die gerade jetzt oder im aktuellen Zeitraum ablaufen. Signalwörter: now, right now, at the moment, look!, listen!',
      beispiele: [
        { en: 'I am reading a book at the moment.', de: 'Ich lese gerade ein Buch.' },
        { en: 'Look! It is raining.', de: 'Schau! Es regnet gerade.' }
      ]
    },
    {
      ueberschrift: 'Bildung',
      text: 'Form von be (am/is/are) + Verb mit -ing. Ein stummes -e am Verbende fällt weg (make → making). Bei kurzen betonten Silben wird der Endkonsonant verdoppelt (sit → sitting, swim → swimming).',
      beispiele: [
        { en: 'She is making dinner.', de: 'Sie kocht gerade Abendessen.' },
        { en: 'The children are swimming in the lake.', de: 'Die Kinder schwimmen gerade im See.' }
      ]
    },
    {
      ueberschrift: 'Abgrenzung zum Simple Present',
      text: 'Simple Present = regelmäßig/immer (I work every day). Present Progressive = gerade jetzt (I am working right now). Zustandsverben wie know, like, want stehen normalerweise nicht im Progressive.',
      beispiele: [
        { en: 'I usually drink tea, but today I am drinking coffee.', de: 'Normalerweise trinke ich Tee, aber heute trinke ich Kaffee.' },
        { en: 'I know the answer.', de: 'Ich kenne die Antwort. (nicht: I am knowing)' }
      ]
    }
  ],
  uebungen: [
    { id: 'pp-u01', typ: 'mc', frage: 'Listen! The birds ___ .',
      optionen: ['sing', 'sings', 'are singing', 'is singing'], richtig: 2,
      erklaerung: 'Listen! zeigt: Es passiert gerade → are singing (Plural).' },
    { id: 'pp-u02', typ: 'luecke', frage: 'She is ___ (make) dinner right now.',
      antwort: ['making'], erklaerung: 'Stummes -e fällt weg: make → making.' },
    { id: 'pp-u03', typ: 'mc', frage: 'I ___ TV at the moment.',
      optionen: ['am watching', 'watching', 'watch', 'watches'], richtig: 0,
      erklaerung: 'at the moment → Present Progressive: am + watching.' },
    { id: 'pp-u04', typ: 'luecke', frage: 'The children are ___ (swim) in the pool.',
      antwort: ['swimming'], erklaerung: 'Kurze betonte Silbe → Konsonant verdoppeln: swimming.' },
    { id: 'pp-u05', typ: 'mc', frage: 'What ___ you doing?',
      optionen: ['is', 'are', 'do', 'am'], richtig: 1,
      erklaerung: 'you → are: What are you doing?' },
    { id: 'pp-u06', typ: 'luecke', frage: 'He is ___ (sit) on the sofa.',
      antwort: ['sitting'], erklaerung: 'sit → sitting (Konsonant verdoppeln).' },
    { id: 'pp-u07', typ: 'mc', frage: 'Welcher Satz ist richtig?',
      optionen: ['I am knowing the answer.', 'I know the answer.', 'I knowing the answer.', 'I am know the answer.'], richtig: 1,
      erklaerung: 'know ist ein Zustandsverb → kein Progressive.' },
    { id: 'pp-u08', typ: 'luecke', frage: 'Look! It ___ (rain).',
      antwort: ['is raining', "'s raining"], erklaerung: 'Look! → gerade jetzt: It is raining.' },
    { id: 'pp-u09', typ: 'mc', frage: 'We ___ for the bus right now.',
      optionen: ['waits', 'wait', 'is waiting', 'are waiting'], richtig: 3,
      erklaerung: 'we → are + waiting.' },
    { id: 'pp-u10', typ: 'luecke', frage: 'I usually walk to work, but today I ___ (take) the train.',
      antwort: ['am taking', "'m taking"], erklaerung: 'today = aktueller Zeitraum → am taking.' }
  ]
});

/* ===== Lektion 3: Simple Past ===== */
APP_DATA.registerLesson({
  id: 'simple-past',
  titel: 'Simple Past',
  reihenfolge: 3,
  lektion: [
    {
      ueberschrift: 'Wann benutzt man es?',
      text: 'Das Simple Past beschreibt abgeschlossene Handlungen in der Vergangenheit mit klarer Zeitangabe. Signalwörter: yesterday, last week, in 2010, two days ago.',
      beispiele: [
        { en: 'I visited London last year.', de: 'Ich habe letztes Jahr London besucht.' },
        { en: 'She called me yesterday.', de: 'Sie hat mich gestern angerufen.' }
      ]
    },
    {
      ueberschrift: 'Regelmäßige Verben',
      text: 'An regelmäßige Verben wird -ed angehängt (work → worked). Endet das Verb auf -e, kommt nur -d dazu (live → lived). Bei Konsonant + y wird y zu i (study → studied).',
      beispiele: [
        { en: 'We worked all day.', de: 'Wir haben den ganzen Tag gearbeitet.' },
        { en: 'He lived in Spain for two years.', de: 'Er lebte zwei Jahre in Spanien.' }
      ]
    },
    {
      ueberschrift: 'Wichtige unregelmäßige Verben',
      text: 'Viele häufige Verben sind unregelmäßig und müssen auswendig gelernt werden: go → went, see → saw, have → had, take → took, buy → bought, eat → ate, come → came, get → got, make → made, say → said.',
      beispiele: [
        { en: 'We went to the beach.', de: 'Wir sind an den Strand gegangen.' },
        { en: 'I bought a new phone.', de: 'Ich habe ein neues Handy gekauft.' },
        { en: 'She saw a great film.', de: 'Sie hat einen tollen Film gesehen.' }
      ]
    },
    {
      ueberschrift: 'be in der Vergangenheit',
      text: 'Das Verb "be" hat zwei Vergangenheitsformen: was (I/he/she/it) und were (you/we/they).',
      beispiele: [
        { en: 'I was at home yesterday.', de: 'Ich war gestern zu Hause.' },
        { en: 'They were very happy.', de: 'Sie waren sehr glücklich.' }
      ]
    }
  ],
  uebungen: [
    { id: 'spa-u01', typ: 'mc', frage: 'We ___ to Italy last summer.',
      optionen: ['go', 'goed', 'went', 'gone'], richtig: 2,
      erklaerung: 'go ist unregelmäßig: go → went.' },
    { id: 'spa-u02', typ: 'luecke', frage: 'She ___ (work) late yesterday.',
      antwort: ['worked'], erklaerung: 'Regelmäßiges Verb → work + ed.' },
    { id: 'spa-u03', typ: 'mc', frage: 'I ___ a new jacket last week.',
      optionen: ['buyed', 'bought', 'buy', 'buying'], richtig: 1,
      erklaerung: 'buy ist unregelmäßig: buy → bought.' },
    { id: 'spa-u04', typ: 'luecke', frage: 'He ___ (see) his friends on Saturday.',
      antwort: ['saw'], erklaerung: 'see ist unregelmäßig: see → saw.' },
    { id: 'spa-u05', typ: 'mc', frage: 'They ___ at the hotel two days ago.',
      optionen: ['was', 'are', 'is', 'were'], richtig: 3,
      erklaerung: 'they → were.' },
    { id: 'spa-u06', typ: 'luecke', frage: 'We ___ (eat) pizza last night.',
      antwort: ['ate'], erklaerung: 'eat ist unregelmäßig: eat → ate.' },
    { id: 'spa-u07', typ: 'mc', frage: 'She ___ English at school.',
      optionen: ['studied', 'studyed', 'studys', 'study'], richtig: 0,
      erklaerung: 'Konsonant + y → y wird zu i: studied.' },
    { id: 'spa-u08', typ: 'luecke', frage: 'I ___ (have) a great time in Rome.',
      antwort: ['had'], erklaerung: 'have ist unregelmäßig: have → had.' },
    { id: 'spa-u09', typ: 'mc', frage: 'He ___ the bus to the airport.',
      optionen: ['taked', 'take', 'took', 'taken'], richtig: 2,
      erklaerung: 'take ist unregelmäßig: take → took.' },
    { id: 'spa-u10', typ: 'luecke', frage: 'I ___ (be) very tired after the trip.',
      antwort: ['was'], erklaerung: 'I → was (be in der Vergangenheit).' }
  ]
});

/* ===== Lektion 4: Present Perfect ===== */
APP_DATA.registerLesson({
  id: 'present-perfect',
  titel: 'Present Perfect',
  reihenfolge: 4,
  lektion: [
    {
      ueberschrift: 'Wann benutzt man es?',
      text: 'Das Present Perfect verbindet Vergangenheit und Gegenwart: Das Ergebnis ist jetzt wichtig oder der Zeitraum dauert noch an. Signalwörter: just, already, yet, ever, never, since, for.',
      beispiele: [
        { en: 'I have lost my key.', de: 'Ich habe meinen Schlüssel verloren. (Er ist jetzt weg.)' },
        { en: 'She has lived here since 2015.', de: 'Sie wohnt seit 2015 hier.' }
      ]
    },
    {
      ueberschrift: 'Bildung',
      text: 'have/has + Past Participle (3. Verbform). Regelmäßig: worked, visited. Unregelmäßig: go → gone, see → seen, be → been, eat → eaten, do → done, write → written.',
      beispiele: [
        { en: 'We have visited Paris twice.', de: 'Wir haben Paris zweimal besucht.' },
        { en: 'He has done his homework.', de: 'Er hat seine Hausaufgaben gemacht.' }
      ]
    },
    {
      ueberschrift: 'since oder for?',
      text: 'since + Zeitpunkt (since Monday, since 2020). for + Zeitraum (for two years, for a week).',
      beispiele: [
        { en: 'I have known her since 2019.', de: 'Ich kenne sie seit 2019.' },
        { en: 'They have been here for three days.', de: 'Sie sind seit drei Tagen hier.' }
      ]
    },
    {
      ueberschrift: 'Abgrenzung zum Simple Past',
      text: 'Mit konkreter vergangener Zeitangabe (yesterday, last year, in 2010) steht IMMER das Simple Past. Ohne Zeitangabe oder bei Ergebnis-Bezug zur Gegenwart steht das Present Perfect.',
      beispiele: [
        { en: 'I saw the film last week.', de: 'Ich habe den Film letzte Woche gesehen. (Simple Past)' },
        { en: 'I have seen this film before.', de: 'Ich habe diesen Film schon einmal gesehen. (Present Perfect)' }
      ]
    }
  ],
  uebungen: [
    { id: 'pf-u01', typ: 'mc', frage: 'I ___ my key. I can\'t open the door.',
      optionen: ['have lost', 'lost', 'lose', 'am losing'], richtig: 0,
      erklaerung: 'Ergebnis ist jetzt wichtig → Present Perfect: have lost.' },
    { id: 'pf-u02', typ: 'luecke', frage: 'She has ___ (be) to London three times.',
      antwort: ['been'], erklaerung: 'Past Participle von be: been.' },
    { id: 'pf-u03', typ: 'mc', frage: 'He ___ here since 2018.',
      optionen: ['lives', 'lived', 'has lived', 'is living since'], richtig: 2,
      erklaerung: 'since + andauernder Zeitraum → Present Perfect: has lived.' },
    { id: 'pf-u04', typ: 'luecke', frage: 'We have ___ (see) this film before.',
      antwort: ['seen'], erklaerung: 'Past Participle von see: seen.' },
    { id: 'pf-u05', typ: 'mc', frage: 'They ___ to Spain last year.',
      optionen: ['have gone', 'have been', 'go', 'went'], richtig: 3,
      erklaerung: 'last year = konkrete Zeitangabe → Simple Past: went.' },
    { id: 'pf-u06', typ: 'luecke', frage: 'I have known her ___ (since/for) five years.',
      antwort: ['for'], erklaerung: 'five years ist ein Zeitraum → for.' },
    { id: 'pf-u07', typ: 'mc', frage: 'Have you ever ___ sushi?',
      optionen: ['ate', 'eaten', 'eat', 'eating'], richtig: 1,
      erklaerung: 'Present Perfect braucht das Past Participle: eaten.' },
    { id: 'pf-u08', typ: 'luecke', frage: 'He has lived here ___ (since/for) 2020.',
      antwort: ['since'], erklaerung: '2020 ist ein Zeitpunkt → since.' },
    { id: 'pf-u09', typ: 'mc', frage: 'She ___ her homework yet.',
      optionen: ['didn\'t finish', 'hasn\'t finished', 'doesn\'t finish', 'isn\'t finishing'], richtig: 1,
      erklaerung: 'yet → Present Perfect (verneint): hasn\'t finished.' },
    { id: 'pf-u10', typ: 'luecke', frage: 'They have just ___ (write) an email.',
      antwort: ['written'], erklaerung: 'Past Participle von write: written.' }
  ]
});

/* ===== Lektion 5: Futur (will vs. going to) ===== */
APP_DATA.registerLesson({
  id: 'futur',
  titel: 'Futur: will & going to',
  reihenfolge: 5,
  lektion: [
    {
      ueberschrift: 'will-Futur',
      text: 'will + Grundform benutzt man für spontane Entscheidungen, Versprechen und Vorhersagen ohne konkrete Anzeichen. Verneinung: will not = won\'t.',
      beispiele: [
        { en: 'I will help you with your bags.', de: 'Ich helfe dir mit deinen Taschen. (spontan)' },
        { en: 'It will probably rain tomorrow.', de: 'Es wird morgen wahrscheinlich regnen.' }
      ]
    },
    {
      ueberschrift: 'going to-Futur',
      text: 'be going to + Grundform benutzt man für Pläne und Absichten sowie für Vorhersagen mit sichtbaren Anzeichen.',
      beispiele: [
        { en: 'We are going to visit Rome next month.', de: 'Wir werden nächsten Monat Rom besuchen. (Plan)' },
        { en: 'Look at the clouds! It is going to rain.', de: 'Schau dir die Wolken an! Es wird gleich regnen.' }
      ]
    },
    {
      ueberschrift: 'Vergleich',
      text: 'Faustregel: Entscheidung im Moment des Sprechens → will. Entscheidung stand schon vorher fest (Plan) → going to.',
      beispiele: [
        { en: 'The phone is ringing. – I\'ll answer it!', de: 'Das Telefon klingelt. – Ich gehe ran! (spontan)' },
        { en: 'I\'m going to study medicine.', de: 'Ich habe vor, Medizin zu studieren. (Plan)' }
      ]
    }
  ],
  uebungen: [
    { id: 'fu-u01', typ: 'mc', frage: 'The phone is ringing. – I ___ answer it!',
      optionen: ['am going to', 'will', 'am', 'going to'], richtig: 1,
      erklaerung: 'Spontane Entscheidung → will.' },
    { id: 'fu-u02', typ: 'luecke', frage: 'Look at those dark clouds! It is ___ to rain.',
      antwort: ['going'], erklaerung: 'Sichtbare Anzeichen → going to.' },
    { id: 'fu-u03', typ: 'mc', frage: 'We ___ visit my grandmother next weekend. It\'s all planned.',
      optionen: ['will to', 'won\'t to', 'are going to', 'going'], richtig: 2,
      erklaerung: 'Fester Plan → are going to.' },
    { id: 'fu-u04', typ: 'luecke', frage: 'I promise I ___ (will/going to) call you tonight.',
      antwort: ['will', "'ll"], erklaerung: 'Versprechen → will.' },
    { id: 'fu-u05', typ: 'mc', frage: 'Was ist die Kurzform von "will not"?',
      optionen: ['willn\'t', 'won\'t', 'wan\'t', 'welln\'t'], richtig: 1,
      erklaerung: 'will not = won\'t.' },
    { id: 'fu-u06', typ: 'luecke', frage: 'She is going to ___ (buy) a new car next year.',
      antwort: ['buy'], erklaerung: 'Nach going to steht die Grundform: buy.' },
    { id: 'fu-u07', typ: 'mc', frage: 'I think our team ___ the game tomorrow.',
      optionen: ['will win', 'wins yesterday', 'won', 'is win'], richtig: 0,
      erklaerung: 'Vorhersage mit "I think" → will win.' },
    { id: 'fu-u08', typ: 'luecke', frage: 'It\'s cold in here. – I ___ (will) close the window.',
      antwort: ['will', "'ll"], erklaerung: 'Spontanes Angebot → will.' },
    { id: 'fu-u09', typ: 'mc', frage: 'They ___ move to Hamburg. They have already found a flat.',
      optionen: ['will spontaneously', 'won\'t', 'are going to', 'were'], richtig: 2,
      erklaerung: 'Der Plan steht fest (Wohnung gefunden) → are going to.' },
    { id: 'fu-u10', typ: 'luecke', frage: 'Don\'t worry, I ___ not tell anyone. (Langform)',
      antwort: ['will'], erklaerung: 'Versprechen → will not (Kurzform: won\'t).' }
  ]
});

/* ===== Lektion 6: Fragen & Verneinung ===== */
APP_DATA.registerLesson({
  id: 'fragen-verneinung',
  titel: 'Fragen & Verneinung',
  reihenfolge: 6,
  lektion: [
    {
      ueberschrift: 'Fragen mit do/does/did',
      text: 'Im Simple Present bildet man Fragen mit do (I/you/we/they) oder does (he/she/it), im Simple Past mit did. Nach do/does/did steht immer die Grundform des Verbs.',
      beispiele: [
        { en: 'Do you like pizza?', de: 'Magst du Pizza?' },
        { en: 'Does she speak English?', de: 'Spricht sie Englisch?' },
        { en: 'Did they visit the museum?', de: 'Haben sie das Museum besucht?' }
      ]
    },
    {
      ueberschrift: 'Verneinung',
      text: 'Verneint wird mit don\'t (do not), doesn\'t (does not) oder didn\'t (did not) + Grundform.',
      beispiele: [
        { en: 'I don\'t eat meat.', de: 'Ich esse kein Fleisch.' },
        { en: 'He doesn\'t work on Sundays.', de: 'Er arbeitet sonntags nicht.' },
        { en: 'We didn\'t see the film.', de: 'Wir haben den Film nicht gesehen.' }
      ]
    },
    {
      ueberschrift: 'Fragewörter',
      text: 'Fragewörter stehen vor do/does/did: What, Where, When, Why, Who, How.',
      beispiele: [
        { en: 'Where do you live?', de: 'Wo wohnst du?' },
        { en: 'When did the train leave?', de: 'Wann ist der Zug abgefahren?' }
      ]
    },
    {
      ueberschrift: 'Achtung: be und Modalverben',
      text: 'Bei be und Modalverben (can, must ...) braucht man kein do: Are you tired? Can she swim? Is he at home?',
      beispiele: [
        { en: 'Are you hungry?', de: 'Bist du hungrig?' },
        { en: 'Can you help me?', de: 'Kannst du mir helfen?' }
      ]
    }
  ],
  uebungen: [
    { id: 'fv-u01', typ: 'mc', frage: '___ she speak French?',
      optionen: ['Do', 'Does', 'Is', 'Did she speaks'], richtig: 1,
      erklaerung: 'he/she/it → does + Grundform.' },
    { id: 'fv-u02', typ: 'luecke', frage: 'I ___ (verneine: like) coffee. (Kurzform)',
      antwort: ["don't like", 'do not like'], erklaerung: 'I → don\'t + Grundform.' },
    { id: 'fv-u03', typ: 'mc', frage: '___ you go to the party last night?',
      optionen: ['Do', 'Does', 'Did', 'Are'], richtig: 2,
      erklaerung: 'last night = Vergangenheit → Did.' },
    { id: 'fv-u04', typ: 'luecke', frage: 'He ___ (verneine: work) on Sundays. (Kurzform)',
      antwort: ["doesn't work", 'does not work'], erklaerung: 'he → doesn\'t + Grundform.' },
    { id: 'fv-u05', typ: 'mc', frage: 'Welcher Satz ist richtig?',
      optionen: ['Does she speaks English?', 'Does she speak English?', 'Do she speak English?', 'Speaks she English?'], richtig: 1,
      erklaerung: 'Nach does steht die Grundform: speak (ohne -s).' },
    { id: 'fv-u06', typ: 'luecke', frage: 'We ___ (verneine: see) the film yesterday. (Kurzform)',
      antwort: ["didn't see", 'did not see'], erklaerung: 'Vergangenheit → didn\'t + Grundform.' },
    { id: 'fv-u07', typ: 'mc', frage: 'Where ___ you live?',
      optionen: ['does', 'are', 'did you lived', 'do'], richtig: 3,
      erklaerung: 'you → do: Where do you live?' },
    { id: 'fv-u08', typ: 'luecke', frage: '___ (do/does) your brother play football?',
      antwort: ['does'], erklaerung: 'your brother = he → Does.' },
    { id: 'fv-u09', typ: 'mc', frage: '___ you tired?',
      optionen: ['Do', 'Does', 'Are', 'Did'], richtig: 2,
      erklaerung: 'Bei be braucht man kein do: Are you tired?' },
    { id: 'fv-u10', typ: 'luecke', frage: 'When ___ (do, Vergangenheit) the train leave?',
      antwort: ['did'], erklaerung: 'Frage in der Vergangenheit → did + Grundform.' }
  ]
});

/* ===== Lektion 7: Modalverben ===== */
APP_DATA.registerLesson({
  id: 'modalverben',
  titel: 'Modalverben',
  reihenfolge: 7,
  lektion: [
    {
      ueberschrift: 'Was sind Modalverben?',
      text: 'Modalverben wie can, could, must, should, would drücken Fähigkeit, Erlaubnis, Pflicht oder Ratschläge aus. Nach ihnen steht immer die Grundform ohne to, und sie bekommen kein -s bei he/she/it.',
      beispiele: [
        { en: 'She can swim very well.', de: 'Sie kann sehr gut schwimmen.' },
        { en: 'He must go now.', de: 'Er muss jetzt gehen.' }
      ]
    },
    {
      ueberschrift: 'can und could',
      text: 'can = können (Fähigkeit, Erlaubnis). could = konnte (Vergangenheit) oder höfliche Bitte (Could you help me?).',
      beispiele: [
        { en: 'I can speak three languages.', de: 'Ich kann drei Sprachen sprechen.' },
        { en: 'Could you open the window, please?', de: 'Könntest du bitte das Fenster öffnen?' }
      ]
    },
    {
      ueberschrift: 'must und should',
      text: 'must = müssen (starke Pflicht). mustn\'t = nicht dürfen (Verbot!). should = sollten (Ratschlag).',
      beispiele: [
        { en: 'You must show your passport.', de: 'Sie müssen Ihren Pass zeigen.' },
        { en: 'You mustn\'t smoke here.', de: 'Sie dürfen hier nicht rauchen.' },
        { en: 'You should drink more water.', de: 'Du solltest mehr Wasser trinken.' }
      ]
    },
    {
      ueberschrift: 'would',
      text: 'would benutzt man für höfliche Wünsche und Angebote: I would like ... (Ich hätte gern ...), Would you like ...? (Möchten Sie ...?).',
      beispiele: [
        { en: 'I would like a cup of tea.', de: 'Ich hätte gern eine Tasse Tee.' },
        { en: 'Would you like some cake?', de: 'Möchtest du etwas Kuchen?' }
      ]
    }
  ],
  uebungen: [
    { id: 'mo-u01', typ: 'mc', frage: 'She ___ swim very well.',
      optionen: ['cans', 'can to', 'can', 'is can'], richtig: 2,
      erklaerung: 'Modalverben bekommen kein -s und kein to: can swim.' },
    { id: 'mo-u02', typ: 'luecke', frage: '___ (höfliche Bitte mit can) you help me, please?',
      antwort: ['could', 'can'], erklaerung: 'Höfliche Bitte: Could you ...? (auch Can ist möglich, could ist höflicher).' },
    { id: 'mo-u03', typ: 'mc', frage: 'You ___ smoke here. It is forbidden.',
      optionen: ['mustn\'t', 'must', 'should', 'don\'t must'], richtig: 0,
      erklaerung: 'Verbot → mustn\'t (= nicht dürfen).' },
    { id: 'mo-u04', typ: 'luecke', frage: 'You ___ (sollten) see a doctor.',
      antwort: ['should'], erklaerung: 'Ratschlag → should.' },
    { id: 'mo-u05', typ: 'mc', frage: 'I ___ like a coffee, please.',
      optionen: ['should', 'would', 'must', 'can'], richtig: 1,
      erklaerung: 'Höflicher Wunsch: I would like = ich hätte gern.' },
    { id: 'mo-u06', typ: 'luecke', frage: 'You ___ (müssen) show your ticket at the entrance.',
      antwort: ['must', 'have to'], erklaerung: 'Pflicht → must (oder have to).' },
    { id: 'mo-u07', typ: 'mc', frage: 'Welcher Satz ist richtig?',
      optionen: ['He musts go now.', 'He must to go now.', 'He must go now.', 'He must goes now.'], richtig: 2,
      erklaerung: 'Nach must steht die Grundform ohne to: must go.' },
    { id: 'mo-u08', typ: 'luecke', frage: 'When I was five, I ___ (can, Vergangenheit) already read.',
      antwort: ['could'], erklaerung: 'Vergangenheit von can → could.' },
    { id: 'mo-u09', typ: 'mc', frage: '___ you like some more tea?',
      optionen: ['Must', 'Should', 'Can', 'Would'], richtig: 3,
      erklaerung: 'Höfliches Angebot: Would you like ...?' },
    { id: 'mo-u10', typ: 'luecke', frage: 'I ___ (verneine: can) find my passport. (Kurzform)',
      antwort: ["can't find", 'cannot find', 'can not find'], erklaerung: 'Verneinung von can: can\'t / cannot.' }
  ]
});

/* ===== Lektion 8: Artikel & Plural ===== */
APP_DATA.registerLesson({
  id: 'artikel-plural',
  titel: 'Artikel & Plural',
  reihenfolge: 8,
  lektion: [
    {
      ueberschrift: 'a oder an?',
      text: 'a steht vor Konsonanten-LAUT (a car, a hotel, a university – "ju" klingt wie Konsonant). an steht vor Vokal-LAUT (an apple, an hour – das h ist stumm).',
      beispiele: [
        { en: 'a car, a hotel, a university', de: 'ein Auto, ein Hotel, eine Universität' },
        { en: 'an apple, an egg, an hour', de: 'ein Apfel, ein Ei, eine Stunde' }
      ]
    },
    {
      ueberschrift: 'the',
      text: 'the benutzt man, wenn klar ist, welche Person oder Sache gemeint ist, oder wenn etwas einzigartig ist (the sun, the moon). Kein Artikel steht bei allgemeinen Aussagen im Plural (I like dogs) und meist vor Ländern, Städten, Mahlzeiten und Sprachen.',
      beispiele: [
        { en: 'The hotel we booked is great.', de: 'Das Hotel, das wir gebucht haben, ist toll.' },
        { en: 'I like dogs.', de: 'Ich mag Hunde. (allgemein, kein Artikel)' }
      ]
    },
    {
      ueberschrift: 'Regelmäßiger Plural',
      text: 'Meist hängt man -s an (car → cars). Nach -ch, -sh, -s, -ss, -x kommt -es (bus → buses, watch → watches). Konsonant + y → -ies (city → cities).',
      beispiele: [
        { en: 'two cars, three buses, many cities', de: 'zwei Autos, drei Busse, viele Städte' }
      ]
    },
    {
      ueberschrift: 'Unregelmäßiger Plural',
      text: 'Wichtige Ausnahmen: man → men, woman → women, child → children, foot → feet, tooth → teeth, mouse → mice, person → people.',
      beispiele: [
        { en: 'two children, many people', de: 'zwei Kinder, viele Menschen' }
      ]
    }
  ],
  uebungen: [
    { id: 'ap-u01', typ: 'mc', frage: 'I need ___ umbrella.',
      optionen: ['a', 'an', 'the a', '—'], richtig: 1,
      erklaerung: 'umbrella beginnt mit Vokal-Laut → an.' },
    { id: 'ap-u02', typ: 'luecke', frage: 'She works in ___ (a/an) hotel.',
      antwort: ['a'], erklaerung: 'hotel beginnt mit Konsonanten-Laut → a.' },
    { id: 'ap-u03', typ: 'mc', frage: 'He is waiting for ___ hour.',
      optionen: ['a', 'the an', 'an', '—'], richtig: 2,
      erklaerung: 'Das h in hour ist stumm (Vokal-Laut) → an.' },
    { id: 'ap-u04', typ: 'luecke', frage: 'My brother studies at ___ (a/an) university.',
      antwort: ['a'], erklaerung: 'university klingt wie "ju" (Konsonanten-Laut) → a.' },
    { id: 'ap-u05', typ: 'mc', frage: 'Was ist der Plural von "child"?',
      optionen: ['childs', 'childes', 'childrens', 'children'], richtig: 3,
      erklaerung: 'child hat einen unregelmäßigen Plural: children.' },
    { id: 'ap-u06', typ: 'luecke', frage: 'There are three ___ (bus) at the station.',
      antwort: ['buses', 'busses'], erklaerung: 'Nach -s kommt -es: buses.' },
    { id: 'ap-u07', typ: 'mc', frage: 'Was ist der Plural von "city"?',
      optionen: ['cities', 'citys', 'cityes', 'cites'], richtig: 0,
      erklaerung: 'Konsonant + y → -ies: cities.' },
    { id: 'ap-u08', typ: 'luecke', frage: 'Two ___ (woman) are sitting in the café.',
      antwort: ['women'], erklaerung: 'woman hat einen unregelmäßigen Plural: women.' },
    { id: 'ap-u09', typ: 'mc', frage: '___ sun is shining today.',
      optionen: ['A', 'An', 'The', '—'], richtig: 2,
      erklaerung: 'Einzigartige Dinge → the: the sun.' },
    { id: 'ap-u10', typ: 'luecke', frage: 'My ___ (foot) hurt after the long walk. (Plural)',
      antwort: ['feet'], erklaerung: 'foot hat einen unregelmäßigen Plural: feet.' }
  ]
});

/* ===== Lektion 9: Präpositionen ===== */
APP_DATA.registerLesson({
  id: 'praepositionen',
  titel: 'Präpositionen: Ort & Zeit',
  reihenfolge: 9,
  lektion: [
    {
      ueberschrift: 'Ort: in, on, at',
      text: 'in = in einem Raum/Gebiet (in the room, in Berlin, in Germany). on = auf einer Fläche (on the table, on the wall). at = an einem Punkt/Ort (at the bus stop, at the airport, at home).',
      beispiele: [
        { en: 'The keys are on the table.', de: 'Die Schlüssel liegen auf dem Tisch.' },
        { en: 'She is at the airport.', de: 'Sie ist am Flughafen.' },
        { en: 'We live in Munich.', de: 'Wir wohnen in München.' }
      ]
    },
    {
      ueberschrift: 'Zeit: in, on, at',
      text: 'in = Monate, Jahre, Jahreszeiten, Tageszeiten (in July, in 2024, in the morning). on = Wochentage und Daten (on Monday, on 5 May). at = Uhrzeiten und feste Ausdrücke (at 7 o\'clock, at night, at the weekend/BE).',
      beispiele: [
        { en: 'The flight leaves at 9 a.m.', de: 'Der Flug geht um 9 Uhr morgens.' },
        { en: 'We arrive on Friday.', de: 'Wir kommen am Freitag an.' },
        { en: 'It is cold in winter.', de: 'Im Winter ist es kalt.' }
      ]
    },
    {
      ueberschrift: 'Weitere wichtige Präpositionen',
      text: 'to = Richtung (go to London), from = Herkunft (from Germany), next to = neben, between = zwischen, opposite = gegenüber, near = in der Nähe von.',
      beispiele: [
        { en: 'The bank is next to the supermarket.', de: 'Die Bank ist neben dem Supermarkt.' },
        { en: 'We fly to Spain.', de: 'Wir fliegen nach Spanien.' }
      ]
    }
  ],
  uebungen: [
    { id: 'pr-u01', typ: 'mc', frage: 'The meeting is ___ Monday.',
      optionen: ['in', 'on', 'at', 'to'], richtig: 1,
      erklaerung: 'Wochentage → on: on Monday.' },
    { id: 'pr-u02', typ: 'luecke', frage: 'The train leaves ___ (in/on/at) 8 o\'clock.',
      antwort: ['at'], erklaerung: 'Uhrzeiten → at.' },
    { id: 'pr-u03', typ: 'mc', frage: 'My birthday is ___ July.',
      optionen: ['in', 'on', 'at', 'from'], richtig: 0,
      erklaerung: 'Monate → in: in July.' },
    { id: 'pr-u04', typ: 'luecke', frage: 'The keys are ___ (in/on/at) the table.',
      antwort: ['on'], erklaerung: 'Auf einer Fläche → on.' },
    { id: 'pr-u05', typ: 'mc', frage: 'She is waiting ___ the bus stop.',
      optionen: ['in', 'on', 'at', 'between'], richtig: 2,
      erklaerung: 'Punkt/Treffpunkt → at: at the bus stop.' },
    { id: 'pr-u06', typ: 'luecke', frage: 'We live ___ (in/on/at) Berlin.',
      antwort: ['in'], erklaerung: 'Städte → in.' },
    { id: 'pr-u07', typ: 'mc', frage: 'Tomorrow we fly ___ Italy.',
      optionen: ['at', 'in', 'on', 'to'], richtig: 3,
      erklaerung: 'Richtung/Ziel → to: fly to Italy.' },
    { id: 'pr-u08', typ: 'luecke', frage: 'I usually get up early ___ (in/on/at) the morning.',
      antwort: ['in'], erklaerung: 'Tageszeit → in the morning (aber: at night).' },
    { id: 'pr-u09', typ: 'mc', frage: 'The pharmacy is ___ the bank and the bakery.',
      optionen: ['next', 'between', 'at', 'on'], richtig: 1,
      erklaerung: 'Zwischen zwei Dingen → between.' },
    { id: 'pr-u10', typ: 'luecke', frage: 'I can\'t sleep ___ (in/on/at) night.',
      antwort: ['at'], erklaerung: 'Feste Wendung: at night.' }
  ]
});

/* ===== Lektion 10: Höflich fragen auf Reisen ===== */
APP_DATA.registerLesson({
  id: 'hoeflichkeit',
  titel: 'Höflich fragen auf Reisen',
  reihenfolge: 10,
  lektion: [
    {
      ueberschrift: 'Wünsche äußern: would like',
      text: '"I would like ..." (Kurzform: I\'d like) ist die höfliche Form von "I want". Auf Reisen die wichtigste Floskel überhaupt.',
      beispiele: [
        { en: 'I\'d like a room for two nights, please.', de: 'Ich hätte gern ein Zimmer für zwei Nächte.' },
        { en: 'I would like to order, please.', de: 'Ich würde gern bestellen.' }
      ]
    },
    {
      ueberschrift: 'Bitten: could you / can you',
      text: '"Could you ...?" ist höflicher als "Can you ...?". Mit "please" wird jede Bitte freundlicher.',
      beispiele: [
        { en: 'Could you help me, please?', de: 'Könnten Sie mir bitte helfen?' },
        { en: 'Could you speak more slowly, please?', de: 'Könnten Sie bitte langsamer sprechen?' }
      ]
    },
    {
      ueberschrift: 'Um Erlaubnis fragen: may I / can I',
      text: '"May I ...?" ist die höfliche Frage nach Erlaubnis. "Can I ...?" ist etwas lockerer, aber ebenfalls üblich.',
      beispiele: [
        { en: 'May I sit here?', de: 'Darf ich mich hier hinsetzen?' },
        { en: 'Can I pay by card?', de: 'Kann ich mit Karte zahlen?' }
      ]
    },
    {
      ueberschrift: 'Nützliche Reise-Floskeln',
      text: 'Excuse me = Entschuldigung (um jemanden anzusprechen). Sorry = Entschuldigung (wenn etwas passiert ist). Could you tell me the way to ...? = Können Sie mir den Weg zu ... sagen?',
      beispiele: [
        { en: 'Excuse me, where is the station?', de: 'Entschuldigung, wo ist der Bahnhof?' },
        { en: 'Sorry, I didn\'t understand that.', de: 'Entschuldigung, das habe ich nicht verstanden.' }
      ]
    }
  ],
  uebungen: [
    { id: 'ho-u01', typ: 'mc', frage: 'Sie bestellen im Restaurant. Was ist am höflichsten?',
      optionen: ['Give me a pizza.', 'I want a pizza now.', 'I\'d like a pizza, please.', 'Pizza!'], richtig: 2,
      erklaerung: 'I\'d like ... , please = höfliche Bestellung.' },
    { id: 'ho-u02', typ: 'luecke', frage: 'I ___ like a coffee, please. (Modalverb)',
      antwort: ['would', "'d"], erklaerung: 'I would like = ich hätte gern.' },
    { id: 'ho-u03', typ: 'mc', frage: '___ you help me with my luggage, please?',
      optionen: ['Could', 'Must', 'Should', 'Do'], richtig: 0,
      erklaerung: 'Höfliche Bitte → Could you ...?' },
    { id: 'ho-u04', typ: 'luecke', frage: '___ (dürfen, sehr höflich) I open the window?',
      antwort: ['may'], erklaerung: 'Höfliche Frage nach Erlaubnis → May I ...?' },
    { id: 'ho-u05', typ: 'mc', frage: 'Sie möchten einen Fremden nach dem Weg fragen. Wie beginnen Sie?',
      optionen: ['Hey you!', 'Sorry for you!', 'Listen!', 'Excuse me, ...'], richtig: 3,
      erklaerung: 'Excuse me = höfliche Anrede, um jemanden anzusprechen.' },
    { id: 'ho-u06', typ: 'luecke', frage: 'Could you speak more slowly, ___ ? (Höflichkeitswort)',
      antwort: ['please'], erklaerung: 'please macht jede Bitte höflicher.' },
    { id: 'ho-u07', typ: 'mc', frage: '"Would you like some tea?" – Was ist eine höfliche Antwort?',
      optionen: ['Yes, please.', 'Give it.', 'I want.', 'Of course you would.'], richtig: 0,
      erklaerung: 'Auf ein Angebot: Yes, please. / No, thank you.' },
    { id: 'ho-u08', typ: 'luecke', frage: 'Can I ___ (zahlen) by card?',
      antwort: ['pay'], erklaerung: 'pay by card = mit Karte zahlen.' },
    { id: 'ho-u09', typ: 'mc', frage: 'Sie haben etwas nicht verstanden. Was sagen Sie?',
      optionen: ['What?!', 'Sorry, could you repeat that, please?', 'Speak English!', 'I hear nothing.'], richtig: 1,
      erklaerung: 'Höflich nachfragen: Sorry, could you repeat that, please?' },
    { id: 'ho-u10', typ: 'luecke', frage: 'I\'d like ___ (Verb mit to) book a table for two, please.',
      antwort: ['to'], erklaerung: 'I\'d like + to + Grundform: I\'d like to book ...' }
  ]
});
