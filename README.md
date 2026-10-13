# Luminedge CRM Frontend

Next.js (App Router) frontend for the Luminedge CRM. Deployed on Netlify; talks to
[Lumi_CRM_Backend](https://github.com/Luminedge-Dev/Lumi_CRM_Backend) over REST.

## Requirements

- Node.js >= 20

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` — at minimum `NEXT_PUBLIC_API_URL` (the backend's REST API, including the
`/api` suffix). Everything in this file is `NEXT_PUBLIC_*`, so it's shipped to the browser as-is;
never put a secret in it.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | start the Next.js dev server |
| `npm run build` | production build (`next build`) |
| `npm start` | serve the production build (`next start`) |
| `npm run lint` | `next lint` |

## Deployment

Deployed on Netlify via `netlify.toml` (`npm install && npm run build`, publish `.next`, using
`@netlify/plugin-nextjs`). Required environment variables (set in Netlify's project settings, not
read from any committed file):

- `NEXT_PUBLIC_API_URL` — backend REST API, including `/api`
- `NEXT_PUBLIC_SOCKET_URL` — backend origin for Socket.IO; leave empty to disable realtime
  notifications (the production backend currently runs serverless on Vercel, which can't hold a
  Socket.IO connection — see the backend's README for the split-deployment fix)
- `NEXT_PUBLIC_API_BASE_URL` — the separate Luminedge booking/mock-test server (`/api/v1/*`), used
  by `components/bdm/AvailableSchedules.tsx`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — Google sign-in client ID
- `NEXT_PUBLIC_LUMINEDGE_SCHEDULES_URL` — optional override for the public schedules feed

**Montserrat is self-hosted** via `@fontsource/montserrat`, not `next/font/google`. The latter
fetches font files from Google's CDN during the build itself, and Netlify's shared build servers
intermittently block or rate-limit that request, crashing the build with a `next/font` webpack
error. Don't switch this back to `next/font/google` without confirming Netlify builds reliably
first.

## Project structure note

`pages/_app.tsx` and `pages/_document.tsx` are leftover scaffolding from before this migrated to
the App Router (`app/`) — there are no actual routes under `pages/`. Safe to ignore; not something
to add new pages to.
