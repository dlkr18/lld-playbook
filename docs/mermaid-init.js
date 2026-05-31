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

  function configure() {
    if (!global.mermaid || !global.mermaid.initialize) return;
    var isLight = themeName() === 'neutral';
    global.mermaid.initialize({
      startOnLoad: false,
      theme: themeName(),
      securityLevel: 'loose',
      themeVariables: themeVariables(isLight)
    });
  }

  function renderMermaid() {
    if (!global.mermaid) return Promise.resolve();

    configure();

    var nodes = document.querySelectorAll('.mermaid:not([data-processed])');
    if (!nodes.length) return Promise.resolve();

    nodes.forEach(function (n) {
      if (!n.getAttribute('data-mermaid-src')) {
        n.setAttribute('data-mermaid-src', n.textContent);
      }
    });

    if (global.mermaid.run) {
      return global.mermaid.run({ nodes: nodes }).then(function () {
        nodes.forEach(function (n) { n.setAttribute('data-processed', 'true'); });
      }).catch(function (err) {
        console.error('Mermaid run failed', err);
        return fallbackRender(nodes);
      });
    }
    return fallbackRender(nodes);
  }

  function fallbackRender(nodes) {
    var chain = Promise.resolve();
    nodes.forEach(function (el, i) {
      chain = chain.then(function () {
        var id = 'mermaid-svg-' + Date.now() + '-' + i;
        var def = (el.textContent || '').trim();
        if (!def) return;
        return global.mermaid.render(id, def).then(function (res) {
          el.innerHTML = res.svg;
          el.setAttribute('data-processed', 'true');
        });
      });
    });
    return chain;
  }

  global.configureMermaid = configure;
  global.renderMermaid = renderMermaid;

  document.addEventListener('playbook-theme-change', function () {
    document.querySelectorAll('.mermaid[data-processed]').forEach(function (el) {
      el.removeAttribute('data-processed');
      var src = el.getAttribute('data-mermaid-src');
      if (src) el.textContent = src;
    });
    renderMermaid();
  });
})(window);
