# Zenmora Co.

Editorial home decor blog built with Next.js, Prisma, and SQLite.

## Stack

- Next.js App Router
- Prisma + SQLite
- Server actions for admin publishing and newsletter signup
- Local password-protected admin area

## Local setup

1. Copy `.env.example` to `.env`.
2. Set `ADMIN_PASSWORD` and `SESSION_SECRET`.
3. Install dependencies with `npm install`.
4. Run `npx prisma migrate dev --name init`.
5. Seed starter content with `npm run db:seed`.
6. Start the app with `npm run dev`.

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
