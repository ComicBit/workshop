import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../src/store.js';
import { createMockTools } from '../src/tools.js';
import { escapeHTML, Sidebar, Home, Tasks, Knowledge, Routines } from '../src/components.js';
const setup = () => { const store = createStore(); return { store, tools: createMockTools(store, { delay: 0 }) }; };
test('task creation, drafts, completion, and filtering state', async () => {
  const { store, tools } = setup();
  const t = await tools.call('tasks.create', { title: 'Research Hermes' });
  assert.equal(t.status, 'working');
  await tools.call('tasks.update', { id: t.id, status: 'done', draft: 'Finished' });
  assert.equal(store.get().tasks[0].draft, 'Finished');
  assert.equal(store.get().tasks[0].status, 'done');
  await assert.rejects(tools.call('tasks.update', { id: t.id, status: 'invalid' }));
});
test('routine mock run creates a linked review task', async () => {
  const { store, tools } = setup();
  const r = await tools.call('routines.save', { title: 'Weekly', schedule: 'Monday', prompt: 'Summarize notes' });
  await tools.call('routines.toggle', { id: r.id, active: false });
  assert.equal(store.get().routines[0].active, false);
  const result = await tools.call('routines.run', { id: r.id });
  assert.equal(result.status, 'review');
  assert.match(result.draft, /Summarize notes/);
  assert.ok(store.get().tasks.some(t => t.id === result.id));
});
test('knowledge saves, edits, pinning and cross-entity search', async () => {
  const { store, tools } = setup();
  const f = await tools.call('knowledge.save', { title: 'Unique note', content: 'Project Zebra', pinned: true });
  await tools.call('knowledge.save', { ...f, content: 'Project Zebra updated' });
  assert.equal(store.get().files.filter(x => x.id === f.id).length, 1);
  assert.equal((await tools.call('search.query', { query: 'zebra' }))[0].id, f.id);
  assert.equal((await tools.call('search.query', { query: 'impossiblematch' })).length, 0);
});
test('chat is mock-only and persists messages', async () => {
  const { store, tools } = setup();
  assert.equal((await tools.call('agent.send', { message: 'Where are my files?' })).mode, 'mock');
  assert.equal(store.get().messages.length, 2);
  await assert.rejects(tools.call('agent.send', { message: ' ' }));
  await assert.rejects(tools.call('unknown'));
});
test('persistence tolerates unavailable or invalid storage', () => {
  const data = new Map(); const storage = { getItem: k => data.get(k), setItem: (k,v) => data.set(k,v) };
  const store = createStore(storage); store.update({ sidebarExpanded: true });
  assert.equal(createStore(storage).get().sidebarExpanded, true);
  assert.equal(createStore({ getItem() { throw new Error('denied'); } }).get().version, 1);
});
test('components render all views, escape user input and limit navigation', () => {
  const { store } = setup(); const state = store.get();
  for (const html of [Home(state), Tasks(state, 'all'), Knowledge(state, 'files'), Routines(state)]) assert.ok(html.length > 100);
  const nav = Sidebar({ expanded: true, route: 'home' });
  assert.equal((nav.match(/class="nav-item/g) || []).length, 5);
  assert.ok(!nav.includes('Connections'));
  assert.equal(escapeHTML('<script>"'), '&lt;script&gt;&quot;');
});
