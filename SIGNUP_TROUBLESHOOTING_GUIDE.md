# BookaCook Signup Diagnostics & Fixes

## IMMEDIATE ACTION REQUIRED

### Step 1: Run Diagnostics in Supabase SQL Editor

1. Go to: **Supabase Dashboard → Your Project → SQL Editor**
2. Click **"New Query"**
3. Open the file `SUPABASE_DIAGNOSTICS.sql` in this repository
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **"Run"**
7. **Screenshot the output** and save it

### Step 2: Interpret the Results

After running, look for:

| Issue | What You'll See | What it Means |
|-------|-----------------|--------------|
| **Trigger Missing** | Section 1 returns no rows | `on_auth_user_created` trigger was never created |
| **Function Missing** | Section 1 shows no `handle_new_user` | Function doesn't exist in database |
| **Schema Mismatch** | Section 2 missing `full_name` or `phone` | Migration 001 wasn't applied |
| **RLS Blocking** | Section 3 shows policies | Policies might be blocking the trigger |
| **Insert Fails** | Section 5 shows an error message | **COPY THIS ERROR** - it's the root cause |
| **Auth Users Exist** | Section 6 shows count > 0 | Users ARE being created, but profiles aren't |

### Step 3: If Auth Users Exist but Profiles Don't

Run this to see which users failed to get profiles:

```sql
SELECT u.id, u.email, p.id as profile_exists
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
```

These are the users where profile creation failed. The trigger never ran properly for them.

### Step 4: Check Recent Postgres Logs

Go to: **Supabase Dashboard → Logs → Postgres Logs**
- Filter by **last 1 hour**
- Search for **ERROR**
- Look for errors with timestamps matching your signup attempts

**Copy the exact error message** - examples:
- `ERROR: null value in column "role" violates not-null constraint`
- `ERROR: column "full_name" of relation "profiles" does not exist`  
- `ERROR: permission denied for relation profiles`

## COMMON FIXES

### Fix 1: Migrations Never Applied

If diagnostics show the trigger doesn't exist:

```sql
-- Run Migration 001 first
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT;

-- Then run Migration 005
-- (copy the full migration from supabase/migrations/005_caterer_signup_trigger.sql)
```

### Fix 2: RLS Blocking the Trigger

If Section 3 shows policies, run this to add a policy allowing the trigger:

```sql
-- Allow unauthenticated inserts from the trigger function only
CREATE POLICY "Allow trigger to insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (true);
```

### Fix 3: Column Constraint Issues

If Section 5 fails with "not-null constraint", check what columns are NOT NULL:

```sql
SELECT column_name, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' AND is_nullable = 'NO';
```

If you see columns like `email`, `created_at`, or `updated_at` that are NOT NULL but not populated by the trigger, either:
- **Option A**: Make them nullable: `ALTER TABLE profiles ALTER COLUMN email DROP NOT NULL;`
- **Option B**: Add them to the trigger function

### Fix 4: Confirm Production has Migrations

If development works but production doesn't, the migrations weren't applied to production. Go to:
**Supabase Dashboard → Migrations → (check if 001-005 are marked as applied)**

If not applied: Click them in order (001, then 002, ... then 005)

## Verification After Fixes

After applying any fixes, run the diagnostics again, then test signup:

1. Open your app at https://bookacook-pro-git-main-ahmadfaizan01-3720s-projects.vercel.app/signup/customer
2. Fill in form with test email
3. Submit
4. Check results:
   - **Expected**: "Success! Your account was created..."
   - **Still error**: Go to browser DevTools → Console, screenshot any red errors, and share them

## STILL STUCK?

When you contact support, provide:

1. **Diagnostics output** (screenshot of SQL results)
2. **Postgres logs** (copy of any ERROR messages)
3. **Browser console error** (if signup still fails)
4. **Deployment URL tested**: https://bookacook-pro-git-main-ahmadfaizan01-3720s-projects.vercel.app/signup/customer
5. **Test email used**: (the email you tried to sign up with)

---

Last Updated: April 7, 2026
