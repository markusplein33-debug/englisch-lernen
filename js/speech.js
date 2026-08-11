// Englische Sprachausgabe über speechSynthesis (funktioniert offline auf iOS).
window.Speech = (function () {
  var voice = null;
  var warmedUp = false;

  function pickVoice() {
    if (!('speechSynthesis' in window)) return null;
    var voices = speechSynthesis.getVoices() || [];
    var prefer = ['en-GB', 'en-US'];
    for (var p = 0; p < prefer.length; p++) {
      for (var i = 0; i < voices.length; i++) {
        if (voices[i].lang && voices[i].lang.indexOf(prefer[p]) === 0) return voices[i];
      }
    }
    for (var j = 0; j < voices.length; j++) {
      if (voices[j].lang && voices[j].lang.indexOf('en') === 0) return voices[j];
    }
    return null;
  }

  if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = function () { voice = pickVoice(); };
    voice = pickVoice();
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    // iOS verlangt, dass die erste Ausgabe direkt aus einer Nutzer-Interaktion kommt –
    // speak() wird bei uns immer aus einem Tap aufgerufen, das reicht.
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    if (!voice) voice = pickVoice();
    if (voice) u.voice = voice;
    u.lang = (voice && voice.lang) || 'en-GB';
    u.rate = (Store.load().einstellungen.tempo) || 0.9;
    speechSynthesis.speak(u);
    warmedUp = true;
  }

  return { speak: speak };
})();
