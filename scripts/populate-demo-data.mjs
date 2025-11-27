// Simple script to populate demo data in Supabase
// Make sure to run the SQL migration first (see SETUP.md)
// Run with: node --env-file=.env.local scripts/populate-demo-data.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Try to load .env.local manually if dotenv is not available
function loadEnvLocal() {
  try {
    const envPath = join(__dirname, '..', '.env.local')
    const envFile = readFileSync(envPath, 'utf-8')
    envFile.split('\n').forEach((line) => {
      const match = line.match(/^([^=:#]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        let value = match[2].trim()
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        if (!process.env[key]) {
          process.env[key] = value
        }
      }
    })
  } catch (error) {
    // .env.local not found or couldn't be read, that's okay
  }
}

loadEnvLocal()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local')
  console.error('Make sure to load environment variables from .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const demoData = [
  {
    email: 'demo@example.com',
    neighborhood: 'King West',
    reflection: `We stopped at the corner.
She sat without being asked.
Watched the light change.
Watched people rush past.
In her stillness, I found mine.
The city moved around us.
We stayed.`,
    title: 'Urban Pause',
    featured: true,
  },
  {
    email: 'demo@example.com',
    neighborhood: 'The Junction',
    reflection: `Sunday mornings are ours.
Coffee in hand, leash in the other.
Same route, different light.
She knows every tree.
I'm learning to notice them too.
Routine becomes ritual when you pay attention.`,
    title: 'Ritual Notes',
    featured: true,
  },
  {
    email: 'demo@example.com',
    neighborhood: 'Liberty Village',
    reflection: `You think you're walking me.
But I'm teaching you to slow down.
To smell the air.
To greet strangers.
To find joy in the smallest things.`,
    title: 'From the Dog',
    featured: true,
  },
  {
    email: 'demo@example.com',
    neighborhood: 'Leslieville',
    reflection: `Every morning, the same routine. But today was different. Today, she stopped at the park entrance and looked back at me. Not pulling, not rushing. Just waiting. And in that moment, I realized she wasn't just waiting for me to catch up. She was asking me to be present. To notice the way the light hits the leaves. To hear the birds. To feel the morning air. Our walks aren't just exercise—they're meditation.`,
    title: 'Morning Meditation',
    featured: false,
  },
  {
    email: 'demo@example.com',
    neighborhood: 'Roncesvalles',
    reflection: `The vet said she needs more exercise. I said we walk twice a day. But walking isn't the same as being. She taught me that. Now we don't just walk—we explore. We pause. We observe. And somehow, in slowing down, we've both found more energy.`,
    title: 'The Pace of Presence',
    featured: false,
  },
  {
    email: 'demo@example.com',
    neighborhood: 'High Park',
    reflection: `She found a stick today. Not just any stick—the perfect stick. The way she carried it, so proud, so careful. It reminded me to find joy in simple things. To carry what matters with care.`,
    title: 'The Perfect Stick',
    featured: false,
  },
  {
    email: 'demo@example.com',
    neighborhood: 'Annex',
    reflection: `We met three other dogs today. Each meeting was a lesson in patience, in reading body language, in respecting boundaries. She's teaching me social skills I didn't know I needed.`,
    title: 'Social Lessons',
    featured: false,
  },
  {
    email: 'demo@example.com',
    neighborhood: 'Beaches',
    reflection: `The lake was calm today. She sat at the edge, watching the water. I sat beside her. We didn't need words. Just presence. Just being together in the moment.`,
    title: 'Lakeside Stillness',
    featured: false,
  },
]

async function main() {
  console.log('Starting demo data population...\n')

  // Check if data already exists
  const { data: existing, error: checkError } = await supabase
    .from('reflections')
    .select('id')
    .limit(1)

  if (checkError) {
    console.error('Error checking existing data:', checkError.message)
    if (checkError.message.includes('column "featured"') || checkError.message.includes('column "title"')) {
      console.error('\n⚠️  Error: The featured and title columns do not exist yet!')
      console.error('Please run the SQL migration first:')
      console.error('1. Go to your Supabase dashboard')
      console.error('2. Navigate to SQL Editor')
      console.error('3. Run the SQL from scripts/02_add_featured_columns.sql')
      console.error('\nOr run these commands:')
      console.error('ALTER TABLE reflections ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;')
      console.error('ALTER TABLE reflections ADD COLUMN IF NOT EXISTS title VARCHAR(255);')
      console.error('CREATE INDEX IF NOT EXISTS idx_reflections_featured ON reflections(featured) WHERE featured = TRUE;')
    }
    process.exit(1)
  }

  if (existing && existing.length > 0) {
    console.log('⚠️  Reflections table already contains data.')
    console.log('Clearing existing data and repopulating...\n')
    
    // Delete all existing entries
    const { error: deleteError } = await supabase
      .from('reflections')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    if (deleteError) {
      console.error('Error clearing existing data:', deleteError.message)
      console.log('Please manually clear the table in Supabase dashboard and try again.')
      process.exit(1)
    }
    
    console.log('✓ Cleared existing data\n')
  }

  console.log('Inserting demo data...')
  const { data, error } = await supabase.from('reflections').insert(demoData).select()

  if (error) {
    console.error('Error populating data:', error.message)
    if (error.message.includes('column "featured"') || error.message.includes('column "title"')) {
      console.error('\n⚠️  Error: The featured and title columns do not exist yet!')
      console.error('Please run the SQL migration first (see instructions above).')
    }
    process.exit(1)
  }

  console.log(`\n✓ Successfully inserted ${data.length} demo entries`)
  console.log(`  - ${data.filter((d) => d.featured).length} featured entries`)
  console.log(`  - ${data.filter((d) => !d.featured).length} regular entries`)
  console.log('\n✓ Demo data population complete!')
  console.log('\nYou can now view the featured entries on your homepage!')
}

main().catch(console.error)

