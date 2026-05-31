(function () {
  'use strict';

  var STORAGE_PREFIX = 'dsa-practice-done-';

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function impLabel(imp) {
    if (imp === 'must') return 'Must do';
    if (imp === 'nice') return 'Nice to have';
    return 'Should do';
  }

  function renderBadges(q) {
    var imp = q.importance || 'should';
    var sub = q.subtopic || '';
    var diff = q.difficulty || '';
    var html = '<span class="importance-badge ' + imp + '">' + impLabel(imp) + '</span>';
    if (sub) html += '<span class="subtopic-badge">' + escapeHtml(sub) + '</span>';
    if (diff) html += '<span class="diff-badge">' + escapeHtml(diff) + '</span>';
    return html;
  }

  function renderExamples(examples) {
    return (examples || []).map(function (ex) {
      var block = 'Input: ' + ex.in + '\nOutput: ' + ex.out;
      if (ex.note) block += '\n' + ex.note;
      return '<div class="example-block">' + escapeHtml(block) + '</div>';
    }).join('');
  }

  function renderApproaches(approaches) {
    return (approaches || []).map(function (a) {
      var cx = 'Time ' + a.time + ' · Space ' + a.space;
      return (
        '<details class="approach" open>' +
          '<summary>' + escapeHtml(a.name) +
            '<span class="complexity">' + escapeHtml(cx) + '</span></summary>' +
          '<pre><code>' + escapeHtml(a.code || '') + '</code></pre>' +
        '</details>'
      );
    }).join('');
  }

  function renderConstraints(constraints) {
    if (!constraints || !constraints.length) return '';
    var items = constraints.map(function (c) {
      return '<li>' + escapeHtml(c) + '</li>';
    }).join('');
    return '<div class="q-section"><h4>Constraints</h4><ul>' + items + '</ul></div>';
  }

  function renderQuestionBody(q) {
    var statement = '';
    if (q.descriptionHtml) {
      statement = '<div class="q-section"><h4>Problem</h4><div class="lc-statement">' + q.descriptionHtml + '</div></div>';
    } else if (q.description) {
      statement = '<div class="q-section"><h4>Problem</h4><p class="q-description">' + escapeHtml(q.description) + '</p></div>';
    }

    var summary = q.summary
      ? '<div class="q-summary"><span class="q-summary-label">Remember</span>' + escapeHtml(q.summary) + '</div>'
      : '';

    return (
      statement +
      summary +
      renderConstraints(q.constraints) +
      ((q.examples && q.examples.length)
        ? '<div class="q-section"><h4>Examples</h4>' + renderExamples(q.examples) + '</div>'
        : '') +
      ((q.approaches && q.approaches.length)
        ? '<div class="q-section"><h4>Optimal approaches (C++)</h4>' + renderApproaches(q.approaches) + '</div>'
        : '')
    );
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

  window.DSAPracticeRender = {
    renderBadges: renderBadges,
    renderQuestionBody: renderQuestionBody,
    loadDone: loadDone,
    saveDone: saveDone,
    escapeHtml: escapeHtml,
    impLabel: impLabel,
    STORAGE_PREFIX: STORAGE_PREFIX
  };

  /* ---- single question page ---- */
  function initQuestionPage() {
    var qid = window.PRACTICE_QUESTION_ID;
    var topic = window.PRACTICE_TOPIC;
    if (!qid || !topic || !topic.questions) return;

    var q = null;
    for (var i = 0; i < topic.questions.length; i++) {
      if (topic.questions[i].id === qid) {
        q = topic.questions[i];
        break;
      }
    }
    if (!q) return;

    document.title = q.title + ' — ' + topic.title + ' — DSA Practice';

    var meta = $('.question-detail-meta');
    if (meta) {
      var lc = q.lc ? '<span class="q-lc">LC ' + q.lc + '</span> ' : '';
      meta.innerHTML = lc + renderBadges(q);
    }

    var body = $('.question-detail-body');
    if (body) body.innerHTML = renderQuestionBody(q);

    var doneMap = loadDone(topic.id);
    var cb = $('.done-cb');
    if (cb) {
      cb.checked = !!doneMap[qid];
      cb.addEventListener('change', function () {
        doneMap[qid] = cb.checked;
        saveDone(topic.id, doneMap);
      });
    }
  }

  if (document.body && document.body.classList.contains('question-page')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initQuestionPage);
    } else {
      initQuestionPage();
    }
  }
})();
