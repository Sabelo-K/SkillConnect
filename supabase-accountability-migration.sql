-- SkillConnect Accountability System Migration
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New Query)
-- Safe to run multiple times (uses IF NOT EXISTS / ON CONFLICT DO NOTHING)

-- ── 1. New columns on the jobs table ─────────────────────────────────────────

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS quoted_amount    numeric       DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS scope_notes      text          DEFAULT '';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS completion_notes text          DEFAULT '';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS completion_photos text[]       DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS dispute_reason   text          DEFAULT '';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS dispute_resolution text        DEFAULT '';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS worker_token     text          UNIQUE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS client_token     text          UNIQUE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS timeline         jsonb         DEFAULT '[]';

-- ── 2. Supabase Storage bucket for completion photos ─────────────────────────
-- Creates a public bucket so workers can upload before/after photos.

INSERT INTO storage.buckets (id, name, public)
VALUES ('job-photos', 'job-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anonymous uploads (workers access via token link, no login)
CREATE POLICY "anon_upload_job_photos"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'job-photos')
  ;

-- Allow public read access
CREATE POLICY "public_read_job_photos"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'job-photos')
  ;

-- ── Done ─────────────────────────────────────────────────────────────────────
-- After running this migration, the following new job statuses are supported:
--   pending → matched → quoted → accepted → completion_requested → completed
--                                                                 ↘ disputed → completed | cancelled
