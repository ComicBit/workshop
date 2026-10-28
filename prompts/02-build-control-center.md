# Demo 2 — Connect the facilitator-prepared personal UI to Hermes

**The starter source is included at [`demos/02-hermes-webapp/`](../demos/02-hermes-webapp/). Read its [README](../demos/02-hermes-webapp/README.md) first.** It is a local mock prototype, not a connected Hermes assistant. This mission integrates that existing source; do not build a replacement frontend. The separate [onboarding behavior prompt](03-personal-onboarding.md) defines the conversation after integration.

## Mission — copy into Hermes or an authorized development agent

**Integrate and deploy the provided starter application**, a small mobile-first personal AI interface with its own visual identity and onboarding, with the local Hermes instance as its sole AI engine. The user interacts with THIS application, not Hermes's built-in dashboard. Preserve the existing UI and improve only what is needed to connect it. If the starter files are absent, report that blocker; do not falsely describe an implementation as complete.

SOURCE MATERIAL:
- Repository: https://github.com/ComicBit/workshop
- Starter: demos/02-hermes-webapp/ (work in this directory, relative to the repository root).
- Setup and integration notes: demos/02-hermes-webapp/README.md.
- Onboarding behavior: prompts/03-personal-onboarding.md.
- Evidence checklist: demos/acceptance-tests.txt, Demo 2 section.
If you cannot access the checkout, ask the user for a local path or authorization to clone it. Never guess a path or work from screenshots alone. Use the supplied UI and assets; no external product reference or design .pen file is required.

ARCHITECTURE:
browser (phone/computer)
  -> our web UI (speech-to-text, chat, onboarding, activity)
  -> our small authenticated server/BFF
  -> existing Hermes API (model+agent+tools+memory)
Hermes handles the actual work. bb and Paperclip are **not necessary** to run this app.

FIRST ACTION:
1. Locate the repository, read demos/02-hermes-webapp/README.md and this entire mission, then inspect index.html, package.json, server.mjs, src/app.js, src/integration.js, src/tools.js, src/store.js, src/data.js and tests/.
2. From demos/02-hermes-webapp run `npm test` and `npm start` with Node.js 20+. Open http://localhost:3000. No npm install is required. Record the baseline as MOCK; fixtures are not the participant's profile, inbox or completed actions.
3. Report the actual starting gaps: static-only server, mock client, browser-local fixtures, no authentication, no speech recognition, no onboarding flow and no Gmail integration. Preserve the existing components and styles while implementing the missing path.
4. Inspect the participant's actual Hermes installation/version, configuration and currently documented capabilities. Verify routes with real requests. Ask for missing access through a private channel; never request keys in projected chat or commit them.
5. Propose the smallest secure integration plan and get approval before deployment or consequential changes.

ADAPTER CONTRACT — READ BEFORE IMPLEMENTING:
- `src/tools.js` defines the app's tool names and `createHttpTools`; `src/integration.js` wraps it with workspace refresh. Our proposed `POST /api/tools` endpoint accepts `{ name, args }`. This is an APPLICATION endpoint to implement, NOT a documented Hermes route.
- `workspace.get` must return arrays: tasks, routines, files, memory, messages. Mutations refresh this snapshot. `agent.send` returns `{ message: string }`; inspect callers for all other shapes.
- `src/app.js` currently calls `createToolClient(store)` with no config. The `window.HERMES_CONFIG` comment in integration.js is not wired up. Explicitly connect the config and initial refresh; adding a global alone does nothing.
- Implement an authenticated same-origin backend that maps allowlisted app actions to capabilities actually supported by the installed Hermes version. Never expose arbitrary shell execution. Unsupported actions must be unavailable, not silently mocked.
- Replace fixture hydration and browser-only private persistence in live mode. Failed connection/auth must show an honest error, never fall back to fake successful responses.
- The static preview server serves project files and has no login. Do not add secrets to its served tree or deploy it unchanged. Serve only public assets; isolate private state and server configuration.
Use only endpoints and streaming events supported by the installed version; verify with real requests. NEVER invent a Hermes endpoint or claim features without tests. Do not replace the prepared UI with a newly generated frontend unless explicitly instructed.

