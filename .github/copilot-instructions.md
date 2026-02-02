# Copilot instructions for CycleWise Trades 🚀

Purpose: Give an AI agent immediate, actionable context so it can make safe, correct code changes quickly.

## Big picture (what this repo is)
- Frontend: Vite + React + TypeScript (src/). UI uses shadcn-style components under `src/components` (see `src/components/ui/*`).
- Auth & DB: Supabase (client at `src/integrations/supabase/client.ts`, types in `src/integrations/supabase/types.ts`). Use `VITE_SUPABASE_*` env vars.
- Small backend helpers (not a single monolith): simple Express scripts in `server/`:
  - `server/propfirm-scraper.js` — Puppeteer-based scrapers for many prop firms (endpoints: `POST /api/propfirm/sync`, `POST /api/propfirm/encrypt`, `GET /api/propfirm/supported`).
  - `server/mt-api-backend.js` — lightweight MT4/MT5 connector emulator; uses `METAAPI_TOKEN` to enable live mode (endpoints: `/api/mt/*`).
  - `server/send-welcome.js` — SendGrid mail helper (POST `/send-welcome`).

## Key runtime & developer commands
- Install and run frontend: `npm i` then `npm run dev` (Vite serves on port 8080 by default).
- Build/preview locally: `npm run build` / `npm run preview` (see `vite.config.ts` for build chunking logic).
- Deploy with Vercel: import the GitHub repository (Vite preset recommended). Use Build Command: `npm run build` and Output Directory: `dist`. Set required environment variables in the Vercel project settings.
- Lint: `npm run lint` (ESLint config: `eslint.config.js`).
- Tests: `npm test` (Vitest). Note: vitest config references `./src/test/setup.ts` — that file is currently missing; tests may fail until it exists or the config is updated (see `vitest.config.ts`).
- Backend helpers are run separately with Node (not part of npm scripts):
  - `node server/propfirm-scraper.js` (requires `puppeteer`, `crypto-js`, etc.).
  - `node server/mt-api-backend.js` (uses `METAAPI_TOKEN` env to toggle live/demo).
  - `node server/send-welcome.js` (requires `SENDGRID_API_KEY` and `WELCOME_FROM_EMAIL`).

## Important environment variables and examples
- Frontend (copy `.env.example` -> `.env.local`):
  - `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (required for auth)
  - `VITE_SKIP_EMAIL_VERIFICATION=true` (dev helper)
  - `VITE_MT_API_URL` (optional; defaults to `http://localhost:3001` — used by `PropFirmConnect`)
- Backend helpers:
  - `ENCRYPTION_KEY` (used by `server/propfirm-scraper.js`) — change for production
  - `METAAPI_TOKEN` (used by `server/mt-api-backend.js`) for live MT4/MT5
  - `SENDGRID_API_KEY` and `WELCOME_FROM_EMAIL` (used by `server/send-welcome.js`)

Security note: never commit `.env.local` or secrets. The repo includes `.env`/`.env.local` during development — treat these as private.

## Project-specific conventions & patterns to follow
- Path alias: `@` maps to `./src` (see `vite.config.ts` and `vitest.config.ts`). Use `@/components/...` in imports.
- Local-only prop firm data: UI stores prop firm accounts in `localStorage` under the key `cw_propfirm_accounts` (see `src/components/PropFirmConnect.tsx` and `src/pages/PropFirmAccounts.tsx`). This is intended: backend integration is optional and syncs happen via `VITE_MT_API_URL`.
- Prop firm scrapers: `server/propfirm-scraper.js` exposes `SCRAPERS` mapping. When adding a new prop firm, add a scraper function and register its id in `PROP_FIRMS` in the UI.
- Sensitive credentials: front-end currently stores the investor password in localStorage (plaintext). There is an encrypt endpoint in `propfirm-scraper.js` — prefer encrypting before persisting if adding server-side storage.
- UI: follow the shadcn-style conventions — split small primitive components under `src/components/ui` and feature components in `src/components` and `src/pages`.
- Tests: vitest is configured to run files matching `src/**/*.{test,spec}.{ts,tsx}` and uses `jsdom`.
- ESLint rules relaxed: several `@typescript-eslint` rules are turned off (see `eslint.config.js`) — be mindful of typing but follow the repo's existing style.

## Integration points & potential gotchas
- Puppeteer & headless browsers: `server/propfirm-scraper.js` requires Puppeteer. On macOS dev machines you may need extra deps or a headless-compatible environment (CI must allow headless Chrome or use Docker).
- Supabase email templates: `src/email-templates/confirmation.html` and `.txt` are the templates to paste into the Supabase dashboard when setting up auth emails.
- Backend scripts are separate node processes — they are not started automatically by `npm run dev`.
- Vitest `setupFiles` points to `src/test/setup.ts` — create it or remove reference to avoid test failures.

## Helpful code pointers (quick links)
- Frontend entry: `src/main.tsx` and `src/App.tsx`
- Supabase client: `src/integrations/supabase/client.ts`
- Prop firm UI: `src/components/PropFirmConnect.tsx` and `src/pages/PropFirmAccounts.tsx`
- Scrapers & API: `server/propfirm-scraper.js`, `server/mt-api-backend.js`, `server/send-welcome.js`
- Email templates: `src/email-templates/confirmation.html` and `confirmation.txt`

---
If anything here is unclear or you'd like more detail in any section (for example, test setup, CI, or adding new scrapers), tell me which area to expand and I will update this file. ✅
