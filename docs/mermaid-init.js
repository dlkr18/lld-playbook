(function (global) {
  'use strict';

  function themeName() {
    var t = document.documentElement.getAttribute('data-theme');
    return t === 'light' ? 'neutral' : 'dark';
  }

  function themeVariables(isLight) {
    if (isLight) {
      return {
        primaryColor: '#e8ecf2',
        primaryBorderColor: '#2563eb',
        primaryTextColor: '#12151c',
        lineColor: '#5c6578',
        secondaryColor: '#f6f7f9',
        tertiaryColor: '#ffffff'
      };
    }
    return {
      primaryColor: '#2a3040',
      primaryBorderColor: '#5cc4fc',
      primaryTextColor: '#f2f4f8',
      lineColor: '#7a8498',
      secondaryColor: '#171a24',
      tertiaryColor: '#1a1e28'
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
    var isLight = themeName() === 'neutral';
    global.mermaid.initialize({
      startOnLoad: false,
      theme: themeName(),
      securityLevel: 'loose',
      themeVariables: themeVariables(isLight),
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

  document.addEventListener('playbook-theme-change', function () {
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
