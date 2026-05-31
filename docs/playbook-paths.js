(function (global) {
  'use strict';

  /** Problem folders under docs/problems/ (with README.md) */
  var PROBLEM_SLUGS = [
    'amazon', 'atm', 'auction', 'autocomplete', 'bloomfilter', 'bookmyshow', 'chess',
    'coffeemachine', 'cricinfo', 'elevator', 'featureflags', 'filesystem', 'fooddelivery',
    'inventory', 'kvstore', 'learningplatform', 'library', 'linkedin', 'logging',
    'loggingframework', 'lru-cache', 'lrucache', 'minesweeper', 'notification', 'parkinglot',
    'paymentgateway', 'pubsub', 'ratelimiter', 'restaurant', 'ridehailing', 'search',
    'simplesearch', 'snakeandladder', 'socialnetwork', 'splitwise', 'spotify',
    'stackoverflow', 'stockexchange', 'taskmanagement', 'taskscheduler', 'tictactoe',
    'trafficcontrol', 'url-shortener', 'urlshortener', 'vendingmachine', 'versioncontrol',
    'whatsapp'
  ];

  /** Cheatsheet filename (no .html) → docs/problems/ slug */
  var SHEET_TO_PROBLEM = {
    loggingsystem: 'logging',
    searchengine: 'search'
  };

  function docsifyAlias() {
    var map = {};
    var i, slug;
    for (i = 0; i < PROBLEM_SLUGS.length; i++) {
      slug = PROBLEM_SLUGS[i];
      map['/' + slug + '/(.*)'] = '/problems/' + slug + '/$1';
      map['/' + slug] = '/problems/' + slug + '/README';
    }
    return map;
  }

  /** Site root prefix, e.g. '' locally or '/lld-playbook' on GitHub Pages */
  function siteBase() {
    var path = global.location.pathname;
    var markers = ['/cheatsheets/', '/docs/cheatsheets/'];
    var i, idx;
    for (i = 0; i < markers.length; i++) {
      idx = path.indexOf(markers[i]);
      if (idx !== -1) return path.slice(0, idx);
    }
    if (path.indexOf('/lld-playbook') === 0) return '/lld-playbook';
    return '';
  }

  function cheatsheetContext() {
    var path = global.location.pathname;
    var markers = ['/docs/cheatsheets/', '/cheatsheets/'];
    var i, idx, marker;
    for (i = 0; i < markers.length; i++) {
      idx = path.indexOf(markers[i]);
      if (idx !== -1) {
        marker = markers[i];
        return {
          siteBase: path.slice(0, idx),
          relPath: path.slice(idx + marker.length),
          marker: marker
        };
      }
    }
    return null;
  }

  function problemSlugFromSheet(filename) {
    var slug = (filename || '').replace(/\.html$/i, '');
    if (!slug || slug === 'index') return null;
    if (SHEET_TO_PROBLEM[slug]) return SHEET_TO_PROBLEM[slug];
    if (PROBLEM_SLUGS.indexOf(slug) !== -1) return slug;
    return null;
  }

  function docUrl(slug, page) {
    page = page || 'README';
    return siteBase() + '/#/' + 'problems/' + slug + '/' + page;
  }

  global.PlaybookPaths = {
    slugs: PROBLEM_SLUGS,
    sheetToProblem: SHEET_TO_PROBLEM,
    alias: docsifyAlias,
    siteBase: siteBase,
    cheatsheetContext: cheatsheetContext,
    problemSlugFromSheet: problemSlugFromSheet,
    docUrl: docUrl
  };
})(window);
