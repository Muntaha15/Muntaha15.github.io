import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../src/components/CopyEmail.astro', import.meta.url), 'utf8');
assert.match(source, /<noscript>[\s\S]*?\{site\.email\}[\s\S]*?<\/noscript>/, 'Keep the address readable without JavaScript');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1];
const status = { textContent: '' };
let click, dismiss, copied;
const button = {
  dataset: { copyEmail: 'person@example.com' },
  nextElementSibling: status,
  addEventListener: (event, handler) => { if (event === 'click') click = handler; },
};
const navigator = { clipboard: { writeText: async text => { copied = text; } } };
runInNewContext(ts.transpile(script), {
  document: { querySelectorAll: () => [button] },
  navigator,
  setTimeout: handler => { dismiss = handler; return 1; },
  clearTimeout: () => {},
});

await click();
assert.equal(copied, button.dataset.copyEmail, 'Copy the configured address');
assert.equal(status.textContent, 'Copied!', 'Confirm successful copying');
dismiss();
assert.equal(status.textContent, '', 'Dismiss the success toast');
await click();
assert.equal(status.textContent, 'Copied!', 'Allow repeated copying');
navigator.clipboard.writeText = async () => { throw new Error('Permission denied'); };
await click();
assert.match(status.textContent, /Couldn’t copy/);
assert.ok(status.textContent.includes(button.dataset.copyEmail), 'Show the address when access is denied');
navigator.clipboard = undefined;
await click();
assert.ok(status.textContent.includes(button.dataset.copyEmail), 'Show the address when the API is unavailable');
console.log('Copy email verified: address, success toast, dismissal, repeat clicks, and clipboard failures.');
