# MSG Class of 2012 Alumni Portal

A premium, mobile-first alumni platform built with Next.js, TypeScript, and MongoDB.

## Start locally

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

The public experience runs without a database using presentation data. Set `MONGODB_URI` to enable server-side persistence as API and authentication workflows are connected.

## Routes

- `/` — public home
- `/members` — searchable directory
- `/announcements` — official news
- `/events` — reunions and gatherings
- `/register` and `/login` — member onboarding
- `/admin` — administrator overview
- `/api/health` — service health check

The original project brief and delivery roadmap remain in `plan.md`.
