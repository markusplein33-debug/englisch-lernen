// paket-grammatik2.js — Erweiterungspaket "Grammatik 2" für die Englisch-Lern-App
// UI: Deutsch, Lerninhalt: Englisch. Vanilla JS, wird über APP_DATA.registerLesson() geladen.
// Jede Lektion gehört zum Paket 'grammatik2'.

/* ===== Lektion 11: if-Sätze (Typ 1) ===== */
APP_DATA.registerLesson({
  id: 'if-saetze',
  titel: 'if-Sätze (Typ 1)',
  reihenfolge: 11,
  paket: 'grammatik2',
  lektion: [
    {
      ueberschrift: 'Wann benutzt man if-Sätze Typ 1?',
      text: 'if-Sätze Typ 1 beschreiben eine reale, wahrscheinliche Bedingung in der Gegenwart oder Zukunft: Wenn die Bedingung eintritt, passiert die Folge. Auf Deutsch: "Wenn es regnet, bleibe ich zu Hause."',
      beispiele: [
        { en: 'If it rains, I will stay at home.', de: 'Wenn es regnet, bleibe ich zu Hause.' },
        { en: 'If you hurry, you will catch the bus.', de: 'Wenn du dich beeilst, bekommst du den Bus.' }
      ]
    },
    {
      ueberschrift: 'Bildung',
      text: 'Im if-Satz steht das Simple Present, im Hauptsatz will + Grundform: If + Simple Present, will + Infinitiv. Wichtig: Im if-Satz steht NIEMALS will – auch wenn man auf Deutsch "werden" sagen könnte.',
      beispiele: [
        { en: 'If she studies hard, she will pass the exam.', de: 'Wenn sie fleißig lernt, wird sie die Prüfung bestehen.' },
        { en: 'We will go swimming if the weather is nice.', de: 'Wir gehen schwimmen, wenn das Wetter schön ist.' }
      ]
    },
    {
      ueberschrift: 'Die Komma-Regel',
      text: 'Steht der if-Satz am Anfang, wird ein Komma gesetzt: "If it rains, we will stay inside." Steht der if-Satz am Ende, steht KEIN Komma: "We will stay inside if it rains."',
      beispiele: [
        { en: 'If you help me, I will help you.', de: 'Wenn du mir hilfst, helfe ich dir. (Komma, weil if-Satz vorn)' },
        { en: 'I will help you if you help me.', de: 'Ich helfe dir, wenn du mir hilfst. (kein Komma im Englischen)' }
      ]
    },
    {
      ueberschrift: 'Typischer Fehler',
      text: 'Der häufigste Fehler ist will im if-Satz. Falsch: "If it will rain …". Richtig: "If it rains …". Merksatz: Nach if kommt nie will!',
      beispiele: [
        { en: 'If he calls, I will answer.', de: 'Wenn er anruft, gehe ich ran. (nicht: If he will call)' }
      ]
    }
  ],
  uebungen: [
    { id: 'if-u01', typ: 'mc', frage: 'If it ___ tomorrow, we will stay at home.',
      optionen: ['will rain', 'rains', 'rained', 'raining'], richtig: 1,
      erklaerung: 'Im if-Satz steht das Simple Present, nie will: If it rains …' },
    { id: 'if-u02', typ: 'luecke', frage: 'If it ___ (rain), we will stay inside.',
      antwort: ['rains'], erklaerung: 'if-Satz Typ 1 → Simple Present: it rains.' },
    { id: 'if-u03', typ: 'mc', frage: 'If you hurry, you ___ the bus.',
      optionen: ['catch', 'catching', 'will catch', 'caught'], richtig: 2,
      erklaerung: 'Im Hauptsatz steht will + Grundform: you will catch the bus.' },
    { id: 'if-u04', typ: 'luecke', frage: 'If she studies hard, she ___ (pass) the exam.',
      antwort: ['will pass', "'ll pass"], erklaerung: 'Hauptsatz des Typ-1-Satzes → will + Grundform: will pass.' },
    { id: 'if-u05', typ: 'mc', frage: 'Welcher Satz ist richtig?',
      optionen: ['If he will call, I will answer.', 'If he calls I, will answer.', 'If he calls, I will answer.', 'If he called, I will answer.'], richtig: 2,
      erklaerung: 'if + Simple Present, Hauptsatz mit will; Komma nach dem if-Satz am Satzanfang.' },
    { id: 'if-u06', typ: 'mc', frage: 'Wo steht ein Komma? Wähle den richtigen Satz.',
      optionen: ['We will go swimming, if the weather is nice.', 'We will go swimming if the weather is nice.', 'We will go swimming if, the weather is nice.', 'We, will go swimming if the weather is nice.'], richtig: 1,
      erklaerung: 'Steht der if-Satz am Ende, wird im Englischen kein Komma gesetzt.' },
    { id: 'if-u07', typ: 'luecke', frage: 'If you ___ (help) me, I will help you.',
      antwort: ['help'], erklaerung: 'Im if-Satz steht das Simple Present: you help.' },
    { id: 'if-u08', typ: 'mc', frage: 'She will be happy if you ___ her a present.',
      optionen: ['will give', 'gave', 'giving', 'give'], richtig: 3,
      erklaerung: 'Auch wenn der if-Satz hinten steht: Simple Present, nie will → if you give.' },
    { id: 'if-u09', typ: 'luecke', frage: 'If we don\'t hurry, we ___ (miss) the train.',
      antwort: ['will miss', "'ll miss"], erklaerung: 'Folge im Hauptsatz → will + Grundform: will miss.' },
    { id: 'if-u10', typ: 'mc', frage: 'If my brother ___ time, he will visit us.',
      optionen: ['has', 'have', 'will have', 'having'], richtig: 0,
      erklaerung: 'if-Satz im Simple Present; he/she/it → has.' }
  ]
});

