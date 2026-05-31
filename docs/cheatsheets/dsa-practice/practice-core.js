(function () {
  'use strict';

  var R = window.DSAPracticeRender;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function renderListQuestion(q, topicId, doneMap) {
    var id = q.id || topicId + '-x';
    var checked = doneMap[id] ? ' checked' : '';
    var doneClass = doneMap[id] ? ' done' : '';
    var imp = q.importance || 'should';
    var sub = q.subtopic || '';
    var lc = q.lc ? '<span class="q-lc">LC ' + q.lc + '</span>' : '';
    var href = '../q/' + encodeURIComponent(id) + '.html';

    return (
      '<article class="practice-q practice-q-row' + doneClass + '" data-id="' + R.escapeHtml(id) + '"' +
        ' data-importance="' + imp + '"' +
        ' data-subtopic="' + R.escapeHtml(sub) + '">' +
        '<div class="q-header">' +
          '<label class="q-check" onclick="event.stopPropagation()">' +
            '<input type="checkbox" class="done-cb"' + checked + ' data-id="' + R.escapeHtml(id) + '">' +
          '</label>' +
          '<a class="q-title-link" href="' + href + '">' +
            '<span class="q-title">' + R.escapeHtml(q.title) + lc + '</span>' +
          '</a>' +
          '<div class="q-badges">' + R.renderBadges(q) + '</div>' +
          '<a class="q-open-link" href="' + href + '" aria-label="Open question">&#8594;</a>' +
        '</div>' +
      '</article>'
    );
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
    document.title = '(' + done + '/' + total + ') ' + topic.title + ' — DSA Practice';
    return { done: done, total: total };
  }

  function applyFilters() {
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
    if (searchEl) searchEl.addEventListener('input', applyFilters);
  }

  function initTopicPage() {
    var topic = window.PRACTICE_TOPIC;
    if (!topic || !topic.questions) return;

    var doneMap = R.loadDone(topic.id);
    var list = $('.practice-list');
    if (!list) return;

    var html = '';
    topic.questions.forEach(function (q, i) {
      html += renderListQuestion(q, topic.id, doneMap);
    });
    list.innerHTML = html;

    updateProgress(topic, doneMap);
    bindFilters(topic.subtopics);

    list.addEventListener('change', function (e) {
      if (!e.target.classList.contains('done-cb')) return;
      var qid = e.target.getAttribute('data-id');
      doneMap[qid] = e.target.checked;
      R.saveDone(topic.id, doneMap);
      var card = e.target.closest('.practice-q');
      if (card) card.classList.toggle('done', e.target.checked);
      updateProgress(topic, doneMap);
    });

    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTopicPage);
  } else {
    initTopicPage();
  }
})();
