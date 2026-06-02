# Session 2 — Practical prompting & reading tool runs

**Duration:** 60–90 minutes  
**Prerequisite:** Session 1 (agent basics)  
**Tools:** [ChatGPT](https://chatgpt.com) and [Claude](https://claude.ai) in the browser — see [tools-chatgpt-claude.md](./tools-chatgpt-claude.md)  
**Outcome:** She can write a task-ready prompt and interpret what the assistant did (including visible “tool” steps like search or code).

---

## Learning objectives

By the end of this session she can:

1. Structure a user message as **goal + context + constraints + desired output**.
2. Explain the difference between **“answer in chat only”** vs **“use a capability”** (web search, code, file/analysis).
3. Trace one turn: user message → (optional) visible tool step → assistant reply.
4. Spot a **bad prompt** and rewrite it without changing the underlying goal.

---

## Agenda (minute-by-minute)

| Time | Block | You do | She does |
|------|--------|--------|----------|
| 0–10 | Recap | Ask: “What is an agent in one sentence?” “What are tools for?” | Answers in her own words |
| 10–25 | Concept: prompt anatomy | Whiteboard or doc: four parts below | Fill in one example (non-clinical, e.g. trip planner) |
| 25–50 | Hands-on A | Coach only | Writes 3 prompts; runs them in **ChatGPT or Claude** (her choice unless comparing) |
| 50–70 | Hands-on B | Demo one run with a visible tool step; then she narrates a second | Labels each step on a transcript |
| 70–85 | Concept: human in the loop | Tie to confirm-before-commit in real products | Names one action that must never be automatic |
| 85–90 | Homework | Assign below | Writes one question for session 3 |

---

## Concept 1 — Prompt anatomy (the only framework for today)

Teach one template; avoid prompt-engineering jargon overload.

```text
GOAL:        What success looks like (one sentence)
CONTEXT:     Facts the model cannot guess (paste excerpts, dates, audience)
CONSTRAINTS: What not to do (scope, tone, safety, “no web search”)
OUTPUT:      Format you want (bullets, table, JSON, word count)
```

**Worked example (paste-friendly, no repo access needed):**

```text
GOAL: Draft a welcome email for a new hire on the clinical copilot team.
CONTEXT: Product is a doctor-facing chat assistant; tone is professional, warm, not salesy.
CONSTRAINTS: No medical claims; do not invent product features; under 150 words.
OUTPUT: Subject line + body only, UK English.
```

**Anti-patterns to call out:**

| Weak | Stronger |
|------|----------|
| “Fix the bug” | GOAL + what broke + CONSTRAINT “suggest only, no code execution” |
| “Make it better” | GOAL with measurable outcome |
| Pasting 50 pages with no ask | Trimmed CONTEXT + explicit OUTPUT |
| “You are an expert…” fluff | Replace with CONSTRAINTS and OUTPUT |

---

## Hands-on A — Three prompts (she drives, browser only)

Pick **one** product for all three exercises (ChatGPT *or* Claude). Use a **new chat** for exercise 3.

Prepare a **snippet pack** before the session (you send or screen-share): 15–30 lines from `README.md` or a short fictional “patient search API” JSON — no real PHI.

### Exercise 1 — Pure Q&A (no web search / no code)

**Setup:** New chat. Turn **off** web search if the UI offers it (or say in CONSTRAINTS: “Do not browse the web”).

**Task:** Paste the README or snippet pack. Ask what a “tool run card” or “confirm before save” pattern is for in a clinical copilot UI.

**Pass criteria:** Answer is grounded in what she pasted; she can point to which sentence she pasted as CONTEXT.

**Debrief:** When is chat-only enough?

### Exercise 2 — Constrained output (still no repo / no IDE)

**Task:** Same chat or new chat. Ask for a **structured** deliverable, e.g.:

```text
GOAL: List risks if a doctor confirms the wrong patient from an AI suggestion.
CONTEXT: [paste 5-line fictional scenario: two similar names, one appointment ID]
CONSTRAINTS: No legal advice; max 6 bullets; plain language for clinicians.
OUTPUT: Table with columns Risk | Why it matters | Mitigation.
```

**Pass criteria:** Table matches OUTPUT; does not invent a third patient name not in CONTEXT.

**Debrief:** How did CONSTRAINTS and OUTPUT change the reply?

### Exercise 3 — Deliberately bad prompt (then rewrite)

**Start with:** “Improve our patient flow.”

**Then rewrite together** using GOAL / CONTEXT / CONSTRAINTS / OUTPUT, e.g.:

```text
GOAL: Propose three UX copy changes for a “Confirm patient” button before chart access.
CONTEXT: Mock patients: Jane Doe (MRN 1001) and Jane Doe (MRN 1002); wrong tap is the main risk.
CONSTRAINTS: Copy only; no code; no real PHI.
OUTPUT: For each change: Current | Proposed | Rationale (one line each).
```

**Pass criteria:** She writes the rewritten prompt herself.

---

## Hands-on B — Reading a “tool run” on the web

**Goal:** Literacy, not debugging (session 8).

### Option A — Visible tool step in ChatGPT or Claude

Run **one** prompt that triggers a visible step, e.g.:

- ChatGPT (Plus): “What changed in OpenAI’s agent features in the last 6 months?” with **web search on** — watch for “Searching…” or similar.
- Claude: Short question needing **web search** on, or ask for a small **table/chart** and watch for analysis/code labels if shown.

She labels on paper or shared doc:

1. **User message** — exact ask  
2. **Tool step** — what the UI called it (search, code, read file)  
3. **Result** — did the answer cite sources / match OUTPUT?  
4. **Final reply** — trustworthy enough to use as-is?

### Option B — You demo Midoc (trainer screen only)

Run **midoc-cortex** mock demo (`VITE_USE_MOCK=true` → “Load demo flow”). She does **not** need Cursor; she maps the same four labels to **ToolRunCard** + **Confirm** in your product.

**Questions to ask her:**

- “What would go wrong if confirm were skipped?”
- “Where is the equivalent of ‘web search’ in our app vs in ChatGPT?”

---

## Concept 2 — Human in the loop (5 minutes)

| Assistant proposes | Human must confirm (examples) |
|--------------------|-------------------------------|
| Patient match | Wrong patient = wrong chart |
| Text for EHR / notes | Record is official |
| Send email / order | Hard to undo |

**Rule of thumb:** *Automate read and draft; gate write and commit.*  
ChatGPT/Claude drafts; **she** sends, files, or clicks Confirm in the real product.

---

## Stretch (if time)

- Run **the same** exercise 2 prompt on **both** ChatGPT and Claude; compare length, format adherence, hallucinations.
- Ask: “What would you want a doctor to see when the model used web search vs clinic data?”

---

## Homework (before session 3)

1. **Rewrite** one vague prompt she used at work or school (before/after using the four-part template).
2. **One new chat** on ChatGPT or Claude: enable **web search** (if available), ask one factual question, screenshot or note the tool step label + whether sources were shown.
3. **Skim** [30-session-curriculum.md](./30-session-curriculum.md) sessions 3–4.

**Optional:** One paragraph — “When I would not use ChatGPT/Claude for work.”

---

## Assessment checklist (you tick after session)

- [ ] Can state prompt anatomy without notes  
- [ ] Rewrote a vague prompt independently  
- [ ] Can name user → (optional) tool step → reply on a real chat  
- [ ] Can give one example of required human confirmation  

---

## Materials to have open

- [tools-chatgpt-claude.md](./tools-chatgpt-claude.md)  
- Snippet pack: `README.md` excerpt and/or fictional JSON (trainer prepares)  
- Optional (your screen): Midoc demo for Option B in hands-on B  

---

## Notes for trainer (private)

- **Pace:** Weak on structure → drop stretch; strong → compare ChatGPT vs Claude on exercise 2.  
- **No PHI** in either product; fictional patients only.  
- **Session 3:** Thread memory, long paste, when to start a new chat — homework 2 feeds that.