/* ===== Lektion 12: Passiv (Simple Present & Simple Past) ===== */
APP_DATA.registerLesson({
  id: 'passiv',
  titel: 'Passiv (Present & Past)',
  reihenfolge: 12,
  paket: 'grammatik2',
  lektion: [
    {
      ueberschrift: 'Wann benutzt man das Passiv?',
      text: 'Das Passiv benutzt man, wenn die Handlung wichtiger ist als die handelnde Person – oder wenn man nicht weiß, wer etwas tut. Im Aktiv steht der Handelnde vorn (Somebody cleans the room), im Passiv das Ziel der Handlung (The room is cleaned).',
      beispiele: [
        { en: 'The room is cleaned every day.', de: 'Das Zimmer wird jeden Tag geputzt.' },
        { en: 'English is spoken all over the world.', de: 'Englisch wird auf der ganzen Welt gesprochen.' }
      ]
    },
    {
      ueberschrift: 'Bildung: Form von be + Past Participle',
      text: 'Das Passiv wird mit einer Form von be und dem Past Participle (3. Verbform) gebildet. Simple Present Passiv: am/is/are + Past Participle. Simple Past Passiv: was/were + Past Participle. Regelmäßige Verben: -ed (cleaned); unregelmäßige Verben: 3. Form (build → built, write → written).',
      beispiele: [
        { en: 'The hotel was built in 1990.', de: 'Das Hotel wurde 1990 gebaut.' },
        { en: 'The letters are written in English.', de: 'Die Briefe werden auf Englisch geschrieben.' }
      ]
    },
    {
      ueberschrift: 'Singular oder Plural?',
      text: 'Die Form von be richtet sich nach dem Subjekt des Passivsatzes: The car is washed (Singular) – The cars are washed (Plural). In der Vergangenheit: was (Singular) – were (Plural).',
      beispiele: [
        { en: 'The window was broken yesterday.', de: 'Das Fenster wurde gestern zerbrochen.' },
        { en: 'The windows were broken yesterday.', de: 'Die Fenster wurden gestern zerbrochen.' }
      ]
    },
    {
      ueberschrift: 'Der by-Agent',
      text: 'Will man sagen, WER etwas getan hat, benutzt man by: The book was written by J. K. Rowling. Oft lässt man den Handelnden aber einfach weg, wenn er unwichtig oder unbekannt ist.',
      beispiele: [
        { en: 'America was discovered by Columbus.', de: 'Amerika wurde von Kolumbus entdeckt.' },
        { en: 'My bike was stolen.', de: 'Mein Fahrrad wurde gestohlen. (Wer es war, weiß man nicht.)' }
      ]
    }
  ],
  uebungen: [
    { id: 'pas-u01', typ: 'mc', frage: 'The room ___ every day.',
      optionen: ['is cleaned', 'cleans', 'is clean', 'cleaned'], richtig: 0,
      erklaerung: 'Simple Present Passiv: is/are + Past Participle → is cleaned.' },
    { id: 'pas-u02', typ: 'luecke', frage: 'The hotel ___ (build) in 1990.',
      antwort: ['was built'], erklaerung: 'Simple Past Passiv: was + Past Participle; build → built.' },
    { id: 'pas-u03', typ: 'mc', frage: 'English ___ all over the world.',
      optionen: ['speaks', 'is spoken', 'is speaking', 'was speak'], richtig: 1,
      erklaerung: 'Passiv: is + Past Participle; speak → spoken.' },
    { id: 'pas-u04', typ: 'luecke', frage: 'The letters ___ (write) in English every week.',
      antwort: ['are written'], erklaerung: 'Plural + Simple Present Passiv: are + written.' },
    { id: 'pas-u05', typ: 'mc', frage: 'The windows ___ yesterday.',
      optionen: ['was broken', 'are broken', 'were broken', 'is broken'], richtig: 2,
      erklaerung: 'Plural + Vergangenheit (yesterday) → were + Past Participle.' },
    { id: 'pas-u06', typ: 'mc', frage: 'This book ___ J. K. Rowling.',
      optionen: ['was written by', 'was written from', 'wrote by', 'is wrote by'], richtig: 0,
      erklaerung: 'Der Handelnde wird im Passiv mit by angeschlossen: was written by.' },
    { id: 'pas-u07', typ: 'luecke', frage: 'My bike ___ (steal) last night.',
      antwort: ['was stolen'], erklaerung: 'Simple Past Passiv: was + stolen (steal → stole → stolen).' },
    { id: 'pas-u08', typ: 'mc', frage: 'The cars ___ in this factory.',
      optionen: ['is made', 'are made', 'are making', 'make'], richtig: 1,
      erklaerung: 'Plural (the cars) + Simple Present Passiv → are made.' },
    { id: 'pas-u09', typ: 'luecke', frage: 'Breakfast ___ (serve) from 7 to 10 every morning.',
      antwort: ['is served'], erklaerung: 'Singular + Simple Present Passiv: is served.' },
    { id: 'pas-u10', typ: 'mc', frage: 'America ___ by Columbus.',
      optionen: ['is discovered', 'was discover', 'discovered', 'was discovered'], richtig: 3,
      erklaerung: 'Vergangenheit + Passiv: was + Past Participle → was discovered.' }
  ]
});

