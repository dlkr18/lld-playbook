/* Interactive labs for the AI course sheets (docs/cheatsheets/ai/courses/).
   Ported from the two course pages they came from. Each lab finds its own
   markup and returns if it is not on this page, so one file serves all of
   them. Colours are read from theme.css tokens and redrawn on theme change. */
(function () {
  'use strict';

  var css = function (n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); };
  var NS = 'http://www.w3.org/2000/svg';
  var el = function (t, a) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); return e; };
  var $ = function (id) { return document.getElementById(id); };
  var redraw = [];
  window.addEventListener('playbook-theme-change', function () { redraw.forEach(function (f) { f(); }); });

  /* gradient descent on L(w) = w² */
  (function () {
    var s = $('gd-lr'), o = $('gd-lro'), svg = $('gd-svg'), res = $('gd-res');
    if (!s) return;
    function draw() {
      var lr = parseFloat(s.value); o.textContent = lr.toFixed(2);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var W = 560, H = 240, xr = 3.2;
      var sx = function (x) { return W / 2 + x / xr * (W / 2 - 20); };
      var sy = function (y) { return H - 20 - y / 10 * (H - 40); };
      var d = '';
      for (var i = 0; i <= 120; i++) { var x = -xr + 2 * xr * i / 120; d += (i ? 'L' : 'M') + sx(x) + ',' + Math.max(0, sy(x * x)); }
      svg.appendChild(el('path', { d: d, fill: 'none', stroke: css('--text-muted'), 'stroke-width': 1.5 }));
      svg.appendChild(el('line', { x1: 20, x2: W - 20, y1: H - 20, y2: H - 20, stroke: css('--border') }));
      var w = 2.8, pts = [w];
      for (i = 0; i < 12; i++) { w = w - lr * 2 * w; pts.push(w); if (Math.abs(w) > 50) break; }
      var path = '';
      pts.forEach(function (p, j) { var cx = Math.max(-xr, Math.min(xr, p)), y = Math.min(10, p * p); path += (j ? 'L' : 'M') + sx(cx) + ',' + sy(y); });
      svg.appendChild(el('path', { d: path, fill: 'none', stroke: css('--accent'), 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }));
      pts.forEach(function (p, j) {
        if (Math.abs(p) <= xr && p * p <= 10) svg.appendChild(el('circle', { cx: sx(p), cy: sy(p * p), r: j ? 4 : 6, fill: j ? css('--accent') : css('--text-heading') }));
      });
      var f = 1 - 2 * lr;
      var status = Math.abs(f) < 1 ? (f < 0 ? 'oscillates but converges' : 'converges smoothly') : (Math.abs(f) === 1 ? 'stuck bouncing forever' : 'diverges');
      res.textContent = 'w ← w·(1 − 2η) = w·' + f.toFixed(2) + '  →  ' + status + '\nw after steps: ' +
        pts.slice(0, 7).map(function (p) { return Math.abs(p) > 999 ? p.toExponential(1) : p.toFixed(3); }).join(', ');
    }
    s.addEventListener('input', draw); redraw.push(draw); draw();
  })();

  /* GPU memory estimate */
  (function () {
    var p = $('vr-p'), m = $('vr-m'), n = $('vr-n'), r = $('vr-res');
    if (!p) return;
    function calc() {
      var B = Math.max(0.01, parseFloat(p.value) || 0), N = Math.max(1, parseInt(n.value, 10) || 1), P = B * 1e9, G = 1e9;
      var lines = [], tot = 0, mode = m.value, ad;
      if (mode === 'inf16') { tot = P * 2; lines.push('weights bf16  2 B/param = ' + (tot / G).toFixed(1) + ' GB'); lines.push('+ KV cache and ~1–2 GB runtime overhead'); }
      else if (mode === 'inf8') { tot = P; lines.push('weights int8  1 B/param = ' + (tot / G).toFixed(1) + ' GB'); lines.push('+ KV cache and runtime overhead'); }
      else if (mode === 'inf4') { tot = P * 0.56; lines.push('weights 4-bit ≈ 0.56 B/param incl. scales = ' + (tot / G).toFixed(1) + ' GB'); lines.push('+ KV cache and runtime overhead'); }
      else if (mode === 'full') { tot = 16 * P / N; lines.push('weights+grads+fp32 master+Adam = 16 B/param'); lines.push('total state ' + (16 * P / G).toFixed(0) + ' GB' + (N > 1 ? ' ÷ ' + N + ' GPUs (FSDP)' : '') + ' = ' + (tot / G).toFixed(1) + ' GB per GPU'); lines.push('+ activations (use checkpointing)'); }
      else if (mode === 'lora') { ad = P * 0.005; tot = P * 2 + ad * 16; lines.push('frozen base bf16 = ' + (P * 2 / G).toFixed(1) + ' GB'); lines.push('adapters ~0.5% params × 16 B = ' + (ad * 16 / G).toFixed(2) + ' GB'); lines.push('+ activations'); }
      else if (mode === 'qlora') { ad = P * 0.005; tot = P * 0.53 + ad * 16; lines.push('frozen base NF4 + double-quant ≈ 0.53 B/param = ' + (P * 0.53 / G).toFixed(1) + ' GB'); lines.push('adapters ~0.5% params × 16 B = ' + (ad * 16 / G).toFixed(2) + ' GB'); lines.push('+ activations (checkpointing on)'); }
      var gpus = [['T4 16 GB', 16], ['L4/A10G 24 GB', 24], ['A100 40 GB', 40], ['A100/H100 80 GB', 80]]
        .map(function (g) { return (tot * 1.15 <= g[1] * 1e9 ? '✓ ' : '✗ ') + g[0]; }).join('   ');
      r.textContent = lines.join('\n') + '\n≈ ' + (tot / G).toFixed(1) + ' GB per GPU before activations\n' + gpus;
    }
    [p, m, n].forEach(function (x) { x.addEventListener('input', calc); }); calc();
  })();

  /* KV cache size */
  (function () {
    var ids = ['kv-l', 'kv-h', 'kv-d', 'kv-t', 'kv-b', 'kv-p'].map($), r = $('kv-res');
    if (!r) return;
    function calc() {
      var v = ids.map(function (x) { return parseFloat(x.value) || 0; });
      var perTok = 2 * v[0] * v[1] * v[2] * v[5];
      var f = function (b) { return b >= 1e9 ? (b / 1e9).toFixed(2) + ' GB' : (b / 1e6).toFixed(2) + ' MB'; };
      r.textContent = 'per token: 2 × ' + v[0] + ' × ' + v[1] + ' × ' + v[2] + ' × ' + v[5] + ' B = ' + f(perTok) +
        '\nper sequence at ' + v[3] + ' tokens: ' + f(perTok * v[3]) + '\n' + v[4] + ' sequences: ' + f(perTok * v[3] * v[4]);
    }
    ids.forEach(function (x) { x.addEventListener('input', calc); }); calc();
  })();

  /* temperature reshapes the next-token distribution */
  (function () {
    var s = $('tp-t'), o = $('tp-to'), svg = $('tp-svg');
    if (!s) return;
    var toks = [['Paris', 4.0], ['the', 2.6], ['a', 2.2], ['France', 1.6], ['Lyon', 1.0], ['beautiful', 0.6], ['banana', -1.0]];
    function draw() {
      var T = parseFloat(s.value); o.textContent = T.toFixed(2);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var z = toks.map(function (t) { return t[1] / T; }), mx = Math.max.apply(null, z);
      var e = z.map(function (v) { return Math.exp(v - mx); }), S = e.reduce(function (a, b) { return a + b; }, 0);
      var pr = e.map(function (v) { return v / S; });
      var bw = 70, gap = 8, H = 150, font = css('--font-sans'), mono = css('--font-mono');
      var t = el('text', { x: 0, y: 14, fill: css('--text-muted'), 'font-size': 12, 'font-family': font }); t.textContent = 'The capital of France is …'; svg.appendChild(t);
      toks.forEach(function (tk, i) {
        var x = i * (bw + gap) + 4, h = pr[i] * H, y = 24 + H - h;
        svg.appendChild(el('rect', { x: x, y: y, width: bw, height: Math.max(1, h), rx: 3, fill: i === 0 ? css('--accent') : css('--text-muted'), opacity: i === 0 ? 1 : 0.55 }));
        var v = el('text', { x: x + bw / 2, y: y - 4, 'text-anchor': 'middle', fill: css('--text-heading'), 'font-size': 11, 'font-family': mono }); v.textContent = (pr[i] * 100).toFixed(1) + '%'; svg.appendChild(v);
        var l = el('text', { x: x + bw / 2, y: 24 + H + 18, 'text-anchor': 'middle', fill: css('--text-muted'), 'font-size': 12, 'font-family': font }); l.textContent = tk[0]; svg.appendChild(l);
      });
    }
    s.addEventListener('input', draw); redraw.push(draw); draw();
  })();

  /* eval-set size: confidence interval of a pass rate */
  (function () {
    var n = $('ci-n'), p = $('ci-p'), r = $('ci-res');
    if (!n) return;
    function calc() {
      var N = Math.max(1, parseFloat(n.value) || 1), P = Math.min(0.99, Math.max(0.01, (parseFloat(p.value) || 50) / 100));
      var ci = 1.96 * Math.sqrt(P * (1 - P) / N) * 100;
      var need = function (x) { return Math.ceil(P * (1 - P) * Math.pow(1.96 / (x / 100), 2)); };
      var mde = 2.8 * Math.sqrt(2 * P * (1 - P) / N) * 100;
      r.textContent = '95% CI: ' + (P * 100).toFixed(1) + '% ± ' + ci.toFixed(1) + ' points\n' +
        'two independent versions need a gap of ~' + mde.toFixed(1) + ' points to be detectable (80% power)\n' +
        'cases for ±5 / ±3 / ±2 points: ' + need(5) + ' / ' + need(3) + ' / ' + need(2) + '\n' +
        'paired comparison on the same cases needs fewer: only disagreements count';
    }
    [n, p].forEach(function (x) { x.addEventListener('input', calc); }); calc();
  })();
})();
