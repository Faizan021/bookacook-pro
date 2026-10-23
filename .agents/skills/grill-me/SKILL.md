---
name: grill-me
description: Actively interrogate the user with clarifying questions before writing any code to uncover edge cases, business rules, and state transitions.
---

# /grill-me — The Architectural Interrogation Gate

When invoked, the agent MUST:

1. Stop all code writing or file modifications immediately.
2. Formulate 3-5 high-signal architectural questions uncovering:
   - User personas and empty/loading states
   - Edge cases (null values, race conditions, offline drops)
   - Database impact (Supabase tables, columns, RLS policies)
   - Integration boundaries (Stripe, webhooks, auth)
3. Use the `ask_question` tool to render the questions as an interactive modal.
4. Prefix the top option for each question with `(Recommended)`.
5. Synthesize the user's answers into an approved PRD saved to `docs/plans/YYYY-MM-DD-[feature]-prd.md`.
