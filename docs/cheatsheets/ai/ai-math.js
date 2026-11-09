/* Typesets \( inline \) and \[ display \] maths on AI topic pages with KaTeX.
   Only pages whose content contains maths load this file (and KaTeX).
   "$" is deliberately not a delimiter: the pages are full of prices. */
(function () {
  'use strict';
  function render() {
    if (!window.renderMathInElement) return;
    var main = document.querySelector('.main');
    if (!main) return;
    window.renderMathInElement(main, {
      delimiters: [
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false }
      ],
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      throwOnError: false
    });
  }
  if (document.readyState === 'complete') render();
  else window.addEventListener('load', render);
})();
