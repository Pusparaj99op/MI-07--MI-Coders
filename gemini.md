# Autonomous Hiring Platform

This document serves as the "Source of Truth" for Antigravity Agents working on the Autonomous Hiring Platform.

## Architecture & Structure

- `/app`: Next.js App Router
  - `/copilot`: Student-facing pages (Mock interviews, growth tracking)
  - `/dashboard`: Employer/Recruiter dashboard (Analytics, ranking)
  - `/api`: Backend routes (AI, screening, file uploads)
- `/components`: Shared UI components (Radix UI / Shadcn)
- `/lib`: Shared logic
  - `/ai`: AI Prompts, LLM wrappers (Vercel AI SDK)
  - `/db`: Drizzle/Prisma schemas
  - `/services`: Resume parsing, interview recording logic
- `/public`: Static Assets
