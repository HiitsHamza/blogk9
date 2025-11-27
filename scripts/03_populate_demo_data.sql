-- Populate demo reflections with featured entries
INSERT INTO reflections (email, neighborhood, reflection, title, featured, created_at) VALUES
(
  'demo@example.com',
  'King West',
  'We stopped at the corner.
She sat without being asked.
Watched the light change.
Watched people rush past.
In her stillness, I found mine.
The city moved around us.
We stayed.',
  'Urban Pause',
  TRUE,
  NOW() - INTERVAL '3 days'
),
(
  'demo@example.com',
  'The Junction',
  'Sunday mornings are ours.
Coffee in hand, leash in the other.
Same route, different light.
She knows every tree.
I''m learning to notice them too.
Routine becomes ritual when you pay attention.',
  'Ritual Notes',
  TRUE,
  NOW() - INTERVAL '2 days'
),
(
  'demo@example.com',
  'Liberty Village',
  'You think you''re walking me.
But I''m teaching you to slow down.
To smell the air.
To greet strangers.
To find joy in the smallest things.',
  'From the Dog',
  TRUE,
  NOW() - INTERVAL '1 day'
),
(
  'demo@example.com',
  'Leslieville',
  'Every morning, the same routine. But today was different. Today, she stopped at the park entrance and looked back at me. Not pulling, not rushing. Just waiting. And in that moment, I realized she wasn''t just waiting for me to catch up. She was asking me to be present. To notice the way the light hits the leaves. To hear the birds. To feel the morning air. Our walks aren''t just exercise—they''re meditation.',
  'Morning Meditation',
  TRUE,
  NOW() - INTERVAL '5 days'
),
(
  'demo@example.com',
  'Roncesvalles',
  'The vet said she needs more exercise. I said we walk twice a day. But walking isn''t the same as being. She taught me that. Now we don''t just walk—we explore. We pause. We observe. And somehow, in slowing down, we''ve both found more energy.',
  'The Pace of Presence',
  TRUE,
  NOW() - INTERVAL '4 days'
),
(
  'demo@example.com',
  'High Park',
  'She found a stick today. Not just any stick—the perfect stick. The way she carried it, so proud, so careful. It reminded me to find joy in simple things. To carry what matters with care.',
  'The Perfect Stick',
  FALSE,
  NOW() - INTERVAL '6 days'
),
(
  'demo@example.com',
  'Annex',
  'We met three other dogs today. Each meeting was a lesson in patience, in reading body language, in respecting boundaries. She''s teaching me social skills I didn''t know I needed.',
  'Social Lessons',
  FALSE,
  NOW() - INTERVAL '7 days'
),
(
  'demo@example.com',
  'Beaches',
  'The lake was calm today. She sat at the edge, watching the water. I sat beside her. We didn''t need words. Just presence. Just being together in the moment.',
  'Lakeside Stillness',
  FALSE,
  NOW() - INTERVAL '8 days'
);

