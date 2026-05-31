(function () {
  'use strict';

  var STORAGE_PREFIX = 'dsa-practice-done-';

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function loadDone(topicId) {
    try {
      var raw = localStorage.getItem(STORAGE_PREFIX + topicId);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveDone(topicId, doneMap) {
    try {
      localStorage.setItem(STORAGE_PREFIX + topicId, JSON.stringify(doneMap));
    } catch (e) { /* quota */ }
  }

  function renderQuestion(q, index, topicId, doneMap) {
    var id = q.id || topicId + '-' + index;
    var checked = doneMap[id] ? ' checked' : '';
    var doneClass = doneMap[id] ? ' done' : '';
    var imp = q.importance || 'should';
    var sub = q.subtopic || '';
    var diff = q.difficulty || '';

    var constraintsHtml = (q.constraints || []).map(function (c) {
      return '<li>' + escapeHtml(c) + '</li>';
    }).join('');

    var examplesHtml = (q.examples || []).map(function (ex) {
      var block = 'Input: ' + ex.in + '\nOutput: ' + ex.out;
      if (ex.note) block += '\n' + ex.note;
      return '<div class="example-block">' + escapeHtml(block) + '</div>';
    }).join('');

    var approachesHtml = (q.approaches || []).map(function (a) {
      var cx = 'Time ' + a.time + ' · Space ' + a.space;
      return (
        '<details class="approach">' +
          '<summary>' + escapeHtml(a.name) +
            '<span class="complexity">' + escapeHtml(cx) + '</span></summary>' +
          '<pre><code>' + escapeHtml(a.code || '') + '</code></pre>' +
        '</details>'
      );
    }).join('');

    var descHtml = q.description
      ? '<p class="q-description">' + escapeHtml(q.description) + '</p>'
      : '';
    var summaryHtml = q.summary
      ? '<div class="q-summary"><span class="q-summary-label">Remember</span>' +
          escapeHtml(q.summary) + '</div>'
      : '';

    var lc = q.lc ? '<span class="q-lc">LC ' + q.lc + '</span>' : '';

    return (
      '<article class="practice-q' + doneClass + '" data-id="' + escapeHtml(id) + '"' +
        ' data-importance="' + imp + '"' +
        ' data-subtopic="' + escapeHtml(sub) + '">' +
        '<div class="q-header">' +
          '<label class="q-check">' +
            '<input type="checkbox" class="done-cb"' + checked + ' data-id="' + escapeHtml(id) + '">' +
            '<span class="q-title">' + escapeHtml(q.title) + lc + '</span>' +
          '</label>' +
          '<div class="q-badges">' +
            '<span class="importance-badge ' + imp + '">' + impLabel(imp) + '</span>' +
            (sub ? '<span class="subtopic-badge">' + escapeHtml(sub) + '</span>' : '') +
            (diff ? '<span class="diff-badge">' + escapeHtml(diff) + '</span>' : '') +
          '</div>' +
          '<span class="q-chevron">&#9660;</span>' +
        '</div>' +
        '<div class="q-body">' +
          descHtml +
          summaryHtml +
          (constraintsHtml ? '<div class="q-section"><h4>Constraints</h4><ul>' + constraintsHtml + '</ul></div>' : '') +
          (examplesHtml ? '<div class="q-section"><h4>Examples</h4>' + examplesHtml + '</div>' : '') +
          (approachesHtml ? '<div class="q-section"><h4>Optimal approaches (C++)</h4>' + approachesHtml + '</div>' : '') +
        '</div>' +
      '</article>'
    );
  }

  function impLabel(imp) {
    if (imp === 'must') return 'Must do';
    if (imp === 'nice') return 'Nice to have';
    return 'Should do';
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function updateProgress(topic, doneMap) {
    var total = topic.questions.length;
    var done = 0;
    topic.questions.forEach(function (q, i) {
      var id = q.id || topic.id + '-' + i;
      if (doneMap[id]) done++;
    });
    $$('.practice-progress').forEach(function (el) {
      el.innerHTML = '<strong>' + done + '</strong> / ' + total + ' done';
    });
    var pct = total ? Math.round((done / total) * 100) : 0;
    document.title = '(' + done + '/' + total + ') ' + topic.title + ' — DSA Practice';
    return { done: done, total: total, pct: pct };
  }

  function applyFilters(topicId) {
    var impFilter = $('.filter-btn.importance.active');
    var subFilter = $('.filter-btn.subtopic.active');
    var search = ($('.practice-search') || {}).value || '';
    search = search.trim().toLowerCase();

    var imp = impFilter ? impFilter.getAttribute('data-value') : 'all';
    var sub = subFilter ? subFilter.getAttribute('data-value') : 'all';

    $$('.practice-q').forEach(function (card) {
      var show = true;
      if (imp !== 'all' && card.getAttribute('data-importance') !== imp) show = false;
      if (sub !== 'all' && card.getAttribute('data-subtopic') !== sub) show = false;
      if (search) {
        var text = card.textContent.toLowerCase();
        if (text.indexOf(search) === -1) show = false;
      }
      card.classList.toggle('hidden', !show);
    });
  }

  function bindFilters(subtopics) {
    var impGroup = $('.filter-group.importance');
    if (impGroup) {
      impGroup.addEventListener('click', function (e) {
        var btn = e.target.closest('.filter-btn');
        if (!btn) return;
        $$('.filter-group.importance .filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        applyFilters();
      });
    }

    var subGroup = $('.filter-group.subtopic');
    if (subGroup && subtopics) {
      subtopics.forEach(function (s) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'filter-btn subtopic';
        b.setAttribute('data-value', s.id);
        b.textContent = s.label;
        subGroup.appendChild(b);
      });
      subGroup.addEventListener('click', function (e) {
        var btn = e.target.closest('.filter-btn');
        if (!btn) return;
        $$('.filter-group.subtopic .filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        applyFilters();
      });
    }

    var searchEl = $('.practice-search');
    if (searchEl) {
      searchEl.addEventListener('input', applyFilters);
    }
  }

  function initTopicPage() {
    var topic = window.PRACTICE_TOPIC;
    if (!topic || !topic.questions) return;

    var doneMap = loadDone(topic.id);
    var list = $('.practice-list');
    if (!list) return;

    var html = '';
    topic.questions.forEach(function (q, i) {
      html += renderQuestion(q, i, topic.id, doneMap);
    });
    list.innerHTML = html;

    updateProgress(topic, doneMap);
    bindFilters(topic.subtopics);

    list.addEventListener('change', function (e) {
      if (!e.target.classList.contains('done-cb')) return;
      var qid = e.target.getAttribute('data-id');
      doneMap[qid] = e.target.checked;
      saveDone(topic.id, doneMap);
      var card = e.target.closest('.practice-q');
      if (card) card.classList.toggle('done', e.target.checked);
      updateProgress(topic, doneMap);
    });

    list.addEventListener('click', function (e) {
      if (e.target.classList.contains('done-cb')) return;
      var header = e.target.closest('.q-header');
      if (!header) return;
      if (e.target.closest('.q-check') && e.target.tagName !== 'INPUT') {
        var cb = header.querySelector('.done-cb');
        if (cb) { cb.checked = !cb.checked; cb.dispatchEvent(new Event('change', { bubbles: true })); }
        return;
      }
      header.closest('.practice-q').classList.toggle('open');
    });

    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTopicPage);
  } else {
    initTopicPage();
  }
})();
