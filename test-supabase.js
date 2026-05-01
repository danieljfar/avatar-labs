require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
console.log(url, key);

const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase
    .from('content_pieces')
    .insert([{ title: 'Test', video_url: 'http://test.com', status: 'Pending' }])
    .select('id')
    .single();
  console.log('Result:', data, error);
}
test();
