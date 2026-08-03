(function () {
  'use strict';

  function bootstrap() {
  // Light-first, matching theme.js and the inline bootstrap: only a stored 'dark'
  // sets the attribute. :root is the light theme, so the default needs no work.
  try {
    if (localStorage.getItem('playbook-theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {}

  var nav = document.querySelector('nav.nav');
  if (!nav) return;

  var ctx = window.PlaybookPaths && window.PlaybookPaths.cheatsheetContext
    ? window.PlaybookPaths.cheatsheetContext()
    : null;

  if (!ctx) {
    var path = window.location.pathname;
    var markers = ['/docs/cheatsheets/', '/cheatsheets/'];
    var found = false;
    var i, idx, marker;
    for (i = 0; i < markers.length; i++) {
      idx = path.indexOf(markers[i]);
      if (idx !== -1) {
        ctx = {
          siteBase: path.slice(0, idx),
          relPath: path.slice(idx + markers[i].length),
          marker: markers[i]
        };
        found = true;
        break;
      }
    }
    if (!found) return;
  }

  var path = window.location.pathname;
  var relPath = ctx.relPath;
  var segments = relPath.split('/').filter(Boolean);
  var depth = segments.length - 1;
  var root = depth <= 0 ? '' : Array(depth + 1).join('../');
  var siteBase = ctx.siteBase || '';

  function detectVertical() {
    if (path.indexOf('/ai/') !== -1) return 'ai';
    if (path.indexOf('/dsa/') !== -1) return 'dsa';
    if (path.indexOf('/hld/') !== -1 || path.indexOf('/concepts/') !== -1 ||
        path.indexOf('/tech/') !== -1 || path.indexOf('/stretch/') !== -1) return 'hld';
    return 'lld';
  }

  var vertical = detectVertical();
  /* No per-vertical accent map. It used to write --accent inline on <body>,
     which overrode theme.css's global accent on all 187 sheets. Those four
     hexes were picked for a dark background and score 1.56-2.91:1 as link
     text on the light page — all four fail AA. The vertical now comes from
     the body.theme-* class alone, which resolves --vertical/--vertical-fg in
     theme.css; --accent stays global at 6.21:1. */
  var verticalLabels = { lld: 'LLD', hld: 'HLD', dsa: 'DSA', ai: 'AI' };
  var hubPaths = {
    lld: root + 'lld/index.html',
    hld: root + 'hld/hub.html',
    dsa: root + 'dsa/index.html',
    ai: root + 'ai/index.html'
  };

  var sheetFile = segments.length ? segments[segments.length - 1] : '';
  var problemSlug = window.PlaybookPaths
    ? window.PlaybookPaths.problemSlugFromSheet(sheetFile)
    : null;

  function playbookLink(page) {
    if (!problemSlug) return '';
    if (window.PlaybookPaths) return window.PlaybookPaths.docUrl(problemSlug, page);
    return siteBase + '/#/' + 'problems/' + problemSlug + '/' + page;
  }

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

  var playbookLinks = '';
  if (problemSlug) {
    playbookLinks =
      '<a href="' + playbookLink('README') + '" class="pill playbook-doc">Docs</a>' +
      '<a href="' + playbookLink('CODE') + '" class="pill playbook-doc">Code</a>';
  }

  var topbar = document.createElement('header');
  topbar.className = 'sheet-topbar';
  topbar.innerHTML =
    '<div class="sheet-topbar-inner">' +
      '<a href="' + siteBase + '/" class="brand">Interview <span>Playbook</span></a>' +
      ['lld', 'hld', 'dsa', 'ai'].map(function (v) {
        var cls = 'pill ' + v + (v === vertical ? ' active' : '');
        return '<a href="' + hubPaths[v] + '" class="' + cls + '">' + verticalLabels[v] + '</a>';
      }).join('') +
      playbookLinks +
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

  var backdrop = document.createElement('div');
  backdrop.className = 'toc-drawer-backdrop';
  var drawer = document.createElement('nav');
  drawer.className = 'toc-drawer';
  drawer.setAttribute('aria-label', 'Table of contents');
  var drawerTitle = nav.querySelector('h2');
  drawer.innerHTML = '<h3>' + (drawerTitle ? drawerTitle.textContent : 'Sections') + '</h3>';
  var sectionLinks = nav.querySelectorAll('a[href^="#"]');
  var j;
  for (j = 0; j < sectionLinks.length; j++) {
    drawer.appendChild(sectionLinks[j].cloneNode(true));
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

  var sections = document.querySelectorAll('section[id]');
  var allNavLinks = nav.querySelectorAll('a[href^="#"]');
  var drawerLinks = drawer.querySelectorAll('a[href^="#"]');

  function setActive(id) {
    var k, link, href;
    for (k = 0; k < allNavLinks.length; k++) {
      link = allNavLinks[k];
      href = link.getAttribute('href');
      if (href === '#' + id) link.classList.add('active');
      else link.classList.remove('active');
    }
    for (k = 0; k < drawerLinks.length; k++) {
      link = drawerLinks[k];
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
    for (j = 0; j < sections.length; j++) observer.observe(sections[j]);
  }

  function updateProgress() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    progress.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

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
  }

  if (window.PlaybookPaths) {
    bootstrap();
    return;
  }

  var bootPath = window.location.pathname;
  var bootMarkers = ['/docs/cheatsheets/', '/cheatsheets/'];
  var bootDepth = 0;
  var bootIdx = -1;
  var b;
  for (b = 0; b < bootMarkers.length; b++) {
    bootIdx = bootPath.indexOf(bootMarkers[b]);
    if (bootIdx !== -1) {
      var bootRel = bootPath.slice(bootIdx + bootMarkers[b].length);
      var bootSegs = bootRel.split('/').filter(Boolean);
      bootDepth = bootSegs.length - 1;
      break;
    }
  }
  var pathsScript = document.createElement('script');
  pathsScript.src = '../'.repeat(bootDepth + 1) + 'playbook-paths.js';
  pathsScript.onload = bootstrap;
  pathsScript.onerror = bootstrap;
  document.head.appendChild(pathsScript);

  /* ------------------------------------------------------------------------
     Diagram lightbox.

     Was 162 byte-identical copies of this IIFE, one per sheet. Owned here now.
     Reads the caption from the .diagram's NEXT ELEMENT SIBLING, which is why
     .diagram-caption must stay immediately after .diagram in the markup.
     ------------------------------------------------------------------------ */
  function initLightbox() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    var img = lb.querySelector('img');
    var cap = lb.querySelector('.lb-cap');
    if (!img) return;

    function open(src, alt, caption) {
      img.src = src;
      img.alt = alt || '';
      if (cap) cap.textContent = caption || alt || '';
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      img.src = '';
    }

    document.querySelectorAll('.diagram img').forEach(function (el) {
      el.addEventListener('click', function () {
        var diag = el.closest('.diagram');
        var sib = diag && diag.nextElementSibling;
        var caption = sib && sib.classList.contains('diagram-caption')
          ? sib.textContent.trim() : '';
        open(el.currentSrc || el.src, el.alt, caption);
      });
    });

    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target === img || e.target.classList.contains('lb-close')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('open')) close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();
