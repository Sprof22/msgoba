# Mount Saint Gabriel's Secondary School — Class of 2012 Alumni Platform

## 1. Product vision

Build a secure, mobile-first website for the Mount Saint Gabriel's Secondary School (MSG), Makurdi, Class of 2012. It should preserve the set's history, help classmates find and contact one another, publish trusted information, promote events and welfare initiatives, and provide controlled advertising/sponsorship opportunities.

The visual identity should draw from the school uniform: navy blue, white, and restrained accent colours taken from the approved school crest. The school motto, **“In God Our Strength,”** may be included after the alumni leadership confirms its use.

Working product name: **MSG Class of 2012 Alumni Portal**. The final name, domain, logo treatment, and relationship to the school/MSGOBA must be approved before launch.

## 2. Information and decisions needed from the 2012 set

### Identity and ownership

- Final website name and preferred domain names.
- Name of the person or registered association that will own the domain, hosting, database, and third-party accounts.
- Written approval to use the school name, crest/badge, motto, photographs, and alumni branding.
- Official high-resolution badge, preferably SVG or transparent PNG. An online copy can guide early mockups but should not be treated as the final licensed asset.
- Names and contact details of the project approvers and the person with final sign-off.
- Whether the site represents only the 2012 set or may later support other graduating sets.

### Membership and biodata

- Authoritative class list: full names, nicknames used in school, house, class arm, admission/graduation year, and any available identifiers.
- Rule for deciding who is a genuine member of the 2012 set.
- Initial profile fields to collect. Recommended fields are listed in section 5.
- Which fields are mandatory, optional, private, members-only, or public.
- Whether deceased classmates should have memorial profiles and who may approve them.
- Whether spouses, teachers, honorary members, or school officials can have accounts.
- Consent wording for collecting, displaying, correcting, exporting, and deleting personal data.
- A process for members who do not want to appear on the platform.

### Content

- Set history and “About Us” copy.
- Executive/committee list, roles, tenure dates, portraits, and short biographies.
- School-day photographs, reunion photographs, videos, yearbook pages, and captions.
- Known events, projects, donations, achievements, and memorial information.
- Contact email, phone/WhatsApp number, social links, and physical address if applicable.
- Announcement categories and who can publish each category.
- Launch announcement and at least 3–5 pieces of starter content so the site does not launch empty.

### Governance and moderation

- Roles: suggested roles are Super Admin, Administrator, Editor, Treasurer/Welfare Officer, Moderator, Verified Member, and Visitor.
- Who may approve new accounts and profile changes.
- Who may post announcements, events, gallery items, adverts, and financial updates.
- Content/reporting policy and disciplinary process for misuse.
- Data retention, profile deletion, account suspension, and memorialisation rules.
- Emergency owner access and handover process when executives change.

### Advertising and money

- Whether adverts are paid, complimentary, or both.
- Accepted advertisers and prohibited categories.
- Advert sizes/placements, duration, pricing, approval workflow, and refund policy.
- Whether members receive a discount.
- Whether payments/donations/dues are in the first release or a later phase.
- Payment provider and settlement account if payments are included (for example, Paystack or Flutterwave, subject to approval).
- Whether the public can see sponsors, donors, amounts, or only project totals.

## 3. Recommended scope

### Minimum viable product (MVP)

1. Public home page with set identity, introduction, selected statistics, current announcements, upcoming events, and sponsors.
2. Secure sign-up/sign-in, email verification, password reset, and administrator approval.
3. Member directory with search and filters.
4. Individual member profiles with privacy controls.
5. Announcements/news with drafts, scheduling, categories, expiry, and featured posts.
6. Events and reunions with date, venue/map link, contact, RSVP, and attendance status.
7. Photo gallery with albums, captions, dates, and moderation.
8. Executive/committee page.
9. Contact form and report-content function.
10. Admin dashboard for members, content, adverts, media, and basic site settings.
11. Sponsor/advert placements managed by administrators.
12. Audit log for important administrative changes.

### Phase 2

- Dues, donations, reunion tickets, project fundraising, receipts, and transaction reconciliation.
- Welfare requests with tightly restricted access.
- Birthday/anniversary reminders, optional and consent-based.
- Email, SMS, WhatsApp, or push notifications.
- Polls and elections with eligibility and audit controls.
- Job/business directory and member-to-member opportunities.
- Memorial wall.
- Downloadable yearbook or digital archive.
- Member data export, committee reports, and richer analytics.

### Not recommended for the first release

- Open public comments or a social-media-style feed.
- Direct messaging between members.
- Storing card details.
- Publishing phone numbers, home addresses, birthdays, family details, or financial records by default.
- Automatic acceptance of profiles without verification.

