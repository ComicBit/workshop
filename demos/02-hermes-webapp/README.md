# Demo 2 — Hermes webapp starter

This is the supplied frontend for the workshop's second exercise. It was copied from the facilitator's `hermes_dashboard` project. Reference captures, imported fonts/images, the design `.pen` file and the old ZIP are deliberately excluded. Only the webapp source, tests and Hermes brand assets remain.

**Status: local mock prototype, not a connected personal assistant.** No Hermes backend, app login, speech recognition, onboarding flow or Gmail connector is implemented. Sample emails, tasks, memory and schedules are fixtures, not real user data. The starter is available; live integration still needs to be built and verified.

## Start here

From the workshop repository root, with Node.js 20+:

```sh
cd demos/02-hermes-webapp
npm test
npm start
```

Open http://localhost:3000 (or set `PORT=3001 npm start`). No install step or external npm dependencies are required. Google Fonts loads Inter and Newsreader over the network; system fallbacks work offline.

Next, copy [the complete Demo 2 mission](../../prompts/02-build-control-center.md) into Hermes or your authorized development agent. Give it access to this repository and the participant's own Hermes installation. The mission starts by inspecting this directory; it is not a request to generate another frontend.

## Source map

| File | Role |
| --- | --- |
| `index.html` | Browser entry point |
| `src/app.js` | Navigation, dialogs, event handling; currently constructs a mock client |
| `src/components.js`, `src/styles.css` | Existing responsive interface; preserve it |
| `src/data.js` | Sample workspace fixtures; never treat as actual user context |
| `src/store.js` | Browser localStorage (`hermes-dashboard-v1`); demo persistence only |
| `src/tools.js` | Mock handlers, tool definitions and HTTP transport |
| `src/integration.js` | Remote adapter and workspace refresh contract |
| `server.mjs` | Local static preview server, **not** an authenticated API backend |
| `tests/` | Mock tool and adapter unit tests, not live Hermes tests |
| `dashboard-assets/brand/` | Hermes assets used by the starter |

## Integration seam

The app's proposed backend contract is `POST /api/tools`, accepting `{ "name": "agent.send", "args": { "message": "Hello" } }`. This is **our application contract, not an existing Hermes API route**. The current static server does not implement it.

`createToolClient(store, { toolEndpoint: '/api/tools' })` selects the remote adapter. Its `workspace.get` response must contain arrays named `tasks`, `routines`, `files`, `memory`, and `messages`. Mutations trigger a workspace refresh. `agent.send` returns `{ message: string }`; inspect the existing callers and tests for the other result shapes.

Important: the comment in `integration.js` describes a future `window.HERMES_CONFIG` convention. `app.js` currently calls `createToolClient(store)` without reading that global. Setting the global alone will **not** connect anything. Wire the configuration and initial `tools.refresh()` explicitly, handle failure without silently falling back to fixtures, and implement the authenticated backend before claiming live mode.

The integration mission covers server-only credentials, user isolation, approved profile persistence, voice/text onboarding, one verified task and optional Gmail. Do not expose every mock action as a real capability by default. Scheduling, mail and calendar actions remain unavailable until authorized and verified.

## Safety and verification

- Preview binds to `127.0.0.1`; it has no login and serves project files. Do not add secrets here or expose this server to a tailnet/public network as a deployment.
- The integrated backend must serve only public assets, reject secret/source traversal, authenticate sessions, and keep private state outside the static tree.
- Existing browser storage is demo-only, not an appropriate store for credentials or private shared-device profiles. Use browser site-data controls to clear this preview's local fixtures when needed.
- Use [onboarding behavior](../../prompts/03-personal-onboarding.md) and [acceptance checks](../acceptance-tests.txt) for the actual exercise.
- Unit tests passing proves local behavior only. Record live checks separately as PASS / FAIL / PENDING / BLOCKED.
