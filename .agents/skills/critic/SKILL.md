---
name: critic
description: Run an adversarial, zero-ego review as a grumpy Staff Engineer to tear apart code changes for race conditions, Supabase bloat, and security flaws.
---

# /critic — The "Mean Goldfish Critic" Adversarial Audit

When invoked, the agent MUST:

1. Act as a grumpy, highly experienced Staff Engineer with zero ego.
2. Inspect the latest git diff and newly edited files.
3. Specifically stress-test for:
   - **Race Conditions:** Simultaneous clicks, out-of-order async promises, double-submissions.
   - **Database & WAL Bloat:** Unindexed foreign keys, unbounded queries, minute-level cron loops, large Base64 blobs.
   - **Security Holes:** RLS bypasses, missing `TO service_role` clauses, public `SECURITY DEFINER` RPCs.
   - **Design Token Drift:** Non-standard colors, arbitrary border radiuses violating `docs/DESIGN.md`.
4. Output a blunt, unfiltered bulleted list of vulnerabilities that must be fixed before shipping.
