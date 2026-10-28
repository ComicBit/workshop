import { createStore } from './store.js';
import { createToolClient } from './integration.js';
import { Sidebar, Home, ChatPanel, Tasks, Knowledge, Routines, icon, iconButton, escapeHTML as e } from './components.js';

let storage;
try { storage = window.localStorage; } catch { /* Private contexts can block storage. */ }
const store = createStore(storage);
// Pass { toolEndpoint: '/api/tools' } and call tools.refresh() when wiring a real backend.
const tools = createToolClient(store);
const app = document.querySelector('#app');
const detail = document.querySelector('#detail-dialog');
const search = document.querySelector('#search-dialog');
const announcement = document.querySelector('#announcement');
const ui = { route: 'home', knowledgeTab: 'files', taskFilter: 'all', busy: false, searchSequence: 0 };
let restoreFocus;
let toastTimer;
function toast(message) {
  clearTimeout(toastTimer);
  announcement.textContent = message;
  announcement.classList.add('visible');
  toastTimer = setTimeout(() => announcement.classList.remove('visible'), 6500);
}
function render() {
  const state = store.get();
  document.title = `Hermes — ${ui.route[0].toUpperCase() + ui.route.slice(1)}`;
  app.className = state.sidebarExpanded ? 'app expanded-shell' : 'app';
  app.innerHTML = `${Sidebar({ expanded: state.sidebarExpanded, route: ui.route })}<div class="app-surface"><div class="topbar"><a href="#home">${icon('home')} Home</a><span>Local demo</span><button class="topbar-search" data-action="search" aria-label="Search workspace">${icon('search')}<kbd>⌘K</kbd></button></div><main id="main" tabindex="-1">${ui.route === 'home' ? Home(state, ui.busy) : `<div class="split-view">${ChatPanel(state, ui.busy)}${ui.route === 'tasks' ? Tasks(state, ui.taskFilter) : ui.route === 'knowledge' ? Knowledge(state, ui.knowledgeTab) : Routines(state)}</div>`}</main></div>`;
  document.querySelector('.messages')?.scrollTo({ top: 100000 });
}
function route() {
  const key = location.hash.slice(1) || 'home';
  if (key === 'search') { openSearch(); return; }
  ui.route = ['home','tasks','knowledge','routines'].includes(key) ? key : 'home';
  render();
}
function openDialog(dialog, html) {
  restoreFocus = document.activeElement;
  dialog.innerHTML = html;
  if (!dialog.open) dialog.showModal();
}
for (const dialog of [detail, search]) {
  dialog.addEventListener('close', () => restoreFocus?.isConnected && restoreFocus.focus());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
}
const dialogHeader = (title, subtitle = '') => `<header class="dialog-header"><div><h2 id="detail-title">${e(title)}</h2>${subtitle ? `<p>${e(subtitle)}</p>` : ''}</div>${iconButton('close','Close dialog','close-detail')}</header>`;
function openTask(id) {
  const task = store.get().tasks.find(t => t.id === id);
  if (!task) return toast('This task is no longer available.');
  openDialog(detail, `${dialogHeader(task.title, `${task.source} · ${task.time}`)}<p class="detail-description">${e(task.description)}</p><form data-form="task-edit" data-id="${task.id}"><label for="task-draft">${task.source === 'Email' ? 'Draft reply' : 'Notes and output'}</label><textarea id="task-draft" name="draft" class="document-editor" rows="8">${e(task.draft)}</textarea><p class="demo-note">Local mock content. Completing this task will not send an email or accept a calendar invitation.</p><div class="dialog-footer"><button class="button" type="submit">Save draft</button><button class="button primary" type="button" data-action="task-complete" data-id="${task.id}">${icon('check')} ${task.status === 'done' ? 'Reopen task' : 'Mark complete'}</button></div></form>`);
}
function openFile(id) {
  const file = id ? store.get().files.find(f => f.id === id) : null;
  if (id && !file) return toast('This document is no longer available.');
  openDialog(detail, `${dialogHeader(file?.title || 'New document', 'Knowledge · My Files')}<form data-form="file-save" data-id="${file?.id || ''}"><label for="file-title">Document name</label><input id="file-title" name="title" required value="${e(file?.title || '')}" maxlength="150" placeholder="Notes.md"/><label for="file-content">Content</label><textarea id="file-content" class="document-editor" name="content" rows="12" required placeholder="Write your notes…">${e(file?.content || '')}</textarea><div class="dialog-footer"><label class="check-label"><input type="checkbox" name="pinned" ${file?.pinned ? 'checked' : ''}/> Pin document</label><button class="button primary" type="submit">Save document</button></div></form>`);
}
function openRoutine(id, template) {
  const routine = id ? store.get().routines.find(r => r.id === id) : template || {};
  if (!routine) return toast('This routine is no longer available.');
  openDialog(detail, `${dialogHeader(id ? 'Edit routine' : 'New routine', 'Give Hermes a task to repeat.')}<form data-form="routine-save" data-id="${id || ''}"><label for="routine-title">Name</label><input id="routine-title" name="title" value="${e(routine.title || '')}" required maxlength="150" placeholder="Weekly project update"/><label for="routine-schedule">Schedule</label><input id="routine-schedule" name="schedule" value="${e(routine.schedule || '')}" required placeholder="Every Monday at 8:00 AM"/><label for="routine-prompt">Instructions</label><textarea id="routine-prompt" name="prompt" rows="5" required placeholder="What should Hermes do?">${e(routine.prompt || '')}</textarea><label for="routine-channel">Deliver to</label><select id="routine-channel" name="channel"><option ${routine.channel !== 'Email' ? 'selected' : ''}>Hermes</option><option ${routine.channel === 'Email' ? 'selected' : ''}>Email</option></select><p class="demo-note">Demo only. Your routine is stored locally, not scheduled on a server.</p><div class="dialog-footer"><button class="button" type="button" data-action="close-detail">Cancel</button><button class="button primary" type="submit">Save routine</button></div></form>`);
}
async function openSearch() {
  openDialog(search, `<header class="search-header">${icon('search')}<label class="sr-only" id="search-title" for="search-input">Search workspace</label><input id="search-input" type="search" placeholder="Search for anything…" autocomplete="off"/><button class="key-button" data-action="close-search" aria-label="Close search">Esc</button></header><div class="search-body"><p id="search-caption">Suggested</p><div id="search-results"></div></div><footer class="search-footer">Tasks, knowledge, routines, and memory <span>Enter to open · Esc to close</span></footer>`);
  search.querySelector('input').focus();
  await updateSearch('');
}
async function updateSearch(query) {
  const seq = ++ui.searchSequence;
  try {
    const results = await tools.call('search.query', { query });
    if (seq !== ui.searchSequence || !search.open) return;
    document.querySelector('#search-caption').textContent = query ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Suggested';
    document.querySelector('#search-results').innerHTML = results.length ? results.map(r => `<button class="search-result" data-action="search-result" data-entity="${r.entity}" data-id="${r.id}">${icon(r.entity === 'routine' ? 'routines' : r.entity === 'file' ? 'file' : r.entity === 'memory' ? 'brain' : 'tasks')}<span><strong>${e(r.title)}</strong><small>${r.category}</small></span>${icon('chevron')}</button>`).join('') : '<p class="empty-state">No results. Try “Aurora”, “brief”, or “Cooper”.</p>';
  } catch (error) { toast(error.message); }
}
async function perform(button, fn) {
  if (button?.disabled) return;
  if (button) button.disabled = true;
  try { await fn(); } catch (error) { toast(error.message || 'Something went wrong. Please try again.'); } finally { if (button?.isConnected) button.disabled = false; }
}
document.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const { action, id } = button.dataset;
  const handlers = {
    sidebar: () => store.update({ sidebarExpanded: !store.get().sidebarExpanded }),
    search: openSearch,
    'close-search': () => search.close(),
    'close-detail': () => detail.close(),
    'task-open': () => openTask(id),
    'file-open': () => openFile(id),
    'file-new': () => openFile(),
    'routine-new': () => openRoutine(),
    'routine-edit': () => openRoutine(id),
    'knowledge-tab': () => { ui.knowledgeTab = button.dataset.tab; render(); },
    'task-complete': () => perform(button, async () => {
      const task = store.get().tasks.find(t => t.id === id);
      await tools.call('tasks.update', { id, status: task.status === 'done' ? 'review' : 'done', draft: detail.querySelector('[name="draft"]')?.value ?? task.draft });
      detail.close(); toast(task.status === 'done' ? 'Task reopened.' : 'Task completed locally. No external action was taken.');
    }),
    rsvp: () => perform(button, async () => { await tools.call('tasks.update', { id, status: 'done', draft: button.dataset.answer === 'yes' ? 'RSVP: Yes' : 'RSVP: No' }); toast('RSVP saved in the demo. No calendar response was sent.'); }),
    'routine-toggle': () => perform(button, async () => { const r = store.get().routines.find(r => r.id === id); await tools.call('routines.toggle', { id, active: !r.active }); toast(r.active ? 'Routine paused locally.' : 'Routine enabled locally.'); }),
    'routine-run': () => perform(button, async () => { const task = await tools.call('routines.run', { id }); toast('Mock run complete. A review task was created.'); openTask(task.id); }),
    'routine-suggest': () => openRoutine(null, button.dataset.template === 'brief' ? { title: 'Innovations Hub prep brief', schedule: 'Tuesdays and Thursdays at 3:00 PM', prompt: 'Prepare a brief before each Innovations Hub session using relevant notes and upcoming agenda items.' } : { title: 'Job search tracker: weekly roles update', schedule: 'Every Monday at 8:00 AM', prompt: 'Collect relevant roles and prepare a weekly summary for review.' }),
    phone: () => openDialog(detail, `${dialogHeader('Text Hermes from your phone')}<p class="detail-description">WhatsApp and iMessage are shown in the mockup but aren’t connected in this demo. An agent can add a messaging integration behind the tool adapter.</p><div class="dialog-footer"><button class="button primary" data-action="close-detail">Got it</button></div>`),
    upload: () => {
      const input = document.createElement('input'); input.type = 'file'; input.accept = '.md,.txt';
      input.addEventListener('change', () => perform(button, async () => { const file = input.files[0]; if (!file) return; if (file.size > 1024 * 1024) throw new Error('Choose a text file smaller than 1 MB.'); const saved = await tools.call('knowledge.save', { title: file.name, content: await file.text() }); toast('Document added locally.'); openFile(saved.id); })); input.click();
    },
    'search-result': () => {
      search.close();
      if (button.dataset.entity === 'task') { location.hash = 'tasks'; openTask(id); }
      else if (button.dataset.entity === 'file') { location.hash = 'knowledge'; ui.knowledgeTab = 'files'; openFile(id); }
      else if (button.dataset.entity === 'routine') { location.hash = 'routines'; openRoutine(id); }
      else { ui.knowledgeTab = 'memory'; location.hash = 'knowledge'; render(); }
    }
  };
  handlers[action]?.();
});
document.addEventListener('submit', event => {
  const form = event.target.closest('[data-form]'); if (!form) return;
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  const button = form.querySelector('[type="submit"]');
  perform(button, async () => {
    switch (form.dataset.form) {
      case 'chat': {
        const message = values.message.trim(); if (!message) { toast('Write a message first.'); return; }
        ui.busy = true; render();
        try { await tools.call('agent.send', { message }); } finally { ui.busy = false; render(); document.querySelector('#chat-prompt')?.focus(); }
        break;
      }
      case 'task-create': {
        await tools.call('tasks.create', { title: values.message.trim() }); toast('Task added to Working.'); break;
      }
      case 'task-edit': await tools.call('tasks.update', { id: form.dataset.id, draft: values.draft }); detail.close(); toast('Draft saved locally.'); break;
      case 'file-save': await tools.call('knowledge.save', { ...values, id: form.dataset.id || undefined, pinned: values.pinned === 'on' }); detail.close(); toast('Document saved.'); break;
      case 'routine-save': await tools.call('routines.save', { ...values, id: form.dataset.id || undefined }); detail.close(); toast('Routine saved locally.'); break;
    }
  });
});
document.addEventListener('change', event => { if (event.target.id === 'task-filter') { ui.taskFilter = event.target.value; render(); document.querySelector('#task-filter')?.focus(); } });
document.addEventListener('input', event => { if (event.target.id === 'search-input') updateSearch(event.target.value); });
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); if (!detail.open) search.open ? search.close() : openSearch(); }
  if (search.open && event.target.id === 'search-input' && event.key === 'Enter') { event.preventDefault(); search.querySelector('.search-result')?.click(); }
  if (search.open && event.key === 'ArrowDown' && event.target.id === 'search-input') { event.preventDefault(); search.querySelector('.search-result')?.focus(); }
  if (event.target.matches('.composer textarea') && event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); event.target.form.requestSubmit(); }
});
store.subscribe(render);
window.addEventListener('hashchange', route);
route();
