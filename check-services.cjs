require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
    const { data, error } = await supabase.from('services_data').select('*');
    if (error) {
        console.error('Error fetching:', error);
        return;
    }
    console.log(JSON.stringify(data, null, 2));
}
check();