These add substantial moderation, privacy, or security work and can be introduced after the core platform is stable.

## 4. Users and permissions

| Role | Main permissions |
| --- | --- |
| Visitor | View approved public pages, announcements, events, and sponsors |
| Pending member | Complete onboarding and await verification |
| Verified member | View members-only directory, manage own profile/privacy, RSVP, submit corrections/media |
| Editor | Draft and edit approved content; no user or security management |
| Moderator | Review submitted profiles, reports, and media |
| Treasurer/Welfare Officer | Access only the finance/welfare areas explicitly assigned |
| Administrator | Manage members, content, events, adverts, and settings |
| Super Admin | Manage roles, critical configuration, ownership, and security controls |

Permissions should be capability-based; a title alone should not grant access to unrelated sensitive data.

## 5. Biodata and privacy design

### Recommended profile fields

- Full name and school-era name/nickname.
- Profile photograph.
- House and class arm.
- Years attended and graduation year (fixed to 2012 for verified members).
- Current city, state/region, and country — not a precise home address.
- Occupation, industry, employer (optional), professional summary, skills, and business details.
- Education after MSG and notable achievements.
- Email, phone, WhatsApp, website, and social links, each with a separate visibility setting.
- Birthday without birth year, optional and hidden by default.
- Short biography, interests, and “memories from MSG.”
- Committee role and service dates, where applicable.
- Account verification status, profile completeness, and last update date.

### Visibility levels

Each sensitive field should support: **Only me**, **Administrators**, **Verified 2012 members**, or **Public**. Safe defaults should be conservative: contact details hidden; general biography and profession visible to verified members; nothing public until the member explicitly agrees.

### Privacy requirements

- Clear consent during registration and whenever public visibility is enabled.
- Ability to preview a profile as the public and as another member.
- Self-service correction and account/data deletion request.
- Administrative export only for authorised purposes, with audit logging.
- No selling or sharing the membership list with advertisers.
- Privacy notice, terms of use, cookie notice, and contact route for data requests.
- Legal/privacy review before launch, particularly for Nigerian data-protection obligations and any members living abroad.

## 6. Feature details

### Announcements

- Title, slug, summary, rich body, cover image, author, category, audience, publish date, expiry date, attachments, and status.
- Public, members-only, or role-restricted audience.
- Draft, review, scheduled, published, archived states.
- Pinned/featured notices and optional notification delivery.
- View counts are optional; read receipts should only be used for notices where they are genuinely needed.

### Events

- Title, description, start/end time, timezone, venue, map link, organiser, capacity, dress code, agenda, and contact.
- Public or members-only visibility.
- RSVP options, guest allowance, attendance export, and reminders.
- Ticketing/payment can be added in Phase 2.

### Gallery

- Albums, event association, photographer/source, date, captions, people tags with consent, and visibility.
- Image compression, responsive sizes, lazy loading, and removal/reporting workflow.
- Media stored in object/cloud storage, not directly inside MongoDB.

### Advertising and sponsorship

- Advertiser/sponsor profile, logo, artwork, destination URL, contact, placement, start/end dates, status, and impression/click totals.
- Draft → review → approved → active → expired/rejected workflow.
- Clearly label paid placements as “Advertisement” or “Sponsored.”
- Validate links and uploaded files; prevent executable uploads.
- Avoid intrusive pop-ups and behavioural tracking in the MVP.
- Start with manually approved adverts and offline invoicing; add self-service purchase only after pricing, finance, and refund procedures are settled.

### Admin dashboard

- Member approval queue and duplicate detection.
- Profile/content moderation and reported-content queue.
- Announcement, event, gallery, executive, sponsor, and advert management.
- Role/permission administration with extra confirmation for sensitive actions.
- Audit history, CSV exports, backups status, and basic activity summaries.
- Site settings: contact details, social links, navigation, homepage sections, and emergency announcement banner.

## 7. Technical architecture

### Core stack

- **Frontend/full-stack framework:** Next.js with TypeScript and the App Router.
- **Database:** MongoDB Atlas production cluster.
- **Database access:** Mongoose or the official MongoDB driver; choose one and use it consistently. Mongoose is recommended for explicit schemas and validation.
- **Authentication:** Auth.js or a managed identity provider. Credentials must be hashed with a modern password-hashing algorithm; secure session cookies and email verification are required.
- **Styling:** Tailwind CSS with an accessible component system and a custom MSG 2012 theme.
- **Forms/validation:** React Hook Form plus Zod, with validation repeated on the server.
- **Media:** Cloudinary or S3-compatible object storage with transformations and signed upload controls.
- **Email:** Resend, Postmark, or another transactional provider using the set's verified domain.
- **Deployment:** Vercel for the Next.js application, MongoDB Atlas for data, and managed object storage for media.
- **Monitoring:** error tracking, uptime checks, structured server logs, and privacy-respecting analytics.

