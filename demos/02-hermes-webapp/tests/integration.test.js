import test from 'node:test';
import assert from 'node:assert/strict';
import { createToolClient } from '../src/integration.js';
import { createStore } from '../src/store.js';

test('default client uses mock tools', () => {
  assert.equal(createToolClient(createStore()).mode, 'mock');
});
test('remote mutations refresh shared state through the adapter', async () => {
  const store = createStore();
  const original = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async (url, init) => {
    const body = JSON.parse(init.body); requests.push(body.name);
    return { ok: true, json: async () => body.name === 'workspace.get' ? { ...store.get(), tasks: [{ id: 'remote', title: 'Server task', status: 'review' }] } : { id: 'remote' } };
  };
  try {
    const client = createToolClient(store, { toolEndpoint: '/api/tools' });
    const result = await client.call('tasks.create', { title: 'Server task' });
    assert.equal(result.id, 'remote');
    assert.deepEqual(requests, ['tasks.create', 'workspace.get']);
    assert.equal(store.get().tasks[0].id, 'remote');
  } finally { globalThis.fetch = original; }
});
