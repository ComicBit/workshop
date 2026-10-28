# Agentic AI Workshop — Pilot (28 October 2026)

**Turn an old computer into an always-on personal AI assistant.**

A 2–3 hour, hands-on workshop for two curious participants (one developer, one business/crypto professional). **These are working notes, not completed slides or a finished application.** We are deliberately keeping the slide content in text until the session plan is agreed.

## Open these first

- [Slide content — plain text](content/slide-content.txt): talk track, timings, and demo transitions.
- [First mission: Hermes bootstraps Proxmox services](prompts/01-hermes-bootstrap.md): copyable task prompt.
- [Second mission: connect the prepared assistant UI](prompts/02-build-control-center.md): integrate a separate Sauna-inspired frontend with each participant's own Hermes instance. The UI is being prepared and is not yet available in this repository.
- [Onboarding behavior prompt](prompts/03-personal-onboarding.md): voice-first personal discovery, optional Gmail connection, proactive suggestions.
- [Participant setup](guides/prerequisites.txt): bring an old computer, provider access, and a phone.
- [Tailscale quick guide](guides/tailscale.txt): private remote access, no router port forwarding.
- [Demo acceptance criteria](demos/acceptance-tests.txt): what actually needs to work.
- [Decisions and open questions](notes/decisions.txt): what's agreed, what's not.

## The story

1. **Understand:** what agents are, model vs harness, cloud model vs local model, and the difference between Hermes, bb and Paperclip.
2. **Revive old hardware:** facilitator installs Proxmox; Hermes lives in its own LXC.
3. **Bootstrap using AI:** Hermes creates separate Debian LXCs for bb and Paperclip, configures them, and verifies they run.
4. **Connect privately:** introduce Tailscale and set up remote access.
5. **Make it personal:** connect the separately prepared **custom web interface** to each participant's own Hermes instance — **not** a reskin of Hermes's built-in dashboard.
6. **Onboard through that interface:** voice-to-text, short conversation, optional Nous Portal Gmail connection, editable profile and a first suggested task.

bb and Paperclip are part of demo 1; **the custom personal assistant must NOT require them**. They are available for later work.

## Demo 2: agreed live scope

The facilitator is preparing the UI separately; **the starter repository and working route are not available yet**. The live exercise is **connecting**, not building the frontend from scratch. Minimum UI: microphone/speech-to-text with typed fallback, a way to start conversational onboarding inside the UI, and a secure Hermes connection. Every attendee connects to their **own** Hermes installation and retains separate personal data. If the starter is not available or the integration fails, demonstrate onboarding and a real task directly through Hermes rather than claiming the custom app is working. Gmail via Nous Portal is a useful extension when available and authorized, not a prerequisite for the baseline demo.

```text
OLD MACHINE / PROXMOX
  ├── LXC: Hermes (agent, API, memory, tools, scheduling)
  ├── LXC: bb (developer agent workspace)
  └── LXC: Paperclip (coordination of agents/projects)

Phone/browser ── Tailscale/private network ── Custom personal assistant UI
                                              │
                                      app backend / proxy
                                              │
                                      Hermes API (auth)
                                              │
                              user-approved tools and connectors
```

## Important cautions

- Do not store OAuth tokens, API keys, email content, or passwords in this public repo.
- Do not leave Hermes with unrestricted permanent root access to the Proxmox host.
- A local harness can still call a **cloud** model; don't describe it as automatically offline.
- The agent must distinguish observed successes from installation attempts.
- A Gmail account is **connected by the user**; permissions are explicit and sending/deleting actions require review.
- An application-update plan must include backups and recovery, not just `npm install latest`.
- Sauna is a **product/UX inspiration**, not code or branding to copy.

## Verified starting references

- [Hermes Agent](https://hermes-agent.nousresearch.com/docs/)
- [Hermes API server](https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server)
- [Hermes managed connectors](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)
- [bb](https://getbb.app/) · [source](https://github.com/get-bb/bb)
- [Paperclip](https://paperclip.ing/) · [documentation](https://docs.paperclip.ing/)
- [Tailscale on Proxmox](https://tailscale.com/docs/integrations/proxmox)
- [Sauna app UX reference](https://www.sauna.ai/learn/web-app)

**Status:** workshop content captured as drafts; product details, time budget and hardware constraints still need a final review.