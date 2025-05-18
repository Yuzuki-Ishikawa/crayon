-- supabase/migrations/0003_adjust_text_fields.sql

-- Remove the potentially conflicting/redundant 'description' column added in 0002
ALTER TABLE public.copy_entries
DROP COLUMN IF EXISTS description;

-- Ensure problem_body and explanation columns (from 0001_init.sql) are suitable.
-- If they were altered or dropped by mistake in a previous manual step or unapplied migration,
-- this would be the place to re-add or ensure their existence.
-- For now, we assume 0001_init.sql correctly defined them and they still exist.

-- Rename author_name from 0001 to copywriter from 0002 for consistency if they serve the same purpose
-- Check if author_name exists and copywriter doesn't, then rename.
-- This is a bit speculative, adjust based on actual current schema vs. intended schema from generate_copy
DO $$
BEGIN
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='copy_entries' AND column_name='author_name')
    AND NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='copy_entries' AND column_name='copywriter') THEN
        ALTER TABLE public.copy_entries RENAME COLUMN author_name TO copywriter;
    END IF;
END $$;

-- Ensure key_visual_url (single text from 0001) vs key_visual_urls (text array from 0002)
-- If generate_copy provides an array (keyVisuals), then key_visual_urls TEXT[] is preferred.
-- If key_visual_url TEXT exists and key_visual_urls TEXT[] does not, consider altering or dropping/re-adding.
DO $$
BEGIN
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='copy_entries' AND column_name='key_visual_url')
    AND NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='copy_entries' AND column_name='key_visual_urls') THEN
        -- Option 1: Drop the single URL column if the array one is intended and will be added by 0002.
        -- ALTER TABLE public.copy_entries DROP COLUMN key_visual_url;
        -- Option 2: Rename it if it was meant to be the array and 0002 didn't run/create it properly.
        -- For now, let's assume 0002 correctly added key_visual_urls TEXT[] and we might have a redundant key_visual_url TEXT.
        -- If generate_copy provides a single string, we might map it to the first element of key_visual_urls or keep key_visual_url.
        -- Given generate_copy output format has "keyVisuals": string[], the array column is better.
        NULL; -- No action for now, will rely on key_visual_urls from 0002.
    END IF;
END $$;

-- Add a column for the raw copy text itself, as per generate_copy output 'copy'.
-- 0001 had copy_text TEXT NOT NULL. We assume this is still valid.

-- Note on tags: 0001 had tags JSONB. 0002 had tags TEXT[].
-- generate_copy produces "tags": string[]. So TEXT[] is more direct.
-- If JSONB exists and TEXT[] doesn't, we might need to alter it.
DO $$
BEGIN
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='copy_entries' AND column_name='tags' AND data_type='jsonb')
    AND NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='copy_entries' AND column_name='tags' AND data_type='ARRAY') THEN
        ALTER TABLE public.copy_entries DROP COLUMN tags;
        ALTER TABLE public.copy_entries ADD COLUMN tags TEXT[];
    END IF;
END $$;


-- If scheduled_at was used in admin UI and publish_at by functions, consolidate to one, e.g., publish_at.
-- Assuming `publish_at` is the intended column for when the copy goes live.
DO $$
BEGIN
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='copy_entries' AND column_name='scheduled_at')
    AND NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='copy_entries' AND column_name='publish_at') THEN
        ALTER TABLE public.copy_entries RENAME COLUMN scheduled_at TO publish_at;
    END IF;
END $$;


-- Final check on required columns based on the latest generate_copy prompt format:
-- { "headline": string, "problem": string, "copy": string, "keyVisuals": string[], "explanation": string, "source": string, "author": string, "tags": string[] }
-- Mapped to copy_entries table:
-- headline -> headline TEXT (0001/0002)
-- problem -> problem_body TEXT (0001)
-- copy -> copy_text TEXT (0001)
-- keyVisuals -> key_visual_urls TEXT[] (0002)
-- explanation -> explanation TEXT (0001)
-- source -> source TEXT (0001/0002)
-- author -> copywriter TEXT (0002, renamed from author_name of 0001)
-- tags -> tags TEXT[] (0002, or altered from JSONB of 0001)

-- Columns that should exist based on this logic:
-- id UUID
-- headline TEXT
-- problem_body TEXT
-- copy_text TEXT
-- key_visual_urls TEXT[] (Array of URLs)
-- explanation TEXT
-- source TEXT
-- copywriter TEXT
-- tags TEXT[] (Array of strings)
-- status TEXT (draft, scheduled, published)
-- publish_at TIMESTAMPTZ
-- created_at TIMESTAMPTZ
-- updated_at TIMESTAMPTZ
-- advertiser TEXT (from 0002, not in generate_copy output, can be nullable)
-- awards TEXT (from 0002, not in generate_copy output, can be nullable)
-- year_created INTEGER (from 0002, not in generate_copy output, can be nullable)

-- Drop columns that are definitely redundant after reconciling 0001, 0002, and generate_copy prompt:
ALTER TABLE public.copy_entries
DROP COLUMN IF EXISTS key_visual_url, -- if key_visual_urls (array) is the source of truth
DROP COLUMN IF EXISTS author_name;    -- if renamed to copywriter or copywriter (from 0002) is used 