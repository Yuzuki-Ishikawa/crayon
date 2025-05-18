-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    line_user_id TEXT UNIQUE,
    delivery_freq TEXT CHECK (delivery_freq IN ('none', 'daily', 'weekly')) DEFAULT 'none',
    delivery_time TIME DEFAULT '09:00',
    next_scheduled_at TIMESTAMPTZ,
    time_zone TEXT DEFAULT 'Asia/Tokyo',
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create copy_entries table
CREATE TABLE copy_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    headline TEXT NOT NULL,
    problem_body TEXT,
    copy_text TEXT NOT NULL,
    key_visual_url TEXT,
    explanation TEXT,
    source TEXT,
    author_name TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    status TEXT CHECK (status IN ('draft', 'scheduled', 'published')) DEFAULT 'draft',
    publish_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create staging_copies table for content review
CREATE TABLE staging_copies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raw_url TEXT,
    headline TEXT,
    problem_body TEXT,
    copy_text TEXT,
    key_visual_url TEXT,
    explanation TEXT,
    source TEXT,
    author_name TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'error')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE copy_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE staging_copies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Public copy entries are viewable by everyone"
    ON copy_entries FOR SELECT
    USING (status = 'published');

CREATE POLICY "Admin can manage copy entries"
    ON copy_entries FOR ALL
    USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

CREATE POLICY "Admin can manage staging copies"
    ON staging_copies FOR ALL
    USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_copy_entries_updated_at
    BEFORE UPDATE ON copy_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 