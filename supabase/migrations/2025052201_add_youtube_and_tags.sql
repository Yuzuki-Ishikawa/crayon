alter table copy_entries add column if not exists youtube_url text;
alter table copy_entries add column if not exists industry_tags text[];
alter table copy_entries add column if not exists category_tags text[];