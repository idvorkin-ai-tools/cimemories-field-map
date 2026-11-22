/*
  lab/model-scatter.js: the maths behind widgets/model-scatter.js.
  Numbers are copied from parts/p06-results.html: Table 1 (#table1) and the
  camera-ready Tables 5-8 (#camera-ready). Each row is [violation%, completeness%];
  null = not run. Works in the browser (window.CIModelScatter) and in node.
*/
(function (root) {
  var MODELS = ['GPT-5', 'o3', 'GPT-4o', 'Gemini 2.5 Flash', 'Llama-3.3 70B', 'Qwen-3 32B', 'Claude-4 Sonnet', 'Mistral-7B'];
  var SETS = {
    t1: { label: 'Unanimous (Table 1)', rows: [[25.08, 56.61], [38.51, 55.0], [14.82, 43.95], [46.35, 52.83], [44.43, 53.99], [69.14, 57.63], [44.44, 59.07], [56.94, 46.56]] },
    t5: { label: 'Fundamentalist (T5)', rows: [[42.1, 52.8], [57.7, 51.9], [30.9, 40.7], [64.3, 50.4], [59.7, 51.2], [81.4, 55.4], [59.1, 56.9], [73.0, 43.4]] },
    t6: { label: 'Pragmatic (T6)', rows: [[34.3, 48.3], [50.6, 47.6], [23.1, 35.9], [57.0, 45.7], [56.3, 46.2], [77.6, 50.9], [54.6, 52.6], [65.8, 39.5]] },
    t7: { label: 'Unconcerned (T7)', rows: [[34.9, 44.6], [45.5, 43.1], [20.3, 31.4], [56.9, 41.5], [52.4, 42.0], [75.2, 47.2], [51.6, 48.7], [62.5, 36.3]] },
    t8: { label: '+60 profiles (T8)', rows: [[26.2, 53.8], [34.8, 50.5], [16.7, 40.1], [49.0, 49.4], [42.8, 48.7], [65.1, 53.4], null, null] }
  };
  // a beats b: no more violation, no less completeness, strictly better on one
  function beats(a, b) { return a.v <= b.v && a.c >= b.c && (a.v < b.v || a.c > b.c); }
  // points for one label set, limited to the shown model names
  function points(set, shown) {
    var out = [];
    SETS[set].rows.forEach(function (r, i) {
      if (r && (!shown || shown.indexOf(MODELS[i]) >= 0)) out.push({ name: MODELS[i], v: r[0], c: r[1] });
    });
    return out;
  }
  function beatenBy(name, pts) {
    var me = pts.filter(function (p) { return p.name === name; })[0];
    if (!me) return null;
    return pts.filter(function (p) { return p !== me && beats(p, me); }).map(function (p) { return p.name; });
  }
  // models no other shown model beats, ordered by violation
  function frontier(pts) {
    return pts.filter(function (p) { return !pts.some(function (q) { return q !== p && beats(q, p); }); })
      .sort(function (a, b) { return a.v - b.v; });
  }
  var api = { MODELS: MODELS, SETS: SETS, beats: beats, points: points, beatenBy: beatenBy, frontier: frontier };
  if (typeof module === 'object' && module.exports) module.exports = api; else root.CIModelScatter = api;
})(this);