WORKSHOP MVP (must be real):
1. A polished, responsive home/chat screen on mobile and desktop, distinct from the Hermes dashboard.
2. On first run, guide the person through a short interactive introduction INSIDE this UI. Voice input preferred; typing always available.
3. Speech-to-text: use a supported browser SpeechRecognition implementation where available; indicate when browser recognition is unavailable or might rely on cloud processing. Never record or send microphone audio without user activation.
4. Persist a small editable personal profile (goals, priorities, preferences) in a private local database or well-controlled on-disk store. Profiles aren't public and never committed.
5. Secure server-to-server Hermes API integration with a backend-held API_SERVER_KEY. Do not include the key in frontend bundles, localStorage or public HTML.
6. Show actual Hermes responses and (where API supports it) in-progress activity/streaming. Do not fabricate agent progress or completions.
7. After onboarding, show 2–3 specific, useful suggestions tied to real profile facts, each with “Why this suggestion?” and a clear permission choice.
8. After the user approves one safe task, pass the request to Hermes, display its real status/result and add the result to activity history.
9. A Connections screen for Nous Portal/Gmail with truthful connected, disconnected or needs-action status.
10. A page to see, edit or delete user profile data, and a plain-language description of what information is stored.

DESIGN DIRECTION:
Preserve the supplied Hermes webapp's responsive layout and visual identity. Add a clear voice affordance, onboarding entry, approved editable profile and honest connection/activity states within the existing interface. Keep accessible contrast, keyboard navigation and mobile usability.

CONNECTING GMAIL:
- Do NOT implement a new Google OAuth client unless proven necessary.
- Check Hermes's current Nous Portal connector commands and the connected account's eligibility.
- The UI can show “Connect Gmail”. This button must route through a safe, explicit, allowlisted backend operation or a documented user-performed login; use the connector-provided authorization URL if available. Never expose an arbitrary shell-exec endpoint in the app.
- Show the Google/Nous authorization in an explicit user-initiated flow.
- Verify authenticated connector status before claiming “connected”.
- Ask separately for permission to read a limited set of recent emails and summarize only what was actually retrieved.
- Build a working no-Gmail onboarding flow for accounts with no connector entitlement or consent.
- Do not allow “send”, “delete”, “archive” or other consequential changes without explicit review.

SECURITY / DEPLOYMENT:
- Run as a non-root service with persistent state and restart on boot.
- Serve on a private authenticated network (Tailscale preferred); do not expose Hermes or Proxmox publicly.
- Enforce application authentication, CSRF/session protections, sensible request validation and a strict API action allowlist.
- Persist secret material in local server-only config/secrets store; don't log private email content.
- If a second device accesses the app, require login; Tailscale membership alone isn't sufficient for high-privilege actions.
- A speech recognition browser API may use vendor servers; be transparent, do not market it as “100% on-device”.
- Gracefully handle missing provider credentials, gateway outage and tool errors.

WORKSHOP TIMEBOX:
The UI is prepared BEFORE the workshop, not built live. PRIORITY: launch the starter, connect it to the participant's own Hermes backend, verify speech-to-text or text fallback, start onboarding inside the custom UI, save editable context, and complete one suggested, user-approved task. Gmail connection is optional and only added after the core path works. If the starter is not ready, do the core demonstration in Hermes's native interface and mark custom UI integration as PENDING.

TESTS / DEMONSTRATION:
- First run displays onboarding; user can speak OR type answers.
- Profile persists after browser reload.
- UI calls live Hermes API and receives actual response.
- A suggestion uses profile information and explains its basis.
- Approval is recorded, then one real low-risk action completes with traceable result.
- If Gmail is connected with consent, prove a small bounded read and cite which messages were consulted privately. Otherwise display a truthful explanation.
- Service survives restart and can be reached from a participant's phone via private network.

DELIVERABLE:
Implement within demos/02-hermes-webapp/ in this workshop repository. Update its README with participant-specific configuration, supported Hermes version/routes and private deployment instructions; supply an env.example WITHOUT real keys, tests for the authenticated backend/adapter and an honest achieved/partial/blocked checklist. Keep real keys, personal profiles, email and runtime data untracked. Run existing unit tests plus real integration and phone/restart checks. Never report features complete based on mock screenshots or unit tests alone.

Reference: https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server
