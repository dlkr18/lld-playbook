(function (global) {
  'use strict';

  var STORAGE_KEY = 'playbook-theme';

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

    var base = (global.$docsify && global.$docsify.basePath) ? global.$docsify.basePath : '/lld-playbook/';

    var bar = document.createElement('header');
    bar.id = 'playbook-topbar';
    bar.className = 'playbook-topbar';
    bar.innerHTML =
      '<div class="playbook-topbar-inner">' +
        '<a href="#/" class="playbook-brand">Interview <span>Playbook</span></a>' +
        '<a href="' + base + 'cheatsheets/index.html" class="playbook-link">Cheat Sheets</a>' +
        '<a href="#/getting-started" class="playbook-link">Start</a>' +
        '<a href="#/PLAN" class="playbook-link">4-Week Plan</a>' +
        '<a href="#/problems/CATALOG" class="playbook-link">Problems</a>' +
        '<span class="playbook-spacer"></span>' +
      '</div>';

    var inner = bar.querySelector('.playbook-topbar-inner');
    inner.appendChild(createToggleButton());
    document.body.insertBefore(bar, document.body.firstChild);
  }

  function injectCheatsheetToggle() {
    var navInner = document.querySelector('.site-nav-inner');
    if (!navInner || navInner.querySelector('[data-theme-toggle]')) return;
    navInner.appendChild(createToggleButton());
  }

  function injectSheetToggle() {
    var inner = document.querySelector('.sheet-topbar-inner');
    if (!inner || inner.querySelector('[data-theme-toggle]')) return;
    inner.insertBefore(createToggleButton(), inner.querySelector('.toc-toggle'));
  }

  function boot() {
    apply(getTheme(), false);
    injectCheatsheetToggle();
    injectSheetToggle();
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