Final vendors depend on budget, account ownership, Nigeria support, and preferred payment method.

### Application shape

- Public route group: home, about, executives, announcements, events, gallery, sponsors, contact, privacy, and terms.
- Authentication route group: sign-up, sign-in, verification, password reset, and onboarding.
- Members route group: directory, profiles, RSVP, settings, and submissions.
- Admin route group: dashboard and all approval/management workflows.
- Server-side authorisation on every protected read and write. Hiding a button in the browser is not access control.
- Route handlers/server actions for application operations, with a documented API boundary for possible future mobile clients.

### Suggested MongoDB collections

| Collection | Purpose |
| --- | --- |
| users | Login identity, status, roles, verification, and security metadata |
| memberProfiles | Biodata, school details, professional details, and per-field privacy settings |
| invitations | Optional controlled invitations and expiry |
| announcements | News, notices, scheduling, audience, and publication state |
| events | Event details, organisers, visibility, and capacity |
| rsvps | Member/event response and guest count |
| albums | Gallery groupings and visibility |
| media | Asset metadata, owner, consent/source, storage key, and moderation state |
| committees | Executive bodies, positions, and tenure |
| advertisers | Sponsor/advertiser identity and contact information |
| adverts | Creative, link, placement, schedule, approval, and aggregate metrics |
| contactMessages | Contact submissions and resolution status |
| reports | Reported profiles/content and moderation outcomes |
| notifications | In-app/email delivery records and status |
| auditLogs | Actor, action, target, timestamp, and safe change metadata |
| siteSettings | Controlled editable site configuration |
| payments | Phase 2 payment references and status; never raw card details |

Indexes should cover unique email, unique member identifier where available, slugs, publication dates, member search fields, event dates, advert schedules, and audit timestamps. Searchable member data must respect visibility rules before results are returned.

## 8. Security, reliability, and quality requirements

- HTTPS everywhere; secure, HTTP-only, same-site cookies.
- Server-side role and ownership checks for every protected operation.
- Rate limiting for authentication, contact, search, upload, and admin endpoints.
- CSRF protection where applicable, strong content security policy, safe headers, and strict input validation.
- File type, file size, and image dimension limits; malware scanning where practical.
- No secrets committed to the repository. Separate local, preview, and production environments.
- Database backups with a documented restoration test, not just backup creation.
- Audit logs for sign-in security events, approvals, role changes, exports, deletions, financial actions, and advert changes.
- Optional two-factor authentication initially; required for Super Admins before money or highly sensitive welfare records are introduced.
- Accessibility target: keyboard support, strong contrast, visible focus states, alt text, labelled forms, and reduced-motion support.
- Performance target: responsive images, caching, pagination, and good experience on lower-bandwidth mobile connections.
- Automated unit/integration tests for permissions, privacy filtering, validation, and core workflows; end-to-end tests for registration, approval, profile editing, publishing, and advert scheduling.
- Dependency updates, vulnerability monitoring, incident-response contacts, and an account-recovery procedure.

## 9. Design direction

- Navy blue as the main brand colour, white as the dominant background, and crest-derived accents used sparingly.
- Clean alumni/yearbook character rather than a generic corporate dashboard.
- Mobile-first layouts because many members will visit through phones and shared links.
- Prominent search, announcements, upcoming reunion/event, and member call-to-action.
- Use real set photography where permission exists; avoid unlicensed web images.
- Produce a small design system: colour tokens, typography, spacing, buttons, cards, form states, badges, tables, and image treatments.
- Confirm colour contrast because navy/white is strong, but any crest-derived accent may not be readable for text.

## 10. Environments, accounts, and access needed

- Git repository and named technical owners.
- Domain registrar and DNS access.
- Vercel team/project or agreed alternative.
- MongoDB Atlas organisation/project.
- Cloudinary or S3-compatible media account.
- Transactional email provider and verified sending domain.
- Error monitoring and uptime-monitoring accounts.
- Analytics account if analytics is approved.
- Payment provider business account and settlement details only when Phase 2 is authorised.
- A password manager/shared-vault process for organisational credentials; no credentials passed through ordinary chat or documents.

Every production account should be owned by the association/set, have at least two trusted recovery contacts, and document billing and handover.

## 11. Delivery plan

### Phase 0 — Discovery and governance

