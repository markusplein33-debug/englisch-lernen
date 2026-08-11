// Einfacher Hash-Router. Views registrieren sich unter window.Views.
window.Router = (function () {
  var routes = {};   // 'karten' -> renderFn(container, argString)
  var titleEl, backBtn, viewEl;

  function register(name, fn) { routes[name] = fn; }

  function parse() {
    var h = location.hash || '#/';
    var parts = h.replace(/^#\//, '').split('/');
    return { name: parts[0] || 'home', arg: parts.slice(1).join('/') || null };
  }

  function render() {
    var r = parse();
    var fn = routes[r.name] || routes.home;
    viewEl.innerHTML = '';
    window.scrollTo(0, 0);
    fn(viewEl, r.arg);
    // Tabbar-Status
    var tabs = document.querySelectorAll('#tabbar .tab');
    var routeHash = '#/' + (r.name === 'home' ? '' : r.name);
    tabs.forEach(function (t) {
      t.classList.toggle('active', t.getAttribute('data-route') === routeHash);
    });
    backBtn.classList.toggle('hidden', r.name === 'home' || !r.arg && ['home','karten','quiz','grammatik','statistik'].indexOf(r.name) >= 0);
  }

  function setTitle(t) { titleEl.textContent = t; }

  function init() {
    titleEl = document.getElementById('title');
    backBtn = document.getElementById('btn-back');
    viewEl = document.getElementById('view');
    backBtn.addEventListener('click', function () { history.back(); });
    document.getElementById('btn-settings').addEventListener('click', function () {
      location.hash = '#/einstellungen';
    });
    document.querySelectorAll('#tabbar .tab').forEach(function (t) {
      t.addEventListener('click', function () { location.hash = t.getAttribute('data-route'); });
    });
    window.addEventListener('hashchange', render);
    render();
  }

  return { register: register, init: init, setTitle: setTitle, render: render };
})();
window.Views = {};
