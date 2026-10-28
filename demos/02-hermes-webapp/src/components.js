const paths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
  tasks: '<path d="m3 6 2 2 4-4M12 6h9M3 13h2m7 0h9M3 20h2m7 0h9"/>',
  knowledge: '<path d="M4 3h4v18H4zM11 3h4v18h-4zM18 4l3-1 4 17-3 1z"/>',
  routines: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-9 3v3l2 1"/>',
  search: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
  file: '<path d="M14 2H5a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8Zm0 0v6h6M8 13h8M8 17h6"/>',
  folder: '<path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  sparkles: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M12 19V5m-6 6 6-6 6 6"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  panel: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  pin: '<path d="m16 3 5 5-4 2-3 6-3-3-6 6m6-6-3-3 6-3Z"/>',
  brain: '<path d="M12 4c-4-5-9 1-6 4-5 2-3 8 0 8-1 5 6 7 6 3m0-15c4-5 9 1 6 4 5 2 3 8 0 8 1 5-6 7-6 3Zm0 0V4"/>',
  play: '<path d="m8 4 13 8-13 8Z"/>',
  edit: '<path d="m16 3 5 5L8 21H3v-5ZM14 5l5 5"/>',
  upload: '<path d="M12 16V3m-5 5 5-5 5 5M4 15v5h16v-5"/>',
  message: '<path d="M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4Z"/>'
};
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.file}</svg>`;
export const logo = (white = false, cls = '') => `<img class="seal ${cls}" src="./dashboard-assets/brand/hermes-girl-${white ? 'white' : 'black'}.png" alt="" />`;
export function iconButton(name, label, action, extra = '') {
  return `<button class="icon-button" type="button" aria-label="${escapeHTML(label)}" title="${escapeHTML(label)}" data-action="${action}" ${extra}>${icon(name)}</button>`;
}
export function Sidebar({ expanded, route }) {
  return `<aside class="sidebar ${expanded ? 'expanded' : ''}" aria-label="Hermes sidebar">
    <div class="brand"><a class="brand-link" href="#home" aria-label="Hermes home">${logo(true)}<span class="brand-name">Hermes</span></a></div>
    <nav aria-label="Main navigation">${['home', 'tasks', 'knowledge', 'routines', 'search'].map(key => {
      const label = key[0].toUpperCase() + key.slice(1);
      const content = `${icon(key)}<span class="nav-label">${label}</span>`;
      return key === 'search' ? `<button class="nav-item" data-action="search" aria-label="Search" title="Search (⌘K)">${content}<kbd>⌘K</kbd></button>` : `<a href="#${key}" class="nav-item ${route === key ? 'active' : ''}" ${route === key ? 'aria-current="page"' : ''} title="${label}">${content}</a>`;
    }).join('')}</nav>
    <div class="sidebar-bottom">${iconButton('panel', expanded ? 'Collapse sidebar' : 'Expand sidebar', 'sidebar')}<span class="sidebar-note">Local demo</span></div>
  </aside>`;
}
export function Composer({ compact = false, busy = false, task = false } = {}) {
  return `<form class="composer ${compact ? 'compact' : ''}" data-form="${task ? 'task-create' : 'chat'}">
    <label class="sr-only" for="${task ? 'task-prompt' : 'chat-prompt'}">${task ? 'New task' : 'Message Hermes'}</label>
    <textarea id="${task ? 'task-prompt' : 'chat-prompt'}" name="message" rows="2" placeholder="${task ? 'Kick off another idea…' : 'Hermes, where can I start?'}" required maxlength="4000" ${busy ? 'disabled' : ''}></textarea>
    <div class="composer-footer"><span class="composer-hint">${icon(task ? 'tasks' : 'sparkles')}<span>${task ? 'Personal' : 'Mock tools'}</span></span><span class="composer-actions">${!task ? '<span class="model-label">Ember</span>' : ''}<button class="send-button" type="submit" aria-label="${task ? 'Create task' : 'Send message'}" ${busy ? 'disabled' : ''}>${busy ? '<span class="spinner"></span>' : icon('arrow')}</button></span></div>
  </form>`;
}
export function ChatPanel(state, busy) {
  return `<section class="chat-panel" aria-label="Hermes conversation">
    ${state.messages.length ? `<div class="messages" aria-live="polite">${state.messages.map(m => `<div class="message ${m.role}"><span class="message-author">${m.role === 'user' ? 'You' : 'Hermes'}</span><p>${escapeHTML(m.content)}</p></div>`).join('')}${busy ? '<p class="thinking">Hermes is thinking…</p>' : ''}</div>` : `<div class="chat-welcome">${logo()}<h2>Hermes</h2><p>Hermes’s warm, c’mon in.</p></div>`}
    ${Composer({ busy })}
  </section>`;
}
export function TaskCard(task) {
  return `<article class="task-card"><span class="source-icon ${task.kind}">${icon(task.kind)}</span><div class="task-card-copy"><span class="eyebrow">${escapeHTML(task.time)}</span><h3>${escapeHTML(task.title)}</h3><p>${escapeHTML(task.description)}</p></div><div class="task-card-actions">${task.id === 'invite' ? `<button class="button primary small" data-action="rsvp" data-id="${task.id}" data-answer="yes">Yes</button><button class="button small" data-action="rsvp" data-id="${task.id}" data-answer="no">No</button>` : `<button class="button primary small" data-action="task-open" data-id="${task.id}">${escapeHTML(task.action)}</button>`}</div></article>`;
}
export function Home(state, busy) {
  const pending = state.tasks.filter(t => t.status === 'review');
  return `<div class="home-page"><div class="home-primary"><header class="home-header"><div><p class="greeting">Afternoon Leo,</p><h1>${pending.length ? `Hermes found ${pending.length} thing${pending.length === 1 ? '' : 's'} that need you.` : 'You’re all caught up, Leo.'}</h1></div>${logo()}</header>
    <section class="attention" aria-labelledby="attention-heading"><div class="section-meta"><h2 id="attention-heading">Needs you</h2><span class="updated"><i></i> Updated just now</span></div><div class="task-cards">${pending.slice(0, 3).map(TaskCard).join('') || '<div class="empty-state">Nothing needs a decision right now. Start an idea below or review your routines.</div>'}</div>${pending.length > 3 ? `<a class="show-all" href="#tasks">${pending.length - 3} more · Show all ${icon('chevron')}</a>` : ''}</section>
    <section class="home-chat" aria-label="Quick conversation">${state.messages.length ? `<div class="home-reply"><span>Hermes</span><p>${escapeHTML(state.messages.at(-1).content)}</p></div>` : ''}${Composer({ busy })}</section></div>
    <aside class="home-secondary" aria-label="Suggestions and upcoming events"><section class="suggestion-panel"><header><div><h2>Routines for you</h2><p>Picked for Founder</p></div><span class="pastel-icon">${icon('routines')}</span></header>
      <button class="suggestion" data-action="routine-suggest" data-template="brief"><span><strong>Prep brief before each Innovations Hub session</strong><small>Tuesdays and Thursdays · Not run yet</small></span><span class="badge">New</span>${icon('chevron')}</button>
      <button class="suggestion" data-action="routine-suggest" data-template="jobs"><span><strong>Job search tracker: weekly roles update</strong><small>Mondays 8:00 UTC · Not run yet</small></span><span class="badge">New</span>${icon('chevron')}</button><a class="panel-link" href="#routines">View all active routines ${icon('chevron')}</a></section>
      <section class="suggestion-panel"><header><div><h2>Next up</h2><p>Done for today · 1 tomorrow</p></div><span class="date-icon">28</span></header><button class="suggestion" data-action="task-open" data-id="invite"><span><strong>Weekly | Program inkubacyjny</strong><small>Tomorrow 6:00 PM</small></span><span class="badge warm">RSVP</span></button></section>
      <button class="phone-card" data-action="phone">${icon('message')}<span><strong>Text Hermes from your phone</strong><small>Using WhatsApp and iMessage</small></span></button>
    </aside></div>`;
}
export function Tasks(state, filter) {
  const groups = [['working', 'Working'], ['review', 'Review'], ['done', 'Done'], ['junk', 'Junk']];
  const tasks = state.tasks.filter(t => filter === 'all' || t.status === filter);
  return `<section class="workspace-panel"><header class="panel-header"><h1>Tasks</h1><span class="demo-badge">Demo workspace</span></header><div class="panel-body tasks-body">${Composer({ task: true })}<div class="task-toolbar"><label>Filter <select id="task-filter"><option value="all" ${filter === 'all' ? 'selected' : ''}>All tasks</option>${groups.map(([key, label]) => `<option value="${key}" ${key === filter ? 'selected' : ''}>${label}</option>`).join('')}</select></label><span class="badge">Personal</span></div>
    ${groups.filter(([key]) => filter === 'all' || key === filter).map(([key, label]) => `<details class="task-group" open><summary>${label} <span>(${tasks.filter(t => t.status === key).length})</span></summary><div>${tasks.filter(t => t.status === key).map(t => `<button class="task-row" data-action="task-open" data-id="${t.id}"><span class="row-icon">${icon(t.kind)}</span><span><strong>${escapeHTML(t.title)}</strong><small>${escapeHTML(t.description)}</small></span><time>${escapeHTML(t.time)}</time>${icon('chevron')}</button>`).join('') || `<p class="group-empty">${key === 'working' ? 'No tasks in progress.' : key === 'done' ? 'Completed tasks appear here.' : key === 'junk' ? 'Nothing here.' : 'All reviewed.'}</p>`}</div></details>`).join('')}</div></section>`;
}
export function Knowledge(state, tab) {
  const files = state.files.filter(f => tab !== 'pinned' || f.pinned);
  return `<section class="workspace-panel"><header class="panel-header"><h1>Knowledge</h1></header><div class="knowledge-layout"><nav class="knowledge-nav" aria-label="Knowledge sections"><p>My Hermes</p>${[['files','My Files','folder'],['pinned','Pinned','pin'],['memory','Memory','brain']].map(([key,label,ic]) => `<button class="knowledge-tab ${tab === key ? 'selected' : ''}" data-action="knowledge-tab" data-tab="${key}" aria-current="${tab === key ? 'page' : 'false'}">${icon(ic)}${label}</button>`).join('')}</nav><div class="knowledge-content"><header class="file-toolbar"><span class="badge">${tab === 'memory' ? 'Memory' : tab === 'pinned' ? 'Pinned' : 'My Files'}</span><div>${tab !== 'memory' ? `${iconButton('plus','New document','file-new')}${iconButton('upload','Upload text document','upload')}` : ''}</div></header>${tab === 'memory' ? `<div class="memory-list">${state.memory.map(m => `<article><h2>${escapeHTML(m.title)}</h2><p>${escapeHTML(m.content)}</p></article>`).join('')}</div>` : `<div class="file-grid">${files.map(f => `<button class="file-tile" data-action="file-open" data-id="${f.id}"><span class="folder-art">${icon('folder')}</span><strong>${escapeHTML(f.title)}</strong><small>${f.pinned ? 'Pinned · ' : ''}${escapeHTML(f.updated)}</small></button>`).join('') || '<p class="empty-state">No pinned files yet. Open a file and choose Pin.</p>'}</div>`}</div></div></section>`;
}
export function Routines(state) {
  return `<section class="workspace-panel"><header class="panel-header"><h1>Routines</h1><button class="button primary small" data-action="routine-new">${icon('plus')} New</button></header><div class="panel-body routine-list"><span class="list-label">List</span>${state.routines.map(r => `<article class="routine-card"><div class="routine-main"><span class="badge ${r.active ? 'enabled' : ''}">${r.active ? 'Active' : 'Paused'}</span><button class="routine-title" data-action="routine-edit" data-id="${r.id}">${escapeHTML(r.title)}</button><div class="routine-actions">${iconButton('play','Run '+r.title,'routine-run',`data-id="${r.id}"`)}${iconButton('edit','Edit '+r.title,'routine-edit',`data-id="${r.id}"`)}<button class="switch" role="switch" aria-checked="${r.active}" aria-label="Enable ${escapeHTML(r.title)}" data-action="routine-toggle" data-id="${r.id}"><span></span></button></div></div><p class="routine-meta">${escapeHTML(r.schedule)}<span>·</span>${r.active ? escapeHTML(r.next) : 'Paused'}<span>·</span>${icon(r.channel === 'Email' ? 'mail' : 'message')}${escapeHTML(r.channel)}</p>${r.lastRun ? `<p class="last-run">Last mock run: ${escapeHTML(r.lastRun)}</p>` : ''}</article>`).join('')}<p class="demo-note">Schedules are illustrative. Mock runs create a review task; no external jobs or emails are sent.</p></div></section>`;
}