- Confirm owner, approvers, audience, budget, domain, launch target, and MVP boundary.
- Approve the membership verification, privacy, moderation, advert, and content policies.
- Obtain the official badge and usage permission.
- Inventory and clean the 2012 class list and starter content.
- Define measurable launch success: for example, percentage of the set verified and profiles completed.

**Exit condition:** signed-off requirements, content owner, technical owner, privacy rules, and initial data source.

### Phase 1 — UX and visual design

- Create sitemap, user flows, wireframes, profile visibility model, and admin workflows.
- Produce desktop/mobile visual designs and reusable components.
- Review with a small representative group, including administrators and ordinary members.

**Exit condition:** approved screens and no unresolved high-impact privacy or workflow questions.

### Phase 2 — Foundation

- Create Next.js/TypeScript project, environments, CI checks, theme, database connection, schemas, authentication, email, storage, logging, and access-control framework.
- Add seed data for local development without using real sensitive member data.

**Exit condition:** secure sign-in/onboarding foundation deployed to a private preview environment.

### Phase 3 — MVP implementation

- Build member onboarding, approval, directory, profiles, privacy controls, announcements, events/RSVP, gallery, committees, adverts/sponsors, contact/reporting, and admin dashboard.
- Add migrations/import tooling for the approved class list.

**Exit condition:** all MVP acceptance tests pass in preview.

### Phase 4 — Content, testing, and launch readiness

- Load approved content and invite a pilot group.
- Perform permission/privacy testing, accessibility review, mobile/browser testing, performance checks, backup restore test, and security review.
- Train administrators and document publishing, approval, recovery, and incident procedures.

**Exit condition:** launch approval, rollback plan, administrators trained, policies published, and support contact active.

### Phase 5 — Launch and care

- Launch in stages, monitor errors and registrations, handle duplicate/incorrect profiles, and gather feedback.
- Review analytics and administrative workload after 30 days.
- Prioritise Phase 2 features based on actual use rather than assumptions.

## 12. MVP acceptance criteria

- A visitor can understand what the 2012 set is and see only content approved as public.
- A genuine classmate can register, verify email, be approved, complete a profile, choose field visibility, and preview it.
- A non-member cannot access members-only biodata or discover it through search/API responses.
- An authorised editor can draft and schedule an announcement; only an authorised publisher can publish it.
- An administrator can create an event, and a verified member can RSVP.
- An administrator can schedule an approved advert, which automatically stops showing after its end date.
- Uploaded images are validated, optimised, attributed, and restricted by content visibility.
- Sensitive administrative actions are permission-checked and logged.
- Password reset, account suspension, data correction, and deletion-request workflows work end to end.
- The site is usable on common mobile screen sizes and slow connections.
- Production data is backed up and a restoration procedure has been successfully tested.

## 13. Budget headings to approve

Exact figures should be priced after the MVP and expected member/traffic volume are confirmed. Budget for:

- Product design and engineering.
- Domain registration/renewal.
- Application hosting and preview environments.
- MongoDB Atlas.
- Image/video storage and delivery.
- Transactional email and optional SMS/WhatsApp.
- Error monitoring, uptime checks, analytics, and backups.
- Content preparation, data cleanup, and photography/design.
- Privacy/legal review and security testing.
- Ongoing maintenance, support, and administrator training.
- Payment processing fees if dues/donations are added.

## 14. Immediate checklist for the alumni leadership

1. Appoint one product owner and one backup approver.
2. Confirm the MVP list and identify anything that must be added or removed.
3. Provide the official class list and explain how membership will be verified.
4. Approve the profile fields and default privacy settings.
5. Supply the official badge, written usage permission, set photos, and initial copy.
6. Name the initial administrators, editors, and moderators.
7. Decide the advert policy and whether payments are postponed to Phase 2.
8. Choose three possible domains and an organisational owner for all accounts.
9. Provide an expected budget range, target launch date, and expected number of members.
10. Approve privacy, moderation, deletion, memorial, and leadership-handover rules before real member data is imported.

## 15. Recommended first-release decisions

Unless the leadership chooses otherwise, the build should begin with these assumptions:

- Only verified Class of 2012 members can see the directory.
- Contact information is hidden by default and controlled field by field by each member.
- Profiles require administrator approval before becoming visible.
- Announcements, events, and adverts use draft/review/publish workflows.
- Adverts are manually arranged and approved; online advert purchasing is deferred.
- Payments, chat, elections, and welfare records are deferred to Phase 2.
- The public site contains selected announcements, events, history, executives, contact information, and sponsors—but no private biodata.
- The architecture leaves room for other graduating sets later without claiming that support in the MVP.

