-- PayFast payment integration migration
-- Run this in the Supabase SQL editor

-- ── Workers table: add banking details ───────────────────────────────────────
ALTER TABLE workers ADD COLUMN IF NOT EXISTS bank_name       text;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS account_number  text;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS account_type    text;  -- 'current' | 'savings'
ALTER TABLE workers ADD COLUMN IF NOT EXISTS branch_code     text;

-- ── Jobs table: add payment tracking fields ───────────────────────────────────
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'none';
  -- values: 'none' | 'pending' | 'received' | 'settled'

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS payment_id    text;
  -- PayFast payment reference (pf_payment_id)

-- ── Allow 'payment_pending' in the status column ─────────────────────────────
-- If you have a CHECK constraint on jobs.status, update it:
-- (skip this block if no constraint exists — Supabase allows any text by default)
--
-- ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_status_check;
-- ALTER TABLE jobs ADD CONSTRAINT jobs_status_check CHECK (
--   status IN (
--     'pending', 'matched', 'quoted', 'accepted',
--     'completion_requested', 'payment_pending',
--     'completed', 'disputed', 'cancelled'
--   )
-- );
