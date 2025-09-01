const { createClient } = require('@supabase/supabase-js');
const { initialWebPortalItems } = require('../src/data/webPortalsData.ts');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateWebPortals() {
  try {
    console.log('Starting web portals migration...');
    
    // Transform data for Supabase
    const transformedData = initialWebPortalItems.map(item => ({
      id: item.id.toString(),
      title: item.title,
      client: item.client,
      description: item.description,
      image: item.image,
      project_url: item.projectUrl || null
    }));

    console.log(`Migrating ${transformedData.length} web portal items...`);

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('web_portals')
      .insert(transformedData);

    if (error) {
      throw error;
    }

    console.log('✅ Web portals migration completed successfully!');
    console.log(`Migrated items:`, transformedData.map(item => `- ${item.title} (${item.client})`).join('\n'));
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateWebPortals();
