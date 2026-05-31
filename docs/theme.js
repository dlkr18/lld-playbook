(function (global) {
  'use strict';

  var STORAGE_KEY = 'playbook-theme';

  function systemTheme() {
    if (global.matchMedia && global.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  function getTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return systemTheme();
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

  function applyMermaid(theme) {
    if (global.renderMermaid) {
      global.renderMermaid();
      return;
    }
    if (!global.mermaid || !global.mermaid.initialize) return;
    var isLight = theme === 'light';
    global.mermaid.initialize({
      startOnLoad: false,
      theme: isLight ? 'neutral' : 'dark',
      themeVariables: isLight ? {
        primaryColor: '#e8ecf2',
        primaryBorderColor: '#5b8def',
        primaryTextColor: '#12151c',
        lineColor: '#5c6578',
        secondaryColor: '#f6f7f9',
        tertiaryColor: '#ffffff'
      } : {
        primaryColor: '#2a3040',
        primaryBorderColor: '#5cc4fc',
        primaryTextColor: '#f2f4f8',
        lineColor: '#7a8498',
        secondaryColor: '#171a24',
        tertiaryColor: '#1a1e28'
      }
    });
    document.querySelectorAll('.mermaid[data-processed]').forEach(function (el) {
      el.removeAttribute('data-processed');
    });
    if (typeof global.renderMermaid === 'function') {
      global.renderMermaid();
    }
  }

  function apply(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist !== false) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    }
    updateToggleButtons(theme);
    applyMermaid(theme);
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
    if (!document.getElementById('app') || document.getElementById('playbook-topbar')) return;

    var base = (global.$docsify && global.$docsify.basePath) ? global.$docsify.basePath : '/lld-playbook/';

    var bar = document.createElement('header');
    bar.id = 'playbook-topbar';
    bar.className = 'playbook-topbar';
    bar.innerHTML =
      '<div class="playbook-topbar-inner">' +
        '<a href="#/" class="playbook-brand">LLD <span>Playbook</span></a>' +
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
