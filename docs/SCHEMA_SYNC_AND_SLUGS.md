# Speisely Architecture: Schema Sync & Conventions

This document outlines key technical conventions for URL state, routing, and database schema synchronization.

## 1. Event Manager & Planner Slug Conventions
The Speisely marketplace utilizes human-readable slugs for discoverability and SEO (e.g., `/planner/berlin-hochzeit`). 
- **Format**: `[city]-[event-type]` (e.g. `berlin-hochzeit`)
- **Language**: German, strictly hyphenated and lowercase.
- **Routing**: Handled by TanStack Router via path parameters (`$slug`). 
- **Database Lookup**: Queries to `getPublicPlannerProfileFn` should match using `slug.eq.[value]` falling back to `id.eq.[value]`. This ensures backwards compatibility with older UUID-based records while preferring semantic URLs.

## 2. Schema-Sync and Type Generation Process
Our application strictly enforces database type safety via Supabase's auto-generated types.

### Local Development
To sync the local database schema and regenerate the TypeScript types:
1. Ensure Docker is running.
2. Run `supabase start` to initialize the local Supabase container.
3. Apply any migrations via `supabase db push`.
4. Run the type generator: 
   ```bash
   npx supabase gen types typescript --local > src/integrations/supabase/types.ts
   ```
5. Ensure there are no intermediate shim files (like `database.types.ts`). Code must import directly from `types.ts`.

### CI Hardening
A GitHub Action (`.github/workflows/supabase-types.yml`) is set up to prevent type drift in the `main` branch. 
- It uses the Supabase CLI to start an ephemeral local database from committed migrations.
- It generates the types based on that database.
- It runs `git diff --exit-code` on `src/integrations/supabase/types.ts`.
- If the developer modified a migration but forgot to regenerate and commit `types.ts`, the CI step fails.
