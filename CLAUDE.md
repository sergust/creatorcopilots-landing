# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start development server
npm run build    # Production build (runs next-sitemap after)
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16+ with App Router (React 19+, TypeScript 5.9+)
- **Styling**: TailwindCSS 4.1+ with DaisyUI 5.0+ (CSS-first config in globals.css using `@theme`)
- **Authentication**: Clerk (via @clerk/nextjs)
- **Payments**: Stripe + Polar integration with webhooks
- **Email**: Resend for transactional emails
- **Blog**: MDX support

## Architecture

### Directory Structure
- `/app/` - Next.js App Router pages and API routes
- `/components/` - Reusable UI components
- `/libs/` - Utility libraries (stripe.ts, seo.tsx, api.ts, resend.ts, gpt.ts)
- `/types/` - TypeScript type definitions
- `/config.ts` - Central configuration (pricing plans, auth settings, theme colors)

### Key Patterns

**Configuration**: All app settings centralized in `/config.ts` using `ConfigProps` interface from `/types/config.ts`. Access via `import config from "@/config"`.

**Layout**: Root layout uses `ClerkProvider` wrapping the app. `LayoutClient` handles client-side providers (Crisp chat, toast notifications, tooltips, top loader).

**API Routes**: Located in `/app/api/`. Currently includes Stripe, Polar, and webhook handlers.

**Styling**: TailwindCSS v4 uses `@import "tailwindcss"` and `@theme` directive in CSS instead of tailwind.config.js. Use DaisyUI classes: `btn`, `btn-primary`, `card`, etc.

### Component Conventions
- Server Components by default; use "use client" only when needed
- PascalCase for component names, kebab-case for files
- Button components follow pattern in `ButtonCheckout`, `ButtonSignin` with loading states and toast notifications

## Code Style

- Use strict TypeScript with proper typing; avoid `any`
- Prefer `interface` over `type` for object definitions
- Import order: React/Next.js → third-party → components → libs → types → config
- Use Zod for runtime validation

## Commit Convention

Use Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
