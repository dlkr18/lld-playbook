(function () {
  'use strict';

  var grids = document.querySelectorAll('.grid, .sub-grid, .vertical-grid');
  if (!grids.length) return;

  if (!document.querySelector('.hub-toolbar')) {
    var toolbar = document.createElement('div');
    toolbar.className = 'hub-toolbar';
    toolbar.innerHTML =
      '<div class="hub-search-wrap">' +
        '<svg class="hub-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
        '<input type="search" class="hub-search" placeholder="Search topics (press /)" autocomplete="off" spellcheck="false" aria-label="Search topics">' +
        '<button type="button" class="hub-clear" aria-label="Clear search" hidden>&times;</button>' +
      '</div>' +
      '<div class="hub-meta">' +
        '<span class="hub-count" aria-live="polite" aria-atomic="true"></span>' +
        '<div class="hub-view-toggle" role="group" aria-label="View mode">' +
          '<button type="button" class="view-btn active" data-view="grid" title="Grid view" aria-pressed="true">Grid</button>' +
          '<button type="button" class="view-btn" data-view="list" title="List view" aria-pressed="false">List</button>' +
        '</div>' +
      '</div>';
    var container = document.querySelector('.container');
    var anchor = container
      ? container.querySelector('.section, .sub-grid, .vertical-grid, .grid')
      : document.querySelector('.vertical-grid, .sub-grid, .grid');
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(toolbar, anchor);
    }
  }

  var input = document.querySelector('.hub-search');
  var clearBtn = document.querySelector('.hub-clear');
  var countEl = document.querySelector('.hub-count');
  var viewBtns = document.querySelectorAll('.view-btn');

  var cards = [];
  grids.forEach(function (grid) {
    var items = grid.querySelectorAll('.card, .sub-card, .vertical-card');
    for (var i = 0; i < items.length; i++) {
      cards.push({ el: items[i], text: (items[i].textContent || '').toLowerCase() });
    }
  });

  function updateCount(visible, total) {
    if (!countEl) return;
    if (visible === total) {
      countEl.textContent = total + ' topic' + (total === 1 ? '' : 's');
    } else {
      countEl.textContent = visible + ' of ' + total + ' shown';
    }
  }

  function filterCards(query) {
    var q = query.toLowerCase().trim();
    var terms = q ? q.split(/\s+/).filter(Boolean) : [];
    var visible = 0;

    cards.forEach(function (item) {
      var show = terms.length === 0 || terms.every(function (t) {
        return item.text.indexOf(t) !== -1;
      });
      item.el.classList.toggle('hub-hidden', !show);
      if (show) visible++;
    });

    grids.forEach(function (grid) {
      var anyVisible = grid.querySelector(
        '.card:not(.hub-hidden), .sub-card:not(.hub-hidden), .vertical-card:not(.hub-hidden)'
      );
      grid.classList.toggle('hub-empty', !anyVisible && terms.length > 0);
    });

    updateCount(visible, cards.length);
    if (clearBtn) clearBtn.hidden = terms.length === 0;
  }

  if (input) {
    input.addEventListener('input', function () { filterCards(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        input.value = '';
        filterCards('');
        input.blur();
      }
    });
  }

  if (clearBtn && input) {
    clearBtn.addEventListener('click', function () {
      input.value = '';
      filterCards('');
      input.focus();
    });
  }

  viewBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var view = btn.getAttribute('data-view');
      viewBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      grids.forEach(function (grid) {
        grid.classList.toggle('list-view', view === 'list');
      });
      try { localStorage.setItem('cheatsheet-view', view); } catch (e) {}
    });
  });

  try {
    var saved = localStorage.getItem('cheatsheet-view');
    if (saved === 'list') {
      var listBtn = document.querySelector('.view-btn[data-view="list"]');
      if (listBtn) listBtn.click();
    }
  } catch (e) {}

  updateCount(cards.length, cards.length);

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && input && document.activeElement !== input &&
        !/input|textarea|select/i.test(document.activeElement.tagName)) {
      e.preventDefault();
      input.focus();
    }
  });
})();