/* ===== Lektion 13: Vergleiche & Steigerung ===== */
APP_DATA.registerLesson({
  id: 'steigerung',
  titel: 'Vergleiche & Steigerung',
  reihenfolge: 13,
  paket: 'grammatik2',
  lektion: [
    {
      ueberschrift: 'Kurze Adjektive: -er / -est',
      text: 'Kurze Adjektive (eine Silbe) steigert man mit -er (Komparativ) und the … -est (Superlativ): small → smaller → the smallest. Endet das Adjektiv auf einen einzelnen Konsonanten nach kurzem Vokal, wird der Konsonant verdoppelt: big → bigger → the biggest. Endet es auf Konsonant + y, wird y zu i: happy → happier → the happiest.',
      beispiele: [
        { en: 'My car is bigger than your car.', de: 'Mein Auto ist größer als dein Auto.' },
        { en: 'This is the biggest house in our street.', de: 'Das ist das größte Haus in unserer Straße.' },
        { en: 'She is happier than her brother.', de: 'Sie ist glücklicher als ihr Bruder.' }
      ]
    },
    {
      ueberschrift: 'Lange Adjektive: more / most',
      text: 'Lange Adjektive (zwei oder mehr Silben, z. B. expensive, interesting, beautiful) steigert man mit more und the most: expensive → more expensive → the most expensive.',
      beispiele: [
        { en: 'This hotel is more expensive than the other one.', de: 'Dieses Hotel ist teurer als das andere.' },
        { en: 'It is the most interesting book I know.', de: 'Es ist das interessanteste Buch, das ich kenne.' }
      ]
    },
    {
      ueberschrift: 'Vergleiche mit than und as … as',
      text: 'Beim Vergleich zweier ungleicher Dinge benutzt man den Komparativ + than: bigger than, more expensive than. Sind zwei Dinge gleich, benutzt man as + Grundform + as: as big as. Verneint: not as big as (nicht so groß wie).',
      beispiele: [
        { en: 'Tom is as tall as his father.', de: 'Tom ist so groß wie sein Vater.' },
        { en: 'My bike is not as fast as your bike.', de: 'Mein Fahrrad ist nicht so schnell wie dein Fahrrad.' }
      ]
    },
    {
      ueberschrift: 'Unregelmäßige Steigerung',
      text: 'Einige Adjektive werden unregelmäßig gesteigert: good → better → the best, bad → worse → the worst. Diese Formen muss man auswendig lernen.',
      beispiele: [
        { en: 'This pizza is better than the pasta.', de: 'Diese Pizza ist besser als die Pasta.' },
        { en: 'That was the worst film of the year.', de: 'Das war der schlechteste Film des Jahres.' }
      ]
    }
  ],
  uebungen: [
    { id: 'ste-u01', typ: 'mc', frage: 'My house is ___ than your house.',
      optionen: ['big', 'bigger', 'more big', 'biggest'], richtig: 1,
      erklaerung: 'Kurzes Adjektiv + than → Komparativ mit -er, Konsonant verdoppeln: bigger.' },
    { id: 'ste-u02', typ: 'luecke', frage: 'This is the ___ (big) house in our street.',
      antwort: ['biggest'], erklaerung: 'Superlativ kurzer Adjektive: the + -est, Konsonant verdoppeln: the biggest.' },
    { id: 'ste-u03', typ: 'mc', frage: 'This hotel is ___ than the other one.',
      optionen: ['expensiver', 'more expensive', 'most expensive', 'as expensive'], richtig: 1,
      erklaerung: 'Lange Adjektive steigert man mit more: more expensive than.' },
    { id: 'ste-u04', typ: 'luecke', frage: 'She is ___ (happy) than her brother.',
      antwort: ['happier'], erklaerung: 'Konsonant + y → y wird zu i: happy → happier.' },
    { id: 'ste-u05', typ: 'mc', frage: 'Tom is as ___ as his father.',
      optionen: ['taller', 'tallest', 'tall', 'more tall'], richtig: 2,
      erklaerung: 'Bei as … as steht die Grundform des Adjektivs: as tall as.' },
    { id: 'ste-u06', typ: 'mc', frage: 'This pizza is ___ than the pasta.',
      optionen: ['gooder', 'better', 'best', 'more good'], richtig: 1,
      erklaerung: 'good wird unregelmäßig gesteigert: good → better → the best.' },
    { id: 'ste-u07', typ: 'luecke', frage: 'That was the ___ (bad) film of the year.',
      antwort: ['worst'], erklaerung: 'bad wird unregelmäßig gesteigert: bad → worse → the worst.' },
    { id: 'ste-u08', typ: 'mc', frage: 'It is the ___ book I have ever read.',
      optionen: ['interestingest', 'more interesting', 'most interesting', 'interestinger'], richtig: 2,
      erklaerung: 'Superlativ langer Adjektive: the most interesting.' },
    { id: 'ste-u09', typ: 'luecke', frage: 'Today the weather is ___ (bad) than yesterday.',
      antwort: ['worse'], erklaerung: 'Komparativ von bad: worse (+ than).' },
    { id: 'ste-u10', typ: 'mc', frage: 'My bike is not as ___ as your bike.',
      optionen: ['fast', 'faster', 'fastest', 'more fast'], richtig: 0,
      erklaerung: 'Auch bei not as … as steht die Grundform: not as fast as.' }
  ]
});

