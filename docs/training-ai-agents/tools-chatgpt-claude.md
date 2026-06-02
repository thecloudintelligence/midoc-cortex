# Training tools — ChatGPT & Claude (web)

Use **chatgpt.com** and **claude.ai** only for this program (no Cursor/IDE required for sessions 2–8).

## What to set up before session 2

| Item | ChatGPT | Claude |
|------|---------|--------|
| Account | Free or Plus (Plus helps for longer threads) | Free or Pro |
| Browser | One dedicated browser profile optional | Same |
| Privacy | Team policy: no real PHI in either product | Same |

## Features you will use in training

| Feature | ChatGPT (typical) | Claude (typical) | Teaches |
|---------|-------------------|------------------|---------|
| Plain chat | Default new chat | Default new chat | Prompting, context in thread |
| Attach / paste | Paperclip, paste code or PDF excerpt | Paste or Project file upload | CONTEXT without IDE |
| Web search / browse | “Search the web” (Plus) | Web search toggle | Tool-like step: fetch → answer |
| Code / analysis | Advanced Data Analysis / Code interpreter | Analysis in chat | Tool run with visible steps |
| Projects / GPTs | Projects, custom GPTs (optional) | Projects + instructions | Persistent rules (session 5) |
| Artifacts | Canvas (some accounts) | Artifacts sidebar | Draft vs final output |

Names change by plan; during a session, point at **whatever label the UI shows** (“Searching…”, “Ran Python”, “Read document”) and map it to: **tool invoked → result → reply**.

## How this maps to “agent” vocabulary

```text
User message
    → (optional) Tool step shown in UI — search, code, file read
    → Tool result (may be hidden or summarized)
    → Assistant message
```

In **plain chat** with no tools enabled, the model only uses training + your pasted CONTEXT — good for exercises where you do not want browsing.

## Session hygiene

- **New chat** when topic changes (patient A vs patient B, or new exercise).
- **One product per exercise** when comparing (run same prompt on ChatGPT and Claude in session 4).
- **Never paste** real patient identifiers; use fictional names or product mock data only.

## Trainer screen-share option

For **product** tool literacy (Midoc `ToolRunCard`, confirm buttons), you share **midoc-cortex** running locally; she still practices prompts in ChatGPT/Claude. Two layers: web assistants (sessions 2–6) + your app demo (sessions 7+).
