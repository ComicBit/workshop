import { initialData } from './data.js';

const KEY = 'hermes-dashboard-v1';
export function createStore(storage) {
  let state = initialData();
  try {
    const saved = JSON.parse(storage?.getItem(KEY) || 'null');
    if (saved?.version === 1 && ['tasks', 'routines', 'files', 'memory', 'messages'].every(k => Array.isArray(saved[k]))) state = { ...state, ...saved };
  } catch { /* Invalid or unavailable storage falls back to demo content. */ }
  const listeners = new Set();
  return {
    get: () => structuredClone(state),
    update(change) {
      const next = typeof change === 'function' ? change(structuredClone(state)) : change;
      state = { ...state, ...next };
      try { storage?.setItem(KEY, JSON.stringify(state)); } catch { /* Session still works if storage is unavailable. */ }
      listeners.forEach(fn => fn());
    },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
  };
}
