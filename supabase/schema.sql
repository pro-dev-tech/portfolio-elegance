-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Anyone can delete posts" ON posts FOR DELETE USING (true);

-- Reactions table
CREATE TABLE IF NOT EXISTS post_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  visitor_id text NOT NULL,
  emoji text NOT NULL,
  UNIQUE(post_id, visitor_id, emoji)
);
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read reactions" ON post_reactions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reactions" ON post_reactions FOR INSERT WITH CHECK (true);

-- Visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id text PRIMARY KEY,
  session_id text,
  user_agent text,
  first_visit timestamptz,
  last_visit timestamptz
);
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert visitors" ON visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update visitors" ON visitors FOR UPDATE USING (true) WITH CHECK (true);

-- Owner auth table
CREATE TABLE IF NOT EXISTS owner_auth (
  id int PRIMARY KEY,
  password text NOT NULL
);
ALTER TABLE owner_auth ENABLE ROW LEVEL SECURITY;

-- Insert password (trim whitespace!)
INSERT INTO owner_auth (id, password) VALUES (1, 'my-poRt@7_') ON CONFLICT (id) DO UPDATE SET password = 'my-poRt@7_';
