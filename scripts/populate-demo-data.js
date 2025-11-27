// Script to populate demo data in Supabase
// Run with: node scripts/populate-demo-data.js

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('Running migration: Adding featured and title columns...')
  
  const migrationSQL = readFileSync(join(__dirname, '02_add_featured_columns.sql'), 'utf-8')
  
  const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
  
  if (error) {
    // Try direct SQL execution via REST API
    console.log('Trying alternative migration method...')
    const { data, error: migrationError } = await supabase
      .from('reflections')
      .select('featured, title')
      .limit(1)
    
    if (migrationError && migrationError.message.includes('column')) {
      console.log('Columns do not exist. Please run the SQL migration manually in Supabase SQL Editor:')
      console.log('\n' + migrationSQL + '\n')
      console.log('Or execute these commands:')
      console.log('ALTER TABLE reflections ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;')
      console.log('ALTER TABLE reflections ADD COLUMN IF NOT EXISTS title VARCHAR(255);')
      console.log('CREATE INDEX IF NOT EXISTS idx_reflections_featured ON reflections(featured) WHERE featured = TRUE;')
      return false
    }
  }
  
  console.log('✓ Migration completed')
  return true
}

async function populateData() {
  console.log('Populating demo data...')
  
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
      featured: true,
    },
    {
      email: 'demo@example.com',
      neighborhood: 'Roncesvalles',
      reflection: `The vet said she needs more exercise. I said we walk twice a day. But walking isn't the same as being. She taught me that. Now we don't just walk—we explore. We pause. We observe. And somehow, in slowing down, we've both found more energy.`,
      title: 'The Pace of Presence',
      featured: true,
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

  const { data, error } = await supabase
    .from('reflections')
    .insert(demoData)
    .select()

  if (error) {
    console.error('Error populating data:', error)
    return false
  }

  console.log(`✓ Successfully inserted ${data.length} demo entries`)
  console.log(`  - ${data.filter(d => d.featured).length} featured entries`)
  console.log(`  - ${data.filter(d => !d.featured).length} regular entries`)
  return true
}

async function main() {
  console.log('Starting demo data population...\n')
  
  // Check if data already exists
  const { data: existing } = await supabase
    .from('reflections')
    .select('id')
    .limit(1)

  if (existing && existing.length > 0) {
    console.log('⚠ Reflections table already contains data.')
    console.log('To repopulate, please clear the table first or run this script after clearing.')
    return
  }

  await runMigration()
  await populateData()
  
  console.log('\n✓ Demo data population complete!')
}

main().catch(console.error)

