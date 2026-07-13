# MSG Class of 2012 Alumni Portal

A premium, mobile-first alumni platform built with Next.js, TypeScript, and MongoDB.

## Start locally

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

The public experience runs without a database using presentation data. Set `MONGODB_URI` to enable server-side persistence as API and authentication workflows are connected.

## Cloudinary uploads

Create a Cloudinary product environment, then add its credentials to `.env.local`:

```bash
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Restart the development server and open `/admin/media`. Images are validated to JPG, PNG, WebP, or AVIF with a 10 MB client limit, then uploaded directly from the browser using a short-lived server-generated signature. The API secret is never sent to the browser.

The signing route intentionally refuses production requests until authentication is connected. Replace its development guard with a verified administrator/member session check before launch.

## Routes

- `/` — public home
- `/members` — searchable directory
- `/announcements` — official news
- `/events` — reunions and gatherings
- `/register` and `/login` — member onboarding
- `/admin` — administrator overview
- `/admin/media` — signed Cloudinary image uploader
- `/api/health` — service health check

The original project brief and delivery roadmap remain in `plan.md`.
