# Hawthorne Estate Agent Toolkit

Hawthorne Estate Agent Toolkit is a premium free lead magnet for estate agents. It gives agents practical tools they can use immediately while introducing them to the Hawthorne Systems brand.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Prisma ORM
- PostgreSQL for development and production

## Features

- Email/password authentication with per-agent accounts
- Modern dashboard with tool cards and recent activity
- Property Health Score
- Viewing Feedback with search and filtering
- Commission Calculator with history
- QR Code generator with saved history
- Marketing Checklist with printable output
- Vendor Report PDF export
- Global search, profile page, settings page, and dark mode

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your environment file from the example:

```bash
copy .env.example .env
```

3. Apply the Prisma schema and seed data:

```bash
npx prisma db push
npm run prisma:seed
```

4. Start the app:

```bash
npm run dev
```

## Demo Account

- Email: `agent@hawthorne.systems`
- Password: `Password123!`

## Vercel Deployment

This app is ready for Vercel deployment.

1. Create a PostgreSQL database. Neon, Supabase, and Vercel Postgres all work.
2. Set `DATABASE_URL` and `DIRECT_URL` in Vercel to your production database connection strings.
3. Set `AUTH_SECRET` and `NEXT_PUBLIC_APP_URL` in Vercel.
4. Run the Prisma migration workflow locally, then deploy:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

5. Push the repo to GitHub and connect it to Vercel.
6. Vercel will build the app with `npm run build` and serve it automatically.

If you want to use a new database on Vercel, run `npx prisma migrate deploy` in your deployment pipeline after the schema is in place.

## Project Structure

- `src/app` - routes, layouts, API handlers, and loading states
- `src/components` - reusable UI, shell, and feature components
- `src/lib` - auth, database access, domain logic, and formatting helpers
- `prisma` - database schema and seed data

## Scripts

- `npm run dev` - start the development server
- `npm run build` - production build
- `npm run start` - run the production server
- `npm run lint` - run ESLint
- `npm run prisma:seed` - load demo data
