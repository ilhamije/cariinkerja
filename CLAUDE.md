# Begawi Development Guide

## Project Overview
Job matching platform where candidates sign up, share their profile, and get matched with curated roles by a human team.

## Key Architecture Decisions

### Database: PostgreSQL (Supabase)
- Migrated from SQLite (May 2026) for Vercel compatibility
- Using Prisma ORM for type-safe queries
- Connection via Supabase shared PostgreSQL instance

### Authentication: NextAuth.js v5
- OAuth providers: Google, LinkedIn
- JWT session strategy
- LinkedIn profile URL auto-captured on sign-in

### Frontend: Next.js App Router
- Server-side rendering for SEO
- Server actions for form submissions
- TailwindCSS with custom UI components

## Recent Changes (May 12, 2026)

### 1. Database Migration
- **What**: SQLite → PostgreSQL via Supabase
- **Why**: Vercel filesystem is ephemeral; SQLite data doesn't persist
- **Files Changed**: `prisma/schema.prisma`, `.env.local`, `package.json`
- **Build Fixes**: Added `postinstall` and updated `build` script for Prisma client generation

### 2. LinkedIn Auto-Population
- **What**: LinkedIn profile URL now auto-stored when users sign in
- **How**: 
  - `LinkedIn` provider extracts `public_profile_url` or `profile_url`
  - `jwt` callback saves URL to database on token creation
- **File**: `lib/auth.config.ts`
- **Note**: Users can still manually update their LinkedIn URL in profile form

### 3. Public Jobs Search
- **What**: Added search/filter to `/jobs` page matching admin capabilities
- **Features**:
  - Search by title or company
  - Real-time filtering with URL params
  - Clear filters button
- **Files**: 
  - `components/jobs/JobsFilter.tsx` (new)
  - `app/(public)/jobs/page.tsx`

### 4. Mobile UI Improvement
- **What**: Fixed text wrapping for hero heading
- **Change**: "just for you" now appears on new line on mobile
- **File**: `app/(public)/page.tsx`

## Common Tasks

### Database Migrations
```bash
# Create new migration
npx prisma migrate dev --name "description"

# Deploy migrations to production
npx prisma migrate deploy

# View database UI
npx prisma studio
```

### Adding New Pages
1. Create in appropriate route group: `app/(public)/`, `app/(auth)/`, or `app/admin/`
2. Use `await auth()` to check authentication
3. Use `await prisma.model.findMany()` for queries
4. Add route protection in `lib/auth.config.ts` if needed

### Form Handling
- Use Server Actions in `lib/actions/`
- All forms use `FormData` with named inputs
- Return `{ message: string }` for feedback

### Authentication Flow
- Sign in → `/subscribe` (redirect from auth.config)
- OAuth callback → NextAuth handles automatically
- After sign in → `/profile` (set in subscribe page form)
- Protected routes checked in `authorized` callback

## Environment Setup

### Local Development
```bash
npm install
# Update .env.local with Supabase DATABASE_URL
npx prisma migrate deploy
npm run dev
```

### Production (Vercel)
- Add all env vars in Vercel dashboard
- Build script automatically runs Prisma generation
- Migrations run automatically on first deploy

## Known Limitations & TODOs

- [ ] Email notifications not fully integrated (Resend API configured but not used everywhere)
- [ ] CV uploads to Supabase configured but not all flows wired up
- [ ] Admin password only for dev - should use proper password reset in production
- [ ] Match algorithm is placeholder - needs real implementation
- [ ] Rate limiting not implemented
- [ ] Error boundaries not comprehensive

## Code Style

- **No unnecessary comments**: Self-explanatory code is preferred
- **Responsive design first**: Mobile-first with Tailwind breakpoints
- **TypeScript everywhere**: Full type safety
- **Minimal abstractions**: Three similar lines > premature abstraction
- **Server-first**: Prefer server components and actions over client-side logic

## Testing

Currently no automated tests. For production:
- Add unit tests for critical functions
- Add E2E tests for auth flows and job matching
- Add integration tests for database operations

## Next Steps for Deployment

1. Get Supabase connection string
2. Update `.env.local` with DATABASE_URL
3. Run `npx prisma migrate deploy`
4. Test locally with `npm run dev`
5. Push to GitHub
6. Set environment variables in Vercel
7. Deploy

## Questions?

Refer to:
- Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs
- NextAuth.js docs: https://next-auth.js.org
- Supabase docs: https://supabase.com/docs
