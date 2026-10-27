import assert from 'node:assert/strict';
import config from '../astro.config.mjs';

// Exercise the actual configured renderer without publishing a fixture article.
const renderer = await config.markdown.processor.createRenderer(config.markdown);
const { code, metadata } = await renderer.render([
  '## Attention dimensions',
  '',
  'Inline math: $QK^T$.',
  '',
  '$$',
  '\\operatorname{softmax}(QK^T / \\sqrt{d_k})V',
  '$$',
  '',
  '```python',
  'scores = query @ key.T',
  '```',
  '',
  '| Tensor | Shape |',
  '| --- | --- |',
  '| Query | n × d |',
].join('\n'));
assert.match(code, /class="katex"/, 'Inline math must render');
assert.match(code, /katex-display/, 'Display equations must render');
assert.match(code, /astro-code/, 'Code must use syntax highlighting');
assert.match(code, /<table>/, 'Markdown tables must render');
assert.equal(metadata.headings[0]?.slug, 'attention-dimensions');
console.log('Markdown verified: inline/display math, highlighted code, tables, heading anchors.');
