-- Reference: Run this in your Supabase SQL Editor if not already done

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Service role insert posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role delete posts" ON posts FOR DELETE USING (true);

-- Post reactions
CREATE TABLE IF NOT EXISTS post_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  visitor_id uuid NOT NULL,
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, visitor_id, emoji)
);
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reactions" ON post_reactions FOR SELECT USING (true);
CREATE POLICY "Public insert reactions" ON post_reactions FOR INSERT WITH CHECK (true);

-- Visitors
CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY,
  session_id text,
  user_agent text,
  first_visit timestamptz,
  last_visit timestamptz
);
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert visitors" ON visitors FOR INSERT WITH CHECK (true);

-- Owner auth (plain text password for single admin)
CREATE TABLE IF NOT EXISTS owner_auth (
  id int PRIMARY KEY,
  password text NOT NULL
);
ALTER TABLE owner_auth ENABLE ROW LEVEL SECURITY;
-- No public read policy — only accessible via service role in edge function
