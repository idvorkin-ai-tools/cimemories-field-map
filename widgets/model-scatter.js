/*
  widgets/model-scatter.js: Table 1 as a scatter you can poke (parts/p06-results.html).
  Pick a label set, hide models, and choose one to see who beats it on both axes.
  Maths and numbers: lab/model-scatter.js. Helpers: assets/widgets.js.
*/
(function () {
  var W = window.AIToolsWidgets, L = window.CIModelScatter;
  if (!W || !L) return;
  var SHORT = { 'GPT-5': 'GPT-5', 'o3': 'o3', 'GPT-4o': 'GPT-4o', 'Gemini 2.5 Flash': 'Gemini', 'Llama-3.3 70B': 'Llama', 'Qwen-3 32B': 'Qwen', 'Claude-4 Sonnet': 'Claude', 'Mistral-7B': 'Mistral' };
  var VW = 360, VH = 250, X0 = 44, X1 = 350, Y0 = 12, Y1 = 212, VMIN = 10, VMAX = 90, CMIN = 30, CMAX = 62;
  function x(v) { return X0 + (v - VMIN) / (VMAX - VMIN) * (X1 - X0); }
  function y(c) { return Y1 - (c - CMIN) / (CMAX - CMIN) * (Y1 - Y0); }
  function list(a) { return a.length ? a.join(', ') : 'nobody'; }

  W.register('model-scatter', function (el) {
    var u = 'ms' + W.uid(), state = { set: 't1', focus: 'Qwen-3 32B', shown: L.MODELS.slice() };
    var sets = Object.keys(L.SETS).map(function (k) { return [k, L.SETS[k].label]; });
    el.innerHTML = W.presets(sets) +
      '<div class="ms-models" role="group" aria-label="Models shown">' + L.MODELS.map(function (m, i) {
        return '<label><input type="checkbox" checked data-m="' + i + '"> ' + SHORT[m] + '</label>';
      }).join('') + '</div>' +
      '<div class="ms-focus"><label for="' + u + '-f">Who beats </label><select id="' + u + '-f">' +
      L.MODELS.map(function (m) { return '<option>' + m + '</option>'; }).join('') + '</select><span> on both axes?</span></div>' +
      '<svg class="dg" viewBox="0 0 ' + VW + ' ' + VH + '" role="img" aria-labelledby="' + u + '-s"></svg>' +
      '<div class="statgrid">' + W.stat('Violation@n', u + '-v') + W.stat('Completeness', u + '-c') + W.stat('Beaten by', u + '-b') + '</div>' +
      W.sum(u + '-s');
    var svg = el.querySelector('svg'), sel = W.$(el, u + '-f');
    sel.value = state.focus;

    function axes() {
      var h = '';
      [20, 40, 60, 80].forEach(function (v) {
        h += '<line class="grid" x1="' + x(v) + '" y1="' + Y0 + '" x2="' + x(v) + '" y2="' + Y1 + '"/>' + W.t(x(v), Y1 + 14, v + '%', 't-dim', 'font-size="10" text-anchor="middle"');
      });
      [35, 45, 55].forEach(function (c) {
        h += '<line class="grid" x1="' + X0 + '" y1="' + y(c) + '" x2="' + X1 + '" y2="' + y(c) + '"/>' + W.t(X0 - 4, y(c) + 3.5, c + '%', 't-dim', 'font-size="10" text-anchor="end"');
      });
      h += '<rect x="' + X0 + '" y="' + Y0 + '" width="' + (X1 - X0) + '" height="' + (Y1 - Y0) + '" fill="none" stroke="var(--line)"/>';
      h += W.t((X0 + X1) / 2, VH - 8, 'Violation@n &#8594; lower is better', 't-dim', 'font-size="10.5" text-anchor="middle"');
      h += W.t(12, (Y0 + Y1) / 2, 'Completeness &#8593;', 't-dim', 'font-size="10.5" text-anchor="middle" transform="rotate(-90 12 ' + (Y0 + Y1) / 2 + ')"');
      return h + W.t(X0 + 6, Y0 + 13, '&#8598; better', 't-ok', 'font-size="10.5"');
    }
    // place each label right, left, above or below its dot, avoiding earlier labels
    function labels(pts) {
      var boxes = pts.map(function (p) { var cx = x(p.v), cy = y(p.c); return [cx - 7, cy - 7, cx + 7, cy + 7]; }), h = '';
      pts.slice().sort(function (a, b) { return a.v - b.v; }).forEach(function (p) {
        var w = SHORT[p.name].length * 6.4 + 2, px = x(p.v), py = y(p.c);
        var tries = [[px + 8, py + 3.5, 'start'], [px - 8, py + 3.5, 'end'], [px, py - 9, 'middle'], [px, py + 16, 'middle'],
          [px + 6, py - 7, 'start'], [px - 6, py - 7, 'end'], [px + 6, py + 14, 'start'], [px - 6, py + 14, 'end']];
        var pick = null, best = Infinity, pickBox = null;
        tries.forEach(function (t) {
          var lx = t[2] === 'start' ? t[0] : t[2] === 'end' ? t[0] - w : t[0] - w / 2, b = [lx, t[1] - 9, lx + w, t[1] + 2];
          var cost = (b[0] < X0 || b[2] > X1 + 8 || b[1] < Y0) ? 1e6 : 0;
          boxes.forEach(function (o) { cost += Math.max(0, Math.min(b[2], o[2]) - Math.max(b[0], o[0])) * Math.max(0, Math.min(b[3], o[3]) - Math.max(b[1], o[1])); });
          if (cost < best) { best = cost; pick = t; pickBox = b; }
        });
        boxes.push(pickBox);
        h += W.t(pick[0], pick[1], SHORT[p.name], p.name === state.focus ? 't-ink' : 't-mid', 'font-size="10.5" text-anchor="' + pick[2] + '"');
      });
      return h;
    }

    function draw() {
      var pts = L.points(state.set, state.shown), front = L.frontier(pts);
      var me = pts.filter(function (p) { return p.name === state.focus; })[0];
      var by = me ? L.beatenBy(me.name, pts) : [];
      var h = axes();
      if (me) h += '<rect x="' + X0 + '" y="' + Y0 + '" width="' + (x(me.v) - X0) + '" height="' + (y(me.c) - Y0) + '" fill="var(--def)" opacity=".08"/>';
      if (front.length > 1) h += '<polyline fill="none" stroke="var(--off)" stroke-dasharray="4 4" stroke-width="1.5" points="' +
        front.map(function (p) { return x(p.v).toFixed(1) + ',' + y(p.c).toFixed(1); }).join(' ') + '"/>';
      pts.forEach(function (p) {
        var onF = front.indexOf(p) >= 0, beat = by.indexOf(p.name) >= 0;
        h += '<circle cx="' + x(p.v).toFixed(1) + '" cy="' + y(p.c).toFixed(1) + '" r="' + (p === me ? 6 : 4.5) + '" fill="' +
          (beat ? 'var(--crit)' : onF ? 'var(--off)' : 'var(--def)') + '"' + (p === me ? ' stroke="var(--ink)" stroke-width="2"' : '') + '/>';
      });
      svg.innerHTML = h + labels(pts);
      var lab = L.SETS[state.set].label;
      W.$(el, u + '-v').textContent = me ? me.v + '%' : 'n/a';
      W.$(el, u + '-c').textContent = me ? me.c + '%' : 'n/a';
      W.$(el, u + '-b').textContent = me ? String(by.length) : 'n/a';
      W.$(el, u + '-s').textContent = lab + ': ' + (pts.length ? 'nobody beats ' + list(front.map(function (p) { return p.name; })) + ' on both axes (dashed line). ' : 'no models shown. ') +
        (me ? me.name + ' is beaten on both axes by ' + list(by) + '.' : state.focus + (state.shown.indexOf(state.focus) < 0 ? ' is hidden.' : ' was not run on this set.'));
      el.querySelectorAll('.lab-pre button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-p') === state.set ? 'true' : 'false'); });
    }

    el.querySelectorAll('.lab-pre button').forEach(function (b) {
      b.addEventListener('click', function () { state.set = b.getAttribute('data-p'); draw(); });
    });
    el.querySelectorAll('.ms-models input').forEach(function (c) {
      c.addEventListener('change', function () {
        state.shown = L.MODELS.filter(function (m, i) { return el.querySelector('.ms-models input[data-m="' + i + '"]').checked; });
        draw();
      });
    });
    sel.addEventListener('change', function () { state.focus = sel.value; draw(); });
    el.labPreset = function (p) { if (L.SETS[p]) { state.set = p; draw(); } };
    draw();
  });
})();
