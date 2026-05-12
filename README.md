# Begawi - Job Matching Platform

A curated job matching platform built with Next.js, where a human team reviews candidate profiles and personally matches them to relevant roles.

## Features

### User Features
- **Social Sign-in**: Login with Google or LinkedIn
- **Profile Management**: Upload CV, share LinkedIn profile, set job preferences
- **Job Discovery**: Browse and search curated job openings
- **Job Matching**: Automated matching algorithm pairs candidates with relevant roles

### Admin Features
- **Job Management**: Create, edit, and manage job postings
- **Candidate Management**: View candidate profiles and match them with jobs
- **Search & Filters**: Advanced search and filtering for jobs and candidates

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: NextAuth.js with OAuth (Google, LinkedIn)
- **File Storage**: Supabase Storage (for CV uploads)
- **Email**: Resend (for notifications)

## Setup & Installation

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local` with:

```env
# Database - Get from Supabase Dashboard > Settings > Database > Connection String
DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3001"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
LINKEDIN_CLIENT_ID=""
LINKEDIN_CLIENT_SECRET=""

# Supabase
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

# Email Service
RESEND_API_KEY=""
RESEND_FROM=""

# Admin Access
ADMIN_EMAILS="your.email@example.com"
ADMIN_PASSWORD="your-password"
```

### 3. Set Up Database

```bash
# Run migrations to create tables
npx prisma migrate deploy

# (Optional) Seed database
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Key Pages

- `/` - Landing page
- `/subscribe` - Sign up / Login with OAuth
- `/jobs` - Browse and search job listings
- `/profile` - User profile management
- `/dashboard` - Candidate dashboard
- `/admin` - Admin panel for job and candidate management

## Recent Updates (2026-05-12)

### Database Migration
- **Changed**: SQLite → PostgreSQL (Supabase)
- **Why**: SQLite doesn't work in Vercel (filesystem is ephemeral). PostgreSQL is production-ready.
- **Action Required**: Update `.env.local` with your Supabase connection string and run `npx prisma migrate deploy`

### LinkedIn Profile Auto-Population
- LinkedIn profile URL is now automatically captured when users sign in
- Pre-populates the LinkedIn URL field in the profile form
- Users can still manually edit their LinkedIn profile URL

### Public Jobs Search
- Added search functionality to `/jobs` page
- Search by job title or company (same as admin)
- Matches admin page capabilities

### Mobile UI Fix
- Fixed text wrapping for "just for you" heading on mobile devices
- Better responsive layout on small screens

### Build Pipeline
- Added `postinstall` script for Prisma client generation
- Fixed Vercel build errors

## Deployment

### To Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy - `npm run build` will automatically run migrations

### Environment Variables for Production

```env
DATABASE_URL=postgresql://...  # Your Supabase connection string
NEXTAUTH_SECRET=<generate-new-secret>
NEXTAUTH_URL=https://your-domain.com
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
RESEND_FROM=...
ADMIN_EMAILS=your.email@example.com
ADMIN_PASSWORD=...
```

## Project Structure

```
myapp/
├── app/                    # Next.js app routes
│   ├── (public)/          # Public pages
│   ├── (auth)/            # Protected routes
│   └── admin/             # Admin panel
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── candidates/       # Candidate components
│   ├── jobs/             # Job components
│   └── ui/               # UI components
├── lib/                  # Utilities & services
│   ├── actions/          # Server actions
│   ├── auth.ts           # NextAuth config
│   └── prisma.ts         # Prisma client
├── prisma/               # Database schema
└── public/               # Static assets
```

## Development Notes

- Uses Prisma for database ORM
- Server-side rendering with Next.js App Router
- TailwindCSS for styling with custom components
- NextAuth.js for authentication
- Form handling with server actions

## Support

For issues or questions, check the GitHub repository or contact the development team.
