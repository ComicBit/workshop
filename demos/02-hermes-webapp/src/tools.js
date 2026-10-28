// Integration boundary: replace these async handlers, not the UI components.
// Handlers return JSON-compatible values; thrown errors are displayed by the UI.
// Nothing in this demo sends mail, schedules jobs, or calls an external agent.
export const toolDefinitions = [
  { name: 'tasks.list', input: {}, description: 'List workspace tasks.' },
  { name: 'tasks.create', input: { title: 'string', description: 'string?' }, description: 'Create a task.' },
  { name: 'tasks.update', input: { id: 'string', status: 'review | working | done | junk', draft: 'string?' }, description: 'Update a task or draft.' },
  { name: 'knowledge.list', input: {}, description: 'List workspace documents.' },
  { name: 'knowledge.save', input: { id: 'string?', title: 'string', content: 'string', pinned: 'boolean?' }, description: 'Create or update a document.' },
  { name: 'routines.save', input: { id: 'string?', title: 'string', schedule: 'string', prompt: 'string', channel: 'Hermes | Email', active: 'boolean?' }, description: 'Create or update a routine.' },
  { name: 'routines.toggle', input: { id: 'string', active: 'boolean' }, description: 'Enable or pause a routine.' },
  { name: 'routines.run', input: { id: 'string' }, description: 'Run a routine and return its task.' },
  { name: 'search.query', input: { query: 'string' }, description: 'Search tasks, routines, documents, and memory.' },
  { name: 'agent.send', input: { message: 'string' }, description: 'Send a message to the agent.' }
];

const uid = () => globalThis.crypto?.randomUUID?.() || `mock-${Date.now()}-${Math.random().toString(36).slice(2)}`;
function required(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
}
function find(items, id) {
  const item = items.find(x => x.id === id);
  if (!item) throw new Error('This item no longer exists. Refresh and try again.');
  return item;
}
export function createMockTools(store, { delay = 220 } = {}) {
  return {
    mode: 'mock',
    async call(name, args = {}) {
      if (delay) await new Promise(resolve => setTimeout(resolve, delay));
      const state = store.get();
      switch (name) {
        case 'tasks.list': return state.tasks;
        case 'tasks.create': {
          const task = { id: uid(), title: required(args.title, 'Task title'), description: args.description || 'Ready for Hermes to work on.', status: 'working', source: 'Hermes', time: 'Just now', kind: 'sparkles', action: 'Review', draft: '' };
          store.update({ tasks: [task, ...state.tasks] });
          return task;
        }
        case 'tasks.update': {
          const item = find(state.tasks, args.id);
          if (args.status && !['review', 'working', 'done', 'junk'].includes(args.status)) throw new Error('Invalid task status.');
          const updated = { ...item, ...(args.status ? { status: args.status } : {}), ...(typeof args.draft === 'string' ? { draft: args.draft } : {}) };
          store.update({ tasks: state.tasks.map(t => t.id === args.id ? updated : t) });
          return updated;
        }
        case 'knowledge.list': return state.files;
        case 'knowledge.save': {
          const existing = args.id ? find(state.files, args.id) : null;
          const file = { ...existing, id: existing?.id || uid(), title: required(args.title, 'Document name'), content: required(args.content, 'Document content'), type: 'md', updated: 'Just now', pinned: args.pinned ?? existing?.pinned ?? false };
          store.update({ files: [file, ...state.files.filter(f => f.id !== file.id)] });
          return file;
        }
        case 'routines.save': {
          const existing = args.id ? find(state.routines, args.id) : null;
          const routine = { ...existing, id: existing?.id || uid(), title: required(args.title, 'Routine name'), schedule: required(args.schedule, 'Schedule'), prompt: required(args.prompt, 'Instructions'), channel: args.channel === 'Email' ? 'Email' : 'Hermes', active: args.active ?? existing?.active ?? true, next: existing?.next || 'Next run scheduled' };
          store.update({ routines: [routine, ...state.routines.filter(r => r.id !== routine.id)] });
          return routine;
        }
        case 'routines.toggle': {
          find(state.routines, args.id);
          store.update({ routines: state.routines.map(r => r.id === args.id ? { ...r, active: Boolean(args.active) } : r) });
          return { active: Boolean(args.active) };
        }
        case 'routines.run': {
          const routine = find(state.routines, args.id);
          const task = { id: uid(), title: routine.title, description: 'Mock run complete. Review the sample output.', source: routine.channel, time: 'Just now', status: 'review', kind: 'file', action: 'Review', draft: `Sample output for ${routine.title}\n\n${routine.prompt}\n\nThis is a local demonstration. Connect a real tool handler to execute these instructions.` };
          store.update({ tasks: [task, ...state.tasks], routines: state.routines.map(r => r.id === args.id ? { ...r, lastRun: 'Just now' } : r) });
          return task;
        }
        case 'search.query': {
          const query = (args.query || '').trim().toLowerCase();
          return [
            ...state.tasks.map(x => ({ ...x, entity: 'task', category: 'Tasks' })),
            ...state.files.map(x => ({ ...x, entity: 'file', category: 'Knowledge' })),
            ...state.routines.map(x => ({ ...x, entity: 'routine', category: 'Routines' })),
            ...state.memory.map(x => ({ ...x, entity: 'memory', category: 'Memory' }))
          ].filter(x => !query || `${x.title} ${x.description || x.content || ''}`.toLowerCase().includes(query)).slice(0, 25);
        }
        case 'agent.send': {
          const message = required(args.message, 'Message');
          const response = /meeting|calendar/i.test(message)
            ? 'Your next session is the Innovations Hub weekly meeting, tomorrow at 6:00 PM. The invitation is waiting for your RSVP on Home.'
            : /file|aurora|knowledge/i.test(message)
              ? 'The aurora-geo plan is in Knowledge → My Files. You can open it, edit it, or pin it for later.'
              : /routine|brief/i.test(message)
                ? 'Your Daily Brief runs at 6:30 AM. Open Routines to review its instructions, pause it, or try a mock run.'
                : 'I can help you review your priorities, explore your knowledge, or plan a routine. This is a demo response; no external action has been taken.';
          const messages = [...state.messages, { role: 'user', content: message }, { role: 'assistant', content: response }];
          store.update({ messages });
          return { message: response, mode: 'mock' };
        }
        default: throw new Error(`Tool not registered: ${name}`);
      }
    }
  };
}

// Example replacement: export createHttpTools('/api/tools') from your integration.
// The endpoint authenticates the user and validates/authorizes every tool request.
export function createHttpTools(endpoint = '/api/tools') {
  return {
    mode: 'live',
    async call(name, args = {}) {
      const response = await fetch(endpoint, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, args }) });
      if (!response.ok) throw new Error(`Tool request failed (${response.status}).`);
      return response.json();
    }
  };
}
