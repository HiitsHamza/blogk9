# Setup Instructions for Featured Posts

## Step 1: Run Database Migration

You need to add the `featured` and `title` columns to your `reflections` table.

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Copy and paste the following SQL:

```sql
-- Add featured and title columns to reflections table
ALTER TABLE reflections 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS title VARCHAR(255);

-- Create an index on featured for faster filtering
CREATE INDEX IF NOT EXISTS idx_reflections_featured ON reflections(featured) WHERE featured = TRUE;
```

5. Click **Run** to execute the migration

### Option B: Using SQL File

The SQL is also available in `scripts/02_add_featured_columns.sql`

## Step 2: Populate Demo Data

After running the migration, populate the database with demo content:

```bash
# The script will automatically load .env.local
# Run with Node 20.6+ (recommended):
node --env-file=.env.local scripts/populate-demo-data-simple.js

# Or if you have an older Node version, install dotenv first:
npm install dotenv
node -r dotenv/config scripts/populate-demo-data-simple.js dotenv_config_path=.env.local

# Or the script will try to read .env.local directly (fallback):
node scripts/populate-demo-data-simple.js
```

**Note:** The script will check if data already exists and won't overwrite it. If you want to repopulate, clear the table first in Supabase dashboard.

## Step 3: Verify

1. Start your dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. Scroll to the "This week's featured lines" section
4. You should see featured entries loaded from your Supabase database

## What Changed?

- ✅ Added `featured` boolean column to mark featured posts
- ✅ Added `title` column for entry titles
- ✅ Updated API route to support `?featured=true` filter
- ✅ Updated `FeaturedEntries` component to fetch from backend
- ✅ Created demo data similar to the original featured entries

## Making Posts Featured

To mark a post as featured, update it in Supabase:
1. Go to Table Editor → `reflections`
2. Find the post you want to feature
3. Set `featured` to `true`
4. Optionally add a `title`

The featured posts will automatically appear in the "This week's featured lines" section on your homepage!

