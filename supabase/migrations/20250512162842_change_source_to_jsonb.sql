ALTER TABLE public.copy_entries
ALTER COLUMN source TYPE JSONB USING source::jsonb;