# 30-session curriculum — Practical AI agents

**Format:** 1:1, ~60–90 min per session (adjust).  
**Primary tools:** [ChatGPT](https://chatgpt.com) + [Claude](https://claude.ai) (web). See [tools-chatgpt-claude.md](./tools-chatgpt-claude.md).  
**Session 1:** Done — agent definition, LLM + tools + loop, safety overview.

Legend: **★** = hands-on heavy | **M** = Midoc Cortex (trainer demo or her local `npm run dev`, not Cursor)

---

## Phase 1 — Operator skills (sessions 2–8)

*She uses web assistants confidently before building agents.*

| # | Topic | Outcomes | Homework |
|---|--------|----------|----------|
| **2** | **Practical prompting & tool literacy** | Four-part prompts; read search/code steps in UI; human-in-the-loop | See [session-02](./session-02-practical-prompting-and-tool-use.md) |
| 3 ★ | Context & memory | Thread history; paste vs upload; when to start new chat; custom instructions | Long paste + summarize; continue in new chat with summary only |
| 4 ★ | ChatGPT vs Claude | Same prompt on both; compare format, grounding, refusals | 3 prompts × 2 products; note differences |
| 5 | Persistent instructions | ChatGPT custom instructions / Project; Claude Project system prompt | Write 5 team rules as project instructions (no PHI) |
| 6 ★ | Planning before doing | Ask for plan only, then execute in follow-up message | Task: plan a training handout; implement in session 7 |
| 7 ★ M | Observability in products | Tool cards, errors, loading; vs web “Searching…” | Trace Midoc mock flow OR screenshot ChatGPT tool step |
| 8 ★ | Debugging bad outputs | Too long, wrong format, invented facts | Fix one bad reply by rewriting prompt only (no IDE) |

---

## Phase 2 — How agents are built (sessions 9–16)

*Mental model for design and review — still mostly web + diagrams; code sessions paired with you.*

| # | Topic | Outcomes | Homework |
|---|--------|----------|----------|
| 9 | System vs user message | What Projects/instructions do vs each turn | Critique a sample system prompt (2 fixes) |
| 10 | Tool design | Schemas, descriptions, when to call a tool | Paper-design 2 tools for “appointment lookup” |
| 11 ★ | The agent loop | Plan → act → observe; stop conditions | Diagram Midoc chat flow (M optional) |
| 12 | Orchestration patterns | Single agent vs router vs specialist | 1-page comparison |
| 13 ★ M | API contract | `GET /health`, `GET /v1/meta`, `POST /v1/chat` | curl health + meta; list tools |
| 14 ★ M | UI for agents | ToolRunCard, confirm cards, loading steps | Map UI states to backend events |
| 15 | Parsing & guardrails | Structured outputs, validation | Paste parser code into Claude; suggest one guard |
| 16 | Safety & compliance | PHI, audit, confirm-before-write | List gates for clinical copilot |

---

## Phase 3 — Shipping with agents (sessions 17–24)

| # | Topic | Outcomes | Homework |
|---|--------|----------|----------|
| 17 ★ | Evals & golden tasks | Pass/fail criteria; regression prompts | 5 golden prompts for notes assistant (web test) |
| 18 | Cost & latency | Tokens, tool calls, thread length | Estimate one long thread; when to reset chat |
| 19 ★ | Review discipline | Draft in ChatGPT/Claude; human edits before send/commit | One work doc: AI draft → her final → what she changed |
| 20 | Testing agent features | Mock API, fixtures | One test idea for parser (paired coding if needed) |
| 21 ★ M | End-to-end demo | Mock: search → match → confirm → notes | 2-min demo script |
| 22 | Failure modes | Offline, timeouts, partial tools | Read `AppShell` offline path; UX copy suggestion |
| 23 | Docs & handoffs | README, runbooks | Update one doc from homework |
| 24 ★ | Capstone prep | Choose scope | 1-page capstone proposal |

---

## Phase 4 — Mastery & capstone (sessions 25–30)

| # | Topic | Outcomes |
|---|--------|----------|
| 25–27 ★ | **Capstone** | e.g. prompt library, golden eval set, runbook, UX copy pack |
| 28 | Capstone review | She presents; safety and scope challenged |
| 29 | Retrospective | Automate vs never automate |
| 30 | Next 90 days | Learning plan; teaching others on ChatGPT/Claude |

---

## Capstone ideas (pick one by session 24)

1. **Golden eval set** — 10 prompts + expected behavior (tested in ChatGPT and Claude).  
2. **Prompt library** — Approved templates (clinical vs admin; fictional data only).  
3. **Developer runbook** — Run Midoc + agent API locally (you pair on code).  
4. **UX copy pack** — Confirm flows, error states, offline banner text.

---

## Session 2 → 3 bridge

After today she should bring:

- Before/after prompt rewrite  
- Notes from one chat with a visible tool step (search/code) or your Midoc demo sketch  

Session 3 opens with: *“What did you leave in the thread vs start fresh, and why?”*
