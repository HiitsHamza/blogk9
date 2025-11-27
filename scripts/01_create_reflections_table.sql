-- Create reflections table for storing dog wellness reflections
CREATE TABLE IF NOT EXISTS reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  neighborhood VARCHAR(255) NOT NULL,
  reflection TEXT NOT NULL,
  photo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create an index on neighborhood for faster filtering
CREATE INDEX IF NOT EXISTS idx_reflections_neighborhood ON reflections(neighborhood);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_reflections_created_at ON reflections(created_at DESC);
