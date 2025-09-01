-- Drop table if exists (for clean reinstall)
DROP TABLE IF EXISTS team_members CASCADE;

-- Create team_members table
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(200) NOT NULL,
  image VARCHAR(500) NOT NULL,
  bio TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Allow public access" ON team_members FOR ALL USING (true);

-- Insert existing team members data
INSERT INTO team_members (name, position, image, bio, display_order) VALUES
('Turgay', 'Founder & Sales', '/images/persons/01.jpg', 'With over 15 years of experience in digital marketing and creative direction, Turgay leads our team with vision and innovation.', 1),
('Özkal', 'Founder & Software / Artificial Intelligence', '/images/persons/02.jpg', 'Özkal is our software and artificial intelligence expert, with deep knowledge in software and artificial intelligence digital marketing strategies.', 2),
('Turgut', 'Founder & Operation', '/images/persons/03.jpg', 'Turgut brings operational excellence to every project, with expertise in business management and strategic planning.', 3),
('Mithat', 'Founder & Administrative', '/images/persons/04.jpg', 'Mithat is our administrative director, with deep knowledge in digital marketing strategies, with expertise in SEO, content marketing, and social media campaigns.', 4),
('Yusuf', 'Performance Marketing', '/images/persons/05.jpg', 'Yusuf is our marketing expert, with deep knowledge in performance marketing, analytics, and digital advertising strategies.', 5),
('Emre', 'Rich Media & Interactive Masthead', '/images/persons/06.jpg', 'Emre is our rich media and interactive masthead expert, with deep knowledge in rich media and interactive masthead digital marketing strategies.', 6),
('Ceylin', 'Branding', '/images/persons/07.jpg', 'Ceylin is our branding expert, with deep knowledge in digital marketing strategies, with expertise in SEO, content marketing, and social media campaigns.', 7);
