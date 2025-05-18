-- supabase/migrations/0002_update_copy_entries.sql

-- Add new columns to copy_entries table
ALTER TABLE public.copy_entries
ADD COLUMN IF NOT EXISTS headline TEXT, -- 問題用の見出し
ADD COLUMN IF NOT EXISTS tags TEXT[], -- 業種（複数可）
ADD COLUMN IF NOT EXISTS advertiser TEXT, -- 広告主
ADD COLUMN IF NOT EXISTS awards TEXT, -- 受賞歴
ADD COLUMN IF NOT EXISTS copywriter TEXT, -- コピーライター
ADD COLUMN IF NOT EXISTS year_created INTEGER, -- つくられた年度
ADD COLUMN IF NOT EXISTS description TEXT, -- 説明 (問題タブの「文章」と解説タブの「解説」に使う想定)
ADD COLUMN IF NOT EXISTS source TEXT, -- 出典
ADD COLUMN IF NOT EXISTS key_visual_urls TEXT[]; -- キービジュアル画像のURL（最大5枚）

-- Update RLS policies if necessary (optional, depending on access needs)
-- Example: Allow authenticated users to read the new columns
-- DROP POLICY IF EXISTS "Allow authenticated read access" ON public.copy_entries;
-- CREATE POLICY "Allow authenticated read access" ON public.copy_entries
-- FOR SELECT USING (auth.role() = 'authenticated');

-- Example: Allow specific roles (e.g., admin) to insert/update/delete
-- DROP POLICY IF EXISTS "Allow admin full access" ON public.copy_entries;
-- CREATE POLICY "Allow admin full access" ON public.copy_entries
-- FOR ALL USING (public.is_admin(auth.uid())); -- Assuming is_admin function exists

-- Comment out or adjust policies based on your actual requirements.
-- The existing policies might already cover these columns if they grant access to the whole table.
-- It's good practice to review policies after schema changes.

-- Also, ensure the content column is suitable for the "Copy" text in the explanation tab.
-- If it was intended for something else, you might need another column.
-- Assuming 'content' holds the main copy text for the explanation tab.

-- Note: Consider adding constraints if needed, e.g., check constraint on array length for key_visual_urls
-- ALTER TABLE public.copy_entries
-- ADD CONSTRAINT check_key_visual_urls_length CHECK (array_length(key_visual_urls, 1) <= 5); 