# Zenmora Co.

Editorial home decor blog built with Next.js, Prisma, and PostgreSQL.

## Stack

- Next.js App Router
- Prisma + PostgreSQL
- Server actions for admin publishing and newsletter signup
- Local password-protected admin area

## Local setup

1. Copy `.env.example` to `.env`.
2. Set `ADMIN_PASSWORD` and `SESSION_SECRET`.
3. Create a PostgreSQL database and set `DATABASE_URL`.
4. Install dependencies with `npm install`.
5. Run `npx prisma migrate dev`.
6. Seed starter content with `npm run db:seed`.
7. Start the app with `npm run dev`.

## Quality checks

- Run `npm run lint` for ESLint.
- Run `npm run typecheck` for TypeScript validation.
- A Husky pre-commit hook runs `lint-staged` against staged TS/JS files.
- GitHub Actions runs lint, typecheck, and build on pushes to `main` and on pull requests.

## Analytics

Umami tracking is supported via public environment variables.

- `NEXT_PUBLIC_UMAMI_SCRIPT_URL`: your Umami tracker script URL, for example `https://cloud.umami.is/script.js`
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`: the website ID for this site from your Umami dashboard
- `NEXT_PUBLIC_UMAMI_DOMAINS`: optional comma-separated hostnames such as `zenmora.com,www.zenmora.com`

If the script URL and website ID are set, the tracker is injected automatically through the app layout.

## Deployment

Recommended production setup:

- Host the app on Vercel
- Use managed PostgreSQL such as Neon or Supabase
- Set `DATABASE_URL`, `DIRECT_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, and the Umami variables in Vercel project settings

For Neon:

- `DATABASE_URL` should use the pooled connection string for the app runtime
- `DIRECT_URL` should use the direct non-pooled connection string for Prisma migrations

After updating environment variables on Vercel, trigger a new deployment so Prisma can read the new values during build.

## Admin

- Visit `/admin/login`
- Sign in with `ADMIN_PASSWORD`
- Edit homepage content, categories, and posts
- Set post status to `PUBLISHED` to make content live

## Git / personal account

If you want the repo connected to your personal GitHub account `leader-ke`:

1. Create a new empty repository in GitHub under `leader-ke`.
2. Run:

```bash
git init
git add .
git commit -m "Initial Zenmora site"
git branch -M main
git remote add origin git@github.com:leader-ke/<repo-name>.git
git push -u origin main
```
