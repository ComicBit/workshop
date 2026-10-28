# Agentic AI Workshop — Pilot (28 October 2026)

**Turn an old computer into an always-on personal AI assistant.**

A 2–3 hour, hands-on workshop for two curious participants (one developer, one business/crypto professional). **These are working notes, not completed slides or a finished application.** We are deliberately keeping the slide content in text until the session plan is agreed.

## Open these first

- [Slide content — plain text](content/slide-content.txt): talk track, timings, and demo transitions.
- [First mission: Hermes bootstraps Proxmox services](prompts/01-hermes-bootstrap.md): copyable task prompt.
- [Second mission: build a custom assistant UI](prompts/02-build-control-center.md): a separate, Sauna-inspired frontend using Hermes as its only agent engine.
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
5. **Make it personal:** build a **distinct web interface**, inspired by Sauna's product patterns, connected to Hermes — **not** a reskin of Hermes's built-in dashboard.
6. **Onboard through that interface:** voice-to-text, short conversation, optional Nous Portal Gmail connection, editable profile and a first suggested task.

bb and Paperclip are part of demo 1; **the custom personal assistant must NOT require them**. They are available for later work.

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