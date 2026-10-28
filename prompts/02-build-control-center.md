# Demo 2 — Build a separate Sauna-inspired personal UI for Hermes

**This is the build brief for an agent working on the second project.** Do not confuse it with the onboarding system prompt in 03-personal-onboarding.md.

## Mission — copy into Hermes or an authorized development agent

Build a small, mobile-first **personal AI assistant web application** with its own visual identity, UX, onboarding and backend. The user interacts with THIS application, not Hermes's built-in dashboard.

Study the public user experience described at https://www.sauna.ai/learn/web-app as reference for **product patterns only** (home/chat, activity, memory, suggestions, schedule, connections). DO NOT copy proprietary code, trademarks, logos, private screens, or exact branded artwork. Call our app WORKSHOP ASSISTANT until its owner names it.

ARCHITECTURE:
browser (phone/computer)
  -> our web UI (speech-to-text, chat, onboarding, activity)
  -> our small authenticated server/BFF
  -> existing Hermes API (model+agent+tools+memory)
Hermes handles the actual work. bb and Paperclip are **not necessary** to run this app.

FIRST ACTION:
Inspect the actual Hermes installation/version and GET its documented /v1/capabilities endpoint, then read current Hermes API docs. Use the documented API endpoints and streaming event types if present. NEVER invent a Hermes API endpoint or claim features without tests. Inspect any existing files/starter before writing new code.

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
Calm, friendly, modern personal workspace; large welcoming prompt, clear voice affordance, task cards, review queue, history, accessible contrast, keyboard navigation. Inspired by the principles of Sauna, not its branding. Mobile-first.

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
Prefer an inspectable working happy path to six decorative placeholder pages. Build chat + intro + editable profile + one suggested action FIRST. Add Gmail connector onboarding only after these work. Avoid feature creep.

TESTS / DEMONSTRATION:
- First run displays onboarding; user can speak OR type answers.
- Profile persists after browser reload.
- UI calls live Hermes API and receives actual response.
- A suggestion uses profile information and explains its basis.
- Approval is recorded, then one real low-risk action completes with traceable result.
- If Gmail is connected with consent, prove a small bounded read and cite which messages were consulted privately. Otherwise display a truthful explanation.
- Service survives restart and can be reached from a participant's phone via private network.

DELIVERABLE:
Source in its own project/repository, README with start/deploy instructions, env.example WITHOUT real keys, architecture notes, test instructions, and an honest achieved/partial/blocked checklist. Never report features complete based on mock screenshots.

Reference: https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server
