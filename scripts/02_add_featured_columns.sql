-- Add featured and title columns to reflections table
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS title VARCHAR(255);

-- Create an index on featured for faster filtering
CREATE INDEX IF NOT EXISTS idx_reflections_featured ON reflections(featured) WHERE featured = TRUE;

