/* ============================================================================
   reading.js — the reading layer for the docsify site.

   A docsify plugin. Everything here exists to answer the three questions a
   reader has on a long page: where am I, what's on this page, how do I get
   to the part I want.

     - "On this page" rail with scroll-spy (wide screens)
     - sidebar that shows where you are: problem groups collapse, the current
       page's group opens and scrolls into view, each problem's "Code" link
       sits inline instead of doubling the row count
     - reading-progress bar and back-to-top
     - CODE pages: file names as titles, expand/collapse all

   Must load BEFORE docsify.min.js — docsify reads $docsify.plugins at boot.
   ============================================================================ */
(function () {
  'use strict';

  var MIN_TOC_HEADINGS = 3;
  var tocLinks = [];
  var tocTargets = [];
  var ticking = false;

  /* ---------------- chrome created once ---------------- */

  function ensureChrome() {
    if (document.getElementById('pb-progress')) return;

    var bar = document.createElement('div');
    bar.id = 'pb-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var top = document.createElement('button');
    top.id = 'pb-to-top';
    top.type = 'button';
    top.setAttribute('aria-label', 'Back to top');
    top.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    document.body.appendChild(top);

    var toc = document.createElement('nav');
    toc.id = 'pb-toc';
    toc.className = 'page-toc';
    toc.setAttribute('aria-label', 'On this page');
    document.body.appendChild(toc);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /* ---------------- "On this page" ---------------- */

  function buildToc() {
    var toc = document.getElementById('pb-toc');
    var section = document.querySelector('.markdown-section');
    tocLinks = [];
    tocTargets = [];
    if (!toc || !section) return;

    var heads = [].slice.call(section.querySelectorAll('h2[id], h3[id]'));
    var isHome = document.body.classList.contains('page-home');

    if (isHome || heads.length < MIN_TOC_HEADINGS) {
      toc.innerHTML = '';
      document.body.classList.remove('has-page-toc');
      return;
    }

    var html = '<p class="page-toc-title">On this page</p><ul>';
    heads.forEach(function (h) {
      var text = h.textContent.replace(/\s+/g, ' ').trim();
      html += '<li class="lvl-' + h.tagName.toLowerCase() + '"><a href="#' +
        location.hash.split('?')[0].replace(/^#/, '') + '?id=' + h.id + '" data-id="' +
        h.id + '" title="' + escapeHtml(text) + '">' + escapeHtml(text) + '</a></li>';
    });
    toc.innerHTML = html + '</ul>';
    document.body.classList.add('has-page-toc');

    tocLinks = [].slice.call(toc.querySelectorAll('a'));
    tocTargets = heads;

    // docsify's own anchor handling re-routes ?id= links; do a plain scroll
    // instead so the rail never triggers a page re-render.
    tocLinks.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var top = tocTargets[i].getBoundingClientRect().top + window.scrollY - topOffset();
        window.scrollTo({ top: top, behavior: 'smooth' });
        history.replaceState(null, '', a.getAttribute('href'));
      });
    });
  }

  function topOffset() {
    var bar = document.querySelector('.playbook-topbar');
    return (bar ? bar.offsetHeight : 52) + 20;
  }

  /* ---------------- scroll-driven state ---------------- */

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;

      var bar = document.getElementById('pb-progress');
      if (bar) bar.style.width = pct + '%';

      var btn = document.getElementById('pb-to-top');
      if (btn) btn.classList.toggle('show', window.scrollY > window.innerHeight * 1.5);

      spy();
    });
  }

  function spy() {
    if (!tocTargets.length) return;
    var line = topOffset() + 8;
    var active = 0;
    for (var i = 0; i < tocTargets.length; i++) {
      if (tocTargets[i].getBoundingClientRect().top <= line) active = i;
      else break;
    }
    // at the very bottom, the last heading may never reach the line
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      active = tocTargets.length - 1;
    }
    tocLinks.forEach(function (a, i) { a.classList.toggle('active', i === active); });

    var activeLink = tocLinks[active];
    var toc = document.getElementById('pb-toc');
    if (activeLink && toc && toc.scrollHeight > toc.clientHeight) {
      var r = activeLink.getBoundingClientRect(), t = toc.getBoundingClientRect();
      if (r.top < t.top + 24 || r.bottom > t.bottom - 24) {
        toc.scrollTop += r.top - t.top - t.height / 2;
      }
    }
  }

  /* ---------------- sidebar: show where the reader is ---------------- */

  function tidySidebar() {
    var nav = document.querySelector('.sidebar-nav');
    if (!nav) return;

    // Flag the LIST, not .sidebar-nav: docsify can replace the nav's innerHTML
    // on navigation, which would leave a flag on the container but fresh,
    // untidied markup inside it.
    var root = nav.querySelector(':scope > ul');
    if (root && !root.dataset.pbTidied) {
      root.dataset.pbTidied = '1';

      // 1. A problem row is "README" with a nested ul holding one "Code" link.
      //    Pull Code inline as a pill: 45 rows instead of 90.
      [].slice.call(nav.querySelectorAll('li')).forEach(function (li) {
        var sub = li.querySelector(':scope > ul');
        var main = li.querySelector(':scope > a');
        if (!sub || !main) return;
        var items = sub.querySelectorAll(':scope > li');
        if (items.length !== 1) return;
        var code = items[0].querySelector(':scope > a');
        if (!code || code.textContent.trim().toLowerCase() !== 'code') return;
        code.className = (code.className + ' pb-code-pill').trim();
        code.setAttribute('aria-label', 'Code for ' + main.textContent.trim());
        var row = document.createElement('span');
        row.className = 'pb-row';
        li.insertBefore(row, main);
        row.appendChild(main);
        row.appendChild(code);
        sub.remove();
        if (items[0].classList.contains('active')) li.classList.add('active');
      });

      // 2. Difficulty groups ("Easy (8)", ...) become collapsible.
      [].slice.call(nav.querySelectorAll('li')).forEach(function (li) {
        var head = li.querySelector(':scope > strong');
        var list = li.querySelector(':scope > ul');
        if (!head || !list || li.querySelector(':scope > a')) return;
        // only nested groups; the top-level group headings stay as labels
        if (!li.parentElement || !li.parentElement.closest('li')) return;
        li.classList.add('pb-group');
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pb-group-toggle';
        btn.setAttribute('aria-expanded', 'true');
        while (li.firstChild && li.firstChild !== list) btn.appendChild(li.firstChild);
        li.insertBefore(btn, list);
        btn.addEventListener('click', function () {
          var open = li.classList.toggle('collapsed') === false;
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      });
    }

    // 3. Open only the group holding the current page, collapse the rest.
    var current = currentLink(nav);
    [].slice.call(nav.querySelectorAll('li.pb-group')).forEach(function (g) {
      var holds = current && g.contains(current);
      g.classList.toggle('collapsed', !holds);
      var b = g.querySelector(':scope > .pb-group-toggle');
      if (b) b.setAttribute('aria-expanded', holds ? 'true' : 'false');
    });

    // 4. Bring the current page into view inside the sidebar.
    if (current) {
      var sb = document.querySelector('aside.sidebar');
      var r = current.getBoundingClientRect(), s = sb.getBoundingClientRect();
      if (r.top < s.top + 80 || r.bottom > s.bottom - 40) {
        sb.scrollTop += r.top - s.top - s.height / 3;
      }
    }
  }

  function currentLink(nav) {
    var path = location.hash.split('?')[0];
    var best = null;
    [].slice.call(nav.querySelectorAll('a[href]')).forEach(function (a) {
      var href = a.getAttribute('href').split('?')[0];
      a.classList.toggle('pb-current', href === path);
      if (href === path) best = a;
    });
    return best;
  }

  /* ---------------- CODE pages ---------------- */

  function tidyCodePage() {
    var section = document.querySelector('.markdown-section');
    if (!section) return;
    var files = [].slice.call(section.querySelectorAll('details')).filter(function (d) {
      var s = d.querySelector('summary');
      return s && /^Click to view /.test(s.textContent.trim());
    });
    if (files.length < 4) return;

    files.forEach(function (d) {
      var s = d.querySelector('summary');
      var name = s.textContent.trim().replace(/^Click to view /, '');
      // The generator already puts the file path in a heading right above, so
      // repeating it in the summary labelled every file twice. Say what
      // opening it gets you instead.
      var prev = d.previousElementSibling;
      var titled = prev && /^H[2-4]$/.test(prev.tagName) && prev.textContent.trim() === name;
      var pre = d.querySelector('pre');
      var lines = pre ? pre.textContent.replace(/\n$/, '').split('\n').length : 0;
      s.innerHTML = titled
        ? '<span class="pb-file-meta">Show source' + (lines ? ' · ' + lines + ' lines' : '') + '</span>'
        : '<span class="pb-file">' + escapeHtml(name) + '</span>';
      d.classList.add('pb-file-block');
    });

    var bar = document.createElement('div');
    bar.className = 'pb-file-toolbar';
    bar.innerHTML = '<span>' + files.length + ' files</span>' +
      '<button type="button" data-act="open">Expand all</button>' +
      '<button type="button" data-act="close">Collapse all</button>';
    files[0].parentNode.insertBefore(bar, files[0]);
    bar.addEventListener('click', function (e) {
      var act = e.target.getAttribute && e.target.getAttribute('data-act');
      if (!act) return;
      files.forEach(function (d) { d.open = act === 'open'; });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------------- register ---------------- */

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
    hook.doneEach(function () {
      ensureChrome();
      tidyCodePage();
      buildToc();
      tidySidebar();
      onScroll();
    });
  });
})();
