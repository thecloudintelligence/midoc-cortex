# AI Agents — Practical Training Program

One-on-one curriculum (30 sessions). Assumes **Session 1** covered: what an agent is, LLM + tools + loop, vs chatbot, high-level architecture, and safety basics.

## Tools for this program

**ChatGPT** and **Claude** in the browser — not Cursor or other IDEs for Phase 1. Setup and feature map: [tools-chatgpt-claude.md](./tools-chatgpt-claude.md).

Midoc Cortex demos (optional) use `npm run dev` on your machine; she practices prompting in the web products.

## How to use this folder

| File | Purpose |
|------|---------|
| [tools-chatgpt-claude.md](./tools-chatgpt-claude.md) | Accounts, features, mapping UI steps to “tools” |
| [30-session-curriculum.md](./30-session-curriculum.md) | Full arc: topic per session, outcomes, homework |
| [session-02-practical-prompting-and-tool-use.md](./session-02-practical-prompting-and-tool-use.md) | **Today** — detailed runbook (~60–90 min) |

Adjust pace: if she masters a block early, use the “stretch” activities; if not, carry homework into the next session.

## Program goals (by session 30)

She should be able to:

1. **Prompt** agents for reliable, scoped tasks (goal, context, constraints, output format).
2. **Read** agent runs: tool calls, errors, confirmations, and when to intervene.
3. **Design** small agent workflows (tools, human gates, failure modes).
4. **Ship** or contribute to agent-backed features (e.g. clinical copilot) with review discipline.

## Suggested session rhythm

- **10 min** — recap homework + questions from last time  
- **15 min** — concept (one idea only)  
- **35 min** — paired hands-on (she drives, you coach)  
- **10 min** — assign homework + note what to defer  

## Repo tie-in (Midoc Cortex)

From session 4 onward, optional exercises use this repo: mock demo flow, `ToolRunCard`, patient confirmation, `POST /v1/chat`. Keeps training grounded in real product patterns.
