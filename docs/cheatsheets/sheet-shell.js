(function () {
  'use strict';

  /* prevent theme flash on sheet pages */
  try {
    var t = localStorage.getItem('playbook-theme');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  var nav = document.querySelector('nav.nav');
  if (!nav) return;

  var path = window.location.pathname;
  var csIdx = path.indexOf('/docs/cheatsheets/');
  if (csIdx === -1) return;

  var relPath = path.slice(csIdx + '/docs/cheatsheets/'.length);
  var segments = relPath.split('/').filter(Boolean);
  var depth = segments.length - 1;
  var root = depth <= 0 ? '' : Array(depth + 1).join('../');

  function detectVertical() {
    if (path.indexOf('/ai/') !== -1) return 'ai';
    if (path.indexOf('/dsa/') !== -1) return 'dsa';
    if (path.indexOf('/hld/') !== -1 || path.indexOf('/concepts/') !== -1 ||
        path.indexOf('/tech/') !== -1 || path.indexOf('/stretch/') !== -1) return 'hld';
    return 'lld';
  }

  var vertical = detectVertical();
  var accentColors = { lld: '#e8a030', hld: '#5cc4fc', dsa: '#5ee892', ai: '#b87afc' };
  var verticalLabels = { lld: 'LLD', hld: 'HLD', dsa: 'DSA', ai: 'AI' };
  var hubPaths = {
    lld: root + 'lld/index.html',
    hld: root + 'hld/hub.html',
    dsa: root + 'dsa/index.html',
    ai: root + 'ai/index.html'
  };

  function buildBreadcrumb() {
    var parts = [];
    parts.push('<a href="' + root + 'index.html">Sheets</a>');
    if (vertical === 'ai' && segments.length >= 2) {
      parts.push('<span class="sep">/</span><a href="' + root + 'ai/index.html">AI</a>');
      var tier = segments[0];
      var tierNames = { fundamentals: 'Fundamentals', tech: 'Tech', systems: 'Systems', stretch: 'Stretch' };
      if (tierNames[tier]) {
        parts.push('<span class="sep">/</span><a href="' + root + 'ai/' + tier + '/index.html">' + tierNames[tier] + '</a>');
      }
    } else if (vertical === 'hld') {
      parts.push('<span class="sep">/</span><a href="' + root + 'hld/hub.html">HLD</a>');
      if (segments[0] === 'concepts') {
        parts.push('<span class="sep">/</span><a href="' + root + 'concepts/index.html">Concepts</a>');
      } else if (segments[0] === 'tech') {
        parts.push('<span class="sep">/</span><a href="' + root + 'tech/index.html">Tech</a>');
      } else if (segments[0] === 'stretch') {
        parts.push('<span class="sep">/</span><a href="' + root + 'stretch/index.html">Stretch</a>');
      }
    } else if (vertical === 'dsa') {
      parts.push('<span class="sep">/</span><a href="' + root + 'dsa/index.html">DSA</a>');
    } else if (vertical === 'lld') {
      parts.push('<span class="sep">/</span><a href="' + root + 'lld/index.html">LLD</a>');
    }
    var titleEl = nav.querySelector('h2');
    if (titleEl) {
      parts.push('<span class="sep">/</span><span>' + titleEl.textContent + '</span>');
    }
    return parts.join('');
  }

  /* top bar */
  var topbar = document.createElement('header');
  topbar.className = 'sheet-topbar';
  topbar.innerHTML =
    '<div class="sheet-topbar-inner">' +
      '<a href="' + root + 'index.html" class="brand">LLD <span>Playbook</span></a>' +
      ['lld', 'hld', 'dsa', 'ai'].map(function (v) {
        var cls = 'pill ' + v + (v === vertical ? ' active' : '');
        return '<a href="' + hubPaths[v] + '" class="' + cls + '">' + verticalLabels[v] + '</a>';
      }).join('') +
      '<div class="crumb">' + buildBreadcrumb() + '</div>' +
      '<button type="button" class="toc-toggle" aria-label="Open table of contents">Sections</button>' +
    '</div>';
  document.body.insertBefore(topbar, document.body.firstChild);

  var progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  document.body.classList.add('has-sheet-shell');
  document.body.classList.add('theme-' + vertical);
  document.body.style.setProperty('--accent', accentColors[vertical] || accentColors.hld);

  /* mobile drawer */
  var backdrop = document.createElement('div');
  backdrop.className = 'toc-drawer-backdrop';
  var drawer = document.createElement('nav');
  drawer.className = 'toc-drawer';
  drawer.setAttribute('aria-label', 'Table of contents');
  var drawerTitle = nav.querySelector('h2');
  drawer.innerHTML = '<h3>' + (drawerTitle ? drawerTitle.textContent : 'Sections') + '</h3>';
  var sectionLinks = nav.querySelectorAll('a[href^="#"]');
  var i;
  for (i = 0; i < sectionLinks.length; i++) {
    var clone = sectionLinks[i].cloneNode(true);
    drawer.appendChild(clone);
  }
  document.body.appendChild(backdrop);
  document.body.appendChild(drawer);

  var toggleBtn = topbar.querySelector('.toc-toggle');
  function openDrawer() {
    backdrop.classList.add('open');
    drawer.classList.add('open');
  }
  function closeDrawer() {
    backdrop.classList.remove('open');
    drawer.classList.remove('open');
  }
  toggleBtn.addEventListener('click', openDrawer);
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });
  drawer.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeDrawer();
  });

  /* scroll spy + progress */
  var sections = document.querySelectorAll('section[id]');
  var allNavLinks = nav.querySelectorAll('a[href^="#"]');
  var drawerLinks = drawer.querySelectorAll('a[href^="#"]');

  function setActive(id) {
    var j, link, href;
    for (j = 0; j < allNavLinks.length; j++) {
      link = allNavLinks[j];
      href = link.getAttribute('href');
      if (href === '#' + id) link.classList.add('active');
      else link.classList.remove('active');
    }
    for (j = 0; j < drawerLinks.length; j++) {
      link = drawerLinks[j];
      href = link.getAttribute('href');
      if (href === '#' + id) link.classList.add('active');
      else link.classList.remove('active');
    }
  }

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      var best = null;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) best = entry.target.id;
      });
      if (best) setActive(best);
    }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });
    for (i = 0; i < sections.length; i++) observer.observe(sections[i]);
  }

  function updateProgress() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    progress.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* theme toggle on sheet pages */
  var themeSrc = '../'.repeat(depth + 1) + 'theme.js';
  if (!document.querySelector('script[src*="theme.js"]')) {
    var themeScript = document.createElement('script');
    themeScript.src = themeSrc;
    themeScript.onload = function () {
      if (window.PlaybookTheme) {
        window.PlaybookTheme.set(window.PlaybookTheme.get(), false);
      }
    };
    document.head.appendChild(themeScript);
  }
})();