/* ===== Lektion 14: Relativsätze ===== */
APP_DATA.registerLesson({
  id: 'relativsaetze',
  titel: 'Relativsätze (who/which/that)',
  reihenfolge: 14,
  paket: 'grammatik2',
  lektion: [
    {
      ueberschrift: 'Was sind Relativsätze?',
      text: 'Relativsätze geben zusätzliche Informationen über eine Person oder Sache. Sie werden mit einem Relativpronomen eingeleitet: who, which oder that. Auf Deutsch entspricht das "der, die, das" oder "welcher, welche, welches".',
      beispiele: [
        { en: 'The man who lives next door is a doctor.', de: 'Der Mann, der nebenan wohnt, ist Arzt.' },
        { en: 'The book which is on the table is mine.', de: 'Das Buch, das auf dem Tisch liegt, gehört mir.' }
      ]
    },
    {
      ueberschrift: 'who für Personen',
      text: 'who benutzt man nur für Personen: the woman who works here, the boy who won the race. Für Dinge oder Tiere darf man who NICHT verwenden.',
      beispiele: [
        { en: 'The teacher who teaches English is very nice.', de: 'Der Lehrer, der Englisch unterrichtet, ist sehr nett.' },
        { en: 'I know a girl who speaks four languages.', de: 'Ich kenne ein Mädchen, das vier Sprachen spricht.' }
      ]
    },
    {
      ueberschrift: 'which für Dinge und Tiere',
      text: 'which benutzt man für Dinge und Tiere: the car which is red, the dog which barks. Für Personen darf man which NICHT verwenden.',
      beispiele: [
        { en: 'The car which is parked outside is new.', de: 'Das Auto, das draußen geparkt ist, ist neu.' },
        { en: 'She has a cat which sleeps all day.', de: 'Sie hat eine Katze, die den ganzen Tag schläft.' }
      ]
    },
    {
      ueberschrift: 'that als Allrounder',
      text: 'that kann in notwendigen (bestimmenden) Relativsätzen sowohl who als auch which ersetzen – für Personen UND Dinge: the man that lives next door, the book that I read. Im Zweifel gilt: Personen → who oder that, Dinge/Tiere → which oder that.',
      beispiele: [
        { en: 'The film that we watched was great.', de: 'Der Film, den wir gesehen haben, war toll.' },
        { en: 'She is the woman that helped me.', de: 'Sie ist die Frau, die mir geholfen hat.' }
      ]
    }
  ],
  uebungen: [
    { id: 'rel-u01', typ: 'mc', frage: 'The man ___ lives next door is a doctor.',
      optionen: ['which', 'who', 'what', 'where'], richtig: 1,
      erklaerung: 'the man ist eine Person → who (oder that).' },
    { id: 'rel-u02', typ: 'luecke', frage: 'The book ___ is on the table is mine. (Relativpronomen für Dinge, nicht that)',
      antwort: ['which'], erklaerung: 'the book ist eine Sache → which.' },
    { id: 'rel-u03', typ: 'mc', frage: 'She has a cat ___ sleeps all day.',
      optionen: ['who', 'whose', 'which', 'what'], richtig: 2,
      erklaerung: 'Tiere → which (oder that), nicht who.' },
    { id: 'rel-u04', typ: 'mc', frage: 'Welcher Satz ist FALSCH?',
      optionen: ['The woman who works here is nice.', 'The car which is red is fast.', 'The man which lives here is old.', 'The film that we watched was great.'], richtig: 2,
      erklaerung: 'which darf nicht für Personen stehen; richtig wäre: The man who/that lives here.' },
    { id: 'rel-u05', typ: 'luecke', frage: 'I know a girl ___ speaks four languages. (Relativpronomen für Personen, nicht that)',
      antwort: ['who'], erklaerung: 'a girl ist eine Person → who.' },
    { id: 'rel-u06', typ: 'mc', frage: 'The film ___ we watched yesterday was great.',
      optionen: ['who', 'that', 'whose', 'where'], richtig: 1,
      erklaerung: 'the film ist eine Sache → that (oder which), nicht who.' },
    { id: 'rel-u07', typ: 'mc', frage: 'Für wen oder was kann man "that" benutzen?',
      optionen: ['Nur für Personen', 'Nur für Dinge', 'Für Personen und Dinge', 'Nur für Tiere'], richtig: 2,
      erklaerung: 'that kann in bestimmenden Relativsätzen who und which ersetzen – für Personen und Dinge.' },
    { id: 'rel-u08', typ: 'luecke', frage: 'The teacher ___ teaches English is very nice. (Relativpronomen für Personen, nicht that)',
      antwort: ['who'], erklaerung: 'the teacher ist eine Person → who.' },
    { id: 'rel-u09', typ: 'mc', frage: 'The dog ___ barks all night belongs to our neighbour.',
      optionen: ['which', 'who', 'whose', 'when'], richtig: 0,
      erklaerung: 'the dog ist ein Tier → which (oder that).' },
    { id: 'rel-u10', typ: 'luecke', frage: 'The house ___ we bought last year is very old. (Relativpronomen für Dinge, nicht that)',
      antwort: ['which'], erklaerung: 'the house ist eine Sache → which.' }
  ]
});
