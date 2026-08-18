# Speisely — Antigravity Master Instruction & Agent Rules

You are working on Speisely.

Your job is not only to write code.
Your job is to protect system clarity, lightweight structure, runtime stability, and safe execution.

You must follow the rules below for every task.

---

## 1. Core Behavior

- Do not guess.
- Do not improvise architecture when project truth already exists.
- Do not reopen approved decisions unless explicitly asked by name.
- Do not treat “code written” as “task finished”.
- Prefer the smallest safe implementation that solves the real problem.
- Keep Speisely lightweight, stable, and easy to maintain.

When permanent repo docs exist, read them first:
1. `AGENTS.md` / `.agents/AGENTS.md`
2. `docs/PROJECT_TRUTH.md`
3. `docs/EDITORIAL_STYLE_GUIDE.md`
4. `docs/DECISIONS.md`
5. `docs/PERFORMANCE_RULES.md`
6. `docs/ACTIVE_WORK_NOTES.md`

If code and docs conflict:
- trust the verified codebase over stale docs,
- then report the mismatch clearly,
- then propose the minimum safe correction.

---

## 2. Lightweight Architecture Rule

Every implementation must preserve a light structure.

### Required principles
- Public pages must not pull in dashboard-only, admin-only, or partner-only code unnecessarily.
- Large route groups must use route-level splitting or lazy loading where appropriate.
- Heavy dependencies must not be added casually.
- Prefer existing utilities and platform features before adding new packages.
- Avoid overfetching, duplicate queries, and unnecessary refetches.
- Preserve good caching behavior on safe public pages.
- Keep third-party scripts off the critical render path unless truly necessary.
- Do not add complexity just because it is technically possible.

---

## 3. Second-Eye Verification Rule

For every meaningful code change, you must do a second pass before reporting success.
Act as if a second reviewer is checking your work.

### Before saying a task is complete, verify:

#### A. Build / type safety
- Run `npm run build` (or relevant build command).
- Run type-check if available.
- Check for import/export issues.
- Check for compile-time warnings that may become runtime failures.

#### B. Runtime sanity
- Check for visible runtime errors such as:
  - `is not defined`
  - undefined property access
  - broken imports
  - route render failures
  - hydration/render mismatch
  - blank section
  - infinite loading state
  - broken dashboard shell

If these exist, the task is NOT complete.

#### C. Route and UI verification
- Open/verify the affected page or route.
- Confirm it actually renders.
- Confirm loading resolves correctly.
- Confirm major UI sections appear correctly.
- Confirm no silent crash markers or broken placeholders remain.

#### D. Scope safety
- Check that unrelated areas were not disturbed.
- Especially protect: dashboard behavior, auth/session flow, storefront rendering, role boundaries, payment/Stripe logic, production stability.


### 3.1 Enforced Graph-Style Execution Pipeline (Multi-Agent Architecture)

Every code change must execute through this 5-node graph pipeline:

```
[Node 1: Planner] -> [Node 2: Worker Code] -> [Node 3: Static Scope Reviewer] -> [Node 4: Build & Smoke Verifier]
                                                    |                                         |
                                                    v (If Scope / Build Error)               v
                                                    +------------------<----------------------+
                                                                        |
                                                                (Feedback Loop back to Node 2)
```

- **Node 1 (Planner):** Map component boundaries and dependencies before touching code.
- **Node 2 (Worker):** Implement the smallest safe, low-risk change.
- **Node 3 (Static Scope Reviewer):** Execute `npm run verify:graph` to audit component function scoping (`t is not defined`, missing hooks, broken links) before building.
- **Node 4 (Verifier):** Execute `npm run build` AND `npm run smoke:test` to confirm 100% compilation and zero production crash markers.
- **Node 5 (Feedback Loop):** If Node 3 or Node 4 returns ANY error, automatically loop back to Node 2 to correct the root cause *before* presenting results to the user.

#### E. Report like a reviewer
Before closing the task, return:
1. what changed,
2. what was tested,
3. what passed,
4. remaining risk,
5. whether it is safe for production or needs more review.

---

## 4. Review-First Workflow

For major or non-trivial tasks:
1. Goal
2. Exact files/components likely affected
3. Risks
4. Acceptance criteria
5. Visible UI or system outcome

Then implement.
Then verify.
Then report.

---

## 5. Safe-Change Rule

Prefer low-risk changes first.
If a task touches auth, payments, routing structure, role logic, production data flow, RLS/database structure, or shared dashboard layout:
- avoid unnecessary rewrites,
- choose the smallest safe change that solves the problem.

If a structural rewrite is proposed, explain why a smaller fix is not enough, the risk introduced, how rollback works, and how behavior will be verified.

---

## 6. Documentation Discipline

Use files, not chat memory, as the source of truth.
Permanent rules belong in:
- `AGENTS.md` / `.agents/AGENTS.md`
- `docs/PROJECT_TRUTH.md`
- `docs/EDITORIAL_STYLE_GUIDE.md`
- `docs/DECISIONS.md`
- `docs/PERFORMANCE_RULES.md`

Temporary sprint state belongs in:
- `docs/ACTIVE_WORK_NOTES.md`

If you learn something important during implementation:
- update the right document,
- do not leave critical truth trapped only inside chat.

---

## 7. Lightweight Frontend Rules

When working on UI/frontend:
- Use responsive images where relevant (`picture`, `srcset`, `sizes`) instead of forcing oversized media on every device.
- Keep analytics and monitoring lazy/off critical path unless essential.
- Preserve cache headers and CDN behavior intentionally on public content.
- Avoid importing large libraries globally when route-scoped loading is enough.
- Do not create heavy UI abstraction for a simple page need.
- Prefer stable rendering over brittle implementation.
- Prevent layout shifts by reserving space for dynamic content and media.

---

## 8. Definition of Done

A Speisely task is only “done” when all of the following are true:
- Code is implemented.
- Build/type checks pass.
- The affected route/page renders correctly.
- No obvious runtime error remains.
- No major unrelated area was disturbed.
- Risk is clearly stated.
- The result is lightweight enough for the project standard.
- The report explains what changed and what was verified.
