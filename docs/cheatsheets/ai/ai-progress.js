/* Progress through the AI learning map, saved in this browser only.

   Topic page   (meta[name=ai-topic]): a "Mark as understood" toggle in the hero
                and again at the end of the page.
   Stage page   (ai/<stage>/index.html): a tick on each understood topic card
                and an "n of m understood" count.
   The map      (ai/index.html): per-stage counts and an overall bar.

   Storage: localStorage["ai-progress-v1"] = { "<stage>/<slug>": <timestamp> }.
   Any storage failure (private mode, blocked) just means nothing is remembered. */
(function () {
  'use strict';

  var KEY = 'ai-progress-v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  var state = load();
  var done = function (k) { return Object.prototype.hasOwnProperty.call(state, k); };

  /* ---------- topic page ---------- */
  var topicMeta = document.querySelector('meta[name="ai-topic"]');
  if (topicMeta) {
    var key = topicMeta.getAttribute('content');
    var buttons = [];

    var make = function () {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'progress-toggle';
      b.addEventListener('click', function () {
        if (done(key)) delete state[key]; else state[key] = Date.now();
        save(state);
        paint();
      });
      buttons.push(b);
      return b;
    };
    var paint = function () {
      buttons.forEach(function (b) {
        var on = done(key);
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.textContent = on ? '✓ Understood' : 'Mark as understood';
      });
    };

    var tags = document.querySelector('.hero .tags');
    if (tags) tags.appendChild(make());
    var pager = document.querySelector('.sheet-pager');
    if (pager) {
      var end = document.createElement('div');
      end.className = 'progress-end';
      var p = document.createElement('p');
      p.textContent = 'Could you explain this topic to someone else without notes?';
      end.appendChild(p);
      end.appendChild(make());
      pager.parentNode.insertBefore(end, pager);
    }
    paint();
    return;
  }

  /* ---------- stage page: tick topic cards ---------- */
  var cards = document.querySelectorAll('.grid a.card[href$=".html"]');
  var stageMatch = location.pathname.match(/\/ai\/([\w-]+)\/(?:index\.html)?$/);
  if (stageMatch && cards.length) {
    var stage = stageMatch[1];
    var total = 0, n = 0;
    cards.forEach(function (a) {
      var href = a.getAttribute('href');
      if (href.indexOf('/') !== -1) return;          // "next stage" card, not a topic
      var k = stage + '/' + href.replace(/\.html$/, '');
      total++;
      if (done(k)) { n++; a.classList.add('is-done'); }
    });
    var stats = document.querySelector('.page-header .stats');
    if (stats && total) {
      var s = document.createElement('span');
      s.className = 'stat';
      s.innerHTML = '<strong>' + n + '</strong> of ' + total + ' understood';
      stats.appendChild(s);
    }
    return;
  }

  /* ---------- the map: per-stage counts ---------- */
  var stageCards = document.querySelectorAll('.sub-card[data-topics]');
  if (stageCards.length) {
    var all = 0, got = 0;
    stageCards.forEach(function (card) {
      var ks = card.getAttribute('data-topics').split(' ');
      var c = ks.filter(done).length;
      all += ks.length; got += c;
      var count = card.querySelector('.count');
      if (count && c) count.textContent = c + ' of ' + ks.length + ' topics understood';
      if (c === ks.length) card.classList.add('is-done');
    });
    var header = document.querySelector('.page-header');
    if (header) {
      var bar = document.createElement('div');
      bar.className = 'progress-bar';
      bar.innerHTML = '<div class="progress-fill" style="width:' + Math.round(got / all * 100) + '%"></div>';
      var label = document.createElement('p');
      label.className = 'progress-label';
      label.textContent = got + ' of ' + all + ' topics understood' + (got ? '' : ' — mark topics as you finish them');
      header.appendChild(bar);
      header.appendChild(label);
    }
  }
})();
