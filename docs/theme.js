(function (global) {
  'use strict';

  var STORAGE_KEY = 'playbook-theme';

  /* ---------- the ONE site nav ----------
     Every page (docsify, cheat sheets, hubs, practice) loads this file, so the
     top bar is built here and nowhere else. Before this there were three bars
     with three different link sets, and moving between them felt like
     changing websites.

     BASE is the docs root, taken from this script's own URL so it is right
     at every depth and on both localhost and GitHub Pages. */
  var SCRIPT = document.currentScript;
  var BASE = SCRIPT && SCRIPT.src
    ? SCRIPT.src.replace(/theme\.js(\?.*)?$/, '')
    : '/lld-playbook/';

  var NAV = [
    ['problems', 'Problems', '#/problems/CATALOG'],
    ['lld',      'LLD',      'cheatsheets/lld/index.html'],
    ['hld',      'HLD',      'cheatsheets/hld/hub.html'],
    ['dsa',      'DSA',      'cheatsheets/dsa/index.html'],
    ['practice', 'Practice', 'cheatsheets/dsa-practice/index.html'],
    ['ai',       'AI',       'cheatsheets/ai/index.html'],
    ['plan',     'Plan',     '#/PLAN']
  ];

  function navHtml(active) {
    return '<a href="' + BASE + '" class="pb-brand">Interview <span>Playbook</span></a>' +
      '<nav class="pb-nav" aria-label="Site">' +
      NAV.map(function (n) {
        var on = n[0] === active;
        return '<a href="' + BASE + n[2] + '" class="pb-nav-link' + (on ? ' active' : '') + '"' +
          (on ? ' aria-current="page"' : '') + ' data-nav="' + n[0] + '">' + n[1] + '</a>';
      }).join('') +
      '</nav>';
  }

  function setActive(root, active) {
    var links = root.querySelectorAll('.pb-nav-link');
    for (var i = 0; i < links.length; i++) {
      var on = links[i].getAttribute('data-nav') === active;
      links[i].classList.toggle('active', on);
      if (on) links[i].setAttribute('aria-current', 'page');
      else links[i].removeAttribute('aria-current');
    }
  }

  /* which section a static page belongs to: body.theme-{lld,hld,dsa,ai,practice} */
  function bodyKey() {
    var m = /(?:^|\s)theme-(lld|hld|dsa|ai|practice)(?:\s|$)/.exec(document.body.className);
    return m ? m[1] : '';
  }

  function docsifyKey() {
    var h = (location.hash || '').replace(/^#\/?/, '').split('?')[0];
    if (/^problems\//.test(h)) return 'problems';
    if (/^(PLAN|week\d)/.test(h)) return 'plan';
    return '';
  }

  // Light-first: a stored preference wins, and with nothing stored the answer is
  // light. We deliberately do NOT consult prefers-color-scheme — the OS setting
  // used to override the product default, which is why the site rendered dark for
  // some visitors and light for others with no way to tell which was intended.
  var DEFAULT_THEME = 'light';

  function getTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return DEFAULT_THEME;
  }

  function iconFor(theme) {
    return theme === 'light'
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  }

  function updateToggleButtons(theme) {
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      btn.innerHTML = iconFor(theme);
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
      btn.setAttribute('title', theme === 'light' ? 'Dark mode' : 'Light mode');
    }
  }

  function apply(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist !== false) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    }
    updateToggleButtons(theme);
    try {
      global.dispatchEvent(new CustomEvent('playbook-theme-change', { detail: { theme: theme } }));
    } catch (e) {}
  }

  function toggle() {
    apply(getTheme() === 'light' ? 'dark' : 'light');
  }

  function createToggleButton() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.setAttribute('data-theme-toggle', 'true');
    btn.addEventListener('click', toggle);
    return btn;
  }

  function injectDocsifyTopbar() {
    // Guarded on $docsify, NOT on #app: docsify's _renderTo sets `#app.outerHTML`,
    // which REPLACES the element, so by the time this runs on window.load the id is
    // gone and the old `getElementById('app')` check bailed every single time — the
    // topbar never rendered on any page. $docsify exists only on the docsify site,
    // so this also keeps the bar off the cheat sheets, which have their own.
    if (!global.$docsify || document.getElementById('playbook-topbar')) return;

    var bar = document.createElement('header');
    bar.id = 'playbook-topbar';
    bar.className = 'playbook-topbar';
    bar.innerHTML =
      '<div class="playbook-topbar-inner">' + navHtml(docsifyKey()) +
        '<span class="playbook-spacer"></span>' +
      '</div>';
    global.addEventListener('hashchange', function () { setActive(bar, docsifyKey()); });

    var inner = bar.querySelector('.playbook-topbar-inner');
    inner.appendChild(createToggleButton());
    document.body.insertBefore(bar, document.body.firstChild);
  }

  /* Hubs and practice pages ship a static .site-nav; cheat sheets get a
     .sheet-topbar from sheet-shell.js. Both have their brand and section links
     replaced by the shared nav, and the theme toggle appended. */
  function unifyBar(inner, toggleBefore) {
    if (!inner || inner.querySelector('.pb-nav')) return;
    var old = inner.querySelectorAll(':scope > .brand, :scope > .pill:not(.playbook-doc), :scope > .back-link');
    for (var i = 0; i < old.length; i++) old[i].remove();
    inner.insertAdjacentHTML('afterbegin', navHtml(bodyKey()));
    if (!inner.querySelector('[data-theme-toggle]')) {
      inner.insertBefore(createToggleButton(), toggleBefore ? inner.querySelector(toggleBefore) : null);
    }
  }

  function boot() {
    apply(getTheme(), false);
    unifyBar(document.querySelector('.site-nav-inner'));
    unifyBar(document.querySelector('.sheet-topbar-inner'), '.toc-toggle');
    updateToggleButtons(getTheme());
  }

  function bootDocsify() {
    injectDocsifyTopbar();
    updateToggleButtons(getTheme());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.addEventListener('load', bootDocsify);

  global.PlaybookTheme = { get: getTheme, set: apply, toggle: toggle };
})(window);
