(function (global) {
  'use strict';

  /* Diagrams take their colours from theme.css, so they follow the site in
     both themes instead of carrying a second, hand-kept palette. */
  function token(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function themeVariables() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      darkMode: dark,
      fontFamily: token('--font-sans'),
      fontSize: '14px',
      background: token('--surface-page'),
      primaryColor: token('--surface-raised'),
      primaryBorderColor: token('--border-strong'),
      primaryTextColor: token('--text-heading'),
      secondaryColor: token('--surface-sunken'),
      tertiaryColor: token('--surface-page'),
      lineColor: token('--text-muted'),
      textColor: token('--text-primary'),
      noteBkgColor: token('--accent-soft'),
      noteTextColor: token('--text-heading'),
      noteBorderColor: token('--accent'),
      actorBkg: token('--surface-raised'),
      actorBorder: token('--border-strong'),
      signalColor: token('--text-secondary'),
      labelBoxBkgColor: token('--surface-sunken')
    };
  }

  function isStructuralLine(t) {
    if (!t || t === '{' || t === '}') return true;
    if (t.indexOf('classDiagram') === 0 || t.indexOf('stateDiagram') === 0) return true;
    if (t.indexOf('sequenceDiagram') === 0 || t.indexOf('flowchart') === 0) return true;
    if (t.indexOf('graph ') === 0) return true;
    if (t.indexOf('-->') !== -1 || t.indexOf('..>') !== -1 || t.indexOf('..|>') !== -1) return true;
    if (t.indexOf('<|--') !== -1 || t.indexOf('<|..') !== -1) return true;
    if (t.indexOf('class ') === 0 && t.indexOf('{') !== -1) return true;
    if (t.indexOf('<<') === 0 && t.lastIndexOf('>>') === t.length - 2) return true;
    if (t.indexOf('note ') === 0 || t.indexOf('participant ') === 0 || t.indexOf('state ') === 0) return true;
    return false;
  }

  function sanitizeMermaid(def) {
    if (!def) return def;
    var isClass = def.trim().indexOf('classDiagram') === 0;
    if (!isClass) return def;

    return def.split('\n').map(function (line) {
      var t = line.trim();
      if (isStructuralLine(t)) return line;

      line = line.replace(/~([^~\n]+)~/g, ' $1');
      line = line.replace(/(\w+)\[\[\]/g, '$1Grid');
      line = line.replace(/(\w+)\[\]/g, '$1Array');
      line = line.replace(/\[[^\]]*\]/g, '');
      line = line.replace(/<[^>]+>/g, '');
      line = line.replace(/\(([^)]*)\)/g, function (m, inner) {
        if (inner.indexOf(',') !== -1 || inner.indexOf('[') !== -1 || inner.split(' ').length > 2) {
          return '()';
        }
        return m;
      });
      line = line.replace(/  +/g, ' ');
      return line;
    }).join('\n');
  }

  function configure() {
    if (!global.mermaid || !global.mermaid.initialize) return;
    global.mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      securityLevel: 'loose',
      themeVariables: themeVariables(),
      logLevel: 'error'
    });
  }

  function markError(el, err) {
    el.setAttribute('data-processed', 'error');
    el.innerHTML = '<div class="mermaid-fallback">Diagram could not render. See the PNG class diagram above, or open CODE walkthrough.</div>';
    if (global.console && global.console.warn) {
      global.console.warn('Mermaid render failed:', err);
    }
  }

  function renderOne(el, index) {
    var raw = el.getAttribute('data-mermaid-src') || el.textContent || '';
    var def = sanitizeMermaid(raw.trim());
    if (!def) return Promise.resolve();

    el.textContent = def;
    if (!el.getAttribute('data-mermaid-src')) {
      el.setAttribute('data-mermaid-src', raw.trim());
    }

    var id = 'mermaid-' + Date.now() + '-' + index;

    if (global.mermaid.render) {
      return global.mermaid.render(id, def).then(function (res) {
        el.innerHTML = res.svg;
        el.setAttribute('data-processed', 'true');
        if (res.bindFunctions) res.bindFunctions(el);
      }).catch(function (err) {
        markError(el, err);
      });
    }
    return Promise.resolve();
  }

  function renderMermaid() {
    if (!global.mermaid) return Promise.resolve();
    configure();

    var nodes = document.querySelectorAll('.mermaid:not([data-processed])');
    if (!nodes.length) return Promise.resolve();

    var chain = Promise.resolve();
    for (var i = 0; i < nodes.length; i++) {
      (function (el, idx) {
        chain = chain.then(function () { return renderOne(el, idx); });
      })(nodes[i], i);
    }
    return chain;
  }

  global.configureMermaid = configure;
  global.renderMermaid = renderMermaid;

  /* Cheat sheets have no docsify hooks: configure now, before mermaid's own
     load handler reads startOnLoad, then render once the page is in. */
  if (!global.$docsify) {
    configure();
    window.addEventListener('load', renderMermaid);
  }

  window.addEventListener('playbook-theme-change', function () {
    document.querySelectorAll('.mermaid[data-processed]').forEach(function (el) {
      el.removeAttribute('data-processed');
      var src = el.getAttribute('data-mermaid-src');
      if (src) {
        el.textContent = src;
        el.innerHTML = '';
      }
    });
    renderMermaid();
  });
})(window);
