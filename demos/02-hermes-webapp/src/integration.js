import { createMockTools, createHttpTools } from './tools.js';

// Set window.HERMES_CONFIG = { toolEndpoint: '/api/tools' } before app.js to connect
// a backend. Never put service credentials in browser code. The authenticated
// endpoint accepts { name, args } and returns the tool result as JSON.
//
// workspace.get returns { tasks, routines, files, memory, messages } using the
// shapes in data.js. After each remote mutation we refresh that snapshot, so
// components do not need to know whether tools are local or remote.
export function createToolClient(store, config = {}) {
  if (!config.toolEndpoint) return createMockTools(store);
  const remote = createHttpTools(config.toolEndpoint);
  const reads = new Set(['workspace.get', 'tasks.list', 'knowledge.list', 'search.query']);
  async function refresh() {
    const snapshot = await remote.call('workspace.get');
    if (!['tasks', 'routines', 'files', 'memory', 'messages'].every(key => Array.isArray(snapshot[key]))) {
      throw new Error('The tool server returned an invalid workspace.');
    }
    const { tasks, routines, files, memory, messages } = snapshot;
    store.update({ tasks, routines, files, memory, messages });
    return snapshot;
  }
  return {
    mode: 'live',
    refresh,
    async call(name, args) {
      if (name === 'workspace.get') return refresh();
      const result = await remote.call(name, args);
      if (!reads.has(name)) await refresh();
      return result;
    }
  };
}
