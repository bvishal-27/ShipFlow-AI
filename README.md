# ShipFlow AI — Feature to Production

> AI-powered product delivery platform that manages the entire software delivery lifecycle.

🌐 **Live Demo:** https://ship-flow-ai-web.vercel.app
📦 **GitHub:** https://github.com/bvishal-27/ShipFlow-AI

---

## Project Overview

ShipFlow AI helps software teams move features from idea to production through a structured, AI-assisted workflow.       Feature Request → AI Clarifies → PRD Generated → Tasks Created → PR Tracked → AI Reviews → Human Approves → Shipped     ---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| API | tRPC v11 (type-safe, monorepo) |
| Database | PostgreSQL via Neon |
| ORM | Prisma v5 |
| Auth | BetterAuth (multi-tenant) |
| AI | Groq Llama 4 Scout via Vercel AI SDK |
| GitHub | Octokit + GitHub Webhooks |
| Async | Inngest workflows |
| Billing | Razorpay |
| UI | Shadcn UI + Tailwind v4 |
| Deployment | Vercel |
| Monorepo | pnpm workspaces |

---

## Architecture    shipflow-ai/
├── apps/
│   └── web/          # Next.js app + API routes
│       └── src/inngest/   # Inngest client + functions
├── packages/
│   ├── db/           # Prisma schema + client
│   ├── trpc/         # tRPC routers
│   └── ai/           # AI utilities    ---

## Setup Instructions

### 1. Clone and install

```bash
git clone https://github.com/bvishal-27/ShipFlow-AI.git
cd ShipFlow-AI
pnpm install
```

### 2. Environment variables

Create `apps/web/.env`:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_WEBHOOK_SECRET=your-webhook-secret
GROQ_API_KEY=your-groq-key
INNGEST_EVENT_KEY=your-inngest-event-key
INNGEST_SIGNING_KEY=your-inngest-signing-key
```

Create `packages/db/.env`:

```env
DATABASE_URL=postgresql://...
```

### 3. Database setup

```bash
cd packages/db && pnpm db:push
```

### 4. Run locally

```bash
pnpm --filter web dev
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret for auth sessions |
| `NEXT_PUBLIC_APP_URL` | App base URL |
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `GITHUB_WEBHOOK_SECRET` | Webhook signature secret |
| `GROQ_API_KEY` | Groq API key for AI features |
| `INNGEST_EVENT_KEY` | Inngest event key for async workflows |
| `INNGEST_SIGNING_KEY` | Inngest signing key for request verification |

---

## Database Schema   Workspace → Project → FeatureRequest
├── Clarification
├── PRD
├── Task
└── PullRequest
├── AIReview
└── HumanApproval   Full schema: `packages/db/prisma/schema.prisma`

---

## GitHub Integration Setup

1. Create GitHub OAuth App → callback: `{APP_URL}/api/auth/callback/github`
2. Generate Personal Access Token with `repo` + `admin:repo_hook` scopes
3. Connect repo inside ShipFlow → project → GitHub settings
4. Add webhook in GitHub repo:
   - URL: `{APP_URL}/api/github/webhook`
   - Content type: `application/json`
   - Secret: your `GITHUB_WEBHOOK_SECRET`
   - Events: Pull requests

---

## Inngest Workflow Explanation

Long-running AI operations run as durable, step-based Inngest functions (`apps/web/src/inngest/functions.ts`), registered at `apps/web/src/app/api/inngest/route.ts`:

| Function | Event Trigger | Description |
|---|---|---|
| `generatePRD` | `shipflow/prd.generate` | Fetches feature + clarifications, calls Groq to produce a structured 7-section PRD, persists it, updates feature status to `PRD_READY` |
| `generateTasks` | `shipflow/tasks.generate` | Reads the PRD, generates 5-8 prioritized engineering tasks via Groq, saves them to the Kanban board, updates status to `READY_FOR_DEV` |
| `runAIReview` | `shipflow/review.run` | Fetches the PR diff via Octokit, checks it against PRD acceptance criteria using Groq, saves blocking/non-blocking issues, posts a review comment on GitHub, updates feature status to `REVIEW_PASSED` or `FIX_NEEDED` |

Each function is broken into discrete `step.run()` calls, so Inngest automatically retries failed steps without re-running the whole workflow, and the entire execution history is visible in the Inngest dashboard.

---

## AI Features

All AI powered by **Groq Llama 4 Scout** via AI SDK with structured outputs:

| Feature | Description |
|---|---|
| Clarification Agent | Asks 2-3 targeted questions before writing PRD |
| PRD Generator | Creates 7-section PRD (problem, goals, stories, criteria, edge cases, metrics) — runs via Inngest |
| Task Generator | Breaks PRD into 5-8 prioritized engineering tasks — runs via Inngest |
| Code Review Agent | Reads real PR diff, checks acceptance criteria, posts blocking/non-blocking issues to GitHub — runs via Inngest |

---

## Built for ChaiCode Hackathon 2026
