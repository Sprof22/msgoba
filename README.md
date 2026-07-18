# MSG Class of 2012 Alumni Portal

A premium, mobile-first alumni platform built with Next.js, TypeScript, and MongoDB.

## Start locally

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

The public experience runs without a database using presentation data. Set `MONGODB_URI` to enable server-side persistence as API and authentication workflows are connected.

## Authentication setup

Copy `.env.example` to `.env.local` and configure `MONGODB_URI`. Set `BOOTSTRAP_ADMIN_EMAIL` before the first registration: the matching address becomes the initial verified Super Admin. Remove or change this value after the owner account has been created.

For real verification and password-reset email, add a Resend API key and a sender on a verified domain:

```bash
RESEND_API_KEY=re_...
AUTH_EMAIL_FROM=MSG Class of 2012 <hello@yourdomain.com>
```

Without Resend, development mode prints the single-use link to the terminal and displays it on the success screen. Production fails closed when email is not configured.

## Cloudinary uploads

Create a Cloudinary product environment, then add its credentials to `.env.local`:

```bash
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Restart the development server and open `/admin/media`. Images are validated to JPG, PNG, WebP, or AVIF with a 10 MB client limit, then uploaded directly from the browser using a short-lived server-generated signature. The API secret is never sent to the browser.

The signing route requires a verified session. Profile uploads are available to verified members; gallery, announcement, and advert uploads require an Administrator or Super Admin.

## Routes

- `/` — public home
- `/members` — searchable directory
- `/announcements` — official news
- `/events` — reunions and gatherings
- `/register` and `/login` — member onboarding
- `/verify-email`, `/forgot-password`, `/reset-password` — account security
- `/account/pending` — membership review status
- `/profile` and `/profile/edit` — private biodata management and visibility controls
- `/members/[id]` — privacy-filtered individual member profile
- `/admin` — administrator overview
- `/admin/members` — approve verified membership requests
- `/admin/profiles` — moderate, correct, hide, memorialise, and export profiles
- `/admin/media` — signed Cloudinary image uploader
- `/api/health` — service health check

The original project brief and delivery roadmap remain in `plan.md`.

## Member data and privacy

The member directory now reads from MongoDB and only returns approved, non-hidden profiles. Sensitive profile properties are assembled into response DTOs field by field according to their visibility setting: Only me, Administrators, Verified members, or Public. Profile updates, avatar removal, moderation changes, and directory exports create audit records.

Profile photographs upload into `msg-2012/profiles`. When a member replaces or removes a photograph, the previous Cloudinary asset is deleted and its CDN cache invalidated.

## Announcements, events, and RSVPs

Editors can create drafts and submit content for review. Administrators can publish, schedule, cancel, complete, archive, export attendance, and target public, member, or administrator audiences.

- `/admin/announcements` — announcement editorial workflow
- `/admin/events` — event and attendance management
- `/announcements/[slug]` — published announcement
- `/events/[slug]` — event details, RSVP, guests, and calendar download

Publishing creates an auditable notification job in MongoDB. A delivery worker can later process these jobs through Resend without blocking the publishing request.
