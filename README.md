# CIMemories, mapped

A field-map explainer of **CIMemories: A Compositional Benchmark for Contextual Integrity of Persistent Memory in LLMs** (Mireshghallah, Mangaokar et al., FAIR at Meta, [arXiv:2511.14937](https://arxiv.org/abs/2511.14937); published at ICLR 2026 under the shorter title *CIMemories: A Compositional Benchmark for Contextual Integrity in LLMs*).

Live: https://idvorkin-ai-tools.github.io/cimemories-field-map/

- `index.html` — the spine: four arcs, nine part pages
- `parts/` — one page per major section of the paper
- `glossary.html`, `ten-minutes.html` — terms, and the whole paper on one page
- `flow-explorer.html` — explorable: one information flow, its five parameters as controls, the deciding norm highlighted; then a label-it-yourself browser over a sample of the public release (`data/pairs.json`)
- `composition-explorer.html` — explorable: how per-message leak rates compound over tasks and samples, against the paper's Figure 2 points and Table 1
- `bridge.html` — a pointer (keeping the old URL and anchors) to the bridge page, which now lives only on the [agentic privacy map](https://idvorkin-ai-tools.github.io/agentic-privacy-field-map/guide/bridge.html)
- `widgets/`, `lab/`, `tools/tests/` — the p06 model scatter, its maths, and a `node --test` check of that maths against the page
- `paper.css` — shared dark theme

Original explanation written against arXiv v1 and checked against the ICLR 2026 camera-ready (2026-10-26); numbers are quoted from the paper with their table or figure. The paper is © its authors. Code and data: [facebookresearch/CIMemories](https://github.com/facebookresearch/CIMemories). `data/pairs.json` is a small sample of the public [facebook/CIMemories](https://huggingface.co/datasets/facebook/CIMemories) release (synthetic profiles; CC BY-NC 4.0), reproduced with attribution; the release carries no per-pair labels.
