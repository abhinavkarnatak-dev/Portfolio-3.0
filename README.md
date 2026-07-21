# Portfolio — Abhinav Karnatak

Personal portfolio: Next.js (App Router) · TypeScript (strict) · Tailwind CSS v4 · Motion (Framer Motion) · Nodemailer (Gmail SMTP) + React Email · Zod. Fully statically generated; the only server code is the contact-form Server Action.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

| Variable               | Purpose                                                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `GMAIL_USER`           | The Gmail address the contact form sends from                                                                                                |
| `GMAIL_APP_PASSWORD`   | A Google App Password for that account (not the regular password) — needs 2-Step Verification, then create one at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) |
| `CONTACT_TO_EMAIL`     | Address that receives contact-form messages (defaults to `GMAIL_USER` if unset)                                                              |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, no trailing slash — drives metadata, OG tags, sitemap, robots                                                              |

Without `GMAIL_USER`/`GMAIL_APP_PASSWORD` the site runs fine; the form shows a graceful error pointing at the direct email link.

## Editing content

All content lives in typed data files — components never hard-code copy:

- `src/data/site.ts` — name, hero line, status, socials, email
- `src/data/projects.ts` — project cards **and** case-study pages; a commented template at the bottom shows how to add a project (card, `/projects/[slug]` page, OG image and sitemap entry are all generated from it)
- `src/data/skills.ts` — skill groups
- `src/data/experience.ts` — work experience and education
- `src/data/types.ts` — the content models

### Before launch

Content is filled from the real resume. Set `NEXT_PUBLIC_SITE_URL` in production. To refresh the resume, overwrite `public/resume.pdf`; to swap the hero photo, overwrite `public/portrait.png`.

Architecture diagrams: drop an image in `/public` and fill in the commented `diagram` field on a project in `src/data/projects.ts`.

## Notes

- **Rate limiting** on the contact form is in-memory (3 messages / 10 min / IP) plus a honeypot — deliberate: trivial traffic, no external dependency. The limiter resets on serverless cold starts; swap Upstash Ratelimit into `src/lib/rate-limit.ts` if that ever matters.
- **Scripts:** `npm run dev` · `npm run build` · `npm run lint` · `npm run format` · `npm run typecheck`
