# Midoc Clinical Copilot (Cortex)

Desktop-first clinical copilot UI for doctors during live consultations. Chat-first layout with a persistent clinical context panel, tool-run transparency, and explicit patient/action confirmation gates.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Zustand (chat + patient state)
- react-markdown + Radix UI primitives (shadcn-style components)

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Demo without backend

```bash
# .env
VITE_USE_MOCK=true
```

Or click **Load demo flow** in the app to see patient search, tool cards, and match candidates.

### Connect to agent API

```bash
# .env
VITE_AGENT_API_URL=http://localhost:8080
VITE_USE_MOCK=false
```

Endpoints used:

- `GET /health` — connection check on load
- `GET /v1/meta` — tools list (settings)
- `POST /v1/chat` — full message history round-trip

## Layout

| Breakpoint | Behavior |
|------------|----------|
| ≥1280px | Three columns: sessions (240px), chat (flex), clinical (400px) |
| 768–1279px | Collapsed session rail; clinical panel as slide-over drawer |
| <768px | Single column chat; patient opens full-width sheet |

## Key components

| Component | Path |
|-----------|------|
| `MessageBubble` | `src/components/chat/MessageBubble.tsx` |
| `ToolRunCard` | `src/components/chat/ToolRunCard.tsx` |
| `Composer` | `src/components/chat/Composer.tsx` |
| `PatientCandidateCard` | `src/components/clinical/PatientCandidateCard.tsx` |
| `ConfirmActionCard` | `src/components/clinical/ConfirmActionCard.tsx` |
| `ClinicalPanel` | `src/components/clinical/ClinicalPanel.tsx` |

## Product spec

See the design specification in the project brief (Sections 1–12) for flows, tokens, phased delivery, and the v0/Figma prompt in Section 9.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
