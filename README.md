# JobsFinder

A job board app: browse jobs, post jobs (companies), apply (job seekers). Built with Next.js, TypeScript, Prisma, Stripe, and NextAuth.

## Run locally

1. **Install**

   ```bash
   pnpm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set:

   - `DATABASE_URL` – PostgreSQL connection string
   - `AUTH_SECRET` – NextAuth secret (e.g. `openssl rand -base64 32`)
   - `NEXT_PUBLIC_URL` – e.g. `http://localhost:3000`
   - Stripe, UploadThing, Resend, Arcjet keys (see `.env.example`)

3. **Database**

   ```bash
   pnpm prisma generate
   pnpm prisma db push
   pnpm prisma db seed   # optional: seed Apple & Netflix jobs
   ```

4. **Dev server**

   ```bash
   pnpm dev
   ```

   App: [http://localhost:3000](http://localhost:3000)

## Scripts

- `pnpm dev` – start dev server (port 3000)
- `pnpm build` – production build
- `pnpm start` – run production server
- `pnpm lint` – run ESLint
- `pnpm type-check` – run TypeScript check
- `pnpm db:seed` – seed database (Apple & Netflix jobs)

## Project layout

- `app/` – Next.js App Router (pages, layouts, API routes)
- `components/` – React components (forms, UI, general)
- `lib/` – shared code (env, errors, logger, Prisma client)
- `prisma/` – schema and seed
