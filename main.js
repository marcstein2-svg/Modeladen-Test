/* Schütz Mode – kleine Helfer ohne Abhängigkeiten
   1. Mobiles Menü
   2. „Jetzt geöffnet“-Anzeige (liest die Zeiten aus der Tabelle #oeffnungszeiten)
   3. Galerie-Fallback, wenn Bilder fehlen
   4. Sanftes Einblenden beim Scrollen
*/
(function () {
  'use strict';

  /* ---------- 1. Mobiles Menü ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? 'Menü schließen' : 'Menü öffnen';
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    var desktop = window.matchMedia('(min-width: 900px)');
    var onChange = function () { if (desktop.matches) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* ---------- 2. Öffnungszeiten-Status ---------- */
  var table = document.getElementById('oeffnungszeiten');
  var statusEls = document.querySelectorAll('[data-open-status]');
  var DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  var WEEKDAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function toMinutes(hhmm) {
    var p = hhmm.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }
  function label(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return h + ':' + (m < 10 ? '0' : '') + m + ' Uhr';
  }

  /* Liest data-hours="09:30-12:00,14:00-18:00" je Zeile; leer = geschlossen */
  function readHours() {
    var week = {};
    if (!table) return week;
    table.querySelectorAll('tr[data-day]').forEach(function (row) {
      var day = parseInt(row.getAttribute('data-day'), 10);
      var raw = (row.getAttribute('data-hours') || '').trim();
      week[day] = raw ? raw.split(',').map(function (part) {
        var t = part.split('-');
        return [toMinutes(t[0]), toMinutes(t[1])];
      }) : [];
    });
    return week;
  }

  /* Aktuelle Zeit in Deutschland, unabhängig von der Zeitzone des Geräts */
  function berlinNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).formatToParts(new Date());
      var out = {};
      parts.forEach(function (p) { out[p.type] = p.value; });
      return { day: WEEKDAY_INDEX[out.weekday], min: parseInt(out.hour, 10) * 60 + parseInt(out.minute, 10) };
    } catch (err) {
      var d = new Date();
      return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function computeStatus(week, now) {
    var today = week[now.day] || [];
    var i, slot;
    for (i = 0; i < today.length; i++) {
      slot = today[i];
      if (now.min >= slot[0] && now.min < slot[1]) {
        var left = slot[1] - now.min;
        return left <= 30
          ? { state: 'soon', text: 'Schließt bald · um ' + label(slot[1]) }
          : { state: 'open', text: 'Jetzt geöffnet · bis ' + label(slot[1]) };
      }
    }
    for (i = 0; i < today.length; i++) {
      if (now.min < today[i][0]) return { state: 'closed', text: 'Gerade geschlossen · öffnet heute um ' + label(today[i][0]) };
    }
    for (var step = 1; step <= 7; step++) {
      var d = (now.day + step) % 7;
      if (week[d] && week[d].length) {
        var when = step === 1 ? 'morgen' : DAYS[d];
        return { state: 'closed', text: 'Gerade geschlossen · öffnet ' + when + ' um ' + label(week[d][0][0]) };
      }
    }
    return { state: 'closed', text: 'Gerade geschlossen' };
  }

  function updateStatus() {
    var week = readHours();
    if (!Object.keys(week).length) return;
    var now = berlinNow();
    var status = computeStatus(week, now);
    statusEls.forEach(function (el) {
      el.setAttribute('data-state', status.state);
      el.textContent = status.text;
    });
    table.querySelectorAll('tr[data-day]').forEach(function (row) {
      var isToday = parseInt(row.getAttribute('data-day'), 10) === now.day;
      row.classList.toggle('is-today', isToday);
      if (isToday) row.setAttribute('aria-current', 'date'); else row.removeAttribute('aria-current');
    });
  }

  if (table && statusEls.length) {
    updateStatus();
    setInterval(updateStatus, 60 * 1000);
  }

  /* ---------- 3. Galerie-Fallback ---------- */
  document.querySelectorAll('.gallery').forEach(function (gallery) {
    var imgs = gallery.querySelectorAll('img');
    if (!imgs.length) return;

    function check() {
      if (!gallery.querySelector('figure:not(.is-missing)')) gallery.classList.add('is-empty');
    }
    function miss(img) {
      var fig = img.closest('figure');
      if (fig) fig.classList.add('is-missing');
      check();
    }

    imgs.forEach(function (img) {
      img.addEventListener('error', function () { miss(img); });
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) miss(img);
    });

    /* Erstes Bild gezielt prüfen (die übrigen werden lazy geladen):
       fehlt es, ist die Galerie vermutlich noch leer und wird ausgeblendet. */
    var probe = new Image();
    probe.onerror = function () { gallery.classList.add('is-empty'); };
    probe.src = imgs[0].getAttribute('src');
  });

  /* ---------- 4. Einblenden beim Scrollen ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    }
  }
})();
