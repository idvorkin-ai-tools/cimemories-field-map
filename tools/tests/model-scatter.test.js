// node --test tools/tests/model-scatter.test.js
// Checks the scatter's maths against what parts/p06-results.html prints.
const test = require('node:test');
const assert = require('node:assert');
const L = require('../../lab/model-scatter.js');
const names = (pts) => pts.map((p) => p.name);

test('Table 1 values match the page', () => {
  const p = L.points('t1');
  assert.deepStrictEqual(p.find((x) => x.name === 'GPT-4o'), { name: 'GPT-4o', v: 14.82, c: 43.95 });
  assert.deepStrictEqual(p.find((x) => x.name === 'Qwen-3 32B'), { name: 'Qwen-3 32B', v: 69.14, c: 57.63 });
  assert.deepStrictEqual(p.find((x) => x.name === 'Claude-4 Sonnet'), { name: 'Claude-4 Sonnet', v: 44.44, c: 59.07 });
});

test('Table 1 frontier is GPT-4o, GPT-5, Claude-4 Sonnet (#tradeoff)', () => {
  assert.deepStrictEqual(names(L.frontier(L.points('t1'))), ['GPT-4o', 'GPT-5', 'Claude-4 Sonnet']);
});

test('who beats whom in Table 1 (the page\'s dominance table)', () => {
  const p = L.points('t1');
  assert.deepStrictEqual(L.beatenBy('Qwen-3 32B', p), ['Claude-4 Sonnet']);
  assert.deepStrictEqual(L.beatenBy('o3', p), ['GPT-5']);
  assert.deepStrictEqual(L.beatenBy('Llama-3.3 70B', p), ['GPT-5', 'o3']);
  assert.deepStrictEqual(L.beatenBy('Gemini 2.5 Flash', p), ['GPT-5', 'o3', 'Llama-3.3 70B', 'Claude-4 Sonnet']);
  assert.deepStrictEqual(L.beatenBy('Mistral-7B', p).sort(), ['Claude-4 Sonnet', 'GPT-5', 'Gemini 2.5 Flash', 'Llama-3.3 70B', 'o3']);
  assert.deepStrictEqual(L.beatenBy('GPT-4o', p), []);
});

test('GPT-5 stays on the frontier under every persona and on +60 profiles (#camera-ready)', () => {
  for (const s of ['t5', 't6', 't7', 't8']) assert.ok(names(L.frontier(L.points(s))).includes('GPT-5'), s);
});

test('T8 leaves out the two models not run', () => {
  assert.strictEqual(L.points('t8').length, 6);
});

test('hiding a model changes the frontier', () => {
  const shown = L.MODELS.filter((m) => m !== 'GPT-5');
  assert.deepStrictEqual(names(L.frontier(L.points('t1', shown))), ['GPT-4o', 'o3', 'Claude-4 Sonnet']);
});
